import memoizeOne from 'memoize-one';
import { TextPadding } from '../constants';
import { getLines } from './getLines';

export type CalculateMinTextHeight = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  minFontSize: number,
  lineHeightMultiplier: number,
  textPadding: TextPadding,
  canWrapText?: boolean
) => number;

export const calculateMinTextHeight: CalculateMinTextHeight =
  memoizeOne<CalculateMinTextHeight>(
    (
      context,
      text,
      maxWidth,
      minFontSize,
      lineHeightMultiplier,
      textPadding,
      canWrapText = true
    ) => {
      context.font = `${minFontSize}pt Helvetica`;

      const textLines = canWrapText
        ? getLines(context, text, minFontSize, maxWidth, textPadding)
        : [text];
      return textLines.length * (minFontSize * lineHeightMultiplier);
    }
  );
