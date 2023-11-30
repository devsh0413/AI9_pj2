import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Button, Col, Row, ListGroup, Image, Form } from 'react-bootstrap';
import './HabitPage.css';
import calendar from "../../../assets/imgs/calendar.png";
import axios from 'axios';


export default function HabitForm ({ userInfo, habitList }) {
    const { userName, turtleLevel } = userInfo;
    const habits = habitList;

    return (
        <>
            <Container className="habits-container">
                <Row>
                    <TurtleForm userName={userName} turtleLevel={turtleLevel}/>
                    <HabitAddForm userName={userName} habits={habits}/>
                </Row> 
            </Container>     
        </>
    )
};



const TurtleForm = ({ userName, turtleLevel }) => {
    const navigate = useNavigate();

    const getTurtleImage = (level) => {
        const turtleImg = require(`../../../assets/imgs/거북이${level}.png`);
        return (
            <Card.Body className="d-flex justify-content-center align-items-center">
                <Card.Img src={turtleImg} alt="Card image" style={{ width: '70%'}}/>
            </Card.Body>
        )
    };
    return (
        <>
            <Col xs={12} className="d-flex justify-content-end">
                <Image src={calendar} alt="Calendar image"
                    style={{ width: '5%' }}
                    onClick={() => navigate('/calendar')}/>
            </Col>
            <Col xs={12} sm={6} className="turtle-container">
                <Card style={{ height: '450px' }}>
                    <Card.Body>
                        <Card.Title>
                            <span style={{ fontSize: "30px" }}>
                                {userName}</span>의 거북잉
                        </Card.Title>
                    </Card.Body>
                    {turtleLevel >= 1 && turtleLevel <= 5
                    && getTurtleImage(turtleLevel)}          
                </Card>
            </Col>
        </>
    )
}



const HabitAddForm = ({ userName, habits }) => {
    const [ addButton, setAddButton ] = useState(true);
    const [ selectedHabit, setSelectedHabit ] = useState([]);
    const [ selectedDay, setSelectedDay ] = useState(null);

    const handleAddButton = () => {
        setAddButton(false);
    }

    const handleCheckboxChange = (key) => {
        setSelectedHabit((prev) => {
            if (prev.includes(key)) {
                return prev.filter((habitKey) => habitKey !== key);
            } else {
            return [...prev, key]
            }
        })
    }

    const handleRadioChange = (key) => {
        setSelectedDay(key)
    }

    const getHabitList = Object.keys(habits).map((key) => (
        <ListGroup.Item key={key} eventKey={key}>
                <Form.Check inline key={key} type="checkbox"
                onClick={() => handleCheckboxChange(key)}/>
            {habits[key]}
        </ListGroup.Item>
    ));

    const getDayList = ["3일", "5일", "7일"].map((day) => (
        <ListGroup.Item>
            <Form.Check key={day} 
            label={day}
            type='radio' name="group" 
            onClick={() => handleRadioChange(day)}
            style={{ fontSize: "14px"}}/>
        </ListGroup.Item>
    ));

    const handleSelectButton = () => {
        console.log(selectedHabit);
        console.log(selectedDay);
        axios.post("http://"+ window.location.hostname +":5001/habits/habits_id",
            selectedHabit)
        .then((res) => {
            console.log(res)
        }).catch((error) => {
            console.log(error)
        }).then(() => {
        });
    }

    return (
        <>
            <Col xs={12} sm={6} className="habit-container" >
                <Card style={{ height: '450px' }}>
                    <Card.Body style={{ height: "100%" }}>
                        <Card.Title>
                            <span style={{ fontSize: "30px" }}>
                                {userName}</span>의 습관
                        </Card.Title>
                        <div style={{ color: "grey", marginBottom: '20px', fontSize: "80%" }}>
                            습관과 실천 기간을 추가해보세요 !
                        </div>
                        {addButton === true &&
                        <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
                            <Button variant="primary" size="lg"
                            onClick={() => handleAddButton()}>+
                            </Button>
                        </div>
                        }
                        {addButton === false &&
                        <ListGroup style={{ position: 'relative', width: '100%', fontSize: "83%"}}>
                            {getHabitList}
                        </ListGroup>}
                    </Card.Body>
                    {addButton === false  &&
                    <>
                        <ListGroup horizontal="sm"
                            className="d-flex justify-content-center"
                            style={{ border: "none" }}>
                            {getDayList}
                        </ListGroup>
                        <div className="d-flex justify-content-center">
                            <Button className="select-button" variant="primary" size="lg"
                                onClick={() => handleSelectButton()}
                                style={{ width: "30%", fontSize: '13px', margin: "10px"}}>
                                    선택완료
                            </Button>
                        </div>
                    </>}
                </Card>
            </Col>
        </>
    )
}
