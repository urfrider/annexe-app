import { useQuery } from "react-query";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { Wrapper } from "../Components/styledComponents";
import { getMovies, IGetMoviesResult } from "../Hooks/api";
import { db, storage } from "../firebase/firebaseConfig";
import Slides from "../Components/Slides";
import annexeBg from "../assets/annexe-bg.jpg";
import { devices } from "../Hooks/mediaQuery";

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #fffa65;
  @media (${devices.sm}) {
    font-size: 3rem;
  }
  @media (${devices.md}) {
    font-size: 4.5rem;
  }
`;

const Overview = styled.p`
  font-size: 1rem;
  width: 60%;
  @media (${devices.sm}) {
    font-size: 1.2rem;
  }
  @media (${devices.md}) {
    font-size: 1.5rem;
  }
`;

function Home() {

  const fetchData = async (collectionName : string) => {
    const snapshot = await getDocs(collection(db, collectionName));
    const list = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const posterUrl = await getDownloadURL(ref(storage, data.posterImage)); // get poster URL
      return {
        id: doc.id,
        ...data,
        posterUrl,
      };
    });
    const results = await Promise.all(list); // wait for all the URLs to resolve
    return results;
  };

  const { isLoading: historyLoading, data: historyData } = useQuery(
    "history",
    async () => fetchData("history")
  );

  const { isLoading: storiesLoading, data: storiesData } = useQuery(
    "stories",
    async () => fetchData("stories")
  );

  const { isLoading: eventsLoading, data: eventsData } = useQuery(
    "events",
    async () => fetchData("events")
  );


  return (
    <Wrapper>
      {(historyLoading&&storiesLoading&&eventsLoading) ? (
        <Loader>
          <ClipLoader color="lightblue" size={80} />
        </Loader>
      ) : (
        <>
          <Banner bgPhoto={annexeBg}>
            <Title>Welcome to Annexe Communities</Title>
            <Overview>
              Annexe Communities is a community-led development trust working
              with people living in central and west Glasgow. We work from our
              healthy living centre base in Partick.
            </Overview>
          </Banner>

          

          <Slides name="Events" data={eventsData as any} />

          <Slides name="Stories" data={storiesData as any} />

          <Slides name="History" data={historyData as any} />

          
        </>
      )}
    </Wrapper>
  );
}

export default Home;
