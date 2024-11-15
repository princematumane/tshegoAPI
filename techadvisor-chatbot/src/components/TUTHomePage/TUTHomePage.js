import React, { useState, useEffect } from "react";
import techAdvisor from "../../techAdvisor.png";
import "./TUTHomePage.css";
import WelcomeContent from "../WelcomeContent/WelcomeContent";
import LoginContent from "../LoginContent/LoginContent";
import HomeContent from "../HomeContent/HomeContent";
import AdmissionContent from "../AdmissionContent/AdmissionContent";
import CampusContent from "../CampusContent/CampusContent"; // Import CampusContent
import FindCourseContent from "../FindCourseContent/FindCourseContent"; // Import FindCourseContent
import { useUser } from "../../UserContext/UserContext";

const TUTHomePage = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentContent, setCurrentContent] = useState("welcome");

  const { user, setCurrentUser, removeUser } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentContent("home");
    }
  }, []);

  const handleLogout = () => {
    removeUser();
  };

  const handleChatbotClick = () => {
    setShowChatbot(!showChatbot);
  };

  const handleWelcomeClick = () => {
    setCurrentContent("login");
  };

  const handleLoginSubmit = (user) => {
    console.log(user, "useruseruser");
    setCurrentUser(user);
    setCurrentContent("home");
  };

  const handleOptionSelect = (option) => {
    if (option === "Admission Requirements") {
      setCurrentContent("admission");
    }
    if (option === "Campus Offerings for Specific Courses") {
      setCurrentContent("campus");
    }
    if (option === "Find Courses based on APS and interests/major subjects") {
      setCurrentContent("findCourse");
    }
  };
  const handleFacultiesOptionSelect = (option) => {
    if (option === "Faculty of Arts and Design") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Economics and Finance") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Engineering and the Built") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Humanities") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Information and Communication") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Management Sciences") {
      setCurrentContent("admission");
    }
    if (option === "Faculty of Science") {
      setCurrentContent("admission");
    }
  };

  const handleCampusOptionSelect = (option) => {
    if (option === "Faculty of Arts and Design") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Economics and Finance") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Engineering and the Built") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Humanities") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Information and Communication") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Management Sciences") {
      setCurrentContent("campus");
    }
    if (option === "Faculty of Science") {
      setCurrentContent("campus");
    }
  };
  const getBackgroundStyle = () => {
    if (currentContent === "welcome" || currentContent === "login") {
      return { backgroundColor: "#34495e" };
    }
    return {};
  };

  return (
    <div>
      <header className="header">
        <div className="logo"></div>
        <nav className="navbar">
          <ul>
            <li>
              <a href="#study">Study@TUT</a>
            </li>
            <li>
              <a href="#news">Latest News</a>
            </li>
            <li>
              <a href="#apply">Apply Now</a>
            </li>
            <li>
              <a href="#campuses">Campuses</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="news" id="news">
        <h2> Hi, {user?.username || "Guest"} Latest News</h2>
        <ul></ul>
      </section>

      <footer className="footer">
        <p>Contact Us: Tel: 086 110 2421 | Email: general@tut.ac.za</p>
      </footer>

      <div className="chatbot-icon" onClick={handleChatbotClick}>
        <img src={techAdvisor} alt="TechAdvisor Chatbot" />
      </div>

      {showChatbot && (
        <div className="chatbot-window" style={getBackgroundStyle()}>
          {/* Render navbar only for home, admission, campus, and findCourse */}
          {(currentContent === "home" ||
            currentContent === "admission" ||
            currentContent === "campus" ||
            currentContent === "findCourse") && (
            <div className="chatbot-navbar">
              <div className="chat-header">
                <div>
                  <img
                    src={techAdvisor}
                    style={{ width: "40px", marginLeft: "30px" }}
                    alt="TechAdvisor Logo"
                    className="logo"
                  />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <h2>TechAdvisor</h2>
                </div>
              </div>
            </div>
          )}

          {/* Chatbot Content */}
          <div className="chatbot-content">
            {currentContent === "welcome" && (
              <WelcomeContent onWelcomeButtonClick={handleWelcomeClick} />
            )}
            {currentContent === "login" && (
              <LoginContent onSubmit={handleLoginSubmit} />
            )}
            {currentContent === "home" && (
              <HomeContent user={user} onOptionSelect={handleOptionSelect} />
            )}
            {currentContent === "admission" && (
              <AdmissionContent
                user={user}
                onOptionSelect={handleFacultiesOptionSelect}
              />
            )}
            {currentContent === "campus" && (
              <CampusContent
                user={user}
                onOptionSelect={handleCampusOptionSelect}
              />
            )}
            {currentContent === "findCourse" && <FindCourseContent />}
          </div>
        </div>
      )}
    </div>
  );
};

export default TUTHomePage;
