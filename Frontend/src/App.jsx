import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Make sure this file exists
import About from "./pages/About"; // Example additional route
import LoginPage from "./pages/LoginPage";
import AcademicPage from "./pages/AcademicPage";
// import Register from "./pages/";
// import ForgotPassword from "./pages/ForgotPassword";


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/academics' element={<AcademicPage />} />
        {/* <Route path='/register' element={<Register />} /> */}
        {/* <Route path='/forgotpassword' element={<ForgotPassword />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
