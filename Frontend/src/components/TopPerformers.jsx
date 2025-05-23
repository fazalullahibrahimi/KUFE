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

  // Function to get image URL
  const getImageUrl = (imagePath, type) => {
    if (!imagePath) {
      return type === "student"
        ? "https://via.placeholder.com/150?text=Student"
        : "https://via.placeholder.com/150?text=Teacher";
    }

    // Check if the path already includes the full URL
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, construct the URL
    return `http://localhost:4400/public/images/${
      type === "student" ? "students" : "teachers"
    }/${imagePath}`;
  };

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
    <div className='bg-gradient-to-b from-[#E8ECEF] to-white py-16'>
      <div className='container mx-auto px-4'>
        {/* Top Students Section */}
        <div className='mb-16'>
          <div className='flex items-center justify-center mb-10'>
            <GraduationCap className='text-[#004B87] mr-3' size={28} />
            <h2 className='text-3xl font-bold text-[#1D3D6F] text-center'>
              {t("Top Students")}
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {topStudents.length > 0 ? (
              topStudents.map((student) => (
                <div
                  key={student._id}
                  className='bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl'
                >
                  <div className='bg-gradient-to-r from-[#004B87] to-[#1D3D6F] h-24 relative'>
                    <div className='absolute -bottom-12 left-1/2 transform -translate-x-1/2'>
                      <div className='w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white'>
                        <img
                          src={getImageUrl(student.profile_image, "student")}
                          alt={student.name}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=Student";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='pt-16 pb-6 px-6 text-center'>
                    <h3 className='text-xl font-bold text-[#1D3D6F] mb-1'>
                      {student.name}
                    </h3>
                    <p className='text-gray-500 mb-3'>
                      {t("Student ID")}: {student.student_id_number}
                    </p>

                    <div className='flex justify-center mb-4'>
                      <div className='bg-[#F7B500] text-[#1D3D6F] font-bold px-4 py-1 rounded-full text-sm flex items-center'>
                        <Award className='mr-1' size={16} />
                        {t("Top Score")}: {student.totalHighMarks}
                      </div>
                    </div>

                    <div className='flex flex-col space-y-2 text-sm'>
                      <div className='flex items-center justify-center text-gray-600'>
                        <Mail className='mr-2' size={16} />
                        {student.email}
                      </div>
                      {student.phone && (
                        <div className='flex items-center justify-center text-gray-600'>
                          <Phone className='mr-2' size={16} />
                          {student.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-3 text-center py-10'>
                <User className='mx-auto text-gray-300 mb-4' size={48} />
                <p className='text-gray-500'>
                  {t("No top students data available")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Teachers Section */}
        <div>
          <div className='flex items-center justify-center mb-10'>
            <BookOpen className='text-[#004B87] mr-3' size={28} />
            <h2 className='text-3xl font-bold text-[#1D3D6F] text-center'>
              {t("Top Teachers")}
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {topTeachers.length > 0 ? (
              topTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className='bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl'
                >
                  <div className='bg-gradient-to-r from-[#004B87] to-[#1D3D6F] h-24 relative'>
                    <div className='absolute -bottom-12 left-1/2 transform -translate-x-1/2'>
                      <div className='w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white'>
                        <img
                          src={getImageUrl(teacher.image, "teacher")}
                          alt={teacher.name}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=Teacher";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='pt-16 pb-6 px-6 text-center'>
                    <h3 className='text-xl font-bold text-[#1D3D6F] mb-1'>
                      {teacher.name}
                    </h3>
                    <p className='text-gray-500 mb-3'>{teacher.position}</p>

                    <div className='flex justify-center mb-4'>
                      <div className='bg-[#F7B500] text-[#1D3D6F] font-bold px-4 py-1 rounded-full text-sm'>
                        {teacher.department_name}
                      </div>
                    </div>

                    <div className='flex flex-col space-y-2 text-sm'>
                      {teacher.contact_info?.email && (
                        <div className='flex items-center justify-center text-gray-600'>
                          <Mail className='mr-2' size={16} />
                          {teacher.contact_info.email}
                        </div>
                      )}
                      {teacher.contact_info?.phone && (
                        <div className='flex items-center justify-center text-gray-600'>
                          <Phone className='mr-2' size={16} />
                          {teacher.contact_info.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-3 text-center py-10'>
                <User className='mx-auto text-gray-300 mb-4' size={48} />
                <p className='text-gray-500'>
                  {t("No top teachers data available")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;
