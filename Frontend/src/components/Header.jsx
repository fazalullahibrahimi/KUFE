import React from "react";
import { Bell, Globe, Menu, Search } from "lucide-react";

const Header = ({ toggleSidebar, activeTab, language, setLanguage }) => {
  const languages = {
    en: "English",
    ps: "پښتو",
    dr: "دری",
  };

  // Function to get the title based on active tab
  const getTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      faculty: "Faculty Management",
      departments: "Department Management",
      students: "Student Management",
      courses: "Course Management",
      research: "Research Publications",
      events: "Events Management",
      news: "News Management",
      announcements: "Announcements",
      analytics: "Analytics",
      settings: "Settings",
    };

    return titles[activeTab] || "Dashboard";
  };

  return (
    <div className='bg-white shadow-sm z-10 flex justify-between items-center p-4'>
      <div className='flex items-center'>
        <button
          className='p-1 rounded-full hover:bg-gray-100 focus:outline-none'
          onClick={toggleSidebar}
        >
          <Menu size={24} className='text-gray-700' />
        </button>
        <h1 className='ml-4 text-2xl font-bold text-gray-800'>{getTitle()}</h1>
      </div>

      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search
            size={20}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
          />
          <input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Globe size={20} className='text-gray-700' />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className='relative'>
          <Bell size={20} className='text-gray-700 cursor-pointer' />
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
            3
          </span>
        </div>

        <div className='flex items-center space-x-3 cursor-pointer'>
          <img
            src='/placeholder.svg?height=40&width=40'
            alt='User'
            className='w-10 h-10 rounded-full'
          />
          <div className='hidden md:block'>
            <p className='text-sm font-medium text-gray-800'>Admin User</p>
            <p className='text-xs text-gray-500'>Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
