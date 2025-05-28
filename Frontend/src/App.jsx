import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Authentication
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute, {
  AdminRoute,
  StudentRoute,
  CommitteeRoute,
  TeacherOrAdminRoute,
} from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/AboutPage.jsx";
import Login from "./pages/Login";
import AcademicPage from "./pages/AcademicPage";
import Registration from "./pages/Registration";
import ForgatPassword from "./pages/ForgatPassword";
import ResetPassword from "./pages/ResetPassword.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AnnouncementsEventsPage from "./pages/AnnouncementsEventsPage.jsx";

import Dashboardv1 from "./pages/Dashboardv1.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import VerificationSuccess from "./pages/VerificationSuccess.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import FacultyDirectory from "./pages/FacultyDirectory.jsx";
import StudentResearchSubmission from "./pages/StudentResearchSubmission.jsx";
import StudentResearchSubmitForm from "./pages/StudentResearchSubmitForm.jsx";
import CommitteeResearchView from "./pages/CommitteeResearchView";
import AdminResearchView from "./pages/AdminResearchView";
import MarksManagementPage from "./pages/MarksManagementPage.jsx";
import CommitteeMemberManagement from "./components/DataManagement/CommitteeMemberManagement.jsx";
import QualityAssurancePage from "./pages/QualityAssurancePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/academics' element={<AcademicPage />} />
          <Route path='/research' element={<ResearchPage />} />
          <Route path='/courses' element={<CoursesPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/anounce' element={<AnnouncementsEventsPage />} />
          <Route path='/announcements' element={<AnnouncementsEventsPage />} />
          <Route path='/facultydirectory' element={<FacultyDirectory />} />

          {/* Authentication Routes (redirect if already authenticated) */}
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/forgotPassword' element={<ForgatPassword />} />
          <Route path='/resetPassword/:token' element={<ResetPassword />} />

          {/* Email Verification Routes */}
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route
            path='/verification-success'
            element={<VerificationSuccess />}
          />
          <Route path='/resend-verification' element={<ResendVerification />} />

          {/* Protected Profile Route - Available to all authenticated users */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Only */}
          <Route
            path='/dashboardv1'
            element={
              <AdminRoute>
                <Dashboardv1 />
              </AdminRoute>
            }
          />

          <Route
            path='/committe'
            element={
              <AdminRoute>
                <CommitteeMemberManagement />
              </AdminRoute>
            }
          />
          <Route
            path='/admin-research'
            element={
              <AdminRoute>
                <AdminResearchView />
              </AdminRoute>
            }
          />

          {/* Protected Routes - Student Only */}
          <Route
            path='/studentmarks'
            element={
              <StudentRoute>
                <MarksManagementPage />
              </StudentRoute>
            }
          />
          <Route
            path='/studentSubmissin'
            element={
              <StudentRoute>
                <StudentResearchSubmission />
              </StudentRoute>
            }
          />
          <Route
            path='/submit-research'
            element={
              <StudentRoute>
                <StudentResearchSubmitForm />
              </StudentRoute>
            }
          />
          <Route
            path='/quality-assurance'
            element={
              <StudentRoute>
                <QualityAssurancePage />
              </StudentRoute>
            }
          />

          {/* Protected Routes - Teacher/Admin Only */}
          <Route
            path='/teachermarks'
            element={
              <TeacherOrAdminRoute>
                <MarksManagementPage />
              </TeacherOrAdminRoute>
            }
          />

          {/* Protected Routes - Committee/Admin Only */}
          <Route
            path='/committee-research'
            element={
              <CommitteeRoute>
                <CommitteeResearchView />
              </CommitteeRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
