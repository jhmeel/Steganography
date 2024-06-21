import React from "react";
import styled from "styled-components";
import { AiFillGithub } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BiChat } from "react-icons/bi";
 
const Header = () => {
  const navigate = useNavigate();
  return (
    <HeaderRenderer>
      <h3 style={{display:'flex',alignItems:"center",gap:'5px'}}>
        <BiChat fontSize={30} onClick={() => navigate("/")} /> Steg
      </h3>

      <nav>
        <ul>
          <li className="nav-icon" title="Notification">
            <AiFillGithub onClick={() => navigate("https://github.com/jhmeel/Steganography.git")} />
          </li>
        </ul>
      </nav>
    </HeaderRenderer> 
  );
};

export default Header;

const HeaderRenderer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  z-index: 1000;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 10px;
  background: rgba(251, 251, 251, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  transform: 0.5s;
  border-bottom: 1px solid #ededed;
  .logo {
    width: 90px;
    height: auto;
    cursor: pointer;
    position: relative;
    left: -20px;
  }
  nav ul {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .nav-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: 30%;
    border: 1px solid #ededed;
    background-color: #fff;
    cursor: pointer;
  }
`;
