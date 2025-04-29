import React from "react";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  FileText,
  Check,
  X,
  AlertTriangle,
  Filter,
  ChevronDown,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";

const StudentResearchSubmission = () => {
  // Sample data for research submissions
  const [researchSubmissions, setResearchSubmissions] = useState([
    {
      id: 1,
      title:
        "Impact of Climate Change on Agricultural Productivity in Afghanistan",
      abstract:
        "This research examines the effects of climate change on agricultural productivity in various regions of Afghanistan, focusing on crop yields and adaptation strategies.",
      student_id: "CS20230",
      student_name: "Zahra Ahmadi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      submission_date: "2025-03-15T10:30:00Z",
      file_path: "/uploads/research/climate-change-agriculture.pdf",
      keywords: ["Climate Change", "Agriculture", "Sustainability"],
      status: "pending",
      reviewer_comments: "",
      reviewer_id: "",
      review_date: null,
    },
    {
      id: 2,
      title:
        "Machine Learning Approaches for Fraud Detection in Financial Transactions",
      abstract:
        "This study proposes a novel machine learning model for detecting fraudulent transactions in banking systems, with a focus on reducing false positives while maintaining high detection rates.",
      student_id: "CS20231",
      student_name: "Ahmad Rahimi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e2",
      department_name: "Computer Science",
      submission_date: "2025-03-10T14:45:00Z",
      file_path: "/uploads/research/ml-fraud-detection.pdf",
      keywords: ["Machine Learning", "Fraud Detection", "Financial Security"],
      status: "accepted",
      reviewer_comments:
        "Excellent methodology and well-documented results. Approved for publication.",
      reviewer_id: "PROF001",
      review_date: "2025-03-20T09:15:00Z",
    },
    {
      id: 3,
      title:
        "Microfinance and Women's Economic Empowerment in Rural Communities",
      abstract:
        "This research investigates the impact of microfinance initiatives on women's economic empowerment in rural communities, analyzing data from three provinces over a five-year period.",
      student_id: "BUS20229",
      student_name: "Fatima Noori",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e3",
      department_name: "Finance",
      submission_date: "2025-02-28T11:20:00Z",
      file_path: "/uploads/research/microfinance-women-empowerment.pdf",
      keywords: ["Microfinance", "Women Empowerment", "Rural Development"],
      status: "rejected",
      reviewer_comments:
        "The methodology has significant flaws and the literature review is incomplete. Please revise and resubmit with a more rigorous approach.",
      reviewer_id: "PROF002",
      review_date: "2025-03-12T16:30:00Z",
    },
    {
      id: 4,
      title:
        "Sustainable Urban Planning for Growing Cities in Developing Countries",
      abstract:
        "This paper presents a framework for sustainable urban planning in rapidly growing cities of developing countries, with a case study of Kabul's urban expansion.",
      student_id: "URB20225",
      student_name: "Mohammed Karimi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e4",
      department_name: "Urban Planning",
      submission_date: "2025-03-05T09:00:00Z",
      file_path: "/uploads/research/sustainable-urban-planning.pdf",
      keywords: ["Urban Planning", "Sustainability", "Developing Countries"],
      status: "pending",
      reviewer_comments: "",
      reviewer_id: "",
      review_date: null,
    },
    {
      id: 5,
      title:
        "The Role of Digital Technologies in Improving Educational Outcomes",
      abstract:
        "This research examines how digital technologies can enhance learning outcomes in higher education institutions, with a focus on blended learning approaches.",
      student_id: "EDU20227",
      student_name: "Sarah Johnson",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e5",
      department_name: "Education",
      submission_date: "2025-03-18T13:15:00Z",
      file_path: "/uploads/research/digital-tech-education.pdf",
      keywords: [
        "Educational Technology",
        "Digital Learning",
        "Higher Education",
      ],
      status: "accepted",
      reviewer_comments:
        "Well-researched with strong empirical evidence. Approved for publication.",
      reviewer_id: "PROF003",
      review_date: "2025-03-25T10:45:00Z",
    },
  ]);

  // Sample committee members
  const committeeMembers = [
    { id: "PROF001", name: "Dr. Ahmad Ahmadi", department: "Economics" },
    { id: "PROF002", name: "Dr. Fatima Noori", department: "Computer Science" },
    { id: "PROF003", name: "Prof. Mohammad Karimi", department: "Finance" },
    { id: "PROF004", name: "Dr. Sarah Johnson", department: "Economics" },
    { id: "PROF005", name: "Dr. Ali Hassan", department: "Mathematics" },
  ];

  // State for UI
  const [activeTab, setActiveTab] = useState("student"); // student, committee, or admin
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/departments/");

        const data = await response.json();
        console.log(data)
        setDepartmentsList(data.departments || []); // Adjust if your API response format is different
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
  
    fetchDepartments();
  }, []);

  // Form data for new submission
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    student_id: "CS20230", // This would come from the logged-in user in a real app
    student_name: "Zahra Ahmadi", // This would come from the logged-in user in a real app
    department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
    department_name: "Economics", // This would come from the logged-in user in a real app
    file_path: "",
    keywords: "",
  });

  // Form data for review
  const [reviewData, setReviewData] = useState({
    status: "pending",
    reviewer_comments: "",
    reviewer_id: "PROF001", // This would come from the logged-in user in a real app
  });

  // Get unique departments for filters
  const departments = [
    ...new Set(
      researchSubmissions.map((submission) => submission.department_name)
    ),
  ].sort();

  // Filter submissions based on active tab, status, department, and search term
  useEffect(() => {
    let result = [...researchSubmissions];

    // Filter based on active tab
    if (activeTab === "student") {
      // In a real app, this would filter by the logged-in student's ID
      result = result.filter(
        (submission) => submission.student_id === "CS20230"
      );
    } else if (activeTab === "committee") {
      // In a real app, this would filter by the logged-in committee member's department
      result = result.filter(
        (submission) => submission.department_name === "Economics"
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (submission) => submission.status === statusFilter
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(
        (submission) => submission.department_name === departmentFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (submission) =>
          submission.title.toLowerCase().includes(term) ||
          submission.abstract.toLowerCase().includes(term) ||
          submission.student_name.toLowerCase().includes(term) ||
          (submission.keywords &&
            submission.keywords.some((keyword) =>
              keyword.toLowerCase().includes(term)
            ))
      );
    }

    setFilteredSubmissions(result);
  }, [
    researchSubmissions,
    activeTab,
    statusFilter,
    departmentFilter,
    searchTerm,
  ]);

  // Table columns configuration
  const studentColumns = [
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
              Submitted: {formatDate(row.submission_date)}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Keywords",
      accessor: "keywords",
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          {row.keywords.map((keyword, index) => (
            <span
              key={index}
              className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
            >
              {keyword}
            </span>
          ))}
        </div>
      ),
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
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  const committeeColumns = [
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
      render: (row) => formatDate(row.submission_date),
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
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

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
      render: (row) => formatDate(row.submission_date),
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
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Reviewer",
      accessor: "reviewer_id",
      render: (row) => {
        if (!row.reviewer_id)
          return <span className='text-gray-400'>Not assigned</span>;
        const reviewer = committeeMembers.find(
          (member) => member.id === row.reviewer_id
        );
        return reviewer ? reviewer.name : row.reviewer_id;
      },
    },
  ];

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value,
    });
  };

  const handleKeywordsChange = (e) => {
    const keywords = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setFormData({
      ...formData,
      keywords,
    });
  };

  // CRUD operations
  const handleSubmitResearch = async () => {
    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(",").map((keyword) => keyword.trim()),
      };
  
      const response = await fetch("http://localhost:4400/api/v1/research/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit research");
      }
  
      const data = await response.json();
      console.log("Research submitted successfully:", data);
  
      setIsSubmitModalOpen(false);
      resetForm();
      // Optionally refetch submissions here if needed
    } catch (error) {
      console.error("Error submitting research:", error);
      alert("Failed to submit research. Please try again.");
    }
  };
  

  const handleReviewSubmission = () => {
    const updatedSubmissions = researchSubmissions.map((submission) =>
      submission.id === currentSubmission.id
        ? {
            ...submission,
            status: reviewData.status,
            reviewer_comments: reviewData.reviewer_comments,
            reviewer_id: reviewData.reviewer_id,
            review_date: new Date().toISOString(),
          }
        : submission
    );

    setResearchSubmissions(updatedSubmissions);
    setIsReviewModalOpen(false);
    resetReviewForm();
  };

  const openReviewModal = (submission) => {
    setCurrentSubmission(submission);
    setReviewData({
      status: submission.status,
      reviewer_comments: submission.reviewer_comments || "",
      reviewer_id: submission.reviewer_id || "PROF001", // This would come from the logged-in user in a real app
    });
    setIsReviewModalOpen(true);
  };

  const openViewModal = (submission) => {
    setCurrentSubmission(submission);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      abstract: "",
      student_id: "CS20230", // This would come from the logged-in user in a real app
      student_name: "Zahra Ahmadi", // This would come from the logged-in user in a real app
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics", // This would come from the logged-in user in a real app
      file_path: "",
      keywords: "",
    });
  };

  const resetReviewForm = () => {
    setReviewData({
      status: "pending",
      reviewer_comments: "",
      reviewer_id: "PROF001", // This would come from the logged-in user in a real app
    });
  };

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusCounts = () => {
    const counts = {
      pending: researchSubmissions.filter(
        (submission) => submission.status === "pending"
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

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Research Paper Submissions
        </h2>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "student"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("student")}
          >
            Student View
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "committee"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("committee")}
          >
            Committee View
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "admin"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>
              {researchSubmissions.length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Submissions</p>
            <p className='text-lg font-semibold text-gray-800'>
              Research Papers
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-yellow-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-yellow-500 font-bold'>
              {statusCounts.pending}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Pending Review</p>
            <p className='text-lg font-semibold text-gray-800'>
              Awaiting Decision
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
              Approved Papers
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
              Declined Papers
            </p>
          </div>
        </div>
      </div>

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
                  name="department_id"
                  value={formData.department_id}
                  onChange={(e) => {
                    const selectedDeptId = e.target.value;
                    const selectedDept = departmentsList.find(dept => dept._id === selectedDeptId);
                    setFormData({
                      ...formData,
                      department_id: selectedDeptId,
                      department_name: selectedDept ? selectedDept.name : "",
                    });
                  }}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  required
                >
                  <option value="">Select Department</option>
                  {departmentsList.map((dept) => (
                    <option key={dept._id} value={dept._id}>
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

          {activeTab === "student" && (
            <button
              className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={() => {
                resetForm();
                setIsSubmitModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              Submit Research
            </button>
          )}
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
              {activeTab === "student"
                ? "You haven't submitted any research papers yet."
                : "No submissions match your current filters."}
            </p>
            {activeTab === "student" && (
              <button
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                onClick={() => {
                  resetForm();
                  setIsSubmitModalOpen(true);
                }}
              >
                Submit Your First Research Paper
              </button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  {(activeTab === "student"
                    ? studentColumns
                    : activeTab === "committee"
                    ? committeeColumns
                    : adminColumns
                  ).map((column, index) => (
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
                  <tr key={submission.id} className='hover:bg-gray-50'>
                    {(activeTab === "student"
                      ? studentColumns
                      : activeTab === "committee"
                      ? committeeColumns
                      : adminColumns
                    ).map((column, colIndex) => (
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
                        {activeTab === "committee" &&
                          submission.status === "pending" && (
                            <button
                              className='text-green-600 hover:text-green-900'
                              onClick={() => openReviewModal(submission)}
                              title='Review Submission'
                            >
                              <MessageSquare size={18} />
                            </button>
                          )}
                        <button
                          className='text-gray-600 hover:text-gray-900'
                          onClick={() => {
                            // In a real app, this would download the file
                            alert(`Downloading: ${submission.file_path}`);
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

      {/* Submit Research Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title='Submit Research Paper'
        size='lg'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitResearch();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <FormField
              label='Paper Title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Abstract'
              name='abstract'
              type='textarea'
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Student ID'
                name='student_id'
                value={formData.student_id}
                onChange={handleInputChange}
                disabled
              />
              <FormField
                label='Student Name'
                name='student_name'
                value={formData.student_name}
                onChange={handleInputChange}
                disabled
              />
              <FormField
                label='Department'
                name='department_name'
                value={formData.department_name}
                onChange={handleInputChange}
                disabled
              />
              <FormField
                label='Keywords (comma separated)'
                name='keywords'
                value={formData.keywords}
                onChange={handleKeywordsChange}
                required
                placeholder='e.g. Climate Change, Agriculture, Sustainability'
              />
            </div>
            <div className='border border-dashed border-gray-300 rounded-lg p-6'>
              <div className='flex flex-col items-center justify-center'>
                <FileText size={48} className='text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Upload Research Paper
                </h3>
                <p className='text-gray-500 text-sm mb-4 text-center'>
                  Upload your research paper in PDF format. Maximum file size:
                  10MB
                </p>
                <input
                  type='file'
                  id='file_upload'
                  className='hidden'
                  accept='.pdf'
                  onChange={(e) => {
                    // In a real app, this would handle file upload
                    setFormData({
                      ...formData,
                      file_path: e.target.files[0]?.name || "",
                    });
                  }}
                />
                <label
                  htmlFor='file_upload'
                  className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors cursor-pointer'
                >
                  Select File
                </label>
                {formData.file_path && (
                  <div className='mt-4 flex items-center'>
                    <FileText size={16} className='text-[#004B87] mr-2' />
                    <span className='text-sm'>{formData.file_path}</span>
                  </div>
                )}
              </div>
            </div>

            <div className='bg-blue-50 p-4 rounded-lg'>
              <div className='flex items-start'>
                <AlertTriangle
                  size={20}
                  className='text-blue-500 mr-2 mt-0.5'
                />
                <div>
                  <h4 className='text-sm font-medium text-blue-800'>
                    Important Information
                  </h4>
                  <p className='text-sm text-blue-600'>
                    Your submission will be reviewed by the research committee.
                    You will be notified once a decision has been made. Please
                    ensure your paper follows the university's research
                    guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              >
                <Save size={18} className='inline mr-2' />
                Submit Research
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title='Review Research Submission'
        size='lg'
      >
        {currentSubmission && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReviewSubmission();
            }}
          >
            <div className='space-y-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  {currentSubmission.title}
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Submitted by {currentSubmission.student_name} on{" "}
                  {formatDate(currentSubmission.submission_date)}
                </p>
                <div className='flex flex-wrap gap-1 mb-4'>
                  {currentSubmission.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <h4 className='text-sm font-medium text-gray-700 mb-1'>
                  Abstract
                </h4>
                <p className='text-sm text-gray-600'>
                  {currentSubmission.abstract}
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-800'>
                  Review Decision
                </h3>
                <div className='flex items-center'>
                  <a
                    href='#'
                    className='text-[#004B87] hover:underline text-sm flex items-center'
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, this would download the file
                      alert(`Downloading: ${currentSubmission.file_path}`);
                    }}
                  >
                    <Download size={16} className='mr-1' />
                    Download Paper
                  </a>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Review Status
                  </label>
                  <div className='flex gap-4'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='status_pending'
                        name='status'
                        value='pending'
                        checked={reviewData.status === "pending"}
                        onChange={handleReviewChange}
                        className='h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300'
                      />
                      <label
                        htmlFor='status_pending'
                        className='ml-2 text-sm text-gray-700'
                      >
                        Pending (More Review Needed)
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='status_accepted'
                        name='status'
                        value='accepted'
                        checked={reviewData.status === "accepted"}
                        onChange={handleReviewChange}
                        className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300'
                      />
                      <label
                        htmlFor='status_accepted'
                        className='ml-2 text-sm text-gray-700'
                      >
                        Accept
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='status_rejected'
                        name='status'
                        value='rejected'
                        checked={reviewData.status === "rejected"}
                        onChange={handleReviewChange}
                        className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300'
                      />
                      <label
                        htmlFor='status_rejected'
                        className='ml-2 text-sm text-gray-700'
                      >
                        Reject
                      </label>
                    </div>
                  </div>
                </div>

                <FormField
                  label='Reviewer Comments'
                  name='reviewer_comments'
                  type='textarea'
                  value={reviewData.reviewer_comments}
                  onChange={handleReviewChange}
                  placeholder='Provide detailed feedback on the research paper...'
                  required
                />

                <div className='bg-yellow-50 p-4 rounded-lg'>
                  <div className='flex items-start'>
                    <AlertTriangle
                      size={20}
                      className='text-yellow-500 mr-2 mt-0.5'
                    />
                    <div>
                      <h4 className='text-sm font-medium text-yellow-800'>
                        Review Guidelines
                      </h4>
                      <p className='text-sm text-yellow-600'>
                        Please provide constructive feedback to help the student
                        improve their research. If rejecting, clearly explain
                        the reasons and suggest improvements. Your review will
                        be visible to the student.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6 flex justify-end space-x-3'>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    reviewData.status === "accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : reviewData.status === "rejected"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#004B87] hover:bg-[#003a6a]"
                  }`}
                >
                  {reviewData.status === "accepted" ? (
                    <Check size={18} className='mr-2' />
                  ) : reviewData.status === "rejected" ? (
                    <X size={18} className='mr-2' />
                  ) : (
                    <Save size={18} className='mr-2' />
                  )}
                  Submit Review
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* View Submission Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Research Paper Details'
        size='lg'
      >
        {currentSubmission && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <div className='flex justify-between items-start'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                  {currentSubmission.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentSubmission.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : currentSubmission.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSubmission.status.charAt(0).toUpperCase() +
                    currentSubmission.status.slice(1)}
                </span>
              </div>
              <p className='text-gray-600 text-sm mb-4'>
                Submitted by {currentSubmission.student_name} on{" "}
                {formatDate(currentSubmission.submission_date)}
              </p>
              <div className='flex flex-wrap gap-2 mb-4'>
                {currentSubmission.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Abstract
              </h4>
              <div className='bg-white border border-gray-200 p-6 rounded-md'>
                <p className='text-gray-700'>{currentSubmission.abstract}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h4 className='text-lg font-medium text-gray-800'>
                Research Paper
              </h4>
              <button
                className='flex items-center text-[#004B87] hover:underline'
                onClick={() => {
                  // In a real app, this would download the file
                  alert(`Downloading: ${currentSubmission.file_path}`);
                }}
              >
                <Download size={18} className='mr-2' />
                Download Paper
              </button>
            </div>

            <div className='bg-gray-50 p-4 rounded-md flex items-center'>
              <div className='w-10 h-10 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center mr-3'>
                <FileText size={20} />
              </div>
              <div>
                <p className='font-medium text-gray-800'>Research Paper PDF</p>
                <p className='text-sm text-gray-500'>
                  {currentSubmission.file_path.split("/").pop()}
                </p>
              </div>
            </div>

            {(currentSubmission.status === "accepted" ||
              currentSubmission.status === "rejected") && (
              <div>
                <h4 className='text-lg font-medium text-gray-800 mb-2'>
                  Review Feedback
                </h4>
                <div
                  className={`p-6 rounded-md ${
                    currentSubmission.status === "accepted"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <div className='flex items-start'>
                    {currentSubmission.status === "accepted" ? (
                      <Check size={20} className='text-green-500 mr-3 mt-0.5' />
                    ) : (
                      <X size={20} className='text-red-500 mr-3 mt-0.5' />
                    )}
                    <div>
                      <p className='text-sm text-gray-700 mb-2'>
                        Reviewed on{" "}
                        {currentSubmission.review_date
                          ? formatDate(currentSubmission.review_date)
                          : "N/A"}
                      </p>
                      <p className='text-gray-700'>
                        {currentSubmission.reviewer_comments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentResearchSubmission;


