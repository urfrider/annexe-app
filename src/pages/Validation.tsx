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
import { devices } from "../Hooks/mediaQuery";

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ContainerWrapper = styled(Wrapper)`
  margin-top: 6rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
  @media (${devices.smd}) {
    width: 80%;
  }
`;

const TableHeaderCell = styled(TableCell)`
  font-size: 2rem;
  background-color: #715c7d;
  font-weight: bold;
  color: white;
`;

const TableRowStyled = styled(TableRow)`
  background-color: #ffffff;
`;

const AcceptIcon = styled(CheckIcon)`
  margin-right: 10px;
  color: white;
  background-color: green;
  border-radius: 50%;
  cursor: pointer;
`;

const DeclineIcon = styled(ClearIcon)`
  color: white;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
`;

const Cell = styled(TableCell)`
  border-right: 2px dotted #715c7d;
`;

const Header = styled.h1`
  color: white;
  font-weight: bold;
  font-size: 1rem;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
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
    <ContainerWrapper>
      {storiesLoading ? (
        <Loader>
          <ClipLoader color="lightblue" size={80} />
        </Loader>
      ) : (
        <Container>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRowStyled>
                  {/* <TableHeaderCell>ID</TableHeaderCell> */}
                  <TableHeaderCell>
                    <Header>Title</Header>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Header>Description</Header>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Header>Poster</Header>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Header>Validation Status</Header>
                  </TableHeaderCell>
                </TableRowStyled>
              </TableHead>
              <TableBody>
                {storiesData?.map((story: any) => (
                  <TableRowStyled key={story.id}>
                    {/* <TableCell>{story.id}</TableCell> */}
                    <Cell>{story.title}</Cell>
                    <Cell>{story.description}</Cell>
                    <Cell>
                      <img
                        src={story.posterUrl}
                        alt={story.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </Cell>
                    <TableCell>
                      <ButtonWrapper>
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
                      </ButtonWrapper>
                    </TableCell>
                  </TableRowStyled>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </ContainerWrapper>
  );
};

export default Validation;
