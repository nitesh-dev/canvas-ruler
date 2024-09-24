import { AbstractCanvas } from "./AbstractCanvas";

type CallbackFunction = (value: number) => void;
export class LinearScale extends AbstractCanvas {
  private color = "#adadad";
  private pointerColor = "#EFB75E";
  private offY: number = 0;
  private y: number = 0;
  private maxValue = 50 * 10;
  private minValue = 10 * 10;
  private spacing = 5;

  private isInCm = true; // cm or feet (inches)

  constructor(canvas: HTMLCanvasElement, private callback: CallbackFunction) {
    super(canvas);
    this.redraw();
  }
  protected override onMouseDown(x: number, y: number): void {
    this.offY = y - this.y;
    console.log("down", this.y);
  }
  protected override onDrag(x: number, y: number): void {
    this.y = y - this.offY;
    this.redraw();
  }
  protected override onDraw(ctx: CanvasRenderingContext2D): void {
    super.onDraw(ctx);
    ctx.save();

    let maxY =
      (this.maxValue - this.minValue) * this.spacing - this.canvas.height / 2;

    // limit the y value
    if (this.y < -this.canvas.height / 2) {
      this.y = -this.canvas.height / 2;
    } else if (this.y > maxY) {
      this.y = maxY;
    }

    ctx.translate(0, this.y);
    // console.log("draw", this.y);
    this.drawRuler(ctx);
    ctx.restore();
    this.drawMarker(ctx);

    this.calculateValue();
  }

  calculateValue() {
    let ry = this.y + this.canvas.height / 2;
    let step = Math.round(this.minValue + ry / this.spacing);

    // console.log(this.callback)
    this.callback(step);
  }

  private drawRuler(ctx: CanvasRenderingContext2D) {
    // Draw vertical ruler

    const startX = this.canvas.width;
    const tickWidth = 20;
    const midTickWidth = 30;
    const longTickWidth = 40;
    const tickCount = 10;

    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    ctx.translate(
      0,
      -(this.maxValue - this.minValue) * this.spacing + this.canvas.height
    );

    for (
      let i = 0;
      i <= (this.maxValue - this.minValue) * this.spacing;
      i += this.spacing
    ) {
      let tickLength =
        i % (this.spacing * 10) === 0
          ? longTickWidth
          : i % (this.spacing * 5) === 0
          ? midTickWidth
          : tickWidth;

      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(startX, i);
      ctx.lineTo(startX - tickLength, i);
      ctx.stroke();

      // Add number labels for long ticks
      if (i % (this.spacing * tickCount) === 0) {
        ctx.font = "14px Arial";
        const text = (this.maxValue - i / this.spacing).toString();
        const textWidth = ctx.measureText(text).width;

        ctx.fillText(
          text,
          startX - tickLength - textWidth - 10,
          i + this.spacing
        );
      }
    }
  }

  private drawMarker(ctx: CanvasRenderingContext2D) {
    // draw triangle
    ctx.save();
    ctx.translate(this.canvas.width, this.canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-20, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fillStyle = this.pointerColor;
    ctx.fill();
    ctx.restore();
  }
}
