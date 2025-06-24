import React, { useState, useEffect, useRef } from "react";
import { Building, Calendar, Users, BookOpen, Award, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const FacultyShowcase = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Set direction based on language
  const direction = ["ps", "dr"].includes(language) ? "rtl" : "ltr";

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const facultyHighlights = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: t("about.establishment_history") || "Establishment History",
      description: t("about.establishment_text") || "Founded in 1381 (2002) with the vision of creating a center of excellence for economic education in southern Afghanistan.",
      color: "bg-[#1D3D6F]"
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: t("about.building_facilities") || "Modern Facilities",
      description: t("about.building_text") || "State-of-the-art building with modern classrooms, computer labs, library facilities, and administrative offices.",
      color: "bg-[#F7B500]"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: t("about.vision_statement") || "Our Vision",
      description: t("about.vision_detailed") || "To be a competitive faculty both locally and nationally by training young professionals in economics-related spheres.",
      color: "bg-[#1D3D6F]"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: t("about.mission_statement") || "Our Mission", 
      description: t("about.mission_detailed") || "To prepare professional and competent graduates in economics and related fields that meet society's needs.",
      color: "bg-[#F7B500]"
    }
  ];

  return (
    <section
      ref={sectionRef}
      dir={direction}
      className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-0.5 w-6 bg-[#F7B500]"></div>
            <span className="mx-2 text-[#F7B500] font-semibold">
              {t("about.faculty_introduction") || "FACULTY SHOWCASE"}
            </span>
            <div className="h-0.5 w-6 bg-[#F7B500]"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]">
            {t("about.faculty_introduction") || "Faculty of Economics Introduction"}
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            {t("about.faculty_intro_text") || "The Faculty of Economics at Kandahar University was established in 1381 (2002) as one of the pioneering faculties of the university."}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Faculty Building Representation */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? "translate-x-0 opacity-100" : `${direction === "rtl" ? "translate-x-10" : "-translate-x-10"} opacity-0`
          }`}>
            <div className="relative">
              {/* Building illustration placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Building className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{t("kandahar_university") || "Kandahar University"}</h3>
                    <h4 className="text-xl mb-4">{t("faculty_of_economics") || "Faculty of Economics"}</h4>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {t("about.building_text") || "Modern multi-story building equipped with state-of-the-art facilities for optimal learning environment."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#F7B500] rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#1D3D6F] rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Faculty Highlights */}
          <div className={`space-y-6 transition-all duration-1000 transform ${
            isVisible ? "translate-x-0 opacity-100" : `${direction === "rtl" ? "-translate-x-10" : "translate-x-10"} opacity-0`
          }`}>
            {facultyHighlights.map((highlight, index) => (
              <div
                key={index}
                className={`group p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${
                  highlight.color === "bg-[#1D3D6F]" ? "border-[#1D3D6F]" : "border-[#F7B500]"
                }`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${highlight.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {highlight.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1D3D6F] mb-2 group-hover:text-[#F7B500] transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-gray-400 group-hover:text-[#F7B500] transition-colors duration-300 ${
                    direction === "rtl" ? "rotate-180" : ""
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives Section */}
        <div className={`mt-20 transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1D3D6F] mb-4">
              {t("about.objectives_title") || "Our Objectives"}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("about.objectives_description") || "Key objectives that guide our educational mission and academic excellence."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              t("about.objective_1") || "Identify the role of supply and demand in a market economy",
              t("about.objective_2") || "Develop academic & administrative professional skills",
              t("about.objective_3") || "Identify the necessary conditions for market economies to function well",
              t("about.objective_4") || "Understanding the economic role of government policy and the Central Bank",
              t("about.objective_5") || "Analyze the economic role of the banking system in economic development"
            ].map((objective, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#F7B500]/30"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center text-[#1D3D6F] font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed group-hover:text-[#1D3D6F] transition-colors duration-300">
                    {objective}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacultyShowcase;
