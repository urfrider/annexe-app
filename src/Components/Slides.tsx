import { useEffect, useState } from "react";
import styled from "styled-components";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { devices } from "../Hooks/mediaQuery";
import { BsFillMicFill } from "react-icons/bs";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

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

const WorkDetail = styled(motion.div)`
  position: fixed;
  background-color: ${(props) => props.theme.black.lighter};
  width: 70vw;
  height: 80vh;
  overflow-y: scroll;
  top: 70px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: auto;
  background-color: #3d3d3d;
  z-index: 1;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 8px; /* width of the entire scrollbar */
  }
  ::-webkit-scrollbar-track {
    background: #3d3d3d; /* color of the tracking area */
  }
  ::-webkit-scrollbar-thumb {
    background-color: #715c7d; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
  }
  @media (${devices.sm}) {
    width: 50vw;
  }
  @media (${devices.md}) {
    width: 40vw;
  }
`;

const WorkCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 18rem;
`;

const WorkRowWrapper = styled.div`
  height: 18rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
`;

const WorkRow = styled(motion.div)`
  width: 100%;
  position: absolute;
`;

const WorkTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 1.5rem;
  position: relative;
  top: -5rem;
  color: #fffa65;
  @media (${devices.sm}) {
    font-size: 1.8rem;
  }
  @media (${devices.md}) {
    font-size: 2rem;
  }
`;

const WorkOverview = styled.p`
  padding: 20px;
  width: 95%;
  position: relative;
  top: -5rem;
  color: ${(props) => props.theme.white.lighter};

  @media (${devices.md}) {
    font-size: 1rem;
  }
`;

const MicLogo = styled.div`
  position: absolute;
  z-index: 10;
  right: 0.5rem;
  display: flex;
  cursor: pointer;
  border: 1px solid white;
  justify-content: flex-end;
  width: min-content;
  border-radius: 50%;
  padding: 5px;
`;

const VideoCover = styled.video`
  width: 100%;
  height: 18rem;
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

const vars = {
  hidden: (direction: number) => {
    return {
      x: direction > 0 ? window.innerWidth - 5 : -window.innerWidth + 5,
      opacity: 0,
    };
  },
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction > 0 ? -window.innerWidth + 5 : window.innerWidth - 5,
      opacity: 0,
    };
  },
};

const workVars = {
  hidden: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    };
  },
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    };
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

const style = { color: "white", fontSize: "2em", cursor: "pointer" };

const workStyle = {
  cursor: "pointer",
  zIndex: 10,
  color: "white",
  fontSize: "1.5em",
  margin: 10,
};

export interface IData {
  id: number;
  title: string;
  description: string;
  organisation: string;
  posterImage: string[];
  posterUrl: string;
}

interface IProps {
  data: IData[];
  name: string;
}

const Slides = (props: IProps) => {
  const [direction, setDirection] = useState(0);
  const [index, setIndex] = useState(0);
  const [workIndex, setWorkIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [workLeaving, setWorkLeaving] = useState(false);

  const [clickedData, setClickedData] = useState<IData>({
    id: 0,
    title: "",
    description: "",
    organisation: "",
    posterImage: [],
    posterUrl: "",
  });
  const offset = 3;
  const workCoverOffset = 1;
  const [imageUrl, setImageUrl] = useState<any>();
  async function fetchImage() {
    setImageUrl([]);
    clickedData?.posterImage.map(async (img) => {
      const url = await getImageUrl(img); // Assuming data is the prop passed to your component containing the image data
      setImageUrl((prev: any) => [...prev, url]);
    });
  }

  // Fetch the image URL when the component mounts or when the data changes
  useEffect(() => {
    fetchImage();
  }, [clickedData]); // Make sure to include data in the dependency array if it can change

  const navigate = useNavigate();
  const onClick = () => console.log("CLICKEND");

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const toggleWorkLeaving = () => setWorkLeaving((prev) => !prev);

  async function getImageUrl(imagePath: string): Promise<string> {
    try {
      const imageRef = ref(storage, imagePath);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error getting image URL:", error);
      return ""; // Return a default or placeholder URL in case of an error
    }
  }

  const increaseIndex = () => {
    setDirection(1);
    if (props.data) {
      if (leaving) return;
      toggleLeaving();
      const totalData = props.data.length;
      const totalIndex = Math.ceil(totalData / offset) - 1;
      setIndex((prev) => (prev === totalIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    setDirection(-1);
    if (props.data) {
      if (leaving) return;
      toggleLeaving();
      const totalData = props.data.length;
      const totalIndex = Math.ceil(totalData / offset) - 1;
      setIndex((prev) => (prev === 0 ? totalIndex : prev - 1));
    }
  };

  const workCoverIncreaseIndex = async (images: any) => {
    setDirection(1);

    if (workLeaving) return;
    toggleWorkLeaving();
    const totalImages = images.length;
    const totalIndex = Math.ceil(totalImages / workCoverOffset) - 1;
    setWorkIndex((prev) => (prev === totalIndex ? 0 : prev + 1));
  };

  const workCoverDecreaseIndex = (images: any) => {
    setDirection(-1);

    if (workLeaving) return;
    toggleWorkLeaving();
    const totalImages = images.length;
    const totalIndex = Math.ceil(totalImages / workCoverOffset) - 1;
    setWorkIndex((prev) => (prev === 0 ? totalIndex : prev - 1));
  };

  const onBoxClick = async (dataId: number) => {
    const foundData: IData | undefined = props.data.find(
      (data: IData) => data.id === dataId
    );
    if (foundData) {
      setClickedData(foundData);
    }
    navigate(`data/${dataId}`);
  };

  const overlayOnClick = () => {
    setClickedData(() => ({
      id: 0,
      title: "",
      description: "",
      organisation: "",
      posterImage: [],
      posterUrl: "",
    }));
    navigate(-1);
  };

  return (
    <>
      <SliderWrapper>
        <HeaderTitle>{props.name}</HeaderTitle>
        <BiLeftArrow style={style} onClick={decreaseIndex} />
        <Slider>
          <AnimatePresence
            initial={false}
            onExitComplete={toggleLeaving}
            custom={direction}
          >
            <Row
              variants={vars}
              custom={direction}
              animate="visible"
              initial="hidden"
              exit="exit"
              key={index}
              transition={{ type: "tween", duration: 1 }}
            >
              {props.data
                ?.slice(index * offset, index * offset + offset)
                .map((data: IData) => (
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
        {clickedData?.id !== 0 && (
          <>
            <Overlay
              onClick={overlayOnClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <WorkDetail layoutId={clickedData.id + ""}>
              {clickedData.id && (
                <>
                  <WorkRowWrapper>
                    {clickedData.posterImage.length > 1 ? (
                      <>
                        <AnimatePresence
                          initial={false}
                          onExitComplete={toggleWorkLeaving}
                          custom={direction}
                        >
                          <AiOutlineLeft
                            onClick={() =>
                              workCoverDecreaseIndex(clickedData.posterImage)
                            }
                            style={workStyle}
                          />
                          <AiOutlineRight
                            onClick={() =>
                              workCoverIncreaseIndex(clickedData.posterImage)
                            }
                            style={workStyle}
                          />
                          <WorkRow
                            variants={workVars}
                            custom={direction}
                            animate="visible"
                            initial="hidden"
                            exit="exit"
                            key={workIndex}
                            transition={{ type: "tween", duration: 1 }}
                          >
                            {clickedData.posterImage
                              ?.slice(
                                workIndex * workCoverOffset,
                                workIndex * workCoverOffset + workCoverOffset
                              )
                              .map((data: string) => (
                                <>
                                  {data.includes("mp4") ? (
                                    <VideoCover controls>
                                      <source
                                        src={imageUrl[workIndex]}
                                        type="video/mp4"
                                      />
                                    </VideoCover>
                                  ) : (
                                    <WorkCover
                                      src={imageUrl[workIndex]}
                                      style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent)`,
                                      }}
                                    />
                                  )}
                                </>
                              ))}
                          </WorkRow>
                        </AnimatePresence>
                      </>
                    ) : (
                      <WorkCover
                        src={clickedData.posterUrl}
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent)`,
                        }}
                      />
                    )}
                  </WorkRowWrapper>
                  <MicLogo onClick={onClick}>
                    <BsFillMicFill style={{ cursor: "pointer" }} />
                  </MicLogo>
                  <WorkTitle>{clickedData.title}</WorkTitle>
                  <WorkOverview>{clickedData.description}</WorkOverview>
                </>
              )}
            </WorkDetail>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Slides;
