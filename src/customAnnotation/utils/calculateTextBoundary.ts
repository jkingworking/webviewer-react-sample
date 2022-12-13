import memoizeOne from 'memoize-one';
import { TextPadding } from '../constants';
import { getLines } from './getLines';

export type CalculateTextBoundary = (
  context: CanvasRenderingContext2D,
  legendText: string,
  width: number,
  fontSize: number,
  lineHeightMultiplier: number,
  textPadding: TextPadding
) => [number, number];

export const calculateTextBoundary: CalculateTextBoundary =
  memoizeOne<CalculateTextBoundary>(
    (
      context,
      legendText,
      width,
      fontSize,
      lineHeightMultiplier,
      textPadding
    ) => {
      context.font = `${fontSize}pt Helvetica`;
      const lines = getLines(context, legendText, fontSize, width, textPadding);
      const maxLineLength = Math.max(
        ...lines.map(line => context.measureText(line).width)
      );

      return [maxLineLength, lines.length * fontSize * lineHeightMultiplier];
    }
  );
