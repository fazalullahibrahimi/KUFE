import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Award,
  Users,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AcademicPage = () => {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState([]);
  const [newsEvents, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Array of icons to cycle through for each program
  const icons = [BookOpen, Award, Users, Calendar];

  // Fetch programs, stats, and news/events in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Programs
        const programsResponse = await axios.get(
          "http://localhost:4400/api/v1/departments/programs"
        );
        console.log("Programs:", programsResponse.data);

        if (
          !programsResponse.data ||
          !programsResponse.data.data ||
          !programsResponse.data.data.programs
        ) {
          throw new Error("Received invalid programs data format from server");
        }

        if (programsResponse.data.data.programs.length === 0) {
          setError("No academic programs are currently available.");
          setPrograms([]);
        } else {
          const formattedPrograms = programsResponse.data.data.programs.map(
            (program, index) => ({
              title: program.title,
              description: program.description,
              icon: icons[index % icons.length],
            })
          );
          setPrograms(formattedPrograms);
        }

        // Fetch Stats
        const statsResponse = await axios.get(
          "http://localhost:4400/api/v1/departments/university-statistics"
        );
        console.log("Stats:", statsResponse.data);

        if (!statsResponse.data || !statsResponse.data.data) {
          throw new Error("Received invalid stats data format from server");
        }

        setStats(statsResponse.data.data.statistics);

        // Fetch News and Events
        const newsEventsResponse = await axios.get(
          "http://localhost:4400/api/v1/events/"
        );
        console.log("News & Events:", newsEventsResponse.data);

        // Handle single event case
        if (
          newsEventsResponse.data.data &&
          newsEventsResponse.data.data.latestEvent
        ) {
          // Convert single event to array
          setEvents([
            {
              id: newsEventsResponse.data.data.latestEvent._id,
              title: newsEventsResponse.data.data.latestEvent.title,
              description: newsEventsResponse.data.data.latestEvent.description,
              date: new Date(
                newsEventsResponse.data.data.latestEvent.date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: newsEventsResponse.data.data.latestEvent.location,
              type: newsEventsResponse.data.data.latestEvent.type,
              image: newsEventsResponse.data.data.latestEvent.image,
            },
          ]);
        }
        // Handle array of events case
        else if (
          newsEventsResponse.data.data &&
          Array.isArray(newsEventsResponse.data.data.events)
        ) {
          setEvents(
            newsEventsResponse.data.data.events.map((event) => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: event.location,
              type: event.type,
              image: event.image,
            }))
          );
        }
        // Handle other possible structures
        else if (
          newsEventsResponse.data.data &&
          Array.isArray(newsEventsResponse.data.data)
        ) {
          setEvents(
            newsEventsResponse.data.data.map((event) => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: event.location,
              type: event.type,
              image: event.image,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setError(
              "The resource could not be found. Please try again later."
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

    fetchData();
  }, []);

  return (
    <div className='min-h-screen bg-[#E8ECEF]'>
      <Navbar />

      {/* Hero Section */}
      <div className='pt-12 relative bg-[#1D3D6F] text-white'>
        <div className='container mx-auto px-4 py-10 md:py-16'>
          <div className='flex justify-between items-center'>
            <div className='max-w-2xl'>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white'>
                Academic Programs
              </h1>
              <p className='mt-2 text-white text-lg md:text-xl opacity-90'>
                Explore our undergraduate and graduate programs at the Faculty
                of Economics
              </p>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-12 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#E8ECEF] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6 mx-4 md:mx-auto max-w-6xl'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Academic Programs Section */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-[#1D3D6F]'>
          Our Academic Programs
        </h2>

        {/* Loading Spinner */}
        {loading && (
          <div className='flex justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-[#1D3D6F]' />
          </div>
        )}

        {/* Programs Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Array.isArray(programs) &&
              programs.map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <div
                    key={index}
                    className='bg-white p-6 shadow-lg rounded-xl text-center hover:shadow-xl transition-shadow border-t-4 border-[#1D3D6F]'
                  >
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                      {IconComponent && <IconComponent className='h-8 w-8' />}
                    </div>
                    <h3 className='text-xl font-semibold my-3 text-[#1D3D6F]'>
                      {program.title}
                    </h3>
                    <p className='text-gray-600 mb-4'>{program.description}</p>
                    <a
                      href='#'
                      className='text-[#1D3D6F] font-semibold inline-flex items-center hover:text-[#F7B500] transition-colors'
                    >
                      Learn more <ChevronRight className='h-4 w-4 ml-1' />
                    </a>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className='bg-[#1D3D6F] text-white py-12 text-center'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4'>
          {Array.isArray(stats) &&
            stats.map((stat, index) => (
              <div
                key={index}
                className='p-4 border border-[#2C4F85] rounded-lg'
              >
                <h3 className='text-3xl font-bold text-[#F7B500]'>
                  {stat.number}
                </h3>
                <p className='text-white mt-2'>{stat.label}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Latest News & Events */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-[#1D3D6F]'>
          Latest News & Events
        </h2>

        {loading ? (
          <div className='flex justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-[#1D3D6F]' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Array.isArray(newsEvents) && newsEvents.length > 0 ? (
              newsEvents.map((event, index) => (
                <div
                  key={index}
                  className='bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow'
                >
                  <div className='h-48 relative'>
                    <img
                      src={`http://localhost:4400/public/img/event/${event.image}`}
                      alt={event.title}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=300";
                      }}
                    />
                    <div className='absolute top-0 right-0 m-3'>
                      <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-full'>
                        {event.type || "Event"}
                      </span>
                    </div>
                  </div>
                  <div className='p-6'>
                    <p className='text-gray-500 text-sm mb-2 flex items-center'>
                      <Calendar className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                      {event.date}
                    </p>
                    <h3 className='text-xl font-semibold mb-2 text-[#1D3D6F]'>
                      {event.title}
                    </h3>
                    <p className='text-gray-600 mb-4 line-clamp-3'>
                      {event.description}
                    </p>
                    <a
                      href='#'
                      className='text-[#1D3D6F] font-semibold inline-flex items-center hover:text-[#F7B500] transition-colors'
                    >
                      Read more <ChevronRight className='h-4 w-4 ml-1' />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-1 md:col-span-3 text-center py-12 bg-white rounded-xl shadow-md'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <Calendar className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                  No events found
                </h3>
                <p className='text-gray-500'>
                  Check back later for upcoming events and news.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className='py-12 px-6 max-w-6xl mx-auto'>
        <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-xl shadow-lg overflow-hidden'>
          <div className='p-8 md:p-10 text-white'>
            <div className='flex flex-col md:flex-row items-center justify-between'>
              <div className='mb-6 md:mb-0 md:mr-6'>
                <h2 className='text-2xl font-bold mb-3'>Ready to Apply?</h2>
                <p className='opacity-90 max-w-xl'>
                  Take the next step in your academic journey. Apply now to join
                  our programs at the Faculty of Economics.
                </p>
              </div>
              <a
                href='#'
                className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 px-6 rounded-lg transition shadow-md'
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AcademicPage;
