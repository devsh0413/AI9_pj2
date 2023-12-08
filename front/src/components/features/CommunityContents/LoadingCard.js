import React from 'react';
import { Card, Spinner } from "react-bootstrap";

export default function LoadingCard() {
  return (
    <Card className="mb-5 mx-3 p-0 col-4" style={{width: "10rem"}} >
      <Card.Header>Loading...</Card.Header>
      <Card.Body >
        <Spinner animation="border" variant="primary" className="m-5"/>
      </Card.Body>
    </Card>
  );
}

