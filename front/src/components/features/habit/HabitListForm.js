import React, { useState, useEffect } from 'react';
import { Card, Container, Col, Row, Modal, Button, Image } from 'react-bootstrap';
import { ScrollAniDiv } from "../IntroContents/AnimationStyled";
import api from "../../utils/axiosConfig";

const cheerUpTexts = [
    "같이 시작해봐요, 플라스틱 줄이기! 😊",
    "나부터 시작하는 환경을 위한 습관 !",
    "오늘도 환경을 위한 습관 Level Up 중!!",
    "👍🏻👍🏻👍🏻",
    "충분히 잘하고 있어요👍🏻 우리 계속 도전해봐요"
];

export default function HabitListForm ({ habitList }) {
    const [modalShow, setModalShow] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [randomIndex, setRandomIndex] = useState(() => Math.floor(Math.random() * cheerUpTexts.length));

    const HabitModal = (props) => {
        const { key, name } = props.habitinfo;
        console.log('HabitModal 모달');
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
                <Modal.Body>
                    <Image
                        src={require(`../../../assets/imgs/${key}.png`)}
                        alt="Habit image"
                        style={{ width: '200px', height: '200px' }}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const handleModal = ( name, key ) => {
        setSelectedHabit({
            key: key,
            name: name });
        setModalShow(true)
        console.log('handleModal 모달');
    }

    useEffect(() => {
        if (!modalShow) {
          // modalShow가 false일 때만 새로운 랜덤 인덱스를 생성하여 상태 업데이트
          setRandomIndex(() => Math.floor(Math.random() * cheerUpTexts.length));
        }
      }, [modalShow, cheerUpTexts.length]);

    const cards = Object.keys(habitList).map((key) => (
        <Col key={key} xs={6} sm={4} md={6} lg={4}
            className="mb-4" style={{ marginRight: '0'}}>
            <ScrollAniDiv>
                <Card border="light" style={{ width: '80%' }}>
                    <Card.Body>
                        <Card.Img
                            src={require(`../../../assets/imgs/${key}.png`)}
                            alt="Card image"
                            style={{ width: '200px', height: '200px' }}
                            onClick={() => handleModal(habitList[key], key)}/>
                        <Card.Title
                            style={{ marginTop: "10px" }}>
                            <span style={{ fontSize: "17px" }}>{habitList[key]}</span>
                        </Card.Title>
                    </Card.Body>
                </Card>
            </ScrollAniDiv>
        </Col>
    ))

    return (
        <>
            <Container
                className='text-center'
                style={{ marginTop: '40px'}}>
                <h2>{cheerUpTexts[randomIndex]}</h2>
                <h6 style={{ color: "grey", marginTop: '20px', marginBottom: '50px' }}>
                    ▼ 아래로 내려서 습관들을 확인해보세요
                </h6><br />
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
    )
};