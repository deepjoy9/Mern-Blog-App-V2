import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import { LOGOUT_API, USER_PROFILE_API } from "../utils/apiConstants";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(USER_PROFILE_API, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  async function logout() {
    try {
      const response = await fetch(LOGOUT_API, {
        credentials: "include",
        method: "POST",
      });
      if (response.ok) {
        toast.error("You have been successfully logged out.");
        setUserInfo(null);
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Dev Diary
      </Link>
      <nav>
        <Link to="/" className="all-posts">
          All Posts
        </Link>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <Link to="/myposts">My Posts</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
