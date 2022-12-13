import { TextPadding } from '../constants';
import { ptToPx } from './ptToPx';

export const calculatePadding = (
  textPadding: TextPadding,
  fontSize: number
): [top: number, right: number, bottom: number, left: number] => {
  const top = textPadding.vertical * ptToPx(fontSize);
  const bottom = textPadding.vertical;
  const horizontal = textPadding.horizontal * ptToPx(fontSize);
  return [top, horizontal, bottom, horizontal];
};
