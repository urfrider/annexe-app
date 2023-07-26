import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect } from "react";
import { Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineUser } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import annexeLogo from "../assets/annexe-logo.png";
import useLoginModal from "../Hooks/useLoginModal";
import { useAuth } from "../firebase/firebaseAuth";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase/firebaseConfig";
import { devices } from "../Hooks/mediaQuery";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 0.9rem;
  padding: 1rem 3rem;
  color: white;
  z-index: 100;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled(motion.img)`
  height: 2rem;
  @media (${devices.sm}) {
    height: 2.5rem;
  }
`;

const Logo = styled.div`
  margin-right: 1.5rem;
  width: 95px;
  height: 25px;
  color: white;
  @media (${devices.sm}) {
    margin-right: 4rem;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  font-size: 0.8rem;
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
  @media (${devices.sm}) {
    font-size: 1rem;
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

const LoginButton = styled(motion.div)`
  font-size: 0.8rem;
  cursor: pointer;
  @media (${devices.sm}) {
    font-size: 1rem;
  }
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
  const user: any = useAuth();
  const homeMatch = useMatch("/");
  const storyMatch = useMatch("/story");
  const eventMatch = useMatch("/event");
  const { scrollY } = useScroll();
  const navAnimate = useAnimation();
  const style = { color: "white", fontSize: "2em" };
  const loginModal = useLoginModal();

  const handleOpen = () => {
    loginModal.onOpen();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      loginModal.onClose();
    } catch (error) {
      console.log("Error:", error);
    } finally {
      toast.success("Logout Successfully");
    }
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
          <Image src={annexeLogo} alt="Annexe Logo" layoutId="logo" />
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
        {user && (
          <Items>
            <Link to="/event">
              <Item>
                Add Event {eventMatch && <Circle layoutId="circle" />}
              </Item>
            </Link>
          </Items>
        )}
      </Col>
      {user ? (
        <Col>
          <LoginButton layoutId="login">
            <BiLogOut onClick={handleLogout} style={style} />
          </LoginButton>
        </Col>
      ) : (
        <Col>
          <LoginButton layoutId="login">
            <AiOutlineUser onClick={handleOpen} style={style} />
          </LoginButton>
        </Col>
      )}
    </Nav>
  );
}

export default Header;
