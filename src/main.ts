import { CircularScale } from "./CircularScale";
import { LinearScale } from "./LinearScale";
import "./style.css";



const rulerText = document.querySelector(".big-text-ruler") as HTMLSpanElement

const obj = new LinearScale(
  document.getElementById("ruler-canvas") as HTMLCanvasElement,
  (value) => {
    rulerText.innerText = value.toString();
  }
);

const circularScale = new CircularScale(
  document.getElementById("curve-canvas") as HTMLCanvasElement
);
