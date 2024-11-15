
import re
import json

def parse_extracted_prospectus_data(prospectus_file_path):
    with open(prospectus_file_path, 'r', encoding='utf-8') as file:
        read_data = file.read()

    faculty_pattern = re.compile(r'(Faculty of [^\n]+)')
    faculty_matches = faculty_pattern.findall(read_data)
    print("Faculties found:", faculty_matches)

    structured_data = {faculty.strip(): [] for faculty in faculty_matches}

    current_faculty = None
    content_start = 0
    
    for match in faculty_pattern.finditer(read_data):
        faculty_name = match.group(1).strip()
        next_start = match.start()
        
        if current_faculty:
            section_content = read_data[content_start:next_start].strip()
            structured_data[current_faculty] = parse_course_details(section_content)

        current_faculty = faculty_name
        content_start = next_start

    if current_faculty:
        section_content = read_data[content_start:].strip()
        structured_data[current_faculty] = parse_course_details(section_content)

    return structured_data

def parse_course_details(content):
    course_pattern = re.compile(
        r'(DIPLOMA IN [A-Z\s][^\n]+|BACHELOR OF [A-Z\s][^\n]+|HIGHER CERTIFICATE IN [A-Z\s][^\n]+).*?'  
        r'Qualification code:\s*(\w+).*?' 
        r'(?:Campus where offered:\s*([^\n]+).*?)?' 
        r'(Admission requirement\(s\) and Selection criteria:.*?)(?=Intake for the qualification:|Presentation:|Minimum duration:|Closing date for application:|$)'  
        r'.*?Intake for the qualification:\s*([^\n]+).*?' 
        r'Presentation:\s*([^\n]+).*?' 
        r'Minimum duration:\s*([^\n]+).*?'  
        r'Closing date for application:\s*([^\n]+).*?',  
        re.DOTALL
    
    )
    course_details = []
    matches = course_pattern.finditer(content)
    for match in matches:
        course_name = match.group(1).strip()
        qualification_code = match.group(2).strip()
        campus_where_offered = match.group(3).strip() if match.group(3) else "Not specified"
        admission_requirements = match.group(4).strip()
        intake_for_qualification = match.group(5).strip() if match.group(5) else "Not specified"
        presentation = match.group(6).strip() 
        minimum_duration = match.group(7).strip()
        closing_date_for_application = match.group(8).strip() 

        structured_admission_requirements = parse_admission_requirements(admission_requirements)

        course_details.append({
            "course_name": course_name,
            "qualification_code": qualification_code,
            "campus_where_offered": campus_where_offered,
            "Admission requirement(s) and Selection criteria": structured_admission_requirements,
            "intake_for_qualification": intake_for_qualification,
            "presentation": presentation,
            "minimum_duration": minimum_duration,
            "closing_date_for_application": closing_date_for_application
        })
        
    return course_details
    
def parse_admission_requirements(content):
    section_pattern = re.compile(
        r'•\s*(?:FOR\s+APPLICANTS|APPLICANTS)[^\n]*?\s*'
        r'(?:2008|[^\n]*):\s*'
        r'Admission requirement\(s\):\s*([\s\S]*?)(?=\s*Selection criteria:\s*|• |$)' 
        r'Selection criteria:\s*([\s\S]*?)(?=\n• |$|$)',  
        re.DOTALL
    )

    result = []

    matches = section_pattern.finditer(content)
    for match in matches:
        try:
            section_title = match.group(0).split(':')[0].strip().replace('\n',' ') 
            admission_requirements = match.group(1).strip().replace('\n',' ')
            selection_criteria = match.group(2).strip().replace('\n',' ')
            
            result.append({
                section_title: {
                    "Admission requirement(s)": admission_requirements,
                    "Selection criteria": selection_criteria
                }
            })
        except IndexError:
            print(f"Error processing match: {match.groups()}")

    return result

def display_faculty_and_course_details(read_data):
    for faculty, courses in read_data.items():
        course_count = len(courses)
        print(f"Faculty: {faculty} (Total Courses: {course_count})")
        if courses:
            for course in courses:
                print(f" - Course: {course['course_name']}")
                print(f"   Qualification Code: {course['qualification_code']}")
                print(f"   Campus where offered: {course['campus_where_offered']}")
                for req_section in course["Admission requirement(s) and Selection criteria"]:
                    for req, details in req_section.items():
                        print(f"   {req}")
                        print(f"     Admission requirement(s): {details['Admission requirement(s)']}")
                        print(f"     Selection criteria: {details['Selection criteria']}")
                print(f"   Intake for the qualification: {course['intake_for_qualification']}")
                print(f"   Presentation: {course['presentation']}")
                print(f"   Minimum duration: {course['minimum_duration']}")
                print(f"   Closing date for application: {course['closing_date_for_application']}")

        else:
            print(" - No courses found")
        print()

def save_data_to_json(read_data, prospectus_file_path):
    with open(prospectus_file_path, 'w', encoding='utf-8') as file:
        json.dump(read_data, file, ensure_ascii=False, indent=4)

prospectus_file_path = 'extracted_data.txt'

try:
    faculty_and_courses = parse_extracted_prospectus_data(prospectus_file_path)
    display_faculty_and_course_details(faculty_and_courses)
    save_data_to_json(faculty_and_courses, 'faculties_and_course_details.json')

except ValueError as e:
    print(e)

# import re
# import json
# import firebase_admin
# from firebase_admin import credentials, firestore

# def initialize_firebase():
#     # Provide the path to your service account key file
#     cred = credentials.Certificate("./techadvisor-chatbot-firebase-adminsdk-ev7p1-33912375a8.json")
    
#     # Initialize the Firebase app
#     firebase_admin.initialize_app(cred, {
#         'databaseURL': 'https://techadvisor-chatbot-default-rtdb.firebaseio.com/'
#     })

# # Initialize Firebase
# import re
# import json
# import firebase_admin
# from firebase_admin import credentials, db

# # Initialize Firebase Admin SDK with your service account
# def initialize_firebase():
#     cred = credentials.Certificate("./techadvisor-chatbot-firebase-adminsdk-ev7p1-33912375a8.json")  # Update the path
#     firebase_admin.initialize_app(cred, {
#         'databaseURL': 'https://techadvisor-chatbot-default-rtdb.firebaseio.com/'  # Replace with your database URL
#     })


# # Function to sanitize keys for Firebase
# def sanitize_key(key):
#     # Replace invalid characters and strip whitespace
#     return re.sub(r'[\$#\[\]\/\.]', '_', key).strip()

# # Function to upload data to Firebase Realtime Database
# def upload_data_to_firebase(structured_data):
#     ref = db.reference('faculties')  # Create a reference to the 'faculties' node
#     for faculty, courses in structured_data.items():
#         sanitized_faculty_name = sanitize_key(faculty.replace(" ", "_"))  # Sanitize the faculty name
#         faculty_ref = ref.child(sanitized_faculty_name)  # Create a reference for the faculty
        
#         # Print to debug the structure
#         print(f"Uploading data for faculty: {sanitized_faculty_name}")
#         print(f"Courses: {json.dumps(courses, ensure_ascii=False, indent=4)}")  # Print the courses being uploaded
        
#         # Check for empty courses
#         if not courses:
#             print(f"No courses found for faculty: {sanitized_faculty_name}. Skipping...")
#             continue

#         # Upload the data
#         try:
#             faculty_ref.set({
#                 'courses': courses
#             })
#             print(f"Uploaded {len(courses)} courses for {faculty}")
#         except Exception as e:
#             print(f"Error uploading data for {sanitized_faculty_name}: {e}")

# # Function to parse extracted prospectus data
# def parse_extracted_prospectus_data(prospectus_file_path):
#     with open(prospectus_file_path, 'r', encoding='utf-8') as file:
#         read_data = file.read()

#     faculty_pattern = re.compile(r'(Faculty of [^\n]+)')
#     faculty_matches = faculty_pattern.findall(read_data)
#     print("Faculties found:", faculty_matches)

#     structured_data = {faculty.strip(): [] for faculty in faculty_matches}

#     current_faculty = None
#     content_start = 0
    
#     for match in faculty_pattern.finditer(read_data):
#         faculty_name = match.group(1).strip()
#         next_start = match.start()
        
#         if current_faculty:
#             section_content = read_data[content_start:next_start].strip()
#             structured_data[current_faculty] = parse_course_details(section_content)

#         current_faculty = faculty_name
#         content_start = next_start

#     if current_faculty:
#         section_content = read_data[content_start:].strip()
#         structured_data[current_faculty] = parse_course_details(section_content)

#     return structured_data

# # Function to parse course details
# def parse_course_details(content):
#     course_pattern = re.compile(
#         r'(DIPLOMA IN [A-Z\s][^\n]+|BACHELOR OF [A-Z\s][^\n]+|HIGHER CERTIFICATE IN [A-Z\s][^\n]+).*?'  
#         r'Qualification code:\s*(\w+).*?' 
#         r'(?:Campus where offered:\s*([^\n]+).*?)?' 
#         r'(Admission requirement\(s\) and Selection criteria:.*?)(?=Intake for the qualification:|Presentation:|Minimum duration:|Closing date for application:|$)'  
#         r'.*?Intake for the qualification:\s*([^\n]+).*?' 
#         r'Presentation:\s*([^\n]+).*?' 
#         r'Minimum duration:\s*([^\n]+).*?'  
#         r'Closing date for application:\s*([^\n]+).*?',  
#         re.DOTALL
#     )
#     course_details = []
#     matches = course_pattern.finditer(content)
#     for match in matches:
#         course_name = match.group(1).strip()
#         qualification_code = match.group(2).strip()
#         campus_where_offered = match.group(3).strip() if match.group(3) else "Not specified"
#         admission_requirements = match.group(4).strip()
#         intake_for_qualification = match.group(5).strip() if match.group(5) else "Not specified"
#         presentation = match.group(6).strip() 
#         minimum_duration = match.group(7).strip()
#         closing_date_for_application = match.group(8).strip() 

#         structured_admission_requirements = parse_admission_requirements(admission_requirements)

#         course_details.append({
#             "course_name": course_name,
#             "qualification_code": qualification_code,
#             "campus_where_offered": campus_where_offered,
#             "Admission requirement(s) and Selection criteria": structured_admission_requirements,
#             "intake_for_qualification": intake_for_qualification,
#             "presentation": presentation,
#             "minimum_duration": minimum_duration,
#             "closing_date_for_application": closing_date_for_application
#         })
        
#     return course_details

# # Function to parse admission requirements
# def parse_admission_requirements(content):
#     section_pattern = re.compile(
#         r'•\s*(?:FOR\s+APPLICANTS|APPLICANTS)[^\n]*?\s*'
#         r'(?:2008|[^\n]*):\s*'
#         r'Admission requirement\(s\):\s*([\s\S]*?)(?=\s*Selection criteria:\s*|• |$)' 
#         r'Selection criteria:\s*([\s\S]*?)(?=\n• |$|$)',  
#         re.DOTALL
#     )

#     result = []

#     matches = section_pattern.finditer(content)
#     for match in matches:
#         try:
#             section_title = match.group(0).split(':')[0].strip().replace('\n',' ') 
#             admission_requirements = match.group(1).strip().replace('\n',' ')
#             selection_criteria = match.group(2).strip().replace('\n',' ')
            
#             result.append({
#                 section_title: {
#                     "Admission requirement(s)": admission_requirements,
#                     "Selection criteria": selection_criteria
#                 }
#             })
#         except IndexError:
#             print(f"Error processing match: {match.groups()}")

#     return result

# # Function to display faculty and course details
# def display_faculty_and_course_details(read_data):
#     for faculty, courses in read_data.items():
#         course_count = len(courses)
#         print(f"Faculty: {faculty} (Total Courses: {course_count})")
#         if courses:
#             for course in courses:
#                 print(f" - Course: {course['course_name']}")
#                 print(f"   Qualification Code: {course['qualification_code']}")
#                 print(f"   Campus where offered: {course['campus_where_offered']}")
#                 for req_section in course["Admission requirement(s) and Selection criteria"]:
#                     for req, details in req_section.items():
#                         print(f"   {req}")
#                         print(f"     Admission requirement(s): {details['Admission requirement(s)']}")
#                         print(f"     Selection criteria: {details['Selection criteria']}")
#                 print(f"   Intake for the qualification: {course['intake_for_qualification']}")
#                 print(f"   Presentation: {course['presentation']}")
#                 print(f"   Minimum duration: {course['minimum_duration']}")
#                 print(f"   Closing date for application: {course['closing_date_for_application']}")

#         else:
#             print(" - No courses found")
#         print()

# # Main execution block
# prospectus_file_path = 'extracted_data.txt'

# try:
#     # Parse data and display
#     faculty_and_courses = parse_extracted_prospectus_data(prospectus_file_path)
#     display_faculty_and_course_details(faculty_and_courses)
    
#     # Initialize Firebase
#     initialize_firebase()

#     # Upload the parsed data to Firebase Realtime Database
#     upload_data_to_firebase(faculty_and_courses)

# except ValueError as e:
#     print(e)
