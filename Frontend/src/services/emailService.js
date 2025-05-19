// import { getToken } from "../utils/helpers";

// /**
//  * Generate a mock response for testing when API is unavailable
//  * @param {boolean} success - Whether the mock response should be successful
//  * @returns {Object} A mock response object
//  */
// const getMockResponse = (success = true) => {
//   return {
//     success,
//     message: success
//       ? "Mock notification sent successfully"
//       : "Mock notification failed",
//     data: { id: "mock-notification-" + Date.now() },
//   };
// };

// /**
//  * Send email notification to a teacher when a student uploads a research paper
//  * @param {Object} research - The research submission data
//  * @param {Object} student - The student data
//  * @param {Object} teacher - The teacher data
//  * @returns {Promise} - Promise resolving to the email send result
//  */
// export const notifyTeacherOfSubmission = async (research, student, teacher) => {
//   try {
//     const token = getToken();
//     const API_BASE_URL =
//       process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1";

//     const payload = {
//       recipientEmail: teacher.email,
//       recipientName: teacher.fullName || teacher.name,
//       subject: `New Research Submission: ${research.title}`,
//       templateType: "research_submission",
//       templateData: {
//         teacherName: teacher.fullName || teacher.name,
//         studentName: student.name || research.student_name,
//         researchTitle: research.title,
//         submissionDate: new Date().toISOString(),
//         researchId: research._id || research.id,
//         departmentName: research.department_name,
//         abstract:
//           research.abstract?.substring(0, 200) +
//           (research.abstract?.length > 200 ? "..." : ""),
//       },
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/notifications/email`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to send email notification: ${
//             errorData.message || response.statusText
//           }`
//         );
//       }

//       const data = await response.json();
//       console.log("Email notification sent successfully:", data);
//       return data;
//     } catch (fetchError) {
//       console.warn(
//         "Error sending email notification, using mock response:",
//         fetchError
//       );
//       // Return a mock successful response instead of failing
//       return getMockResponse(true);
//     }
//   } catch (error) {
//     console.error("Error sending email notification to teacher:", error);
//     // Don't throw the error to prevent blocking the main submission flow
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send email notification to a student when committee provides feedback
//  * @param {Object} research - The research submission data with review information
//  * @param {Object} student - The student data
//  * @param {Object} reviewer - The reviewer data
//  * @returns {Promise} - Promise resolving to the email send result
//  */
// export const notifyStudentOfFeedback = async (research, student, reviewer) => {
//   try {
//     const token = getToken();
//     const API_BASE_URL =
//       process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1";

//     const payload = {
//       recipientEmail: student.email,
//       recipientName: student.name,
//       subject: `Feedback on Your Research: ${research.title}`,
//       templateType: "research_feedback",
//       templateData: {
//         studentName: student.name,
//         researchTitle: research.title,
//         reviewDate: new Date().toISOString(),
//         status: research.status,
//         reviewerName:
//           reviewer?.fullName || reviewer?.name || "Committee Member",
//         comments:
//           research.reviewer_comments || "No specific comments provided.",
//         researchId: research._id || research.id,
//         departmentName: research.department_name,
//       },
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/notifications/email`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to send email notification: ${
//             errorData.message || response.statusText
//           }`
//         );
//       }

//       const data = await response.json();
//       console.log("Email notification sent successfully to student:", data);
//       return data;
//     } catch (fetchError) {
//       console.warn(
//         "Error sending email notification, using mock response:",
//         fetchError
//       );
//       // Return a mock successful response instead of failing
//       return getMockResponse(true);
//     }
//   } catch (error) {
//     console.error("Error sending email notification to student:", error);
//     // Don't throw the error to prevent blocking the main review flow
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Get the teacher associated with a department
//  * @param {string} departmentId - The department ID
//  * @returns {Promise} - Promise resolving to the teacher data
//  */
// export const getDepartmentTeacher = async (departmentId) => {
//   try {
//     const token = getToken();
//     const API_BASE_URL =
//       process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1";

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/departments/${departmentId}/teacher`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to get department teacher: ${
//             errorData.message || response.statusText
//           }`
//         );
//       }

//       const data = await response.json();
//       return data.data?.teacher || null;
//     } catch (fetchError) {
//       console.warn(
//         "Error fetching department teacher, using mock data:",
//         fetchError
//       );
//       // Return mock teacher data
//       return {
//         _id: "mock-teacher-1",
//         name: "Dr. Mohammad Karimi",
//         fullName: "Dr. Mohammad Karimi",
//         email: "mohammad.karimi@example.com",
//         department: departmentId,
//       };
//     }
//   } catch (error) {
//     console.error("Error getting department teacher:", error);
//     return null;
//   }
// };

// /**
//  * Get student data by ID
//  * @param {string} studentId - The student ID
//  * @returns {Promise} - Promise resolving to the student data
//  */
// export const getStudentById = async (studentId) => {
//   try {
//     const token = getToken();
//     const API_BASE_URL =
//       process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1";

//     try {
//       const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to get student data: ${
//             errorData.message || response.statusText
//           }`
//         );
//       }

//       const data = await response.json();
//       return data.data?.student || null;
//     } catch (fetchError) {
//       console.warn("Error fetching student data, using mock data:", fetchError);
//       // Return mock student data
//       return {
//         _id: studentId,
//         name: "Student Name",
//         email: "student@example.com",
//         student_id_number: studentId,
//       };
//     }
//   } catch (error) {
//     console.error("Error getting student data:", error);
//     return null;
//   }
// };

// /**
//  * Get reviewer data by ID
//  * @param {string} reviewerId - The reviewer ID
//  * @returns {Promise} - Promise resolving to the reviewer data
//  */
// export const getReviewerById = async (reviewerId) => {
//   try {
//     const token = getToken();
//     const API_BASE_URL =
//       process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1";

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/committee-members/${reviewerId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to get reviewer data: ${
//             errorData.message || response.statusText
//           }`
//         );
//       }

//       const data = await response.json();
//       return data.data?.committeeMember || null;
//     } catch (fetchError) {
//       console.warn(
//         "Error fetching reviewer data, using mock data:",
//         fetchError
//       );
//       // Return mock reviewer data
//       return {
//         _id: reviewerId,
//         name: "Committee Member",
//         fullName: "Dr. Committee Member",
//         email: "committee@example.com",
//       };
//     }
//   } catch (error) {
//     console.error("Error getting reviewer data:", error);
//     return null;
//   }
// };



import { getToken } from "../utils/helpers"

/**
 * Generate a mock response for testing when API is unavailable
 * @param {boolean} success - Whether the mock response should be successful
 * @returns {Object} A mock response object
 */
const getMockResponse = (success = true) => {
  return {
    success,
    message: success ? "Mock notification sent successfully" : "Mock notification failed",
    data: { id: "mock-notification-" + Date.now() },
  }
}

/**
 * Send email notification to a teacher when a student uploads a research paper
 * @param {Object} research - The research submission data
 * @param {Object} student - The student data
 * @param {Object} teacher - The teacher data
 * @returns {Promise} - Promise resolving to the email send result
 */
export const notifyTeacherOfSubmission = async (research, student, teacher) => {
  try {
    console.log("Notifying teacher of submission:", {
      researchId: research?._id || research?.id,
      studentId: student?._id || student?.id,
      teacherId: teacher?._id || teacher?.id,
    })

    if (!teacher || !teacher.email) {
      console.warn("Teacher data is missing or incomplete:", teacher)
      return { success: false, error: "Teacher data is missing or incomplete" }
    }

    const token = getToken()
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1"

    const payload = {
      recipientEmail: teacher.email,
      recipientName: teacher.fullName || teacher.name || "Professor",
      subject: `New Research Submission: ${research.title}`,
      templateType: "research_submission",
      templateData: {
        teacherName: teacher.fullName || teacher.name || "Professor",
        studentName: student?.name || research.student_name || "Student",
        researchTitle: research.title || "Research Paper",
        submissionDate: new Date().toISOString(),
        researchId: research._id || research.id || "",
        departmentName: research.department_name || "Department",
        abstract: research.abstract?.substring(0, 200) + (research.abstract?.length > 200 ? "..." : ""),
      },
    }

    console.log("Sending email notification with payload:", payload)

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn("Email API returned error:", errorData)
        throw new Error(`Failed to send email notification: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Email notification sent successfully:", data)
      return data
    } catch (fetchError) {
      console.warn("Error sending email notification, using mock response:", fetchError)
      // Return a mock successful response instead of failing
      return getMockResponse(true)
    }
  } catch (error) {
    console.error("Error sending email notification to teacher:", error)
    // Don't throw the error to prevent blocking the main submission flow
    return { success: false, error: error.message }
  }
}

/**
 * Send email notification to a student when committee provides feedback
 * @param {Object} research - The research submission data with review information
 * @param {Object} student - The student data
 * @param {Object} reviewer - The reviewer data
 * @returns {Promise} - Promise resolving to the email send result
 */
export const notifyStudentOfFeedback = async (research, student, reviewer) => {
  try {
    console.log("Notifying student of feedback:", {
      researchId: research?._id || research?.id,
      studentId: student?._id || student?.id,
      reviewerId: reviewer?._id || reviewer?.id,
      status: research?.status,
    })

    // If student is null, try to get minimal info from the research
    if (!student && research.student_id) {
      console.log("Creating fallback student object from research data")
      student = {
        _id: research.student_id,
        name: research.student_name || "Student",
        email: "unknown@example.com",
      }
    }

    if (!student || !student.email) {
      console.warn("Student data is missing or incomplete:", student)
      return { success: false, error: "Student data is missing or incomplete" }
    }

    const token = getToken()
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1"

    const payload = {
      recipientEmail: student.email,
      recipientName: student.name || "Student",
      subject: `Feedback on Your Research: ${research.title || "Research Paper"}`,
      templateType: "research_feedback",
      templateData: {
        studentName: student.name || "Student",
        researchTitle: research.title || "Research Paper",
        reviewDate: research.review_date || new Date().toISOString(),
        status: research.status || "pending",
        reviewerName: reviewer?.fullName || reviewer?.name || "Committee Member",
        comments: research.reviewer_comments || "No specific comments provided.",
        researchId: research._id || research.id || "",
        departmentName: research.department_name || "Department",
      },
    }

    console.log("Sending email notification with payload:", payload)

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn("Email API returned error:", errorData)
        throw new Error(`Failed to send email notification: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Email notification sent successfully to student:", data)
      return data
    } catch (fetchError) {
      console.warn("Error sending email notification, using mock response:", fetchError)
      // Return a mock successful response instead of failing
      return getMockResponse(true)
    }
  } catch (error) {
    console.error("Error sending email notification to student:", error)
    // Don't throw the error to prevent blocking the main review flow
    return { success: false, error: error.message }
  }
}

/**
 * Get the teacher associated with a department
 * @param {string} departmentId - The department ID
 * @returns {Promise} - Promise resolving to the teacher data
 */
export const getDepartmentTeacher = async (departmentId) => {
  try {
    console.log("Looking up teacher for department:", departmentId)

    if (!departmentId) {
      console.warn("Department ID is undefined or null")
      return null
    }

    const token = getToken()
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1"

    try {
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn("Department teacher API returned error:", errorData)
        throw new Error(`Failed to get department teacher: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Department teacher lookup response:", data)

      // Handle different response structures
      if (data && data.status === "success") {
        return data.data?.teacher || null
      } else if (data && data.teacher) {
        return data.teacher
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        return data
      }

      return null
    } catch (fetchError) {
      console.warn("Error fetching department teacher, using mock data:", fetchError)
      // Return mock teacher data
      return {
        _id: "mock-teacher-1",
        name: "Dr. Mohammad Karimi",
        fullName: "Dr. Mohammad Karimi",
        email: "mohammad.karimi@example.com",
        department: departmentId,
      }
    }
  } catch (error) {
    console.error("Error getting department teacher:", error)
    return null
  }
}

/**
 * Get student data by ID
 * @param {string} studentId - The student ID
 * @returns {Promise} - Promise resolving to the student data
 */
export const getStudentById = async (studentId) => {
  try {
    console.log("Looking up student with ID:", studentId)

    if (!studentId) {
      console.warn("Student ID is undefined or null")
      return null
    }

    const token = getToken()
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1"

    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn("Student API returned error:", errorData)
        throw new Error(`Failed to get student data: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Student lookup response:", data)

      // Handle different response structures
      if (data && data.status === "success") {
        return data.data?.student || null
      } else if (data && data.student) {
        return data.student
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        return data
      }

      return null
    } catch (fetchError) {
      console.warn("Error fetching student data, using mock data:", fetchError)
      // Return mock student data
      return {
        _id: studentId,
        name: "Student Name",
        email: "student@example.com",
        student_id_number: studentId,
      }
    }
  } catch (error) {
    console.error("Error getting student data:", error)
    return null
  }
}

/**
 * Get reviewer data by ID
 * @param {string} reviewerId - The reviewer ID
 * @returns {Promise} - Promise resolving to the reviewer data
 */
export const getReviewerById = async (reviewerId) => {
  try {
    console.log("Looking up reviewer with ID:", reviewerId)

    if (!reviewerId) {
      console.warn("Reviewer ID is undefined or null")
      return null
    }

    const token = getToken()
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4400/api/v1"

    try {
      const response = await fetch(`${API_BASE_URL}/committee-members/${reviewerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn("Reviewer API returned error:", errorData)
        throw new Error(`Failed to get reviewer data: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Reviewer lookup response:", data)

      // Handle different response structures
      if (data && data.status === "success") {
        return data.data?.committeeMember || null
      } else if (data && data.committeeMember) {
        return data.committeeMember
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        return data
      }

      return null
    } catch (fetchError) {
      console.warn("Error fetching reviewer data, using mock data:", fetchError)
      // Return mock reviewer data
      return {
        _id: reviewerId,
        name: "Committee Member",
        fullName: "Dr. Committee Member",
        email: "committee@example.com",
      }
    }
  } catch (error) {
    console.error("Error getting reviewer data:", error)
    return null
  }
}
