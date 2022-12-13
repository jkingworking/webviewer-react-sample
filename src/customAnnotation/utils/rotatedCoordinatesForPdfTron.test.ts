import {
  restoreRotatedCoordinates,
  rotatedCoordinatesForPdfTron,
} from './rotatedCoordinatesForPdfTron';

const pageInfo = { width: 768, height: 1024 };

describe('rotatedCoordinatesForPdfTron', () => {
  it.each`
    x    | y     | height | width | rotation | expectedResult
    ${0} | ${10} | ${100} | ${50} | ${0}     | ${'{"x":0,"y":10,"height":100,"width":50}'}
    ${0} | ${10} | ${100} | ${50} | ${90}    | ${'{"x":10,"y":718,"height":50,"width":100}'}
    ${0} | ${10} | ${100} | ${50} | ${180}   | ${'{"x":718,"y":914,"height":100,"width":50}'}
    ${0} | ${10} | ${100} | ${50} | ${270}   | ${'{"x":914,"y":0,"height":50,"width":100}'}
  `(
    'should correctly rotate values $rotation deg',
    ({ x, y, height, width, rotation, expectedResult }) => {
      const result = rotatedCoordinatesForPdfTron(
        x,
        y,
        height,
        width,
        rotation,
        pageInfo
      );
      expect(JSON.stringify(result)).toBe(expectedResult);
    }
  );

  it.each`
    x      | y      | height | width  | rotation | expectedResult
    ${0}   | ${10}  | ${100} | ${50}  | ${0}     | ${'{"x":0,"y":10,"height":100,"width":50}'}
    ${10}  | ${718} | ${50}  | ${100} | ${90}    | ${'{"x":0,"y":10,"height":100,"width":50}'}
    ${718} | ${914} | ${100} | ${50}  | ${180}   | ${'{"x":0,"y":10,"height":100,"width":50}'}
    ${914} | ${0}   | ${50}  | ${100} | ${270}   | ${'{"x":0,"y":10,"height":100,"width":50}'}
  `(
    'should correctly restore values rotated by $rotation deg',
    ({ x, y, height, width, rotation, expectedResult }) => {
      const result = restoreRotatedCoordinates(
        x,
        y,
        height,
        width,
        rotation,
        pageInfo
      );
      expect(JSON.stringify(result)).toBe(expectedResult);
    }
  );
});
