import React from "react";
import styled from "styled-components";

const CustomInput = styled.input`
  width: 40%;
  margin-bottom: 2rem;
  border-radius: 1rem;
  height: 3rem;
  padding: 0.5rem;
  color: black;
  border: 0px;
  outline: 0px;
  &:focus {
    border: 3px solid #715c7d;
  }
`;

interface InputProps {
  placeholder: string;
  value?: string;
  type?: string;
  required: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type,
  disabled,
  required,
  onChange,
}) => {
  return (
    <CustomInput
      disabled={disabled}
      onChange={onChange}
      value={value}
      required
      type={type}
      placeholder={placeholder}
    />
  );
};

export default Input;
