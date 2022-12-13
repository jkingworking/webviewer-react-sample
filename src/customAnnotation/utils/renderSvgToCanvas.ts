import { pathBounds } from './pathBounds';
import memoizeOne from 'memoize-one';

const getDimensionsFromPaths = memoizeOne(
  (paths: (string | null)[]): [height: number, width: number] => {
    const maxRange: [left: number, top: number, right: number, bottom: number] =
      paths.reduce(
        (value, path) => {
          if (!path) {
            return value;
          }

          const [left, top, right, bottom] = pathBounds(path);
          return [
            Math.min(value[0], left),
            Math.min(value[1], top),
            Math.max(value[2], right),
            Math.max(value[3], bottom),
          ];
        },
        [0, 0, 0, 0]
      );

    const [left, top, right, bottom] = maxRange;

    const height = bottom - top;
    const width = right - left;
    return [height, width];
  }
);

const renderIconPaths = memoizeOne(
  (
    context: CanvasRenderingContext2D,
    paths: (string | null)[],
    color: string,
    x: number,
    y: number,
    heightScaleFactor = 1,
    widthScaleFactor = 1
  ): void => {
    paths.forEach(path => {
      if (!path) {
        return;
      }
      const icon = new Path2D(path);
      const svg = new Path2D();
      svg.addPath(icon, {
        a: heightScaleFactor,
        b: 0,
        c: 0,
        d: widthScaleFactor,
        e: x,
        f: y,
      });
      context.fillStyle = color;
      context.fill(svg);
    });
  }
);

export const renderSvgToCanvas = (
  context: CanvasRenderingContext2D,
  svgPathData: string,
  x: number,
  y: number,
  height: number,
  width: number,
  color: string
) => {
  // Find Paths
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgPathData, 'text/xml');
  const paths = Array.from(xmlDoc.querySelectorAll('path')).map(elem =>
    elem.getAttribute('d')
  );
  // Get icon height / width
  const [pathHeight, pathWidth] = getDimensionsFromPaths(paths);
  const heightScaleFactor = height / pathHeight;
  const widthScaleFactor = width / pathWidth;

  // render icon paths
  renderIconPaths(
    context,
    paths,
    color,
    x,
    y,
    heightScaleFactor,
    widthScaleFactor
  );
};
