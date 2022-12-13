export const drawRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const workingRadius = Math.min(radius, height / 2, width / 2);
  const r = x + width;
  const b = y + height;
  context.beginPath();
  context.moveTo(x + workingRadius, y);
  context.lineTo(r - workingRadius, y);
  context.quadraticCurveTo(r, y, r, y + workingRadius);
  context.lineTo(r, y + height - workingRadius);
  context.quadraticCurveTo(r, b, r - workingRadius, b);
  context.lineTo(x + workingRadius, b);
  context.quadraticCurveTo(x, b, x, b - workingRadius);
  context.lineTo(x, y + workingRadius);
  context.quadraticCurveTo(x, y, x + workingRadius, y);
  context.stroke();
  context.fill();
};
