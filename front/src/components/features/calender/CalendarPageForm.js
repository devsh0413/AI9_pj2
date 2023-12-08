import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import check from "../../../assets/imgs/check.png"
import { Col, Container, Row, Card, ListGroup } from 'react-bootstrap';
import './Calendar.css';
import api from "../../utils/axiosConfig";
import { CalendarChart } from "../../common/Chart";


const habits = {
  habit1: "장바구니(에코백) 사용하기",
  habit2: "음식 포장 시 다회용기 사용하기",
  habit3: "텀블러나 머그컵 사용하기",
  habit4: "플라스틱 빨대 안 쓰기",
  habit5: "플라스틱 세척해서 분리배출하기",
  habit6: "무라벨 제품 구매하기"
}

const CalendarForm = ({ habitlist, checkdate }) => {
  const [habitList, setHabitList] = useState(habitlist);
  const [checkDate, setCheckDate ] = useState(checkdate.current);
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [scroll, setScroll] = useState(false);
  const [charts, setCharts] = useState(false);
  const [lastWeekCount, setLastWeekCount] = useState(false);
  const [thisWeekCount, setThisWeekCount] = useState(false);
  const [render, setRender] = useState(false);

  const renderEventContent = useCallback((eventInfo) => {
    return (
        <img className="check-image" src={check} alt="check"
        onClick={() => handleCheckClick(eventInfo.event)}
        width="40%"
        style={{ display: 'block', margin: '0 auto' }}
        />
    )
  }, [])

  // 체크한 이미지 클릭
  const handleCheckClick = (event) => {
    const startDate = event._instance.range.start
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');;
    const date = startDate.getDate().toString().padStart(2, '0');;
    const clickFullDate = `${startDate.getFullYear()}-${month}-${date}`
    
    // api 요청으로 받은 데이터로 변경
    api({
        method: 'get',
        url: "/fulfilled-habits",
        params: {date: clickFullDate},
    })
    .then((res) => {
        const habits = res.habitIds;
        setHabitList(() => ({
          date: clickFullDate,
        ...habits.reduce((acc, habit, index) => {
          acc[`habit${index + 1}`] = habit;
          return acc;
          }, {})
        }));
    }).catch((error) => {
        // 추후 수정예정
        console.log(error)
    })
  };

 
  const handleDatesSet = (e) => {
    const startDate = new Date(e.startStr);
    const endDate = new Date(e.endStr);
    const middleDate = new Date(startDate.getTime() 
                        + (endDate.getTime() - startDate.getTime()) / 2);
    const middleMonth = middleDate.getMonth() + 1;

    const year = middleDate.getFullYear();
    const month = middleMonth.toString().padStart(2, '0');
    const monthString = year + '-' + month;

    if (middleMonth === new Date().getMonth() + 1) {
        setHabitList(habitlist)
    }

    api({
          method: 'get',
          url: "/fulfilled-habits",
          params: {month: monthString},
      })
      .then((res) => {
          const checkDates = res.dates;
          const checkDateObject = checkDates.map((date) => ({ date }));
          setCheckDate(checkDateObject);

          const countData = res.counts;
          const lastWeekCount = countData.lastWeek[2];
          const thisWeekCount = countData.thisWeek[2];
          const countDateArr = [];
          countData && Object.keys(countData).reverse().map((key) => 
            countDateArr.push({
              'week': (key === "thisWeek" ? "이번주":
                    `${countData[key][0].substr(5,2)}/${countData[key][0].substr(8)}`
                    +'~'+`${countData[key][1].substr(5,2)}/${countData[key][1].substr(8)}`),
              "value": countData[key][2]
            })
          )
          setCharts(countDateArr);
          setLastWeekCount(lastWeekCount);
          setThisWeekCount(thisWeekCount);
          setRender(true);
      }).catch((error) => {
          // 추후 수정예정
          console.log(error)
      })
  };

  // const MyHabitData = () => {
  //   return (
  //     <>
  //       <Card style={{ height: "200px" }}>
  //         <Card.Title>
  //           <h2>데이터 서비스</h2>
  //         </Card.Title>
  //       </Card>
  //     </>
  //   )
  // }

  
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollPosition(window.scrollY);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  // }, []);


  // // 추후 작업 - 데이터 서비스 부분
  // // 한 번만 API 요청하도록
  // useEffect(() => {
  //   const { offsetHeight } = document.documentElement;
  //   if (!scroll && window.innerHeight >= Math.floor(offsetHeight - scrollPosition)) {
  //     console.log('API 요청');
  //     setScroll(true);
  //   }
  // }, [scroll, scrollPosition]);

  

  return (
    <>
      <Container className="calendar-container">
        <Col className='calendar-box'>
          <Row className='full-calendar'>
            <FullCalendar
                  initialView="dayGridMonth" 
                  plugins={[ dayGridPlugin, interactionPlugin ]}
                  eventContent={renderEventContent}
                  titleFormat={(date) => {
                        return date.date.year +"년 "+(date.date.month +1)+"월" }}
                  eventBackgroundColor='transparent'
                  eventBorderColor='transparent'
                  events={checkDate}
                  dateClick={(info) => {
                    setHabitList(() => ({
                      date: info.dateStr,
                      habit: "달성한 습관이 없습니다😭"
                    }))
                  }}
                  datesSet={(e) => handleDatesSet(e)}
                  height="550px"
                />
          </Row>
          <Card className="calendar-text" style={{ width: '30rem', height: "300px" }}>
            <ListGroup variant="flush">
              {Object.keys(habitList).map((key) => (
                <ListGroup.Item key={key}>
                  {(key === "date" || key === "habit") ? habitList[key] : habits[habitList[key]]}
                </ListGroup.Item>))}
            </ListGroup>
          </Card>
        </Col>
      </Container>
      {render && <>
      <Container
        className='text-center'
        style={{ marginTop: '30px'}}>
        <h3>지난 주 {lastWeekCount}회 달성</h3>
        {(lastWeekCount - thisWeekCount) > 0 ?
        <h3>{lastWeekCount - thisWeekCount}회 남았어요😊</h3>
        : <h3>이번주는 지난주보다 실천을 많이 했어요 !!</h3>}
        <h6 style={{ color: "grey", marginTop: '30px' }}>
            ▼ 아래에서 나만의 Data를 확인해보세요
        </h6><br />
        {/* {scroll && <MyHabitData/>} */}
      </Container>
      <Container className="d-flex justify-content-center" style={{ marginBottom: "30px"}}>
        {charts && <CalendarChart data={charts}/>}
      </Container>
      </>}
    </>
  );
}

export default CalendarForm;
