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
      <FaSpinner className='animate-spin text-4xl text-blue-600 mb-4' />
      <p className='text-gray-600'>Loading academic programs...</p>
    </div>
  );

  // Error state
  const renderError = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <FaExclamationTriangle className='text-4xl text-yellow-500 mb-4' />
      <h3 className='text-xl font-semibold text-red-600 mb-2'>
        Unable to Load Programs
      </h3>
      <p className='text-gray-700 text-center max-w-md'>{error}</p>
      <button
        onClick={() => window.location.reload()}
        aria-label='Reload Page'
        className='mt-4 px-4 py-2 bg-[#1D3D6F] text-white rounded-md hover:bg-[#F7B500] transition-colors'
      >
        Reload Page
      </button>
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <div className='text-4xl text-gray-400 mb-4'>📚</div>
      <h3 className='text-xl font-semibold text-gray-700 mb-2'>
        No Programs Available
      </h3>
      <p className='text-gray-600 text-center max-w-md'>
        There are currently no academic programs listed. Please check back
        later.
      </p>
    </div>
  );

  return (
    <section className='py-16 bg-gray-100 text-center'>
      <h2
        className='text-3xl font-bold text-blue-900'
        role='heading'
        aria-level='2'
      >
        Our Academic Programs
      </h2>

      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : programs.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto px-4'>
          {programs.map((program, index) => (
            <div
              key={index}
              className='p-6 bg-[#2C4F85] shadow-md rounded-md flex flex-col items-center hover:scale-105 transition-transform duration-300'
            >
              <div className='mb-4'>{React.createElement(program.icon)}</div>
              <h3 className='text-xl font-semibold text-white'>
                {program.title}
              </h3>
              <p className='text-white mt-2'>{program.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Programs;
