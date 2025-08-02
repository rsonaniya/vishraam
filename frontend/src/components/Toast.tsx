import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);
  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md text-white max-w-md flex items-center justify-between gap-3 ${
        type === "SUCCESS" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
      <span className="text-white cursor-pointer" onClick={() => onClose()}>
        &#10005;
      </span>
    </div>
  );
};

export default Toast;
