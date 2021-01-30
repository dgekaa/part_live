import React from "react";
import styled from "styled-components";

const SpriteWrap = styled.div`
  width: 30px;
  height: 40px;
  position: relative;
  overflow: hidden;
  margin-right: 5px;
  @media (max-width: 760px) {
    display: none;
  }
`;

const SpriteImg = styled.img`
  position: absolute;
  top: 5px;
  left: ${({ frame }) => (frame === 1 ? "-30px" : " 0px")};
`;

const CustomImg = ({
  name,
  className,
  alt,
  active,
  width,
  height,
  onMouseEnter,
  onMouseOut,
  onClick,
  style,
  frame,
}) => {
  return frame ? (
    <SpriteWrap>
      <SpriteImg
        alt={alt}
        src={`${process.env.PUBLIC_URL}/img/${name}.png`}
        width="60"
        height="30"
        frame={frame}
      />
    </SpriteWrap>
  ) : (
    <img
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
      onClick={onClick}
      alt={alt}
      className={className}
      src={
        active
          ? `${process.env.PUBLIC_URL}/img/${name}_w.png`
          : `${process.env.PUBLIC_URL}/img/${name}.png`
      }
      width={width}
      height={height}
      style={style}
    />
  );
};

export default CustomImg;
