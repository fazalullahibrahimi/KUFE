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
  BookOpen,
  Users,
  GraduationCap,
  BarChart3,
  Filter,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TeacherMarksManagement Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const TeacherMarksManagement = () => {
  const { t } = useLanguage();

  // State for data from API
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [isLoading, setIsLoading] = useState({
    semesters: true,
    subjects: true,
    students: true,
    teachers: true,
    marks: true,
  });

  // State for UI
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false);
  const [isEditMarksModalOpen, setIsEditMarksModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [csvData, setCsvData] = useState("");
  const fileInputRef = useRef(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Notification helper functions
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');

  // Form data for adding marks
  const [marksFormData, setMarksFormData] = useState({
    student_id: "",
    subject_id: "",
    semester_id: "",
    teacher_id: "", // Add teacher_id field
    teacher_name: "", // Add teacher_name field for display
    midterm: "",
    final: "",
    assignment: "",
    remarks: "",
  });



  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create headers with auth token
  const createHeaders = (includeContentType = true) => {
    const token = getAuthToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, teachers: true }));
        const response = await fetch("http://127.0.0.1:4400/api/v1/teachers/", {
          headers: createHeaders(),
        });
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.teachers) {
          setTeachers(data.data.teachers);
        } else {
          setTeachers([]);
        }
      } catch (error) {
        setTeachers([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, teachers: false }));
      }
    };

    fetchTeachers();
  }, []);

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, students: true }));
        const response = await fetch("http://localhost:4400/api/v1/students/", {
          headers: createHeaders(),
        });
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.students) {
          setStudents(data.data.students);
        } else {
          setStudents([]);
        }
      } catch (error) {
        setStudents([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, students: false }));
      }
    };

    fetchStudents();
  }, []);



  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, subjects: true }));
        const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
          headers: createHeaders(),
        });
        const data = await response.json();

        // Handle the actual API response structure: { status, message, data: { subjects: [...] } }
        if (data.status === "success" && data.data && data.data.subjects && Array.isArray(data.data.subjects)) {
          // The API already provides populated semester and teacher data
          const enrichedSubjects = data.data.subjects.map((subject) => {
            return {
              ...subject,
              // Extract semester name from populated semester_id object
              semester_name: subject.semester_id?.name || "Unknown Semester",
              // Extract teacher name from populated teacher_id?.name || "No Teacher Assigned",
              // Ensure we have the actual IDs for filtering
              semester_id_string: typeof subject.semester_id === 'object' ? subject.semester_id._id : subject.semester_id,
              teacher_id_string: typeof subject.teacher_id === 'object' ? subject.teacher_id._id : subject.teacher_id,
            };
          });
          setSubjects(enrichedSubjects);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        setSubjects([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, subjects: false }));
      }
    };

    fetchSubjects();
  }, [teachers, semesters]); // Add semesters as dependency to ensure subjects are enriched after semesters are loaded

  // Fetch semesters from API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, semesters: true }));
        const response = await fetch(
          "http://127.0.0.1:4400/api/v1/semesters/",
          {
            headers: createHeaders(),
          }
        );
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.semesters && Array.isArray(data.data.semesters)) {
          setSemesters(data.data.semesters);
          // Set the first semester as default if available
          if (data.data.semesters.length > 0) {
            // Don't auto-select a semester
            setMarksFormData((prev) => ({
              ...prev,
              semester_id: data.data.semesters[0]._id,
            }));
          }
        } else {
          setSemesters([]);
        }
      } catch (error) {
        setSemesters([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, semesters: false }));
      }
    };

    fetchSemesters();
  }, []);

  // Extract marks from students data and enrich with semester and teacher information
  useEffect(() => {
    // Check if we're still loading basic data
    if (isLoading.students || isLoading.subjects || isLoading.semesters || isLoading.teachers) {
      return;
    }

    // Set marks loading to true when processing starts
    setIsLoading((prev) => ({ ...prev, marks: true }));

    try {
      const allMarks = [];

      if (students.length > 0 && subjects.length > 0) {
        students.forEach((student) => {
          // Add null safety check for student
          if (!student || !student._id || !student.name) {
            return;
          }

        if (student.marks && Array.isArray(student.marks)) {
          student.marks.forEach((mark) => {
            try {
              // Add null safety check for mark
              if (!mark || !mark.subject_id) {
                return;
              }


              // The subject_id in marks is already populated by the backend
              // Check if it's already populated (object) or just an ID (string)
              let subject = null;

              if (typeof mark.subject_id === 'object' && mark.subject_id !== null) {
                // Already populated by backend
                subject = mark.subject_id;
              } else {
                // Not populated, find from subjects array
                subject = subjects.find((sub) => {
                  if (!sub || !sub._id) return false;
                  return sub._id.toString() === mark.subject_id.toString();
                });
              }

              // Get semester information - check if already populated
              let semesterId = mark.semester_id;
              let semesterName = "Unknown Semester";

              if (semesterId && typeof semesterId === "object" && semesterId._id) {
                // Already populated by backend
                semesterName = String(semesterId.name || "Unknown Semester");
                semesterId = semesterId._id;
              } else if (typeof semesterId === "string" && semesterId) {
                // Find semester by ID
                const semester = semesters.find((sem) => sem && sem._id === semesterId);
                if (semester) {
                  semesterName = String(semester.name || "Unknown Semester");
                }
              }

              // Get teacher information - check if already populated
              let teacherId = mark.teacher_id;
              let teacherName = "Unknown Teacher";

              if (teacherId && typeof teacherId === "object" && teacherId._id) {
                // Already populated by backend
                teacherName = String(teacherId.name || "Unknown Teacher");
                teacherId = teacherId._id;
              } else if (typeof teacherId === "string" && teacherId) {
                // Find teacher by ID
                const teacher = teachers.find((t) => t && t._id === teacherId);
                if (teacher) {
                  teacherName = String(teacher.name || "Unknown Teacher");
                }
              }

              // Extract subject information safely
              let subjectName = "Unknown Subject";
              let subjectCode = "N/A";

              if (subject) {
                // Safely extract subject name and code, ensuring they are strings
                subjectName = String(subject.name || "Unknown Subject");
                subjectCode = String(subject.code || "N/A");
              }

              // Create enriched mark object with safe string conversions
              const enrichedMark = {
                ...mark,
                // Use the actual subject ID (string) for filtering purposes
                subject_id: typeof mark.subject_id === 'object' ? mark.subject_id._id : mark.subject_id,
                student_id: String(student._id || ''),
                student_name: String(student.name || 'Unknown Student'),
                semester_id: String(semesterId || ''),
                semester_name: String(semesterName || 'Unknown Semester'),
                teacher_id: String(teacherId || ''),
                teacher_name: String(teacherName || 'Unknown Teacher'),
                // Add subject name to the mark for better display
                subject_name: String(subjectName || 'Unknown Subject'),
                subject_code: String(subjectCode || 'N/A'),
                // Ensure numeric values
                midterm: Number(mark.midterm) || 0,
                final: Number(mark.final) || 0,
                assignment: Number(mark.assignment) || 0,
                total: Number(mark.total) || 0,
              };


              allMarks.push(enrichedMark);
            } catch (error) {
              // Silently continue processing other marks
            }
          });
        }
      });
      }

      setStudentMarks(allMarks);
    } catch (error) {
      setStudentMarks([]);
    } finally {
      // Always set marks loading to false when processing is complete
      setIsLoading((prev) => ({ ...prev, marks: false }));
    }
  }, [students, semesters, subjects, teachers]);

  // Filter marks based on selected semester, subject, and search term
  useEffect(() => {
    let result = [...studentMarks];

    // Filter by semester
    if (selectedSemester) {
      result = result.filter((mark) => {
        // Handle different semester_id formats
        const markSemesterId =
          typeof mark.semester_id === "object"
            ? mark.semester_id._id
            : mark.semester_id;

        return markSemesterId === selectedSemester;
      });
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
        const student = students.find((s) => s._id === mark.student_id);
        // Use enriched subject data from the mark instead of looking up
        return (
          student?.name?.toLowerCase().includes(term) ||
          student?.student_id_number?.toLowerCase().includes(term) ||
          mark.subject_name?.toLowerCase().includes(term) ||
          mark.subject_code?.toLowerCase().includes(term)
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
    students,
    subjects,
  ]);

  // Update the handleMarksInputChange function to properly set teacher_id and teacher_name when a subject is selected
  const handleMarksInputChange = (e) => {
    const { name, value } = e.target;

    // If subject is changing, update teacher_id, teacher_name, and semester_id based on the selected subject
    if (name === "subject_id") {
      if (value) {
        const selectedSubject = subjects.find((s) => s._id === value);
        if (selectedSubject) {
          // Get semester_id from the subject
          const subjectSemesterId =
            typeof selectedSubject.semester_id === "object"
              ? selectedSubject.semester_id._id
              : selectedSubject.semester_id;

          // Handle teacher_id which can be an object with _id and name properties
          let teacherId = "";
          let teacherName = "Not Assigned";

          if (selectedSubject.teacher_id) {
            if (typeof selectedSubject.teacher_id === "object") {
              // If teacher_id is an object with _id and name
              teacherId = selectedSubject.teacher_id._id;
              teacherName = selectedSubject.teacher_id.name;
            } else {
              // If teacher_id is just an ID string
              teacherId = selectedSubject.teacher_id;
              const teacher = teachers.find((t) => t._id === teacherId);
              if (teacher) {
                teacherName = teacher.name;
              }
            }
          }



          setMarksFormData({
            ...marksFormData,
            [name]: value,
            semester_id: subjectSemesterId,
            teacher_id: teacherId,
            teacher_name: teacherName,
          });
          return;
        }
      } else {
        // If no subject is selected, clear teacher info
        setMarksFormData({
          ...marksFormData,
          [name]: value,
          teacher_id: "",
          teacher_name: "",
        });
        return;
      }
    }

    setMarksFormData({
      ...marksFormData,
      [name]:
        name === "midterm" || name === "final" || name === "assignment"
          ? Number(value)
          : value,
    });
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterChange = (e) => {
    const semesterId = e.target.value;

    setSelectedSemester(semesterId);
    setSelectedSubject(""); // Reset subject selection when semester changes

    // Update form data with the new semester
    setMarksFormData((prev) => ({
      ...prev,
      semester_id: semesterId,
      subject_id: "",
      teacher_id: "", // Reset teacher_id when semester changes
      teacher_name: "", // Reset teacher_name when semester changes
    }));


  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  // Calculate total marks and grade
  const calculateTotalAndGrade = (midterm, final, assignment) => {
    const midtermValue = Number(midterm) || 0;
    const finalValue = Number(final) || 0;
    const assignmentValue = Number(assignment) || 0;

    const total = midtermValue + finalValue + assignmentValue;

    // Modified grade calculation to match server's expected enum values
    // Assuming the server accepts: A, B, C, D, F (without + or -)
    let grade = "F";
    if (total >= 90) grade = "A";
    else if (total >= 80) grade = "B";
    else if (total >= 70) grade = "C";
    else if (total >= 60) grade = "D";
    else grade = "F";

    return { total, grade };
  };

  // Update the handleAddMarks function to ensure teacher_id is included
  const handleAddMarks = async () => {
    try {
      // Validate required fields
      if (!marksFormData.student_id) {
        showError("Please select a student");
        return;
      }

      if (!marksFormData.subject_id) {
        showError("Please select a subject");
        return;
      }

      // Get the semester_id and teacher_id from the selected subject if not provided
      let semester_id = marksFormData.semester_id;
      let teacher_id = marksFormData.teacher_id;

      if (!semester_id || !teacher_id) {
        const selectedSubjectObj = subjects.find(
          (s) => s._id === marksFormData.subject_id
        );
        if (selectedSubjectObj) {
          // Get semester_id if not provided
          if (!semester_id && selectedSubjectObj.semester_id) {
            semester_id =
              typeof selectedSubjectObj.semester_id === "object"
                ? selectedSubjectObj.semester_id._id
                : selectedSubjectObj.semester_id;
          }

          // Get teacher_id if not provided
          if (!teacher_id && selectedSubjectObj.teacher_id) {
            teacher_id =
              typeof selectedSubjectObj.teacher_id === "object"
                ? selectedSubjectObj.teacher_id._id
                : selectedSubjectObj.teacher_id;
          }
        }

        if (!semester_id && semesters.length > 0) {
          semester_id = semesters[0]._id;
        }

        if (!semester_id) {
          alert("Please select a semester");
          return;
        }

        if (!teacher_id) {
          alert(
            "The selected subject has no assigned teacher. Please assign a teacher to the subject first."
          );
          return;
        }
      }

      const { total, grade } = calculateTotalAndGrade(
        marksFormData.midterm,
        marksFormData.final,
        marksFormData.assignment
      );

      const markData = {
        subject_id: marksFormData.subject_id,
        semester_id: semester_id,
        teacher_id: teacher_id, // Include teacher_id in the mark data
        assignment: Number(marksFormData.assignment) || 0,
        midterm: Number(marksFormData.midterm) || 0,
        final: Number(marksFormData.final) || 0,
        total,
        grade,
        remarks: marksFormData.remarks || "No remarks",
      };

      const response = await fetch(
        `http://localhost:4400/api/v1/students/${marksFormData.student_id}/marks`,
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(markData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Refresh students data to get updated marks
        const refreshResponse = await fetch(
          "http://localhost:4400/api/v1/students/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData.status === "success" &&
          refreshData.data &&
          refreshData.data.students
        ) {
          setStudents(refreshData.data.students);
        }

        setIsAddMarksModalOpen(false);
        resetMarksForm();
        alert(data.message || "Marks added successfully!");
      } else {
        alert(`Failed to add marks: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      alert("Failed to add marks. Please try again.");
    }
  };

  const resetMarksForm = () => {
    // Make sure we have a valid semester_id
    const defaultSemesterId = semesters.length > 0 ? semesters[0]._id : "";

    setMarksFormData({
      student_id: "",
      subject_id: "",
      semester_id: defaultSemesterId,
      teacher_id: "", // Reset teacher_id
      teacher_name: "", // Reset teacher_name
      midterm: "",
      final: "",
      assignment: "",
      remarks: "",
    });
  };

  // Update marks function
  const handleUpdateMarks = async () => {
    try {
      if (!editingMark) return;

      const { total, grade } = calculateTotalAndGrade(
        marksFormData.midterm,
        marksFormData.final,
        marksFormData.assignment
      );

      const markData = {
        subject_id: marksFormData.subject_id,
        semester_id: marksFormData.semester_id,
        teacher_id: marksFormData.teacher_id,
        assignment: Number(marksFormData.assignment) || 0,
        midterm: Number(marksFormData.midterm) || 0,
        final: Number(marksFormData.final) || 0,
        total,
        grade,
        remarks: marksFormData.remarks || "No remarks",
      };

      const response = await fetch(
        `http://localhost:4400/api/v1/students/${editingMark.student_id}/marks/${editingMark.markIndex}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(markData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Refresh students data to get updated marks
        const refreshResponse = await fetch(
          "http://localhost:4400/api/v1/students/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData.status === "success" &&
          refreshData.data &&
          refreshData.data.students
        ) {
          setStudents(refreshData.data.students);
        }

        setIsEditMarksModalOpen(false);
        setEditingMark(null);
        resetMarksForm();
        alert("Marks updated successfully!");
      } else {
        alert(`Failed to update marks: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      alert("Failed to update marks. Please try again.");
    }
  };

  // Delete marks function
  const handleDeleteMarks = async (mark) => {
    if (!window.confirm("Are you sure you want to delete this mark record?")) {
      return;
    }

    try {
      const actualMarkIndex = findMarkIndexInStudent(mark.student_id, mark);

      if (actualMarkIndex === -1) {
        showError("Error: Could not find the mark record to delete. Please refresh the page and try again.");
        return;
      }

      const response = await fetch(
        `http://localhost:4400/api/v1/students/${mark.student_id}/marks/${actualMarkIndex}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Refresh students data to get updated marks
        const refreshResponse = await fetch(
          "http://localhost:4400/api/v1/students/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData.status === "success" &&
          refreshData.data &&
          refreshData.data.students
        ) {
          setStudents(refreshData.data.students);
        }

        showSuccess("Marks deleted successfully!");
      } else {
        showError(`Failed to delete marks: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      showError("Failed to delete marks. Please try again.");
    }
  };

  // Open edit marks modal
  const openEditMarksModal = (mark) => {
    const student = getStudentById(mark.student_id);
    const actualMarkIndex = findMarkIndexInStudent(mark.student_id, mark);

    if (actualMarkIndex === -1) {
      showError("Error: Could not find the mark record to edit. Please refresh the page and try again.");
      return;
    }

    setEditingMark({
      ...mark,
      markIndex: actualMarkIndex,
      student_name: student.name,
    });

    // Populate form with existing mark data
    setMarksFormData({
      student_id: mark.student_id,
      subject_id: typeof mark.subject_id === 'object' ? mark.subject_id._id : mark.subject_id,
      semester_id: typeof mark.semester_id === 'object' ? mark.semester_id._id : mark.semester_id,
      teacher_id: typeof mark.teacher_id === 'object' ? mark.teacher_id._id : mark.teacher_id,
      teacher_name: typeof mark.teacher_id === 'object' ? mark.teacher_id.name : mark.teacher_name,
      midterm: mark.midterm || "",
      final: mark.final || "",
      assignment: mark.assignment || "",
      remarks: mark.remarks || "",
    });

    setIsEditMarksModalOpen(true);
  };



  // Update the handleImportCSV function to ensure teacher_id is included
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
        "midterm",
        "final",
        "assignment",
      ];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );

      if (missingHeaders.length > 0) {
        alert(`${t("marks.missing_headers")}: ${missingHeaders.join(", ")}`);
        return;
      }

      // Process data rows
      const importPromises = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        if (values.length !== headers.length) continue;

        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index].trim();
        });

        // Validate student and subject
        const studentExists = students.some(
          (s) => s._id === rowData.student_id
        );
        const subject = subjects.find((s) => s._id === rowData.subject_id);

        if (!studentExists || !subject) {
          continue;
        }

        // Check if subject has a teacher assigned
        if (!subject.teacher_id) {
          continue;
        }

        // Calculate total and grade
        const { total, grade } = calculateTotalAndGrade(
          rowData.midterm,
          rowData.final,
          rowData.assignment
        );

        const markData = {
          subject_id: rowData.subject_id,
          semester_id:
            typeof subject.semester_id === "object"
              ? subject.semester_id._id
              : subject.semester_id,
          teacher_id: subject.teacher_id, // Ensure teacher_id is included
          assignment: Number(rowData.assignment) || 0,
          midterm: Number(rowData.midterm) || 0,
          final: Number(rowData.final) || 0,
          total,
          grade,
          remarks: rowData.remarks || "Imported from CSV",
        };

        // Add to import promises
        importPromises.push(
          fetch(
            `http://localhost:4400/api/v1/students/${rowData.student_id}/marks`,
            {
              method: "POST",
              headers: createHeaders(),
              body: JSON.stringify(markData),
            }
          )
        );
      }

      if (importPromises.length === 0) {
        alert(t("marks.no_valid_data"));
        return;
      }

      // Execute all import promises
      Promise.all(importPromises)
        .then(() => {
          // Refresh students data
          return fetch("http://localhost:4400/api/v1/students/", {
            headers: createHeaders(),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success" && data.data && data.data.students) {
            setStudents(data.data.students);
          }
          setIsImportModalOpen(false);
          setCsvData("");
          alert(
            `${t("marks.successfully_imported")} ${importPromises.length} ${t(
              "marks.entries"
            )}`
          );
        })
        .catch(() => {
          alert("Failed to import some marks. Please try again.");
        });
    } catch {
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
    const headers = "student_id,subject_id,midterm,final,assignment,remarks";
    const sampleRow1 = `${students[0]?._id || "student_id_example"},${
      subjects[0]?._id || "subject_id_example"
    },30,70,20,"Excellent performance"`;
    const sampleRow2 = `${students[0]?._id || "student_id_example"},${
      subjects[1]?._id || "subject_id_example"
    },25,65,15,"Good performance"`;
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
  const getStudentById = (id) => {
    return (
      students.find((student) => student._id === id) || {
        name: "Unknown Student",
        student_id_number: "N/A",
      }
    );
  };

  const getSemesterNameById = (id) => {
    const semester = semesters.find((semester) => semester._id === id);
    return semester ? semester.name : "Unknown Semester";
  };

  // Helper function to find the actual mark index in student's marks array
  const findMarkIndexInStudent = (studentId, mark) => {
    const student = students.find(s => s._id === studentId);
    if (!student || !student.marks) return -1;

    // Find the mark by comparing multiple fields to ensure we get the right one
    return student.marks.findIndex(m => {
      const subjectIdMatch = (typeof m.subject_id === 'object' ? m.subject_id._id : m.subject_id) ===
                            (typeof mark.subject_id === 'object' ? mark.subject_id._id : mark.subject_id);
      const semesterIdMatch = (typeof m.semester_id === 'object' ? m.semester_id._id : m.semester_id) ===
                             (typeof mark.semester_id === 'object' ? mark.semester_id._id : mark.semester_id);
      const scoresMatch = m.midterm === mark.midterm && m.final === mark.final && m.assignment === mark.assignment;

      return subjectIdMatch && semesterIdMatch && scoresMatch;
    });
  };



  // Loading state
  if (
    isLoading.semesters ||
    isLoading.subjects ||
    isLoading.students ||
    isLoading.teachers ||
    isLoading.marks
  ) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B87] mx-auto mb-4'></div>
          <p className='text-gray-600'>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Get the selected semester name for display
  const selectedSemesterName = selectedSemester
    ? getSemesterNameById(selectedSemester)
    : "";

  return (
    <ErrorBoundary>
      <div className='w-full min-h-screen space-y-6'>
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
                <BookOpen className='h-8 w-8 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent'>
                  Academic Grade Management System
                </h2>
                <p className='text-gray-600 mt-1'>
                  Comprehensive academic records and grade management system for
                  students and faculty
                </p>
              </div>
            </div>
            <div className='hidden md:flex items-center space-x-2 text-[#1D3D6F]'>
              <BarChart3 className='h-5 w-5' />
              <span className='text-sm font-medium'>Instructor Dashboard</span>
            </div>
          </div>

          {/* Filters Section */}
          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm'>
            <div className='flex items-center space-x-2 mb-4'>
              <Filter className='h-5 w-5 text-[#1D3D6F]' />
              <h3 className='text-lg font-medium text-gray-800'>
                Filter & Search Options
              </h3>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                  <div className='p-1 bg-[#E8ECEF] rounded-lg mr-2'>
                    <Calendar className='h-4 w-4 text-[#1D3D6F]' />
                  </div>
                  Academic Semester
                </label>
                <select
                  className='w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent transition-all duration-200'
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                >
                  <option value=''>All Semesters</option>
                  {semesters.map((semester) => (
                    <option key={semester._id} value={semester._id}>
                      {String(semester.name || 'Unnamed Semester')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                  <div className='p-1 bg-[#E8ECEF] rounded-lg mr-2'>
                    <BookOpen className='h-4 w-4 text-[#2C4F85]' />
                  </div>
                  Course Subject
                </label>
                <select
                  className='w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent transition-all duration-200'
                  value={selectedSubject || ""}
                  onChange={handleSubjectChange}
                >
                  <option value=''>All Course Subjects</option>
                  {subjects
                    .filter((subject) => {
                      if (!selectedSemester) return true;
                      // Use the extracted semester ID string for filtering
                      return subject.semester_id_string === selectedSemester;
                    })
                    .map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {String(subject.code || 'N/A')} - {String(subject.name || 'Unnamed Subject')}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                  <div className='p-1 bg-[#E8ECEF] rounded-lg mr-2'>
                    <Users className='h-4 w-4 text-[#F7B500]' />
                  </div>
                  Student
                </label>
                <select
                  className='w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent transition-all duration-200'
                  value={selectedStudent || ""}
                  onChange={handleStudentChange}
                >
                  <option value=''>All Students</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {String(student.name || 'Unnamed Student')} ({String(student.student_id_number || 'N/A')})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                  <div className='p-1 bg-[#E8ECEF] rounded-lg mr-2'>
                    <Search className='h-4 w-4 text-[#1D3D6F]' />
                  </div>
                  Search Records
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search by student name, ID, or course subject...'
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent transition-all duration-200'
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-100'>
              <button
                className='flex items-center px-4 py-2 bg-gradient-to-r from-[#F7B500] to-[#F7B500]/80 text-white rounded-lg hover:from-[#F7B500]/90 hover:to-[#F7B500]/70 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                onClick={() => setIsImportModalOpen(true)}
              >
                <Upload size={18} className='mr-2' />
                Import Academic Data
              </button>
              <button
                className='flex items-center px-4 py-2 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                onClick={() => {
                  resetMarksForm();
                  setIsAddMarksModalOpen(true);
                }}
              >
                <Plus size={18} className='mr-2' />
                Add New Academic Grades
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>


        {/* Academic Records Table */}
        <div className='border-t border-[#E8ECEF] pt-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                <BarChart3 className='h-5 w-5 text-[#1D3D6F]' />
              </div>
              <div>
                <h3 className='text-xl font-semibold bg-gradient-to-r from-[#000000] to-[#1D3D6F] bg-clip-text text-transparent'>
                  Student Academic Records
                  {selectedSemesterName && (
                    <span className='ml-2 text-[#2C4F85] font-normal text-lg'>
                      - {selectedSemesterName}
                    </span>
                  )}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  Comprehensive academic performance tracking and grade
                  management
                </p>
              </div>
            </div>
          </div>
          <div className='overflow-x-auto'>
            {filteredMarks.length === 0 ? (
              <div className='p-12 text-center bg-gradient-to-br from-[#E8ECEF]/20 to-white rounded-xl border border-[#E8ECEF]'>
                <div className='w-24 h-24 bg-[#E8ECEF] rounded-full flex items-center justify-center mx-auto mb-6'>
                  <FileText className='h-12 w-12 text-[#1D3D6F]' />
                </div>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                  No Academic Records Found
                </h3>
                <p className='text-gray-600 mb-6 max-w-md mx-auto'>
                  {searchTerm
                    ? "No academic records match your search criteria. Please try different keywords."
                    : "No academic grades have been recorded for this semester and subject yet."}
                </p>
                <button
                  className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 mx-auto'
                  onClick={() => {
                    resetMarksForm();
                    setIsAddMarksModalOpen(true);
                  }}
                >
                  <Plus className='h-4 w-4' />
                  <span>Add New Academic Grades</span>
                </button>
              </div>
            ) : (
              <div className='bg-white rounded-xl shadow-lg border border-[#E8ECEF] overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                        <div className='flex items-center space-x-2'>
                          <Users className='h-4 w-4' />
                          <span>Student Information</span>
                        </div>
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                        <div className='flex items-center space-x-2'>
                          <BookOpen className='h-4 w-4' />
                          <span>Course Subject</span>
                        </div>
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                        <div className='flex items-center space-x-2'>
                          <Calendar className='h-4 w-4' />
                          <span>Academic Semester</span>
                        </div>
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                        Midterm Exam
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                        Final Exam
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                        Assignment
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                        <div className='flex items-center justify-center space-x-2'>
                          <Award className='h-4 w-4' />
                          <span>Total Grade</span>
                        </div>
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredMarks.map((mark, index) => {
                      const student = getStudentById(mark.student_id);
                      // Use the enriched subject data from the mark object with fallbacks
                      const subjectName = String(mark.subject_name || `Subject ${mark.subject_id || 'Unknown'}`);
                      const subjectCode = String(mark.subject_code || "N/A");

                      // Ensure all values are properly converted to strings/numbers
                      const studentName = String(student?.name || 'Unknown Student');
                      const studentIdNumber = String(student?.student_id_number || 'N/A');
                      const semesterName = String(mark.semester_name || 'Unknown Semester');
                      const midterm = Number(mark.midterm) || 0;
                      const final = Number(mark.final) || 0;
                      const assignment = Number(mark.assignment) || 0;
                      const total = Number(mark.total) || 0;

                      return (
                        <tr
                          key={`mark-${mark._id || index}`}
                          className={`hover:bg-[#E8ECEF]/30 transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-[#E8ECEF]/10"
                          }`}
                        >
                          <td className='px-6 py-5'>
                            <div className='flex items-center space-x-3'>
                              <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                                <Users className='h-4 w-4 text-[#1D3D6F]' />
                              </div>
                              <div>
                                <div className='text-sm font-semibold text-gray-900'>
                                  {studentName}
                                </div>
                                <div className='text-xs text-gray-500 mt-1 font-medium'>
                                  ID: {studentIdNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-5'>
                            <div className='flex items-center space-x-3'>
                              <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                                <BookOpen className='h-4 w-4 text-[#1D3D6F]' />
                              </div>
                              <div>
                                <div className='text-sm font-semibold text-gray-900'>
                                  {subjectName}
                                </div>
                                <div className='text-xs text-gray-500 mt-1 font-medium'>
                                  {subjectCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-5'>
                            <div className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2C4F85]/10 text-[#2C4F85]'>
                              <Calendar className='h-3 w-3 mr-1' />
                              {semesterName}
                            </div>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#2C4F85]/10 text-[#2C4F85]'>
                              {midterm}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#1D3D6F]/10 text-[#1D3D6F]'>
                              {final}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#F7B500]/10 text-[#F7B500]'>
                              {assignment}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <div className='flex items-center justify-center'>
                              <span className='inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#E8ECEF] to-[#E8ECEF]/80 text-[#1D3D6F] border border-[#E8ECEF]'>
                                <Award className='h-4 w-4 mr-2 text-[#F7B500]' />
                                {total}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <div className='flex items-center justify-center space-x-2'>
                              <button
                                onClick={() => openEditMarksModal(mark)}
                                className='inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200'
                                title='Edit marks'
                              >
                                <Edit className='h-4 w-4 mr-1' />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMarks(mark)}
                                className='inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200'
                                title='Delete marks'
                              >
                                <Trash2 className='h-4 w-4 mr-1' />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Academic Data Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title='Import Academic Data'
        size='lg'
      >
        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]'>
            <div className='flex items-start'>
              <div className='p-2 bg-[#1D3D6F]/10 rounded-lg mr-4'>
                <AlertCircle className='h-5 w-5 text-[#1D3D6F]' />
              </div>
              <div>
                <h4 className='text-lg font-semibold text-[#1D3D6F] mb-2'>
                  CSV Import Instructions
                </h4>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  Upload a CSV file containing student academic records.
                  Required columns: student_id, subject_id, midterm, final,
                  assignment, remarks. Ensure all data is properly formatted
                  before importing.
                </p>
              </div>
            </div>
          </div>

          <div className='border-2 border-dashed border-[#E8ECEF] rounded-xl p-8 bg-gradient-to-br from-white to-[#E8ECEF]/20'>
            <div className='flex flex-col items-center justify-center'>
              <div className='w-16 h-16 bg-[#E8ECEF] rounded-full flex items-center justify-center mb-4'>
                <Upload className='h-8 w-8 text-[#1D3D6F]' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                Upload Academic Data File (CSV)
              </h3>
              <p className='text-gray-600 text-sm mb-6 text-center max-w-md'>
                Drag and drop your CSV file here, or click to browse and select
                a file containing student academic records
              </p>
              <input
                type='file'
                id='csv_upload'
                className='hidden'
                accept='.csv'
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className='h-4 w-4' />
                  <span>Browse Files</span>
                </button>
                <button
                  className='px-6 py-3 bg-gradient-to-r from-[#F7B500] to-[#F7B500]/80 text-white rounded-lg hover:from-[#F7B500]/90 hover:to-[#F7B500]/70 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
                  onClick={downloadCSVTemplate}
                >
                  <Download className='h-4 w-4' />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          </div>

          {csvData && (
            <div className='bg-[#E8ECEF]/30 rounded-xl p-6 border border-[#E8ECEF]'>
              <h4 className='text-lg font-semibold text-[#1D3D6F] mb-3 flex items-center'>
                <FileText className='h-5 w-5 mr-2' />
                CSV Data Preview
              </h4>
              <div className='bg-white p-4 rounded-lg overflow-auto max-h-40 border border-gray-200'>
                <pre className='text-xs text-gray-700 font-mono'>{csvData}</pre>
              </div>
            </div>
          )}

          <div className='mt-8 flex justify-end space-x-4'>
            <button
              type='button'
              className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel Operation
            </button>
            <button
              type='button'
              className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleImportCSV}
              disabled={!csvData}
            >
              <Save className='h-4 w-4' />
              <span>Import Academic Records</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Academic Grades Modal */}
      <Modal
        isOpen={isAddMarksModalOpen}
        onClose={() => setIsAddMarksModalOpen(false)}
        title='Add New Academic Grades'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMarks();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-[#1D3D6F]/10 rounded-lg'>
                  <GraduationCap className='h-5 w-5 text-[#1D3D6F]' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold text-[#1D3D6F]'>
                    Academic Grade Entry
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Enter comprehensive academic performance data for student
                    evaluation
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Student Information'
                name='student_id'
                type='select'
                value={marksFormData.student_id}
                onChange={handleMarksInputChange}
                options={students.map((student) => ({
                  value: String(student._id || ''),
                  label: `${String(student.name || 'Unnamed Student')} (${String(student.student_id_number || 'N/A')})`,
                }))}
                required
              />
              <FormField
                label='Course Subject'
                name='subject_id'
                type='select'
                value={marksFormData.subject_id}
                onChange={handleMarksInputChange}
                options={[
                  { value: "", label: "Select Course Subject" },
                  ...subjects
                    .filter(
                      (subject) => {
                        if (!selectedSemester) return true;
                        // Use the extracted semester ID string for filtering
                        return subject.semester_id_string === selectedSemester;
                      }
                    )
                    .map((subject) => ({
                      value: String(subject._id || ''),
                      label: `${String(subject.code || 'N/A')} - ${String(subject.name || 'Unnamed Subject')}`,
                    }))
                ]}
                required
              />
              <FormField
                label='Course Instructor'
                name='teacher_name'
                value={marksFormData.teacher_name}
                readOnly={true}
                placeholder='Instructor will be shown when subject is selected'
                className='bg-[#E8ECEF]/30'
              />
              <FormField
                label='Assignment Grade (Max: 20 points)'
                name='assignment'
                type='number'
                value={marksFormData.assignment}
                onChange={handleMarksInputChange}
                min='0'
                max='20'
                required
              />
              <FormField
                label='Midterm Examination (Max: 30 points)'
                name='midterm'
                type='number'
                value={marksFormData.midterm}
                onChange={handleMarksInputChange}
                min='0'
                max='30'
                required
              />
              <FormField
                label='Final Examination (Max: 70 points)'
                name='final'
                type='number'
                value={marksFormData.final}
                onChange={handleMarksInputChange}
                min='0'
                max='70'
                required
              />

              <FormField
                label='Academic Remarks'
                name='remarks'
                value={marksFormData.remarks}
                onChange={handleMarksInputChange}
                placeholder='Optional academic performance remarks'
              />
            </div>

            {/* Grade Preview Section */}
            <div className='bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]'>
              <h4 className='text-lg font-semibold text-[#1D3D6F] mb-4 flex items-center'>
                <Award className='h-5 w-5 mr-2' />
                Academic Grade Preview
              </h4>
              <div className='flex items-center space-x-6'>
                <div className='w-20 h-20 rounded-full bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] flex items-center justify-center shadow-lg'>
                  {marksFormData.midterm &&
                  marksFormData.final &&
                  marksFormData.assignment ? (
                    <span className='text-2xl font-bold text-white'>
                      {
                        calculateTotalAndGrade(
                          marksFormData.midterm,
                          marksFormData.final,
                          marksFormData.assignment
                        ).grade
                      }
                    </span>
                  ) : (
                    <span className='text-white/60 text-lg'>N/A</span>
                  )}
                </div>
                <div>
                  <p className='text-sm text-gray-600 font-medium'>
                    Total Academic Score
                  </p>
                  <p className='text-3xl font-bold bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent'>
                    {marksFormData.midterm &&
                    marksFormData.final &&
                    marksFormData.assignment
                      ? calculateTotalAndGrade(
                          marksFormData.midterm,
                          marksFormData.final,
                          marksFormData.assignment
                        ).total
                      : "0"}
                    <span className='text-lg text-gray-500 ml-1'>/120</span>
                  </p>
                  <div className='mt-2 flex items-center'>
                    <TrendingUp className='h-4 w-4 text-[#F7B500] mr-1' />
                    <span className='text-xs text-gray-600'>
                      Academic Performance Indicator
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex justify-end space-x-4'>
              <button
                type='button'
                className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
                onClick={() => setIsAddMarksModalOpen(false)}
              >
                Cancel Operation
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>Save Academic Grades</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Marks Modal */}
      <Modal
        isOpen={isEditMarksModalOpen}
        onClose={() => {
          setIsEditMarksModalOpen(false);
          setEditingMark(null);
          resetMarksForm();
        }}
        title={`Edit Marks - ${editingMark?.student_name || 'Student'}`}
      >
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              label={t("marks.student")}
              type='select'
              name='student_id'
              value={marksFormData.student_id}
              onChange={handleMarksInputChange}
              options={students.map((student) => ({
                value: String(student._id || ''),
                label: `${String(student.name || 'Unnamed Student')} (${String(student.student_id_number || 'N/A')})`,
              }))}
              disabled={true} // Disable student selection when editing
            />

            <FormField
              label={t("marks.subject")}
              type='select'
              name='subject_id'
              value={marksFormData.subject_id}
              onChange={handleMarksInputChange}
              options={[
                { value: "", label: t("marks.select_subject") },
                ...subjects
                  .filter(
                    (subject) => {
                      if (!selectedSemester) return true;
                      return subject.semester_id_string === selectedSemester;
                    }
                  )
                  .map((subject) => ({
                    value: String(subject._id || ''),
                    label: `${String(subject.code || 'N/A')} - ${String(subject.name || 'Unnamed Subject')}`,
                  }))
              ]}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <FormField
              label={t("marks.midterm")}
              type='number'
              name='midterm'
              value={marksFormData.midterm}
              onChange={handleMarksInputChange}
              min='0'
              max='100'
            />

            <FormField
              label={t("marks.final")}
              type='number'
              name='final'
              value={marksFormData.final}
              onChange={handleMarksInputChange}
              min='0'
              max='100'
            />

            <FormField
              label={t("marks.assignment")}
              type='number'
              name='assignment'
              value={marksFormData.assignment}
              onChange={handleMarksInputChange}
              min='0'
              max='100'
            />
          </div>

          <FormField
            label={t("marks.remarks")}
            type='textarea'
            name='remarks'
            value={marksFormData.remarks}
            onChange={handleMarksInputChange}
            rows={3}
          />

          <div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => {
                setIsEditMarksModalOpen(false);
                setEditingMark(null);
                resetMarksForm();
              }}
              className='px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004B87] transition-colors duration-200'
            >
              {t("common.cancel")}
            </button>
            <button
              type='button'
              onClick={handleUpdateMarks}
              className='px-6 py-3 text-sm font-medium text-white bg-[#004B87] border border-transparent rounded-lg hover:bg-[#003d6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004B87] transition-colors duration-200'
            >
              <Save className='h-4 w-4 mr-2 inline' />
              {t("common.update")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification Component */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 ${
          notification.type === 'success' ? 'border-green-500' :
          notification.type === 'error' ? 'border-red-500' :
          notification.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
        } p-4 transition-all duration-300 transform translate-x-0`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
              {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              {notification.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                notification.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`rounded-md inline-flex ${
                  notification.type === 'success' ? 'text-green-400 hover:text-green-500' :
                  notification.type === 'error' ? 'text-red-400 hover:text-red-500' :
                  notification.type === 'warning' ? 'text-yellow-400 hover:text-yellow-500' : 'text-blue-400 hover:text-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={() => setNotification(null)}
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </ErrorBoundary>
  );
};

export default TeacherMarksManagement;