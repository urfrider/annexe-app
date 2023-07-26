import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { useQuery } from "react-query";
import { Wrapper } from "../Components/styledComponents";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6rem;
  flex-direction: column;
`;

const TableHeaderCell = styled(TableCell)`
  background-color: #f0f0f0;
  font-weight: bold;
`;

const TableRowStyled = styled(TableRow)`
  background-color: #ffffff;
`;

const AcceptIcon = styled(CheckIcon)`
  color: #4caf50;
  cursor: pointer;
`;

const DeclineIcon = styled(ClearIcon)`
  color: #f44336;
  cursor: pointer;
`;

const Validation = () => {
  const [storiesData, setStoriesData] = useState<any>(null); // State to hold stories data

  const fetchStories = async () => {
    const snapshot = await getDocs(collection(db, "history"));
    const list = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const posterUrl = await getDownloadURL(ref(storage, data.posterImage)); // get poster URL
      return {
        id: doc.id,
        ...data,
        posterUrl,
        validationStatus: null, // for testing
      };
    });
    const results = await Promise.all(list); // wait for all the URLs to resolve
    setStoriesData(results); // Save data in state
  };

  const { isLoading: storiesLoading } = useQuery("stories", fetchStories);

  // Function to handle validation status change
  const handleValidationChange = (id: any, status: any) => {
    setStoriesData((prevData: any) =>
      prevData.map((story: any) =>
        story.id === id ? { ...story, validationStatus: status } : story
      )
    );
  };

  // Function to accept the story
  const handleAcceptStory = (id: any) => {
    handleValidationChange(id, "accepted");
  };

  // Function to decline the story
  const handleDeclineStory = (id: any) => {
    handleValidationChange(id, "declined");
  };

  return (
    <Wrapper>
      <Container>
        {storiesLoading ? (
          <Loader>
            <ClipLoader color="lightblue" size={80} />
          </Loader>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRowStyled>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableHeaderCell>Poster</TableHeaderCell>
                  <TableHeaderCell>Validation Status</TableHeaderCell>
                </TableRowStyled>
              </TableHead>
              <TableBody>
                {storiesData?.map((story: any) => (
                  <TableRowStyled key={story.id}>
                    <TableCell>{story.id}</TableCell>
                    <TableCell>{story.title}</TableCell>
                    <TableCell>{story.description}</TableCell>
                    <TableCell>
                      <img
                        src={story.posterUrl}
                        alt={story.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </TableCell>
                    <TableCell>
                      {story.validationStatus === "accepted" ? (
                        <AcceptIcon />
                      ) : (
                        <AcceptIcon
                          onClick={() => handleAcceptStory(story.id)}
                        />
                      )}
                      {story.validationStatus === "declined" ? (
                        <DeclineIcon />
                      ) : (
                        <DeclineIcon
                          onClick={() => handleDeclineStory(story.id)}
                        />
                      )}
                    </TableCell>
                  </TableRowStyled>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Wrapper>
  );
};

export default Validation;
