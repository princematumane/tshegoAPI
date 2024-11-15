// SharedContent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import techAdvisor from "../../techAdvisor.png";
import "./SharedContent.css"; // Create a CSS file for shared styles
import CONFIG from "../../config";

const SharedContent = ({ onOptionSelect, initialUserMessage }) => {
  const [faculties, setFaculties] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false);
  const [selectedFacultyMessage, setSelectedFacultyMessage] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [coursePage, setCoursePage] = useState(1);
  const coursesPerPage = 5;

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${CONFIG.API_URL}/api/faculty_data`);
        const facultyList = Object.keys(response.data);

        if (Array.isArray(facultyList) && facultyList.length > 0) {
          setFaculties(facultyList);
        } else {
          setFaculties([]);
        }

        setDisplayedMessages([
          { text: initialUserMessage, sender: "user" },
          {
            text: `Choose the faculty that course falls under:`,
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchFaculties();
  }, [initialUserMessage]);

  useEffect(() => {
    if (messageIndex < displayedMessages.length) {
      const message = displayedMessages[messageIndex].text;
      let currentMessage = "";
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        currentMessage += message[charIndex];
        charIndex++;

        if (charIndex >= message.length) {
          clearInterval(typeInterval);
          setMessageIndex(messageIndex + 1);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    } else if (messageIndex === displayedMessages.length) {
      setAllMessagesDisplayed(true);
    }
  }, [displayedMessages, messageIndex]);

  return (
    <div>
      <div className="chatbot-chats">
        {displayedMessages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-chat ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="chatbot-avatar">
                <img
                  src={techAdvisor}
                  style={{ width: "32px" }}
                  alt="TechAdvisor Logo"
                  className="option-icon"
                />
              </div>
            )}
            {msg.sender === "user" && (
              <div className="user-avatar">
                <img
                  src={techAdvisor}
                  style={{ width: "32px", marginLeft: "95%" }}
                  alt="User Avatar"
                />
              </div>
            )}
            <div
              className={`chatbot-bubble ${
                msg.sender === "user" ? "user-bubble" : "bot-bubble"
              }`}
            >
              <p style={{ fontSize: "small", whiteSpace: "pre-wrap" }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedContent;
