import React, { useState } from 'react';
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
  width: 250px;
`;

const Input = styled.input`
  margin-top: 5px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const LoggedInMessage = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("success");
      setIsLoggedIn(true);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <Wrapper>
        <LoggedInMessage>
          <div>User has been logged in.</div>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </LoggedInMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Label>
          Email:
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Label>
        <Label>
          Password:
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
        <SubmitButton type="submit">Login</SubmitButton>
      </LoginForm>
    </Wrapper>
  );
};

export default Login;