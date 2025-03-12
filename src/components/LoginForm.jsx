// src/components/LoginForm.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => onSubmit(e, email, password)}
      className='bg-white p-6 rounded-lg shadow-md w-80'
    >
      <h2 className='text-lg font-semibold mb-4'>Login</h2>
      <InputField
        label='Email'
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label='Password'
        type='password'
        placeholder='Enter password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button label='Login' type='submit' variant='primary' />
    </form>
  );
};

export default LoginForm;
