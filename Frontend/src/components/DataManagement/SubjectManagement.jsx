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
  TrendingUp,
  Activity,
  Eye,
  Target,
  Building2,
  Users,
  Layers
} from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

const SubjectManagement = () => {
  const { t, isRTL, language } = useLanguage();

  // State for data from API
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState({
    semesters: true,
    subjects: true,
    teachers: true,
    departments: true,
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

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, departments: true }));
        const response = await fetch("http://127.0.0.1:4400/api/v1/departments/", {
          headers: createHeaders(),
        });
        const data = await response.json();
        console.log("Departments API Response:", data);

        if (data.status === "success" && data.data && data.data.departments) {
          setDepartments(data.data.departments);
        } else {
          console.error(
            "Unexpected API response structure for departments:",
            data
          );
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, departments: false }));
      }
    };

    fetchDepartments();
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
    isLoading.teachers ||
    isLoading.departments
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
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#16A085] rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-ping delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 mr-4">
                <BookOpen className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("subjectManagement")}
                </h1>
                <p className="text-white/90 text-lg">
                  {t("manageAcademicCourseSubjects")}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">
                {t("manageAcademicCourseSubjects")} • {subjects.length} {t("subjects")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">
                {subjects.length}
              </div>
              <div className="text-white/60 text-sm">
                {t("totalSubjects")}
              </div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                resetSubjectForm();
                setIsAddSubjectModalOpen(true);
              }}
              disabled={isLoading.subjects}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                {t("addNewSubject")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Subjects Card */}
        <div className="group bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("totalSubjects")}</h3>
              </div>
              <p className="text-3xl font-bold">{subjects.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("academicCourseSubject")}</p>
            </div>
          </div>
        </div>

        {/* Active Subjects Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("activeSubjects")}</h3>
              </div>
              <p className="text-3xl font-bold">{subjects.filter(s => s.teacher_id).length}</p>
              <p className="text-white/80 text-sm mt-1">{t("courseInstructor")}</p>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("subjectsByDepartment")}</h3>
              </div>
              <p className="text-3xl font-bold">{departments.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("departments")}</p>
            </div>
          </div>
        </div>

        {/* Semesters Card */}
        <div className="group bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("academicSemester")}</h3>
              </div>
              <p className="text-3xl font-bold">{semesters.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("semesters")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading.subjects && (
        <div className="text-center py-4">
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      )}

      {/* Subject Table */}
      <Table
        columns={[
          {
            header: t("subjectCode"),
            accessor: "code",
            render: (row) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md mr-3">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{row.code}</div>
                  <div className="text-sm text-gray-500">{t("academicCourseSubject")}</div>
                </div>
              </div>
            )
          },
          {
            header: t("subjectName"),
            accessor: "name",
            render: (row) => (
              <div>
                <div className="font-medium text-gray-900">{row.name}</div>
                <div className="text-sm text-gray-500">{t("courseSubjectName")}</div>
              </div>
            )
          },
          {
            header: t("semester"),
            accessor: "semester_id",
            render: (row) => (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Calendar className="h-3 w-3 mr-1" />
                {row.semester_id?.name || t("notAssigned")}
              </div>
            )
          },
          {
            header: t("teacher"),
            accessor: "teacher_id",
            render: (row) => {
              let teacherName = t("notAssigned");
              if (row.teacher_id) {
                if (typeof row.teacher_id === "object" && row.teacher_id.name) {
                  teacherName = row.teacher_id.name;
                } else {
                  const teacher = teachers.find(t => t._id === row.teacher_id);
                  if (teacher) teacherName = teacher.name;
                }
              }
              return (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 flex items-center justify-center rounded-full mr-2">
                    <User size={14} className="text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{teacherName}</span>
                </div>
              );
            }
          },
          {
            header: t("creditHours"),
            accessor: "credit_hours",
            render: (row) => (
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                <Award className="h-4 w-4 mr-1" />
                {row.credit_hours}
              </div>
            )
          }
        ]}
        data={subjects}
        actions={true}
        onEdit={(subject) => openEditSubjectModal(subject)}
        onDelete={(subject) => handleDeleteSubject(subject._id)}
      />


      {/* Add Course Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title={t("addNewSubject")}
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
                    {t("courseSubjectInformation")}
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    {t("enterCourseSubjectDetails")}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label={t("courseSubjectName")}
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
                placeholder={t("enterCourseSubjectName")}
              />
              <FormField
                label={t("courseSubjectCode")}
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
                placeholder={t("enterCourseCode")}
              />
              <FormField
                label={t("academicSemester")}
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: t("selectAcademicSemester") },
                  ...semesters.map((semester) => ({
                    value: semester._id,
                    label: semester.name,
                  })),
                ]}
                required
              />
              <FormField
                label={t("courseInstructor")}
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: t("selectCourseInstructor") },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label={t("creditHours")}
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
                {t("cancelOperation")}
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>{t("saveCourseSubject")}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Course Subject Modal */}
      <Modal
        isOpen={isEditSubjectModalOpen}
        onClose={() => setIsEditSubjectModalOpen(false)}
        title={t("editCourseSubject")}
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
                    {t("updateCourseSubjectInfo")}
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    {t("modifyCourseSubjectDetails")}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label={t("courseSubjectName")}
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
                placeholder={t("enterCourseSubjectName")}
              />
              <FormField
                label={t("courseSubjectCode")}
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
                placeholder={t("enterCourseCode")}
              />
              <FormField
                label={t("academicSemester")}
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: t("selectAcademicSemester") },
                  ...semesters.map((semester) => ({
                    value: semester._id,
                    label: semester.name,
                  })),
                ]}
                required
              />
              <FormField
                label={t("courseInstructor")}
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: t("selectCourseInstructor") },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label={t("creditHours")}
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
                {t("cancelOperation")}
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>{t("updateCourseSubject")}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
