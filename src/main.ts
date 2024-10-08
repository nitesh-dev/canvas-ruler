import { CircularScale } from "./CircularScale";
import { LinearScale } from "./LinearScale";
import "./style.css";
import { formatInches } from "./utils";

const rulerText = document.querySelector(
  ".ruler-box .text .big-text"
) as HTMLSpanElement;

const width = 300;
const height = 300;
const canvasList = document.querySelectorAll("canvas");
canvasList.forEach((canvas) => {
  canvas.width = width;
  canvas.height = height;
});

const rulerFtBtn = document.querySelector("#ft-button") as HTMLButtonElement;

const rulerCmBtn = document.querySelector("#cm-button") as HTMLButtonElement;

const rulerTextUnit = document.querySelector("#ruler-unit");

const linearScale = new LinearScale(
  document.getElementById("ruler-canvas") as HTMLCanvasElement
);

linearScale.addValueChangeListener((value) => {
  console.log("value", value);
  if (linearScale.getUnit() === "cm") {
    rulerText.innerText = value.toString();
    rulerTextUnit.innerHTML = "cm";
  } else {
    rulerText.innerText = formatInches(value);
    rulerTextUnit.innerHTML = "ft";
  }
});

linearScale.setUnit("ft");
linearScale.setValue(70);

rulerFtBtn.addEventListener("click", () => {
  linearScale.setUnit("ft");
  rulerTextUnit.innerHTML = "ft";
});

rulerCmBtn.addEventListener("click", () => {
  linearScale.setUnit("cm");
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
const circularScale = new CircularScale(
  document.getElementById("curve-canvas") as HTMLCanvasElement
);

circularScale.addValueChangeListener((value) => {
  curveBigText.innerText = Math.round(value).toString();
  if (circularScale.getUnit() === "kg") {
    curveSmallText.innerText = "kg";
  } else {
    curveSmallText.innerText = "lb";
  }
  console.log("cvalue", value);
});

circularScale.setUnit("lb");
circularScale.setValue(70);

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;
    let unit = target.innerText as "kg" | "lb";
    curveSmallText.textContent = unit;
    circularScale.setUnit(unit);
    curveBigText.innerText = circularScale.getRoundValue().toString();
  });
});
