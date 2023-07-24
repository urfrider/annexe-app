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
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type,
  disabled,
  onChange,
}) => {
  return (
    <CustomInput
      // className="w-full p-4 text-lg bg-black border-2 border-neutral-800 rounded-md
      // outline-none text-white focus:border-sky-500 focus:border-2 transition
      // disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={disabled}
      onChange={onChange}
      value={value}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default Input;
