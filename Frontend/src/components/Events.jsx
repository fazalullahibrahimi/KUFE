import React, { useState, useEffect } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4400/api/v1/events/"
        );

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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className='py-16 bg-[#E8ECEF]'>
      <h2 className='text-3xl font-bold text-center text-[#1D3D6F]'>
        Latest News & Events
      </h2>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <p className='text-[#1D3D6F]'>Loading events...</p>
        </div>
      ) : error ? (
        <div className='text-center py-8 text-[#D32F2F]'>
          <p>{error}</p>
        </div>
      ) : (
        <div className='grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8 px-4'>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className='p-6 shadow-md bg-white rounded-md border border-[#1D3D6F]/10'
              >
                <p className='text-sm text-[#1D3D6F]/80'>{event.date}</p>
                <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                  {event.title}
                </h3>
                <p className='text-gray-700'>{event.description}</p>
                {event.location && (
                  <p className='text-sm text-[#1D3D6F]/70 mt-2'>
                    Location: {event.location}
                  </p>
                )}
                {event.type && (
                  <p className='text-xs bg-[#F7B500]/20 text-[#F7B500] px-2 py-1 rounded inline-block mt-2'>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className='col-span-3 text-center py-8 text-[#1D3D6F]/80'>
              No upcoming events at this time. Check back soon!
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Events;
