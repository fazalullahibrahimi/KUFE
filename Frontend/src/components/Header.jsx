import React, { useState, useEffect, useRef } from "react";
import { Bell, Globe, Menu, Search, ChevronDown } from "lucide-react";
import AdminProfile from "./AdminProfile";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ toggleSidebar, activeTab, language, setLanguage }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Student Registration",
      message: "5 new students have registered for the semester",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Course Update Required",
      message: "Mathematics course syllabus needs review",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance completed successfully",
      time: "1 day ago",
      read: true,
    },
  ]);

  const languages = {
    en: "English",
    ps: "پښتو",
    dr: "دری",
  };

  // Handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to get the title based on active tab
  const getTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      faculty: "Faculty Management",
      departments: "Department Management",
      students: "Student Management",
      courses: "Course Management",
      subjects: "Subject Management",
      research: "Research Publications",
      events: "Events Management",
      news: "News Management",
      announcements: "Announcements",
      qualityAssurance: "Quality Assurance Management",
      analytics: "Analytics",
      settings: "Settings",
    };

    return titles[activeTab] || "Dashboard";
  };

  // Notification functions
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
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

        {/* Notifications */}
        <div className='relative' ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className='relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]'>
              <div className='p-4 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-800'>Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className='text-sm text-[#1D3D6F] hover:text-[#2C4F85]'
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.length === 0 ? (
                  <div className='p-4 text-center text-gray-500'>
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h4 className='text-sm font-medium text-gray-800'>
                            {notification.title}
                          </h4>
                          <p className='text-sm text-gray-600 mt-1'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-500 mt-2'>
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className='relative'>
          <button
            onClick={() => setIsProfileOpen(true)}
            className='flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <img
              src={user?.imageUrl || '/placeholder.svg?height=40&width=40'}
              alt={user?.name || 'User'}
              className='w-10 h-10 rounded-full object-cover'
              onError={(e) => {
                e.target.src = '/placeholder.svg?height=40&width=40';
              }}
            />
            <div className='hidden md:block text-left'>
              <p className='text-sm font-medium text-gray-800'>{user?.name || 'User'}</p>
              <p className='text-xs text-gray-500'>{user?.role === 'admin' ? 'System Administrator' : user?.role || 'User'}</p>
            </div>
            <ChevronDown className='h-4 w-4 text-gray-500' />
          </button>
        </div>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default Header;
