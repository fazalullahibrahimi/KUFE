import React from "react";

const events = [
  {
    date: "March 5, 2025",
    title: "Economic Forum 2025",
    description: "Annual economic forum bringing together experts.",
  },
  {
    date: "March 10, 2025",
    title: "Graduation Ceremony 2025",
    description: "Celebrating our graduating class of 2025.",
  },
  {
    date: "March 5, 2025",
    title: "Research Symposium",
    description: "Faculty present their latest research findings.",
  },
];

const Events = () => {
  return (
    <section className='py-16'>
      <h2 className='text-3xl font-bold text-center text-blue-900'>
        Latest News & Events
      </h2>
      <div className='grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8'>
        {events.map((event, index) => (
          <div key={index} className='p-6 shadow-md bg-white rounded-md'>
            <p className='text-sm text-gray-500'>{event.date}</p>
            <h3 className='text-lg font-semibold'>{event.title}</h3>
            <p className='text-gray-600'>{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
