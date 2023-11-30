import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "../features/Register/validate";

export default function RegisterPage() {
  const navigate = useNavigate();

  //email, password, confirmPassword, Nickname 상태 생성
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [username, setUsername] = useState("");
  // const [idErrMsg, setIdErrMsg] = useState("");
  // const [idCheckMsg, setIdCheckMsg] = useState("");

  //이메일 형태 적합 여부 확인
  const isEmailValid = validateEmail(email);
  // 비밀번호가 8글자 이상인지 여부 확인
  const isPasswordValid = validatePassword(password);
  // 비밀번호와 확인용 비밀번호 일치 여부를 확인
  const isPasswordSame = password === confirmPwd;
  // 닉네임 형태 및 길이 적합 여부를 확인.
  const isUsernameValid = validateUsername(username);

  // 위 4개 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid =
    isEmailValid && isPasswordValid && isPasswordSame && isUsernameValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "user/register" 엔드포인트로 post요청함.
      await axios.post("http://" + window.location.hostname + ":5001/users", {
        email,
        password,
        username,
      });
      navigate("/login");
    } catch (e) {
      if (e.response.data.message === "이미 등록된 이메일입니다.") {
        alert("이미 사용중인 이메일입니다.");
      } else if (e.response.data.message === "이미 사용중인 사용자명입니다.") {
        alert("이미 사용중인 닉네임입니다.");
      }
    }
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col lg={5}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="registerEmail">
            <Form.Label>이메일 주소</Form.Label>
            <Form.Control
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailValid && (
              <Form.Text className="text-success">
                이메일 형식이 올바르지 않습니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="registerPassword" className="mt-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isPasswordValid && (
              <Form.Text className="text-success">
                비밀번호는 8글자 이상부터 설정 가능합니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="registerConfirmPassword" className="mt-3">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              autoComplete="off"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
            {!isPasswordSame && (
              <Form.Text className="text-success">
                비밀번호가 일치하지 않습니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="registerName" className="mt-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {!isUsernameValid && (
              <Form.Text className="text-success">
                2~8자로 설정 가능합니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button
                variant="primary"
                type="submit"
                // onClick={handleSubmit}
                disabled={!isFormValid}
              >
                회원가입
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
