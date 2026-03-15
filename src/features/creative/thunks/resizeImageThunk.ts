import sharp from 'sharp';

/**
 * Resizes an image from a file path to the specified dimensions and saves it to an output path.
 * Uses 'cover' fit and 'center' position to handle aspect ratio changes.
 * 
 * **User Story:**
 * - As a platform, I need to reliably resize high-resolution product images into 
 *   standardized ad formats so they look professional across different social media feeds.
 * 
 * @param inputPath - The filesystem path to the source image.
 * @param width - The target width in pixels.
 * @param height - The target height in pixels.
 * @param outputPath - The filesystem path where the resized image should be saved.
 * @returns The path to the resized image.
 */
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

/**
 * Resizes an image from a buffer to the specified dimensions.
 * 
 * @param inputBuffer - The buffer containing the source image.
 * @param width - The target width in pixels.
 * @param height - The target height in pixels.
 * @returns A buffer containing the resized PNG image.
 */
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
