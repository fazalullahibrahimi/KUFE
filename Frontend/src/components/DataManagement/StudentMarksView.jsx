import React from "react";
import { useState, useEffect } from "react";
import { User, Calendar } from "lucide-react";
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
            <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md'>
              <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='flex items-center'>
                  <div className='w-16 h-16 bg-[#004B87] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6'>
                    {studentFound.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                      {studentFound.name}
                    </h3>
                    <div className='flex flex-wrap gap-4'>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-blue-700 text-xs font-bold'>
                            ID
                          </span>
                        </div>
                        <p className='text-gray-700 font-medium'>
                          {studentFound.id}
                        </p>
                      </div>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-purple-700 text-xs font-bold'>
                            DEP
                          </span>
                        </div>
                        <p className='text-gray-700 font-medium'>
                          {studentFound.department_name}
                        </p>
                      </div>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-green-700 text-xs font-bold'>
                            YR
                          </span>
                        </div>
                        <p className='text-gray-700 font-medium'>
                          {studentFound.enrollment_year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-6 md:mt-0'>
                  <div className='bg-white p-6 rounded-lg shadow-md border-t-4 border-[#004B87]'>
                    <div className='text-center'>
                      <p className='text-sm text-gray-500 mb-2 uppercase tracking-wider font-medium'>
                        {t("marks.cumulative_gpa")}
                      </p>
                      <p className='text-4xl font-bold bg-gradient-to-r from-[#004B87] to-[#0063B1] bg-clip-text text-transparent'>
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
              <div className='mb-8'>
                <h4 className='text-md font-medium text-gray-700 mb-4 flex items-center'>
                  <Calendar className='mr-2 text-[#004B87]' size={18} />
                  {t("marks.select_semester")}
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  {semesters.map((semester) => {
                    const semesterResults = studentResults.filter(
                      (result) => result.semester_id === semester.id
                    );
                    const hasResults = semesterResults.length > 0;

                    const semesterGPA = hasResults
                      ? calculateSemesterGPA(studentFound.id, semester.id)
                      : null;

                    let gpaBgColor = "bg-yellow-100";
                    let gpaTextColor = "text-yellow-800";

                    if (semesterGPA) {
                      if (Number.parseFloat(semesterGPA) >= 3.0) {
                        gpaBgColor = "bg-green-100";
                        gpaTextColor = "text-green-800";
                      } else if (Number.parseFloat(semesterGPA) >= 2.0) {
                        gpaBgColor = "bg-blue-100";
                        gpaTextColor = "text-blue-800";
                      }
                    }

                    return (
                      <button
                        key={semester.id}
                        className={`relative rounded-lg transition-all duration-200 ${
                          !hasResults
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:shadow-md"
                        } ${
                          selectedSemester === semester.id
                            ? "ring-2 ring-[#004B87] ring-offset-2"
                            : ""
                        }`}
                        onClick={() =>
                          hasResults && setSelectedSemester(semester.id)
                        }
                        disabled={!hasResults}
                      >
                        <div
                          className={`p-3 h-full ${
                            selectedSemester === semester.id
                              ? "bg-gradient-to-r from-[#004B87] to-[#0063B1] text-white"
                              : hasResults
                              ? "bg-white border border-gray-200"
                              : "bg-gray-50 border border-gray-200 text-gray-500"
                          }`}
                        >
                          <div className='text-center'>
                            <div className='font-medium mb-1'>
                              {semester.name}
                            </div>

                            {hasResults && (
                              <div
                                className={`text-xs font-semibold ${
                                  selectedSemester === semester.id
                                    ? "bg-white bg-opacity-20 text-white"
                                    : `${gpaBgColor} ${gpaTextColor}`
                                } px-2 py-1 rounded-full inline-block`}
                              >
                                GPA: {semesterGPA}
                              </div>
                            )}

                            {!hasResults && (
                              <div className='text-xs text-gray-500'>
                                {t("marks.no_results")}
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedSemester === semester.id && (
                          <div className='absolute bottom-0 left-0 w-full h-1 bg-[#004B87]'></div>
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

                    <div className='overflow-x-auto rounded-lg shadow'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gradient-to-r from-[#004B87] to-[#0063B1]'>
                          <tr>
                            <th className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.subject")}
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.credit_hours")}
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.midterm")}
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.final")}
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.assignment")}
                            </th>
                            <th className='px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider'>
                              {t("marks.total")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
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
                                  className={`hover:bg-blue-50 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }`}
                                >
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm font-medium text-gray-900'>
                                      {subject.name}
                                    </div>
                                    <div className='text-xs text-gray-500 mt-1'>
                                      {subject.code}
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm font-medium text-center bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto'>
                                      {subject.credit_hours}
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm text-center font-medium'>
                                      <span className='bg-blue-50 text-blue-800 px-3 py-1 rounded-lg'>
                                        {result.midterm_marks}
                                      </span>
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm text-center font-medium'>
                                      <span className='bg-purple-50 text-purple-800 px-3 py-1 rounded-lg'>
                                        {result.final_marks}
                                      </span>
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm text-center font-medium'>
                                      <span className='bg-green-50 text-green-800 px-3 py-1 rounded-lg'>
                                        {result.assignment_marks}
                                      </span>
                                    </div>
                                  </td>
                                  <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='text-sm font-bold text-center'>
                                      <span className='bg-gray-100 text-gray-800 px-4 py-2 rounded-lg'>
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
