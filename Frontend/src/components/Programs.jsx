import React from "react";
import { FaGraduationCap, FaBriefcase, FaUniversity } from "react-icons/fa";

const programs = [
  {
    title: "Bachelor in Economics",
    description: "Micro & macroeconomics, finance, and policy analysis.",
    icon: <FaGraduationCap />,
  },
  {
    title: "Business Administration",
    description: "Management and entrepreneurship skills.",
    icon: <FaBriefcase />,
  },
  {
    title: "Banking & Finance",
    description: "Financial markets, banking operations, and investment.",
    icon: <FaUniversity />,
  },
];

const Programs = () => {
  return (
    <section className='py-16 bg-gray-100 text-center'>
      <h2 className='text-3xl font-bold text-blue-900'>
        Our Academic Programs
      </h2>
      <div className='grid md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto'>
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
    </section>
  );
};

export default Programs;
