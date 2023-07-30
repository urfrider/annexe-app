import React, { useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useAuth } from "../firebase/firebaseAuth";
import { User } from "firebase/auth";
import { motion } from "framer-motion";
import annexeLogo from "../assets/annexe-logo.png";
import useLoginModal from "../Hooks/useLoginModal";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-hot-toast";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  flex-direction: column;
`;

const LoginForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  background-color: black;
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
  border: 0px;
  outline: 0px;
  &:focus {
    border: 2px solid #715c7d;
  }
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

const Title = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Image = styled(motion.img)`
  height: 4rem;
  margin-bottom: 2rem;
`;

const Close = styled.span`
  transition: linear 0.2s;
  &:hover {
    color: #715c7d;
  }
`;

const LoginModal = () => {
  const user: User | null = useAuth();
  console.log(user);
  const loginModal = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginModal.onClose();
      toast.success("Login Successfully");
    } catch (error) {
      console.log("Error:", error);
      toast.error("Invalid email or password");
    } finally {
    }
  };

  const handleClose = () => {
    loginModal.onClose();
  };

  if (!loginModal.isOpen) return null;

  return (
    <Wrapper>
      <Image src={annexeLogo} alt="Annexe Logo" layoutId="logo" />
      <LoginForm layoutId="login" onSubmit={handleSubmit}>
        <Title>
          Log in to Annexe
          <Close onClick={handleClose}>
            <AiOutlineClose />
          </Close>
        </Title>
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

export default LoginModal;
