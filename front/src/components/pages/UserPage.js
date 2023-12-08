import React, { useEffect, useContext } from "react";
import UserPageForm from "../features/user/UserPageForm";
import api from "../utils/axiosConfig";
import { UserContext } from "../../Context/UserContext";

const UserPage = () => {
  const { user } = useContext(UserContext);

  const fetchData = async () => {
    try {
      await api.get("users/user");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const userInfo = {
    userName: user && user.username,
    userImg: user && (user.img_url ? user.img_url :
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"),
    userEmail: user && user.email,
    password: "",
    passwordCheck: "",
  };

  return (
    <>
      <UserPageForm userInfo={userInfo} />
    </>
  );
};

export default UserPage;
