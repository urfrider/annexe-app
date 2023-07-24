import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../Hooks/api";
import { makeImagePath } from "../Hooks/utils";
import { useMatch, useNavigate } from "react-router-dom";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import useMediaQuery from "../Hooks/useMediaQuery";
import { Wrapper } from "../Components/styledComponents";
import { ClipLoader } from "react-spinners";

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

const Slider = styled.div`
  position: relative;
  width: 85%;
  top: -100px;
  margin: 5px;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  width: 100%;
  padding: 20px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Detail = styled(motion.div)`
  padding: 10px;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 1.2rem;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieDetail = styled(motion.div)`
  position: fixed;
  background-color: ${(props) => props.theme.black.lighter};
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

const MovieCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
`;

const MovieTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const MovieOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-bottom: 350px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  top: -130px;
  left: 60px;
`;

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,
    scale: 1.3,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};

const detailVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};

const rightVars = {
  hidden: {
    x: window.innerWidth - 5,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -window.innerWidth + 5,
    opacity: 0,
  },
};

const leftVars = {
  hidden: {
    x: -window.innerWidth + 5,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: window.innerWidth - 5,
    opacity: 0,
  },
};

function Home() {
  const isGTMediumScreen = useMediaQuery("(min-width: 1060px)");
  const navigate = useNavigate();
  const offset = 6;
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [left, setLeft] = useState(false);
  const movieMatch = useMatch("/movies/:movieId");
  console.log(movieMatch);
  const increaseIndex = () => {
    setLeft(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const totalIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === totalIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setLeft(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const totalIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? totalIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClick = (movieId: number) => {
    navigate(`movies/${movieId}`);
  };
  const overlayOnClick = () => {
    navigate(-1);
  };
  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id + "" === movieMatch.params.movieId);
  console.log(clickedMovie);
  const style = { color: "white", fontSize: "2em" };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <ClipLoader color="lightblue" size={80} />
        </Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>Welcome to The Annexe Community</Title>
            <Overview>
              Annexe Communities is a community-led development trust working
              with people living in central and west Glasgow. We work from our
              healthy living centre base in Partick.
            </Overview>
          </Banner>

          <SliderWrapper>
            <HeaderTitle>Event</HeaderTitle>
            <BiLeftArrow style={style} onClick={decreaseIndex} />
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={left ? leftVars : rightVars}
                  animate="visible"
                  initial="hidden"
                  exit="exit"
                  key={index}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data?.results
                    .slice(1)
                    .slice(index * offset, index * offset + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClick(movie.id);
                        }}
                        layoutId={movie.id + ""}
                        variants={boxVars}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Detail variants={detailVars}>
                          <h4>{movie.title}</h4>
                        </Detail>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <BiRightArrow style={style} onClick={increaseIndex} />
          </SliderWrapper>

          <SliderWrapper>
            <HeaderTitle>History</HeaderTitle>
            <BiLeftArrow style={style} onClick={decreaseIndex} />
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={left ? leftVars : rightVars}
                  animate="visible"
                  initial="hidden"
                  exit="exit"
                  key={index}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data?.results
                    .slice(1)
                    .slice(index * offset, index * offset + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClick(movie.id);
                        }}
                        layoutId={movie.id + ""}
                        variants={boxVars}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Detail variants={detailVars}>
                          <h4>{movie.title}</h4>
                        </Detail>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <BiRightArrow style={style} onClick={increaseIndex} />
          </SliderWrapper>

          <SliderWrapper style={{ marginBottom: 0 }}>
            <HeaderTitle>Story</HeaderTitle>
            <BiLeftArrow style={style} onClick={decreaseIndex} />
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={left ? leftVars : rightVars}
                  animate="visible"
                  initial="hidden"
                  exit="exit"
                  key={index}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data?.results
                    .slice(1)
                    .slice(index * offset, index * offset + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClick(movie.id);
                        }}
                        layoutId={movie.id + ""}
                        variants={boxVars}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Detail variants={detailVars}>
                          <h4>{movie.title}</h4>
                        </Detail>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <BiRightArrow style={style} onClick={increaseIndex} />
          </SliderWrapper>

          <AnimatePresence>
            {movieMatch && (
              <>
                <Overlay
                  onClick={overlayOnClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <MovieDetail
                  style={{ top: 50 }}
                  layoutId={movieMatch.params.movieId + ""}
                >
                  {clickedMovie && (
                    <>
                      <MovieCover
                        src={makeImagePath(clickedMovie.backdrop_path, "w500")}
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent)`,
                        }}
                      />
                      <MovieTitle>{clickedMovie.title}</MovieTitle>
                      <MovieOverview>{clickedMovie.overview}</MovieOverview>
                    </>
                  )}
                </MovieDetail>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
