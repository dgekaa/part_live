import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  width: 100%;
  height: 65px;
  background-color: #f3f3f3;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4 !important;
  @media (max-width: 760px) {
    display: none;
  }
`;

const Footer = () => <FooterContainer />;

export default Footer;
