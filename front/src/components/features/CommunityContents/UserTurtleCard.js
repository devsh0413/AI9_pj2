import React from 'react';
import { Card } from "react-bootstrap";

export default function UserTurtleCard({ turtleCard }) {

  const getTurtleImage = (level) => {
    const turtleImg = require(`../../../assets/imgs/거북이${level}.png`);
    return (
      <Card.Img src={turtleImg} alt="Card image" className="mx-auto" style={{ width: "18rem" }}/>
    )
};


  return (
    <Card
      key={turtleCard.cursors}
      className="mb-5 mx-3 p-0 col-4"
      style={{ width: "21rem" }} 
    >
        <Card.Header>{turtleCard.username}의 거북이</Card.Header>
      {turtleCard.level >= 1 && turtleCard.level <= 5 && getTurtleImage(turtleCard.level)}
      </Card>
  );
}
