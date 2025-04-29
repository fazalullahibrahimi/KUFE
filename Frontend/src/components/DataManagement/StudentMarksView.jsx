import React from "react";
import { useState, useEffect } from "react";
import { User, Calendar } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {t("marks.student_results")}
        </h2>
      </div>

      {/* Student View */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='mb-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-4'>
            {t("marks.check_results")}
          </h3>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-grow'>
              <input
                type='text'
                placeholder={t("marks.enter_student_id")}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]'
                value={studentSearchId}
                onChange={handleStudentIdSearch}
              />
              <User
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={18}
              />
            </div>
            <button
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={() => {
                // This is just for UI demonstration, in a real app this would validate the ID
                if (!studentSearchId) {
                  alert(t("marks.please_enter_id"));
                }
              }}
            >
              {t("marks.view_results")}
            </button>
          </div>
        </div>

        {studentFound ? (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <div className='flex flex-col md:flex-row justify-between'>
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-1'>
                    {studentFound.name}
                  </h3>
                  <p className='text-gray-600'>
                    {t("marks.student_id")}: {studentFound.id}
                  </p>
                  <p className='text-gray-600'>
                    {t("marks.department")}: {studentFound.department_name}
                  </p>
                  <p className='text-gray-600'>
                    {t("marks.enrollment_year")}: {studentFound.enrollment_year}
                  </p>
                </div>
                <div className='mt-4 md:mt-0'>
                  <div className='bg-white p-4 rounded-md shadow-sm'>
                    <div className='text-center'>
                      <p className='text-sm text-gray-500 mb-1'>
                        {t("marks.cumulative_gpa")}
                      </p>
                      <p className='text-3xl font-bold text-[#004B87]'>
                        {calculateCGPA(studentFound.id)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                {t("marks.academic_results")}
              </h3>

              {/* Semester Tabs */}
              <div className='mb-6 border-b border-gray-200'>
                <div className='flex overflow-x-auto'>
                  {semesters.map((semester) => {
                    const semesterResults = studentResults.filter(
                      (result) => result.semester_id === semester.id
                    );
                    const hasResults = semesterResults.length > 0;
                    return (
                      <button
                        key={semester.id}
                        className={`px-4 py-2 text-sm font-medium ${
                          selectedSemester === semester.id
                            ? "border-b-2 border-[#004B87] text-[#004B87]"
                            : "text-gray-500 hover:text-gray-700"
                        } ${!hasResults ? "opacity-50" : ""}`}
                        onClick={() => setSelectedSemester(semester.id)}
                        disabled={!hasResults}
                      >
                        {semester.name}
                        {hasResults && (
                          <span
                            className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                              Number.parseFloat(
                                calculateSemesterGPA(
                                  studentFound.id,
                                  semester.id
                                )
                              ) >= 3.0
                                ? "bg-green-100 text-green-800"
                                : Number.parseFloat(
                                    calculateSemesterGPA(
                                      studentFound.id,
                                      semester.id
                                    )
                                  ) >= 2.0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {calculateSemesterGPA(studentFound.id, semester.id)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Semester Results */}
              <div>
                {studentResults.filter(
                  (result) => result.semester_id === selectedSemester
                ).length === 0 ? (
                  <div className='p-8 text-center bg-gray-50 rounded-lg'>
                    <Calendar
                      size={48}
                      className='mx-auto text-gray-300 mb-4'
                    />
                    <h3 className='text-lg font-medium text-gray-800 mb-2'>
                      {t("marks.no_results_available")}
                    </h3>
                    <p className='text-gray-600'>
                      {t("marks.no_results_for_semester", {
                        semester: getSemesterById(selectedSemester).name,
                      })}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='flex justify-between items-center mb-4'>
                      <h4 className='text-md font-medium text-gray-700'>
                        {getSemesterById(selectedSemester).name}{" "}
                        {t("marks.results")}
                      </h4>
                      <div className='flex items-center'>
                        <span className='text-sm text-gray-500 mr-2'>
                          {t("marks.semester_gpa")}:
                        </span>
                        <span
                          className={`px-2 py-1 text-sm font-medium rounded-md ${
                            Number.parseFloat(
                              calculateSemesterGPA(
                                studentFound.id,
                                selectedSemester
                              )
                            ) >= 3.0
                              ? "bg-green-100 text-green-800"
                              : Number.parseFloat(
                                  calculateSemesterGPA(
                                    studentFound.id,
                                    selectedSemester
                                  )
                                ) >= 2.0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {calculateSemesterGPA(
                            studentFound.id,
                            selectedSemester
                          )}
                        </span>
                      </div>
                    </div>

                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.subject")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.credit_hours")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.midterm")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.final")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.assignment")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.total")}
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              {t("marks.grade")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {studentResults
                            .filter(
                              (result) =>
                                result.semester_id === selectedSemester
                            )
                            .map((result) => {
                              const subject = getSubjectById(result.subject_id);
                              return (
                                <tr
                                  key={result.id}
                                  className='hover:bg-gray-50'
                                >
                                  <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm font-medium text-gray-900'>
                                      {subject.name}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                      {subject.code}
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {subject.credit_hours}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {result.midterm_marks}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {result.final_marks}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {result.assignment_marks}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                    {result.total_marks}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap'>
                                    <span
                                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(
                                        result.grade
                                      )} bg-opacity-10`}
                                    >
                                      {result.grade}
                                    </span>
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
          <div className='p-8 text-center bg-gray-50 rounded-lg'>
            <User size={48} className='mx-auto text-gray-300 mb-4' />
            <h3 className='text-lg font-medium text-gray-800 mb-2'>
              {t("marks.enter_student_id")}
            </h3>
            <p className='text-gray-600'>{t("marks.enter_id_to_view")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarksView;
