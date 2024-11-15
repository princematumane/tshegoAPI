from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import json
import config

app = Flask(__name__)
CORS(app)
app.config.from_object(config)

# Connect to MongoDB
client = MongoClient(app.config['MONGO_URL'])
db = client['enrollment']
collection = db['enrollment']
print("Connected to MongoDB:", db.list_collection_names())

# Load data from JSON file
with open('faculties_and_course_details.json', 'r') as f:
    course_data = json.load(f)  # Ensure course_data is defined here

# Loop through each faculty and insert courses into MongoDB
for faculty, courses in course_data.items():
    for course in courses:
        # Prepare the document with faculty information included
        document = {
            "faculty": faculty,
            **course  # Spread course details into the document
        }
        
        # Insert document into MongoDB collection
        insert_doc = collection.insert_one(document)
        print(f"Inserted Document ID: {insert_doc.inserted_id}")

# Close MongoDB connection
client.close()

if __name__ == '__main__':
    app.run(debug=True)

# The admission requirements for Diploma In Accounting are: 
# APPLICANTS WHO OBTAINED A NATIONAL SENIOR CERTIFICATE IN OR AFTER 2008
# requirement(s): A National Senior Certificate with a bachelor’s degree, or a diploma endorsement or an equivalent qualification, with an achievement level of at least 4 for English (home language or first additional language), 3 for Accounting or 3 for Mathematics or Technical Mathematics or 5 for Mathematical Literacy.
# selection_criteria: To be considered for this qualification, applicants must have an Admission Point Score (APS) of at least 22 or at least 24 (with Mathematical Literacy). Life Orientation is excluded for APS calculation.

# FOR APPLICANTS WITH A NATIONAL CERTIFICATE (VOCATIONAL) AT NQF LEVEL 4
# requirement(s): A National Certificate (Vocational) at NQF Level 4 with a bachelor’s degree or a diploma endorsement, with at least 50% for English (home language or first additional language) and 40% for Mathematics or 60% for Mathematical Literacy, 40% for Life Orientation (excluded for APS calculation), and 50% for any other three compulsory vocational subjects.
# selection_criteria: To be considered for this qualification, applicants must have an Admission Point Score (APS) of at least 22 or at least 24 (with Mathematical Literacy). Life Orientation is excluded for APS calculation.