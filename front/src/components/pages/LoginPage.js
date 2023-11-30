import React, { useState, useContext } from 'react';
import { Button, Form, Stack, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from "react-router";
import axios from 'axios';
import { UserDispatchContext } from "../../Context/UserStateContext";


export default function LoginPage() {

  const navigate = useNavigate();
  const dispatch = useContext(UserDispatchContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일, 패스워드 입력 시, 각 state에 저장
  const submitEmail = (e) => setEmail(e.target.value);
  const submitPassword = (e) => setPassword(e.target.value);

  // 정규표현식으로 이메일 유효성 검사
  const regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const validateEmail = (email) => email.match(regexp);

  // 이메일, 패스워드 규칙 확인 (안내 문구 표시, 로그인 버튼 활성화)
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isAllValid = isEmailValid && isPasswordValid;

  // 로그인 버튼 클릭 시, API post 요청
  const onClickLogin = (e) => {
    e.preventDefault();
    // TODO : API_URL 정의해두고 사용, api config 파일 추가
    axios.post("http://"+ window.location.hostname +":5001/users/login",
      JSON.stringify({
        email,
        password,
      }),
      {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then((res) => {
        const user = res.data.user;
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: user,
        });
        alert(`${user.username}님 환영합니다!`);
        navigate("/habit", { replace: true });
  
      })
      .catch((err) => console.log("로그인 실패!",err));

  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col lg={5}>
          <h1 className="text-center">LOGIN</h1><br/>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={submitEmail}
              autoComplete="off"
            />
            {email && !isEmailValid &&
              (<Form.Text className="text-danger">
              올바른 형식의 이메일을 입력해주세요.
              </Form.Text>)
            }
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
            {password && !isPasswordValid &&
              (<Form.Text className="text-danger">
                올바른 비밀번호를 입력해주세요.
              </Form.Text>)
            }
          </Form.Group>

          <Stack>
            <Button className="mx-auto" variant="primary" type="submit" onClick={onClickLogin} disabled={!isAllValid}>
              로그인
            </Button>
            <Form.Text className="text-muted my-0 mx-auto" >
              또는
            </Form.Text>
            <Button className="mx-auto" variant="secondary" type="submit" onClick={()=> navigate("/register")}>
              회원가입
            </Button>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}
