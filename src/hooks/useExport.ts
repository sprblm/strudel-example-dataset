import { useCallback } from 'react';

type ExportScale = number;

export interface ExportOptions {
  filename: string;
  backgroundColor?: string;
  scale?: ExportScale;
}

const DEFAULT_SCALE: ExportScale = 2;
const DEFAULT_BACKGROUND = '#ffffff';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const TITLE_PADDING = 48;
const TITLE_COLOR = '#1f2937';

const getFigureTitle = (element: HTMLElement): string | null => {
  const caption = element.querySelector('figcaption');
  if (!caption) {
    return null;
  }

  const text = caption.textContent?.trim();
  return text && text.length > 0 ? text : null;
};

const appendTitleToSvg = (
  svg: SVGSVGElement,
  width: number,
  height: number,
  title: string
): number => {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return height;
  }

  const existingChildren = Array.from(svg.childNodes);
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const titleNode = svg.ownerDocument.createElementNS(SVG_NAMESPACE, 'text');
  titleNode.textContent = normalizedTitle;
  titleNode.setAttribute('x', (width / 2).toString());
  titleNode.setAttribute('y', (TITLE_PADDING / 1.6).toString());
  titleNode.setAttribute('text-anchor', 'middle');
  titleNode.setAttribute('font-size', '20');
  titleNode.setAttribute('font-weight', '600');
  titleNode.setAttribute('fill', TITLE_COLOR);
  titleNode.setAttribute('dominant-baseline', 'middle');

  const groupNode = svg.ownerDocument.createElementNS(SVG_NAMESPACE, 'g');
  groupNode.setAttribute('transform', `translate(0, ${TITLE_PADDING})`);
  existingChildren.forEach((child) => {
    groupNode.appendChild(child);
  });

  const adjustedHeight = height + TITLE_PADDING;
  svg.appendChild(titleNode);
  svg.appendChild(groupNode);
  svg.setAttribute('height', adjustedHeight.toString());

  if (svg.hasAttribute('viewBox')) {
    const viewBox = svg
      .getAttribute('viewBox')!
      .split(/[ ,]+/)
      .map((segment) => Number(segment));
    if (viewBox.length === 4) {
      viewBox[3] += TITLE_PADDING;
      svg.setAttribute('viewBox', viewBox.join(' '));
    }
  } else {
    svg.setAttribute('viewBox', `0 0 ${width} ${adjustedHeight}`);
  }

  return adjustedHeight;
};

const createObjectUrl = (blob: Blob) => URL.createObjectURL(blob);
const revokeObjectUrl = (url: string) => URL.revokeObjectURL(url);

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

const getSvgDimensions = (svg: SVGSVGElement) => {
  const rect = svg.getBoundingClientRect();
  if (rect.width && rect.height) {
    return { width: rect.width, height: rect.height };
  }

  const widthAttr = svg.getAttribute('width');
  const heightAttr = svg.getAttribute('height');
  if (widthAttr && heightAttr) {
    return { width: parseFloat(widthAttr), height: parseFloat(heightAttr) };
  }

  const { width, height } = svg.viewBox.baseVal;
  if (width && height) {
    return { width, height };
  }

  throw new Error('Unable to determine SVG dimensions for export.');
};

export const useExport = () => {
  const exportToPNG = useCallback(
    async (element: HTMLElement, options: ExportOptions) => {
      if (!element) {
        throw new Error('Export element is not available.');
      }

      const svgElement = element.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found for export.');
      }

      const { width, height } = getSvgDimensions(svgElement);
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      const figureTitle = getFigureTitle(element);
      const exportHeight = figureTitle
        ? appendTitleToSvg(clonedSvg, width, height, figureTitle)
        : height;
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const svgBlob = new Blob(
        [`<?xml version="1.0" encoding="UTF-8"?>${svgString}`],
        { type: 'image/svg+xml;charset=utf-8' }
      );
      const svgUrl = createObjectUrl(svgBlob);

      try {
        const image = await loadImage(svgUrl);
        const canvas = document.createElement('canvas');
        const scale = options.scale ?? DEFAULT_SCALE;
        canvas.width = width * scale;
        canvas.height = exportHeight * scale;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Unable to acquire canvas context for export.');
        }

        context.fillStyle = options.backgroundColor ?? DEFAULT_BACKGROUND;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.scale(scale, scale);
        context.drawImage(image, 0, 0, width, exportHeight);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate PNG blob.'));
            }
          }, 'image/png');
        });

        const downloadUrl = createObjectUrl(pngBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = options.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        revokeObjectUrl(downloadUrl);
      } finally {
        revokeObjectUrl(svgUrl);
      }
    },
    []
  );

  return { exportToPNG };
};

export type UseExportHook = ReturnType<typeof useExport>;
