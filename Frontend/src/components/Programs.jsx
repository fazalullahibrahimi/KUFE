import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaBriefcase,
  FaUniversity,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

// Icons array as components for styling consistency
const icons = [
  () => <FaGraduationCap className='text-4xl text-white' />,
  () => <FaBriefcase className='text-4xl text-white' />,
  () => <FaUniversity className='text-4xl text-white' />,
];

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:4400/api/v1/departments/programs"
        );

        if (
          !response.data ||
          !response.data.data ||
          !response.data.data.programs
        ) {
          throw new Error("Received invalid data format from server");
        }

        if (response.data.data.programs.length === 0) {
          setError("No academic programs are currently available.");
          setPrograms([]);
          setLoading(false);
          return;
        }

        const formattedPrograms = response.data.data.programs.map(
          (program, index) => ({
            title: program.title,
            description: program.description,
            icon: icons[index % icons.length], // Cycle through icons
          })
        );

        setPrograms(formattedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setError(
              "The academic programs resource could not be found. Please try again later."
            );
          } else if (err.response.status === 500) {
            setError(
              "The server encountered an error. Our team has been notified."
            );
          } else {
            setError(
              `Server error: ${
                err.response.data.message || "Unknown error occurred"
              }`
            );
          }
        } else if (err.request) {
          setError(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Loading state
  const renderLoading = () => (
    <div className='flex flex-col items-center justify-center py-12'>
      <FaSpinner className='animate-spin text-4xl text-[#004B87] mb-4' />
      <p className="text-[#333333] font-['Roboto']">
        Loading academic programs...
      </p>
    </div>
  );

  // Error state
  const renderError = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <FaExclamationTriangle className='text-4xl text-[#F4B400] mb-4' />
      <h3 className="text-xl font-semibold text-red-600 mb-2 font-['Poppins']">
        Unable to Load Programs
      </h3>
      <p className="text-[#333333] text-center max-w-md font-['Roboto']">
        {error}
      </p>
      <button
        onClick={() => window.location.reload()}
        aria-label='Reload Page'
        className="mt-4 px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#F4B400] hover:text-[#333333] transition-colors font-['Roboto']"
      >
        Reload Page
      </button>
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <div className='text-4xl text-gray-400 mb-4'>📚</div>
      <h3 className="text-xl font-semibold text-[#333333] mb-2 font-['Poppins']">
        No Programs Available
      </h3>
      <p className="text-[#333333] text-center max-w-md font-['Roboto']">
        There are currently no academic programs listed. Please check back
        later.
      </p>
    </div>
  );

  return (
    <section
      className='py-16 relative overflow-hidden text-center'
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Background with pattern */}
      <div className='absolute inset-0 bg-[#F9F9F9] z-0'></div>

      <div className='relative z-10'>
        <h2
          className='text-3xl md:text-4xl font-bold text-[#004B87] mb-3'
          role='heading'
          aria-level='2'
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Our Academic Programs
        </h2>
 
        <div className='w-24 h-1 bg-[#F4B400] mx-auto mb-8 rounded-full'></div>

        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : programs.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 mt-8 max-w-7xl mx-auto px-4'>
            {programs.map((program, index) => (
              <div key={index} className='group relative h-full'>
                {/* Glass card */}
                <div
                  className='h-full p-6 md:p-8 rounded-xl overflow-hidden flex flex-col items-center transform transition-all duration-500 group-hover:scale-[1.02]'
                  style={{
                    background: "rgba(0, 75, 135, 0.85)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                  }}
                >
                  {/* Icon with glow effect */}
                  <div
                    className='mb-5 p-4 rounded-full relative'
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(0, 75, 135, 0.9), rgba(0, 59, 107, 1))",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className='absolute inset-0 rounded-full bg-[#F4B400] opacity-20 blur-md'></div>
                    {React.createElement(program.icon)}
                  </div>

                  {/* Content */}
                  <h3
                    className='text-xl md:text-2xl font-semibold text-white mb-3'
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {program.title}
                  </h3>

                  <p
                    className='text-white/90 text-sm md:text-base'
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {program.description}
                  </p>

                  {/* Learn more button that appears on hover */}
                  <div className='mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <button
                      className='px-4 py-2 bg-[#F4B400] text-[#333333] rounded-md hover:bg-[#e5a800] transition-colors font-medium'
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Learn More
                    </button>
                  </div>

                  {/* Hover effect light */}
                  <div className='absolute inset-0 -z-10 bg-gradient-to-tr from-[#004B87]/20 to-[#F4B400]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl'></div>
                </div>

                {/* Decorative elements */}
                <div className='absolute -bottom-2 -right-2 w-20 h-20 bg-[#F4B400]/20 rounded-full blur-xl -z-10'></div>
                <div className='absolute -top-2 -left-2 w-12 h-12 bg-[#004B87]/20 rounded-full blur-lg -z-10'></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
