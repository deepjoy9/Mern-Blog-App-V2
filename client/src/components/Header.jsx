import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import { LOGOUT_API, USER_PROFILE_API } from "../utils/apiConstants";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  async function fetchUserProfile() {
    try {
      const response = await fetch(USER_PROFILE_API, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const userInfo = await response.json();
      setUserInfo(userInfo);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
  useEffect(() => {
    fetchUserProfile();
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
      <nav
        className={`nav-links ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
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
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>
    </header>
  );
};

export default Header;
