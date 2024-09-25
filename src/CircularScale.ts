import { AbstractCanvas } from "./AbstractCanvas";
import { rad2deg } from "./utils";

type ValueChangeFun = (value: number) => void;
type Unit = "kg" | "lb";
export class CircularScale extends AbstractCanvas {
  private color = "#adadad";
  private pointerColor = "#EFB75E";
  private offX = 0;
  private angle = 0;
  private maxValue = 400;
  private unit: Unit = "kg";
  private value = 0;

  private onValueChange?: ValueChangeFun;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.redraw();
  }
  // protected makeValue() {
  //   return (this.angle * this.maxValue) / (2 * Math.PI);
  // }
  getRoundValue() {
    return Math.round(this.value);
  }
  getValue() {
    return this.value;
  }

  setValue(value: number) {
    if (value > this.maxValue) {
      value = this.maxValue - 1;
    }
    this.value = value;
    this.setAngle((2 * Math.PI * value) / this.maxValue);
    if (this.onValueChange) {
      this.onValueChange(Math.round(value));
    }
  }
  private updateMaxValue(maxValue: number) {
    this.maxValue = maxValue;
  }
  setUnit(unit: Unit) {
    if (unit == this.unit) return;
    this.unit = unit;
    let value = this.value;
    if (unit == "kg") {
      //lb -> kg
      value = value / 2.20462;
    } else {
      //kg -> lb
      value = value * 2.20462;
    }
    //constrain value to max value
    if (value > this.maxValue) {
      value = this.maxValue - 1;
    }
    this.value = value;
    this.setAngle((2 * Math.PI * value) / this.maxValue);
    if (this.onValueChange) {
      this.onValueChange(Math.round(value));
    }
  }
  getUnit() {
    return this.unit;
  }

  protected setAngle(angle: number) {
    this.angle = angle;
    //set constrain angle
    this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    this.redraw();
  }
  addValueChangeListener(callback: ValueChangeFun) {
    this.onValueChange = callback;
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
    //calculate value
    const value = (this.angle * this.maxValue) / (2 * Math.PI);
    this.value = value;
    this.redraw();
    if (this.onValueChange) {
      this.onValueChange(this.getRoundValue());
    }
  }

  protected override onDraw(ctx: CanvasRenderingContext2D): void {
    super.onDraw(ctx);
    ctx.save();
    this.drawRuler(ctx);
    ctx.restore();
  }

  private drawRuler(ctx: CanvasRenderingContext2D) {
    const canvas = this.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, 200);
    const diff = 90;

    //find the circle y such that concentric circles are center of canvas
    const y = centerY + radius - diff / 2;

    //draw circle and marks
    {
      ctx.save();
      ctx.translate(centerX, y);
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;

      // ctx.translate(centerX, y);
      ctx.rotate(-this.angle - Math.PI / 2);

      this.drawCircle(ctx, 0, 0, radius);
      this.drawCircle(ctx, 0, 0, radius - diff);

      const smallLineLen = 10;
      const medLineLen = 20;
      const bigLineLen = 30;
      const numMarks = this.maxValue;
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
    this.drawMarker(ctx, centerX, centerY + diff / 2);
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

  private drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
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
