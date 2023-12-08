import styled from "styled-components";
import { useRef } from 'react';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`

export const CardWrapperDiv = ({ children }) => {

  const scrollDiv = useRef();

  const scrollConvert = (e) => {

    const { deltaY } = e;
    const el = scrollDiv.current;

    el.scrollTo({
      left: el.scrollLeft + deltaY * 5,
      behavior: "smooth",
    });
    
    }  

  return (
    <CardWrapper ref={scrollDiv} onWheel={(e=>scrollConvert(e))}>
      {children}
    </CardWrapper>
  );
};
