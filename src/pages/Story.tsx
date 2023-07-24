import React, { useState } from "react";
import Input from "../Components/Input";
import ImageUpload from "../Components/ImageUpload";
import {
  FormButton,
  FormContainer,
  FormTitle,
  Textarea,
  Wrapper,
} from "../Components/styledComponents";

function Story() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterImage, setPosterImage] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = {
      title: title,
      description: description,
      posterImage: posterImage,
    };
    console.log(data);
  };

  return (
    <Wrapper>
      <FormContainer>
        <FormTitle>Add your story</FormTitle>
        <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <ImageUpload
          value={posterImage}
          onChange={(image) => setPosterImage(image)}
          label="Upload poster image"
        />
        <FormButton onClick={onSubmit}>Submit</FormButton>
      </FormContainer>
    </Wrapper>
  );
}

export default Story;
