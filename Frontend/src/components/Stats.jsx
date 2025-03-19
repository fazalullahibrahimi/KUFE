import React from "react";

const stats = [
  { number: "2,500+", label: "Students Enrolled" },
  { number: "85%", label: "Employment Rate" },
  { number: "50+", label: "Faculty Members" },
  { number: "30+", label: "Research Papers" },
];

const Stats = () => {
  return (
    <section className='bg-blue-900 text-white py-12'>
      <div className='flex justify-center gap-10 text-center'>
        {stats.map((stat, index) => (
          <div key={index} className='text-lg font-semibold'>
            <h3 className='text-3xl font-bold'>{stat.number}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
