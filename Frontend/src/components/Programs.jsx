
import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaBriefcase, FaUniversity, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import axios from "axios";

// Your existing icons array
const icons = [
  <FaGraduationCap />,
  <FaBriefcase />,
  <FaUniversity />
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
        
        const response = await axios.get('http://localhost:4400/api/v1/departments/programs');
        console.log(response.data);
        
        // Check if the response contains the expected data structure
        if (!response.data || !response.data.data || !response.data.data.programs) {
          throw new Error('Received invalid data format from server');
        }
        
        // Check if programs array is empty
        if (response.data.data.programs.length === 0) {
          setError('No academic programs are currently available.');
          setPrograms([]);
          setLoading(false);
          return;
        }
        
        // Transform the data and add icons from your frontend
        const formattedPrograms = response.data.data.programs.map((program, index) => ({
          title: program.title,
          description: program.description,
          icon: icons[index % icons.length] // Cycle through your icons
        }));
        
        setPrograms(formattedPrograms);
      } catch (err) {
        console.error('Error fetching programs:', err);
        
        // Provide specific error messages based on the error
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 404) {
            setError('The academic programs resource could not be found. Please try again later.');
          } else if (err.response.status === 500) {
            setError('The server encountered an error. Our team has been notified.');
          } else {
            setError(`Server error: ${err.response.data.message || 'Unknown error occurred'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Loading state component
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
      <p className="text-gray-600">Loading academic programs...</p>
    </div>
  );

  // Error state component
  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-2">Unable to Load Programs</h3>
      <p className="text-gray-700 text-center max-w-md">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-4xl text-gray-400 mb-4">📚</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Programs Available</h3>
      <p className="text-gray-600 text-center max-w-md">
        There are currently no academic programs listed. Please check back later.
      </p>
    </div>
  );

  return (
    <section className='py-16 bg-gray-100 text-center'>
      <h2 className='text-3xl font-bold text-blue-900'>
        Our Academic Programs
      </h2>
      
      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : programs.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className='grid md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto px-4'>
          {programs.map((program, index) => (
            <div
              key={index}
              className='p-6 bg-white shadow-md rounded-md flex flex-col items-center'
            >
              <div className='text-4xl text-blue-600'>{program.icon}</div>
              <h3 className='text-xl font-semibold mt-4'>{program.title}</h3>
              <p className='text-gray-600 mt-2'>{program.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Programs;