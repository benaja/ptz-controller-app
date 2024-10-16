export function round(value: number, precision = 0): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Clamp the speed change to a maximum percentage
 *
 * @param value the new value
 * @param lastValue the last value
 * @param maxChange the maximum change allowed in percentage
 * @returns
 */
export function clampSpeedChange(value: number, lastValue: number, maxChange: number): number {
  const absoluteMaxChange = Math.abs(value) * maxChange;
  const delta = value - lastValue;
  if (Math.abs(delta) > absoluteMaxChange) {
    return lastValue + Math.sign(delta) * absoluteMaxChange;
  }
  return value;
}

export function applyLowPassFilter(target: number, lastValue: number, alpha: number): number {
  return alpha * target + (1 - alpha) * lastValue;
}

/**
 *
 * @param value value 0-255
 * @param min value in percentage: 0-1
 * @param max value in percentage: 0-1
 * @returns
 */
export function applyMinMax(value: number, min: number, max: number): number {
  if (value <= 0.5 && value >= -0.5) {
    return 0;
  }

  return Math.sign(value) * 255 * min + value * (max - min);
}
