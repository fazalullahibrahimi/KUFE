module.exports = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  COMMITTEE: "committeeMember", // ✅ Still included

  // Role-based permissions
  permissions: {
    admin: ["manage_users", "manage_faculty", "manage_departments", "manage_courses", "manage_all"],
    teacher: ["manage_courses", "manage_research", "manage_resources", "view_students"],
    student: ["view_courses", "enroll_courses", "view_resources", "submit_research"],
    committeeMember: ["review_research"], // ✅ Permission for committee members
  },
};
