// src/components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-semibold mb-4'>{title}</h2>
        {children}
        <button
          onClick={onClose}
          className='mt-4 bg-red-500 text-white px-4 py-2 rounded'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
