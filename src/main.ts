import { CircularScale } from "./CircularScale";
import { LinearScale } from "./LinearScale";
import "./style.css";

const rulerText = document.querySelector(
  ".ruler-box .text .big-text"
) as HTMLSpanElement;

const rulerFtBtn = document.querySelector("#ft-button") as HTMLButtonElement;

const rulerCmBtn = document.querySelector("#cm-button") as HTMLButtonElement;

const rulerTextUnit = document.querySelector("#ruler-unit");

const linearScale = new LinearScale(
  document.getElementById("ruler-canvas") as HTMLCanvasElement,
  (value) => {
    if (value.length == 2) {
      rulerText.innerText = value[0] + "·" + value[1];
    } else {
      rulerText.innerText = value.toString();
    }
  }
);

rulerFtBtn.addEventListener("click", () => {
  linearScale.changeMeterType("ft");
  rulerTextUnit.innerHTML = "ft";
});

rulerCmBtn.addEventListener("click", () => {
  linearScale.changeMeterType("cm");
  rulerTextUnit.innerHTML = "cm";
});

// Draw circular scale

const curveBigText = document.querySelector(
  ".curve-box .text .big-text"
) as HTMLSpanElement;
const curveSmallText = document.querySelector(
  ".curve-box .text .small-text"
) as HTMLSpanElement;

const buttons = document.querySelectorAll(".curve-box .buttons button");
console.log(buttons);
const circularScale = new CircularScale(
  document.getElementById("curve-canvas") as HTMLCanvasElement
);

circularScale.addValueChangeListener((value) => {
  curveBigText.innerText = Math.round(value).toString();
});

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;
    let unit = target.innerText as "kg" | "lb";
    curveSmallText.textContent = unit;
    circularScale.setUnit(unit);
    curveBigText.innerText = circularScale.getRoundValue().toString();
  });
});

const width = 300;
const height = 300;
const canvasList = document.querySelectorAll("canvas");
canvasList.forEach((canvas) => {
  canvas.width = width;
  canvas.height = height;
});
