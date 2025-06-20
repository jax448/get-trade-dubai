import Crown1 from "@public/assests/position (1).png";
import Crown2 from "@public/assests/position (2).png";
import Crown3 from "@public/assests/position (3).png";
import Crown4 from "@public/assests/Crown4.png";
import Crown5 from "@public/assests/Crown5.png";
import Crown6 from "@public/assests/Crown6.png";
import Crown7 from "@public/assests/Crown7.png";
import Crown8 from "@public/assests/Crown8.png";
import Crown9 from "@public/assests/Crown9.png";
import Crown10 from "@public/assests/Crown10.png";
import Crown11 from "@public/assests/Crown11.png";
import Crown12 from "@public/assests/Crown12.png";

// Helper function to get background image based on name
const getCrownImage = (crown: number) => {
  switch (crown) {
    case 1:
      return `${Crown1.src}`;
    case 2:
      return `${Crown2.src}`;
    case 3:
      return `${Crown3.src}`;
    case 4:
      return `${Crown4.src}`;
    case 5:
      return `${Crown5.src}`;
    case 6:
      return `${Crown6.src}`;
    case 7:
      return `${Crown7.src}`;
    case 8:
      return `${Crown8.src}`;
    case 9:
      return `${Crown9.src}`;
    case 10:
      return `${Crown10.src}`;
    case 11:
      return `${Crown11.src}`;
    case 12:
      return `${Crown12.src}`;
    default:
      return "none";
  }
};

export { getCrownImage };
