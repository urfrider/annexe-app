import { useState } from "react";
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
import { updateDb, deleteDb } from "../firebase/functions";

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
  border-right: 2px solid #715c7d;
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

export interface IStory {
  id: number;
  title: string;
  description: string;
  organisation: string;
  posterImage: string;
  posterUrl: string;
  validated: boolean;
}

const Validation = () => {
  const [storiesData, setStoriesData] = useState<IStory[]>([]); // State to hold stories data

  const fetchStories = async () => {
    const snapshot = await getDocs(collection(db, "stories"));
    const list = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const posterUrl = await getDownloadURL(ref(storage, data.posterImage[0])); // get poster URL
      return {
        id: doc.id,
        ...data,
        posterUrl,
      };
    });
    let results = await Promise.all(list); // wait for all the URLs to resolve
    results = results.filter((story: any) => story.validated === false);
    //@ts-ignore
    setStoriesData(results); // Save data in state
  };

  const { isLoading: storiesLoading } = useQuery("stories", fetchStories);

  const handleAcceptStory = async (id: any) => {
    const userConfirmed = window.confirm("Are you sure you want to accept this story?");

    if (userConfirmed) {
      const updatedData = {
        validated: true,
      };
      await updateDb("stories", id, updatedData);
      setStoriesData((prevStories) => prevStories.filter((story) => story.id !== id));
    }
  };

  const handleDeclineStory = async (id: any) => {
    const userConfirmed = window.confirm("Are you sure you want to decline this story?");

    if (userConfirmed) {
      await deleteDb("stories", id);
      setStoriesData((prevStories) => prevStories.filter((story) => story.id !== id));
    }
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
                {storiesData?.map((story: IStory) => (
                  <TableRowStyled key={story.id}>
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
                        <AcceptIcon
                          onClick={() => handleAcceptStory(story.id)}
                        />

                        <DeclineIcon
                          onClick={() => handleDeclineStory(story.id)}
                        />
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
