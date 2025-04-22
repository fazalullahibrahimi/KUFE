import React from "react";
const StatCard = ({ title, value, change, icon, iconBg }) => {
  // Determine the color for the change text
  const getChangeColor = () => {
    if (change.includes("+")) return "text-green-500";
    if (change.includes("-")) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className='bg-white rounded-lg shadow p-6 flex items-center hover:shadow-md transition-shadow'>
      <div
        className={`w-12 h-12 rounded-full ${iconBg} text-white flex items-center justify-center mr-4`}
      >
        {icon}
      </div>
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <p className='text-2xl font-bold text-gray-800'>{value}</p>
        <p className={`text-xs ${getChangeColor()}`}>{change}</p>
      </div>
    </div>
  );
};

export default StatCard;
