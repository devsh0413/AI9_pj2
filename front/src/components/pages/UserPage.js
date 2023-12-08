import React, { useEffect, useContext } from "react";
import UserPageForm from "../features/user/UserPageForm";
import api from "../utils/axiosConfig";
import { UserStateContext } from "../../Context/UserStateContext";

const UserPage = () => {
  const { user } = useContext(UserStateContext);

  const fetchData = async () => {
    try {
      const res = await api.get("users/user");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const userInfo = {
    userName: user && user.username,
    userImg: user && (user.imgurl ? user.imgurl :
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

