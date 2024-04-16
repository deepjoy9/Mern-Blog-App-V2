import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { REGISTER_API } from "../utils/apiConstants";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }
      setRedirect(true);
      toast.success("User registered successfully");
    } catch (error) {
      console.error("Error during registration:", error.message);
      toast.error(error.message || "An unexpected error occurred");
    }
    setLoading(false);
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
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
      <button>{loading ? "Loading..." : "Register"}</button>
    </form>
  );
};

export default RegisterPage;
