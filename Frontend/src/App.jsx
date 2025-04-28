import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"; // Make sure this file exists

import About from "./pages/AboutPage.jsx"; // Example additional route

import Login from "./pages/Login";
import AcademicPage from "./pages/AcademicPage";
import Registration from "./pages/Registration";
import ForgatPassword from "./pages/ForgatPassword";
import ResetPassword from "./pages/ResetPassword.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AnnouncementsEventsPage from "./pages/AnnouncementsEventsPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Dashboardv1 from "./pages/Dashboardv1.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import VerificationSuccess from "./pages/VerificationSuccess.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import FacultyDirectory from "./pages/FacultyDirectory.jsx";
import StudentResearchSubmission from "./pages/StudentResearchSubmission.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/academics' element={<AcademicPage />} />
        <Route path='/research' element={<ResearchPage />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/forgotPassword' element={<ForgatPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
        <Route path='/courses' element={<CoursesPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/anounce' element={<AnnouncementsEventsPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboardv1' element={<Dashboardv1 />} />
        <Route path='/dashboardv1' element={<Dashboardv1 />} />
        <Route path='/facultydirectory' element={<FacultyDirectory />} />

        {/* New email verification routes */}
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/verification-success' element={<VerificationSuccess />} />
        <Route path='/resend-verification' element={<ResendVerification />} />
        <Route path='/studenSubmit' element={<StudentResearchSubmission />} />
      </Routes>
    </Router>
  );
}

export default App;
