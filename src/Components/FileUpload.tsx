import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { devices } from "../Hooks/mediaQuery";

interface IFileUploadProps {
  onChange: (base64: string[]) => void;
  label: string;
  value?: any;
  disabled?: boolean;
}

const Wrapper = styled.div`
  width: 70%;
  padding: 1rem;
  text-align: center;
  border: 3px dotted #715c7d;
  border-radius: 1rem;
  @media (${devices.sm}) {
    width: 40%;
  }
`;

const Title = styled.h1`
  color: white;
`;

const FileUpload: React.FC<IFileUploadProps> = ({
  onChange,
  label,
  value,
  disabled,
}) => {
  const [base64, setBase64] = useState(value);

  const handleDrop = (files: File[]) => {
    // Convert each accepted file to Base64
    const base64Promises = files.map((file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    });

    // Wait for all promises to resolve and update the state with the Base64 data
    Promise.all(base64Promises).then((base64Files) => {
      setBase64((prevFiles: string[]) => [...prevFiles, ...base64Files]);
      // @ts-ignore
      onChange((prevFiles) => [...prevFiles, ...base64Files]);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: undefined,
    onDrop: handleDrop,
    disabled,
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "video/mp4": [],
    },
  });

  return (
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      {base64.length > 0 ? (
        <div>
          {base64.map((file: string) =>
            file.includes("mp4") ? (
              <video controls height="100">
                <source src={file} type="video/mp4" />
              </video>
            ) : (
              <img src={file} height="100" width="100" alt="image" />
            )
          )}
        </div>
      ) : (
        <>
          <Title>{label}</Title>
        </>
      )}
    </Wrapper>
  );
};

export default FileUpload;
