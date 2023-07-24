import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useMatch, useNavigate } from "react-router-dom";
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

const Search = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  color: white;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const Circle = styled(motion.div)`
  position: absolute;
  background-color: ${(props) => props.theme.red};
  width: 5px;
  height: 5px;
  border-radius: 50%;
  bottom: -10px;
`;

const logoVars = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  },
};

const navVars = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
    Color: "rgba(0,0,0,1)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
};

interface IForm {
  keyword: string;
}

function Header() {
  const navigate = useNavigate();
  const homeMatch = useMatch("/");
  const storyMatch = useMatch("/story");
  const eventMatch = useMatch("/event");
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const navAnimate = useAnimation();
  const { register, handleSubmit } = useForm<IForm>();
  const style = { color: "white", fontSize: "2em" };

  const onValid = (data: IForm) => {
    console.log(data);
    navigate(`/search?keyword=${data.keyword}`);
  };

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
