import React, { useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import HabitShowForm from './HabitShowForm';
import HabitAddForm from './HabitAddForm';


export default function HabitCardForm ({ userName, habits, selectedDate, selectedHabits }) {
  const [ start, setStart ] = useState(selectedHabits ? false : true);
  const [ selectedHabit, setSelectedHabit ] = useState(selectedHabits);
  const [ request, setRequest ] = useState(true);
  const [ selectDate, setSelectDate ] = useState(selectedDate);

  const handleFormSubmit = (selectedHabit, selectedDate) => {
      setSelectedHabit(selectedHabit);
      setSelectDate(selectedDate);
      setStart(false);
      setRequest(false);
    };

  return (
      <>
          <Col xs={12} sm={6} className="habit-container" >
              <Card style={{ height: '450px' }}>
                  {/* 기존에 선택한 습관이 없는 경우  */}
                  {start && <HabitAddForm userName={userName}
                                          habits={habits} onSubmit={handleFormSubmit}/>}
                  {/* 기존에 선택한 습관이 있는 경우  */}
                  {!start && <HabitShowForm userName={userName} habits={habits}
                              selectedDate={selectDate} selectedHabit={selectedHabit} request={request}/>}
              </Card>
          </Col>
          
      </>
  )
}