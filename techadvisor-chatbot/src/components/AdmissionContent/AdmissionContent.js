import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdmissionContent.css";
import techAdvisor from "../../techAdvisor.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CONFIG from "../../config";

const AdmissionContent = ({ user, onOptionSelect }) => {
  const [getCourseByfaculties, setCourseByFaculties] = useState([]);
  const [getDisplayedChatMessages, setDisplayedChatMessages] = useState([]);
  const [getMessageTypingIndex, setMessageTypingIndex] = useState(0);
  const [getAllDisplayedMessages, setAllDisplayedMessages] = useState(false);
  const [getSelectedFacultyMessage, setSelectedFacultyMessage] = useState(null);
  const [getSelectedFacultyCourses, setSelectedFacultyCourses] = useState([]);
  const [getSelectedFacultyCourse, setSelectedFacultyCourse] = useState(null);
  const [getFacultyCoursePage, setFacultyCoursePage] = useState(1);
  const [admissionRequirements, setAdmissionRequirements] = useState([]);
  const [applicantType, setApplicantType] = useState(null); // New state for selected applicant type
  const [admissionDetails, setAdmissionDetails] = useState(null); // New state for admission details

  const facultyCoursesPerPage = 5;
  const userInitialMessage =
    "I would like to know the admission requirements for the course I want to study";

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const responseData = await axios.get(
          `${CONFIG.API_URL}/api/faculty_data`
        );

        const facultyDataList = Object.keys(responseData.data);

        if (Array.isArray(facultyDataList) && facultyDataList.length > 0) {
          setCourseByFaculties(facultyDataList);
        } else {
          setCourseByFaculties([]);
        }

        setDisplayedChatMessages([
          { text: userInitialMessage, sender: "user" },
          {
            text: `Great, choose the faculty that the course falls under:`,
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Error fetching getCourseByfaculties:", error);
      }
    };

    fetchFacultyData();
  }, []);

  useEffect(() => {
    if (getMessageTypingIndex < getDisplayedChatMessages.length) {
      const message = getDisplayedChatMessages[getMessageTypingIndex].text;
      let getCurrentMessage = "";
      let indexChar = 0;

      const typeInterval = setInterval(() => {
        getCurrentMessage += message[indexChar];
        indexChar++;

        if (indexChar >= message.length) {
          clearInterval(typeInterval);
          setMessageTypingIndex(getMessageTypingIndex + 1);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    } else if (getMessageTypingIndex === getDisplayedChatMessages.length) {
      setAllDisplayedMessages(true);
    }
  }, [getDisplayedChatMessages, getMessageTypingIndex]);

  const handleOptionClick = (faculty) => {
    setSelectedFacultyMessage(faculty);
    setFacultyCoursePage(1);

    axios
      .get(`${CONFIG.API_URL}/api/faculty_data`)
      .then((res) => {
        const getSelectedFacultyCourses = res.data[faculty].map(
          (course) => course.course_name
        );
        setSelectedFacultyCourses(getSelectedFacultyCourses);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    onOptionSelect(faculty);
  };

  const handleCourseClick = (course) => {
    setSelectedFacultyCourse(course);

    axios
      .get(`${CONFIG.API_URL}/api/faculty_data`)
      .then((res) => {
        const facultyData = Object.values(res.data).flat();
        const courseData = facultyData.find((c) => c.course_name === course);
        if (courseData) {
          const admissionCriteria =
            courseData["Admission requirement(s) and Selection criteria"];

          const requirements = admissionCriteria.map((criteria) => {
            const key = Object.keys(criteria)[0];
            return {
              applicantType: key,
              admissionRequirement: criteria[key]["Admission requirement(s)"],
              selectionCriteria: criteria[key]["Selection criteria"],
            };
          });

          setAdmissionRequirements(requirements);
        }
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  };

  const handleApplicantTypeSelect = (type) => {
    setApplicantType(type);
    const req = admissionRequirements.find((req) => req.applicantType === type);
    if (req) {
      const admissionRequirement = req.admissionRequirement.replace(
        /â€™/g,
        "'"
      );
      const selectionCriteria = req.selectionCriteria.replace(/â€™/g, "'");

      const admissionInfo = (
        <>
          <strong>Admission Requirements:</strong> {admissionRequirement}
          <br />
          <br />
          <strong>Selection Criteria:</strong> {selectionCriteria}
        </>
      );
      setAdmissionDetails(admissionInfo);
    }
  };

  const handleShowMore = () => {
    setFacultyCoursePage(getFacultyCoursePage + 1);
  };

  return (
    <div>
      <div className="chatbot-chats">
        {getDisplayedChatMessages.map((msg, index) => (
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
              <div className="user-profile">
                <AccountCircleIcon
                  style={{ width: "32px", marginLeft: "95%" }}
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

      {getAllDisplayedMessages && (
        <button className="faculty-options">
          <h5>Choose a faculty to learn more:</h5>
          {getCourseByfaculties.map((faculty, index) => (
            <button
              key={index}
              className="faculty-option"
              onClick={() => handleOptionClick(faculty)}
            >
              {faculty}
            </button>
          ))}
        </button>
      )}

      {getSelectedFacultyMessage && (
        <div className={`chatbot-chat user-message`}>
          <div className="user-profile">
            <AccountCircleIcon style={{ width: "32px", marginLeft: "95%" }} />
          </div>
          <div className="chatbot-bubble user-bubble">
            <p style={{ fontSize: "small", whiteSpace: "pre-wrap" }}>
              {getSelectedFacultyMessage}
            </p>
          </div>
        </div>
      )}

      {getSelectedFacultyCourses.length > 0 && (
        <button className="faculty-options">
          <h5>Courses offered by {getSelectedFacultyMessage}:</h5>
          {getSelectedFacultyCourses
            .slice(0, getFacultyCoursePage * facultyCoursesPerPage)
            .map((course, index) => (
              <button
                key={index}
                className="faculty-option"
                onClick={() => handleCourseClick(course)}
              >
                {course.toLowerCase()}
              </button>
            ))}
          {getSelectedFacultyCourses.length >
            getFacultyCoursePage * facultyCoursesPerPage && (
            <button className="show-more-option" onClick={handleShowMore}>
              Show More
            </button>
          )}
        </button>
      )}

      {getSelectedFacultyCourse && (
        <div className={`chatbot-chat user-message`}>
          <div className="user-profile">
            <AccountCircleIcon style={{ width: "32px", marginLeft: "95%" }} />
          </div>
          <div className="chatbot-bubble user-bubble">
            <p
              style={{
                fontSize: "small",
                whiteSpace: "pre-wrap",
                textTransform: "capitalize",
              }}
            >
              {getSelectedFacultyCourse.toLowerCase()}
            </p>
          </div>
        </div>
      )}

      {admissionRequirements.length > 0 && (
        <button className="faculty-options">
          <h5>
            Admission Requirements and Selection Criteria For{" "}
            {getSelectedFacultyCourse.toLowerCase()}:
          </h5>
          {admissionRequirements.map((req, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => handleApplicantTypeSelect(req.applicantType)}
              >
                <strong>{req.applicantType.replace(/â€¢/g, "")}:</strong>
              </button>
            </div>
          ))}
        </button>
      )}
      {applicantType && (
        <div className={`chatbot-chat user-message`}>
          <div className="user-profile">
            <AccountCircleIcon style={{ width: "32px", marginLeft: "95%" }} />
          </div>
          <div className="chatbot-bubble user-bubble">
            <p style={{ fontSize: "small", whiteSpace: "pre-wrap" }}>
              You selected: {applicantType.toLowerCase().replace(/â€¢/g, "")}
            </p>
          </div>
        </div>
      )}
      {admissionDetails && (
        <div className={`chatbot-chat bot-message`}>
          <div className="chatbot-avatar">
            <img
              src={techAdvisor}
              style={{ width: "32px" }}
              alt="TechAdvisor Logo"
              className="option-icon"
            />
          </div>
          <div className="chatbot-bubble bot-bubble">
            <p style={{ fontSize: "small", whiteSpace: "pre-wrap" }}>
              {" "}
              {admissionDetails}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionContent;
