import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import { Col, Button, Container, Image, Form, Row } from "react-bootstrap";
import "./UserPage.css";
import { UserContext } from "../../../Context/UserContext";


const UserPageForm = (props) => {
  const { userInfo } = props;
  const { userName, userImg, userEmail, password, passwordCheck } = userInfo;
  const [image, setImage] = useState(userImg);
  const fileInput = useRef(null);

  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    userFormName: userName,
    userFormImg: image,
    userFormPassword: password,
    userFormPasswordCheck: passwordCheck,
  });


  // createObjectURL 방식
  const onImageChange = (e) => {
    handleInputChange(e);
    const uploadImg = e.target.files[0];
    if (image) URL.revokeObjectURL(image);

    const imgUrl = URL.createObjectURL(uploadImg);
    setImage(imgUrl);
  };

  const handleInputChange = (e) => {
    if (e.target.type === "file") {
      const id = "userFormImg";
      const value = e.target.files[0];
      setForm((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    } else {
      const { id, value } = e.target;
      setForm((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const editing = (e) => {
    e.preventDefault();
    if (form.userFormPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    if (form.userFormPassword !== form.userFormPasswordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    const formData = new FormData();
    formData.append("username", form.userFormName);
    formData.append("file", form.userFormImg);
    formData.append("password", form.userFormPassword);


    api
      .put("/users", formData)
      .then((res) => {
        const userinfo = {
          username: form.userFormName,
          email: userEmail,
          // level: level,

          img_url: form.userFormImg,
        };
        setUser(userinfo);
        alert("회원정보 수정이 완료되었습니다.");
        navigate("/userpage");
      })
      .catch((err) => {
        const error = err.response.data;
        if (error.statusCode === 409) {
          alert(error.message);
        } else {
          alert("회원정보 수정에 실패했습니다. 다시 시도해주세요.");
        }
      });
  };

  const deleteUser = () => {
    if (window.confirm("정말 탈퇴하시겠습니까? 😭")) {
      api
      .delete("/users")
      .then((res) => {
        setUser(null);
        alert("탈퇴되었습니다. 감사합니다.");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      })
    } return
  };

  return (
    <>
      <Container className="mb-3 center-container mt-5">
        <Col className="center-content mb-3">
          <div className="mb-3 username" style={{ fontSize: "1.5rem" }}>
            <span style={{ fontWeight: "bold", fontSize: "30px" }}>
              {userName}
            </span>
            님의 마이페이지
          </div>
          <Col className="mb-3">
            <Image src={image} roundedCircle height="200" width="200" />
          </Col>
          <label htmlFor="fileInput" id="fileInput-text">
            프로필 사진 변경
            <input
              type="file"
              id="fileInput"
              accept="image/jpg, image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={onImageChange}
              ref={fileInput}
            />
          </label>
          <Row className="mt-3">
            <Col>{userEmail}</Col>
          </Row>
          <Col className="mt-3" sm={{ span: 6, offset: 3 }}>
            <Form>
              <Form.Group className="mb-3" controlId="userFormName">
                <Form.Control
                  placeholder="닉네임"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="userFormPassword">
                <Form.Control
                  type="password"
                  placeholder="비밀번호"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="userFormPasswordCheck">
                <Form.Control
                  type="password"
                  placeholder="비밀번호 확인"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button
                className="mb-5"
                variant="primary"
                type="submit"
                onClick={(e) => editing(e)}
              >
                변경사항 저장
              </Button>
            </Form>
            <Button
              className="bg-body-tertiary btn text-black"
              variant="secondary"
              type="submit"
              size="sm"
              onClick={() => deleteUser()}
            >
              회원탈퇴
            </Button>
          </Col>
        </Col>
      </Container>
    </>
  );
};

export default UserPageForm;
