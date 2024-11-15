// import axios from 'axios';

// const CONFIG.API_URL = 'https://ezwmd5bfs5.execute-api.eu-central-1.amazonaws.com/dev/courses'; // Replace with your API Gateway URL

// export const fetchCourseDetails = async (query_type, course_name) => {

//     try {
//         const response = await axios.post(CONFIG.API_URL, {
//             sessionState: {
//                 intent: {
//                     name: "GetCourseDetail",
//                     slots: {
//                         course_name: { value: { interpretedValue: course_name } },
//                         query_type: { value: { interpretedValue: query_type } }
//                     }
//                 }
//             }
//         });
//         console.log("response.data",response.data)
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching course details:", error);
//         throw error;
//     }
// };

// import axios from 'axios';

// const CONFIG.API_URL = 'https://ezwmd5bfs5.execute-api.eu-central-1.amazonaws.com/dev/courses';

// export const fetchCourseDetails = async (courseName, queryType) => {
//     const payload = {
//         sessionState: {
//             dialogAction: {
//                 type: "ElicitSlot",
//                 slotToElicit: "course_name"
//             },
//             intent: {
//                 name: "GetCourseDetail",
//                 slots: {
//                     course_name: {
//                         value: {
//                             interpretedValue: courseName
//                         }
//                     },
//                     query_type: {
//                         value: {
//                             interpretedValue: queryType
//                         }
//                     }
//                 }
//             }
//         }
//     };

//     try {
//         const response = await axios.post(CONFIG.API_URL, payload, {
//             headers: {
//                 'Content-Type': 'application/json', // Ensure the content type is set
//             }
//         });

//         // Extract and return only the contentType message
//         const message = response.data.messages[0]?.content;
//         console.log('Response Message:', message);
//         return message || "No message available"; // Handle case where message might not exist
//     } catch (error) {
//         console.error("Error fetching course details:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// api.js
import axios from "axios";
import CONFIG from "../../config";

export const fetchCourseDetails = async (courseName, queryType) => {
  const payload = {
    sessionState: {
      dialogAction: {
        type: "ElicitSlot",
        slotToElicit: "course_name",
      },
      intent: {
        name: "GetCourseDetail",
        slots: {
          course_name: {
            value: {
              interpretedValue: courseName,
            },
          },
          query_type: {
            value: {
              interpretedValue: queryType,
            },
          },
        },
      },
    },
  };

  try {
    const response = await axios.post(CONFIG.AMAZON_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Extract and return the message
    const message = response.data.messages[0]?.content;
    console.log("Response Message:", message);
    return message || "No message available";
  } catch (error) {
    console.error(
      "Error fetching course details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const query_lex = async (query) => {
  try {
    const response = await fetch(`${CONFIG.API_URL}/api/lex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("There was an error with the fetch operation:", error);
  }
};
