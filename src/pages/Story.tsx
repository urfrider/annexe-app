import React, { useState } from "react";
import Input from "../Components/Input";
import FileUpload from "../Components/FileUpload";
import { Link } from "react-router-dom";
import {
  FormButton,
  FormContainer,
  FormTitle,
  Textarea,
  Wrapper,
} from "../Components/styledComponents";
import styled from "styled-components";
import { useAuth } from "../firebase/firebaseAuth";
import { User } from "firebase/auth";
import { toast } from "react-hot-toast";

import { uploadImage } from "../firebase/functions";

const ButtonDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #715c7d;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #d2a4ed;
  }

  &:focus {
    outline: none;
  }
`;

function Story() {
  const [title, setTitle] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [description, setDescription] = useState("");
  const [posterImage, setPosterImage] = useState<string[]>([]);

  const user: User | null = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: title,
      organisation: organisation,
      description: description,
      posterImage: [],
      validated: false,
    };
    user ? (data.validated = true) : (data.validated = false);
    uploadImage(posterImage, "stories", organisation, data);
    toast.success("Added successfully");
  };

  return (
    <Wrapper>
      {user && (
        <ButtonDiv>
          <Link to="/annexe-app/validation">
            <Button>Validate Stories</Button>
          </Link>
        </ButtonDiv>
      )}

      <FormContainer onSubmit={onSubmit}>
        <FormTitle>Add your story</FormTitle>
        <Input
          required={true}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Organisation"
          required
          onChange={(e) => setOrganisation(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          required={true}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FileUpload
          value={posterImage}
          onChange={(image) => setPosterImage(image)}
          label="UPLOAD FILES"
        />
        <FormButton>Submit</FormButton>
      </FormContainer>
    </Wrapper>
  );
}

export default Story;
