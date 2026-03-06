import sharp from 'sharp';

export const resizeImage = async (
  inputPath: string,
  width: number,
  height: number,
  outputPath: string
): Promise<string> => {
  await sharp(inputPath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png()
    .toFile(outputPath);

  return outputPath;
};

export const resizeImageBuffer = async (
  inputBuffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> => {
  return sharp(inputBuffer)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();
};
