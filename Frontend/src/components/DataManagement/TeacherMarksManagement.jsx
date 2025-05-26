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
  User,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

const TeacherMarksManagement = () => {
  const { t, isRTL } = useLanguage();

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
    semester_id: "",
    teacher_id: "", // Add teacher_id field
    teacher_name: "", // Add teacher_name field for display
    midterm: "",
    final: "",
    assignment: "",
    remarks: "",
  });

  // Form data for adding/editing subjects
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    semester_id: "",
    credit_hours: 3,
    teacher_id: "", // Added teacher_id field
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
        console.log("Teachers API Response:", data);

        if (data.status === "success" && data.data && data.data.teachers) {
          setTeachers(data.data.teachers);
        } else {
          console.error(
            "Unexpected API response structure for teachers:",
            data
          );
          setTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
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
        console.log("Students API Response:", data);

        if (data.status === "success" && data.data && data.data.students) {
          setStudents(data.data.students);
        } else {
          console.error("Unexpected API response structure:", data);
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
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
        console.log("Subjects API Response:", data);

        if (data.subjects && Array.isArray(data.subjects)) {
          // Enrich subjects with teacher names
          const enrichedSubjects = data.subjects.map((subject) => {
            // Format semester_id if needed
            const formattedSubject = {
              ...subject,
              semester_id:
                typeof subject.semester_id === "object"
                  ? subject.semester_id
                  : {
                      _id: subject.semester_id,
                      name:
                        getSemesterById(subject.semester_id)?.name ||
                        "Unknown Semester",
                    },
            };

            // Add teacher name if teacher_id exists
            if (subject.teacher_id) {
              const teacher = teachers.find(
                (t) => t._id === subject.teacher_id
              );
              if (teacher) {
                formattedSubject.teacher_name = teacher.name;
              }
            }

            return formattedSubject;
          });

          setSubjects(enrichedSubjects);
          console.log("Enriched subjects:", enrichedSubjects);
        } else {
          console.error("Unexpected API response structure:", data);
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, subjects: false }));
      }
    };

    fetchSubjects();
  }, [teachers]); // Add teachers as dependency to ensure subjects are enriched after teachers are loaded

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
        console.log("Semesters API Response:", data);

        if (data.semesters && Array.isArray(data.semesters)) {
          setSemesters(data.semesters);
          // Set the first semester as default if available
          if (data.semesters.length > 0) {
            // Don't auto-select a semester
            setMarksFormData((prev) => ({
              ...prev,
              semester_id: data.semesters[0]._id,
            }));
            setSubjectFormData((prev) => ({
              ...prev,
              semester_id: data.semesters[0]._id,
            }));
          }
        } else {
          console.error("Unexpected API response structure:", data);
          setSemesters([]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setSemesters([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, semesters: false }));
      }
    };

    fetchSemesters();
  }, []);

  // Extract marks from students data and enrich with semester and teacher information
  useEffect(() => {
    if (students.length > 0 && semesters.length > 0 && subjects.length > 0) {
      const allMarks = [];
      students.forEach((student) => {
        if (student.marks && Array.isArray(student.marks)) {
          student.marks.forEach((mark) => {
            // Find the subject for this mark to get its semester and teacher
            const subject = subjects.find((sub) => sub._id === mark.subject_id);

            // Get semester ID either from the subject or directly from the mark
            let semesterId =
              typeof mark.semester_id === "object"
                ? mark.semester_id._id
                : mark.semester_id;
            let semesterName = "Unknown Semester";
            let teacherId = null;
            let teacherName = "Unknown Teacher";

            // If we found the subject, use its semester information
            if (subject) {
              // Handle both string and object semester_id formats in subjects
              const subjectSemesterId =
                typeof subject.semester_id === "object"
                  ? subject.semester_id._id
                  : subject.semester_id;

              semesterId = subjectSemesterId;

              // Get the semester name from the subject's semester
              const semester = semesters.find(
                (sem) => sem._id === subjectSemesterId
              );
              if (semester) {
                semesterName = semester.name;
              } else if (
                typeof subject.semester_id === "object" &&
                subject.semester_id.name
              ) {
                semesterName = subject.semester_id.name;
              }

              // Get teacher information if available
              if (subject.teacher_id) {
                teacherId = subject.teacher_id;
                const teacher = teachers.find((t) => t._id === teacherId);
                if (teacher) {
                  teacherName = teacher.name;
                }
              }
            } else {
              // Fallback to using mark's semester_id
              const semester = semesters.find((sem) => sem._id === semesterId);
              if (semester) {
                semesterName = semester.name;
              }
            }

            // Enrich mark with student, semester, and teacher information
            allMarks.push({
              ...mark,
              student_id: student._id,
              student_name: student.name,
              // Normalize semester_id to ensure consistent format
              semester_id: semesterId,
              // Add semester name for display
              semester_name: semesterName,
              // Add teacher information
              teacher_id: teacherId,
              teacher_name: teacherName,
            });
          });
        }
      });

      console.log(
        "Extracted marks:",
        allMarks.length,
        "Sample mark:",
        allMarks.length > 0 ? allMarks[0] : null
      );
      setStudentMarks(allMarks);
    }
  }, [students, semesters, subjects, teachers]);

  // Filter marks based on selected semester, subject, and search term
  useEffect(() => {
    let result = [...studentMarks];

    console.log("Filtering marks with:", {
      selectedSemester,
      totalMarks: studentMarks.length,
      sampleMark: studentMarks.length > 0 ? studentMarks[0] : null,
    });

    // Filter by semester
    if (selectedSemester) {
      console.log("Filtering by semester:", selectedSemester);
      result = result.filter((mark) => {
        // Handle different semester_id formats
        const markSemesterId =
          typeof mark.semester_id === "object"
            ? mark.semester_id._id
            : mark.semester_id;

        console.log(
          `Mark semester_id: ${markSemesterId}, Selected: ${selectedSemester}, Match: ${
            markSemesterId === selectedSemester
          }`
        );
        return markSemesterId === selectedSemester;
      });
      console.log("After semester filter, marks count:", result.length);
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
        const subject = subjects.find((s) => s._id === mark.subject_id);
        return (
          student?.name?.toLowerCase().includes(term) ||
          student?.student_id_number?.toLowerCase().includes(term) ||
          subject?.name?.toLowerCase().includes(term) ||
          subject?.code?.toLowerCase().includes(term)
        );
      });
    }

    console.log("Final filtered marks count:", result.length);
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
    if (name === "subject_id" && value) {
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

        console.log("Setting teacher info from subject:", {
          subject: selectedSubject.name,
          teacher_id: teacherId,
          teacher_name: teacherName,
          semester_id: subjectSemesterId,
        });

        setMarksFormData({
          ...marksFormData,
          [name]: value,
          semester_id: subjectSemesterId,
          teacher_id: teacherId,
          teacher_name: teacherName,
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
    const semesterId = e.target.value;
    console.log("Semester changed to:", semesterId);

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

    setSubjectFormData((prev) => ({
      ...prev,
      semester_id: semesterId,
    }));

    // Log the current state for debugging
    console.log("Current semester state:", {
      selectedSemester: semesterId,
      marksFormData: semesterId,
      subjectFormData: semesterId,
    });
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
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
        alert("Please select a student");
        return;
      }

      if (!marksFormData.subject_id) {
        alert("Please select a subject");
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

      console.log("Sending mark data:", markData);

      const response = await fetch(
        `http://localhost:4400/api/v1/students/${marksFormData.student_id}/marks`,
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(markData),
        }
      );

      const data = await response.json();
      console.log("Add marks response:", data);

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
        alert("Marks added successfully!");
      } else {
        console.error("Error adding marks:", data);
        alert(`Failed to add marks: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error adding marks:", error);
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

  // CRUD operations for subjects
  const handleAddSubject = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(subjectFormData),
      });

      const data = await response.json();
      console.log("Add subject response:", data);

      // Check for success message instead of status
      if (data.message === "Subject created successfully!" || data.subject) {
        // Refresh the subjects list to get the updated data with proper structure
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/subjects/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.subjects) {
          setSubjects(refreshData.subjects);
        }

        setIsAddSubjectModalOpen(false);
        resetSubjectForm();
        alert("Subject added successfully!");
      } else {
        console.error("Error adding subject:", data);
        alert("Failed to add subject. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Please try again.");
    }
  };

  const handleEditSubject = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/subjects/${editingSubject._id}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(subjectFormData),
        }
      );

      const data = await response.json();
      console.log("Edit subject response:", data);

      // Check for success message instead of status
      if ((data.message && data.message.includes("success")) || data.subject) {
        // Refresh the subjects list to get the updated data with proper structure
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/subjects/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.subjects) {
          setSubjects(refreshData.subjects);
        }

        setIsEditSubjectModalOpen(false);
        resetSubjectForm();
        alert("Subject updated successfully!");
      } else {
        console.error("Error updating subject:", data);
        alert("Failed to update subject. Please try again.");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Failed to update subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    // Check if subject is used in any marks
    const isUsed = studentMarks.some((mark) => mark.subject_id === subjectId);

    if (isUsed) {
      alert(t("subjects.cannot_delete_used"));
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/subjects/${subjectId}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      const data = await response.json();
      console.log("Delete subject response:", data);

      // Check for success message instead of status
      if (
        (data.message && data.message.includes("success")) ||
        data.status === "success"
      ) {
        // Remove the subject from our subjects array
        const updatedSubjects = subjects.filter(
          (subject) => subject._id !== subjectId
        );
        setSubjects(updatedSubjects);

        alert("Subject deleted successfully!");
      } else {
        console.error("Error deleting subject:", data);
        alert("Failed to delete subject. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  const resetSubjectForm = () => {
    setSubjectFormData({
      name: "",
      code: "",
      semester_id:
        selectedSemester || (semesters.length > 0 ? semesters[0]._id : ""),
      credit_hours: 3,
      teacher_id: "", // Reset teacher_id
    });
    setEditingSubject(null);
  };

  const openEditSubjectModal = (subject) => {
    setEditingSubject(subject);

    // Handle teacher_id which can be an object
    let teacherId = "";
    if (subject.teacher_id) {
      teacherId =
        typeof subject.teacher_id === "object"
          ? subject.teacher_id._id
          : subject.teacher_id;
    }

    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      semester_id: subject.semester_id._id,
      credit_hours: subject.credit_hours,
      teacher_id: teacherId,
    });

    setIsEditSubjectModalOpen(true);
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
          console.warn(
            `${t("marks.skipping_row")} ${i}: ${t("marks.invalid_ids")}`
          );
          continue;
        }

        // Check if subject has a teacher assigned
        if (!subject.teacher_id) {
          console.warn(
            `${t("marks.skipping_row")} ${i}: Subject has no assigned teacher`
          );
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

        console.log(`Row ${i} mark data:`, markData);

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
        .catch((error) => {
          console.error("Error importing marks:", error);
          alert("Failed to import some marks. Please try again.");
        });
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
  const getSubjectById = (id) => {
    const subject = subjects.find((subject) => subject._id === id);
    return subject || { name: "Unknown Subject", code: "N/A" };
  };

  const getStudentById = (id) => {
    return (
      students.find((student) => student._id === id) || {
        name: "Unknown Student",
        student_id_number: "N/A",
      }
    );
  };

  const getTeacherById = (id) => {
    if (!id) return { name: "Unknown Teacher" };

    // If id is already an object with name property
    if (typeof id === "object" && id.name) {
      return { name: id.name };
    }

    // Otherwise, look up the teacher by ID
    return (
      teachers.find((teacher) => teacher._id === id) || {
        name: "Unknown Teacher",
      }
    );
  };

  const getSemesterById = (id) => {
    if (!id) return { name: "Unknown Semester" };
    return (
      semesters.find((semester) => semester._id === id) || {
        name: "Unknown Semester",
      }
    );
  };

  const getSemesterNameById = (id) => {
    if (!id) return "Unknown Semester";
    const semester = semesters.find((semester) => semester._id === id);
    return semester ? semester.name : "Unknown Semester";
  };

  const getGradeColor = (grade) => {
    if (grade === "A") return "text-green-600";
    if (grade === "B") return "text-blue-600";
    if (grade === "C") return "text-yellow-600";
    if (grade === "D") return "text-orange-600";
    return "text-red-600";
  };

  // Loading state
  if (
    isLoading.semesters ||
    isLoading.subjects ||
    isLoading.students ||
    isLoading.teachers
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
                      {semester.name}
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
                      // Handle both string and object semester_id formats
                      const subjectSemesterId =
                        typeof subject.semester_id === "object"
                          ? subject.semester_id._id
                          : subject.semester_id;
                      return subjectSemesterId === selectedSemester;
                    })
                    .map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.code} - {subject.name}
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
                      {student.name} ({student.student_id_number})
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
        {/* Subject Management Section */}
        <div className='mb-6 border-t border-gray-200 pt-6'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                <BookOpen className='h-5 w-5 text-[#1D3D6F]' />
              </div>
              <div>
                <h3 className='text-xl font-semibold bg-gradient-to-r from-[#000000] to-[#1D3D6F] bg-clip-text text-transparent'>
                  Course Subject Management
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  Manage academic course subjects and instructor assignments
                </p>
              </div>
            </div>
            <button
              className='flex items-center px-6 py-3 bg-gradient-to-r from-[#2C4F85] to-[#1D3D6F] text-white rounded-lg hover:from-[#1D3D6F] hover:to-[#2C4F85] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => {
                resetSubjectForm();
                setIsAddSubjectModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              Add New Course Subject
            </button>
          </div>

          <div className='overflow-x-auto rounded-lg shadow-lg border border-[#E8ECEF]'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <BookOpen className='h-4 w-4' />
                      <span>Course Code</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <GraduationCap className='h-4 w-4' />
                      <span>Course Subject Name</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <Calendar className='h-4 w-4' />
                      <span>Academic Semester</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center space-x-2'>
                      <User className='h-4 w-4' />
                      <span>Course Instructor</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center justify-center space-x-2'>
                      <Award className='h-4 w-4' />
                      <span>Credit Hours</span>
                    </div>
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                    <div className='flex items-center justify-center space-x-2'>
                      <Edit className='h-4 w-4' />
                      <span>Management Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {subjects.map((subject, index) => {
                  let teacherName = "Not Assigned";

                  if (subject.teacher_id) {
                    if (
                      typeof subject.teacher_id === "object" &&
                      subject.teacher_id.name
                    ) {
                      teacherName = subject.teacher_id.name;
                    } else {
                      const teacher = teachers.find(
                        (t) => t._id === subject.teacher_id
                      );
                      if (teacher) {
                        teacherName = teacher.name;
                      }
                    }
                  }

                  return (
                    <tr
                      key={subject._id}
                      className={`hover:bg-[#E8ECEF]/30 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#E8ECEF]/10"
                      }`}
                    >
                      <td className='px-6 py-5'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-[#E8ECEF] rounded-lg'>
                            <BookOpen className='h-4 w-4 text-[#1D3D6F]' />
                          </div>
                          <div className='text-sm font-semibold text-[#1D3D6F] bg-[#E8ECEF]/50 px-3 py-1 rounded-lg'>
                            {subject.code}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {subject.name}
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>
                          Academic Course Subject
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2C4F85]/10 text-[#2C4F85]'>
                          <Calendar className='h-3 w-3 mr-1' />
                          {subject.semester_id.name}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center space-x-2'>
                          <div className='p-1 bg-[#F7B500]/10 rounded-full'>
                            <User className='h-3 w-3 text-[#F7B500]' />
                          </div>
                          <span className='text-sm font-medium text-gray-900'>
                            {teacherName}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-[#F7B500]/10 text-[#F7B500] rounded-full text-sm font-bold'>
                          <Award className='h-4 w-4 mr-1' />
                          {subject.credit_hours}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex justify-center space-x-3'>
                          <button
                            className='p-2 bg-[#2C4F85]/10 text-[#2C4F85] rounded-lg hover:bg-[#2C4F85]/20 transition-all duration-200 transform hover:scale-105'
                            onClick={() => openEditSubjectModal(subject)}
                            title='Edit Course Subject'
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105'
                            onClick={() => handleDeleteSubject(subject._id)}
                            title='Delete Course Subject'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

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
                          <User className='h-4 w-4' />
                          <span>Course Instructor</span>
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
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredMarks.map((mark, index) => {
                      const student = getStudentById(mark.student_id);
                      const subject = getSubjectById(mark.subject_id);

                      let teacherName = "Not Assigned";
                      if (subject.teacher_id) {
                        if (
                          typeof subject.teacher_id === "object" &&
                          subject.teacher_id.name
                        ) {
                          teacherName = subject.teacher_id.name;
                        } else {
                          const teacher = teachers.find(
                            (t) => t._id === subject.teacher_id
                          );
                          if (teacher) {
                            teacherName = teacher.name;
                          }
                        }
                      }

                      return (
                        <tr
                          key={index}
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
                                  {student.name}
                                </div>
                                <div className='text-xs text-gray-500 mt-1 font-medium'>
                                  ID: {student.student_id_number}
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
                                  {subject.name}
                                </div>
                                <div className='text-xs text-gray-500 mt-1 font-medium'>
                                  {subject.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-5'>
                            <div className='flex items-center space-x-2'>
                              <div className='p-1 bg-[#F7B500]/10 rounded-full'>
                                <User className='h-3 w-3 text-[#F7B500]' />
                              </div>
                              <span className='text-sm font-medium text-gray-900 bg-[#E8ECEF]/50 px-3 py-1 rounded-lg'>
                                {teacherName}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-5'>
                            <div className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2C4F85]/10 text-[#2C4F85]'>
                              <Calendar className='h-3 w-3 mr-1' />
                              {mark.semester_name}
                            </div>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#2C4F85]/10 text-[#2C4F85]'>
                              {mark.midterm}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#1D3D6F]/10 text-[#1D3D6F]'>
                              {mark.final}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <span className='inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-[#F7B500]/10 text-[#F7B500]'>
                              {mark.assignment}
                            </span>
                          </td>
                          <td className='px-6 py-5 text-center'>
                            <div className='flex items-center justify-center'>
                              <span className='inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#E8ECEF] to-[#E8ECEF]/80 text-[#1D3D6F] border border-[#E8ECEF]'>
                                <Award className='h-4 w-4 mr-2 text-[#F7B500]' />
                                {mark.total}
                              </span>
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
                  value: student._id,
                  label: `${student.name} (${student.student_id_number})`,
                }))}
                required
              />
              <FormField
                label='Course Subject'
                name='subject_id'
                type='select'
                value={marksFormData.subject_id}
                onChange={handleMarksInputChange}
                options={subjects
                  .filter(
                    (subject) =>
                      !selectedSemester ||
                      subject.semester_id._id === selectedSemester
                  )
                  .map((subject) => ({
                    value: subject._id,
                    label: `${subject.code} - ${subject.name}`,
                  }))}
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

      {/* Add Course Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title='Add New Course Subject'
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
                label='Course Subject Name'
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label='Course Subject Code'
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label='Academic Semester'
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester._id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label='Course Instructor'
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Course Instructor" },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label='Credit Hours'
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-8 flex justify-end space-x-4'>
              <button
                type='button'
                className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
                onClick={() => setIsAddSubjectModalOpen(false)}
              >
                Cancel Operation
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>Save Course Subject</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Course Subject Modal */}
      <Modal
        isOpen={isEditSubjectModalOpen}
        onClose={() => setIsEditSubjectModalOpen(false)}
        title='Edit Course Subject'
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
                label='Course Subject Name'
                name='name'
                type='text'
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label='Course Subject Code'
                name='code'
                type='text'
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label='Academic Semester'
                name='semester_id'
                type='select'
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester._id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label='Course Instructor'
                name='teacher_id'
                type='select'
                value={subjectFormData.teacher_id}
                onChange={handleSubjectInputChange}
                options={[
                  { value: "", label: "Select Course Instructor" },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: teacher.name,
                  })),
                ]}
              />
              <FormField
                label='Credit Hours'
                name='credit_hours'
                type='number'
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min='1'
                max='6'
                required
              />
            </div>

            <div className='mt-8 flex justify-end space-x-4'>
              <button
                type='button'
                className='px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium'
                onClick={() => setIsEditSubjectModalOpen(false)}
              >
                Cancel Operation
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <Save className='h-4 w-4' />
                <span>Update Course Subject</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherMarksManagement;
