import React, { useState, useRef, useCallback } from "react";
import api from "../utils/axiosConfig";
import UserTurtleCard from "../features/CommunityContents/UserTurtleCard";
import { Row, Container } from "react-bootstrap";
import { CardWrapperDiv } from "../features/CommunityContents/CardScollStyled";
import LoadingCard from "../features/CommunityContents/LoadingCard";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver";

export default function CommunityPage() {
  const [turtleCards, setTurtleCards] = useState();
  const lastCusor = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const onIntersect = useCallback(([{isIntersecting}]) => {
    if (isIntersecting) {
      setIsLoading(true);
      api
      .get(
        lastCusor.current
          ? `/users?userId=${lastCusor.current}&limit=6`
          : "/users?limit=6"
      )
      .then((res) => {
        turtleCards === undefined
          ? setTurtleCards(res.users)
          : setTurtleCards((prev) => [...prev].concat(res.users));
        lastCusor.current = res.users[res.users.length - 1].userId;
      })
      .catch((err) =>
        console.log(
          "거북이를 불러오지 못했어요! 페이지를 새로고침 해주세요 🐢",
          err
        )
      );
    } else {
      setIsLoading(false);
    }
  },[turtleCards]);

  const [setTarget] = useIntersectionObserver({onIntersect});

  return (
    <Container className="justify-content-center mt-5">
      <Row className="mb-5">
        <h3 className="text-center mb-3">🐢 거북이 구경하기 🐢</h3>
        <span className="text-center text-secondary">다른 유저의 거북이는 이만큼 자랐어요!</span>
        <span className="text-center text-secondary">매일매일 습관 실천으로 거북이를 키워보아요~</span>
      </Row>
      <CardWrapperDiv>
        {turtleCards &&
          turtleCards.map((turtleCard, idx) => (
            <UserTurtleCard
              key={idx}
              turtleCard={turtleCard}/>
          ))}
        <div ref={setTarget}></div>
        {setIsLoading && <LoadingCard />}
      </CardWrapperDiv>
    </Container>
  );
}