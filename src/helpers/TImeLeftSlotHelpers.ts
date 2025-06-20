export function getTimeLeftPercentage(timeLeftISO: string): number {
  const endTime = new Date(timeLeftISO).getTime();
  const now = new Date().getTime();

  // If the end time is in the past, return 0
  if (endTime <= now) {
    return 0;
  }

  // Calculate percentage based on a 30-day period
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  const remainingTime = endTime - now;
  const percentage = (remainingTime / THIRTY_DAYS_MS) * 100;

  // Ensure the percentage is between 0 and 100
  return Math.min(Math.max(Math.round(percentage), 0), 100);
}

// Add this helper function to format the time left in a readable way
export function formatTimeLeft(timeLeftISO: string): string {
  const endTime = new Date(timeLeftISO).getTime();
  const now = new Date().getTime();

  // If already ended
  if (endTime <= now) {
    return "0";
  }

  const timeLeftMs = endTime - now;
  const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}

export function formatRelativeTime(dateString: string): string {
  // Parse the date
  const date = new Date(dateString);
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - date.getTime();

  // Convert to seconds
  const seconds = Math.floor(timeDiff / 1000);

  // Handle invalid dates
  if (isNaN(seconds)) {
    return dateString;
  }

  // Define time intervals in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  // Return appropriate relative time format
  if (seconds < minute) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  } else if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (seconds < week) {
    const days = Math.floor(seconds / day);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (seconds < month) {
    const weeks = Math.floor(seconds / week);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (seconds < year) {
    const months = Math.floor(seconds / month);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(seconds / year);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}

export function getTimeAgo(dateTime: string): string {
  const date = new Date(dateTime + "Z"); // Ensure UTC time
  const now = new Date();
  const timeSpan = (now.getTime() - date.getTime()) / 1000; // Difference in seconds

  if (timeSpan < 60) return `${Math.floor(timeSpan)} seconds ago`;
  if (timeSpan < 3600) return `${Math.floor(timeSpan / 60)} minutes ago`;
  if (timeSpan < 86400) return `${Math.floor(timeSpan / 3600)} hours ago`;
  if (timeSpan < 604800) return `${Math.floor(timeSpan / 86400)} days ago`;
  if (timeSpan < 2592000) return `${Math.floor(timeSpan / 604800)} weeks ago`;
  if (timeSpan < 31536000)
    return `${Math.floor(timeSpan / 2592000)} months ago`;

  return `${Math.floor(timeSpan / 31536000)} years ago`;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format(price);
};
export const formatNumber = (value: number, decimals: number = 4): string => {
  if (value < 1 && value > 0) {
    return value.toFixed(decimals); // Ensure small numbers retain precision
  }

  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  return `${value.toFixed(2)}${units[unitIndex]}`;
};

export function formatSmallNumber(num: number): string {
  if (num >= 0.01) {
    return num.toFixed(4); // Fixed to 4 digits after the dot
  }
  const scientificStr = num.toExponential();
  const [coefficient, exponent] = scientificStr.split("e");
  const exp = parseInt(exponent, 10);

  if (exp >= -1) {
    return num.toString();
  }

  const totalZeros = -exp - 1;

  const significantDigits = coefficient.replace(".", "").slice(0, 4);

  const subscriptZeros = convertToSubscript(totalZeros.toString());

  return `0.₍${subscriptZeros}₎${significantDigits}`;
}

function convertToSubscript(numStr: string): string {
  const subscriptMap: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "-": "₋",
  };

  return numStr
    .split("")
    .map((char) => subscriptMap[char] || char)
    .join("");
}

// export function formatSmallNumber(
//   value: number,
//   decimalPlaces: number = 8
// ): string {
//   if (value === 0) return "0";

//   if (value < 0.0001) {
//     return value.toExponential(2); // e.g., 1e-8
//   }

//   if (value < 1) {
//     // Trim to significant digits without scientific notation
//     return value.toFixed(decimalPlaces).replace(/\.?0+$/, "");
//   }

//   return value.toLocaleString(undefined, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: decimalPlaces,
//   });
// }

export const FancyformatSmallNumber = (
  num: number,
  threshold: number = 1e-5
): string => {
  if (num === 0) {
    return "0";
  }

  if (Math.abs(num) >= threshold) {
    return num.toString();
  }

  // Convert to scientific notation string
  const sciStr = num.toExponential();

  // Split into mantissa and exponent
  const [mantissa, exponent] = sciStr.split("e");
  const expNum = parseInt(exponent, 10);

  // Handle negative exponents (small numbers)
  if (expNum < 0) {
    // Get the significant digits after decimal
    const significantDigits = mantissa.replace(".", "").replace("-", "");

    // Format as 0.0₇282 (where 7 is the exponent)
    return `0.0${toSubscript(Math.abs(expNum))}${significantDigits}`;
  }

  return num.toString();
};

const toSubscript = (n: number): string => {
  const subscriptMap: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "-": "₋",
  };

  return n
    .toString()
    .split("")
    .map((d) => subscriptMap[d] || d)
    .join("");
};
