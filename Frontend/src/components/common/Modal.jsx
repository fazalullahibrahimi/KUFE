import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const getModalWidth = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "lg":
        return "max-w-4xl";
      case "xl":
        return "max-w-6xl";
      case "md":
      default:
        return "max-w-2xl";
    }
  };

  return (
    <div className='fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div
        className={`w-full ${getModalWidth()} mx-4 sm:mx-6 rounded-2xl bg-white shadow-xl overflow-hidden animate-fadeIn`}
      >
        <div className='flex items-center justify-between p-5 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
          <button
            className='text-gray-500 hover:text-gray-700 transition'
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <div className='p-5 max-h-[75vh] overflow-y-auto'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
