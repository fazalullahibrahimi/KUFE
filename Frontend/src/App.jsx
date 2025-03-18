import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Make sure this file exists
import About from "./pages/About"; // Example additional route
import Registration from './pages/Registration';
import Login from "./pages/Login";
import ForgotPassword from './pages/ForgatPassword';
import ResetPassword from './pages/ResesPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/forgatPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
