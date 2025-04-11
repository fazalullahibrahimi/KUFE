
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"; // Make sure this file exists
import About from "./pages/About"; // Example additional route
import Login from "./pages/Login";
import AcademicPage from "./pages/AcademicPage";
import Registration from "./pages/Registration";
import ForgatPassword from "./pages/ForgatPassword";
import ResetPassword from "./pages/ResetPassword.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />

        <Route path='/academics' element={<AcademicPage />} />
        <Route path='registration' element={<Registration />} />
        <Route path='/forgotPassword' element={<ForgatPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;

