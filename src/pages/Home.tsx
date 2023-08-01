import { useQueries } from "react-query";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { Wrapper } from "../Components/styledComponents";
import Slides from "../Components/Slides";
import annexeBg from "../assets/annexe-bg.jpg";
import { devices } from "../Hooks/mediaQuery";
import { fetchData } from "../Hooks/api";

const Loader = styled.div`
  display: flex;
  /* position: fixed; */
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

  const queries = useQueries([
    {
      queryKey: "history",
      queryFn: () => fetchData("history"),
    },
    {
      queryKey: "stories",
      queryFn: () => fetchData("stories"),
    },
    {
      queryKey: "events",
      queryFn: () => fetchData("events"),
    },
  ]);

  const isLoading = queries.some((query) => query.isLoading);
  const data = queries.map((query) => query.data);

  const [historyData, storiesData, eventsData] = data;
  // console.log(eventsData);

  return (
    <Wrapper>
      {isLoading ? (
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

          {eventsData && <Slides name="Events" data={eventsData} />}
          {storiesData && <Slides name="Stories" data={storiesData} />}
          {historyData && (
            <Slides
              marginBottom={50}
              name="Art Pieces & Murals"
              data={historyData}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
