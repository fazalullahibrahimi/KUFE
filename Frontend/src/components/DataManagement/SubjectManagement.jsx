import React from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  BarChart3,
  Calendar,
  User,
  Award,
} from "lucide-react";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

const SubjectManagement = () => {
  const { t, isRTL } = useLanguage();

  // State for data from API
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    semesters: true,
    subjects: true,
    teachers: true,
  });

  // State for UI
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Form data for adding/editing subjects
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    semester_id: "",
    credit_hours: 3,
    teacher_id: "",
  });

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create headers with auth token
  const createHeaders = (includeContentType = true) => {
    const token = getAuthToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, teachers: true }));
        const response = await fetch("http://127.0.0.1:4400/api/v1/teachers/", {
          headers: createHeaders(),
        });
        const data = await response.json();
        console.log("Teachers API Response:", data);

        if (data.status === "success" && data.data && data.data.teachers) {
          setTeachers(data.data.teachers);
        } else {
          console.error(
            "Unexpected API response structure for teachers:",
            data
          );
          setTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, teachers: false }));
      }
    };

    fetchTeachers();
  }, []);

  // Fetch semesters from API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, semesters: true }));
        const response = await fetch(
          "http://127.0.0.1:4400/api/v1/semesters/",
          {
            headers: createHeaders(),
          }
        );
        const data = await response.json();
        console.log("Semesters API Response:", data);

        // Handle the actual API response structure: { status, message, data: { semesters: [...] } }
        if (data.status === "success" && data.data && data.data.semesters && Array.isArray(data.data.semesters)) {
          setSemesters(data.data.semesters);
          console.log("Semesters loaded:", data.data.semesters);
        } else {
          console.error("Unexpected API response structure:", data);
          console.error("Expected: { status: 'success', data: { semesters: [...] } }");
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, semesters: false }));
      }
    };

    fetchSemesters();
  }, []);



  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, subjects: true }));
        const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
          headers: createHeaders(),
        });
        const data = await response.json();
        console.log("Subjects API Response:", data);

        // Handle the actual API response structure: { status, message, data: { subjects: [...] } }
        if (data.status === "success" && data.data && data.data.subjects && Array.isArray(data.data.subjects)) {
          // The API already provides populated semester and teacher data
          const enrichedSubjects = data.data.subjects.map((subject) => {
            return {
              ...subject,
              // Extract semester name from populated semester_id object
              semester_name: subject.semester_id?.name || "Unknown Semester",
              // Extract teacher name from populated teacher_id object
              teacher_name: subject.teacher_id?.name || "No Teacher Assigned",
            };
          });
          setSubjects(enrichedSubjects);
          console.log("Subjects loaded:", enrichedSubjects);
        } else {
          console.error("Unexpected API response structure:", data);
          console.error("Expected: { status: 'success', data: { subjects: [...] } }");
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, subjects: false }));
      }
    };

    fetchSubjects();
  }, [teachers, semesters]); // Add semesters as dependency to ensure subjects are enriched after semesters are loaded

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({
      ...subjectFormData,
      [name]: name === "credit_hours" ? Number(value) : value,
    });
  };

  // CRUD operations for subjects
  const handleAddSubject = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(subjectFormData),
      });

      const data = await response.json();
      console.log("Add subject response:", data);

      // Check for success status and message
      if (data.status === "success" && data.message === "Subject created successfully") {
        console.log("Subject created successfully");

        // Refresh the subjects list to get the updated data with proper structure
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/subjects/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.status === "success" && refreshData.data && refreshData.data.subjects) {
          const enrichedSubjects = refreshData.data.subjects.map((subject) => ({
            ...subject,
            semester_name: subject.semester_id?.name || "Unknown Semester",
            teacher_name: subject.teacher_id?.name || "No Teacher Assigned",
          }));
          setSubjects(enrichedSubjects);
          console.log("Subjects list updated with new record");
        }

        setIsAddSubjectModalOpen(false);
        resetSubjectForm();
        alert("Subject added successfully!");
      } else {
        console.error("Error adding subject:", data);
        alert(data.message || "Failed to add subject. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Please try again.");
    }
  };

  const handleEditSubject = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/subjects/${editingSubject._id}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(subjectFormData),
        }
      );

      const data = await response.json();
      console.log("Edit subject response:", data);

      // Check for success status and message
      if (data.status === "success") {
        console.log("Subject updated successfully");

        // Refresh the subjects list to get the updated data with proper structure
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/subjects/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.status === "success" && refreshData.data && refreshData.data.subjects) {
          const enrichedSubjects = refreshData.data.subjects.map((subject) => ({
            ...subject,
            semester_name: subject.semester_id?.name || "Unknown Semester",
            teacher_name: subject.teacher_id?.name || "No Teacher Assigned",
          }));
          setSubjects(enrichedSubjects);
          console.log("Subjects list updated after edit");
        }

        setIsEditSubjectModalOpen(false);
        resetSubjectForm();
        alert(data.message || "Subject updated successfully!");
      } else {
        console.error("Error updating subject:", data);
        alert(data.message || "Failed to update subject. Please try again.");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Failed to update subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/subjects/${subjectId}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      const data = await response.json();
      console.log("Delete subject response:", data);

      // Check for success status and message
      if (data.status === "success") {
        console.log("Subject deleted successfully");

        // Refresh the subjects list to get the updated data
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/subjects/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.status === "success" && refreshData.data && refreshData.data.subjects) {
          const enrichedSubjects = refreshData.data.subjects.map((subject) => ({
            ...subject,
            semester_name: subject.semester_id?.name || "Unknown Semester",
            teacher_name: subject.teacher_id?.name || "No Teacher Assigned",
          }));
          setSubjects(enrichedSubjects);
          console.log("Subjects list updated after deletion");
        }

        alert(data.message || "Subject deleted successfully!");
      } else {
        console.error("Error deleting subject:", data);
        alert(data.message || "Failed to delete subject. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  const resetSubjectForm = () => {
    setSubjectFormData({
      name: "",
      code: "",
      semester_id: "",
      credit_hours: 3,
      teacher_id: "",
    });
    setEditingSubject(null);
  };

  const openEditSubjectModal = (subject) => {
    setEditingSubject(subject);

    // Handle teacher_id which can be an object
    let teacherId = "";
    if (subject.teacher_id) {
      teacherId =
        typeof subject.teacher_id === "object"
          ? subject.teacher_id._id
          : subject.teacher_id;
    }

    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      semester_id: subject.semester_id._id,
      credit_hours: subject.credit_hours,
      teacher_id: teacherId,
    });

    setIsEditSubjectModalOpen(true);
  };

  // Loading state
  if (
    isLoading.semesters ||
    isLoading.subjects ||
    isLoading.teachers
  ) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B87] mx-auto mb-4'></div>
          <p className='text-gray-600'>{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header Section */}
      <div className='relative overflow-hidden bg-gradient-to-br from-white via-[#E8ECEF]/30 to-[#E8ECEF]/50 rounded-2xl border border-[#E8ECEF]/50 shadow-lg'>
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-gradient-to-br from-[#1D3D6F]/5 via-transparent to-[#2C4F85]/5'></div>
        <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F7B500]/10 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#2C4F85]/10 to-transparent rounded-full blur-2xl'></div>

        <div className='relative p-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] rounded-xl shadow-lg'>
                <BookOpen className='h-8 w-8 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent'>
                  Course Subject Management System
                </h2>
                <p className='text-gray-600 mt-1'>
                  Comprehensive course subject management and instructor assignment system
                </p>
              </div>
            </div>
            <div className='hidden md:flex items-center space-x-2 text-[#1D3D6F]'>
              <BarChart3 className='h-5 w-5' />
              <span className='text-sm font-medium'>Admin Dashboard</span>
            </div>
          </div>

          {/* Action Button */}
          <div className='flex justify-end'>
            <button
              className='flex items-center px-6 py-3 bg-gradient-to-r from-[#2C4F85] to-[#1D3D6F] text-white rounded-lg hover:from-[#1D3D6F] hover:to-[#2C4F85] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => {
                resetSubjectForm();
                setIsAddSubjectModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              Add New Course Subject
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        {/* Subject Management Section */}
        <div className='p-6'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-[#E8ECEF] rounded-lg'>
              <BookOpen className='h-5 w-5 text-[#1D3D6F]' />
            </div>
            <div>
              <h3 className='text-xl font-semibold bg-gradient-to-r from-[#000000] to-[#1D3D6F] bg-clip-text text-transparent'>
                Course Subject Directory
              </h3>
              <p className='text-sm text-gray-600 mt-1'>
                Manage academic course subjects and instructor assignments
              </p>
            </div>
          </div>

          <div className='overflow-x-auto rounded-lg shadow-lg border border-[#E8ECEF]'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <BookOpen className='h-4 w-4' />
                      <span>Course Code</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <GraduationCap className='h-4 w-4' />
                      <span>Course Subject Name</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <Calendar className='h-4 w-4' />
                      <span>Academic Semester</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <User className='h-4 w-4' />
                      <span>Course Instructor</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center justify-center space-x-2'>
                      <Award className='h-4 w-4' />
                      <span>Credit Hours</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center justify-center space-x-2'>
                      <Edit className='h-4 w-4' />
                      <span>Management Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {subjects.map((subject, index) => {
                  let teacherName = "Not Assigned";

                  if (subject.teacher_id) {
                    if (
                      typeof subject.teacher_id === "object" &&
                      subject.teacher_id.name
                    ) {
                      teacherName = subject.teacher_id.name;
                    } else {
                      const teacher = teachers.find(
                        (t) => t._id === subject.teacher_id
                      );
                      if (teacher) {
                        teacherName = teacher.name;
                      }
                    }
                  }

                  return (
                    <tr
                      key={subject._id}
                      className={`hover:bg-[#E8ECEF]/30 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#E8ECEF]/10"
                      }`}
                    >
                      <td className='px-6 py-5'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                            <BookOpen className='h-4 w-4 text-[#1D3D6F]' />
                          </div>
                          <div className='text-sm font-semibold text-[#1D3D6F] bg-[#E8ECEF]/50 px-3 py-1 rounded-lg'>
                            {subject.code}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {subject.name}
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>
                          Academic Course Subject
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2C4F85]/10 text-[#2C4F85]'>
                          <Calendar className='h-3 w-3 mr-1' />
                          {subject.semester_id.name}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center space-x-2'>
                          <div className='p-1 bg-[#F7B500]/10 rounded-full'>
                            <User className='h-3 w-3 text-[#F7B500]' />
                          </div>
                          <span className='text-sm font-medium text-gray-900'>
                            {teacherName}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-[#F7B500]/10 text-[#F7B500] rounded-full text-sm font-bold'>
                          <Award className='h-4 w-4 mr-1' />
                          {subject.credit_hours}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex justify-center space-x-3'>
                          <button
                            className='p-2 bg-[#2C4F85]/10 text-[#2C4F85] rounded-lg hover:bg-[#2C4F85]/20 transition-all duration-200 transform hover:scale-105'
                            onClick={() => openEditSubjectModal(subject)}
                            title='Edit Course Subject'
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105'
                            onClick={() => handleDeleteSubject(subject._id)}
                            title='Delete Course Subject'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Course Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title='Add New Course Subject'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSubject();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-[#1D3D6F]/10 rounded-lg'>
                  <BookOpen className='h-5 w-5 text-[#1D3D6F]' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold text-[#1D3D6F]'>
                    Course Subject Information
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Enter comprehensive course subject details and instructor assignment
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Course Subject Name'
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
                placeholder='Enter course subject name'
              />
              <FormField
                label='Course Subject Code'
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
                placeholder='Enter course code (e.g., CS101)'
              />
              <FormField
                label='Academic Semester'
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Academic Semester" },
                  ...semesters.map((semester) => ({
                    value: semester._id,
                    label: semester.name,
                  })),
                ]}
                required
              />
              <FormField
                label='Course Instructor'
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Course Instructor" },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label='Credit Hours'
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-8 flex justify-end space-x-4'>
              <button
                type='button'
                className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
                onClick={() => setIsAddSubjectModalOpen(false)}
              >
                Cancel Operation
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>Save Course Subject</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Course Subject Modal */}
      <Modal
        isOpen={isEditSubjectModalOpen}
        onClose={() => setIsEditSubjectModalOpen(false)}
        title='Edit Course Subject'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubject();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-[#1D3D6F]/10 rounded-lg'>
                  <Edit className='h-5 w-5 text-[#1D3D6F]' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold text-[#1D3D6F]'>
                    Update Course Subject Information
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Modify course subject details and instructor assignment
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Course Subject Name'
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
                placeholder='Enter course subject name'
              />
              <FormField
                label='Course Subject Code'
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
                placeholder='Enter course code (e.g., CS101)'
              />
              <FormField
                label='Academic Semester'
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Academic Semester" },
                  ...semesters.map((semester) => ({
                    value: semester._id,
                    label: semester.name,
                  })),
                ]}
                required
              />
              <FormField
                label='Course Instructor'
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Course Instructor" },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label='Credit Hours'
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-8 flex justify-end space-x-4'>
              <button
                type='button'
                className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
                onClick={() => setIsEditSubjectModalOpen(false)}
              >
                Cancel Operation
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>Update Course Subject</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
