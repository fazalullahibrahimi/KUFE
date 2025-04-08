
import React, { useEffect, useState } from "react";
import ImageBackGround from "../../public/Academics_Bg.jpg";
import Navbar from "../components/Navbar";
import axios from "axios";

const AcademicPage = () => {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState([]);
  const [newsEvents, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Array of icons to cycle through for each program
  const icons = ["🎓", "📚", "🎓", "💼", "🏆"];

  // Fetch programs, stats, and news/events in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Programs
        const programsResponse = await axios.get("http://localhost:4400/api/v1/departments/programs");
        console.log("Programs:", programsResponse.data);

        if (!programsResponse.data || !programsResponse.data.data || !programsResponse.data.data.programs) {
          throw new Error("Received invalid programs data format from server");
        }

        if (programsResponse.data.data.programs.length === 0) {
          setError("No academic programs are currently available.");
          setPrograms([]);
        } else {
          const formattedPrograms = programsResponse.data.data.programs.map((program, index) => ({
            title: program.title,
            description: program.description,
            icon: icons[index % icons.length],
          }));
          setPrograms(formattedPrograms);
        }

        // Fetch Stats
        const statsResponse = await axios.get("http://localhost:4400/api/v1/departments/university-statistics");
        console.log("Stats:", statsResponse.data);

        if (!statsResponse.data || !statsResponse.data.data) {
          throw new Error("Received invalid stats data format from server");
        }

       setStats(statsResponse.data.data.statistics);

        // Fetch News and Events
        const newsEventsResponse = await axios.get("http://localhost:4400/api/v1/events/");
        console.log("News & Events:", newsEventsResponse.data);

          // Handle single event case
          if (newsEventsResponse.data.data && newsEventsResponse.data.data.latestEvent) {
            // Convert single event to array
            setEvents([{
              id: newsEventsResponse.data.data.latestEvent._id,
              title: newsEventsResponse.data.data.latestEvent.title,
              description: newsEventsResponse.data.data.latestEvent.description,
              date: new Date(newsEventsResponse.data.data.latestEvent.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              location: newsEventsResponse.data.data.latestEvent.location,
              type: newsEventsResponse.data.data.latestEvent.type,
              image:newsEventsResponse.data.data.latestEvent.image,
            }]);
          } 
          // Handle array of events case
          else if (newsEventsResponse.data.data && Array.isArray(newsEventsResponse.data.data.events)) {
            setEvents(newsEventsResponse.data.data.events.map(event => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              location: event.location,
              type: event.type,
              image:event.image
            })));
          }
          // Handle other possible structures
          else if (newsEventsResponse.data.data && Array.isArray(newsEventsResponse.data.data)) {
            setEvents(newsEventsResponse.data.data.map(event => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              location: event.location,
              type: event.type,
              image:event.image
            })));
          }

      } catch (err) {
        console.error("Error fetching data:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setError("The resource could not be found. Please try again later.");
          } else if (err.response.status === 500) {
            setError("The server encountered an error. Our team has been notified.");
          } else {
            setError(`Server error: ${err.response.data.message || "Unknown error occurred"}`);
          }
        } else if (err.request) {
          setError("Unable to connect to the server. Please check your internet connection and try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* Error Message */}
      {error && (
        <div className='bg-red-500 text-white text-center p-4'>
          <p>{error}</p>
        </div>
      )}

      {/* Academic Programs Section */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10'>Our Academic Programs</h2>

        {/* Loading Spinner */}
        {loading && (
          <div className='flex justify-center'>
            <div className='spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Array.isArray(programs) &&
              programs.map((program, index) => (
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
        )}
      </section>

      {/* Stats Section */}
      <section className='bg-blue-900 text-white py-10 text-center'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6'>
          {Array.isArray(stats) &&
            stats.map((stat, index) => (
              <div key={index}>
                <h3 className='text-2xl font-bold'>{stat.number}</h3>
                <p className='text-gray-300'>{stat.label}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Latest News & Events */}
      {/* <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10'>Latest News & Events</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {Array.isArray(newsEvents) &&
            newsEvents.map((event, index) => (
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
      </section> */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
  <h2 className='text-3xl font-bold text-center mb-10'>Latest News & Events</h2>
  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
    {Array.isArray(newsEvents) &&
      newsEvents.map((event, index) => (
        <div key={index} className='bg-white p-4 shadow-md rounded-lg'>
          <img
            src={`/img/event/${event.image}`}
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
          <div>
            <h3 className='text-lg font-bold'>Contact Us</h3>
            <p>Kandahar University, Afghanistan</p>
            <p>📞 +93 700 000 000</p>
            <p>📧 info@kufe.edu.af</p>
          </div>
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

export default AcademicPage;
