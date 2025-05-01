import React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Save,
  Upload,
  Download,
  FileText,
  Search,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../context/LanguageContext";

const TeacherMarksManagement = () => {
  const { t, isRTL } = useLanguage();

  // Sample data for semesters
  const [semesters, setSemesters] = useState([
    { id: 1, name: "Semester 1" },
    { id: 2, name: "Semester 2" },
    { id: 3, name: "Semester 3" },
    { id: 4, name: "Semester 4" },
    { id: 5, name: "Semester 5" },
    { id: 6, name: "Semester 6" },
    { id: 7, name: "Semester 7" },
    { id: 8, name: "Semester 8" },
  ]);

  // Dynamic subjects state
  const [subjects, setSubjects] = useState([
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
  ]);

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
  ]);

  // State for UI
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [academicYear, setAcademicYear] = useState("2023-2024");
  const [csvData, setCsvData] = useState("");
  const fileInputRef = useRef(null);
  const [editingSubject, setEditingSubject] = useState(null);

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

  // Form data for adding/editing subjects
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    semester_id: selectedSemester,
    credit_hours: 3,
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
    subjects,
  ]);

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

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({
      ...subjectFormData,
      [name]: name === "credit_hours" ? Number(value) : value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(Number(e.target.value));
    setSelectedSubject(null); // Reset subject when semester changes
    setMarksFormData({
      ...marksFormData,
      semester_id: Number(e.target.value),
      subject_id: "",
    });
    setSubjectFormData({
      ...subjectFormData,
      semester_id: Number(e.target.value),
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

  // CRUD operations for marks
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

  // CRUD operations for subjects
  const handleAddSubject = () => {
    const newSubject = {
      id: subjects.length + 1,
      ...subjectFormData,
    };

    setSubjects([...subjects, newSubject]);
    setIsAddSubjectModalOpen(false);
    resetSubjectForm();
  };

  const handleEditSubject = () => {
    const updatedSubjects = subjects.map((subject) =>
      subject.id === editingSubject.id
        ? { ...subject, ...subjectFormData }
        : subject
    );

    setSubjects(updatedSubjects);
    setIsEditSubjectModalOpen(false);
    resetSubjectForm();
  };

  const handleDeleteSubject = (subjectId) => {
    // Check if subject is used in any marks
    const isUsed = studentMarks.some((mark) => mark.subject_id === subjectId);

    if (isUsed) {
      alert(t("subjects.cannot_delete_used"));
      return;
    }

    const updatedSubjects = subjects.filter(
      (subject) => subject.id !== subjectId
    );
    setSubjects(updatedSubjects);
  };

  const resetSubjectForm = () => {
    setSubjectFormData({
      name: "",
      code: "",
      semester_id: selectedSemester,
      credit_hours: 3,
    });
    setEditingSubject(null);
  };

  const openEditSubjectModal = (subject) => {
    setEditingSubject(subject);
    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      semester_id: subject.semester_id,
      credit_hours: subject.credit_hours,
    });
    setIsEditSubjectModalOpen(true);
  };

  // Import marks from CSV
  const handleImportCSV = () => {
    if (!csvData.trim()) {
      alert(t("marks.please_enter_csv"));
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
        alert(`${t("marks.missing_headers")}: ${missingHeaders.join(", ")}`);
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
          console.warn(
            `${t("marks.skipping_row")} ${i}: ${t("marks.invalid_ids")}`
          );
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
        alert(t("marks.no_valid_data"));
        return;
      }

      // Add new marks to the existing ones
      setStudentMarks([...studentMarks, ...newMarks]);
      setIsImportModalOpen(false);
      setCsvData("");
      alert(
        `${t("marks.successfully_imported")} ${newMarks.length} ${t(
          "marks.entries"
        )}`
      );
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert(t("marks.error_parsing"));
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

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {t("marks.teacher_management")}
        </h2>
      </div>

      {/* Teacher View */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex flex-col md:flex-row gap-4 justify-between items-start mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t("marks.semester")}
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
                {t("marks.subject")}
              </label>
              <select
                className='w-full p-2 border border-gray-300 rounded-md'
                value={selectedSubject || ""}
                onChange={handleSubjectChange}
              >
                <option value=''>{t("marks.all_subjects")}</option>
                {subjects
                  .filter((subject) => subject.semester_id === selectedSemester)
                  .map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t("marks.academic_year")}
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
                placeholder={t("marks.search_placeholder")}
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
              {t("marks.import")}
            </button>
            <button
              className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={() => {
                resetMarksForm();
                setIsAddMarksModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              {t("marks.add_marks")}
            </button>
          </div>
        </div>

        {/* Subject Management Section */}
        <div className='mb-6 border-t border-gray-200 pt-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-medium text-gray-800'>
              {t("subjects.manage_subjects")}
            </h3>
            <button
              className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={() => {
                resetSubjectForm();
                setIsAddSubjectModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              {t("subjects.add_subject")}
            </button>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {t("subjects.code")}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {t("subjects.name")}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {t("subjects.semester")}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {t("subjects.credit_hours")}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {t("subjects.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {subjects
                  .filter((subject) => subject.semester_id === selectedSemester)
                  .map((subject) => (
                    <tr key={subject.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {subject.code}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {subject.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {getSemesterById(subject.semester_id).name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {subject.credit_hours}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex space-x-2'>
                          <button
                            className='text-blue-600 hover:text-blue-800'
                            onClick={() => openEditSubjectModal(subject)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className='text-red-600 hover:text-red-800'
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Marks Table */}
        <div className='border-t border-gray-200 pt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-4'>
            {t("marks.student_marks")}
          </h3>
          <div className='overflow-x-auto'>
            {filteredMarks.length === 0 ? (
              <div className='p-8 text-center'>
                <FileText size={48} className='mx-auto text-gray-300 mb-4' />
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  {t("marks.no_marks_found")}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {searchTerm
                    ? t("marks.no_marks_match")
                    : t("marks.no_marks_added")}
                </p>
                <button
                  className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                  onClick={() => {
                    resetMarksForm();
                    setIsAddMarksModalOpen(true);
                  }}
                >
                  {t("marks.add_marks")}
                </button>
              </div>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t("marks.student")}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t("marks.subject")}
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
      </div>

      {/* Import Marks Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t("marks.import_marks")}
        size='lg'
      >
        <div className='space-y-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex items-start'>
              <AlertCircle size={20} className='text-blue-500 mr-2 mt-0.5' />
              <div>
                <h4 className='text-sm font-medium text-blue-800'>
                  {t("marks.csv_import_instructions")}
                </h4>
                <p className='text-sm text-blue-600'>
                  {t("marks.csv_upload_columns")}
                </p>
              </div>
            </div>
          </div>

          <div className='border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='flex flex-col items-center justify-center'>
              <Upload size={48} className='text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                {t("marks.upload_csv_file")}
              </h3>
              <p className='text-gray-500 text-sm mb-4 text-center'>
                {t("marks.drag_drop_csv")}
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
                {t("marks.select_file")}
              </button>
              <div className='mt-4 flex items-center'>
                <button
                  className='text-[#004B87] hover:underline text-sm flex items-center'
                  onClick={downloadCSVTemplate}
                >
                  <Download size={16} className='mr-1' />
                  {t("marks.download_template")}
                </button>
              </div>
            </div>
          </div>

          {csvData && (
            <div>
              <h4 className='text-md font-medium text-gray-700 mb-2'>
                {t("marks.csv_preview")}
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
              {t("marks.cancel")}
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={handleImportCSV}
              disabled={!csvData}
            >
              <Save size={18} className='inline mr-2' />
              {t("marks.import_marks")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Marks Modal */}
      <Modal
        isOpen={isAddMarksModalOpen}
        onClose={() => setIsAddMarksModalOpen(false)}
        title={t("marks.add_student_marks")}
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
                label={t("marks.student")}
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
                label={t("marks.subject")}
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
                label={t("marks.midterm_marks_max_20")}
                name='midterm_marks'
                type='number'
                value={marksFormData.midterm_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='20'
                required
              />
              <FormField
                label={t("marks.final_exam_marks_max_70")}
                name='final_marks'
                type='number'
                value={marksFormData.final_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='70'
                required
              />
              <FormField
                label={t("marks.assignment_marks_max_10")}
                name='assignment_marks'
                type='number'
                value={marksFormData.assignment_marks}
                onChange={handleMarksInputChange}
                min='0'
                max='10'
                required
              />
              <FormField
                label={t("marks.academic_year")}
                name='academic_year'
                value={marksFormData.academic_year}
                onChange={handleMarksInputChange}
                disabled
              />
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                {t("marks.grade_preview")}
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
                  <p className='text-sm text-gray-500'>
                    {t("marks.total_marks")}
                  </p>
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
                {t("marks.cancel")}
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              >
                <Save size={18} className='inline mr-2' />
                {t("marks.save_marks")}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title={t("subjects.add_subject")}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSubject();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label={t("subjects.name")}
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.code")}
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.semester")}
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester.id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label={t("subjects.credit_hours")}
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                onClick={() => setIsAddSubjectModalOpen(false)}
              >
                {t("subjects.cancel")}
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              >
                <Save size={18} className='inline mr-2' />
                {t("subjects.save_subject")}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal
        isOpen={isEditSubjectModalOpen}
        onClose={() => setIsEditSubjectModalOpen(false)}
        title={t("subjects.edit_subject")}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubject();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label={t("subjects.name")}
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.code")}
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.semester")}
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester.id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label={t("subjects.credit_hours")}
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                onClick={() => setIsEditSubjectModalOpen(false)}
              >
                {t("subjects.cancel")}
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              >
                <Save size={18} className='inline mr-2' />
                {t("subjects.update_subject")}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherMarksManagement;
