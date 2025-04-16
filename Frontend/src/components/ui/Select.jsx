// components/ui/select.jsx
import React, { useState, useRef, useEffect } from "react";

export function Select({
  children,
  value,
  onValueChange,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={selectRef} {...props}>
      <SelectTrigger className={className} onClick={() => setIsOpen(!isOpen)}>
        <SelectValue value={value} />
      </SelectTrigger>

      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onSelect: (itemValue) => {
                  onValueChange(itemValue);
                  setIsOpen(false);
                },
              });
            }
            return child;
          })}
        </SelectContent>
      )}
    </div>
  );
}

export function SelectTrigger({ children, className, ...props }) {
  return (
    <button
      type='button'
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='h-4 w-4 opacity-50'
      >
        <path d='m6 9 6 6 6-6' />
      </svg>
    </button>
  );
}

export function SelectValue({ value, placeholder }) {
  return (
    <span className='truncate'>
      {value || placeholder || "Select an option"}
    </span>
  );
}

export function SelectContent({ children, className, ...props }) {
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-80 mt-1 w-full ${className}`}
      {...props}
    >
      <div className='p-1'>{children}</div>
    </div>
  );
}

export function SelectItem({ children, value, onSelect, className, ...props }) {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 ${className}`}
      onClick={() => onSelect && onSelect(value)}
      {...props}
    >
      {children}
    </div>
  );
}
