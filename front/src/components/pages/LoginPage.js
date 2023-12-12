import React, { useState, useContext, useEffect } from "react";
import { Button, Form, Stack, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import api from "../utils/axiosConfig";
import { UserContext } from "../../Context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitEmail = (e) => setEmail(e.target.value);
  const submitPassword = (e) => setPassword(e.target.value);

  const regexp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const validateEmail = (email) => email.match(regexp);

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 8;
  const isAllValid = isEmailValid && isPasswordValid;

  useEffect(() => {
    if (user) {
      navigate("/habit");
    }
  },[user])


  const onClickLogin = (e) => {
    e.preventDefault();
    api.post("/users/login", { email, password })
        .then((res) => {
          const data = res.user;
          setUser(data);
          alert(`${data.username}님 환영합니다!`);
        })
        .catch((e) => {
          console.log("로그인 실패!");
          alert(e.response.data.message);
        });


  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col lg={5}>
          <h1 className="text-center">LOGIN</h1>
          <br />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={submitEmail}
              autoComplete="off"
            />
            {email && !isEmailValid && (
              <Form.Text className="text-danger">
                올바른 형식의 이메일을 입력해주세요.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-5" controlId="formBasicPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={submitPassword}
              autoComplete="off"
            />
            {password && !isPasswordValid && (
              <Form.Text className="text-danger">
                올바른 비밀번호를 입력해주세요.
              </Form.Text>
            )}
          </Form.Group>

          <Stack>
            <Button
              className="mx-auto"
              variant="primary"
              type="submit"
              onClick={onClickLogin}
              disabled={!isAllValid}
            >
              로그인
            </Button>
            <Form.Text className="text-muted my-0 mx-auto">또는</Form.Text>
            <Button
              className="mx-auto"
              variant="secondary"
              type="submit"
              onClick={() => navigate("/register")}
            >
              회원가입
            </Button>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}
