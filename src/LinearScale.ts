import { AbstractCanvas } from "./AbstractCanvas";
import { cmToFeet } from "./utils";

type ValueChangeFun = (value: number) => void;
type Unit = "cm" | "ft";
export class LinearScale extends AbstractCanvas {
  private color = "#adadad";
  private pointerColor = "#EFB75E";
  private offY: number = 0;
  private y: number = 0;
  private maxValue = 50 * 10;
  private minValue = 0 * 10;
  private spacing = 5;
  private unit: Unit = "cm";
  private value = 0;
  private onValueChange?: ValueChangeFun;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.updatePosFromValue(this.value);
  }
  getRoundValue() {
    return Math.round(this.value);
  }
  getValue() {
    return this.value;
  }
  setValue(value: number) {
    this.value = value;
    this.updatePosFromValue(value);

    if (this.onValueChange) {
      this.onValueChange(this.getRoundValue());
    }
  }

  setUnit(unit: Unit) {
    if (unit == this.unit) return;
    this.unit = unit;
    let value = this.value;
    if (unit == "cm") {
      //ft -> cm
      value = value * 2.54;
    } else {
      //cm -> ft
      value = value / 2.54;
    }
    //constrain value to max value
    // if (value > this.maxValue) {
    //   value = this.maxValue - 1;
    // }
    this.value = value;
    this.updatePosFromValue(value);
    if (this.onValueChange) {
      this.onValueChange(this.getRoundValue());
    }
  }
  getUnit() {
    return this.unit;
  }
  private updatePosFromValue(value: number) {
    let y = (value - this.minValue) * this.spacing - this.canvas.height / 2;
    this.setY(y);
    this.redraw();
  }
  private setY(y: number) {
    // limit the y value
    this.y = y;
    let maxY =
      (this.maxValue - this.minValue) * this.spacing - this.canvas.height / 2;
    if (this.y < -this.canvas.height / 2) {
      this.y = -this.canvas.height / 2;
    } else if (this.y > maxY) {
      this.y = maxY;
    }
  }
  addValueChangeListener(callback: ValueChangeFun) {
    this.onValueChange = callback;
    this.onValueChange(this.getRoundValue());
    this.redraw();
  }

  protected override onMouseDown(x: number, y: number): void {
    this.offY = y - this.y;
    console.log("down", this.y);
  }
  protected override onDrag(x: number, y: number): void {
    this.setY(y - this.offY);

    //calculate value
    let ry = this.y + this.canvas.height / 2;
    let value = this.minValue + ry / this.spacing;
    this.value = value;

    this.redraw();
    if (this.onValueChange) {
      this.onValueChange(this.getRoundValue());
    }
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

    // this.calculateValue();
  }

  calculateValue() {
    // let ry = this.y + this.canvas.height / 2;
    // let value = Math.round(this.minValue + ry / this.spacing);
    // if (!this.isInCm) {
    // const out = cmToFeet(value);
    //   this.callback([out.feet, out.inches]);
    // } else {
    //   this.callback([value]);
    // }
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

        let text = "";
        if (this.unit === "cm") {
          text = Math.round(this.maxValue - i / this.spacing).toString();
        } else {
          const max =
            ((this.maxValue - this.minValue) * this.spacing) /
            (this.spacing * tickCount);
          text = Math.round(
            max - i / (this.spacing * tickCount)
          ).toString();
        }

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
