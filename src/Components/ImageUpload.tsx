import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

interface IIMageUploadProps {
  onChange: (base64: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
}

const Wrapper = styled.div`
  width: 40%;
  padding: 1rem;
  text-align: center;
  border: 3px dotted #715c7d;
  border-radius: 1rem;
`;

const ImageUpload: React.FC<IIMageUploadProps> = ({
  onChange,
  label,
  value,
  disabled,
}) => {
  const [base64, setBase64] = useState(value);
  const handleChange = (base64: string) => {
    onChange(base64);
  };

  const handleDrop = (files: any) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      setBase64(event.target.result);
      handleChange(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      {base64 ? (
        <div className="flex items-center justify-center">
          <img src={base64} height="100" width="100" alt="Uploaded image" />
        </div>
      ) : (
        <p className="text-white">{label}</p>
      )}
    </Wrapper>
  );
};

export default ImageUpload;
