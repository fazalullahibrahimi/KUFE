import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Logo from "/KufeLogo.jpeg";
import { useLanguage } from "../contexts/LanguageContext";
import { getCurrentUser } from "../utils/helpers";

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Get current user to check role
  const currentUser = getCurrentUser();
  const isStudent = currentUser?.role === "student";
  const isTeacher = currentUser?.role === "teacher";

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
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
        <ul className='hidden md:flex space-x-5'>
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

          {/* Student Marks Button - Only visible to students */}
          {isStudent && (
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

          {/* Teacher Marks Button - Only visible to teachers */}
          {isTeacher && (
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

        <div className='flex items-center space-x-3'>
          {/* Language Switcher */}
          <div className='relative' ref={langMenuRef}>
            <button
              className='flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md transition-colors'
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-expanded={isLangMenuOpen}
              aria-label='Select language'
            >
              <Globe className='h-4 w-4' />
              <span className='hidden sm:inline'>
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
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fadeIn'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      language === lang.code
                        ? "bg-gray-100 text-[#1D3D6F] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className='mr-3 text-lg'>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <span className='ml-auto text-[#004B87] font-bold'>
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
            className='md:hidden flex items-center justify-center text-white'
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

            {/* Student Marks Button - Only visible to students in mobile menu */}
            {isStudent && (
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

            {/* Teacher Marks Button - Only visible to teachers in mobile menu */}
            {isTeacher && (
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
