import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSpinner,
  FaUserGraduate,
  FaBriefcase,
  FaChalkboardTeacher,
  FaBookOpen,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import useCountUp from "../hooks/useCountUp";
import useElementOnScreen from "../hooks/useElementOnScreen";

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom hook for intersection observer
  const [containerRef, isVisible] = useElementOnScreen({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Define icons for each stat type
  const statIcons = [
    FaUserGraduate,
    FaBriefcase,
    FaChalkboardTeacher,
    FaBookOpen,
  ];

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4400/api/v1/departments/university-statistics"
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.statistics
      ) {
        setStats(response.data.data.statistics);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      // Fallback to static data if API fails
      setStats([
        { number: "2,500+", label: "Students Enrolled" },
        { number: "85%", label: "Employment Rate" },
        { number: "50+", label: "Faculty Members" },
        { number: "30+", label: "Research Papers" },
      ]);
      setError("Could not load live statistics. Showing estimated values.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRetry = () => {
    setError(null);
    setStats([]);
    fetchStats();
  };

  if (loading) {
    return (
      <section className='bg-gradient-to-b from-[#004B87] to-[#003366] text-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col justify-center items-center py-12'>
            <FaSpinner className='animate-spin text-4xl text-[#F4B400] mb-4' />
            <h2 className='text-2xl font-poppins font-semibold'>
              Loading Statistics...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='relative bg-gradient-to-b from-[#004B87] to-[#003366] text-white py-16 overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-64 h-64 bg-[#F4B400] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full opacity-10 translate-x-1/3 translate-y-1/3'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <h2 className='text-3xl md:text-4xl font-poppins font-bold text-center mb-12 text-white'>
          University <span className='text-[#F4B400]'>Statistics</span>
        </h2>

        <div
          ref={containerRef}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto'
        >
          {stats.map((stat, index) => {
            // Extract the numeric part and any suffix
            const { value, formattedValue } = parseStatValue(stat.number);
            const Icon = statIcons[index % statIcons.length];

            return (
              <div
                key={index}
                className='stat-card bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20 border border-white border-opacity-20'
                style={{
                  animationDelay: `${index * 100}ms`,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className='flex justify-center mb-4'>
                  <div className='w-16 h-16 rounded-full bg-[#F4B400] bg-opacity-20 flex items-center justify-center'>
                    <Icon className='text-[#F4B400] text-3xl' />
                  </div>
                </div>
                <h3 className='text-3xl sm:text-4xl font-poppins font-bold text-gray-800 flex justify-center items-baseline'>
                  <CountUpValue
                    value={value}
                    formattedValue={formattedValue}
                    inView={isVisible}
                    delay={index * 200}
                  />
                </h3>
                <p className='text-lg mt-2 text-gray-600 font-roboto'>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {error && (
          <div className='mt-8 text-center'>
            <div className='inline-flex items-center bg-[#F4B400] bg-opacity-20 text-[#F4B400] px-4 py-2 rounded-lg'>
              <FaExclamationTriangle className='mr-2' />
              <p>{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className='flex items-center mx-auto mt-4 bg-[#F4B400] text-[#004B87] px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium'
            >
              <FaSync className='mr-2' /> Retry
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Helper component for the animated counter
const CountUpValue = ({ value, formattedValue, inView, delay = 0 }) => {
  const { countUp } = useCountUp({
    start: 0,
    end: value,
    duration: 2000,
    delay: delay,
    enabled: inView,
  });

  // Format the count up value to match the original format
  const formatCountUp = () => {
    if (formattedValue.includes("%")) {
      return `${Math.round(countUp)}%`;
    } else if (formattedValue.includes("+")) {
      return `${Math.round(countUp).toLocaleString()}+`;
    } else {
      return Math.round(countUp).toLocaleString();
    }
  };

  return <>{formatCountUp()}</>;
};

// Helper function to parse stat values
const parseStatValue = (statValue) => {
  // Extract the numeric part
  const numericPart = statValue.replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(numericPart);

  return {
    value,
    formattedValue: statValue,
  };
};

export default Stats;
