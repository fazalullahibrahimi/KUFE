import React from "react";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "../../public/KufeLogo.jpeg";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Navigation items with translations
  const navItems = [
    { name: t("Home"), path: "/" },
    { name: t("Academics"), path: "/academics" },
    { name: t("Research"), path: "/research" },
    { name: t("Courses"), path: "/courses" },
    { name: t("About"), path: "/about" },
    { name: t("Contact"), path: "/contact" },
    { name: t("Announcements Events"), path: "/anounce" },
  ];

  // Available languages
  const languages = [
    { code: "en", name: "English" },
    { code: "dr", name: "دری" },
    { code: "ps", name: "پښتو" },
  ];

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangMenuOpen && !event.target.closest(".lang-menu")) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangMenuOpen]);

  // Handle language change
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };

  return (
    <nav className='bg-[#1D3D6F] shadow-md fixed w-full z-50'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6'>
        <div className='flex items-center space-x-4'>
          <img
            src={Logo || "/placeholder.svg"}
            alt={t("ku_logo_alt")}
            className='h-12 rounded-[50%] w-12 object-cover'
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

        <ul className='hidden md:flex space-x-6'>
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
        </ul>

        <div className='flex items-center space-x-3'>
          {/* Language Switcher */}
          <div className='relative lang-menu'>
            <button
              className='flex items-center space-x-1 bg-[#2A4E86] text-white px-3 py-2 rounded-md hover:bg-[#3A5E96] transition-colors'
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            >
              <span>
                {languages.find((lang) => lang.code === language)?.name ||
                  "English"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isLangMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLangMenuOpen && (
              <div className='absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      language === lang.code
                        ? "bg-gray-100 text-[#1D3D6F] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className='bg-[#F7B500] text-[#1D3D6F] px-4 py-2 rounded-md hover:bg-[#d9a200] transition-colors'>
            {t("student_portal")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
