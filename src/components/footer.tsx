import React from "react";
import styled from "styled-components";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 2rem 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  bottom: 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    flex-direction: column;
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const SocialLink = styled.a`
  color: #fff;
  font-size: 1.25rem;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const CopyrightText = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: #dbdbdb;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <CopyrightText>&copy; 2023 Jhmeel. All rights reserved.</CopyrightText>
      <SocialLinks>
        <SocialLink href="https://www.facebook.com/yourcompany" target="_blank">
          <FaFacebookF />
        </SocialLink>
        <SocialLink href="https://twitter.com/yourcompany" target="_blank">
          <FaTwitter />
        </SocialLink>
        <SocialLink
          href="https://www.linkedin.com/company/yourcompany"
          target="_blank"
        >
          <FaLinkedinIn />
        </SocialLink>
      </SocialLinks>
    </FooterContainer>
  );
};

export default Footer;
