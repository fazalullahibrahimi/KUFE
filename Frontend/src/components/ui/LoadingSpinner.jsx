import React from "react";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  fullScreen = false,
  message = "Loading...",
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
    xlarge: "h-16 w-16",
  };

  const colorClasses = {
    primary: "text-[#1D3D6F]",
    secondary: "text-[#2C4F85]",
    accent: "text-[#F7B500]",
    white: "text-white",
    gray: "text-gray-500",
  };

  const spinnerContent = (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <div className='relative'>
        <div
          className={`animate-spin rounded-full border-4 border-gray-200 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}
        ></div>
      </div>
      {message && (
        <p className={`text-sm font-medium ${colorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center'>
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center p-8'>{spinnerContent}</div>
  );
};

// Specific loading components for different use cases
export const PageLoader = ({ message = "Loading page..." }) => (
  <LoadingSpinner
    size='large'
    color='primary'
    fullScreen={true}
    message={message}
  />
);

export const ButtonLoader = ({ message = "Processing..." }) => (
  <LoadingSpinner size='small' color='white' message={message} />
);

export const CardLoader = ({ message = "Loading..." }) => (
  <div className='bg-white rounded-lg shadow-md p-8'>
    <LoadingSpinner size='medium' color='primary' message={message} />
  </div>
);

export const InlineLoader = () => (
  <LoadingSpinner size='small' color='primary' />
);

export default LoadingSpinner;
