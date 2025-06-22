import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  ChevronRight,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";
import Logo from "/KufeLogo.jpeg";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useRoleAccess } from "../hooks/useAuthGuard";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { isStudent, isTeacher, isAdmin } = useRoleAccess();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Navigation items with translations
  const navItems = [
    { name: t("Home"), path: "/" },
    { name: t("Academics"), path: "/academics" },
    { name: t("Research"), path: "/research" },
    { name: t("Courses"), path: "/courses" },
    { name: t("About"), path: "/about" },
    { name: t("Contact"), path: "/contact" },
    { name: t("News"), path: "/anounce" },
  ];

  // Available languages
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "dr", name: "دری", flag: "🇦🇫" },
    { code: "ps", name: "پښتو", flag: "🇦🇫" },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      // Set flag to indicate user manually logged out
      sessionStorage.setItem('wasLoggedOut', 'true');
      await logout();
      // Clear any stored navigation state
      sessionStorage.removeItem('redirectPath');
      // Navigate to home page and replace history
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle language change
  const changeLanguage = (langCode) => {
    console.log("Changing language to:", langCode);
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };

  // Log current language for debugging
  useEffect(() => {
    console.log("Current language:", language);
  }, [language]);

  return (
    <nav className='bg-gradient-to-r from-[#004B87] to-[#1D3D6F] fixed w-full z-50 shadow-md'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-6'>
        {/* Logo and University Name */}
        <div className='flex items-center gap-4'>
          <img
            src={Logo || "/placeholder.svg"}
            alt={t("ku_logo_alt")}
            className='h-12 w-12 rounded-full object-cover shadow-sm ring-1 ring-white/10'
          />
          <div>
            <h1 className='text-lg font-bold text-white'>
              {t("kandahar_university")}
            </h1>
            <p className='text-sm text-[#E8ECEF]'>
              {t("faculty_of_economics")}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          <ul className='flex space-x-5 items-center'>
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`transition-colors ${
                  location.pathname === item.path
                    ? "text-[#F7B500] font-medium border-b-2 border-[#F7B500]"
                    : "text-[#E8ECEF] hover:text-[#F7B500]"
                }`}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}

            {/* Student Marks Button - Only visible to students (not admin) */}
            {isStudent() && !isAdmin() && (
              <li>
                <Link
                  to='/studentmarks'
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === "/studentmarks"
                      ? "bg-[#F7B500] text-[#004B87] font-medium"
                      : "bg-white/10 hover:bg-white/20 text-white hover:text-[#F7B500]"
                  }`}
                >
                  <BookOpen size={16} />
                  <span>My Marks</span>
                </Link>
              </li>
            )}

            {/* Teacher Marks Button - Only visible to teachers (not admin) */}
            {isTeacher() && !isAdmin() && (
              <li>
                <Link
                  to='/teachermarks'
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === "/teachermarks"
                      ? "bg-[#F7B500] text-[#004B87] font-medium"
                      : "bg-white/10 hover:bg-white/20 text-white hover:text-[#F7B500]"
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Upload Marks</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className='hidden md:flex items-center space-x-3'>
              {/* User Info */}
              <div className='relative' ref={userMenuRef}>
                <button
                  className='flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-200'
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-label='User menu'
                >
                  <div className='w-8 h-8 bg-[#F7B500] rounded-full overflow-hidden flex items-center justify-center'>
                    {user?.image && user.image !== "default-user.jpg" ? (
                      <img
                        src={`http://localhost:4400/public/img/users/${user.image}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image load error:", e);
                          e.target.src = "/default-user.jpg";
                        }}
                      />
                    ) : (
                      <User className='h-4 w-4 text-[#1D3D6F]' />
                    )}
                  </div>
                  <span className='text-sm font-medium'>
                    {user?.fullName?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100'>
                    <div className='px-4 py-3 border-b border-gray-100'>
                      <div className="flex items-center space-x-3">
                        <div className='w-12 h-12 bg-[#F7B500] rounded-full overflow-hidden flex items-center justify-center'>
                          {user?.image && user.image !== "default-user.jpg" ? (
                            <img
                              src={`http://localhost:4400/public/img/users/${user.image}`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Image load error:", e);
                                e.target.src = "/default-user.jpg";
                              }}
                            />
                          ) : (
                            <User className='h-6 w-6 text-[#1D3D6F]' />
                          )}
                        </div>
                        <div>
                          <p className='text-sm font-semibold text-gray-900'>
                            {user?.fullName}
                          </p>
                          <p className='text-xs text-gray-500'>{user?.email}</p>
                          <span className='inline-block mt-1 px-2 py-1 text-xs font-medium bg-[#1D3D6F] text-white rounded-full capitalize'>
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAdmin() && (
                      <Link
                        to='/dashboardv1'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        <BookOpen className='h-4 w-4 mr-3 text-[#1D3D6F]' />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to='/profile'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                    >
                      <User className='h-4 w-4 mr-3 text-[#1D3D6F]' />
                      My Profile
                    </Link>

                    <hr className='my-1' />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <LogOut className='h-4 w-4 mr-3' />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='hidden md:flex items-center space-x-3'>
              <Link
                to='/login'
                className='flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200'
              >
                <User className='h-4 w-4' />
                <span className='text-sm font-medium'>Sign In</span>
              </Link>
              <Link
                to='/registration'
                className='flex items-center space-x-2 bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] px-4 py-2 rounded-lg font-medium transition-all duration-200'
              >
                <span className='text-sm'>Register</span>
              </Link>
            </div>
          )}

          {/* Language Switcher */}
          <div className='relative' ref={langMenuRef}>
            <button
              className='flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-200'
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-expanded={isLangMenuOpen}
              aria-label='Select language'
            >
              <Globe className='h-4 w-4' />
              <span className='hidden sm:inline text-sm'>
                {languages.find((lang) => lang.code === language)?.name ||
                  "English"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isLangMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLangMenuOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === lang.code
                        ? "bg-[#1D3D6F] text-white font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className='mr-3 text-lg'>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <span className='ml-auto text-[#F7B500] font-bold'>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden flex items-center justify-center text-white mobile-menu-button p-2 rounded-lg hover:bg-white/10 transition-colors'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className='absolute top-full left-0 right-0 bg-white shadow-md animate-slideDown'
          ref={mobileMenuRef}
        >
          <ul className='border-b border-gray-200'>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex justify-between items-center px-6 py-3 hover:bg-gray-50 ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-[#004B87] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                  <ChevronRight className='h-4 w-4' />
                </Link>
              </li>
            ))}

            {/* Student Marks Button - Only visible to students (not admin) in mobile menu */}
            {isStudent() && !isAdmin() && (
              <li>
                <Link
                  to='/studentmarks'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex justify-between items-center px-6 py-3 hover:bg-gray-50 ${
                    location.pathname === "/studentmarks"
                      ? "bg-blue-50 text-[#004B87] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <BookOpen size={18} />
                    <span>My Marks</span>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </Link>
              </li>
            )}

            {/* Teacher Marks Button - Only visible to teachers (not admin) in mobile menu */}
            {isTeacher() && !isAdmin() && (
              <li>
                <Link
                  to='/teachermarks'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex justify-between items-center px-6 py-3 hover:bg-gray-50 ${
                    location.pathname === "/teachermarks"
                      ? "bg-blue-50 text-[#004B87] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <BookOpen size={18} />
                    <span>Upload Marks</span>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </Link>
              </li>
            )}
          </ul>

          {/* Authentication Section in Mobile Menu */}
          {isAuthenticated ? (
            <div className='border-b border-gray-200 px-6 py-4 bg-gray-50'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-10 h-10 bg-[#F7B500] rounded-full flex items-center justify-center'>
                  <User className='h-5 w-5 text-[#1D3D6F]' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {user?.fullName}
                  </p>
                  <p className='text-xs text-gray-500'>{user?.email}</p>
                  <span className='inline-block mt-1 px-2 py-1 text-xs font-medium bg-[#1D3D6F] text-white rounded-full capitalize'>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className='space-y-1'>
                {isAdmin() && (
                  <Link
                    to='/dashboardv1'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors'
                  >
                    <BookOpen className='h-4 w-4 mr-3 text-[#1D3D6F]' />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to='/profile'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors'
                >
                  <User className='h-4 w-4 mr-3 text-[#1D3D6F]' />
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className='flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                >
                  <LogOut className='h-4 w-4 mr-3' />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className='border-b border-gray-200 px-6 py-4 bg-gray-50'>
              <div className='space-y-3'>
                <Link
                  to='/login'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center justify-center w-full bg-[#1D3D6F] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2C4F85] transition-colors'
                >
                  <User className='h-4 w-4 mr-2' />
                  Sign In
                </Link>
                <Link
                  to='/registration'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center justify-center w-full border-2 border-[#1D3D6F] text-[#1D3D6F] py-3 px-4 rounded-lg font-medium hover:bg-[#1D3D6F] hover:text-white transition-colors'
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          <div className='px-6 py-4'>
            <p className='text-sm text-gray-500 mb-2'>Select Language</p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 rounded-md mb-1 ${
                  language === lang.code
                    ? "bg-blue-50 text-[#004B87] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className='mr-3 text-lg'>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className='ml-auto text-[#004B87] font-bold'>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
