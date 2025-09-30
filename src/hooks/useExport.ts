import { useCallback, useState } from 'react';

export interface ExportOptions {
  filename?: string;
  title?: string;
  chartType?: string;
  scale?: number;
  backgroundColor?: string;
}

interface BuildFilenameOptions {
  chartType: string;
  date?: Date;
}

interface UseExportResult {
  exporting: boolean;
  exportToPNG: (
    container: HTMLElement,
    options?: ExportOptions
  ) => Promise<void>;
  buildFilename: (options: BuildFilenameOptions) => string;
}

const DEFAULT_SCALE = 2;
const TITLE_OFFSET = 48;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-CA', DATE_FORMAT_OPTIONS);
  return formatter.format(date);
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ensureSvgNamespace = (svg: SVGSVGElement) => {
  if (!svg.getAttribute('xmlns')) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!svg.getAttribute('xmlns:xlink')) {
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }
};

const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = (event) => reject(event);
    image.src = url;
  });
};

const coerceSize = (value: number | null | undefined, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  return fallback;
};

export const useExport = (): UseExportResult => {
  const [exporting, setExporting] = useState(false);

  const buildFilename = useCallback(
    ({ chartType, date }: BuildFilenameOptions) => {
      const safeChart = slugify(chartType || 'chart');
      const formattedDate = formatDate(date ?? new Date());
      return `${safeChart}-${formattedDate}.png`;
    },
    []
  );

  const exportToPNG = useCallback(
    async (container: HTMLElement, options?: ExportOptions) => {
      if (!container) {
        throw new Error('No container provided for export.');
      }

      const svg = container.querySelector('svg');
      if (!svg) {
        throw new Error('No SVG element found for export.');
      }

      const svgClone = svg.cloneNode(true) as SVGSVGElement;
      ensureSvgNamespace(svgClone);

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);
      const svgBlob = new Blob(
        [`<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`],
        {
          type: 'image/svg+xml;charset=utf-8',
        }
      );
      const svgUrl = URL.createObjectURL(svgBlob);

      setExporting(true);

      try {
        const image = await loadImage(svgUrl);
        const rect = svg.getBoundingClientRect();
        const attrWidth = Number(svg.getAttribute('width'));
        const attrHeight = Number(svg.getAttribute('height'));
        const width = coerceSize(
          rect.width || attrWidth || image.width,
          DEFAULT_WIDTH
        );
        const height = coerceSize(
          rect.height || attrHeight || image.height,
          DEFAULT_HEIGHT
        );
        const scale = options?.scale ?? DEFAULT_SCALE;
        const titleOffset = options?.title ? TITLE_OFFSET : 0;

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(Math.round(width * scale), scale);
        canvas.height = Math.max(
          Math.round((height + titleOffset) * scale),
          scale
        );

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Canvas context is not available for export.');
        }

        context.fillStyle = options?.backgroundColor ?? '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (options?.title) {
          context.fillStyle = '#1f2933';
          context.font = `600 ${20 * scale}px "Inter", "Helvetica Neue", Arial, sans-serif`;
          context.textAlign = 'center';
          context.textBaseline = 'top';
          context.fillText(options.title, canvas.width / 2, 16 * scale);
        }

        context.drawImage(
          image,
          0,
          titleOffset * scale,
          width * scale,
          height * scale
        );

        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob((generatedBlob) => {
            if (generatedBlob) {
              resolve(generatedBlob);
            } else {
              reject(new Error('Failed to generate PNG blob.'));
            }
          });
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download =
          options?.filename ??
          buildFilename({ chartType: options?.chartType ?? 'chart' });
        link.rel = 'noopener';
        link.click();
        URL.revokeObjectURL(url);
      } finally {
        setExporting(false);
        URL.revokeObjectURL(svgUrl);
      }
    },
    [buildFilename]
  );

  return {
    exporting,
    exportToPNG,
    buildFilename,
  };
};

export default useExport;
