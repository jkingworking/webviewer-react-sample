import memoizeOne from 'memoize-one';

export type CalculateMinTextWidth = (
  context: CanvasRenderingContext2D,
  text: string,
  minFontSize: number,
  canWrap?: boolean
) => number;

export const calculateMinTextWidth: CalculateMinTextWidth =
  memoizeOne<CalculateMinTextWidth>(
    (context, text, minFontSize, canWrap = true) => {
      context.font = `${minFontSize}pt Helvetica`;
      if (canWrap) {
        return Math.max(
          ...text
            .replace(/[\n\r]/, ' ')
            .split(' ')
            .map(word => context.measureText(word).width)
        );
      }

      return context.measureText(text).width;
    }
  );
