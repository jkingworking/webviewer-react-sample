import memoizeOne from 'memoize-one';
import { TextPadding } from '../constants';
import { calculatePadding } from './calculatePadding';
import { calculateTextBoundary } from './calculateTextBoundary';

export type CalculateFontSize = (
  context: CanvasRenderingContext2D,
  legendText: string,
  width: number,
  height: number,
  maxFontSize: number,
  minFontSize: number,
  lineHeightMultiplier: number,
  textPadding: TextPadding
) => number;

export const calculateFontSize: CalculateFontSize =
  memoizeOne<CalculateFontSize>(
    (
      context,
      legendText,
      width,
      height,
      maxFontSize,
      minFontSize,
      lineHeightMultiplier,
      textPadding
    ) => {
      let fontSize = maxFontSize;

      while (fontSize >= minFontSize) {
        const [textWidth, textHeight] = calculateTextBoundary(
          context,
          legendText,
          width,
          fontSize,
          lineHeightMultiplier,
          textPadding
        );
        const [topPadding, rightPadding, bottomPadding, leftPadding] =
          calculatePadding(textPadding, fontSize);
        if (
          textWidth &&
          textHeight &&
          textWidth <= width - rightPadding - leftPadding &&
          textHeight <= height - bottomPadding - topPadding
        ) {
          return fontSize;
        }

        fontSize -= 0.25;
      }

      return minFontSize;
    }
  );
