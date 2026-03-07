import sharp from 'sharp';
import type { ComposeOptions } from '../types/composeOptionsType';

const defaultOptions: Required<ComposeOptions> = {
  fontSize: 48,
  fontColor: '#FFFFFF',
  position: 'bottom',
  shadow: true,
};

const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getYPosition = (position: 'top' | 'center' | 'bottom', height: number, fontSize: number): number => {
  switch (position) {
    case 'top':
      return fontSize + 40;
    case 'center':
      return height / 2;
    case 'bottom':
      return height - 60;
  }
};

export const composeCreative = async (
  imageInput: string | Buffer,
  text: string,
  width: number,
  height: number,
  options?: ComposeOptions
): Promise<Buffer> => {
  const opts = { ...defaultOptions, ...options };
  const escapedText = escapeXml(text);
  const yPos = getYPosition(opts.position, height, opts.fontSize);

  const shadowFilter = opts.shadow
    ? `<defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/>
        </filter>
      </defs>`
    : '';

  const filterAttr = opts.shadow ? ' filter="url(#shadow)"' : '';

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}">
      ${shadowFilter}
      <text
        x="50%"
        y="${yPos}"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${opts.fontSize}"
        font-weight="bold"
        fill="${opts.fontColor}"
        ${filterAttr}
      >${escapedText}</text>
    </svg>
  `);

  const baseImage = typeof imageInput === 'string'
    ? sharp(imageInput)
    : sharp(imageInput);

  return baseImage
    .resize(width, height, { fit: 'cover', position: 'center' })
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();
};
