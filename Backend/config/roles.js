module.exports = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",

  // Role-based permissions
  permissions: {
    admin: ["manage_users", "manage_faculty", "manage_departments", "manage_courses", "manage_all"],
    faculty: ["manage_courses", "manage_research", "manage_resources", "view_students"],
    student: ["view_courses", "enroll_courses", "view_resources", "submit_research"],
  },
}

