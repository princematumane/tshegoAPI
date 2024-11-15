
import requests
import pdfplumber
import io

def download_general_Information_prospectus_pdf(url):
    response = requests.get(url)
    if response.status_code == 200:
        return io.BytesIO(response.content)
    else:
        raise Exception("Failed to download the PDF")

def extract_general_Information_prospectus_content(pdf_path):
    pdf_file = download_general_Information_prospectus_pdf(pdf_path)
    
    with pdfplumber.open(pdf_file) as pdf:
        full_text = ""
        
        for page_number in range(20, 106):  
            page = pdf.pages[page_number]  
            
           
            footer_height = 50
            
            if page.width > page.height: 
                split_width = page.width / 2  
                left_bbox = (0, 0, split_width, page.height - footer_height)  
                right_bbox = (split_width, 0, page.width, page.height - footer_height) 
                left_text = page.crop(left_bbox).extract_text()
                right_text = page.crop(right_bbox).extract_text()
            else:
                left_text = page.crop((0, 0, page.width, page.height - footer_height)).extract_text()
                right_text = ""
                
            full_text += (left_text or "") + "\n" + (right_text or "") + "\n"

        with open('extracted_data.txt', 'w', encoding='utf-8') as file:
            file.write(full_text)
            
general_Information_prospectus_pdf_url = 'https://www.tut.ac.za/media/docs/2025%20General%20Information%20for%20First%20Year%20Enrolment.pdf'
extract_general_Information_prospectus_content(general_Information_prospectus_pdf_url)

# import requests
# import pdfplumber
# import io
# import firebase_admin
# from firebase_admin import credentials, db

# # Firebase configuration
# def initialize_firebase():
#     # Provide the path to your service account key file
#     cred = credentials.Certificate("./techadvisor-chatbot-firebase-adminsdk-ev7p1-33912375a8.json")
    
#     # Initialize the Firebase app
#     firebase_admin.initialize_app(cred, {
#         'databaseURL': 'https://techadvisor-chatbot-default-rtdb.firebaseio.com/'
#     })

# # Function to save data to Firebase
# def save_data_to_firebase(extracted_data):
#     ref = db.reference('general_information_prospectus')  # Reference for the specific node in the database
#     ref.set({
#         'content': extracted_data
#     })

# def download_general_Information_prospectus_pdf(url):
#     response = requests.get(url)
#     if response.status_code == 200:
#         return io.BytesIO(response.content)
#     else:
#         raise Exception("Failed to download the PDF")

# def extract_general_Information_prospectus_content(pdf_path):
#     pdf_file = download_general_Information_prospectus_pdf(pdf_path)
    
#     with pdfplumber.open(pdf_file) as pdf:
#         full_text = ""
        
#         for page_number in range(20, 106):  
#             page = pdf.pages[page_number]  
           
#             footer_height = 50
#             if page.width > page.height: 
#                 split_width = page.width / 2  
#                 left_bbox = (0, 0, split_width, page.height - footer_height)  
#                 right_bbox = (split_width, 0, page.width, page.height - footer_height) 
#                 left_text = page.crop(left_bbox).extract_text()
#                 right_text = page.crop(right_bbox).extract_text()
#             else:
#                 left_text = page.crop((0, 0, page.width, page.height - footer_height)).extract_text()
#                 right_text = ""
                
#             full_text += (left_text or "") + "\n" + (right_text or "") + "\n"
        
#         # Save the extracted data to Firebase
#         save_data_to_firebase(full_text)

# # Initialize Firebase
# initialize_firebase()

# # Extract and save data to Firebase
# general_Information_prospectus_pdf_url = 'https://www.tut.ac.za/media/docs/2025%20General%20Information%20for%20First%20Year%20Enrolment.pdf'
# extract_general_Information_prospectus_content(general_Information_prospectus_pdf_url)
