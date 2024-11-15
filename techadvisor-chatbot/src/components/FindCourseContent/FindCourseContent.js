import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindCourseContent.css";
import techAdvisor from "../../techAdvisor.png";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CONFIG from "../../config";

const FindCourseContent = () => {
  const [getFaculties, setFaculties] = useState([]);
  const [getdisplayedMessages, setDisplayedMessages] = useState([]);
  const [getinputValue, setInputValue] = useState("");
  const [getselectedSubjects, setSelectedSubjects] = useState([]);
  const [APS, setAPS] = useState(null);
  const initialUserMessage =
    "Are you not sure which course you want to study? I can help you with recommending courses that you qualify for.";

  useEffect(() => {
    const fetchTheFaculties = async () => {
      try {
        const getResponse = await axios.get(
          `${CONFIG.API_URL}/api/faculty_data`
        );
        let getAllCourses = [];

        Object.keys(getResponse.data).forEach((nameOfFaculty) => {
          const getFacultyCourses = getResponse.data[nameOfFaculty];

          getFacultyCourses.forEach((course) => {
            const getcourseName = course.course_name;
            const getadmissionCriteria =
              course["Admission requirement(s) and Selection criteria"];

            if (getadmissionCriteria && Array.isArray(getadmissionCriteria)) {
              getadmissionCriteria.forEach((criteria) => {
                const getcriteriaKey = Object.keys(criteria)[0];
                const getselection =
                  criteria[getcriteriaKey]?.["Selection criteria"];
                const getrequirements =
                  criteria[getcriteriaKey]?.["Admission requirement(s)"];

                if (getselection) {
                  const getapsMatch = getselection.match(/ of at least (\d+)/i);
                  const getapsNumber = getapsMatch ? getapsMatch[1] : null;

                  if (getapsNumber) {
                    getAllCourses.push({
                      course_name: getcourseName,
                      admission_getrequirements: getrequirements,
                      getselection_criteria: getapsNumber,
                    });
                  }
                }
              });
            }
          });
        });

        setFaculties(getAllCourses);
        setDisplayedMessages([
          { text: initialUserMessage, sender: "bot" },
          {
            text: "Input your Admission Point Score (APS) (excluding Life Orientation) as a number, e.g., 20 not twenty:",
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Error fetching getFaculties:", error);
      }
    };

    fetchTheFaculties();
  }, []);

  const handleAPSandMajorSubjects = () => {
    if (getinputValue.trim()) {
      const getapsScore = parseInt(getinputValue, 10);
      if (!isNaN(getapsScore)) {
        setAPS(getapsScore);
        const userNewMessage = {
          text: `Your APS is: ${getapsScore}`,
          sender: "user",
        };
        setDisplayedMessages([...getdisplayedMessages, userNewMessage]);
        setInputValue("");

        setTimeout(() => {
          const techAdvisorChatbotReply = {
            text: "Please select your 3 major subjects from the options below.",
            sender: "bot",
            type: "select-subjects",
          };
          setDisplayedMessages((prevMessages) => [
            ...prevMessages,
            techAdvisorChatbotReply,
          ]);
        }, 1000);
      } else {
        const techAdvisorChatbotReply = {
          text: "Please enter a valid APS number.",
          sender: "bot",
        };
        setDisplayedMessages([
          ...getdisplayedMessages,
          techAdvisorChatbotReply,
        ]);
      }
    }
  };

  const handleMajorSubjectChange = (event) => {
    const value = event.target.value;
    setSelectedSubjects((prevSelectedSubjects) => {
      if (prevSelectedSubjects.includes(value)) {
        return prevSelectedSubjects.filter((subject) => subject !== value);
      } else if (prevSelectedSubjects.length < 3) {
        return [...prevSelectedSubjects, value];
      }
      return prevSelectedSubjects;
    });
  };

  const handleSubmitMajorSubjects = () => {
    if (getselectedSubjects.length > 0) {
      const userSelectedSubjectsMessage = {
        text: `My Major subjects are: ${getselectedSubjects.join(", ")}`,
        sender: "user",
      };
      setDisplayedMessages([
        ...getdisplayedMessages,
        userSelectedSubjectsMessage,
      ]);

      const getrecommendedCourses = getFaculties.filter((course) => {
        const courseAPS = parseInt(course.getselection_criteria, 10);
        const getapsMatch = APS == courseAPS;

        const getsubjectRequirements = course.admission_getrequirements || "";
        const getsubjectMatch = getselectedSubjects.some((subject) => {
          const getformattedSubject = subject.toLowerCase();
          return getsubjectRequirements
            .toLowerCase()
            .includes(getformattedSubject);
        });

        return getapsMatch && getsubjectMatch;
      });

      const getuniqueCourses = [
        ...new Set(
          getrecommendedCourses.map((course) =>
            course.course_name.toLowerCase()
          )
        ),
      ];
      const gettotalCourses = getuniqueCourses.length;

      if (gettotalCourses > 0) {
        let techAdvisorChatbotReply = `Based on your APS and selected subjects, I recommend ${gettotalCourses} course${
          gettotalCourses > 1 ? "s" : ""
        }:\n`;
        getuniqueCourses.forEach((course) => {
          techAdvisorChatbotReply += `• ${course}\n`;

        });
        setDisplayedMessages((prevMessages) => [
          ...prevMessages,
          { text: techAdvisorChatbotReply, sender: "bot" },
        ]);
      } else {
        const techAdvisorChatbotReply = {
          text: "Unfortunately, no courses match your APS and selected subjects.",
          sender: "bot",
        };
        setDisplayedMessages((prevMessages) => [
          ...prevMessages,
          techAdvisorChatbotReply,
        ]);
      }
    } else {
      const techAdvisorChatbotReply = {
        text: "Please select at least one subject.",
        sender: "bot",
      };
      setDisplayedMessages((prevMessages) => [
        ...prevMessages,
        techAdvisorChatbotReply,
      ]);
    }
  };

  return (
    <div>
      <div className="chatbot-chats">
        {getdisplayedMessages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-chat ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
            style={{ fontSize: "13px" }}
          >
            {msg.sender === "bot" && (
              <div className="chatbot-avatar">
                <img
                  src={techAdvisor}
                  style={{ width: "32px" }}
                  alt="TechAdvisor Logo"
                />
              </div>
            )}
            {msg.sender === "user" && (
              <div className="user-profile">
                <AccountCircleIcon
                  style={{ width: "32px", marginLeft: "95%" }}
                />{" "}
              </div>
            )}
            <div
              className={`chatbot-bubble ${
                msg.sender === "user" ? "user-bubble" : "bot-bubble"
              }`}
              style={{ fontSize: "13px", whiteSpace: "pre-wrap" }}
            >
              {msg.type === "select-subjects" ? (
                <div>
                  <p>{msg.text}</p>
                  <FormGroup className="">
                    {[
                      "Mathematics",
                      "English (HL or FAL)",
                      "Mathematical Literacy",
                      "Physical Sciences",
                      "Technical Mathematics",
                      "Accounting",
                      "Engineering Sciences N3",
                      "Hospitality Studies",
                      "Tourism",
                      "Life Sciences",
                    ].map((subject) => (
                      <FormControlLabel
                        control={<Checkbox />}
                        label={subject}
                        value={subject}
                        onChange={handleMajorSubjectChange}
                        checked={getselectedSubjects.includes(subject)}
                        label={<span style={{ fontSize: "13px" }}>{subject}</span>}
                        disabled={
                          getselectedSubjects.length >= 3 &&
                          !getselectedSubjects.includes(subject)
                        }
                      />
                    ))}
                    <br />

                    <button
                      className="show-more-option"
                      onClick={handleSubmitMajorSubjects}
                    >
                      Click and see courses you qualify
                    </button>
                  </FormGroup>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="techAdvisor-chatbot-input-areas">
        <input
          type="text"
          placeholder="what is your Admission Point Score?"
          value={getinputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" ? handleAPSandMajorSubjects() : null
          }
          className="techAdvisor-chatbot-input"
        />
        <button
          onClick={handleAPSandMajorSubjects}
          className="techAdvisor-chatbot-send-button"
        >
          ➤
        </button>
      </div> */}
      <div className="techAdvisor-chatbot-container">
  <div className="techAdvisor-chatbot-getMessages">
    {/* Chat messages go here */}
  </div>

  <div className="techAdvisor-chatbot-input-areas">
    <input
      type="text"
      placeholder="what is your Admission Point Score?"
      value={getinputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={(e) =>
        e.key === "Enter" ? handleAPSandMajorSubjects() : null
      }
      className="techAdvisor-chatbot-input"
    />
    <button
      onClick={handleAPSandMajorSubjects}
      className="techAdvisor-chatbot-send-button"
    >
      ➤
    </button>
  </div>
</div>

    </div>
  );
};

export default FindCourseContent;
