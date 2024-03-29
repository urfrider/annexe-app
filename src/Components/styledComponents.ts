import styled from "styled-components";
import { devices } from "../Hooks/mediaQuery";

const Wrapper = styled.div`
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Textarea = styled.textarea`
  width: 70%;
  margin-bottom: 2rem;
  border-radius: 1rem;
  height: 10rem;
  resize: none;
  padding: 1rem;
  color: black;
  border: 0px;
  outline: 0px;
  &:focus {
    border: 3px solid #715c7d;
  }
  @media (${devices.sm}) {
    width: 40%;
  }
`;

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  flex-direction: column;
  width: 100%;
`;

const FormButton = styled.button`
  margin-top: 3rem;
  padding: 1rem;
  font-size: 1rem;
  width: 40%;
  border-radius: 2rem;
  &:hover {
    background-color: #715c7d;
    transition: linear 0.2s;
    color: white;
  }
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  @media (${devices.sm}) {
    font-size: 2.5rem;
  }
`;

export { Wrapper, Textarea, FormContainer, FormButton, FormTitle };
