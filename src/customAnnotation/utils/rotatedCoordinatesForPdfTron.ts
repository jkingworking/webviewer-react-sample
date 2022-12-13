export interface PageInfo {
  width: number;
  height: number;
}

/**
 * Takes in the coordinates for an overlay on a rotated page and rotates the
 * values for use with PDFTron. PDFTron maintains the rotated axis for each page
 * causing overlays to appear in the incorrect place. This function rotates the
 * overlay to appear in the correct position in PDFTron.
 * @param x
 * @param y
 * @param height
 * @param width
 * @param pageRotationInDeg
 * @param pageInfo
 */
export const rotatedCoordinatesForPdfTron = (
  x: number,
  y: number,
  height: number,
  width: number,
  pageRotationInDeg?: number,
  pageInfo?: PageInfo
): { x: number; y: number; height: number; width: number } => {
  let nextX = x;
  let nextY = y;
  let nextHeight = height;
  let nextWidth = width;

  if (pageRotationInDeg && pageInfo) {
    switch (pageRotationInDeg) {
      case 90: {
        nextX = y;
        nextY = pageInfo.width - width - x;
        nextWidth = height;
        nextHeight = width;
        break;
      }
      case 180: {
        nextX = pageInfo.width - width - x;
        nextY = pageInfo.height - height - y;
        break;
      }
      case 270: {
        nextX = pageInfo.height - y - height;
        nextY = x;
        nextWidth = height;
        nextHeight = width;
        break;
      }
    }
  }

  return { x: nextX, y: nextY, height: nextHeight, width: nextWidth };
};

/**
 * Takes in the coordinates from an overlay on a rotated page and restores the
 * values for consumers. This is a reversal of the rotation needed to get overlays
 * to appear correctly in PDFTron.
 * @param x
 * @param y
 * @param height
 * @param width
 * @param pageRotationInDeg
 * @param pageInfo
 */
export const restoreRotatedCoordinates = (
  x: number,
  y: number,
  height: number,
  width: number,
  pageRotationInDeg: number,
  pageInfo: PageInfo
): { x: number; y: number; height: number; width: number } => {
  let nextX = x;
  let nextY = y;
  let nextHeight = height;
  let nextWidth = width;

  switch (pageRotationInDeg) {
    case 90: {
      nextX = pageInfo.width - y - height;
      nextY = x;
      nextWidth = height;
      nextHeight = width;
      break;
    }
    case 180: {
      nextX = pageInfo.width - width - x;
      nextY = pageInfo.height - height - y;
      break;
    }
    case 270: {
      nextX = y;
      nextY = pageInfo.height - width - x;
      nextWidth = height;
      nextHeight = width;
      break;
    }
  }

  return { x: nextX, y: nextY, height: nextHeight, width: nextWidth };
};
