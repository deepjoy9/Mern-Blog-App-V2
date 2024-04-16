import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import { LOGIN_API } from "../utils/apiConstants";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // async function login(ev) {
  //   ev.preventDefault();
  //   setLoading(true);
  //   const response = await fetch(LOGIN_API, {
  //     method: "POST",
  //     body: JSON.stringify({ username, password }),
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   });
  //   if (response.ok) {
  //     response.json().then((userInfo) => {
  //       setUserInfo(userInfo);
  //       toast.success("You have successfully logged in.");
  //       setRedirect(true);
  //     });
  //   } else {
  //     toast.error("Wrong Credentials. Please try again");
  //   }
  //   setLoading(false);
  // }

  async function login(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        toast.success("You have successfully logged in.");
        setRedirect(true);
      } else {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Failed to log in. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      toast.error(
        error.message || "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>{loading ? "Loading..." : "Login"}</button>
    </form>
  );
};

export default LoginPage;
