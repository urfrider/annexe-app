import React, { useState } from "react";
import styled from "styled-components";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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

const Slider = styled.div`
  position: relative;
  width: 85%;
  top: -100px;
  margin: 5px;
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

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

const style = { color: "white", fontSize: "2em" };

const Slides = (props: any) => {
  const [left, setLeft] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const offset = 3;
  const navigate = useNavigate();
  const dataMatch = useMatch("/data/:dataId");
  console.log(dataMatch);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    setLeft(false);
    if (props.data) {
      if (leaving) return;
      toggleLeaving();
      const totalData = props.data.length;
      const totalIndex = Math.floor(totalData / offset);
      setIndex((prev) => (prev === totalIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setLeft(true);
    if (props.data) {
      if (leaving) return;
      toggleLeaving();
      const totalData = props.data.length;
      const totalIndex = Math.floor(totalData / offset);
      setIndex((prev) => (prev === 0 ? totalIndex : prev - 1));
    }
  };

  const onBoxClick = async (dataId: number) => {
    // const selected = await props.data?.find((data: any) => data.id == dataId);
    // setSelectedData(selected);
    // console.log(selectedData);
    navigate(`data/${dataId}`);
  };

  const overlayOnClick = () => {
    navigate(-1);
  };

  const clickedData =
    dataMatch?.params.dataId &&
    props.data?.find((data: any) => data.id + "" === dataMatch.params.dataId);
  console.log(clickedData);

  return (
    <>
      <SliderWrapper>
        <HeaderTitle>{props.name}</HeaderTitle>
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
              {props.data
                ?.slice(index * offset, index * offset + offset)
                .map((data: any) => (
                  <Box
                    onClick={() => {
                      onBoxClick(data.id);
                    }}
                    layoutId={data.id + ""}
                    variants={boxVars}
                    whileHover="hover"
                    initial="normal"
                    transition={{ type: "tween" }}
                    key={data.id}
                    bgPhoto={data.posterUrl}
                  >
                    <Detail variants={detailVars}>
                      <h4>{data.title}</h4>
                    </Detail>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <BiRightArrow style={style} onClick={increaseIndex} />
      </SliderWrapper>

      <AnimatePresence>
        {dataMatch && (
          <>
            <Overlay
              onClick={overlayOnClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <MovieDetail
              style={{ top: 50 }}
              layoutId={dataMatch.params.dataId + ""}
            >
              {clickedData && (
                <>
                  <MovieCover
                    src={clickedData.posterUrl}
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent)`,
                    }}
                  />
                  <MovieTitle>{clickedData.title}</MovieTitle>
                  <MovieOverview>{clickedData.description}</MovieOverview>
                </>
              )}
            </MovieDetail>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Slides;
