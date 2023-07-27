import { useQuery } from "react-query";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { Wrapper } from "../Components/styledComponents";
import Slides, { IData } from "../Components/Slides";
import annexeBg from "../assets/annexe-bg.jpg";
import { devices } from "../Hooks/mediaQuery";
import { fetchHistory } from "../Hooks/api";

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
  const { isLoading: historyLoading, data: historyData } = useQuery<IData[]>(
    "history",
    //@ts-ignore
    fetchHistory
  );

  console.log(historyData);

  return (
    <Wrapper>
      {historyLoading ? (
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

          <Slides name="History" data={historyData as IData[]} />

          {/* <Slides name="Events" data={historyData} />

          <Slides name="Stories" data={historyData} /> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
