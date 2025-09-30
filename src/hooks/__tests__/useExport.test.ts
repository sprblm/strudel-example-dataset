import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useExport } from '../useExport';

const TITLE_PADDING = 48;

const ensureObjectUrl = () => {
  if (typeof URL.createObjectURL !== 'function') {
    Object.defineProperty(URL, 'createObjectURL', {
      value: () => '',
      writable: true,
      configurable: true,
    });
  }

  if (typeof URL.revokeObjectURL !== 'function') {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: () => undefined,
      writable: true,
      configurable: true,
    });
  }
};

describe('useExport', () => {
  const contextMock = {
    fillStyle: '#fff',
    fillRect: vi.fn(),
    scale: vi.fn(),
    drawImage: vi.fn(),
  } as const;

  let canvasMock: HTMLCanvasElement;
  let anchorClickSpy: ReturnType<typeof vi.fn>;
  let originalCreateElement: typeof document.createElement;
  let originalImage: typeof Image;

  beforeEach(() => {
    ensureObjectUrl();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

    anchorClickSpy = vi.fn();

    canvasMock = document.createElement('canvas');
    Object.defineProperty(canvasMock, 'getContext', {
      value: vi.fn(() => contextMock),
    });
    Object.defineProperty(canvasMock, 'toBlob', {
      value: (callback: BlobCallback) => {
        callback(new Blob(['mock'], { type: 'image/png' }));
      },
    });

    originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        if (tagName === 'canvas') {
          return canvasMock;
        }

        if (tagName === 'a') {
          const anchor = originalCreateElement(tagName) as HTMLAnchorElement;
          anchorClickSpy = vi.fn();
          anchor.click = anchorClickSpy;
          return anchor;
        }

        return originalCreateElement(tagName);
      }
    );

    class MockImage {
      onload: (() => void) | null = null;

      onerror: ((error: ErrorEvent) => void) | null = null;

      set src(_value: string) {
        setTimeout(() => {
          this.onload?.();
        }, 0);
      }
    }

    originalImage = global.Image;
    // @ts-expect-error - allow custom image mock for tests
    global.Image = MockImage;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.Image = originalImage;
  });

  it('exports chart svg to PNG including title text', async () => {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = 'Histogram: Body Mass (10 bins)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    figure.appendChild(caption);
    figure.appendChild(svg);

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.exportToPNG(figure, {
        filename: 'penguins-histogram.png',
        scale: 2,
      });
    });

    expect(canvasMock.width).toBe(800);
    expect(canvasMock.height).toBe((300 + TITLE_PADDING) * 2);
    expect(contextMock.drawImage).toHaveBeenCalledWith(
      expect.any(Image),
      0,
      0,
      400,
      300 + TITLE_PADDING
    );
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('throws an error when no SVG element is present', async () => {
    const container = document.createElement('div');
    const { result } = renderHook(() => useExport());

    await expect(
      result.current.exportToPNG(container, {
        filename: 'missing-svg.png',
      })
    ).rejects.toThrow('No SVG element found for export.');
  });
});
