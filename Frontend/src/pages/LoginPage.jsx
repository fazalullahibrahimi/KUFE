import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const handleLogin = (e, email, password) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
