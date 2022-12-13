import memoizeOne from 'memoize-one';
import { TextPadding } from '../constants';
import { ptToPx } from './ptToPx';

export type GetLines = (
  context: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  maxWidth: number,
  textPadding: TextPadding
) => string[];

export const getLines: GetLines = memoizeOne<GetLines>(
  (context, text, fontSize, maxWidth, textPadding) => {
    if (!text) {
      return [text];
    }

    if (text.includes('\n')) {
      return text
        .split('\n')
        .map(line => getLines(context, line, fontSize, maxWidth, textPadding))
        .flat();
    }

    context.font = `${fontSize}pt Helvetica`;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const horizontalPadding = textPadding.horizontal * ptToPx(fontSize) * 2;

    words.forEach(word => {
      const separator = currentLine ? ' ' : '';
      const width = context.measureText(currentLine + separator + word).width;
      if (width <= maxWidth - horizontalPadding) {
        currentLine += separator + word;
      } else {
        // This prevents a blank first line but allows line breaks in the content
        if (currentLine || lines.length) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    });
    lines.push(currentLine);
    return lines;
  }
);
