import React, { useState } from "react";
import Input from "../Components/Input";
import ImageUpload from "../Components/ImageUpload";
import styled from "styled-components";

const Wrapper = styled.div`
  /* background: black; */
  height: 100%;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Textarea = styled.textarea`
  width: 40%;
  margin-bottom: 2rem;
  border-radius: 1rem;
  height: 3rem;
  resize: none;
  padding: 1rem;
  color: black;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  flex-direction: column;
  width: 100%;
`;

function Event() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterImage, setPosterImage] = useState("");

  return (
    <Wrapper>
      <Container>
        <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Description"
          onChange={(e) => setTitle(e.target.value)}
        />
        <ImageUpload
          value={posterImage}
          onChange={(image) => setPosterImage(image)}
          label="Upload poster image"
        />
      </Container>
    </Wrapper>
  );
}

export default Event;
