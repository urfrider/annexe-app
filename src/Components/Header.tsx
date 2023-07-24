import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect } from "react";
import { Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineUser } from "react-icons/ai";
import annexeLogo from "../assets/annexe-logo.png";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  z-index: 100;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  height: 2.5rem;
`;

const Logo = styled.div`
  margin-right: 4rem;
  width: 95px;
  height: 25px;
  color: white;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.div)`
  position: absolute;
  background-color: ${(props) => props.theme.red};
  width: 5px;
  height: 5px;
  border-radius: 50%;
  bottom: -10px;
`;

const navVars = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
    Color: "rgba(0,0,0,1)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
};

function Header() {
  const homeMatch = useMatch("/");
  const storyMatch = useMatch("/story");
  const eventMatch = useMatch("/event");
  const { scrollY } = useScroll();
  const navAnimate = useAnimation();
  const style = { color: "white", fontSize: "2em" };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimate.start("scroll");
      } else {
        navAnimate.start("top");
      }
    });
  }, [scrollY]);
  return (
    <Nav variants={navVars} animate={navAnimate} initial="top">
      <Col>
        <Logo>
          <Image src={annexeLogo} alt="Annexe Logo" />
        </Logo>
        <Items>
          <Link to="/">
            <Item>Home {homeMatch && <Circle layoutId="circle" />}</Item>
          </Link>
        </Items>
        <Items>
          <Link to="/story">
            <Item>Add Story {storyMatch && <Circle layoutId="circle" />}</Item>
          </Link>
        </Items>
        <Items>
          <Link to="/event">
            <Item>Add Event {eventMatch && <Circle layoutId="circle" />}</Item>
          </Link>
        </Items>
      </Col>
      <Col>
        <Link to="/login">
          <AiOutlineUser style={style} />
        </Link>
      </Col>
    </Nav>
  );
}

export default Header;
