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
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const StudentMarksView = () => {
  const { t, isRTL } = useLanguage();

  // Sample data for semesters
  const semesters = [
    { id: 1, name: "Semester 1" },
    { id: 2, name: "Semester 2" },
    { id: 3, name: "Semester 3" },
    { id: 4, name: "Semester 4" },
    { id: 5, name: "Semester 5" },
    { id: 6, name: "Semester 6" },
    { id: 7, name: "Semester 7" },
    { id: 8, name: "Semester 8" },
  ];

  const subjects = [
    {
      id: 1,
      name: "Introduction to Economics",
      code: "ECO101",
      semester_id: 1,
      credit_hours: 3,
    },
    {
      id: 2,
      name: "Principles of Microeconomics",
      code: "ECO102",
      semester_id: 1,
      credit_hours: 3,
    },
    {
      id: 3,
      name: "Mathematics for Economics",
      code: "MATH101",
      semester_id: 1,
      credit_hours: 4,
    },
    {
      id: 4,
      name: "Academic Writing",
      code: "ENG101",
      semester_id: 1,
      credit_hours: 2,
    },
    {
      id: 5,
      name: "Macroeconomics",
      code: "ECO201",
      semester_id: 2,
      credit_hours: 3,
    },
    {
      id: 6,
      name: "Statistics for Economics",
      code: "STAT201",
      semester_id: 2,
      credit_hours: 4,
    },
    {
      id: 7,
      name: "Economic History",
      code: "ECO202",
      semester_id: 2,
      credit_hours: 3,
    },
    {
      id: 8,
      name: "Financial Accounting",
      code: "ACC201",
      semester_id: 2,
      credit_hours: 3,
    },
  ];

  const students = [
    {
      id: "CS20230",
      name: "Zahra Ahmadi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      enrollment_year: 2023,
    },
    {
      id: "CS20231",
      name: "Ahmad Rahimi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      enrollment_year: 2023,
    },
    {
      id: "CS20232",
      name: "Fatima Noori",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      enrollment_year: 2023,
    },
    {
      id: "CS20233",
      name: "Mohammed Karimi",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      enrollment_year: 2023,
    },
    {
      id: "CS20234",
      name: "Sarah Johnson",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      enrollment_year: 2023,
    },
  ];

  // Sample marks data
  const studentMarks = [
    {
      id: 1,
      student_id: "CS20230",
      subject_id: 1,
      semester_id: 1,
      midterm_marks: 18,
      final_marks: 65,
      assignment_marks: 9,
      total_marks: 92,
      grade: "A",
      academic_year: "2023-2024",
    },
    {
      id: 2,
      student_id: "CS20230",
      subject_id: 2,
      semester_id: 1,
      midterm_marks: 15,
      final_marks: 58,
      assignment_marks: 8,
      total_marks: 81,
      grade: "B+",
      academic_year: "2023-2024",
    },
    {
      id: 3,
      student_id: "CS20230",
      subject_id: 3,
      semester_id: 1,
      midterm_marks: 17,
      final_marks: 62,
      assignment_marks: 9,
      total_marks: 88,
      grade: "A-",
      academic_year: "2023-2024",
    },
    {
      id: 4,
      student_id: "CS20230",
      subject_id: 4,
      semester_id: 1,
      midterm_marks: 19,
      final_marks: 68,
      assignment_marks: 10,
      total_marks: 97,
      grade: "A+",
      academic_year: "2023-2024",
    },
    {
      id: 9,
      student_id: "CS20230",
      subject_id: 5,
      semester_id: 2,
      midterm_marks: 17,
      final_marks: 63,
      assignment_marks: 9,
      total_marks: 89,
      grade: "A-",
      academic_year: "2023-2024",
    },
    {
      id: 10,
      student_id: "CS20230",
      subject_id: 6,
      semester_id: 2,
      midterm_marks: 16,
      final_marks: 61,
      assignment_marks: 8,
      total_marks: 85,
      grade: "B+",
      academic_year: "2023-2024",
    },
  ];

  // State for UI
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [studentSearchId, setStudentSearchId] = useState("");
  const [studentFound, setStudentFound] = useState(null);
  const [studentResults, setStudentResults] = useState([]);

  // Find student by ID for student view
  useEffect(() => {
    if (studentSearchId) {
      const found = students.find((s) => s.id === studentSearchId);
      setStudentFound(found || null);

      if (found) {
        const results = studentMarks.filter(
          (mark) => mark.student_id === studentSearchId
        );
        setStudentResults(results);
      } else {
        setStudentResults([]);
      }
    } else {
      setStudentFound(null);
      setStudentResults([]);
    }
  }, [studentSearchId]);

  const handleStudentIdSearch = (e) => {
    setStudentSearchId(e.target.value);
  };

  // Helper functions
  const getSubjectById = (id) => {
    return (
      subjects.find((subject) => subject.id === id) || {
        name: "Unknown Subject",
        code: "N/A",
      }
    );
  };

  const getSemesterById = (id) => {
    return (
      semesters.find((semester) => semester.id === id) || {
        name: "Unknown Semester",
      }
    );
  };

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

  const calculateGPA = (results) => {
    if (!results || results.length === 0) return 0;

    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      D: 1.0,
      F: 0.0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    results.forEach((result) => {
      const subject = getSubjectById(result.subject_id);
      const credits = subject.credit_hours || 0;
      const points = gradePoints[result.grade] || 0;

      totalPoints += points * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const calculateSemesterGPA = (studentId, semesterId) => {
    const semesterResults = studentMarks.filter(
      (mark) => mark.student_id === studentId && mark.semester_id === semesterId
    );
    return calculateGPA(semesterResults);
  };

  const calculateCGPA = (studentId) => {
    const allResults = studentMarks.filter(
      (mark) => mark.student_id === studentId
    );
    return calculateGPA(allResults);
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
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
                onClick={() => {
                  // This is just for UI demonstration, in a real app this would validate the ID
                  if (!studentSearchId) {
                    alert("Please enter a valid student identification number");
                  }
                }}
              >
                <Search className='h-4 w-4' />
                <span>View Complete Academic Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        {studentFound ? (
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
                      {studentFound.name.charAt(0)}
                    </div>
                    <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center border-4 border-white'>
                      <Award className='h-4 w-4 text-white' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-3xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent mb-3'>
                      {studentFound.name}
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
                            {studentFound.id}
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
                            {studentFound.department_name}
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
                            {studentFound.enrollment_year}
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
                      {calculateCGPA(studentFound.id)}
                    </p>
                    <div className='mt-2 flex items-center justify-center'>
                      <TrendingUp className='h-4 w-4 text-[#F7B500] mr-1' />
                      <span className='text-xs text-[#1D3D6F] font-medium'>
                        Excellent Academic Performance
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
                  {semesters.map((semester) => {
                    const semesterResults = studentResults.filter(
                      (result) => result.semester_id === semester.id
                    );
                    const hasResults = semesterResults.length > 0;

                    const semesterGPA = hasResults
                      ? calculateSemesterGPA(studentFound.id, semester.id)
                      : null;

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
                        key={semester.id}
                        className={`relative group rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          !hasResults
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-lg"
                        } ${
                          selectedSemester === semester.id
                            ? "ring-2 ring-[#1D3D6F] ring-offset-2 shadow-lg scale-105"
                            : ""
                        }`}
                        onClick={() =>
                          hasResults && setSelectedSemester(semester.id)
                        }
                        disabled={!hasResults}
                      >
                        <div
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedSemester === semester.id
                              ? "bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] text-white border-[#1D3D6F]"
                              : hasResults
                              ? `bg-white ${borderColor} hover:bg-[#E8ECEF]/30`
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                        >
                          <div className='text-center space-y-2'>
                            <div className='font-semibold text-sm'>
                              {semester.name}
                            </div>

                            {hasResults && (
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedSemester === semester.id
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

                        {selectedSemester === semester.id && (
                          <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#F7B500] rounded-full'></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Semester Results */}
              <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
                {studentResults.filter(
                  (result) => result.semester_id === selectedSemester
                ).length === 0 ? (
                  <div className='p-12 text-center'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <Calendar className='h-12 w-12 text-gray-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                      {t("marks.no_results_available")}
                    </h3>
                    <p className='text-gray-600 max-w-md mx-auto'>
                      {t("marks.no_results_for_semester", {
                        semester: getSemesterById(selectedSemester).name,
                      })}
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
                              {getSemesterById(selectedSemester).name} Academic
                              Grade Report
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
                                Number.parseFloat(
                                  calculateSemesterGPA(
                                    studentFound.id,
                                    selectedSemester
                                  )
                                ) >= 3.0
                                  ? "bg-[#F7B500]/20 text-[#F7B500]"
                                  : Number.parseFloat(
                                      calculateSemesterGPA(
                                        studentFound.id,
                                        selectedSemester
                                      )
                                    ) >= 2.0
                                  ? "bg-[#2C4F85]/20 text-[#2C4F85]"
                                  : "bg-[#F7B500]/20 text-[#F7B500]"
                              }`}
                            >
                              <Star className='h-3 w-3 mr-1' />
                              {calculateSemesterGPA(
                                studentFound.id,
                                selectedSemester
                              )}
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
                          {studentResults
                            .filter(
                              (result) =>
                                result.semester_id === selectedSemester
                            )
                            .map((result, index) => {
                              const subject = getSubjectById(result.subject_id);
                              return (
                                <tr
                                  key={result.id}
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
                                          {subject.name}
                                        </div>
                                        <div className='text-xs text-gray-500 mt-1 font-medium'>
                                          {subject.code}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <div className='inline-flex items-center justify-center w-10 h-10 bg-[#E8ECEF] text-[#1D3D6F] rounded-full text-sm font-bold'>
                                      {subject.credit_hours}
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#2C4F85]/10 text-[#2C4F85]'>
                                      {result.midterm_marks}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#1D3D6F]/10 text-[#1D3D6F]'>
                                      {result.final_marks}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#F7B500]/10 text-[#F7B500]'>
                                      {result.assignment_marks}
                                    </span>
                                  </td>
                                  <td className='px-6 py-5 text-center'>
                                    <div className='flex items-center justify-center'>
                                      <span className='inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#E8ECEF] to-[#E8ECEF]/80 text-[#1D3D6F] border border-[#E8ECEF]'>
                                        <Award className='h-4 w-4 mr-2 text-[#F7B500]' />
                                        {result.total_marks}
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
