import React from "react";
import ImageBackGround from "../../public/Academics_Bg.jpg";
import Navbar from "../components/Navbar";
const AcademicPage = () => {
  return (
    <div className='font-sans'>
      <Navbar />
      {/* Hero Section */}
      <header
        className='relative h-[400px] bg-cover bg-center flex items-center justify-center text-white'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${ImageBackGround})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className='absolute inset-0 bg-opacity-50'></div>
        <h1 className='relative text-4xl font-bold'>Our Academic Programs</h1>
      </header>

      {/* Academic Programs Section */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10'>
          Our Academic Programs
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {programs.map((program, index) => (
            <div
              key={index}
              className='bg-white p-6 shadow-md rounded-lg text-center'
            >
              <div className='text-5xl'>{program.icon}</div>
              <h3 className='text-xl font-semibold my-3'>{program.title}</h3>
              <p className='text-gray-600'>{program.description}</p>
              <a
                href='#'
                className='text-blue-600 font-semibold mt-3 inline-block'
              >
                Learn more +
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-blue-900 text-white py-10 text-center'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6'>
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className='text-2xl font-bold'>{stat.value}+</h3>
              <p className='text-gray-300'>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News & Events */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10'>
          Latest News & Events
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {newsEvents.map((event, index) => (
            <div key={index} className='bg-white p-4 shadow-md rounded-lg'>
              <img
                src={event.image}
                alt={event.title}
                className='rounded-lg mb-3 w-full h-40 object-cover'
              />
              <p className='text-gray-500 text-sm'>{event.date}</p>
              <h3 className='text-xl font-semibold'>{event.title}</h3>
              <p className='text-gray-600'>{event.description}</p>
              <a
                href='#'
                className='text-blue-600 font-semibold mt-3 inline-block'
              >
                Read more +
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className='bg-blue-900 text-white py-10 px-6'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Contact */}
          <div>
            <h3 className='text-lg font-bold'>Contact Us</h3>
            <p>Kandahar University, Afghanistan</p>
            <p>📞 +93 700 000 000</p>
            <p>📧 info@kufe.edu.af</p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-bold'>Quick Links</h3>
            <ul className='text-gray-300'>
              <li>
                <a href='#'>Academic Calendar</a>
              </li>
              <li>
                <a href='#'>Library</a>
              </li>
              <li>
                <a href='#'>Research</a>
              </li>
              <li>
                <a href='#'>Student Life</a>
              </li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h3 className='text-lg font-bold'>Resources</h3>
            <ul className='text-gray-300'>
              <li>
                <a href='#'>Student Portal</a>
              </li>
              <li>
                <a href='#'>Faculty Portal</a>
              </li>
              <li>
                <a href='#'>E-Learning</a>
              </li>
              <li>
                <a href='#'>Downloads</a>
              </li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h3 className='text-lg font-bold'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a href='#'>
                <i className='fab fa-facebook-f'></i>
              </a>
              <a href='#'>
                <i className='fab fa-twitter'></i>
              </a>
              <a href='#'>
                <i className='fab fa-instagram'></i>
              </a>
              <a href='#'>
                <i className='fab fa-linkedin'></i>
              </a>
            </div>
          </div>
        </div>
        <p className='text-center mt-6 text-gray-300'>
          © 2025 Kandahar University Faculty of Economics. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

// Static Data
const programs = [
  {
    title: "Bachelor in Economics",
    description:
      "Comprehensive program covering micro and macroeconomics, finance, and policy analysis.",
    icon: "🎓",
  },
  {
    title: "Business Administration",
    description:
      "Develop essential business skills with a focus on management and entrepreneurship.",
    icon: "📊",
  },
  {
    title: "Banking & Finance",
    description:
      "Specialized program in financial markets, banking operations, and investment.",
    icon: "💰",
  },
];

const stats = [
  { label: "Students Enrolled", value: "2,500" },
  { label: "Employment Rate", value: "85%" },
  { label: "Faculty Members", value: "50" },
  { label: "Research Papers", value: "30" },
];

const newsEvents = [
  {
    date: "March 5, 2025",
    title: "Economic Forum 2025",
    description:
      "Annual economic forum bringing together industry experts and academics.",
    image: "/images/forum.jpg",
  },
  {
    date: "March 10, 2025",
    title: "Graduation Ceremony 2025",
    description:
      "Celebrating the achievements of our graduating class of 2025.",
    image: "/images/graduation.jpg",
  },
  {
    date: "March 5, 2025",
    title: "Research Symposium",
    description: "Faculty members present their latest research findings.",
    image: "/images/research.jpg",
  },
];

export default AcademicPage;
