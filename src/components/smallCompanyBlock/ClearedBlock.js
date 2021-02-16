import React from "react";
import styled from "styled-components";

const SmallCompBlock = styled.div`
    width: 240px;
    height: 240px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    background-color: #fff;
    transition: 0.3s ease opacity;
    border: 1px solid #f3f3f3;
    box-shadow: 4px 4px 4px #e5e5e5;
    margin: 6px;
    margin-left: 0;
    &:hover {
      opacity: 0.9;
    }
    &:nth-child(2n + 2) {
      margin-left: 6px;
      margin-right: 12px;
    }

    &:nth-child(4n + 4) {
      margin: 6px;
      margin-right: 0;
    }

    @media (max-width: 760px) {
      height: 235px;
      margin: 5px;
      margin-left: 5px;
      margin-right: 5px;
      width: calc(33% - 10px);
      border-radius: 5px;
      &:nth-child(2n + 2) {
        margin-left: 5px;
        margin-right: 5px;
      }

      &:nth-child(4n + 4) {
        margin: 5px;
        margin-right: 5px;
      }
    }
    @media (max-width: 650px) {
      width: calc(50% - 10px);
    }
    @media (max-width: 375px) {
      height: 205px;
    }
  `,
  Desctop = styled.div`
    display: block;
    @media (max-width: 760px) {
      display: none;
    }
  `,
  PreviewBlockD = styled.div`
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    height: 150px;
    background: #000;
    background-size: cover;
    background-position: center;
  `,
  Mobile = styled.div`
    display: none;
    @media (max-width: 760px) {
      display: block;
    }
  `,
  PreviewBlockM = styled.div`
    border-radius: 5px;
    overflow: hidden;
    height: 175px;
    background: #000;
    background-size: cover;
    background-position: center;
    @media (max-width: 375px) {
      height: 150px;
    }
  `;

const ClearedBlock = () => (
  <SmallCompBlock>
    <Desctop>
      <PreviewBlockD />
    </Desctop>
    <Mobile>
      <PreviewBlockM />
    </Mobile>
  </SmallCompBlock>
);

export default ClearedBlock;
