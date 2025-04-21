import React from "react";
import {
  BarChart,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  MessageSquare,
  Users,
} from "lucide-react";
import StatCard from "./common/StatCard";

const DashboardHome = () => {
  // Sample stats data
  const stats = [
    {
      title: "Students",
      value: 1245,
      change: "+12% from last semester",
      icon: <GraduationCap size={24} />,
      iconBg: "bg-[#004B87]",
    },
    {
      title: "Faculty",
      value: 48,
      change: "+3 new professors",
      icon: <Users size={24} />,
      iconBg: "bg-[#F4B400]",
    },
    {
      title: "Courses",
      value: 72,
      change: "Same as last semester",
      icon: <BookOpen size={24} />,
      iconBg: "bg-blue-500",
    },
    {
      title: "Research Papers",
      value: 156,
      change: "+24 this year",
      icon: <FileText size={24} />,
      iconBg: "bg-green-500",
    },
  ];

  // Sample announcements
  const announcements = [
    {
      id: 1,
      title: "Midterm Exams Schedule Announced",
      content:
        "The midterm examination schedule for Spring 2025 has been published. Please check your respective department for details.",
      date: "15 APR",
      category: "academic",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "Economics Research Symposium",
      content:
        "Faculty of Economics will host the annual research symposium on April 25th. All students and faculty members are encouraged to attend.",
      date: "14 APR",
      category: "event",
      timeAgo: "1 day ago",
    },
    {
      id: 3,
      title: "New Research Grant Opportunities",
      content:
        "The Ministry of Higher Education has announced new research grants for faculty members. Application deadline is May 15th.",
      date: "12 APR",
      category: "opportunity",
      timeAgo: "3 days ago",
    },
  ];

  // Sample events
  const events = [
    {
      id: 1,
      title: "Economics Research Symposium",
      location: "Main Auditorium, 10:00 AM - 4:00 PM",
      date: "Apr 25, 2025",
    },
    {
      id: 2,
      title: "Guest Lecture: International Trade",
      location: "Room 201, 2:00 PM - 4:00 PM",
      date: "May 2, 2025",
    },
    {
      id: 3,
      title: "Faculty Meeting",
      location: "Conference Room, 9:00 AM - 11:00 AM",
      date: "May 10, 2025",
    },
    {
      id: 4,
      title: "Research Grant Application Deadline",
      location: "Submit online by 11:59 PM",
      date: "May 15, 2025",
    },
  ];

  // Sample research publications
  const researchPublications = [
    {
      id: 1,
      title: "Economic Impact of Agricultural Development in Kandahar",
      authors: "Dr. Ahmad Ahmadi, Dr. Sarah Johnson",
      category: "Economics",
      date: "Published: April 10, 2025",
    },
    {
      id: 2,
      title: "Financial Market Analysis: Trends and Opportunities",
      authors: "Prof. Mohammad Karimi",
      category: "Finance",
      date: "Published: March 28, 2025",
    },
    {
      id: 3,
      title: "Sustainable Business Practices in Developing Economies",
      authors: "Dr. Fatima Noori, Dr. John Smith",
      category: "Business",
      date: "Published: March 15, 2025",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Dashboard Widgets */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Announcements */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-800'>
              Recent Announcements
            </h2>
            <button className='text-[#004B87] hover:text-[#003a6a] text-sm font-medium'>
              View All
            </button>
          </div>
          <div className='p-4 space-y-4'>
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className='flex border-b border-gray-100 pb-4 last:border-0 last:pb-0'
              >
                <div className='min-w-[60px] h-[60px] bg-[#004B87] text-white rounded flex flex-col items-center justify-center mr-4'>
                  <p className='text-lg font-bold leading-none'>
                    {announcement.date.split(" ")[0]}
                  </p>
                  <p className='text-xs'>{announcement.date.split(" ")[1]}</p>
                </div>
                <div>
                  <h3 className='font-medium text-gray-800'>
                    {announcement.title}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    {announcement.content}
                  </p>
                  <div className='flex items-center mt-2 text-xs'>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        announcement.category === "academic"
                          ? "bg-blue-100 text-blue-800"
                          : announcement.category === "event"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {announcement.category.charAt(0).toUpperCase() +
                        announcement.category.slice(1)}
                    </span>
                    <span className='ml-2 text-gray-500'>
                      {announcement.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-800'>
              Upcoming Events
            </h2>
            <button className='text-[#004B87] hover:text-[#003a6a] text-sm font-medium'>
              View Calendar
            </button>
          </div>
          <div className='p-4 space-y-4'>
            {events.map((event) => (
              <div
                key={event.id}
                className='border-b border-gray-100 pb-4 last:border-0 last:pb-0'
              >
                <div className='flex items-center text-sm text-gray-500 mb-1'>
                  <Calendar size={16} className='mr-2' />
                  <span>{event.date}</span>
                </div>
                <h3 className='font-medium text-gray-800'>{event.title}</h3>
                <p className='text-sm text-gray-600 mt-1'>{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Research Publications */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-800'>
              Recent Research Publications
            </h2>
            <button className='text-[#004B87] hover:text-[#003a6a] text-sm font-medium'>
              View All
            </button>
          </div>
          <div className='p-4 space-y-4'>
            {researchPublications.map((research) => (
              <div
                key={research.id}
                className='flex border-b border-gray-100 pb-4 last:border-0 last:pb-0'
              >
                <div className='w-10 h-10 bg-blue-100 text-[#004B87] rounded-full flex items-center justify-center mr-3'>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className='font-medium text-gray-800'>
                    {research.title}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    By: {research.authors}
                  </p>
                  <div className='flex items-center mt-2 text-xs'>
                    <span className='px-2 py-1 rounded-full bg-blue-100 text-blue-800'>
                      {research.category}
                    </span>
                    <span className='ml-2 text-gray-500'>{research.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='p-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-800'>Quick Access</h2>
          </div>
          <div className='p-4'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {[
                { title: "Course Catalog", icon: <BookOpen size={24} /> },
                { title: "Faculty Directory", icon: <Users size={24} /> },
                { title: "Academic Calendar", icon: <Calendar size={24} /> },
                { title: "Research Library", icon: <FileText size={24} /> },
                { title: "Announcements", icon: <MessageSquare size={24} /> },
                { title: "Analytics", icon: <BarChart size={24} /> },
              ].map((item, index) => (
                <div
                  key={index}
                  className='bg-gray-100 hover:bg-[#004B87] hover:text-white p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors cursor-pointer group'
                >
                  <div className='w-12 h-12 bg-white text-[#004B87] group-hover:bg-opacity-20 group-hover:text-white rounded-full flex items-center justify-center mb-2 transition-colors'>
                    {item.icon}
                  </div>
                  <span className='text-sm font-medium'>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
