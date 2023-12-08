import React, { useState, useMemo, useCallback } from 'react';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import api from "../../utils/axiosConfig";

const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    const dateString = year + '-' + month + '-' + day;
    
    return dateString;
}

export default function HabitShowForm ({ userName, habits, selectedDate, selectedHabit, request }) {
    const [ check, setCheck ] = useState(false);
    const [ selectHabit, setSelectHabit ]= useState(selectedHabit)
    const [ checkHabit, setCheckHabit ] = useState([]);
    const [ fulfillHabit, setFulfillHabit ] = useState([]);
    const today = getDate();
  
    const handleFulfillChange = useCallback((key) => {
      setFulfillHabit((prev) => {
          if (prev.includes(key)) {
              return prev.filter((habitKey) => habitKey !== key);
          } else {
          return [...prev, key]
          }
      })
    }, [])
  
    const getSelectedHabit = useMemo(() => {
        return selectHabit.map((habit) => (
            <ListGroup>
                <ListGroup.Item>
                    <Form.Check inline key={`${habit}_1`}
                    type='checkbox'
                    onClick={() => handleFulfillChange(habit)}
                    style={{ fontSize: "14px"}}/>{habits[habit]}
                </ListGroup.Item>
            </ListGroup>
        ));
    }, [selectHabit]) 

  
    const getCheckedHabit = useMemo(() => {
        return <>
                {selectHabit.map((habit) => (
                <ListGroup.Item>
                    <Form.Check inline key={`${habit}_2`}
                    type='checkbox'
                    onClick={() => handleFulfillChange(habit)}
                    style={{ fontSize: "14px"}}/>{habits[habit]}
                </ListGroup.Item>
                ))}
                {checkHabit.map((habit) => (
                    <ListGroup.Item>
                        <Form key={`${habit}_3`}
                        style={{ fontSize: "12px"}}/><s>{habits[habit]} (완료)</s>
                    </ListGroup.Item>
                    ))
                }
            </>
    }, [selectHabit, checkHabit])
  
  
    const getDoneHabit = () => {
        if (!check) {
            api({
                method: 'get',
                url: "/fulfilled-habits",
                params: {date: today},
            })
            .then((res) => {
                const habitId = res.habitIds;
                if (!habitId) {
                  setCheckHabit(false);
                } else {
                  let difference = selectedHabit.filter(x => !habitId.includes(x));
                  setCheckHabit(habitId);
                  setSelectHabit(difference);
                }
            }).catch((error) => {
                // 추후 수정예정
                console.log(error)
            }).finally(() => {
                setCheck(true);
            });
        }
          
  
        return (
          <>
              {/* 현재까지 체크된 습관이 없는 경우 */}
              {checkHabit.length === 0 && getSelectedHabit}
  
              {/* 체크된 습관이 있는 경우 */}
              {checkHabit.length !== 0  && getCheckedHabit}
          </>
        )
    }
  

      const fulfilledButton = () => {
          api.post("/fulfilled-habits", {
                  fulfilledHabits: fulfillHabit
              })
          .then((res) => {
          }).catch((error) => {
              // 추후 수정예정
              console.log(error)
          }).finally(() => {
            alert('실천 완료 !😊');
            setCheckHabit(checkHabit);
            setCheck(false);
            getDoneHabit();
          });
          
      }
    return (
        <>
            <Card.Body style={{ height: "100%" }}>
                <Card.Title>
                    <span style={{ fontSize: "30px" }}>
                        {userName}</span>의 습관
                </Card.Title>
                <div style={{ color: "grey", marginBottom: '20px', fontSize: "80%" }}>
                    실천한 습관을 선택해주세요 !</div>
                <div>실천 종료까지  <b style={{ color: "red", fontSize: "120%"}}>D-{selectedDate}</b></div>
                {/* api 요청 없이 추가한 습관들 리스트 그대로 가져와서 띄우기 */}
                {!request && <ListGroup style={{ position: 'relative', width: '100%', fontSize: "83%", marginTop: "40px"}}>
                    {getSelectedHabit}
                </ListGroup>}
                {/* api 요청으로 완료한 습관들 구분해서 표시하기 */}
                {request && <ListGroup style={{ position: 'relative', width: '100%', fontSize: "83%", marginTop: "40px"}}>
                  {getDoneHabit()}
                </ListGroup>}
            </Card.Body>
            <div className="d-flex justify-content-center">
                <Button className="select-button" variant="primary" size="lg"
                    onClick={() => fulfilledButton()}
                    style={{ width: "30%", fontSize: '13px', margin: "10px"}}>
                        실천완료
                </Button>
            </div>
        </>
    )
  }
