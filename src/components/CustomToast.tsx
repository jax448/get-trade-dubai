import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface CustomToastProps {
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  icon?: React.ReactNode;
  onClose?: () => void;
  t?: { visible: boolean; id: string };
  animationType?: "slide" | "fade" | "bounce" | "rotate" | "flip";
}

const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  type = "info",
  icon,
  onClose,
  t,
  animationType = "bounce", // Default animation
}) => {
  const icons = {
    success: <CheckCircle className="w-[1.6rem] h-[1.6rem] text-green-400" />,
    error: <AlertCircle className="w-[1.6rem] h-[1.6rem] text-red-400" />,
    info: <Info className="w-[1.6rem] h-[1.6rem] text-blue-400" />,
    warning: (
      <AlertTriangle className="w-[1.6rem] h-[1.6rem] text-yellow-400" />
    ),
  };

  const styles = {
    success: {
      background: "bg-green-950/100",
      border: "border-green-800",
      title: "text-green-300",
      description: "text-green-400/70",
    },
    error: {
      background: "bg-red-950/100",
      border: "border-red-800",
      title: "text-red-300",
      description: "text-red-400/70",
    },
    info: {
      background: "bg-blue-950/100",
      border: "border-blue-800",
      title: "text-blue-300",
      description: "text-blue-400/70",
    },
    warning: {
      background: "bg-yellow-950/100",
      border: "border-yellow-800",
      title: "text-yellow-300",
      description: "text-yellow-400/70",
    },
  };

  const animations = {
    slide: {
      enter: "animate-slide-toast-in",
      leave: "animate-slide-toast-out",
    },
    fade: {
      enter: "animate-fade-toast-in",
      leave: "animate-fade-toast-out",
    },
    bounce: {
      enter: "animate-bounce-toast-in",
      leave: "animate-bounce-toast-out",
    },
    rotate: {
      enter: "animate-rotate-toast-in",
      leave: "animate-rotate-toast-out",
    },
    flip: {
      enter: "animate-flip-toast-in",
      leave: "animate-flip-toast-out",
    },
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();

    // Stop propagation to prevent event bubbling
    e.stopPropagation();

    // Ensure no other event handlers are triggered
    e.nativeEvent.stopImmediatePropagation();

    // Dismiss the specific toast
    //  if (t) {
    //    toast.dismiss(t.id);
    //  }

    // Call any additional onClose handler
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
        ${
          t?.visible
            ? animations[animationType].enter
            : animations[animationType].leave
        }
        ${styles[type].background} ${styles[type].border}
        max-w-[44.8rem] w-full shadow-xl rounded-[0.4rem] z-[999999999]
        pointer-events-auto flex ring-1 ring-gray-700 ring-opacity-50 border
      `}
    >
      <div className="flex-1 w-0 p-[1rem]">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon || icons[type]}</div>
          <div className="ml-[1rem] flex-1">
            {title && (
              <p
                className={`text-[1.3rem] text-wrap whitespace-pre-wrap break-all overflow-hidden font-medium ${styles[type].title}`}
              >
                {title}
              </p>
            )}
            {description && (
              <p
                className={`mt-1 text-[1.2rem] font-normal ${styles[type].description}`}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`flex border-l ${styles[type].border}`}>
        <button
          onClick={handleClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 
                   flex items-center justify-center text-sm font-medium 
                   text-white hover:text-gray-300 focus:outline-none"
        >
          <X className="w-[1.6rem] h-[1.6rem]" />
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
