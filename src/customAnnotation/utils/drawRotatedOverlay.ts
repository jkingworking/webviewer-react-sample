export const drawRotatedOverlay = (
  context: CanvasRenderingContext2D,
  {
    x,
    y,
    height,
    width,
    rotation,
  }: { x: number; y: number; height: number; width: number; rotation: number }
) => {
  context.translate(x + width / 2, y + height / 2);
  context.rotate(
    // @ts-ignore this is provided by RectangularCustomAnnotationRotationMixin
    -window.Core.Annotations.RotationUtils.getRotationAngleInRadiansByDegrees(
      rotation
    )
  );
  context.translate(-x - width / 2, -y - height / 2);
};
