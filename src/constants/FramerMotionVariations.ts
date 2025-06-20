const sidebarVariants = {
  open: {
    x: "0%",
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
  closed: {
    x: "100%",
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open: { opacity: 1, transition: { duration: 0.2 } },
};

const menuItemVariants = {
  closed: { x: 50, opacity: 0 },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
};

// Variants for underline animation
const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

const tabVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.1,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: 0,
    transition: {
      duration: 0.1,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

// Animation for state transition
const backgroundVariants = {
  inactive: {
    backgroundColor: "#4CF37B",
    boxShadow: "inset 0 -1px 4px 0px #7F7F7F40",
  },
  active: {
    backgroundColor: "#1FBF4C",
    boxShadow: "inset 0 4px 4px 0px #00000040",
    transition: { duration: 0.3 },
  },
};

// Icon animation variants
const iconVariants = {
  enter: {
    rotate: 0,
    opacity: 0,
    scale: 0.5,
  },
  center: {
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.4,
    },
  },
  exit: {
    rotate: 180,
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
};

// Text animation variants
const textVariants = {
  enter: { x: -10, opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.1,
    },
  },
  exit: { x: 10, opacity: 0, transition: { duration: 0.2 } },
};

export {
  buttonVariants,
  menuItemVariants,
  backdropVariants,
  sidebarVariants,
  underlineVariants,
  dropdownVariants,
  contentVariants,
  tabVariants,
  textVariants,
  iconVariants,
  backgroundVariants,
};
