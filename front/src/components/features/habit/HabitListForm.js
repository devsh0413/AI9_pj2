import React, { useState, useEffect } from "react";
import { Card, Container, Col, Row, Modal, Button, Image } from "react-bootstrap";

const cheerUpTexts = [
  "같이 시작해봐요, 플라스틱 줄이기! 😊",
  "나부터 시작하는 환경을 위한 습관 !",
  "오늘도 환경을 위한 습관 Level Up 중!!",
  "👍🏻👍🏻👍🏻",
  "충분히 잘하고 있어요👍🏻 우리 계속 도전해봐요",
];

const habitDesc = {
  habit1:
    "물건을 구매할 때, 비닐봉투 대신 장바구니나 에코백을 사용하여 자연을 지켜봅시다 :) 장 본 양이 많지 않을 때는 비닐봉투를 거절하는 것도 좋은 습관이에요!",
  habit2:
    "배달 한 번 시켜 먹으면 플라스틱 용기의 양이 어마어마하죠? 유리나 도자기 그릇을 사용하면 설거지도 훨씬 간편할거에요 :)!",
  habit3:
    "개인 컵을 사용하면 할인을 해주는 카페가 생각보다 많답니다 ! 환경도 지키고, 돈도 아끼고 일석 이조의 효과를 누려봐요!",
  habit4:
    "음료를 마실 때 빨대를 사용하는 대신 직접 마셔봐요! 음료의 향기까지 더욱 풍부하게 즐길 수 있을거에요 !",
  habit5:
    "음식물이 묻은 플라스틱은 깨끗하게 씻어서 버려야 재활용이 된답니다 :)",
  habit6:
    "무라벨 제품을 애용해봅시다. 분리배출 시 라벨을 뗄 필요가 없어서 아주 편하다구요!",
};

export default function HabitListForm({ habitList }) {
  const [modalShow, setModalShow] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [randomIndex, setRandomIndex] = useState(() =>
    Math.floor(Math.random() * cheerUpTexts.length)
  );

  const HabitModal = (props) => {
    const { key, name } = props.habitinfo;
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "30px" }}>{name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Image
            src={require(`../../../assets/imgs/${key}.png`)}
            alt="Habit image"
            style={{ width: "200px", height: "200px" }}
          />
          <span className="mt-3">{habitDesc[selectedHabit.key]}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleModal = (name, key) => {
    setSelectedHabit({
      key: key,
      name: name,
    });
    setModalShow(true);
  };

  useEffect(() => {
    if (!modalShow) {
      // modalShow가 false일 때만 새로운 랜덤 인덱스를 생성하여 상태 업데이트
      setRandomIndex(() => Math.floor(Math.random() * cheerUpTexts.length));
    }
  }, [modalShow, cheerUpTexts.length]);

  const cards = Object.keys(habitList).map((key) => (
    <Col
      key={key}
      xs={6} sm={4} md={6} lg={4}
      className="mb-4"
      style={{ marginRight: "0" }}
    >

        <Card border="light" style={{ width: "80%" }}>
          <Card.Body>
            <Card.Img
              src={require(`../../../assets/imgs/${key}.png`)}
              alt="Card image"
              style={{ width: "200px", height: "200px" }}
              onClick={() => handleModal(habitList[key], key)}
            />
            <Card.Title style={{ marginTop: "10px" }}>
              <span style={{ fontSize: "17px" }}>{habitList[key]}</span>
            </Card.Title>
          </Card.Body>
        </Card>
    </Col>
  ));

  return (
    <>
      <Container
        className="text-center"
        style={{ marginTop: "40px" }}>
        <h2>{cheerUpTexts[randomIndex]}</h2>
        <h6 style={{ color: "grey", marginTop: "20px", marginBottom: "50px" }}>
          ▼ 아래로 내려서 습관들을 확인해보세요
        </h6>
        <br />
        <Row>{cards}</Row>
        {modalShow && (
          <HabitModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            habitinfo={selectedHabit}
          />
        )}
      </Container>
    </>
  );
}
