/* eslint-disable no-unused-vars */
import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
  FaArrowRight,
  FaFilter,
} from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { t, direction, language } = useLanguage();
  console.log(direction);
  // Event type icons mapping
  const eventTypeIcons = {
    academic: FaGraduationCap,
    social: FaUsers,
    workshop: FaChalkboardTeacher,
    seminar: FaBook,
    default: FaCalendarAlt,
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4400/api/v1/events/");

      console.log("API Response:", response.data);

      if (response.data && response.data.status === "success") {
        if (response.data.data && response.data.data.latestEvent) {
          setEvents([
            {
              id: response.data.data.latestEvent._id,
              title: response.data.data.latestEvent.title,
              description: response.data.data.latestEvent.description,
              date: new Date(
                response.data.data.latestEvent.date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: response.data.data.latestEvent.location,
              type: response.data.data.latestEvent.type,
            },
          ]);
        } else if (
          response.data.data &&
          Array.isArray(response.data.data.events)
        ) {
          setEvents(
            response.data.data.events.map((event) => ({
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
            }))
          );
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setEvents(
            response.data.data.map((event) => ({
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
            }))
          );
        } else {
          throw new Error("Unexpected data format from API");
        }
      } else {
        throw new Error("API request failed");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");

      // For demo purposes, set some sample events if API fails
      setEvents([
        {
          id: "1",
          title: "Annual Economics Conference",
          description:
            "Join us for the annual economics conference featuring keynote speakers from around the world discussing current economic trends.",
          date: "May 15, 2023",
          location: "Main Auditorium",
          type: "academic",
        },
        {
          id: "2",
          title: "Student Networking Event",
          description:
            "Connect with fellow students and faculty members in this casual networking event.",
          date: "June 2, 2023",
          location: "Student Center",
          type: "social",
        },
        {
          id: "3",
          title: "Research Methodology Workshop",
          description:
            "Learn advanced research methodologies and techniques from our experienced faculty.",
          date: "June 10, 2023",
          location: "Room 302",
          type: "workshop",
        },
        {
          id: "4",
          title: "Economic Policy Seminar",
          description:
            "A detailed discussion on current economic policies and their impact on developing nations.",
          date: "June 15, 2023",
          location: "Conference Hall B",
          type: "seminar",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [language]);

  const handleRetry = () => {
    setError(null);
    setEvents([]);
    setLoading(true);
    // Re-fetch events
    fetchEvents();
  };

  const getEventTypeColor = (type) => {
    const typeColors = {
      academic: "bg-blue-500 text-white",
      social: "bg-green-500 text-white",
      workshop: "bg-purple-500 text-white",
      seminar: "bg-amber-500 text-white",
    };
    return typeColors[type] || "bg-[#F4B400] text-[#004B87]";
  };

  const getEventIcon = (type) => {
    const IconComponent = eventTypeIcons[type] || eventTypeIcons.default;
    return <IconComponent />;
  };

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.type === activeFilter);

  const displayEvents = showAllEvents
    ? filteredEvents
    : filteredEvents.slice(0, 6);

  // Get unique event types for filter
  const eventTypes = ["all", ...new Set(events.map((event) => event.type))];

  return (
    <section
      dir={direction}
      className='relative py-16 bg-gradient-to-b from-[#F9F9F9] to-[#E8ECEF]'
    >
      {/* Decorative top border */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#004B87] via-[#F4B400] to-[#004B87]'></div>

      <div className='container mx-auto px-4'>
        {/* Section header */}
        <div className='text-center mb-12'>
          <h2
            className='text-3xl md:text-4xl font-bold text-[#004B87] inline-block relative'
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {t("Latest News & Events")}
            <span className='block h-1 w-24 bg-[#F4B400] mx-auto mt-2 rounded-full'></span>
          </h2>
          <p
            className='text-[#333333] mt-4 max-w-2xl mx-auto'
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {t(
              "Stay updated with the latest happenings, announcements, and events at the Faculty of Economics."
            )}
          </p>
        </div>

        {/* Event type filters */}
        {events.length > 0 && !loading && !error && (
          <div className='flex flex-wrap justify-center gap-2 mb-8'>
            <div className='flex items-center bg-white rounded-full px-3 py-1 shadow-sm mr-2'>
              <FaFilter className='text-[#004B87] mr-2' />
              <span className='text-sm text-[#004B87] font-medium'>
                {t("Filter")}
              </span>
            </div>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === type
                    ? "bg-[#004B87] text-white shadow-md"
                    : "bg-white text-[#004B87] hover:bg-[#004B87]/10"
                }`}
              >
                {type === "all"
                  ? t("All Events")
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-16'>
            <FaSpinner className='text-4xl text-[#004B87] animate-spin mb-4' />
            <p
              className='text-[#004B87] font-medium'
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <p>{t("Loading events...")}</p>
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center'>
              <FaExclamationTriangle className='text-3xl text-red-500 mx-auto mb-4' />
              <h3
                className={`text-xl font-semibold ${
                  direction === "rtl" ? "text-right" : "text-left"
                } text-red-700 mb-2`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t("Unable to Load Events")}
              </h3>
              <p
                className='text-red-600 mb-4'
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                {t("Failed to load events. Please try again later.")}
              </p>
              <button
                onClick={handleRetry}
                className='inline-flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003366] transition-colors'
              >
                <FaSync className='mr-2' /> {t("Retry")}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='w-20 h-20 bg-[#F4B400]/20 rounded-full flex items-center justify-center mb-4'>
              <FaCalendarAlt className='text-3xl text-[#F4B400]' />
            </div>
            <h3
              className='text-xl font-semibold text-[#004B87] mb-2'
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t("No Events Scheduled")}
            </h3>
            <p
              className='text-[#333333] text-center max-w-md'
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {t(
                "There are no upcoming events at this time. Please check back soon for new announcements and events."
              )}
            </p>
          </div>
        )}

        {/* Events grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
              {displayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    index === 0 && events.length > 1
                      ? "md:col-span-2 lg:col-span-2"
                      : ""
                  }`}
                >
                  {/* Glass card */}
                  <div className='h-full bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
                    {/* Card header with date and type */}
                    <div className='flex justify-between items-start p-4 border-b border-gray-100'>
                      <div className='flex items-center'>
                        <div className='bg-[#004B87]/10 p-2 rounded-lg mr-3'>
                          <FaCalendarAlt className='text-[#004B87]' />
                        </div>
                        <span
                          className='text-[#004B87] font-medium'
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {event.date}
                        </span>
                      </div>
                      {event.type && (
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                            event.type
                          )}`}
                        >
                          {getEventIcon(event.type)}
                          <span>
                            {event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Card content */}
                    <div className='p-5'>
                      <h3
                        className='text-xl font-semibold text-[#004B87] mb-3'
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {event.title}
                      </h3>
                      <p
                        className='text-[#333333] mb-4'
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {index === 0 && events.length > 1
                          ? event.description
                          : event.description.length > 120
                          ? `${event.description.substring(0, 120)}...`
                          : event.description}
                      </p>

                      {/* Location */}
                      {event.location && (
                        <div className='flex items-center text-sm text-[#004B87]/70 mb-4'>
                          <FaMapMarkerAlt className='mr-2' />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {/* Read more button */}
                      <button className='mt-2 inline-flex items-center text-[#F4B400] font-medium hover:text-[#004B87] transition-colors'>
                        {t("Read more")}{" "}
                        <FaArrowRight className='ml-1 text-xs' />
                      </button>
                    </div>

                    {/* Decorative elements */}
                    <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#F4B400]/10 to-transparent rounded-bl-full -z-10'></div>
                    <div className='absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#004B87]/10 to-transparent rounded-tr-full -z-10'></div>
                  </div>
                </div>
              ))}
            </div>

            {/* View more/less button */}
            {filteredEvents.length > 6 && (
              <div className='text-center mt-10'>
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className='inline-flex items-center px-6 py-3 bg-[#004B87] text-white rounded-md hover:bg-[#003366] transition-colors'
                >
                  {showAllEvents ? t("Show Less Events") : t("View All Events")}
                  <FaArrowRight
                    className={`ml-2 transition-transform duration-300 ${
                      showAllEvents ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Events;
