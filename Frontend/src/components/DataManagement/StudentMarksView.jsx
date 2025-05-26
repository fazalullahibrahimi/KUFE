import React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Search,
  FileText,
  Star,
  BarChart3,

  AlertCircle,
  Loader,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import axios from "axios";
import API_URL from "../../config/api";

const StudentMarksView = () => {
  const { t, isRTL } = useLanguage();

  // State management
  const [studentSearchId, setStudentSearchId] = useState("");
  const [academicRecord, setAcademicRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch semesters, subjects, and departments data on component mount
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        console.log("Fetching required data...");
        const [semestersResponse, subjectsResponse, departmentsResponse] = await Promise.all([
          axios.get(`${API_URL}/semesters`),
          axios.get(`${API_URL}/subjects`),
          axios.get(`${API_URL}/departments`)
        ]);

        console.log("Semesters response:", semestersResponse.data);
        console.log("Subjects response:", subjectsResponse.data);
        console.log("Departments response:", departmentsResponse.data);

        // Handle different response structures
        if (semestersResponse.data.status === "success") {
          const semestersData = semestersResponse.data.data.semesters || semestersResponse.data.data || [];
          setSemesters(semestersData);
          console.log("Semesters set:", semestersData);
        } else {
          console.error("Semesters API failed:", semestersResponse.data);
        }

        if (subjectsResponse.data.status === "success") {
          const subjectsData = subjectsResponse.data.data.subjects || subjectsResponse.data.data || [];
          setSubjects(subjectsData);
          console.log("Subjects set:", subjectsData);
        } else {
          console.error("Subjects API failed:", subjectsResponse.data);
        }

        if (departmentsResponse.data.status === "success") {
          const departmentsData = departmentsResponse.data.data.departments || departmentsResponse.data.data || [];
          setDepartments(departmentsData);
          console.log("Departments set:", departmentsData);
        } else {
          console.error("Departments API failed:", departmentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching required data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchRequiredData();
  }, []);

  // Helper function to process marks data into semester records
  const processMarksIntoSemesters = (marks, semestersData, subjectsData) => {
    console.log("Processing marks:", marks);
    console.log("Available semesters:", semestersData);
    console.log("Available subjects:", subjectsData);

    const semesterRecords = {};

    marks.forEach((mark, index) => {
      console.log(`Processing mark ${index}:`, mark);

      // Find semester and subject details
      const semester = semestersData.find(sem => sem._id === mark.semester_id);
      const subject = subjectsData.find(sub => sub._id === mark.subject_id);

      console.log(`Found semester for ${mark.semester_id}:`, semester);
      console.log(`Found subject for ${mark.subject_id}:`, subject);

      const semesterName = semester ? semester.name : `Unknown Semester (${mark.semester_id})`;

      if (!semesterRecords[semesterName]) {
        semesterRecords[semesterName] = {
          subjects: [],
          semesterGPA: "0.0" // Will be calculated if needed
        };
      }

      // Add subject with mark details - use credit_hours from subject model
      const subjectInfo = subject ? {
        name: subject.name,
        code: subject.code,
        credits: subject.credit_hours || 3
      } : {
        name: "Unknown Subject",
        code: "N/A",
        credits: 3
      };

      semesterRecords[semesterName].subjects.push({
        ...mark,
        subject: subjectInfo,
        credits: subjectInfo.credits
      });
    });

    // Calculate semester GPAs (simplified calculation)
    Object.keys(semesterRecords).forEach(semesterName => {
      const subjects = semesterRecords[semesterName].subjects;
      if (subjects.length > 0) {
        const totalPoints = subjects.reduce((sum, subject) => {
          const gradePoints = getGradePoints(subject.grade);
          return sum + (gradePoints * (subject.credits || 3));
        }, 0);
        const totalCredits = subjects.reduce((sum, subject) => sum + (subject.credits || 3), 0);
        const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
        semesterRecords[semesterName].semesterGPA = gpa;
      }
    });

    console.log("Final semester records:", semesterRecords);
    return semesterRecords;
  };

  // Helper function to convert grade to grade points
  const getGradePoints = (grade) => {
    const gradeMap = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    return gradeMap[grade] || 0.0;
  };

  // API function to fetch academic record
  const fetchAcademicRecord = async (studentIdNumber) => {
    const trimmedId = studentIdNumber.trim();
    if (!trimmedId) {
      setError("Please enter a valid student ID number");
      return;
    }

    // Check if required data is available
    if (semesters.length === 0 || subjects.length === 0 || departments.length === 0) {
      setError("Loading required data... Please try again in a moment.");
      return;
    }

    setLoading(true);
    setError("");
    setAcademicRecord(null);

    try {
      console.log(`Making API call to: ${API_URL}/students/academic-record/${trimmedId}`);
      console.log("Available data for processing:");
      console.log("Semesters:", semesters.length);
      console.log("Subjects:", subjects.length);
      console.log("Departments:", departments.length);

      const response = await axios.get(
        `${API_URL}/students/academic-record/${trimmedId}`
      );

      // Fix: Check for response.data.status === "success" instead of response.data.success
      if (response.data.status === "success") {
        const rawData = response.data.data;
        console.log("Raw student data:", rawData);

        // Process marks into semester records
        const semesterRecords = processMarksIntoSemesters(
          rawData.student.marks || [],
          semesters,
          subjects
        );

        // Find department information
        const department = departments.find(dept => dept._id === rawData.student.department);
        console.log("Found department:", department);

        // Create the processed academic record
        const processedRecord = {
          ...rawData,
          student: {
            ...rawData.student,
            department: department || { name: "Unknown Department" }
          },
          semesterRecords: semesterRecords
        };

        console.log("Processed record:", processedRecord);
        setAcademicRecord(processedRecord);

        // Set the first semester as selected by default
        const semesterKeys = Object.keys(semesterRecords);
        if (semesterKeys.length > 0) {
          setSelectedSemester(semesterKeys[0]);
        }
      } else {
        setError("Failed to fetch academic record");
      }
    } catch (error) {
      console.error("Error fetching academic record:", error);
      if (error.response?.status === 404) {
        setError(`Student not found with ID: ${trimmedId}`);
      } else if (error.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please make sure the backend server is running.");
      } else {
        setError("Failed to fetch academic record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStudentIdSearch = (e) => {
    setStudentSearchId(e.target.value);
    setError(""); // Clear any previous errors
  };

  const handleViewAcademicRecord = () => {
    fetchAcademicRecord(studentSearchId);
  };

  // Helper function to get grade color
  const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A" || grade === "A-")
      return "text-green-600";
    if (grade === "B+" || grade === "B" || grade === "B-")
      return "text-blue-600";
    if (grade === "C+" || grade === "C" || grade === "C-")
      return "text-yellow-600";
    if (grade === "D") return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className='space-y-8'>
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
                <GraduationCap className='h-8 w-8 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent'>
                  Access Your Academic Records
                </h2>
                <p className='text-gray-600 mt-1'>
                  Please enter your student identification number to access your
                  complete academic transcript and performance records
                </p>
              </div>
            </div>
            <div className='hidden md:flex items-center space-x-2 text-[#1D3D6F]'>
              <FileText className='h-5 w-5' />
              <span className='text-sm font-medium'>
                Official Academic Transcript
              </span>
            </div>
          </div>

          {/* Search Section */}
          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative flex-grow'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Enter your Student ID'
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent transition-all duration-200 bg-white/90'
                  value={studentSearchId}
                  onChange={handleStudentIdSearch}
                />
              </div>
              <button
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleViewAcademicRecord}
                disabled={loading || !studentSearchId.trim() || dataLoading}
              >
                {loading || dataLoading ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <Search className='h-4 w-4' />
                )}
                <span>
                  {dataLoading
                    ? "Loading System Data..."
                    : loading
                    ? "Loading..."
                    : "View Complete Academic Record"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3'>
          <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
          <p className='text-red-700 font-medium'>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        {academicRecord ? (
          <div className='p-8'>
            {/* Student Profile Header */}
            <div className='relative bg-gradient-to-br from-[#E8ECEF]/50 via-[#E8ECEF]/30 to-white rounded-2xl p-8 mb-8 border border-[#E8ECEF]/50 overflow-hidden'>
              {/* Background decoration */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F7B500]/20 to-transparent rounded-full blur-2xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#2C4F85]/20 to-transparent rounded-full blur-xl'></div>

              <div className='relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
                <div className='flex items-center space-x-6'>
                  <div className='relative'>
                    <div className='w-20 h-20 bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg'>
                      {academicRecord.student.name.charAt(0)}
                    </div>
                    <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center border-4 border-white'>
                      <Award className='h-4 w-4 text-white' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-3xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent mb-3'>
                      {academicRecord.student.name}
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                          <User className='h-4 w-4 text-[#1D3D6F]' />
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
                            Student ID
                          </p>
                          <p className='text-sm font-semibold text-gray-800'>
                            {academicRecord.student.student_id_number}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                          <BookOpen className='h-4 w-4 text-[#2C4F85]' />
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
                            Department
                          </p>
                          <p className='text-sm font-semibold text-gray-800'>
                            {academicRecord.student.department?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                          <Calendar className='h-4 w-4 text-[#F7B500]' />
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
                            Enrollment Year
                          </p>
                          <p className='text-sm font-semibold text-gray-800'>
                            {academicRecord.student.enrollment_year}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPA Card */}
                <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 min-w-[200px]'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-3'>
                      <div className='p-2 bg-gradient-to-br from-[#F7B500] to-[#F7B500]/80 rounded-lg'>
                        <Star className='h-5 w-5 text-white' />
                      </div>
                    </div>
                    <p className='text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium'>
                      Cumulative Grade Point Average
                    </p>
                    <p className='text-4xl font-bold bg-gradient-to-r from-[#1D3D6F] via-[#2C4F85] to-[#F7B500] bg-clip-text text-transparent'>
                      {academicRecord.academicSummary.overallCGPA}
                    </p>
                    <div className='mt-2 flex items-center justify-center'>
                      <TrendingUp className='h-4 w-4 text-[#F7B500] mr-1' />
                      <span className='text-xs text-[#1D3D6F] font-medium'>
                        {academicRecord.academicSummary.academicStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Results Section */}
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                    <BarChart3 className='h-5 w-5 text-[#1D3D6F]' />
                  </div>
                  <h3 className='text-xl font-semibold bg-gradient-to-r from-[#000000] to-[#1D3D6F] bg-clip-text text-transparent'>
                    Academic Performance Overview
                  </h3>
                </div>
              </div>

              {/* Semester Selection */}
              <div className='bg-[#E8ECEF]/30 rounded-xl p-6 border border-[#E8ECEF]'>
                <div className='flex items-center space-x-2 mb-4'>
                  <Calendar className='h-5 w-5 text-[#1D3D6F]' />
                  <h4 className='text-lg font-medium text-gray-800'>
                    Select Academic Semester
                  </h4>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {Object.entries(academicRecord.semesterRecords).map(([semesterKey, semesterData]) => {
                    const hasResults = semesterData.subjects.length > 0;
                    const semesterGPA = semesterData.semesterGPA;

                    let gpaColor = "text-[#F7B500]";
                    let gpaBg = "bg-[#F7B500]/10";
                    let borderColor = "border-[#F7B500]/30";

                    if (semesterGPA) {
                      if (Number.parseFloat(semesterGPA) >= 3.0) {
                        gpaColor = "text-[#F7B500]";
                        gpaBg = "bg-[#F7B500]/10";
                        borderColor = "border-[#F7B500]/30";
                      } else if (Number.parseFloat(semesterGPA) >= 2.0) {
                        gpaColor = "text-[#2C4F85]";
                        gpaBg = "bg-[#2C4F85]/10";
                        borderColor = "border-[#2C4F85]/30";
                      }
                    }

                    return (
                      <button
                        key={semesterKey}
                        className={`relative group rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          !hasResults
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-lg"
                        } ${
                          selectedSemester === semesterKey
                            ? "ring-2 ring-[#1D3D6F] ring-offset-2 shadow-lg scale-105"
                            : ""
                        }`}
                        onClick={() =>
                          hasResults && setSelectedSemester(semesterKey)
                        }
                        disabled={!hasResults}
                      >
                        <div
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedSemester === semesterKey
                              ? "bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] text-white border-[#1D3D6F]"
                              : hasResults
                              ? `bg-white ${borderColor} hover:bg-[#E8ECEF]/30`
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                        >
                          <div className='text-center space-y-2'>
                            <div className='font-semibold text-sm'>
                              {semesterKey}
                            </div>

                            {hasResults && (
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedSemester === semesterKey
                                    ? "bg-white/20 text-white"
                                    : `${gpaBg} ${gpaColor}`
                                }`}
                              >
                                <Star className='h-3 w-3 mr-1' />
                                GPA: {semesterGPA}
                              </div>
                            )}

                            {!hasResults && (
                              <div className='text-xs text-gray-400'>
                                No Records Available
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedSemester === semesterKey && (
                          <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#F7B500] rounded-full'></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Semester Results */}
              <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
                {!selectedSemester || !academicRecord.semesterRecords[selectedSemester] ||
                 academicRecord.semesterRecords[selectedSemester].subjects.length === 0 ? (
                  <div className='p-12 text-center'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <Calendar className='h-12 w-12 text-gray-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                      No Results Available
                    </h3>
                    <p className='text-gray-600 max-w-md mx-auto'>
                      No academic records found for the selected semester.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Results Header */}
                    <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 px-6 py-4 border-b border-[#E8ECEF]'>
                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                            <FileText className='h-5 w-5 text-[#1D3D6F]' />
                          </div>
                          <div>
                            <h4 className='text-lg font-semibold text-gray-800'>
                              {selectedSemester} Academic Grade Report
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Complete academic performance overview
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <div className='text-right'>
                            <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
                              Semester Grade Point Average
                            </p>
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                Number.parseFloat(academicRecord.semesterRecords[selectedSemester].semesterGPA) >= 3.0
                                  ? "bg-[#F7B500]/20 text-[#F7B500]"
                                  : Number.parseFloat(academicRecord.semesterRecords[selectedSemester].semesterGPA) >= 2.0
                                  ? "bg-[#2C4F85]/20 text-[#2C4F85]"
                                  : "bg-[#F7B500]/20 text-[#F7B500]"
                              }`}
                            >
                              <Star className='h-3 w-3 mr-1' />
                              {academicRecord.semesterRecords[selectedSemester].semesterGPA}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results Table */}
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'>
                          <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                              <div className='flex items-center space-x-2'>
                                <BookOpen className='h-4 w-4' />
                                <span>Course Subject</span>
                              </div>
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                              Course Credit Hours
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                              Midterm Examination
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                              Final Examination
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                              Course Assignment
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                              <div className='flex items-center justify-center space-x-2'>
                                <Award className='h-4 w-4' />
                                <span>Total Grade</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-100'>
                          {academicRecord.semesterRecords[selectedSemester].subjects.map((subjectData, index) => {
                              return (
                                <tr
                                  key={index}
                                  className={`hover:bg-blue-50/50 transition-all duration-200 ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-50/30"
                                  }`}
                                >
                                  <td className='px-6 py-5'>
                                    <div className='flex items-center space-x-3'>
                                      <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                                        <BookOpen className='h-4 w-4 text-[#1D3D6F]' />
                                      </div>
                                      <div>
                                        <div className='text-sm font-semibold text-gray-900'>
                                          {subjectData.subject?.name || "Unknown Subject"}
                                        </div>
                                        <div className='text-xs text-gray-500 mt-1 font-medium'>
                                          {subjectData.subject?.code || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <div className='inline-flex items-center justify-center w-10 h-10 bg-[#E8ECEF] text-[#1D3D6F] rounded-full text-sm font-bold'>
                                      {subjectData.credits || 3}
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#2C4F85]/10 text-[#2C4F85]'>
                                      {subjectData.midterm}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#1D3D6F]/10 text-[#1D3D6F]'>
                                      {subjectData.final}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#F7B500]/10 text-[#F7B500]'>
                                      {subjectData.assignment}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <div className='flex items-center justify-center space-x-2'>
                                      <span className='inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#E8ECEF] to-[#E8ECEF]/80 text-[#1D3D6F] border border-[#E8ECEF]'>
                                        <Award className='h-4 w-4 mr-2 text-[#F7B500]' />
                                        {subjectData.total}
                                      </span>
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(subjectData.grade)} bg-gray-100`}>
                                        {subjectData.grade}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='p-12 text-center'>
            <div className='w-32 h-32 bg-gradient-to-br from-[#E8ECEF] to-[#E8ECEF]/50 rounded-full flex items-center justify-center mx-auto mb-8'>
              <User className='h-16 w-16 text-[#1D3D6F]' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
              Enter your Student ID
            </h3>
            <p className='text-gray-600 max-w-md mx-auto text-lg leading-relaxed'>
              Please enter your student identification number to access your
              complete academic transcript and performance records
            </p>
            <div className='mt-8 flex items-center justify-center space-x-2 text-[#1D3D6F]'>
              <Search className='h-5 w-5' />
              <span className='text-sm font-medium'>
                Ready to Access Academic Records
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarksView;
