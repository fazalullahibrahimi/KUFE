import React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "../translations/en";
import drTranslations from "../translations/dr";
import psTranslations from "../translations/ps";

// Define available languages
const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
    translations: enTranslations,
  },
  dr: {
    name: "دری",
    flag: "🇦🇫",
    dir: "rtl",
    translations: drTranslations,
  },
  ps: {
    name: "پښتو",
    flag: "🇦🇫",
    dir: "rtl",
    translations: psTranslations,
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(savedLanguage);
    setIsRTL(languages[savedLanguage].dir === "rtl");

    // Set document direction
    document.documentElement.dir = languages[savedLanguage].dir;
    document.documentElement.lang = savedLanguage;

    // Add RTL class to body if needed
    if (languages[savedLanguage].dir === "rtl") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, []);

  // Function to change language
  const changeLanguage = (lang) => {
    if (languages[lang]) {
      setCurrentLanguage(lang);
      setIsRTL(languages[lang].dir === "rtl");
      localStorage.setItem("language", lang);

      // Update document direction
      document.documentElement.dir = languages[lang].dir;
      document.documentElement.lang = lang;

      // Update RTL class on body
      if (languages[lang].dir === "rtl") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    }
  };

  // Translation function
  const t = (key) => {
    const keys = key.split(".");
    let value = languages[currentLanguage].translations;

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        let fallback = languages.en.translations;
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Return the key if no translation found
          }
        }
        return fallback;
      }
    }

    return value;
  };

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t,
    isRTL,
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
