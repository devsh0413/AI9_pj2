import React, { useState } from 'react';
import HabitForm from '../features/habit/HabitPageForm';
import HabitListForm from '../features/habit/HabitListForm';

export default function HabitPage() {
  const [isEditing, setIsEditing] = useState(true);
  const userInfo = {
    userName : "거북잉",
    turtleLevel: 2
  }

  const habitList = {
    habit1: "장바구니(에코백) 사용하기",
    habit2: "음식 포장 시 다회용기 사용하기",
    habit3: "텀블러나 머그컵 사용하기",
    habit4: "플라스틱 빨대 안 쓰기",
    habit5: "플라스틱 세척해서 분리배출하기",
    habit6: "무라벨 제품 구매하기"
  }

  return (
    <>
      <HabitForm userInfo={userInfo} habitList={habitList} />
      {isEditing === true && <HabitListForm habitList={habitList} />}
    </>
  );
}

