import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { Wrapper } from "../Components/styledComponents";
import { getMovies, IGetMoviesResult } from "../Hooks/api";
import { makeImagePath } from "../Hooks/utils";
import { db, storage } from "../firebase/firebaseConfig";
import Slides from "../Components/Slides";

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
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const { isLoading: historyLoading, data: historyData } = useQuery(
    "history",
    async () => {
      const snapshot = await getDocs(collection(db, "history"));
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
    }
  );
  console.log(historyData);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <ClipLoader color="lightblue" size={80} />
        </Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>Welcome to The Annexe Communities</Title>
            <Overview>
              Annexe Communities is a community-led development trust working
              with people living in central and west Glasgow. We work from our
              healthy living centre base in Partick.
            </Overview>
          </Banner>

          <Slides name="History" data={historyData} />

          {/* <Slides name="Events" data={historyData} />

          <Slides name="Stories" data={historyData} /> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
