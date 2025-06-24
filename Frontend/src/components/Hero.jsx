import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageBackGround from "../../public/image.jpg";
import { useLanguage } from "../contexts/LanguageContext";
import { FaChalkboardTeacher, FaBook, FaSpinner, FaUserGraduate } from "react-icons/fa";

const Hero = () => {
  const { t, language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set direction based on language
  const direction = ["ps", "dr"].includes(language) ? "rtl" : "ltr";

  // Handle scroll effect for animated elements
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch statistics from APIs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from multiple APIs (same as AboutPage)
        const [studentResponse, facultyResponse, programResponse] = await Promise.all([
          axios.get("http://localhost:4400/api/v1/students/studentcount"),
          axios.get("http://localhost:4400/api/v1/teachers/count"),
          axios.get("http://localhost:4400/api/v1/departments/programcount")
        ]);

        // Format the data for display
        const formattedStats = [
          {
            icon: <FaUserGraduate className='text-[#F4B400] text-2xl' />,
            title: t("Students") || "Students",
            value: `${studentResponse.data}+`,
          },
          {
            icon: <FaChalkboardTeacher className='text-[#F4B400] text-2xl' />,
            title: t("Faculty Members") || "Faculty Members",
            value: `${facultyResponse.data}+`,
          },
          {
            icon: <FaBook className='text-[#F4B400] text-2xl' />,
            title: t("Programs") || "Programs",
            value: programResponse.data.toString(),
          },
        ];

        setStatsData(formattedStats);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics");

        // Fallback to static data
        setStatsData([
          {
            icon: <FaUserGraduate className='text-[#F4B400] text-2xl' />,
            title: t("Students") || "Students",
            value: "5,000+",
          },
          {
            icon: <FaChalkboardTeacher className='text-[#F4B400] text-2xl' />,
            title: t("Faculty Members") || "Faculty Members",
            value: "50+",
          },
          {
            icon: <FaBook className='text-[#F4B400] text-2xl' />,
            title: t("Programs") || "Programs",
            value: "12",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]); // Re-fetch when language changes to update translations

  return (
    <section
      className='relative w-full min-h-[600px] md:min-h-[700px] bg-cover bg-center flex items-center justify-center overflow-hidden'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 75, 135, 0.85), rgba(0, 0, 0, 0.7)), url(${ImageBackGround})`,
        backgroundRepeat: "no-repeat",
      }}
      dir={direction}
    >
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
        <div className='absolute top-[10%] left-[5%] w-32 h-32 bg-[#F4B400] rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute bottom-[20%] right-[10%] w-40 h-40 bg-[#004B87] rounded-full opacity-20 blur-3xl'></div>
      </div>

      {/* Content container */}
      <div className='container mx-auto px-6 py-12 relative z-10'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          {/* Text content */}
          <div
            className={`text-white max-w-2xl mb-10 md:mb-0 text-center md:text-${
              direction === "rtl" ? "right" : "left"
            }`}
          >
            <div className='mb-4 inline-block'>
              <span className='bg-[#F4B400] text-[#004B87] text-sm font-bold py-1 px-3 rounded-full'>
                {t("Kandahar university")}
              </span>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins leading-tight'>
              {t("Faculty of economics")}
            </h1>

            <p className='text-lg md:text-xl opacity-90 mb-8 font-roboto max-w-xl'>
              {t("message")}
            </p>


          </div>

          {/* Stats cards */}
          <div className='grid grid-cols-1 gap-4 w-full md:w-auto md:max-w-sm'>
            {loading ? (
              // Loading state
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className='bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20 flex items-center justify-center'
                >
                  <FaSpinner className='animate-spin text-[#F4B400] text-2xl' />
                </div>
              ))
            ) : (
              // Actual stats data
              statsData.map((stat, index) => (
                <div
                  key={index}
                  className='bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105 hover:bg-opacity-15'
                >
                  <div className='flex items-center'>
                    <div
                      className={`p-3 rounded-full bg-[#004B87] bg-opacity-30 ${
                        direction === "rtl" ? "ml-4" : "mr-4"
                      }`}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className='text-gray-800 font-bold text-2xl'>
                        {stat.value}
                      </h3>
                      <p className='text-gray-800 text-sm opacity-80'>
                        {stat.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className='flex flex-col items-center'>
            <span className='text-white text-sm mb-2'>{t("Scroll Down")}</span>
            <div className='w-6 h-10 border-2 border-white rounded-full flex justify-center'>
              <div className='w-1 h-3 bg-white rounded-full animate-bounce mt-2'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className='absolute bottom-0 left-0 w-full'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 100'
          fill='#F9F9F9'
        >
          <path d='M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z'></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
