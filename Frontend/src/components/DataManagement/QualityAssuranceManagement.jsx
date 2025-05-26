import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Star,
  Eye,
  Filter,
  Download,
  Calendar,
  User,
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import API_URL from "../../config/api";
import { useLanguage } from "../../contexts/LanguageContext";

const QualityAssuranceManagement = () => {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    class_level: "",
    teacher_id: ""
  });
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchFeedback();
    fetchTeachers();
  }, [filters]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `${API_URL}/quality-assurance?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setFeedback(response.data.data || []);
        calculateStats(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      console.error("Error details:", error.response?.data);
      setFeedback([]); // Set empty array on error
      setStats({ total: 0, pending: 0, reviewed: 0, resolved: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === "success") {
        // Extract teachers from the nested response structure
        setTeachers(response.data.data.teachers || []);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const calculateStats = (feedbackData) => {
    const stats = {
      total: feedbackData.length,
      pending: feedbackData.filter(f => f.status === "pending").length,
      reviewed: feedbackData.filter(f => f.status === "reviewed").length,
      resolved: feedbackData.filter(f => f.status === "resolved").length
    };
    setStats(stats);
  };

  const updateFeedbackStatus = async (feedbackId, status, adminResponse = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/quality-assurance/${feedbackId}/status`,
        { status, admin_response: adminResponse },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchFeedback(); // Refresh the list
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
      alert("Failed to update feedback status. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "reviewed":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StarDisplay = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 text-[#004B87] mr-3" />
            {t("qa.quality_assurance")} {t("qa.feedback")}
          </h1>
          <p className="text-gray-600 mt-1">{t("qa.manage_review")}</p>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("qa.total_feedback")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("qa.pending")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("qa.reviewed")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("qa.resolved")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
          >
            <option value="">{t("qa.all_status")}</option>
            <option value="pending">{t("qa.pending")}</option>
            <option value="reviewed">{t("qa.reviewed")}</option>
            <option value="resolved">{t("qa.resolved")}</option>
          </select>

          <select
            value={filters.class_level}
            onChange={(e) => setFilters(prev => ({ ...prev, class_level: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
          >
            <option value="">{t("qa.all_classes")}</option>
            <option value="first">{t("qa.first_year")}</option>
            <option value="second">{t("qa.second_year")}</option>
            <option value="third">{t("qa.third_year")}</option>
            <option value="fourth">{t("qa.fourth_year")}</option>
          </select>

          <select
            value={filters.teacher_id}
            onChange={(e) => setFilters(prev => ({ ...prev, teacher_id: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
          >
            <option value="">{t("qa.all_teachers")}</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004B87] mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("qa.loading")}</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("qa.no_feedback")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.student_teacher")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.class_level")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.ratings")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("qa.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedback.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {item.is_anonymous ? t("qa.anonymous_submission") : item.student_id?.fullName || t("qa.unknown")}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {t("qa.teacher")}: {item.teacher_id?.name || t("qa.unknown")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 capitalize">
                          {t(`qa.${item.class_level}_year`)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-16">{t("qa.attend")}:</span>
                          <StarDisplay rating={item.attendance_feedback.rating} />
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-16">{t("qa.teach")}:</span>
                          <StarDisplay rating={item.teaching_satisfaction.rating} />
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-16">{t("qa.material")}:</span>
                          <StarDisplay rating={item.course_materials.rating} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{t(`qa.${item.status}`)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.submission_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedFeedback(item);
                            setShowModal(true);
                          }}
                          className="text-[#004B87] hover:text-[#003366] flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t("qa.view")}
                        </button>

                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateFeedbackStatus(item._id, "reviewed")}
                              className="text-green-600 hover:text-green-800 flex items-center text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => updateFeedbackStatus(item._id, "resolved", "Feedback reviewed and noted.")}
                              className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Resolve
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing feedback details */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Feedback Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFeedback.is_anonymous ? "Anonymous Submission" : selectedFeedback.student_id?.fullName || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teacher</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFeedback.teacher_id?.name || "Unknown"} - {selectedFeedback.teacher_id?.department_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class Level</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedFeedback.class_level} Year
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedFeedback.submission_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Feedback Sections */}
              <div className="space-y-4">
                {/* Attendance Feedback */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Teacher Attendance & Punctuality</h3>
                  <div className="mb-2">
                    <StarDisplay rating={selectedFeedback.attendance_feedback.rating} />
                  </div>
                  {selectedFeedback.attendance_feedback.comments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedFeedback.attendance_feedback.comments}
                      </p>
                    </div>
                  )}
                </div>

                {/* Teaching Satisfaction */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Teaching Satisfaction & Quality</h3>
                  <div className="mb-2">
                    <StarDisplay rating={selectedFeedback.teaching_satisfaction.rating} />
                  </div>
                  {selectedFeedback.teaching_satisfaction.comments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedFeedback.teaching_satisfaction.comments}
                      </p>
                    </div>
                  )}
                </div>

                {/* Course Materials */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Course Materials & Resources</h3>
                  <div className="mb-2">
                    <StarDisplay rating={selectedFeedback.course_materials.rating} />
                  </div>
                  {selectedFeedback.course_materials.comments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedFeedback.course_materials.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Response */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Admin Response</h3>
                <textarea
                  placeholder="Add admin response..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                  rows="3"
                  defaultValue={selectedFeedback.admin_response || ""}
                  id="adminResponse"
                />
              </div>

              {/* Status Update */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                    defaultValue={selectedFeedback.status}
                    id="statusSelect"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const status = document.getElementById("statusSelect").value;
                      const adminResponse = document.getElementById("adminResponse").value;
                      updateFeedbackStatus(selectedFeedback._id, status, adminResponse);
                    }}
                    className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003366] transition-colors"
                  >
                    Update Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityAssuranceManagement;
