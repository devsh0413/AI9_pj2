import React, { useState, useMemo } from 'react';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import api from "../../utils/axiosConfig";


export default function HabitAddForm ({ userName, habits, onSubmit }) {
    const [addButton, setAddButton] = useState(true);
    const [selectedHabit, setSelectedHabit] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
  
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
      setSelectedDate(Number(key[0]))
    }
  
    const getHabitList = useMemo(() => {
      return Object.keys(habits).map((key) => (
        <ListGroup.Item
            key={key}
            eventKey={key}>
            <Form.Check
                inline
                key={key}
                type="checkbox"
                onClick={() => handleCheckboxChange(key)}/>
            {habits[key]}
        </ListGroup.Item>
      ));
    }, []);
  
    const getDayList = useMemo(() => {
      return ["3일", "5일", "7일"].map((day) => (
        <ListGroup.Item key={day}>
            <Form.Check
                key={day} 
                label={day}
                type='radio' name="group" 
                onClick={() => handleRadioChange(day)}
                style={{ fontSize: "14px"}}/>
        </ListGroup.Item>
    ));
    }, []);
  
  
    const handleSelectButton = () => {
        if (selectedHabit.length === 0) {
          alert('실천할 습관을 선택하세요');
        } else if (!selectedDate) {
          alert('습관을 실천할 일자를 선택하세요');
        } else {
          if (onSubmit) {
              onSubmit(selectedHabit, selectedDate);
          }
  
          api.post("/planned-habits", {
                  habitIds: selectedHabit,
                  habitDate: selectedDate
              }
          )
          .then((res) => {
              console.log('습관 추가 완료');
          }).catch((error) => {
              console.log(error)
          })
        }
        
    }
  
    return (
        <>
            <Card.Body style={{ height: "100%" }}>
                <Card.Title>
                    <span style={{ fontSize: "30px" }}>
                        {userName}</span>의 습관
                </Card.Title>
                <div style={{ color: "grey", marginBottom: '20px', fontSize: "80%" }}>
                    습관과 실천 기간을 추가해보세요 !<br/>
                    한 번 정한 습관은 변경 없이 꾸준히 진행됩니다 😊
                </div>
                {addButton &&
                <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
                    <Button variant="primary" size="lg"
                        onClick={() => handleAddButton()}>+
                    </Button>
                </div>
                }
                {!addButton &&
                <ListGroup style={{ position: 'relative', width: '100%', fontSize: "83%"}}>
                    {getHabitList}
                </ListGroup>}
            </Card.Body>
            {!addButton  &&
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
                </>
            }
        </>
    )
  }
  