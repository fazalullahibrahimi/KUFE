import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Save,
  Upload,
  Download,
  FileText,
  Search,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";

const StudentMarksManagement = () => {
  // Sample data for semesters, subjects, and students
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
    {
      id: 9,
      name: "Econometrics",
      code: "ECO301",
      semester_id: 3,
      credit_hours: 4,
    },
    {
      id: 10,
      name: "International Economics",
      code: "ECO302",
      semester_id: 3,
      credit_hours: 3,
    },
    {
      id: 11,
      name: "Money and Banking",
      code: "FIN301",
      semester_id: 3,
      credit_hours: 3,
    },
    {
      id: 12,
      name: "Public Finance",
      code: "ECO303",
      semester_id: 3,
      credit_hours: 3,
    },
    {
      id: 13,
      name: "Development Economics",
      code: "ECO401",
      semester_id: 4,
      credit_hours: 3,
    },
    {
      id: 14,
      name: "Economic Research Methods",
      code: "ECO402",
      semester_id: 4,
      credit_hours: 4,
    },
    {
      id: 15,
      name: "Labor Economics",
      code: "ECO403",
      semester_id: 4,
      credit_hours: 3,
    },
    {
      id: 16,
      name: "Environmental Economics",
      code: "ECO404",
      semester_id: 4,
      credit_hours: 3,
    },
    {
      id: 17,
      name: "Advanced Microeconomics",
      code: "ECO501",
      semester_id: 5,
      credit_hours: 4,
    },
    {
      id: 18,
      name: "Advanced Macroeconomics",
      code: "ECO502",
      semester_id: 5,
      credit_hours: 4,
    },
    {
      id: 19,
      name: "Islamic Economics",
      code: "ECO503",
      semester_id: 5,
      credit_hours: 3,
    },
    {
      id: 20,
      name: "Financial Markets",
      code: "FIN501",
      semester_id: 5,
      credit_hours: 3,
    },
    {
      id: 21,
      name: "Economic Policy Analysis",
      code: "ECO601",
      semester_id: 6,
      credit_hours: 3,
    },
    {
      id: 22,
      name: "International Finance",
      code: "FIN601",
      semester_id: 6,
      credit_hours: 3,
    },
    {
      id: 23,
      name: "Game Theory",
      code: "ECO602",
      semester_id: 6,
      credit_hours: 3,
    },
    {
      id: 24,
      name: "Agricultural Economics",
      code: "ECO603",
      semester_id: 6,
      credit_hours: 3,
    },
    {
      id: 25,
      name: "Thesis Preparation",
      code: "ECO701",
      semester_id: 7,
      credit_hours: 4,
    },
    {
      id: 26,
      name: "Economic Development of Afghanistan",
      code: "ECO702",
      semester_id: 7,
      credit_hours: 3,
    },
    {
      id: 27,
      name: "Behavioral Economics",
      code: "ECO703",
      semester_id: 7,
      credit_hours: 3,
    },
    {
      id: 28,
      name: "Regional Economic Integration",
      code: "ECO704",
      semester_id: 7,
      credit_hours: 3,
    },
    { id: 29, name: "Thesis", code: "ECO801", semester_id: 8, credit_hours: 6 },
    {
      id: 30,
      name: "Economics Seminar",
      code: "ECO802",
      semester_id: 8,
      credit_hours: 2,
    },
    {
      id: 31,
      name: "Professional Development",
      code: "ECO803",
      semester_id: 8,
      credit_hours: 2,
    },
    {
      id: 32,
      name: "Economic Forecasting",
      code: "ECO804",
      semester_id: 8,
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
  const [studentMarks, setStudentMarks] = useState([
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
      id: 5,
      student_id: "CS20231",
      subject_id: 1,
      semester_id: 1,
      midterm_marks: 16,
      final_marks: 60,
      assignment_marks: 8,
      total_marks: 84,
      grade: "B+",
      academic_year: "2023-2024",
    },
    {
      id: 6,
      student_id: "CS20231",
      subject_id: 2,
      semester_id: 1,
      midterm_marks: 14,
      final_marks: 55,
      assignment_marks: 7,
      total_marks: 76,
      grade: "B",
      academic_year: "2023-2024",
    },
    {
      id: 7,
      student_id: "CS20231",
      subject_id: 3,
      semester_id: 1,
      midterm_marks: 18,
      final_marks: 64,
      assignment_marks: 9,
      total_marks: 91,
      grade: "A",
      academic_year: "2023-2024",
    },
    {
      id: 8,
      student_id: "CS20231",
      subject_id: 4,
      semester_id: 1,
      midterm_marks: 15,
      final_marks: 58,
      assignment_marks: 8,
      total_marks: 81,
      grade: "B+",
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
  ]);

  // State for UI
  const [activeTab, setActiveTab] = useState("teacher"); // teacher or student
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [studentSearchId, setStudentSearchId] = useState("");
  const [studentFound, setStudentFound] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [academicYear, setAcademicYear] = useState("2023-2024");
  const [csvData, setCsvData] = useState("");
  const fileInputRef = useRef(null);

  // Form data for adding marks
  const [marksFormData, setMarksFormData] = useState({
    student_id: "",
    subject_id: "",
    semester_id: selectedSemester,
    midterm_marks: "",
    final_marks: "",
    assignment_marks: "",
    academic_year: academicYear,
  });

  // Filter marks based on selected semester, subject, and search term
  useEffect(() => {
    let result = [...studentMarks];

    // Filter by semester
    if (selectedSemester) {
      result = result.filter((mark) => mark.semester_id === selectedSemester);
    }

    // Filter by subject
    if (selectedSubject) {
      result = result.filter((mark) => mark.subject_id === selectedSubject);
    }

    // Filter by student
    if (selectedStudent) {
      result = result.filter((mark) => mark.student_id === selectedStudent);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((mark) => {
        const student = students.find((s) => s.id === mark.student_id);
        const subject = subjects.find((s) => s.id === mark.subject_id);
        return (
          student?.name.toLowerCase().includes(term) ||
          student?.id.toLowerCase().includes(term) ||
          subject?.name.toLowerCase().includes(term) ||
          subject?.code.toLowerCase().includes(term)
        );
      });
    }

    setFilteredMarks(result);
  }, [
    studentMarks,
    selectedSemester,
    selectedSubject,
    selectedStudent,
    searchTerm,
  ]);

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
  }, [studentSearchId, studentMarks]);

  // Form handling functions
  const handleMarksInputChange = (e) => {
    const { name, value } = e.target;
    setMarksFormData({
      ...marksFormData,
      [name]:
        name === "midterm_marks" ||
        name === "final_marks" ||
        name === "assignment_marks"
          ? Number(value)
          : value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStudentIdSearch = (e) => {
    setStudentSearchId(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(Number(e.target.value));
    setSelectedSubject(null); // Reset subject when semester changes
    setMarksFormData({
      ...marksFormData,
      semester_id: Number(e.target.value),
      subject_id: "",
    });
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(Number(e.target.value));
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
    setMarksFormData({
      ...marksFormData,
      academic_year: e.target.value,
    });
  };

  // Calculate total marks and grade
  const calculateTotalAndGrade = (midterm, final, assignment) => {
    const midtermValue = Number(midterm) || 0;
    const finalValue = Number(final) || 0;
    const assignmentValue = Number(assignment) || 0;

    const total = midtermValue + finalValue + assignmentValue;

    let grade = "F";
    if (total >= 95) grade = "A+";
    else if (total >= 90) grade = "A";
    else if (total >= 85) grade = "A-";
    else if (total >= 80) grade = "B+";
    else if (total >= 75) grade = "B";
    else if (total >= 70) grade = "B-";
    else if (total >= 65) grade = "C+";
    else if (total >= 60) grade = "C";
    else if (total >= 55) grade = "C-";
    else if (total >= 50) grade = "D";

    return { total, grade };
  };

  // CRUD operations
  const handleAddMarks = () => {
    const { total, grade } = calculateTotalAndGrade(
      marksFormData.midterm_marks,
      marksFormData.final_marks,
      marksFormData.assignment_marks
    );

    const newMark = {
      id: studentMarks.length + 1,
      ...marksFormData,
      total_marks: total,
      grade: grade,
    };

    setStudentMarks([...studentMarks, newMark]);
    setIsAddMarksModalOpen(false);
    resetMarksForm();
  };

  const resetMarksForm = () => {
    setMarksFormData({
      student_id: "",
      subject_id: "",
      semester_id: selectedSemester,
      midterm_marks: "",
      final_marks: "",
      assignment_marks: "",
      academic_year: academicYear,
    });
  };

  // Import marks from CSV
  const handleImportCSV = () => {
    if (!csvData.trim()) {
      alert("Please enter CSV data");
      return;
    }

    try {
      // Parse CSV data
      const rows = csvData.trim().split("\n");
      const headers = rows[0].split(",");

      // Validate headers
      const requiredHeaders = [
        "student_id",
        "subject_id",
        "midterm_marks",
        "final_marks",
        "assignment_marks",
      ];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );

      if (missingHeaders.length > 0) {
        alert(`Missing required headers: ${missingHeaders.join(", ")}`);
        return;
      }

      // Process data rows
      const newMarks = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        if (values.length !== headers.length) continue;

        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index].trim();
        });

        // Validate student and subject
        const studentExists = students.some((s) => s.id === rowData.student_id);
        const subject = subjects.find(
          (s) => s.id === Number(rowData.subject_id)
        );

        if (!studentExists || !subject) {
          console.warn(`Skipping row ${i}: Invalid student ID or subject ID`);
          continue;
        }

        // Calculate total and grade
        const { total, grade } = calculateTotalAndGrade(
          rowData.midterm_marks,
          rowData.final_marks,
          rowData.assignment_marks
        );

        newMarks.push({
          id: studentMarks.length + newMarks.length + 1,
          student_id: rowData.student_id,
          subject_id: Number(rowData.subject_id),
          semester_id: subject.semester_id,
          midterm_marks: Number(rowData.midterm_marks),
          final_marks: Number(rowData.final_marks),
          assignment_marks: Number(rowData.assignment_marks),
          total_marks: total,
          grade: grade,
          academic_year: academicYear,
        });
      }

      if (newMarks.length === 0) {
        alert("No valid marks data found in the CSV");
        return;
      }

      // Add new marks to the existing ones
      setStudentMarks([...studentMarks, ...newMarks]);
      setIsImportModalOpen(false);
      setCsvData("");
      alert(`Successfully imported ${newMarks.length} marks entries`);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Error parsing CSV data. Please check the format and try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target.result);
    };
    reader.readAsText(file);
  };

  // Generate CSV template
  const generateCSVTemplate = () => {
    const headers =
      "student_id,subject_id,midterm_marks,final_marks,assignment_marks";
    const sampleRow1 = `CS20230,1,18,65,9`;
    const sampleRow2 = `CS20231,2,15,58,8`;
    return `${headers}\n${sampleRow1}\n${sampleRow2}`;
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marks_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const getStudentById = (id) => {
    return (
      students.find((student) => student.id === id) || {
        name: "Unknown Student",
        id: "N/A",
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
          Student Marks Management
        </h2>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "teacher"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("teacher")}
          >
            Teacher View
          </button>
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
        </div>
      </div>

      {activeTab === "teacher" ? (
        <>
          {/* Teacher View */}
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex flex-col md:flex-row gap-4 justify-between items-start mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Semester
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                  >
                    {semesters.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Subject
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedSubject || ""}
                    onChange={handleSubjectChange}
                  >
                    <option value=''>All Subjects</option>
                    {subjects
                      .filter(
                        (subject) => subject.semester_id === selectedSemester
                      )
                      .map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Academic Year
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={academicYear}
                    onChange={handleAcademicYearChange}
                  >
                    <option value='2023-2024'>2023-2024</option>
                    <option value='2022-2023'>2022-2023</option>
                    <option value='2021-2022'>2021-2022</option>
                  </select>
                </div>
              </div>

              <div className='flex gap-2 w-full md:w-auto'>
                <div className='relative flex-grow'>
                  <input
                    type='text'
                    placeholder='Search by student name or ID...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]'
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={18}
                  />
                </div>

                <button
                  className='flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload size={18} className='mr-2' />
                  Import
                </button>
                <button
                  className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                  onClick={() => {
                    resetMarksForm();
                    setIsAddMarksModalOpen(true);
                  }}
                >
                  <Plus size={18} className='mr-2' />
                  Add Marks
                </button>
              </div>
            </div>

            {/* Marks Table */}
            <div className='overflow-x-auto'>
              {filteredMarks.length === 0 ? (
                <div className='p-8 text-center'>
                  <FileText size={48} className='mx-auto text-gray-300 mb-4' />
                  <h3 className='text-lg font-medium text-gray-800 mb-2'>
                    No marks found
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    {searchTerm
                      ? "No marks match your search criteria."
                      : "No marks have been added for this semester and subject yet."}
                  </p>
                  <button
                    className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                    onClick={() => {
                      resetMarksForm();
                      setIsAddMarksModalOpen(true);
                    }}
                  >
                    Add Marks
                  </button>
                </div>
              ) : (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Student
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Subject
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Midterm
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Final
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Assignment
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Total
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredMarks.map((mark) => {
                      const student = getStudentById(mark.student_id);
                      const subject = getSubjectById(mark.subject_id);
                      return (
                        <tr key={mark.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                <span className='text-gray-600 font-medium'>
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {student.name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  {student.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm text-gray-900'>
                              {subject.name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {subject.code}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {mark.midterm_marks}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {mark.final_marks}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {mark.assignment_marks}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {mark.total_marks}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(
                                mark.grade
                              )} bg-opacity-10`}
                            >
                              {mark.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Student View */}
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='mb-6'>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                Check Your Results
              </h3>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='relative flex-grow'>
                  <input
                    type='text'
                    placeholder='Enter your Student ID...'
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
                      alert("Please enter your Student ID");
                    }
                  }}
                >
                  View Results
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
                        Student ID: {studentFound.id}
                      </p>
                      <p className='text-gray-600'>
                        Department: {studentFound.department_name}
                      </p>
                      <p className='text-gray-600'>
                        Enrollment Year: {studentFound.enrollment_year}
                      </p>
                    </div>
                    <div className='mt-4 md:mt-0'>
                      <div className='bg-white p-4 rounded-md shadow-sm'>
                        <div className='text-center'>
                          <p className='text-sm text-gray-500 mb-1'>
                            Cumulative GPA
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
                    Academic Results
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
                                {calculateSemesterGPA(
                                  studentFound.id,
                                  semester.id
                                )}
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
                          No results available
                        </h3>
                        <p className='text-gray-600'>
                          There are no results available for{" "}
                          {getSemesterById(selectedSemester).name}.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='text-md font-medium text-gray-700'>
                            {getSemesterById(selectedSemester).name} Results
                          </h4>
                          <div className='flex items-center'>
                            <span className='text-sm text-gray-500 mr-2'>
                              Semester GPA:
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
                                  Subject
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Credit Hours
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Midterm
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Final
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Assignment
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Total
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Grade
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
                                  const subject = getSubjectById(
                                    result.subject_id
                                  );
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
                  Enter your Student ID
                </h3>
                <p className='text-gray-600'>
                  Enter your Student ID above to view your academic results and
                  performance.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Import Marks Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title='Import Marks'
        size='lg'
      >
        <div className='space-y-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex items-start'>
              <AlertCircle size={20} className='text-blue-500 mr-2 mt-0.5' />
              <div>
                <h4 className='text-sm font-medium text-blue-800'>
                  CSV Import Instructions
                </h4>
                <p className='text-sm text-blue-600'>
                  Upload a CSV file with the following columns: student_id,
                  subject_id, midterm_marks, final_marks, assignment_marks. The
                  first row should contain these column headers.
                </p>
              </div>
            </div>
          </div>

          <div className='border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='flex flex-col items-center justify-center'>
              <Upload size={48} className='text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                Upload CSV File
              </h3>
              <p className='text-gray-500 text-sm mb-4 text-center'>
                Drag and drop your CSV file here, or click to browse
              </p>
              <input
                type='file'
                id='csv_upload'
                className='hidden'
                accept='.csv'
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                onClick={() => fileInputRef.current.click()}
              >
                Select File
              </button>
              <div className='mt-4 flex items-center'>
                <button
                  className='text-[#004B87] hover:underline text-sm flex items-center'
                  onClick={downloadCSVTemplate}
                >
                  <Download size={16} className='mr-1' />
                  Download Template
                </button>
              </div>
            </div>
          </div>

          {csvData && (
            <div>
              <h4 className='text-md font-medium text-gray-700 mb-2'>
                CSV Preview
              </h4>
              <div className='bg-gray-50 p-4 rounded-lg overflow-auto max-h-40'>
                <pre className='text-xs text-gray-600'>{csvData}</pre>
              </div>
            </div>
          )}

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={handleImportCSV}
              disabled={!csvData}
            >
              <Save size={18} className='inline mr-2' />
              Import Marks
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Marks Modal */}
      <Modal
        isOpen={isAddMarksModalOpen}
        onClose={() => setIsAddMarksModalOpen(false)}
        title='Add Student Marks'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMarks();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Student'
                name='student_id'
                type='select'
                value={marksFormData.student_id}
                onChange={handleMarksInputChange}
                options={students.map((student) => ({
                  value: student.id,
                  label: `${student.name} (${student.id})`,
                }))}
                required
              />
              <FormField
                label='Subject'
                name='subject_id'
                type='select'
                value={marksFormData.subject_id}
                onChange={handleMarksInputChange}
                options={subjects
                  .filter((subject) => subject.semester_id === selectedSemester)
                  .map((subject) => ({
                    value: subject.id,
                    label: `${subject.code} - ${subject.name}`,
                  }))}
                required
              />
              <FormField
                label='Midterm Marks (max 20)'
                name='midterm_marks'
                type='number'
                value={marksFormData.midterm_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='20'
                required
              />
              <FormField
                label='Final Exam Marks (max 70)'
                name='final_marks'
                type='number'
                value={marksFormData.final_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='70'
                required
              />
              <FormField
                label='Assignment Marks (max 10)'
                name='assignment_marks'
                type='number'
                value={marksFormData.assignment_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='10'
                required
              />
              <FormField
                label='Academic Year'
                name='academic_year'
                value={marksFormData.academic_year}
                onChange={handleMarksInputChange}
                disabled
              />
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Grade Preview
              </h4>
              <div className='flex items-center'>
                <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4'>
                  {marksFormData.midterm_marks &&
                  marksFormData.final_marks &&
                  marksFormData.assignment_marks ? (
                    <span
                      className={`text-xl font-bold ${getGradeColor(
                        calculateTotalAndGrade(
                          marksFormData.midterm_marks,
                          marksFormData.final_marks,
                          marksFormData.assignment_marks
                        ).grade
                      )}`}
                    >
                      {
                        calculateTotalAndGrade(
                          marksFormData.midterm_marks,
                          marksFormData.final_marks,
                          marksFormData.assignment_marks
                        ).grade
                      }
                    </span>
                  ) : (
                    <span className='text-gray-400'>N/A</span>
                  )}
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Total Marks</p>
                  <p className='text-2xl font-bold text-gray-800'>
                    {marksFormData.midterm_marks &&
                    marksFormData.final_marks &&
                    marksFormData.assignment_marks
                      ? calculateTotalAndGrade(
                          marksFormData.midterm_marks,
                          marksFormData.final_marks,
                          marksFormData.assignment_marks
                        ).total
                      : "0"}
                    <span className='text-sm text-gray-500 ml-1'>/100</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                onClick={() => setIsAddMarksModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              >
                <Save size={18} className='inline mr-2' />
                Save Marks
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentMarksManagement;
