import React, { useEffect, useState } from 'react';
import CalendarForm from '../features/calender/CalendarPageForm';
import api from "../utils/axiosConfig";

const getDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');

  const monthString = year + '-' + month;
  const dateString = year + '-' + month + '-' + day;

  return [monthString, dateString];
}

function CalendarPage() {
  const [habitList, setHabitList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  let monthCheckDate = {};

  useEffect(() => {
    api({
        method: 'get',
        url: "/fulfilled-habits",
        params: {date: getDate()[1]},
    })
    .then((res) => {
        const habitIds = res.habitIds;
        if (habitIds.length === 0) {
          setHabitList(() => ({
            date: getDate()[1],
            habit: "습관을 추가해주세요"
          }));
        } else {
          setHabitList(() => ({
            date: getDate()[1],
          ...habitIds.reduce((acc, habit, index) => {
            acc[`habit${index + 1}`] = habit;
            return acc;
            }, {})
          }));
        }
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
      setIsLoading(true);
    })
    
    api({
        method: 'get',
        url: "/fulfilled-habits",
        params: {month: getDate()[0]},
    })
    .then((res) => {
        const checkDates = res.dates;
        monthCheckDate.current = checkDates;
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
      setIsLoading(true);
    })
  }, [])
  
  return (
    <>
      {isLoading && <CalendarForm habitlist={habitList} checkdate={monthCheckDate}/>}
    </>
    
  );
}

export default CalendarPage;