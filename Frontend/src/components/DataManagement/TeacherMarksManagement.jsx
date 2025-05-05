import React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Save, Upload, Download, FileText, Search, AlertCircle, Edit, Trash2 } from "lucide-react"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from "../../context/LanguageContext"

const TeacherMarksManagement = () => {
  const { t, isRTL } = useLanguage()

  // State for data from API
  const [semesters, setSemesters] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [studentMarks, setStudentMarks] = useState([])
  const [isLoading, setIsLoading] = useState({
    semesters: true,
    subjects: true,
    students: true,
    marks: true,
  })

  // State for UI
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false)
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false)
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false)
  const [filteredMarks, setFilteredMarks] = useState([])
  const [academicYear, setAcademicYear] = useState("2023-2024")
  const [csvData, setCsvData] = useState("")
  const fileInputRef = useRef(null)
  const [editingSubject, setEditingSubject] = useState(null)

  // Form data for adding marks
  const [marksFormData, setMarksFormData] = useState({
    student_id: "",
    subject_id: "",
    semester_id: "",
    midterm: "",
    final: "",
    assignment: "",
    remarks: "",
  })

  // Form data for adding/editing subjects
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    semester_id: "",
    credit_hours: 3,
  })

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // Create headers with auth token
  const createHeaders = (includeContentType = true) => {
    const token = getAuthToken()
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    }

    if (includeContentType) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  }

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, students: true }))
        const response = await fetch("http://localhost:4400/api/v1/students/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("Students API Response:", data)

        if (data.status === "success" && data.data && data.data.students) {
          setStudents(data.data.students)
        } else {
          console.error("Unexpected API response structure:", data)
          setStudents([])
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        setStudents([])
      } finally {
        setIsLoading((prev) => ({ ...prev, students: false }))
      }
    }

    fetchStudents()
  }, [])

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, subjects: true }))
        const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("Subjects API Response:", data)

        if (data.subjects && Array.isArray(data.subjects)) {
          setSubjects(data.subjects)
        } else {
          console.error("Unexpected API response structure:", data)
          setSubjects([])
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
        setSubjects([])
      } finally {
        setIsLoading((prev) => ({ ...prev, subjects: false }))
      }
    }

    fetchSubjects()
  }, [])

  // Fetch semesters from API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, semesters: true }))
        const response = await fetch("http://127.0.0.1:4400/api/v1/semesters/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("Semesters API Response:", data)

        if (data.semesters && Array.isArray(data.semesters)) {
          setSemesters(data.semesters)
          // Set the first semester as default if available
          if (data.semesters.length > 0) {
            setSelectedSemester(data.semesters[0]._id)
            setMarksFormData((prev) => ({ ...prev, semester_id: data.semesters[0]._id }))
            setSubjectFormData((prev) => ({ ...prev, semester_id: data.semesters[0]._id }))
          }
        } else {
          console.error("Unexpected API response structure:", data)
          setSemesters([])
        }
      } catch (error) {
        console.error("Error fetching semesters:", error)
        setSemesters([])
      } finally {
        setIsLoading((prev) => ({ ...prev, semesters: false }))
      }
    }

    fetchSemesters()
  }, [])

  // Extract marks from students data
  useEffect(() => {
    if (students.length > 0) {
      const allMarks = []
      students.forEach((student) => {
        if (student.marks && Array.isArray(student.marks)) {
          student.marks.forEach((mark) => {
            allMarks.push({
              ...mark,
              student_id: student._id,
              student_name: student.name,
            })
          })
        }
      })
      setStudentMarks(allMarks)
    }
  }, [students])

  // Filter marks based on selected semester, subject, and search term
  useEffect(() => {
    let result = [...studentMarks]

    // Filter by semester
    if (selectedSemester) {
      result = result.filter((mark) => mark.semester_id === selectedSemester)
    }

    // Filter by subject
    if (selectedSubject) {
      result = result.filter((mark) => mark.subject_id === selectedSubject)
    }

    // Filter by student
    if (selectedStudent) {
      result = result.filter((mark) => mark.student_id === selectedStudent)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((mark) => {
        const student = students.find((s) => s._id === mark.student_id)
        const subject = subjects.find((s) => s._id === mark.subject_id)
        return (
          student?.name?.toLowerCase().includes(term) ||
          false ||
          student?.student_id_number?.toLowerCase().includes(term) ||
          false ||
          subject?.name?.toLowerCase().includes(term) ||
          false ||
          subject?.code?.toLowerCase().includes(term) ||
          false
        )
      })
    }

    setFilteredMarks(result)
  }, [studentMarks, selectedSemester, selectedSubject, selectedStudent, searchTerm, students, subjects])

  // Form handling functions
  const handleMarksInputChange = (e) => {
    const { name, value } = e.target
    setMarksFormData({
      ...marksFormData,
      [name]: name === "midterm" || name === "final" || name === "assignment" ? Number(value) : value,
    })
  }

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target
    setSubjectFormData({
      ...subjectFormData,
      [name]: name === "credit_hours" ? Number(value) : value,
    })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value)
    setSelectedSubject("") // Reset subject when semester changes
    setMarksFormData({
      ...marksFormData,
      semester_id: e.target.value,
      subject_id: "",
    })
    setSubjectFormData({
      ...subjectFormData,
      semester_id: e.target.value,
    })
  }

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value)
  }

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value)
  }

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value)
  }

  // Calculate total marks and grade
  const calculateTotalAndGrade = (midterm, final, assignment) => {
    const midtermValue = Number(midterm) || 0
    const finalValue = Number(final) || 0
    const assignmentValue = Number(assignment) || 0

    const total = midtermValue + finalValue + assignmentValue

    let grade = "F"
    if (total >= 95) grade = "A+"
    else if (total >= 90) grade = "A"
    else if (total >= 85) grade = "A-"
    else if (total >= 80) grade = "B+"
    else if (total >= 75) grade = "B"
    else if (total >= 70) grade = "B-"
    else if (total >= 65) grade = "C+"
    else if (total >= 60) grade = "C"
    else if (total >= 55) grade = "C-"
    else if (total >= 50) grade = "D"

    return { total, grade }
  }

  // CRUD operations for marks
  const handleAddMarks = async () => {
    try {
      const { total, grade } = calculateTotalAndGrade(
        marksFormData.midterm,
        marksFormData.final,
        marksFormData.assignment,
      )

      const markData = {
        subject_id: marksFormData.subject_id,
        semester_id: marksFormData.semester_id,
        midterm: marksFormData.midterm,
        final: marksFormData.final,
        assignment: marksFormData.assignment,
        total,
        grade,
        remarks: marksFormData.remarks || "No remarks",
      }

      const response = await fetch(`http://localhost:4400/api/v1/students/${marksFormData.student_id}/marks`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(markData),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh students data to get updated marks
        const refreshResponse = await fetch("http://localhost:4400/api/v1/students/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.students) {
          setStudents(refreshData.data.students)
        }

        setIsAddMarksModalOpen(false)
        resetMarksForm()
        alert("Marks added successfully!")
      } else {
        console.error("Error adding marks:", data)
        alert("Failed to add marks. Please try again.")
      }
    } catch (error) {
      console.error("Error adding marks:", error)
      alert("Failed to add marks. Please try again.")
    }
  }

  const resetMarksForm = () => {
    setMarksFormData({
      student_id: "",
      subject_id: "",
      semester_id: selectedSemester,
      midterm: "",
      final: "",
      assignment: "",
      remarks: "",
    })
  }

  // CRUD operations for subjects
  const handleAddSubject = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(subjectFormData),
      })

      const data = await response.json()
      console.log("Add subject response:", data)

      // Check for success message instead of status
      if (data.message === "Subject created successfully!" || data.subject) {
        // If the API returned the new subject, add it to our subjects array
        if (data.subject) {
          // Create a copy of the current subjects array
          const updatedSubjects = [...subjects]

          // Add the new subject with the correct semester_id structure
          // This is the key fix - ensuring semester_id is an object with _id and name properties
          const newSubject = {
            ...data.subject,
            semester_id: {
              _id: data.subject.semester_id,
              name: getSemesterById(data.subject.semester_id).name,
            },
          }

          updatedSubjects.push(newSubject)
          setSubjects(updatedSubjects)

          setIsAddSubjectModalOpen(false)
          resetSubjectForm()
          alert("Subject added successfully!")
        } else {
          // If the API didn't return the subject, refresh the subjects list
          const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
            headers: createHeaders(),
          })
          const refreshData = await refreshResponse.json()

          if (refreshData.subjects) {
            // Make sure each subject has the correct semester_id structure
            const formattedSubjects = refreshData.subjects.map((subject) => {
              // If semester_id is already an object with _id and name, keep it as is
              if (subject.semester_id && typeof subject.semester_id === "object" && subject.semester_id._id) {
                return subject
              }

              // Otherwise, format it correctly
              return {
                ...subject,
                semester_id: {
                  _id: subject.semester_id,
                  name: getSemesterById(subject.semester_id).name,
                },
              }
            })

            setSubjects(formattedSubjects)
          }

          setIsAddSubjectModalOpen(false)
          resetSubjectForm()
          alert("Subject added successfully!")
        }
      } else {
        console.error("Error adding subject:", data)
        alert("Failed to add subject. Please try again.")
      }
    } catch (error) {
      console.error("Error adding subject:", error)
      alert("Failed to add subject. Please try again.")
    }
  }

  const handleEditSubject = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:4400/api/v1/subjects/${editingSubject._id}`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(subjectFormData),
      })

      const data = await response.json()
      console.log("Edit subject response:", data)

      // Check for success message instead of status
      if ((data.message && data.message.includes("success")) || data.subject) {
        // Refresh the subjects data
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.subjects) {
          setSubjects(refreshData.subjects)
        }

        setIsEditSubjectModalOpen(false)
        resetSubjectForm()
        alert("Subject updated successfully!")
      } else {
        console.error("Error updating subject:", data)
        alert("Failed to update subject. Please try again.")
      }
    } catch (error) {
      console.error("Error updating subject:", error)
      alert("Failed to update subject. Please try again.")
    }
  }

  const handleDeleteSubject = async (subjectId) => {
    // Check if subject is used in any marks
    const isUsed = studentMarks.some((mark) => mark.subject_id === subjectId)

    if (isUsed) {
      alert(t("subjects.cannot_delete_used"))
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:4400/api/v1/subjects/${subjectId}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      const data = await response.json()
      console.log("Delete subject response:", data)

      // Check for success message instead of status
      if ((data.message && data.message.includes("success")) || data.status === "success") {
        // Refresh the subjects data
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/subjects/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.subjects) {
          setSubjects(refreshData.subjects)
        }

        alert("Subject deleted successfully!")
      } else {
        console.error("Error deleting subject:", data)
        alert("Failed to delete subject. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
      alert("Failed to delete subject. Please try again.")
    }
  }

  const resetSubjectForm = () => {
    setSubjectFormData({
      name: "",
      code: "",
      semester_id: selectedSemester,
      credit_hours: 3,
    })
    setEditingSubject(null)
  }

  const openEditSubjectModal = (subject) => {
    setEditingSubject(subject)
    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      semester_id: subject.semester_id._id,
      credit_hours: subject.credit_hours,
    })
    setIsEditSubjectModalOpen(true)
  }

  // Import marks from CSV
  const handleImportCSV = () => {
    if (!csvData.trim()) {
      alert(t("marks.please_enter_csv"))
      return
    }

    try {
      // Parse CSV data
      const rows = csvData.trim().split("\n")
      const headers = rows[0].split(",")

      // Validate headers
      const requiredHeaders = ["student_id", "subject_id", "midterm", "final", "assignment"]
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))

      if (missingHeaders.length > 0) {
        alert(`${t("marks.missing_headers")}: ${missingHeaders.join(", ")}`)
        return
      }

      // Process data rows
      const importPromises = []
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",")
        if (values.length !== headers.length) continue

        const rowData = {}
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index].trim()
        })

        // Validate student and subject
        const studentExists = students.some((s) => s._id === rowData.student_id)
        const subject = subjects.find((s) => s._id === rowData.subject_id)

        if (!studentExists || !subject) {
          console.warn(`${t("marks.skipping_row")} ${i}: ${t("marks.invalid_ids")}`)
          continue
        }

        // Calculate total and grade
        const { total, grade } = calculateTotalAndGrade(rowData.midterm, rowData.final, rowData.assignment)

        const markData = {
          subject_id: rowData.subject_id,
          semester_id: subject.semester_id._id,
          midterm: Number(rowData.midterm),
          final: Number(rowData.final),
          assignment: Number(rowData.assignment),
          total,
          grade,
          remarks: rowData.remarks || "Imported from CSV",
        }

        // Add to import promises
        importPromises.push(
          fetch(`http://localhost:4400/api/v1/students/${rowData.student_id}/marks`, {
            method: "POST",
            headers: createHeaders(),
            body: JSON.stringify(markData),
          }),
        )
      }

      if (importPromises.length === 0) {
        alert(t("marks.no_valid_data"))
        return
      }

      // Execute all import promises
      Promise.all(importPromises)
        .then(() => {
          // Refresh students data
          return fetch("http://localhost:4400/api/v1/students/", {
            headers: createHeaders(),
          })
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success" && data.data && data.data.students) {
            setStudents(data.data.students)
          }
          setIsImportModalOpen(false)
          setCsvData("")
          alert(`${t("marks.successfully_imported")} ${importPromises.length} ${t("marks.entries")}`)
        })
        .catch((error) => {
          console.error("Error importing marks:", error)
          alert("Failed to import some marks. Please try again.")
        })
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert(t("marks.error_parsing"))
    }
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCsvData(event.target.result)
    }
    reader.readAsText(file)
  }

  // Generate CSV template
  const generateCSVTemplate = () => {
    const headers = "student_id,subject_id,midterm,final,assignment,remarks"
    const sampleRow1 = `${students[0]?._id || "student_id_example"},${
      subjects[0]?._id || "subject_id_example"
    },30,70,20,"Excellent performance"`
    const sampleRow2 = `${students[0]?._id || "student_id_example"},${
      subjects[1]?._id || "subject_id_example"
    },25,65,15,"Good performance"`
    return `${headers}\n${sampleRow1}\n${sampleRow2}`
  }

  // Download CSV template
  const downloadCSVTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "marks_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Helper functions
  const getSubjectById = (id) => {
    const subject = subjects.find((subject) => subject._id === id)
    return subject || { name: "Unknown Subject", code: "N/A" }
  }

  const getStudentById = (id) => {
    return students.find((student) => student._id === id) || { name: "Unknown Student", student_id_number: "N/A" }
  }

  const getSemesterById = (id) => {
    return semesters.find((semester) => semester._id === id) || { name: "Unknown Semester" }
  }

  const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A" || grade === "A-") return "text-green-600"
    if (grade === "B+" || grade === "B" || grade === "B-") return "text-blue-600"
    if (grade === "C+" || grade === "C" || grade === "C-") return "text-yellow-600"
    if (grade === "D") return "text-orange-600"
    return "text-red-600"
  }

  // Loading state
  if (isLoading.semesters || isLoading.subjects || isLoading.students) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B87] mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{t("marks.teacher_management")}</h2>
      </div>

      {/* Teacher View */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("marks.semester")}</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSemester}
                onChange={handleSemesterChange}
              >
                <option value="">{t("marks.all_semesters")}</option>
                {semesters.map((semester) => (
                  <option key={semester._id} value={semester._id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("marks.subject")}</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSubject || ""}
                onChange={handleSubjectChange}
              >
                <option value="">{t("marks.all_subjects")}</option>
                {subjects
                  .filter((subject) => !selectedSemester || subject.semester_id._id === selectedSemester)
                  .map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("marks.student")}</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedStudent || ""}
                onChange={handleStudentChange}
              >
                <option value="">{t("marks.all_students")}</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.student_id_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={t("marks.search_placeholder")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload size={18} className="mr-2" />
              {t("marks.import")}
            </button>
            <button
              className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              onClick={() => {
                resetMarksForm()
                setIsAddMarksModalOpen(true)
              }}
            >
              <Plus size={18} className="mr-2" />
              {t("marks.add_marks")}
            </button>
          </div>
        </div>

        {/* Subject Management Section */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">{t("subjects.manage_subjects")}</h3>
            <button
              className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              onClick={() => {
                resetSubjectForm()
                setIsAddSubjectModalOpen(true)
              }}
            >
              <Plus size={18} className="mr-2" />
              {t("subjects.add_subject")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("subjects.code")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("subjects.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("subjects.semester")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("subjects.credit_hours")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("subjects.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects
                  .filter((subject) => !selectedSemester || subject.semester_id._id === selectedSemester)
                  .map((subject) => (
                    <tr key={subject._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.semester_id.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.credit_hours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => openEditSubjectModal(subject)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteSubject(subject._id)}
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
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{t("marks.student_marks")}</h3>
          <div className="overflow-x-auto">
            {filteredMarks.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t("marks.no_marks_found")}</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? t("marks.no_marks_match") : t("marks.no_marks_added")}
                </p>
                <button
                  className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
                  onClick={() => {
                    resetMarksForm()
                    setIsAddMarksModalOpen(true)
                  }}
                >
                  {t("marks.add_marks")}
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.student")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.subject")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.midterm")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.final")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.assignment")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.total")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("marks.grade")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMarks.map((mark, index) => {
                    const student = getStudentById(mark.student_id)
                    const subject = getSubjectById(mark.subject_id)
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">{student.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.student_id_number}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getSubjectById(mark.subject_id).name}</div>
                          <div className="text-sm text-gray-500">{getSubjectById(mark.subject_id).code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.midterm}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.final}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.assignment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mark.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(
                              mark.grade,
                            )} bg-opacity-10`}
                          >
                            {mark.grade}
                          </span>
                        </td>
                      </tr>
                    )
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
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">{t("marks.csv_import_instructions")}</h4>
                <p className="text-sm text-blue-600">{t("marks.csv_upload_columns")}</p>
              </div>
            </div>
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center justify-center">
              <Upload size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">{t("marks.upload_csv_file")}</h3>
              <p className="text-gray-500 text-sm mb-4 text-center">{t("marks.drag_drop_csv")}</p>
              <input
                type="file"
                id="csv_upload"
                className="hidden"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                {t("marks.select_file")}
              </button>
              <div className="mt-4 flex items-center">
                <button
                  className="text-[#004B87] hover:underline text-sm flex items-center"
                  onClick={downloadCSVTemplate}
                >
                  <Download size={16} className="mr-1" />
                  {t("marks.download_template")}
                </button>
              </div>
            </div>
          </div>

          {csvData && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">{t("marks.csv_preview")}</h4>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-40">
                <pre className="text-xs text-gray-600">{csvData}</pre>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsImportModalOpen(false)}
            >
              {t("marks.cancel")}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              onClick={handleImportCSV}
              disabled={!csvData}
            >
              <Save size={18} className="inline mr-2" />
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
            e.preventDefault()
            handleAddMarks()
          }}
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("marks.student")}
                name="student_id"
                type="select"
                value={marksFormData.student_id}
                onChange={handleMarksInputChange}
                options={students.map((student) => ({
                  value: student._id,
                  label: `${student.name} (${student.student_id_number})`,
                }))}
                required
              />
              <FormField
                label={t("marks.subject")}
                name="subject_id"
                type="select"
                value={marksFormData.subject_id}
                onChange={handleMarksInputChange}
                options={subjects
                  .filter((subject) => !selectedSemester || subject.semester_id._id === selectedSemester)
                  .map((subject) => ({
                    value: subject._id,
                    label: `${subject.code} - ${subject.name}`,
                  }))}
                required
              />
              <FormField
                label={t("marks.midterm_marks_max_20")}
                name="midterm"
                type="number"
                value={marksFormData.midterm}
                onChange={handleMarksInputChange}
                min="0"
                max="30"
                required
              />
              <FormField
                label={t("marks.final_exam_marks_max_70")}
                name="final"
                type="number"
                value={marksFormData.final}
                onChange={handleMarksInputChange}
                min="0"
                max="70"
                required
              />
              <FormField
                label={t("marks.assignment_marks_max_10")}
                name="assignment"
                type="number"
                value={marksFormData.assignment}
                onChange={handleMarksInputChange}
                min="0"
                max="20"
                required
              />
              <FormField
                label={t("marks.remarks")}
                name="remarks"
                value={marksFormData.remarks}
                onChange={handleMarksInputChange}
                placeholder="Optional remarks"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t("marks.grade_preview")}</h4>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {marksFormData.midterm && marksFormData.final && marksFormData.assignment ? (
                    <span
                      className={`text-xl font-bold ${getGradeColor(
                        calculateTotalAndGrade(marksFormData.midterm, marksFormData.final, marksFormData.assignment)
                          .grade,
                      )}`}
                    >
                      {
                        calculateTotalAndGrade(marksFormData.midterm, marksFormData.final, marksFormData.assignment)
                          .grade
                      }
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("marks.total_marks")}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {marksFormData.midterm && marksFormData.final && marksFormData.assignment
                      ? calculateTotalAndGrade(marksFormData.midterm, marksFormData.final, marksFormData.assignment)
                          .total
                      : "0"}
                    <span className="text-sm text-gray-500 ml-1">/120</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAddMarksModalOpen(false)}
              >
                {t("marks.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              >
                <Save size={18} className="inline mr-2" />
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
            e.preventDefault()
            handleAddSubject()
          }}
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("subjects.name")}
                name="name"
                type="text"
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.code")}
                name="code"
                type="text"
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.semester")}
                name="semester_id"
                type="select"
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester._id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label={t("subjects.credit_hours")}
                name="credit_hours"
                type="number"
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min="1"
                max="6"
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAddSubjectModalOpen(false)}
              >
                {t("subjects.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              >
                <Save size={18} className="inline mr-2" />
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
            e.preventDefault()
            handleEditSubject()
          }}
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("subjects.name")}
                name="name"
                type="text"
                value={subjectFormData.name}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.code")}
                name="code"
                type="text"
                value={subjectFormData.code}
                onChange={handleSubjectInputChange}
                required
              />
              <FormField
                label={t("subjects.semester")}
                name="semester_id"
                type="select"
                value={subjectFormData.semester_id}
                onChange={handleSubjectInputChange}
                options={semesters.map((semester) => ({
                  value: semester._id,
                  label: semester.name,
                }))}
                required
              />
              <FormField
                label={t("subjects.credit_hours")}
                name="credit_hours"
                type="number"
                value={subjectFormData.credit_hours}
                onChange={handleSubjectInputChange}
                min="1"
                max="6"
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsEditSubjectModalOpen(false)}
              >
                {t("subjects.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              >
                <Save size={18} className="inline mr-2" />
                {t("subjects.update_subject")}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TeacherMarksManagement
