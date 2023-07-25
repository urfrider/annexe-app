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
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { devices } from "../Hooks/mediaQuery";

const ToggleButton = styled.div<{ isEvent: boolean }>`
  display: flex;
  width: 50%;
  border: 1px solid #715c7d;
  margin-bottom: 3rem;
  height: 3rem;
  border-radius: 0.6rem;
  @media (${devices.sm}) {
    width: 30%;
  }
  .event {
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 1rem;
    height: 100%;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    background-color: ${(props) =>
      props.isEvent === true ? "#715c7d" : "none"};
    transition: linear 0.3s;
    &:hover {
      color: ${(props) => (props.isEvent === true ? "none" : "#715c7d")};
    }
  }
  .history {
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 1rem;
    height: 100%;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    background-color: ${(props) =>
      props.isEvent === true ? "none" : "#715c7d"};
    transition: linear 0.3s;
    &:hover {
      color: ${(props) => (props.isEvent === true ? "#715c7d" : "none")};
    }
  }
`;

function Event() {
  const [event, setEvent] = useState(true);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [posterImage, setPosterImage] = useState("");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = {
      title: title,
      organization: organization,
      description: description,
      posterImage: posterImage,
    };
    console.log(data);
    toast.success("Added successfully");
  };

  return (
    <Wrapper>
      <FormContainer onSubmit={onSubmit}>
        <ToggleButton isEvent={event}>
          <div onClick={() => setEvent(true)} className="event">
            Event
          </div>
          <div onClick={() => setEvent(false)} className="history">
            History
          </div>
        </ToggleButton>
        <FormTitle>
          {event == true ? "Add your event" : "Add your history"}
        </FormTitle>
        <Input
          required
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Organization"
          required
          onChange={(e) => setOrganization(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          required={true}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ImageUpload
          value={posterImage}
          onChange={(image) => setPosterImage(image)}
          label="Upload poster image"
        />
        <FormButton>Submit</FormButton>
      </FormContainer>
    </Wrapper>
  );
}

export default Event;
