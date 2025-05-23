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
  Mail,
} from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  notifyTeacherOfSubmission,
  notifyStudentOfFeedback,
  getDepartmentTeacher,
  getStudentById,
  getReviewerById,
} from "../services/emailService";

const AdminResearchView = () => {
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

  // State for committee members
  const [committeeMembers, setCommitteeMembers] = useState([]);

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/committee-members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Committee members data:", data);

        if (
          data &&
          data.status === "success" &&
          Array.isArray(data.data?.committeeMembers)
        ) {
          setCommitteeMembers(data.data.committeeMembers);
        } else if (Array.isArray(data)) {
          setCommitteeMembers(data);
        } else {
          console.error("Unexpected committee members data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching committee members:", error);
      }
    };

    fetchCommitteeMembers();
  }, []);

  // State for UI
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedCommitteeMember, setSelectedCommitteeMember] = useState("");

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

  // Filter submissions based on status, department, and search term
  useEffect(() => {
    if (loading) return;

    let result = [...researchSubmissions];

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(
        (submission) => submission.department_id === departmentFilter
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
  }, [
    researchSubmissions,
    statusFilter,
    departmentFilter,
    searchTerm,
    loading,
  ]);

  // Table columns configuration
  const adminColumns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <FileText size={16} />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.title}</p>
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
    {
      header: "Reviewer",
      accessor: "reviewer_id",
      render: (row) => {
        if (!row.reviewer_id)
          return <span className='text-gray-400'>Not assigned</span>;

        // Use React's useState and useEffect to fetch and display reviewer name
        const ReviewerName = () => {
          const [name, setName] = useState("Loading...");

          useEffect(() => {
            // Try to find the reviewer in committee members first
            const reviewer = committeeMembers.find((member) => {
              // Check all possible ID combinations
              return (
                String(member.userId?._id) === String(row.reviewer_id) ||
                String(member._id) === String(row.reviewer_id) ||
                String(member.id) === String(row.reviewer_id) ||
                (member.userId &&
                  String(member.userId.id) === String(row.reviewer_id))
              );
            });

            // If reviewer found in committee members
            if (reviewer) {
              const reviewerName =
                reviewer.userId?.fullName ||
                reviewer.userId?.name ||
                reviewer.name ||
                reviewer.fullName;

              if (reviewerName) {
                setName(reviewerName);
                return;
              }
            }

            // If we have reviewer_name directly in the submission
            if (row.reviewer_name) {
              setName(row.reviewer_name);
              return;
            }

            // Fetch from API as last resort
            const fetchName = async () => {
              try {
                const token = getToken();
                const response = await fetch(
                  `${API_BASE_URL}/users/${row.reviewer_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (!response.ok) {
                  setName("Committee Member");
                  return;
                }

                const data = await response.json();
                const user = data.data?.user || data;

                // Get name from various possible properties
                const userName = user.fullName || user.name || user.username;

                if (userName) {
                  setName(userName);
                } else {
                  setName("Committee Member");
                }
              } catch (error) {
                console.error(`Error fetching reviewer name:`, error);
                setName("Committee Member");
              }
            };

            fetchName();
          }, []);

          return <span>{name}</span>;
        };

        return <ReviewerName />;
      },
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
      const payload = {
        status: reviewData.status,
        reviewer_comments: reviewData.reviewer_comments,
        reviewer_id: reviewData.reviewer_id,
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
    setCurrentSubmission(submission);

    // Get current user for reviewer_id
    const currentUser = getCurrentUser();
    const reviewerId =
      currentUser?.id || currentUser?._id || submission.reviewer_id || "";

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

  const openAssignModal = (submission) => {
    setCurrentSubmission(submission);
    setSelectedCommitteeMember(submission.reviewer_id || "");
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmission = async () => {
    try {
      if (!selectedCommitteeMember) {
        alert("Please select a committee member to assign.");
        return;
      }

      const token = getToken();
      const submissionId = currentSubmission._id || currentSubmission.id;

      // Update the research submission with the assigned reviewer
      const payload = {
        reviewer_id: selectedCommitteeMember,
      };

      const response = await fetch(`${API_BASE_URL}/research/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to assign reviewer: ${
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

      // Get the committee member data
      const committeeMember = committeeMembers.find(
        (member) =>
          String(member._id) === String(selectedCommitteeMember) ||
          String(member.id) === String(selectedCommitteeMember) ||
          String(member.userId?._id) === String(selectedCommitteeMember) ||
          (member.userId &&
            String(member.userId.id) === String(selectedCommitteeMember))
      );

      // Send email notification to committee member
      setNotificationStatus({
        sending: true,
        success: null,
        message: "Sending notification to committee member...",
      });

      // Get the student data from the research submission
      const student = {
        name: currentSubmission.student_name,
        email: "student@example.com", // This is just a placeholder
      };

      // Prepare the committee member data for the notification
      const reviewer = {
        name:
          committeeMember?.name ||
          committeeMember?.fullName ||
          committeeMember?.userId?.name ||
          committeeMember?.userId?.fullName ||
          "Committee Member",
        email:
          committeeMember?.email ||
          committeeMember?.userId?.email ||
          "committee@example.com",
      };

      // Import the notification function
      const { notifyTeacherOfSubmission } = await import(
        "../services/emailService"
      );

      // Send the notification
      await notifyTeacherOfSubmission(updatedResearch, student, reviewer);

      setNotificationStatus({
        sending: false,
        success: true,
        message: "Committee member has been notified of the assignment.",
      });

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

      setIsAssignModalOpen(false);
      alert("Research paper successfully assigned to committee member!");
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      setNotificationStatus({
        sending: false,
        success: false,
        message: `Failed to send notification: ${error.message}`,
      });
      alert(`Failed to assign reviewer: ${error.message}. Please try again.`);
    }
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
            All Research Submissions
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

                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Department
                    </label>
                    <select
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value='all'>All Departments</option>
                      {departmentsList.map((dept) => (
                        <option
                          key={dept._id || dept.id}
                          value={dept._id || dept.id}
                        >
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex justify-between'>
                    <button
                      className='text-sm text-gray-600 hover:text-gray-900'
                      onClick={() => {
                        setStatusFilter("all");
                        setDepartmentFilter("all");
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
                No submissions match your current filters.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    {adminColumns.map((column, index) => (
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
                      {adminColumns.map((column, colIndex) => (
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
                          <button
                            className='text-green-600 hover:text-green-900'
                            onClick={() => openAssignModal(submission)}
                            title='Assign to Committee Member'
                          >
                            <span className='flex items-center'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='18'
                                height='18'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              >
                                <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                                <circle cx='9' cy='7' r='4'></circle>
                                <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                                <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
                              </svg>
                            </span>
                          </button>
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

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title='Assign Research Paper to Committee Member'
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
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Select Committee Member
                </label>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={selectedCommitteeMember}
                  onChange={(e) => setSelectedCommitteeMember(e.target.value)}
                >
                  <option value=''>-- Select a Committee Member --</option>
                  {committeeMembers
                    .filter(
                      (member) =>
                        // Only show committee members from the same department as the research
                        !currentSubmission.department_id ||
                        String(member.department_id) ===
                          String(currentSubmission.department_id) ||
                        String(member.department?._id) ===
                          String(currentSubmission.department_id)
                    )
                    .map((member) => {
                      const memberId =
                        member._id ||
                        member.id ||
                        member.userId?._id ||
                        member.userId?.id;
                      const memberName =
                        member.name ||
                        member.fullName ||
                        member.userId?.name ||
                        member.userId?.fullName ||
                        "Committee Member";

                      return (
                        <option key={memberId} value={memberId}>
                          {memberName}
                        </option>
                      );
                    })}
                </select>
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

            <div className='flex justify-between pt-4 border-t border-gray-200'>
              <button
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700'
                onClick={handleAssignSubmission}
              >
                Assign & Notify
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminResearchView;
