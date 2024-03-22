import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = (props) => {
  const { userInfo } = useContext(UserContext);
  const { Component } = props;
  const navigate = useNavigate();

  //Redirect to Index page if userInfo is not available
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div>
      <Component />
    </div>
  );
};

export default ProtectedRoute;
