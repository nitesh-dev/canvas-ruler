export const rad2deg = 180 / Math.PI;
export const deg2rad = 1 / rad2deg;

export function kg2lb(kg: number) {
  return kg * 2.20462;
}

export function cmToFeet(cm: number) {
  // 1cm = 0.393701 inches
  const totalInches = cm * 0.393701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}
