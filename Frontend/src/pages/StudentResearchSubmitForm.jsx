import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  FileText,
  Mail,
  ArrowLeft,
} from "lucide-react";
import FormField from "../components/common/FormField";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { notifyTeacherOfSubmission } from "../services/emailService";

const StudentResearchSubmitForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // State for data
  const [students, setStudents] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState({
    sending: false,
    success: null,
    message: "",
  });

  // Form data for new submission
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    category: "General",
    student_id: "",
    student_name: "",
    department_id: "",
    department_name: "",
    file_path: "",
    keywords: "",
  });

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:4400/api/v1";

  // Get token from local storage
  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Get current user info from local storage
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/students/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (
          data &&
          data.status === "success" &&
          Array.isArray(data.data?.students)
        ) {
          setStudents(data.data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [API_BASE_URL]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/departments/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (
          data &&
          data.status === "success" &&
          Array.isArray(data.data?.departments)
        ) {
          setDepartmentsList(data.data.departments);
        } else {
          console.error("Unexpected departments data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [API_BASE_URL]);

  // Update formData when students are loaded
  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (currentUser && students.length > 0) {
      // Find the current student in the students array
      const student = students.find(s => 
        s._id === currentUser._id || 
        s._id === currentUser.id || 
        s.student_id_number === currentUser.student_id_number
      );
      
      if (student) {
        setFormData(prevData => ({
          ...prevData,
          student_id: student._id || "",
          student_name: student.name || "",
          department_id: student.department_id?._id || "",
          department_name: student.department_id?.name || "",
        }));
      }
    }
  }, [students]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle keywords input
  const handleKeywordsChange = (e) => {
    setFormData({
      ...formData,
      keywords: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setLoading(true);

    try {
      // Convert keywords string to array
      const keywordsArray = formData.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("abstract", formData.abstract);
      formDataObj.append("category", formData.category);
      formDataObj.append("student_id", formData.student_id);
      formDataObj.append("student_name", formData.student_name);
      formDataObj.append("department_id", formData.department_id);
      formDataObj.append("department_name", formData.department_name);
      formDataObj.append("keywords", JSON.stringify(keywordsArray));
      formDataObj.append("status", "pending");

      if (selectedFile) {
        formDataObj.append("file", selectedFile);
      }

      const token = getToken();

      // Use the correct API endpoint
      const response = await fetch(`${API_BASE_URL}/research/uploadResearch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Notify teacher about the submission
        setNotificationStatus({
          sending: true,
          success: null,
          message: "Notifying department teacher...",
        });

        try {
          // Get the student data
          const student = students.find((s) => s._id === formData.student_id) || {
            name: formData.student_name,
            email: "student@example.com", // Fallback
          };

          // Send notification
          await notifyTeacherOfSubmission(data.data.research, student, {
            department_id: formData.department_id,
            name: "Department Teacher", // Fallback name
          });

          setNotificationStatus({
            sending: false,
            success: true,
            message: "Teacher has been notified of your submission.",
          });
        } catch (error) {
          console.error("Error notifying teacher:", error);
          setNotificationStatus({
            sending: false,
            success: false,
            message: "Could not notify teacher - teacher information not found.",
          });
        }

        alert("Research paper submitted successfully!");
        navigate("/research"); // Redirect to research page
      } else {
        throw new Error(data.message || "Failed to submit research paper");
      }
    } catch (error) {
      console.error("Error submitting research:", error);
      alert(`Error: ${error.message || "Failed to submit research paper"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button 
              onClick={() => navigate("/research")}
              className="flex items-center text-[#004B87] hover:underline"
            >
              <ArrowLeft size={16} className="mr-1" />
              {t("Back to Research")}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {t("Submit Your Research Paper")}
            </h1>
            <p className="mt-2 text-gray-600">
              {t("Share your academic work with the university community")}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    label={t("Paper Title")}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label={t("Abstract")}
                    name="abstract"
                    type="textarea"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label={t("Category")}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label={t("Student Name")}
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      disabled
                    />
                    <FormField
                      label={t("Department")}
                      name="department_name"
                      value={formData.department_name}
                      onChange={handleInputChange}
                      disabled
                    />
                    <FormField
                      label={t("Keywords (comma separated)")}
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleKeywordsChange}
                      required
                      placeholder="e.g. Climate Change, Agriculture, Sustainability"
                    />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {t("Upload Research Paper")}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 text-center">
                        {t("Upload your research paper in PDF format. Maximum file size: 10MB")}
                      </p>
                      <input
                        type="file"
                        id="file_upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file_upload"
                        className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors cursor-pointer"
                      >
                        {t("Select File")}
                      </label>
                      {selectedFile && (
                        <div className="mt-4 flex items-center">
                          <FileText size={16} className="text-[#004B87] mr-2" />
                          <span className="text-sm">{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Mail size={20} className="text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">
                          {t("Email Notifications")}
                        </h4>
                        <p className="text-sm text-blue-600">
                          {t("Your department teacher will be notified by email when you submit your research. You will also receive an email notification when the committee provides feedback on your submission.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => navigate("/research")}
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
                      disabled={loading}
                    >
                      <Save size={18} className="inline mr-2" />
                      {loading ? t("Submitting...") : t("Submit Research")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentResearchSubmitForm;
