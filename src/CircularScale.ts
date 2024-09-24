import { AbstractCanvas } from "./AbstractCanvas";
import { rad2deg } from "./utils";

export class CircularScale extends AbstractCanvas {
  private color = "#adadad";
  private pointerColor = "#EFB75E";
  private offX = 0;
  private angle = 0;
  private maxValue = 360;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.redraw();

   
  }

  setAngle(angle: number) {
    this.angle = angle;
    this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    this.redraw();
  }

  protected override onMouseDown(x: number, y: number): void {
    this.offX = x;
  }

  protected override onDrag(x: number, y: number): void {
    const deltaX = -(x - this.offX);
    const angleChange = deltaX / 300; // Adjust divisor for sensitivity
    this.angle += angleChange;
    this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    this.offX = x;
    this.redraw();
  }

  protected override onDraw(ctx: CanvasRenderingContext2D): void {
    super.onDraw(ctx);
    ctx.save();
    ctx.translate(0, this.canvas.height * 0.8);
    this.drawRuler(ctx);
    ctx.restore();
    this.drawMarker(ctx);
  }

  private drawRuler(ctx: CanvasRenderingContext2D) {
    const canvas = this.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height);

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    ctx.translate(centerX, centerY);
    ctx.rotate(-this.angle - Math.PI / 2);
    console.log(this.angle * rad2deg);

    this.drawCircle(ctx, 0, 0, radius);
    this.drawCircle(ctx, 0, 0, radius - 100);

    const smallLineLen = 10;
    const medLineLen = 20;
    const bigLineLen = 30;
    const numMarks = 360;
    const angleStep = (2 * Math.PI) / numMarks;

    for (let i = 0; i < numMarks; i++) {
      const angle = i * angleStep;
      const xOuter = radius * Math.cos(angle);
      const yOuter = radius * Math.sin(angle);

      let lineLen;
      if (i % 10 === 0) {
        lineLen = bigLineLen;
      } else if (i % 5 === 0) {
        lineLen = medLineLen;
      } else {
        lineLen = smallLineLen;
      }

      const xInner = (radius - lineLen) * Math.cos(angle);
      const yInner = (radius - lineLen) * Math.sin(angle);

      this.drawLine(ctx, xOuter, yOuter, xInner, yInner);

      if (i % 10 === 0) {
        ctx.save();
        const labelX = (radius - bigLineLen - 10) * Math.cos(angle);
        const labelY = (radius - bigLineLen - 10) * Math.sin(angle);
        ctx.translate(labelX, labelY);
        ctx.rotate(angle + Math.PI / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "14px Arial";
        ctx.fillText(i.toString(), 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  private drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  private drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  private drawMarker(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.canvas.width / 2, this.canvas.height * 0.7);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fillStyle = this.pointerColor;
    ctx.fill();
    ctx.restore();
  }
}
