import type { FormatAspectRatio } from '@/features/creative/types/formatAspectRatioType';

const HEX = '0123456789ABCDEF';

const toHex = (value: number): string => {
  const normalized = Math.max(0, Math.min(255, value));
  const high = Math.floor(normalized / 16);
  const low = normalized % 16;
  return `${HEX[high]}${HEX[low]}`;
};

const rgbToHex = (r: number, g: number, b: number): string => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

const quantize = (value: number): number => {
  const bucket = Math.round(value / 32) * 32;
  return Math.max(0, Math.min(255, bucket));
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load source image'));
    image.src = src;
  });

const drawCoverImage = (context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number): void => {
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else if (sourceRatio < targetRatio) {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
};

const drawTextOverlay = (
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number
): void => {
  const fontSize = Math.max(36, Math.floor(height * 0.05));
  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'bottom';

  const maxTextWidth = width * 0.8;
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width <= maxTextWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  const lineHeight = fontSize * 1.25;
  const totalHeight = lines.length * lineHeight;
  const bottomPadding = Math.max(40, Math.floor(height * 0.06));
  const startY = height - bottomPadding - totalHeight + lineHeight;

  const paddingX = 20;
  const backdropWidth = maxTextWidth + paddingX * 2;
  const backdropHeight = totalHeight + 24;
  const backdropX = (width - backdropWidth) / 2;
  const backdropY = startY - lineHeight + 8;

  context.fillStyle = 'rgba(0, 0, 0, 0.45)';
  context.fillRect(backdropX, backdropY, backdropWidth, backdropHeight);

  context.fillStyle = '#FFFFFF';
  context.shadowColor = 'rgba(0, 0, 0, 0.85)';
  context.shadowBlur = 8;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + index * lineHeight);
  });
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
};

const canvasToPngDataUrl = (canvas: HTMLCanvasElement): string => canvas.toDataURL('image/png');

export const dataUrlToBase64 = (dataUrl: string): string => {
  const marker = 'base64,';
  const markerIndex = dataUrl.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error('Invalid data URL format');
  }
  return dataUrl.slice(markerIndex + marker.length);
};

export const buildCreativeVariant = async (
  sourceImageUrl: string,
  format: FormatAspectRatio,
  campaignMessage: string
): Promise<{ outputUrl: string; contentBase64: string }> => {
  if (typeof window === 'undefined') {
    throw new Error('Creative composition requires browser runtime');
  }

  const image = await loadImage(sourceImageUrl);
  const canvas = document.createElement('canvas');
  canvas.width = format.width;
  canvas.height = format.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create drawing context');
  }

  drawCoverImage(context, image, format.width, format.height);
  drawTextOverlay(context, campaignMessage, format.width, format.height);

  const outputUrl = canvasToPngDataUrl(canvas);
  return {
    outputUrl,
    contentBase64: dataUrlToBase64(outputUrl),
  };
};

export const detectDominantColors = async (imageUrl: string, count = 5): Promise<string[]> => {
  if (typeof window === 'undefined') {
    return [];
  }

  const image = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) {
    return [];
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorCounts = new Map<string, number>();

  for (let idx = 0; idx < pixels.length; idx += 4) {
    if (pixels[idx + 3] === 0) {
      continue;
    }
    const key = rgbToHex(quantize(pixels[idx]), quantize(pixels[idx + 1]), quantize(pixels[idx + 2]));
    colorCounts.set(key, (colorCounts.get(key) ?? 0) + 1);
  }

  return [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([color]) => color);
};
