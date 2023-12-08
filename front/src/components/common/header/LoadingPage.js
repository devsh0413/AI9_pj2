import styled from "styled-components";
import LoadingSpinner from "../../../assets/imgs/Spin-1s-200px.gif";

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


export default function LoadingPage() {
  return (
    <Background>
      <img src={LoadingSpinner} alt="로딩중"/>
    </Background>
  );
}

