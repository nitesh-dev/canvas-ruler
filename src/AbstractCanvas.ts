
export abstract class AbstractCanvas {
  private ctx: CanvasRenderingContext2D;
  protected dragX: number = 0;
  protected isDragging = false;
  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.addMouseListeners();
    //resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.redraw();
    });
    resizeObserver.observe(canvas);
  }
  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.onDraw(this.ctx);
  }
  //
  private addMouseListeners() {
    const canvas = this.canvas;
    canvas.addEventListener("pointerdown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.onMouseDown(x, y);
      this.isDragging = true;
    });
    window.addEventListener("pointerup", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.onMouseUp();
      this.isDragging = false;
    });
    canvas.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.onMouseMove(x, y);
      if (this.isDragging) {
        this.onDrag(x, y);
      }
    });
  }

  protected onMouseDown(x: number, y: number) { }
  protected onMouseMove(x: number, y: number) { }
  protected onMouseUp() { }
  //drag
  protected onDrag(x: number, y: number) { }

  protected onDraw(ctx: CanvasRenderingContext2D) { }
}
