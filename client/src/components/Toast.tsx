import { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle, Info, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        className={`${bgColors[type]} border rounded-2xl shadow-lg p-4 flex items-start gap-3`}
      >
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          data-testid="button-close-toast"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
