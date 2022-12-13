import parse from 'parse-svg-path';
import abs from 'abs-svg-path';
import normalize from 'normalize-svg-path';
import isSvgPath from 'is-svg-path';

type Bounds = [left: number, top: number, right: number, bottom: number];

export function pathBounds(path: string): Bounds {
  if (!isSvgPath(path)) throw Error('String is not an SVG path.');
  let svgPath: number[][] = parse(path);

  if (!Array.isArray(svgPath))
    throw Error('Argument should be a string or an array of path segments.');

  svgPath = abs(svgPath);
  svgPath = normalize(svgPath);

  if (!svgPath.length) return [0, 0, 0, 0];

  const bounds: Bounds = [Infinity, Infinity, -Infinity, -Infinity];

  for (let i = 0, l = svgPath.length; i < l; i++) {
    const points = svgPath[i].slice(1);

    for (let j = 0; j < points.length; j += 2) {
      if (points[j] < bounds[0]) bounds[0] = points[j];
      if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1];
      if (points[j] > bounds[2]) bounds[2] = points[j];
      if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1];
    }
  }

  return bounds;
}
