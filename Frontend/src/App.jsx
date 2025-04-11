
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"; // Make sure this file exists
import About from "./pages/About"; // Example additional route
import Login from "./pages/Login";
import AcademicPage from "./pages/AcademicPage";
import Registration from "./pages/Registration";
import ForgatPassword from "./pages/ForgatPassword";
import ResetPassword from "./pages/ResetPassword.jsx";
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"

<<<<<<< HEAD
import ResearchPage from "./pages/ResearchPage.jsx";
=======
>>>>>>> fcb8ccbe8ed4dd3ec3874a57ce683175734aa676

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/academics' element={<AcademicPage />} />
        <Route path='/research' element={<ResearchPage />} />
        <Route path='registration' element={<Registration />} />
        <Route path='/forgotPassword' element={<ForgatPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

      </Routes>
    </Router>
  );
}

export default App;

