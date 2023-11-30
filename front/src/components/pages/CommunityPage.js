import React, { useEffect, useState } from 'react';
import axios from "axios";
import HabitCard from "../features/HabitContents/HabitCard";
import { Row, Container } from "react-bootstrap";
import { CardWrapperDiv } from "../features/CommunityContents/CardScollStyled";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import LoadingCard from "../features/CommunityContents/LoadingCard";


export default function CommunityPage() {
  const [turtleCards, setTurtleCards] = useState(
    [{
      idx: 0,
      userName: "유림님",
      level: 1,
    },
    {
      idx: 1,
      userName: "민정님",
      level: 2,
    },
    {
      idx: 2,
      userName: "명지님",
      level: 3,
    },
    {
      idx: 3,
      userName: "혜연님",
      level: 4,
    },
    {
      idx: 4,
      userName: "성혜님",
      level: 5,
    },
    {
      idx: 5,
      userName: "깍두기",
      level: 1,
    },
    ]);


  // const getTurtleCards = () =>
  //   axios.get('거북이 정보 불러오기')
  //     .then(res => {
  //       if (turtleCards) {
  //         setTurtleCards(...turtleCards,res.data);
  //       } else {
  //         setTurtleCards(res.data);
  //       }
  //     })
  //     .catch(err => alert("거북이를 불러오지 못했어요! 페이지를 새로고침 해주세요 🐢", err));
  
  // useEffect(() => {
  //   getTurtleCards();
  // }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const lastindex = turtleCards.length - 1;
  const { ref, isInViewport } = useScrollAnimation();


  useEffect(() => {
    if (isInViewport === true) {
      // getTurtleCards();
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isInViewport]);



  return (
    <Container className="justify-content-center mt-5 " >
      <Row className="mb-5">
        <h3 className="text-center">🐢 거북이 구경하기 🐢</h3>
      </Row>
      <CardWrapperDiv>
        {turtleCards.map((turtleCard) =>
          turtleCard.idx === lastindex ? (
            <div ref={ref} key={turtleCard.idx}>
              <HabitCard
                key={turtleCard.idx}
                turtleCard={turtleCard}
              />
            </div>
          ) : (
            <HabitCard
            key={turtleCard.idx}
            turtleCard={turtleCard}
          />
          )
        )}
        { isLoading && <LoadingCard/> }
      </CardWrapperDiv>
    </Container>
  );
}


