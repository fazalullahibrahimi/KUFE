import React, { useState, useEffect, useRef } from "react";
import { Bell, Globe, Menu, ChevronDown, User, Home, Settings, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminProfile from "./AdminProfile";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getUserImageUrl } from "../utils/helpers";
import { notificationService } from "../services/notificationService";

const Header = ({ toggleSidebar, activeTab, language }) => {
  const { user, logout } = useAuth();
  const { t, isRTL, setLanguage: changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState({ unread: 0, total: 0 });
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'dr', name: 'دری', flag: '🇦🇫' },
    { code: 'ps', name: 'پښتو', flag: '🇦🇫' }
  ];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationService.getNotifications({ limit: 10 });
      if (response.success) {
        setNotifications(response.data.notifications);
        setNotificationStats({
          unread: response.data.pagination.unreadCount,
          total: response.data.pagination.totalNotifications
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Function to get the title based on active tab
  const getTitle = () => {
    const titles = {
      dashboard: t("dashboardTitle"),
      faculty: t("facultyManagement"),
      departments: t("departmentManagement"),
      students: t("studentManagement"),
      courses: t("courseManagement"),
      subjects: t("subjectManagement"),
      research: t("researchPublications"),
      events: t("eventsManagement"),
      news: t("newsManagement"),
      announcements: t("announcementsTitle"),
      qualityAssurance: t("qualityAssuranceManagement"),
      analytics: t("analyticsTitle"),
      settings: t("settingsTitle"),
    };

    return titles[activeTab] || t("dashboardTitle");
  };

  // Notification functions
  const unreadCount = notificationStats.unread;

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
      setNotificationStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setNotificationStats(prev => ({
        ...prev,
        unread: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    // Refresh notifications when opening
    if (!isNotificationOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className={`bg-white shadow-sm header-container flex justify-between items-center p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          className='p-1 rounded-full hover:bg-gray-100 focus:outline-none'
          onClick={toggleSidebar}
        >
          <Menu size={24} className='text-gray-700' />
        </button>
        <h1 className={`text-2xl font-bold text-gray-800 ${isRTL ? 'mr-4' : 'ml-4'}`}>{getTitle()}</h1>
      </div>

      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
        {/* Go to Home Button */}
        <button
          onClick={() => navigate('/')}
          className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#2C4F85] transition-colors`}
          title={t("goToHome")}
        >
          <Home size={18} />
          <span className='hidden md:inline'>{t("Home")}</span>
        </button>

        {/* Language Switcher */}
        <div className='relative' ref={languageMenuRef}>
          <button
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors`}
            title={t("language")}
          >
            <Globe size={18} className='text-gray-700' />
            <span className='text-sm font-medium text-gray-700'>
              {languages.find(lang => lang.code === language)?.flag} {languages.find(lang => lang.code === language)?.name}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Language Dropdown */}
          {isLanguageMenuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 dropdown-backdrop bg-black/10" onClick={() => setIsLanguageMenuOpen(false)}></div>

              {/* Dropdown */}
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 dropdown-menu overflow-hidden`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className={`${isRTL ? 'ml-3' : 'mr-3'} text-lg`}>{lang.flag}</span>
                    <span className='font-medium'>{lang.name}</span>
                    {language === lang.code && (
                      <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-blue-600`}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
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
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 dropdown-backdrop bg-black/10" onClick={() => setIsNotificationOpen(false)}></div>

              {/* Dropdown */}
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 dropdown-menu overflow-hidden`}>
              {/* Header */}
              <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] p-4 text-white'>
                <div className='flex items-center justify-between'>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <Bell className='h-5 w-5' />
                    <h3 className='text-lg font-semibold'>{t("notifications")}</h3>
                    {unreadCount > 0 && (
                      <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className='text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors'
                    >
                      {t("markAllRead")}
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className='max-h-80 overflow-y-auto'>
                {loadingNotifications ? (
                  <div className='p-8 text-center text-gray-500'>
                    <div className='animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3'></div>
                    <p className='text-sm'>{t("loadingNotifications") || "Loading notifications..."}</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    <Bell className='h-12 w-12 mx-auto mb-3 text-gray-300' />
                    <p className='text-sm'>{t("noNotifications") || "No notifications"}</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-1`}>
                            <span className='text-lg'>
                              {notificationService.getNotificationIcon(notification.type)}
                            </span>
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {notification.priority === 'urgent' && (
                              <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                                {t("urgent") || "Urgent"}
                              </span>
                            )}
                            {notification.priority === 'high' && (
                              <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                                {t("high") || "High"}
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                            {notification.message}
                          </p>
                          <div className={`flex items-center mt-2 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                            <p className='text-xs text-gray-500 flex items-center'>
                              <span className={`w-1 h-1 bg-gray-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                              {notificationService.formatTimeAgo(notification.createdAt)}
                            </p>
                            {notification.sender && (
                              <p className='text-xs text-gray-500'>
                                {t("from") || "From"}: {notification.sender.fullName}
                              </p>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className='w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0'></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className='p-3 bg-gray-50 border-t border-gray-100'>
                  <button className='w-full text-sm text-[#1D3D6F] hover:text-[#2C4F85] font-medium py-2 hover:bg-white rounded-lg transition-colors'>
                    {t("viewAllNotifications")}
                  </button>
                </div>
              )}
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className='relative' ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-2 hover:bg-gray-100 rounded-lg transition-colors`}
          >
            <div className="w-10 h-10 bg-[#1D3D6F] rounded-full flex items-center justify-center overflow-hidden">
              {getUserImageUrl(user) ? (
                <img
                  src={getUserImageUrl(user)}
                  alt={user?.fullName || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackDiv = e.target.parentElement.querySelector('.fallback-icon');
                    if (fallbackDiv) {
                      fallbackDiv.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className={`fallback-icon w-full h-full flex items-center justify-center ${getUserImageUrl(user) ? 'hidden' : 'flex'}`}>
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className={`hidden md:block ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className='text-sm font-medium text-gray-800'>{user?.fullName || t("user")}</p>
              <p className='text-xs text-gray-500'>{user?.role === 'admin' ? t("systemAdministrator") : user?.role || t("user")}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 dropdown-backdrop bg-black/10" onClick={() => setIsUserMenuOpen(false)}></div>

              {/* Dropdown */}
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 dropdown-menu overflow-hidden backdrop-blur-sm`}>
                {/* User Info Header */}
                <div className='bg-gradient-to-br from-[#1D3D6F] via-[#2C4F85] to-[#3A5998] p-6 text-white relative overflow-hidden'>
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16'></div>
                    <div className='absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12'></div>
                  </div>

                  <div className={`relative flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-lg">
                      {getUserImageUrl(user) ? (
                        <img
                          src={getUserImageUrl(user)}
                          alt={user?.fullName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-bold text-white truncate'>{user?.fullName || t("userName")}</h3>
                      <p className='text-sm text-white/90 truncate'>{user?.email || t("userEmail")}</p>
                      <div className='flex items-center mt-2'>
                        <span className='inline-flex items-center px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30'>
                          <div className={`w-2 h-2 bg-green-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                          {user?.role === 'admin' ? t("administrator") : user?.role || t("user")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className='py-3'>
                  <div className='px-3 pb-2'>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{t("account")}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className='w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-[#1D3D6F] transition-all duration-200 group'
                  >
                    <div className={`w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} group-hover:bg-blue-200 transition-colors`}>
                      <UserCircle className='h-4 w-4 text-blue-600' />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className='font-medium'>{t("viewProfile")}</p>
                      <p className='text-xs text-gray-500'>{t("manageProfile")}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className='w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-[#1D3D6F] transition-all duration-200 group'
                  >
                    <div className={`w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} group-hover:bg-green-200 transition-colors`}>
                      <Settings className='h-4 w-4 text-green-600' />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className='font-medium'>{t("settings")}</p>
                      <p className='text-xs text-gray-500'>{t("privacySecurityPreferences")}</p>
                    </div>
                  </button>

                  <div className='border-t border-gray-100 my-3 mx-4'></div>

                  <div className='px-3 pb-2'>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{t("session")}</p>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className='w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group'
                  >
                    <div className={`w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} group-hover:bg-red-200 transition-colors`}>
                      <LogOut className='h-4 w-4 text-red-600' />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className='font-medium'>{t("signOut")}</p>
                      <p className='text-xs text-gray-500'>{t("endCurrentSession")}</p>
                    </div>
                  </button>
                </div>

                {/* Footer */}
                <div className='bg-gray-50 px-4 py-3 border-t border-gray-100'>
                  <p className='text-xs text-gray-500 text-center'>
                    {t("lastLogin")}: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
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
