import React, { useState, useEffect } from "react";
import {
  FileText,
  Check,
  X,
  AlertTriangle,
  Filter,
  ChevronDown,
  Download,
  Eye,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  notifyStudentOfFeedback,
  getStudentById,
  getReviewerById,
} from "../services/emailService";

const CommitteeResearchView = () => {
  // State for research submissions
  const [researchSubmissions, setResearchSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState({
    sending: false,
    success: null,
    message: "",
  });

  // Get token from local storage
  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  // API base URL
  const API_BASE_URL = "http://localhost:4400/api/v1";

  // Fetch research submissions with auth token
  useEffect(() => {
    const fetchResearchSubmissions = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/research/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.error("Error parsing JSON:", error);
          throw new Error("Invalid JSON response from server");
        }
        console.log("Research submissions data:", data);

        if (
          data &&
          data.status === "success" &&
          Array.isArray(data.data?.research)
        ) {
          setResearchSubmissions(data.data.research);
        } else if (Array.isArray(data)) {
          setResearchSubmissions(data);
        } else {
          console.error("Unexpected research data structure:", data);
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching research submissions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchSubmissions();
  }, []);

  // State for UI
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);

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
        console.log("Departments data:", data);

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
  }, []);

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

  // Form data for review - now dynamically set based on current user
  const [reviewData, setReviewData] = useState(() => {
    const currentUser = getCurrentUser();
    return {
      status: "pending",
      reviewer_comments: "",
      reviewer_id: currentUser?.id || currentUser?._id || "",
    };
  });

  // Filter submissions based on committee member's department
  useEffect(() => {
    if (loading) return;

    let result = [...researchSubmissions];
    const currentUser = getCurrentUser();

    // Show all submissions but add flags for department matching
    if (currentUser) {
      console.log("Current user:", currentUser);
      const committeeDeptId =
        currentUser.department_id || currentUser.department?._id;
      console.log("Committee member department ID:", committeeDeptId);

      // Add flags to indicate if the submission is from the committee member's department
      result = result.map((submission) => {
        // Check if department IDs match
        const isFromSameDepartment =
          committeeDeptId &&
          submission.department_id &&
          String(submission.department_id) === String(committeeDeptId);

        // Get the current user's committee member ID
        // This is important because the reviewer_id in the research is the committee member ID, not the user ID
        const committeeId = currentUser.committeeId || currentUser._id;

        // Check if current user is assigned to this submission
        const isAssigned =
          submission.reviewer_id &&
          (String(submission.reviewer_id) === String(committeeId) ||
            String(submission.reviewer_id) === String(currentUser._id) ||
            String(submission.reviewer_id) === String(currentUser.id));

        // Debug information
        if (submission.reviewer_id) {
          console.log(`Submission "${submission.title}" reviewer check:`, {
            submission_reviewer_id: submission.reviewer_id,
            user_id: currentUser._id || currentUser.id,
            committee_id: committeeId,
            isAssigned: isAssigned,
          });
        }

        return {
          ...submission,
          isFromSameDepartment: isFromSameDepartment,
          isAssignedToCurrentUser: isAssigned,
          // Add a flag to indicate if the user can review this submission
          canReview:
            (isFromSameDepartment || isAssigned) &&
            (submission.status === "pending" || !submission.status),
        };
      });

      // Log statistics for debugging
      console.log("Total submissions:", result.length);
      console.log(
        "Submissions from same department:",
        result.filter((s) => s.isFromSameDepartment).length
      );
      console.log(
        "Submissions assigned to current user:",
        result.filter((s) => s.isAssignedToCurrentUser).length
      );
      console.log(
        "Submissions user can review:",
        result.filter((s) => s.canReview).length
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (submission) => submission.status === statusFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (submission) =>
          (submission.title && submission.title.toLowerCase().includes(term)) ||
          (submission.abstract &&
            submission.abstract.toLowerCase().includes(term)) ||
          (submission.student_name &&
            submission.student_name.toLowerCase().includes(term)) ||
          (submission.keywords &&
            Array.isArray(submission.keywords) &&
            submission.keywords.some((keyword) =>
              keyword.toLowerCase().includes(term)
            ))
      );
    }

    setFilteredSubmissions(result);
  }, [researchSubmissions, statusFilter, searchTerm, loading]);

  // Table columns configuration
  const committeeColumns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className='flex items-center'>
          <div
            className={`w-8 h-8 rounded-full ${
              row.isFromSameDepartment
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            } flex items-center justify-center mr-3`}
          >
            <FileText size={16} />
          </div>
          <div>
            <div className='flex items-center'>
              <p
                className={`font-medium ${
                  row.isFromSameDepartment ? "text-green-800" : "text-gray-800"
                }`}
              >
                {row.title}
              </p>
              {row.isAssignedToCurrentUser && (
                <span className='ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full'>
                  Assigned to You
                </span>
              )}
              {!row.isAssignedToCurrentUser && row.isFromSameDepartment && (
                <span className='ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full'>
                  Your Department
                </span>
              )}
              {!row.isFromSameDepartment && !row.isAssignedToCurrentUser && (
                <span className='ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full'>
                  Other Department
                </span>
              )}
            </div>
            <p className='text-xs text-gray-500'>
              Submitted by: {row.student_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    {
      header: "Submission Date",
      accessor: "submission_date",
      render: (row) => formatDate(row.submission_date || row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "accepted"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "Pending"}
        </span>
      ),
    },
  ];

  // Form handling functions
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value,
    });
  };

  // Handle review submission
  const handleReviewSubmission = async () => {
    try {
      // Get current user
      const currentUser = getCurrentUser();

      const payload = {
        status: reviewData.status,
        reviewer_comments: reviewData.reviewer_comments,
        reviewer_id:
          reviewData.reviewer_id || currentUser?._id || currentUser?.id,
        review_date: new Date().toISOString(),
      };

      const token = getToken();
      const submissionId = currentSubmission._id || currentSubmission.id;
      console.log(submissionId);

      const response = await fetch(
        `${API_BASE_URL}/research/${submissionId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update research status: ${
            errorData.message || response.statusText
          }`
        );
      }

      // Get the updated research data
      const updatedResearchResponse = await fetch(
        `${API_BASE_URL}/research/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedResearchData = await updatedResearchResponse.json();
      const updatedResearch =
        updatedResearchData.data?.research || updatedResearchData;

      // Send email notification to student
      setNotificationStatus({
        sending: true,
        success: null,
        message: "Sending notification to student...",
      });

      // Get the student data
      const student = await getStudentById(currentSubmission.student_id);

      // Get the reviewer data
      const reviewer = await getReviewerById(reviewData.reviewer_id);

      if (student) {
        // Send notification
        await notifyStudentOfFeedback(
          {
            ...updatedResearch,
            status: reviewData.status,
            reviewer_comments: reviewData.reviewer_comments,
          },
          student,
          reviewer
        );

        setNotificationStatus({
          sending: false,
          success: true,
          message: "Student has been notified of your review.",
        });
      } else {
        setNotificationStatus({
          sending: false,
          success: false,
          message: "Could not notify student - student information not found.",
        });
      }

      // Refresh the research submissions list
      const refreshResponse = await fetch(`${API_BASE_URL}/research/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const refreshData = await refreshResponse.json();
      if (
        refreshData &&
        refreshData.status === "success" &&
        Array.isArray(refreshData.data?.research)
      ) {
        setResearchSubmissions(refreshData.data.research);
      } else if (Array.isArray(refreshData)) {
        setResearchSubmissions(refreshData);
      }

      setIsReviewModalOpen(false);
      resetReviewForm();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error updating research status:", error);
      setNotificationStatus({
        sending: false,
        success: false,
        message: `Failed to send notification: ${error.message}`,
      });
      alert(
        `Failed to update research status: ${error.message}. Please try again.`
      );
    }
  };

  const openReviewModal = (submission) => {
    // Use the canReview flag we calculated earlier
    if (!submission.canReview) {
      if (submission.status !== "pending") {
        alert("This submission has already been reviewed.");
      } else {
        alert(
          "You can only review research papers from your own department or assigned to you."
        );
      }
      return;
    }

    setCurrentSubmission(submission);

    // Get current user for reviewer_id
    const currentUser = getCurrentUser();
    const reviewerId = currentUser?.id || currentUser?._id || "";

    setReviewData({
      status: submission.status || "pending",
      reviewer_comments: submission.reviewer_comments || "",
      reviewer_id: reviewerId,
    });

    setIsReviewModalOpen(true);
  };

  const openViewModal = (submission) => {
    setCurrentSubmission(submission);
    setIsViewModalOpen(true);
  };

  const resetReviewForm = () => {
    const currentUser = getCurrentUser();
    setReviewData({
      status: "pending",
      reviewer_comments: "",
      reviewer_id: currentUser?.id || currentUser?._id || "",
    });
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: researchSubmissions.filter(
        (submission) => submission.status === "pending" || !submission.status
      ).length,
      accepted: researchSubmissions.filter(
        (submission) => submission.status === "accepted"
      ).length,
      rejected: researchSubmissions.filter(
        (submission) => submission.status === "rejected"
      ).length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]'></div>
        <p className='ml-4 text-lg text-gray-600'>Loading submissions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-4'>
        <h3 className='text-lg font-medium mb-2'>Error Loading Data</h3>
        <p>{error}</p>
        <button
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className='container mx-auto px-4 pt-20 pb-16 space-y-6'>
        {/* Back button */}
        <div className='mb-4'>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className='flex items-center text-[#004B87] hover:underline'
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to Dashboard
          </button>
        </div>

        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Department Research Submissions
          </h2>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow p-6 flex items-center'>
            <div className='w-12 h-12 rounded-full bg-yellow-500 bg-opacity-10 flex items-center justify-center mr-4'>
              <span className='text-yellow-500 font-bold'>
                {statusCounts.pending}
              </span>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Pending Review</p>
              <p className='text-lg font-semibold text-gray-800'>
                {statusCounts.pending}
              </p>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6 flex items-center'>
            <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
              <span className='text-green-500 font-bold'>
                {statusCounts.accepted}
              </span>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Accepted</p>
              <p className='text-lg font-semibold text-gray-800'>
                {statusCounts.accepted}
              </p>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6 flex items-center'>
            <div className='w-12 h-12 rounded-full bg-red-500 bg-opacity-10 flex items-center justify-center mr-4'>
              <span className='text-red-500 font-bold'>
                {statusCounts.rejected}
              </span>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Rejected</p>
              <p className='text-lg font-semibold text-gray-800'>
                {statusCounts.rejected}
              </p>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        {notificationStatus.message && (
          <div
            className={`p-4 rounded-lg flex items-start ${
              notificationStatus.sending
                ? "bg-blue-50 border border-blue-200"
                : notificationStatus.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {notificationStatus.sending ? (
              <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-3 mt-0.5'></div>
            ) : notificationStatus.success ? (
              <Check className='h-5 w-5 text-green-600 mr-3 mt-0.5' />
            ) : (
              <AlertTriangle className='h-5 w-5 text-red-600 mr-3 mt-0.5' />
            )}
            <div>
              <p
                className={`font-medium ${
                  notificationStatus.sending
                    ? "text-blue-800"
                    : notificationStatus.success
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {notificationStatus.sending
                  ? "Sending Notification"
                  : notificationStatus.success
                  ? "Notification Sent"
                  : "Notification Error"}
              </p>
              <p
                className={`text-sm ${
                  notificationStatus.sending
                    ? "text-blue-600"
                    : notificationStatus.success
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {notificationStatus.message}
              </p>
            </div>
            <button
              className='ml-auto text-gray-500 hover:text-gray-700'
              onClick={() =>
                setNotificationStatus({
                  sending: false,
                  success: null,
                  message: "",
                })
              }
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className='bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 justify-between items-center'>
          <div className='relative flex-grow'>
            <input
              type='text'
              placeholder='Search by title, abstract, or keywords...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FileText
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={18}
            />
          </div>

          <div className='flex gap-2 w-full md:w-auto'>
            <div className='relative'>
              <button
                className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4'>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Status
                    </label>
                    <select
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value='all'>All Statuses</option>
                      <option value='pending'>Pending</option>
                      <option value='accepted'>Accepted</option>
                      <option value='rejected'>Rejected</option>
                    </select>
                  </div>

                  <div className='flex justify-between'>
                    <button
                      className='text-sm text-gray-600 hover:text-gray-900'
                      onClick={() => {
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </button>
                    <button
                      className='text-sm bg-[#004B87] text-white px-3 py-1 rounded-md hover:bg-[#003a6a]'
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Research Submissions Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {filteredSubmissions.length === 0 ? (
            <div className='p-8 text-center'>
              <FileText size={48} className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                No research submissions found
              </h3>
              <p className='text-gray-600 mb-4'>
                No submissions match your current filters or are assigned to
                your department.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    {committeeColumns.map((column, index) => (
                      <th
                        key={index}
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission._id || submission.id}
                      className='hover:bg-gray-50'
                    >
                      {committeeColumns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {column.render
                            ? column.render(submission)
                            : submission[column.accessor]}
                        </td>
                      ))}
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex justify-end space-x-2'>
                          <button
                            className='text-blue-600 hover:text-blue-900'
                            onClick={() => openViewModal(submission)}
                            title='View Details'
                          >
                            <Eye size={18} />
                          </button>
                          {submission.canReview ? (
                            <button
                              className='text-green-600 hover:text-green-900'
                              onClick={() => openReviewModal(submission)}
                              title={
                                submission.isAssignedToCurrentUser
                                  ? "This submission is assigned to you"
                                  : "Review Submission"
                              }
                            >
                              <MessageSquare size={18} />
                            </button>
                          ) : (
                            <span
                              className='text-gray-400 cursor-not-allowed'
                              title={
                                submission.status !== "pending"
                                  ? "This submission has already been reviewed"
                                  : "You can only review submissions from your department or assigned to you"
                              }
                            >
                              <MessageSquare size={18} />
                            </span>
                          )}
                          <button
                            className='text-gray-600 hover:text-gray-900'
                            onClick={() => {
                              if (submission.file_path) {
                                const url = `http://localhost:4400/public${submission.file_path}`;
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = submission.file_path
                                  .split("/")
                                  .pop();
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              } else {
                                alert("No file available for download.");
                              }
                            }}
                            title='Download Paper'
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Research Paper Details'
      >
        {currentSubmission && (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                {currentSubmission.title}
              </h3>
              <p className='text-sm text-gray-500'>
                Submitted by {currentSubmission.student_name} on{" "}
                {formatDate(
                  currentSubmission.submission_date ||
                    currentSubmission.createdAt
                )}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium text-gray-500'>
                  Department
                </h4>
                <p>{currentSubmission.department_name}</p>
              </div>
              <div>
                <h4 className='text-sm font-medium text-gray-500'>Status</h4>
                <p
                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    currentSubmission.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : currentSubmission.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSubmission.status
                    ? currentSubmission.status.charAt(0).toUpperCase() +
                      currentSubmission.status.slice(1)
                    : "Pending"}
                </p>
              </div>
            </div>

            <div>
              <h4 className='text-sm font-medium text-gray-500'>Abstract</h4>
              <p className='mt-1 text-sm text-gray-900 whitespace-pre-line'>
                {currentSubmission.abstract}
              </p>
            </div>

            <div>
              <h4 className='text-sm font-medium text-gray-500'>Keywords</h4>
              <div className='flex flex-wrap gap-2 mt-1'>
                {currentSubmission.keywords &&
                  Array.isArray(currentSubmission.keywords) &&
                  currentSubmission.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                    >
                      {keyword}
                    </span>
                  ))}
              </div>
            </div>

            {currentSubmission.reviewer_comments && (
              <div>
                <h4 className='text-sm font-medium text-gray-500'>
                  Reviewer Comments
                </h4>
                <p className='mt-1 text-sm text-gray-900 whitespace-pre-line'>
                  {currentSubmission.reviewer_comments}
                </p>
              </div>
            )}

            <div className='flex justify-between pt-4 border-t border-gray-200'>
              <button
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
                onClick={() => {
                  if (currentSubmission.file_path) {
                    const url = `http://localhost:4400/public${currentSubmission.file_path}`;
                    window.open(url, "_blank");
                  } else {
                    alert("No file available for download.");
                  }
                }}
              >
                View Paper
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title='Review Research Paper'
      >
        {currentSubmission && (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                {currentSubmission.title}
              </h3>
              <p className='text-sm text-gray-500'>
                Submitted by {currentSubmission.student_name} on{" "}
                {formatDate(
                  currentSubmission.submission_date ||
                    currentSubmission.createdAt
                )}
              </p>
            </div>

            <div className='space-y-4'>
              <FormField
                label='Status'
                name='status'
                type='select'
                value={reviewData.status}
                onChange={handleReviewChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accept" },
                  { value: "rejected", label: "Reject" },
                ]}
              />

              <FormField
                label='Comments'
                name='reviewer_comments'
                type='textarea'
                value={reviewData.reviewer_comments}
                onChange={handleReviewChange}
                placeholder='Provide feedback to the student about their research paper...'
                rows={5}
              />
            </div>

            <div className='flex justify-between pt-4 border-t border-gray-200'>
              <button
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
                onClick={() => setIsReviewModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700'
                onClick={handleReviewSubmission}
              >
                Submit Review
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CommitteeResearchView;
