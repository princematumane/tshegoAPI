import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomeContent.css";
import techAdvisor from "../../techAdvisor.png";
import SubjectIcon from "@mui/icons-material/Subject";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CONFIG from "../../config";

const HomeContent = ({ user, onOptionSelect }) => {
  const [getMessages, setMessages] = useState([]);
  const [getUserMessages, setUserMessages] = useState([]);
  const [getInputValue, setInputValue] = useState("");
  const [getDisplayedMessages, setDisplayedMessages] = useState([]);
  const [getMessageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true); // Start with typing dots visible
  //   const [query, setQuery] = useState("");
  //   const [response, setResponse] = useState("");
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBotMessages = async () => {
      try {
        const getResponse = await axios.get(`${CONFIG.API_URL}/api/message`);
        const getHelpResponse = await axios.get(`${CONFIG.API_URL}/api/help`);

        setMessages([
          {
            text: `Hi ${user.username || "Guest"}, ${getResponse.data.message}`,
          },
          { text: getHelpResponse.data.message },
        ]);
      } catch (error) {
        console.error("Error fetching the Messages:", error);
      }
    };

    fetchBotMessages();
  }, [user.username]);

  useEffect(() => {
    if (getMessageIndex < getMessages.length) {
      setIsTyping(true); // Show typing dots

      // Simulate a delay before displaying the actual message (e.g., 3 seconds)
      const typingTimeout = setTimeout(() => {
        const message = getMessages[getMessageIndex].text;
        const getTimeStamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setDisplayedMessages((prev) => {
          const getUpdatedMessages = [...prev];
          getUpdatedMessages[getMessageIndex] = {
            text: message,
            getTimeStamp,
            showTimestamp: true,
          };
          return getUpdatedMessages;
        });
        setIsTyping(false); // Hide typing dots once message is displayed
        setMessageIndex(getMessageIndex + 1);
      }, 3000); // 3 seconds typing delay

      return () => clearTimeout(typingTimeout);
    }
  }, [getMessages, getMessageIndex]);

  const handleEnrolmentOptionClick = (userOption) => {
    setUserMessages([...getUserMessages, { text: userOption }]);
    onOptionSelect(userOption);
  };

  const handleSend = async () => {
    if (getInputValue.trim()) {
      setDisplayedMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: getInputValue }
      ]);

      const userMessage = getInputValue;
      setInputValue("");
      setIsTyping(true);

      try {
        // Send request to the new API endpoint
        const response = await axios.post("http://localhost:5000/api/lex", { query: userMessage, username: user.username });
        const botResponse = response.data.messages[0].content;

        // Display bot response
        setDisplayedMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse }
        ]);
      } catch (error) {
        console.error("Error sending the user message:", error);
        setError("There was an error retrieving the response.");
      } finally {
        setIsTyping(false);
      }
    }
  };

  
  return (
    <div>
      <div className="techAdvisor-chatbot-getMessages">
        {getDisplayedMessages.map((msg, index) => (
          <div key={index} className="techAdvisor-chatbot-message">
            <div className="techAdvisor-chatbot-avatar">
              <img
                src={techAdvisor}
                style={{ width: "32px" }}
                alt="TechAdvisor Logo"
                className="userOption-icon"
              />
            </div>
            <div className="techAdvisor-chatbot-bubble">
              <p style={{ fontSize: "small" }}>{msg.text}</p>
              {msg.showTimestamp && (
                <div className="getTimeStamp">
                  <h6>{msg.getTimeStamp}</h6>
                </div>
              )}
            </div>
            {msg.sender === "user" && (
              <div className="user-profile">
                <AccountCircleIcon
                  style={{ width: "32px", marginLeft: "95%" }}
                />{" "}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="techAdvisor-chatbot-message bot">
            <div className="techAdvisor-chatbot-avatar">
              <img
                src={techAdvisor}
                style={{ width: "32px" }}
                alt="TechAdvisor Logo"
                className="userOption-icon"
              />
            </div>
            <div className="techAdvisor-chatbot-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Only display options when all messages have been displayed */}
      {getMessageIndex === getMessages.length && !isTyping && (
        <div className="techAdvisor-chatbot-message">
          <div className="techAdvisor-chatbot-avatar">
            <img
              src={techAdvisor}
              style={{ width: "32px" }}
              alt="TechAdvisor Logo"
              className="userOption-icon"
            />
          </div>
          <div className="techAdvisor-chatbot-bubble">
            <h5>Choose from below...</h5>
            <button
              className="techAdvisor-chatbot-userOption"
              onClick={() =>
                handleEnrolmentOptionClick("Admission Requirements")
              }
            >
              <SchoolIcon style={{ marginRight: "10px" }} />
              Admission Requirements
            </button>
            <button
              className="techAdvisor-chatbot-userOption"
              onClick={() =>
                handleEnrolmentOptionClick(
                  "Campus Offerings for Specific Courses"
                )
              }
            >
              <SubjectIcon style={{ marginRight: "10px" }} />
              Campus Offerings for Specific Courses
            </button>
            <button
              className="techAdvisor-chatbot-userOption"
              onClick={() =>
                handleEnrolmentOptionClick(
                  "Find Courses based on APS and interests/major subjects"
                )
              }
            >
              <SchoolIcon style={{ marginRight: "10px" }} />
              Find Courses based on APS and interests/major subjects
            </button>
          </div>
        </div>
      )}
      <div className="techAdvisor-chatbot-input-areas">
        <input
          type="text"
          placeholder="type your query here.."
          value={getInputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" ? handleSend() : null
          }
          className="techAdvisor-chatbot-input"
        />
        <button
          onClick={handleSend}
          className="techAdvisor-chatbot-send-button"
        >
          ➤
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HomeContent;
