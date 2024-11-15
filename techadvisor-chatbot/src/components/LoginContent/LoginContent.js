import React, { useState } from "react";
import axios from "axios";
import techAdvisor from "../../techAdvisor.png";
import "./LoginContent.css";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import CONFIG from "../../config";

const LoginContent = ({ onSubmit }) => {
  const [getName, setName] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getErrorHandling, setErrorHandling] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginSubmit = async () => {
    if (!getName) {
      setErrorHandling("Please fill in your Name.");
      return;
    }
    if (getEmail && !emailRegex.test(getEmail)) {
      setErrorHandling("Please enter a valid getEmail address.");
      return;
    }

    const formData = {
      username: getName,
      email: getEmail,
    };

    setErrorHandling("");

    try {
      const response = await axios.post(`${CONFIG.API_URL}/api/user`, formData);
      if (response.status === 200 || response.status === 201) {
        setName("");
        setEmail("");

        localStorage.setItem("user", JSON.stringify(formData));

        onSubmit(formData);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorHandling(err.response.data.error);
      } else {
        setErrorHandling("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-page-container">
      <img src={techAdvisor} style={{ width: "158px", marginBottom: "20px" }} />

      <input
        type="text"
        placeholder="Name"
        className="text-input"
        value={getName}
        onChange={(e) => setName(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <div
        className="getEmail-container"
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <input
          type="getEmail"
          placeholder="Email"
          className="text-input"
          value={getEmail}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", width: "90%", boxSizing: "border-box" }}
        />
        <Tooltip
          title="Please enter your getEmail address."
          placement="left"
          arrow
        >
          <InfoIcon style={{ cursor: "pointer", color: "white" }} />
        </Tooltip>
      </div>
      {getErrorHandling && (
        <p className="getErrorHandling-message">{getErrorHandling}</p>
      )}
      <button
        className="login-button"
        onClick={handleLoginSubmit}
        style={{ padding: "10px 20px", width: "100%", cursor: "pointer" }}
      >
        Next
      </button>
    </div>
  );
};

export default LoginContent;
