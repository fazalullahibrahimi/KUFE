import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  BookOpen
} from "lucide-react";
import API_URL from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

const QualityAssurancePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    teacher_id: "",
    class_level: "",
    attendance_feedback: {
      rating: 0,
      comments: ""
    },
    teaching_satisfaction: {
      rating: 0,
      comments: ""
    },
    course_materials: {
      rating: 0,
      comments: ""
    },
    is_anonymous: false
  });

  // Check if user is logged in and is a student
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "student") {
      navigate("/login");
      return;
    }

    fetchTeachers();
  }, [navigate]);

  const fetchTeachers = async () => {
    setLoading(true);
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
      setMessage({
        type: "error",
        text: t("qa.failed_load")
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleStarRating = (section, rating) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        rating: rating
      }
    }));
  };

  const validateForm = () => {
    if (!formData.teacher_id) {
      setMessage({ type: "error", text: t("qa.select_teacher_error") });
      return false;
    }
    if (!formData.class_level) {
      setMessage({ type: "error", text: t("qa.select_class_error") });
      return false;
    }
    if (formData.attendance_feedback.rating === 0) {
      setMessage({ type: "error", text: t("qa.rate_attendance") });
      return false;
    }
    if (formData.teaching_satisfaction.rating === 0) {
      setMessage({ type: "error", text: t("qa.rate_teaching") });
      return false;
    }
    if (formData.course_materials.rating === 0) {
      setMessage({ type: "error", text: t("qa.rate_materials") });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/quality-assurance`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: t("qa.thank_you")
        });

        // Reset form
        setFormData({
          teacher_id: "",
          class_level: "",
          attendance_feedback: { rating: 0, comments: "" },
          teaching_satisfaction: { rating: 0, comments: "" },
          course_materials: { rating: 0, comments: "" },
          is_anonymous: false
        });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || t("qa.failed_submit")
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, section }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(section, star)}
            className={`p-1 transition-colors ${
              star <= rating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : t("qa.not_rated")}
        </span>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#004B87] p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("qa.share_opinion")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your feedback helps us improve the quality of education. Please share your honest
              opinions about your teachers and courses to help us serve you better.
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Teacher and Class Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    {t("qa.select_teacher")} *
                  </label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) => handleInputChange(null, "teacher_id", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    required
                  >
                    <option value="">{t("qa.choose_teacher")}</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.department_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    {t("qa.class_level")} *
                  </label>
                  <select
                    value={formData.class_level}
                    onChange={(e) => handleInputChange(null, "class_level", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    required
                  >
                    <option value="">{t("qa.select_class")}</option>
                    <option value="first">{t("qa.first_year")}</option>
                    <option value="second">{t("qa.second_year")}</option>
                    <option value="third">{t("qa.third_year")}</option>
                    <option value="fourth">{t("qa.fourth_year")}</option>
                  </select>
                </div>
              </div>

              {/* Section 1: Teacher Attendance */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  {t("qa.section1_title")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("qa.section1_desc")}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.rating")} *
                    </label>
                    <StarRating
                      rating={formData.attendance_feedback.rating}
                      onRatingChange={handleStarRating}
                      section="attendance_feedback"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.comments")}
                    </label>
                    <textarea
                      value={formData.attendance_feedback.comments}
                      onChange={(e) => handleInputChange("attendance_feedback", "comments", e.target.value)}
                      placeholder={t("qa.attendance_comments")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                      rows="3"
                      maxLength="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.attendance_feedback.comments.length}/1000 {t("qa.characters")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Teaching Satisfaction */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  {t("qa.section2_title")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("qa.section2_desc")}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.rating")} *
                    </label>
                    <StarRating
                      rating={formData.teaching_satisfaction.rating}
                      onRatingChange={handleStarRating}
                      section="teaching_satisfaction"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.comments")}
                    </label>
                    <textarea
                      value={formData.teaching_satisfaction.comments}
                      onChange={(e) => handleInputChange("teaching_satisfaction", "comments", e.target.value)}
                      placeholder={t("qa.teaching_comments")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                      rows="3"
                      maxLength="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.teaching_satisfaction.comments.length}/1000 {t("qa.characters")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Course Materials */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  {t("qa.section3_title")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("qa.section3_desc")}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.rating")} *
                    </label>
                    <StarRating
                      rating={formData.course_materials.rating}
                      onRatingChange={handleStarRating}
                      section="course_materials"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("qa.comments")}
                    </label>
                    <textarea
                      value={formData.course_materials.comments}
                      onChange={(e) => handleInputChange("course_materials", "comments", e.target.value)}
                      placeholder={t("qa.materials_comments")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                      rows="3"
                      maxLength="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.course_materials.comments.length}/1000 {t("qa.characters")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) => handleInputChange(null, "is_anonymous", e.target.checked)}
                  className="h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                  {t("qa.anonymous")}
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center gap-2 bg-[#004B87] text-white px-8 py-3 rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t("qa.submitting")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("qa.submit")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QualityAssurancePage;
