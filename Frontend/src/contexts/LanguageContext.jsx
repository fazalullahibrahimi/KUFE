import React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import translations from "../translations/Translation";
import psTranslations from "../translations/ps";
import { drTranslations } from "../translations/dr";

// Define translations
// const translations = {
//   en: {
//     // English translations
//     Home: "Home",
//     Academics: "Academics",
//     Research: "Research",
//     Courses: "Courses",
//     About: "About",
//     Contact: "Contact",
//     "Announcements Events": "Announcements & Events",
//     student_portal: "Student Portal",
//     kandahar_university: "Kandahar University",
//     faculty_of_economics: "Faculty of Economics",
//     ku_logo_alt: "Kandahar University Logo",
//     // Add more translations as needed
//   },
//   dr: {
//     // Dari translations
//     Home: "خانه",
//     Academics: "تحصیلات",
//     Research: "تحقیقات",
//     Courses: "دروس",
//     About: "درباره ما",
//     Contact: "تماس با ما",
//     "Announcements Events": "اعلانات و رویدادها",
//     student_portal: "پورتال محصلین",
//     kandahar_university: "پوهنتون کندهار",
//     faculty_of_economics: "پوهنځی اقتصاد",
//     ku_logo_alt: "لوگوی پوهنتون کندهار",
//     // Add more translations as needed
//   },
//   ps: {
//     // Pashto translations
//     Home: "کور",
//     Academics: "زده کړې",
//     Research: "څیړنې",
//     Courses: "کورسونه",
//     About: "زموږ په اړه",
//     Contact: "اړیکه",
//     "Announcements Events": "اعلانات او پیښې",
//     student_portal: "د زده کوونکو پورټال",
//     kandahar_university: "د کندهار پوهنتون",
//     faculty_of_economics: "د اقتصاد پوهنځی",
//     ku_logo_alt: "د کندهار پوهنتون لوګو",
//     // Add more translations as needed
//   },
// };

// Define language metadata
const languageMetadata = {
  en: {
    name: "English",
    dir: "ltr",
  },
  dr: {
    name: "دری",
    dir: "rtl",
  },
  ps: {
    name: "پښتو",
    dir: "rtl",
  },
};

// Create the language context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    changeLanguage(savedLanguage);

    // Debug
    console.log("Initial language:", savedLanguage);
  }, []);

  // Function to change language
  const changeLanguage = (langCode) => {
    console.log("LanguageContext: Changing language to:", langCode);

    if (translations[langCode]) {
      setLanguage(langCode);
      setIsRTL(languageMetadata[langCode].dir === "rtl");
      localStorage.setItem("language", langCode);

      // Update document direction and language
      document.documentElement.dir = languageMetadata[langCode].dir;
      document.documentElement.lang = langCode;

      // Add or remove RTL class on body
      if (languageMetadata[langCode].dir === "rtl") {
        document.body.classList.add("rtl");
        document.documentElement.classList.add("rtl");
        console.log("RTL classes added to body and html");
      } else {
        document.body.classList.remove("rtl");
        document.documentElement.classList.remove("rtl");
        console.log("RTL classes removed from body and html");
      }

      // Debug
      console.log("Language changed to:", langCode);
      console.log("Is RTL:", languageMetadata[langCode].dir === "rtl");
    } else {
      console.error("Invalid language code:", langCode);
    }
  };

  // Translation function - Enhanced to handle both translation sources and placeholders
  const t = (key, params = {}) => {
    // Safety check - if key is undefined or null, return empty string
    if (!key) return "";

    // Check if translations exist for current language
    if (!translations[language]) {
      console.error("Invalid language:", language);
      return key || "";
    }

    // First, always check the main translations object
    const currentTranslations = translations[language];
    let translatedText = "";

    // Check if key exists directly in the translations
    if (currentTranslations[key]) {
      translatedText = currentTranslations[key];
    } else if (key && typeof key === "string" && key.includes(".")) {
      // For nested keys with dot notation, split and navigate
      const keyParts = key.split(".");
      let value = currentTranslations;

      for (const part of keyParts) {
        if (value && typeof value === "object" && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }

      if (value !== null && typeof value === "string") {
        translatedText = value;
      }
    }

    // Additional fallback for Pashto language
    if (!translatedText && language === "ps") {
      // Check if key exists directly in psTranslations nested objects
      for (const section in psTranslations) {
        if (psTranslations[section]?.[key]) {
          translatedText = psTranslations[section][key];
          break;
        }
      }
    } else if (!translatedText && language === "dr") {
      // Additional fallback for Dari language
      if (drTranslations.dr?.[key]) {
        translatedText = drTranslations.dr[key];
      }
    }

    // If still no translation found, use the key itself
    if (!translatedText) {
      console.warn(
        `Translation not found for key: "${key}" in language: "${language}"`
      );
      translatedText = key;
    }

    // Handle placeholder replacement
    if (params && typeof params === "object") {
      Object.keys(params).forEach((paramKey) => {
        const placeholder = `{${paramKey}}`;
        translatedText = translatedText.replace(
          new RegExp(placeholder, "g"),
          params[paramKey]
        );
      });
    }

    return translatedText;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    isRTL,
    direction: languageMetadata[language].dir,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
