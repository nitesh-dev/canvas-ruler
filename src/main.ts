import { CircularScale } from "./CircularScale";
import { LinearScale } from "./LinearScale";
import "./style.css";

const rulerText = document.querySelector(
  ".ruler-box .text .big-text"
) as HTMLSpanElement;
console.log(rulerText);

const obj = new LinearScale(
  document.getElementById("ruler-canvas") as HTMLCanvasElement,
  (value) => {
    rulerText.innerText = value.toString();
  }
);

const curveText = document.querySelector(
  ".curve-box .text .big-text"
) as HTMLSpanElement;
const circularScale = new CircularScale(
  document.getElementById("curve-canvas") as HTMLCanvasElement
);

circularScale.addValueChangeListener((value) => {
  curveText.innerText = value.toString();
});

const width = 300;
const height = 300;
const canvasList = document.querySelectorAll("canvas");
canvasList.forEach((canvas) => {
  canvas.width = width;
  canvas.height = height;
});
