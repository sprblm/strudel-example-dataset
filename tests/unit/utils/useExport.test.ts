import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useExport } from '@/hooks/useExport';

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
let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
let getContextMock: ReturnType<typeof vi.fn>;
let toBlobMock: ReturnType<typeof vi.fn>;
let clickSpy: ReturnType<typeof vi.spyOn>;

  class ImageMock {
    onload: (() => void) | null = null;

    onerror: (() => void) | null = null;

    set src(_: string) {
      setTimeout(() => this.onload && this.onload());
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    ensureObjectUrl();
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => 'blob:mock-url');
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    getContextMock = vi.fn(() => ({
      fillStyle: '#ffffff',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
      scale: vi.fn(),
    }));
    toBlobMock = vi.fn((callback: BlobCallback) => {
      callback(new Blob(['mock'], { type: 'image/png' }));
    });
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    Object.defineProperty(window, 'Image', {
      writable: true,
      value: ImageMock,
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      getContextMock
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      toBlobMock as never
    );
  });

  it('exports an SVG chart to PNG', async () => {
    const { result } = renderHook(() => useExport());

    const container = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '150');
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ width: 200, height: 150 }),
    });
    container.appendChild(svg);

    await expect(
      result.current.exportToPNG(container, {
        filename: 'test.png',
      })
    ).resolves.toBeUndefined();

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(toBlobMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });

  it('throws if SVG is missing', async () => {
    const { result } = renderHook(() => useExport());
    const container = document.createElement('div');

    await expect(
      result.current.exportToPNG(container, { filename: 'test.png' })
    ).rejects.toThrow('No SVG element found for export.');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
