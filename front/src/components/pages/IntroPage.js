import { ScrollAniDiv } from "../features/IntroContents/AnimationStyled";
import "../features/IntroContents/IntroPage.css";
import { Button, Row, Col, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Creditcard from"../features/IntroContents/credit-card.png";
import Eat from "../features/IntroContents/restaurant.png";
import Toothbrush from "../features/IntroContents/toothbrush.png";
import Logo from "../common/header/logo.png";
import Chat from "../features/IntroContents/kakaotalk.png";
import Chart from "../features/IntroContents/Chart";
import { useEffect, useState } from "react";
import axios from "axios";


export default function IntroPage() {

  const navigate = useNavigate();
  const [charts, setCharts] = useState();

  const getCharts = () => {
    axios.get("http://"+ window.location.hostname +":5001/graphs")
      .then((res) => {
        setCharts(res.data.data);
    })
      .catch((err) => {
        // TODO :  에러 핸들링
        console.log(err);
    })
  };

  useEffect(() => {
    getCharts();
  }, []);


  return (
    <div className="back">
      <Row className="vh-100">
        <ScrollAniDiv>
          <img src={Logo} alt="Turtine logo"/>
          <hr/>
          <p>조금 느려도</p>
          <p>하나씩 실천해 나가는</p>
          <p><span className="important">해양환경</span>을 위한 습관</p>
        </ScrollAniDiv>
      </Row>

      <Row className="vh-100">
        <Col>
          <ScrollAniDiv>
            <p>왜 <span className="important">해양환경</span>을 위한</p>
            <p>습관을 형성해야할까?</p>
          </ScrollAniDiv>
        </Col>
        <Col>
          <ScrollAniDiv>
            <img src={Chat} alt="img" style={{ width: "60%" }}/>
          </ScrollAniDiv>
        </Col>
      </Row>

      <Row className="vh-100">
        <Col>
          <ScrollAniDiv>
            {charts && (<Chart data={charts[0]}/>)}
          </ScrollAniDiv>
        </Col>
        <Col>
          <ScrollAniDiv>
            <p>1일 기준</p>
            <p>국내 플라스틱 배출량</p>
            <span className="important">매년 꾸준히 증가</span>
          </ScrollAniDiv>
        </Col>
      </Row>

      <Row className="vh-100">
        <Col>
          <ScrollAniDiv>
            <p>바다로 가는</p>
            <p>플라스틱 쓰레기</p>
            <span className="important">세계적으로 증가</span>
          </ScrollAniDiv>
        </Col>
        <Col>
          <ScrollAniDiv>
            {charts && (<Chart data={charts[1]}/>)}
          </ScrollAniDiv>
        </Col>
      </Row>
      

      <Row className="vh-100">
        <Stack className="my-auto">
          <Row>
            <ScrollAniDiv>
              <p>1인당 섭취하는 미세플라스틱의 양</p>
            </ScrollAniDiv>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <ScrollAniDiv>
                <img className="contents" src={Eat} alt="TURTINE logo" />
                <p>일주일 간</p>
                <span className="important">약 2000개</span>
              </ScrollAniDiv>
            </Col>
            <Col xs={12} md={4}>
              <ScrollAniDiv>
                <img className="contents" src={Creditcard} alt="TURTINE logo" />
                <p>일주일 간 5g</p>
                <span className="important">신용카드 1장</span>
              </ScrollAniDiv>
            </Col>
            <Col xs={12} md={4}>
              <ScrollAniDiv>
                <img className="contents" src={Toothbrush} alt="TURTINE logo" />
                <p>월간 21g</p>
                <span className="important">칫솔 1개</span>
              </ScrollAniDiv>
            </Col>
          </Row>
        </Stack>
      </Row>

      <Row className="vh-100">
        <ScrollAniDiv>
          <p>"지금 노력하지 않으면,</p>
          <p>2050년 바다에는</p>
          <p><span className="important">해양생물</span>보다 <span className="important">플라스틱</span>이 더 많아질 것입니다."</p>
          <p>- 2017 세계 경제 포럼</p>
        </ScrollAniDiv>
      </Row>

      {/* TODO: 로그인 되어있는 상태라면 시작하기 눌렀을 때, 해빗페이지로 이동할까요? */}
      <Row className="vh-100">
        <Col>
          <ScrollAniDiv>
            <p>해양생물을 위해, 나를 위해</p>
            <p>환경 습관을 형성하기 위한 여정</p>
            <Button variant="primary" onClick={() => navigate('/register')}>시작하기</Button>
          </ScrollAniDiv>
        </Col>
      </Row>
    </div>
    
  );
}
