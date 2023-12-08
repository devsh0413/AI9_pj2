import React, { useState, useContext, useMemo, useEffect } from "react";
import { Nav, Navbar, Container, Image, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import api from "../../utils/axiosConfig";
import { UserDispatchContext, UserStateContext } from "../../../Context/UserStateContext";

const navMenus = [
  { href: "/", label: "서비스 소개", public: true },
  { href: "/community", label: "커뮤니티", public: true },
  { href: "/habit", label: "나의 습관", public: false },
];

const sideMenus = [
  { href: "/userpage", label: "내 정보", public: false },
  { href: "/", label: "로그아웃", public: false },
  { href: "/login", label: "로그인", public: true },
  { href: "/register", label: "회원가입", public: true },
];


function Navigation() {
  const { user } = useContext(UserStateContext);
  const [isLogin, setIsLogin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  console.log('Navigation user', user);

  useEffect(() => {
    user ? setIsLogin(true) : setIsLogin(false);
  }, [user])

  const [filteredNavMenus, publicSideMenus, loginSideMenus] = useMemo(
    () => [
      navMenus.filter((menu) => menu.public !== isLogin),
      sideMenus.filter((menu) => menu.public === true),
      sideMenus.filter((menu) => menu.public === false),
    ], [isLogin]
  );

  const dispatch = useContext(UserDispatchContext);

  const handleClick = (e) => {
    const label = e.target.innerText;
    if (label === "로그아웃") {
      api.get("/users/logout")
      .then((res) => {
        console.log(res.data);
        dispatch({ type: "LOGOUT" });
      });
    }
  };

  const handleOffcanvasClose = () => {
    setShowOffcanvas(false);
  };
  const handleOffcanvasShow = () => {
    setShowOffcanvas(true);
  }
  
  return (
    <Navbar expand="False" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image src={logo} alt="logo" height="30" width="200" />
        </Navbar.Brand>
        <Nav className="d-flex flex-row ms-auto">
          {(isLogin ? navMenus : filteredNavMenus).map((menu, index) => (
            <Nav.Link
              key={`nav-menu-${index}`}
              className="me-3"
              style={{ fontSize: "85%" }}
              onClick={() => {
                navigate(menu.href);
              }}
            >
              {menu.label}
            </Nav.Link>
          ))}
        </Nav>
        <Navbar.Toggle>
          <Image
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="profile"
            roundedCircle
            height="30"
            width="30"
            onClick={() => handleOffcanvasShow()}
          />
        </Navbar.Toggle>
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-false"
          aria-labelledby="offcanvasNavbarLabel-expand-false"
          placement="end"
          show={showOffcanvas} onHide={handleOffcanvasClose}
        >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-false">
                <Image src={logo} alt="logo" height="30" width="200" />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {(isLogin ? loginSideMenus : publicSideMenus).map((menu, index) => (
                  <Nav.Link
                    key={`nav-menu-${index}`}
                    onClick={(e) => {
                      handleClick(e);
                      navigate(menu.href);
                      handleOffcanvasClose();
                    }}
                  >
                    {menu.label}
                  </Nav.Link>
                ))}
              </Nav>
            </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Navigation;

