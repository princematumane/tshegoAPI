from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from pymongo import MongoClient
import config
import requests

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)
app.config.from_object(config)

# Connect to MongoDB
client = MongoClient(app.config['MONGO_URL'])
db = client['enrollment']
collection = db['enrollment']
users_collection = db["users"]
courses = (app.config['COURSE_NAMES']).split(',')

@app.route('/api/v1/hello', methods=['GET'])
def hello_world():
    """
    A Hello World endpoint.
    ---
    tags:
      - Example
    parameters:
      - name: name
        in: query
        type: string
        required: false
        description: The name to greet
    responses:
      200:
        description: A greeting to the user
        examples:
          application/json: {"message": "Hello, World!"}
    """
    name = request.args.get('name', 'World')
    return jsonify(message=f"Hello, {name}!")

@app.route("/api/user", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400

    user_data = {
        "username": username,
        "email": email,
        "user_query": []  # Initialize history as an empty list
    }
    
    existing_user = users_collection.find_one({
        "$or": [{"username": username}, {"email": email}]
    })
    if existing_user:
        return jsonify({"message": "Username or email already exists"}), 200

    users_collection.insert_one(user_data)
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/api/lex", methods=["POST"])
def lex():
    data = request.json
    query = data.get("query")
    username = data.get("username")  # Expect username to identify the user

    if not query or not username:
        return jsonify({"error": "query and username are required"}), 400

    # Prepare data for Amazon Lex
    modified_data = {
        "sessionState": {
            "dialogAction": {
                "type": "ElicitSlot",
                "slotToElicit": "course_name"
            },
            "intent": {
                "name": "GetCourseDetail",
                "slots": {
                    "course_name": {
                        "value": {
                            "interpretedValue": get_course_type(query)
                        }
                    },
                    "query_type": {
                        "value": {
                            "interpretedValue": get_query_type(query)
                        }
                    }
                }
            }
        },
        "inputTranscript": query
    }

    try:
        # Send request to Amazon Lex
        response = requests.post(app.config['AMAZON_URL'], json=modified_data)
        response_data = response.json()
        bot_response = response_data.get("messages", [{}])[0].get("content", "No response")

        # Add the user query and bot response to the user's history
        user_query = {
            "question": query,
            "bot_response": bot_response
        }

        users_collection.update_one(
            {"username": username},
            {"$push": {"user_query": user_query}}  # Append user_query to history
        )

        return jsonify(response_data), 201
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return jsonify({"message": f"An error occurred: {e}"}), 500

def get_query_type(query):
    # Define the valid query types
    valid_query_types = ['campus', 'intake', 'presentation', 'admission requirements',
                         'minimum duration', 'admission status', 'closing', 'admission fee']
    
    # Check if any valid query type is in the query
    for query_type in valid_query_types:
        if query_type in query.lower():
            # print('query_type',query_type)
            return query_type
    
    # If no valid query type is found, return None or an appropriate message
    return "default"

def get_course_type(query): 
    # Check if any valid query type is in the query
    for course_name in courses:
        print('test',course_name)
        query_words=query.split(' ')
        print('query_words',query_words)
        for word in query_words:
            if word in course_name:
                print('course_name',course_name)
                return course_name
    
    # If no valid query type is found, return None or an appropriate message
    return "default"

@app.route('/api/message', methods=['GET'])
def get_message():
    """Endpoint to return the welcome message."""
    return jsonify({'message': 'Welcome to TechAdvisor, a chatbot that simplifies enrollment for your admission.'})

@app.route('/api/help', methods=['GET'])
def get_help():
    """Endpoint to return the help message."""
    return jsonify({'message': 'What information are you looking for? Please choose the navigation below or ask me anything about First Time Enrollment'})

@app.route('/api/faculty_data', methods=['GET'])
def get_faculty_data():
    """Endpoint to return faculties and their courses."""
    # Fetch all documents from the MongoDB collection
    faculties_and_course_details = {}
    for document in collection.find():
        faculty = document.get('faculty')
        course_info = {
            "course_name": document.get('course_name'),
            "qualification_code": document.get('qualification_code'),
            "campus_where_offered": document.get('campus_where_offered'),
            "Admission requirement(s) and Selection criteria": document.get('Admission requirement(s) and Selection criteria'),
            "intake_for_qualification": document.get('intake_for_qualification'),
            "presentation": document.get('presentation'),
            "minimum_duration": document.get('minimum_duration'),
            "closing_date_for_application": document.get('closing_date_for_application')
        }
        
        # Group courses by faculty
        if faculty not in faculties_and_course_details:
            faculties_and_course_details[faculty] = []
        faculties_and_course_details[faculty].append(course_info)
    
    return jsonify(faculties_and_course_details)

if __name__ == '__main__':
    app.run(debug=True)

