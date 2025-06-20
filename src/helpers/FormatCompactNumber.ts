export const formatCompactNumber = (val?: number): string => {
  if (typeof val !== "number") return "N/A";

  const format = (num: number, suffix: string) => {
    return `${Math.floor(num * 100) / 100}${suffix}`; // Keeps 2 decimal places, no rounding up
  };

  if (val >= 1_000_000_000_000) {
    return format(val / 1_000_000_000_000, "T");
  }

  if (val >= 1_000_000_000) {
    return format(val / 1_000_000_000, "B");
  }

  if (val >= 1_000_000) {
    return format(val / 1_000_000, "M");
  }

  if (val >= 1_000) {
    return format(val / 1_000, "K");
  }

  return `${Math.floor(val * 100) / 100}`;
};
