import Color from 'color';
import { ColorArray } from '../../types/colorArray';

export const colorToRgb = (color: string): ColorArray =>
  Color(color).rgb().array();
