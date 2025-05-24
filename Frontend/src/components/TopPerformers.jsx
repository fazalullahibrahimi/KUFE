import React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const TopPerformers = () => {
  const { t, language } = useLanguage();
  const [topStudents, setTopStudents] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch top students
        const studentsResponse = await fetch(
          "http://localhost:4400/api/v1/students/top-students"
        );
        if (!studentsResponse.ok) {
          throw new Error(
            `Failed to fetch top students: ${studentsResponse.status}`
          );
        }
        const studentsData = await studentsResponse.json();

        // Fetch top teachers
        const teachersResponse = await fetch(
          "http://localhost:4400/api/v1/teachers/top-teachers"
        );
        if (!teachersResponse.ok) {
          throw new Error(
            `Failed to fetch top teachers: ${teachersResponse.status}`
          );
        }
        const teachersData = await teachersResponse.json();

        // Update state with fetched data
        setTopStudents(studentsData.data || []);
        setTopTeachers(teachersData.data || []);
      } catch (err) {
        console.error("Error fetching top performers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, [language]); // Refetch when language changes

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]'></div>
          <p className='ml-4 text-lg text-gray-600'>{t("Loading")}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-6'>
          <h3 className='text-lg font-medium mb-2'>
            {t("Error Loading Data")}
          </h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white'>
      {/* Background Pattern */}
      <div className='absolute inset-0 z-0 opacity-5'>
        <div className='absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#004B87]'></div>
        <div className='absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-[#F7B500]'></div>
        <div className='absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#004B87]'></div>
      </div>

      <div className='container relative z-10 mx-auto px-6 max-w-7xl'>
        {/* Section Intro */}
        <div className='text-center mb-16 max-w-3xl mx-auto'>
          <h2 className='inline-block px-6 py-2 mb-4 text-sm font-semibold tracking-wider text-[#004B87] uppercase bg-blue-50 rounded-full'>
            {t("Excellence")}
          </h2>
          <h3 className='text-4xl font-bold text-[#1D3D6F] mb-4 leading-tight'>
            {t("Our Distinguished Community")}
          </h3>
          <p className='text-gray-600 text-lg'>
            {t(
              "Meet the exceptional individuals who represent the highest standards of academic achievement and teaching excellence at our university."
            )}
          </p>
        </div>

        {/* Top Students Section */}
        <div className='mb-24'>
          <div className='flex items-center justify-center mb-12'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center'>
                <span className='px-4 bg-white flex items-center'>
                  <GraduationCap className='text-[#004B87] mr-3' size={28} />
                  <h2 className='text-3xl font-bold text-[#1D3D6F]'>
                    {t("Top Students")}
                  </h2>
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {topStudents.length > 0 ? (
              topStudents.map((student) => (
                <div
                  key={student._id}
                  className='group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'
                >
                  <div className='bg-gradient-to-r from-[#004B87] to-[#1D3D6F] h-28 relative'>
                    {/* Decorative Elements */}
                    <div className='absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-bl-full'></div>
                    <div className='absolute bottom-0 left-0 w-16 h-16 bg-[#F7B500] opacity-10 rounded-tr-full'></div>

                    <div className='absolute -bottom-14 left-1/2 transform -translate-x-1/2'>
                      <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg'>
                        <img
                          src={
                            student.profile_image
                              ? `http://localhost:4400/public/img/students/${student.profile_image}`
                              : "https://via.placeholder.com/200x200/004B87/FFFFFF?text=Student"
                          }
                          alt={student.name}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200x200/004B87/FFFFFF?text=Student";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='pt-20 pb-8 px-8 text-center'>
                    <h3 className='text-2xl font-bold text-[#1D3D6F] mb-2 group-hover:text-[#004B87] transition-colors'>
                      {student.name}
                    </h3>
                    <p className='text-gray-500 mb-4 font-medium'>
                      {t("Student ID")}: {student.student_id_number}
                    </p>

                    <div className='flex justify-center mb-6'>
                      <div className='bg-gradient-to-r from-[#F7B500] to-[#F5A700] text-[#1D3D6F] font-bold px-5 py-2 rounded-full text-sm flex items-center shadow-sm'>
                        <Award className='mr-2' size={18} />
                        {t("Top Score")}: {student.totalHighMarks}
                      </div>
                    </div>

                    <div className='flex flex-col space-y-3 text-sm border-t border-gray-100 pt-5 mx-4'>
                      <div className='flex items-center justify-center text-gray-600 hover:text-[#004B87] transition-colors'>
                        <Mail className='mr-2' size={16} />
                        <a
                          href={`mailto:${student.email}`}
                          className='hover:underline'
                        >
                          {student.email}
                        </a>
                      </div>
                      {student.phone && (
                        <div className='flex items-center justify-center text-gray-600 hover:text-[#004B87] transition-colors'>
                          <Phone className='mr-2' size={16} />
                          <a
                            href={`tel:${student.phone}`}
                            className='hover:underline'
                          >
                            {student.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-3 text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100'>
                <User className='mx-auto text-gray-200 mb-4' size={64} />
                <p className='text-gray-500 font-medium'>
                  {t("No top students data available")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Teachers Section */}
        <div>
          <div className='flex items-center justify-center mb-12'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center'>
                <span className='px-4 bg-white flex items-center'>
                  <BookOpen className='text-[#004B87] mr-3' size={28} />
                  <h2 className='text-3xl font-bold text-[#1D3D6F]'>
                    {t("Top Teachers")}
                  </h2>
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {topTeachers.length > 0 ? (
              topTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className='group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'
                >
                  <div className='bg-gradient-to-r from-[#004B87] to-[#1D3D6F] h-28 relative'>
                    {/* Decorative Elements */}
                    <div className='absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-bl-full'></div>
                    <div className='absolute bottom-0 left-0 w-16 h-16 bg-[#F7B500] opacity-10 rounded-tr-full'></div>

                    <div className='absolute -bottom-14 left-1/2 transform -translate-x-1/2'>
                      <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg'>
                        <img
                          src={
                            teacher.image
                              ? `http://localhost:4400/public/img/teachers/${teacher.image}`
                              : "https://via.placeholder.com/200x200/004B87/FFFFFF?text=Teacher"
                          }
                          alt={teacher.name}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200x200/004B87/FFFFFF?text=Teacher";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='pt-20 pb-8 px-8 text-center'>
                    <h3 className='text-2xl font-bold text-[#1D3D6F] mb-2 group-hover:text-[#004B87] transition-colors'>
                      {teacher.name}
                    </h3>
                    <p className='text-gray-500 mb-4 font-medium'>
                      {teacher.position}
                    </p>

                    <div className='flex justify-center mb-6'>
                      <div className='bg-gradient-to-r from-[#F7B500] to-[#F5A700] text-[#1D3D6F] font-bold px-5 py-2 rounded-full text-sm shadow-sm'>
                        {teacher.department_name}
                      </div>
                    </div>

                    <div className='flex flex-col space-y-3 text-sm border-t border-gray-100 pt-5 mx-4'>
                      {teacher.contact_info?.email && (
                        <div className='flex items-center justify-center text-gray-600 hover:text-[#004B87] transition-colors'>
                          <Mail className='mr-2' size={16} />
                          <a
                            href={`mailto:${teacher.contact_info.email}`}
                            className='hover:underline'
                          >
                            {teacher.contact_info.email}
                          </a>
                        </div>
                      )}
                      {teacher.contact_info?.phone && (
                        <div className='flex items-center justify-center text-gray-600 hover:text-[#004B87] transition-colors'>
                          <Phone className='mr-2' size={16} />
                          <a
                            href={`tel:${teacher.contact_info.phone}`}
                            className='hover:underline'
                          >
                            {teacher.contact_info.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-3 text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100'>
                <User className='mx-auto text-gray-200 mb-4' size={64} />
                <p className='text-gray-500 font-medium'>
                  {t("No top teachers data available")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPerformers;
