
import os
AMAZON_URL =  os.getenv("AMAZON_URL", "https://ezwmd5bfs5.execute-api.eu-central-1.amazonaws.com/dev/courses")
#MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://tshego:12345@cluster0.nbnwr.mongodb.net/?retryWrites=true&w=majority")  # Default to local if not set
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
COURSE_NAMES = os.getenv("COURSE_NAMES","Diploma in commercial photography,Diploma in fine and applied arts,Diploma in intergrated communication design,Diploma in interior design,Diploma in motion picture production,Higher certificate in music,Diploma in accounting,Diploma in financial management,Diploma in internal auditing,Diploma in public finance,Higher certificate in accounting,Bachelor of architecture,Bachelor of geomatics,Bachelor of engineering technology in civil engineering,Bachelor of engineering technology in industrial engineering,Bachelor of engineering technology in mechanical engineering,Bachelor of engineering technology in metallurgical,Diploma in electrical engineering,Diploma in industrial design,Higher certificate in construction engineering,Higher certificate in industrial engineering,Bachelor of education in foundation phase teaching,Bachelor of education in senior phase and further education,Diploma in audit and community education and training,Diploma in integrated communication,Diploma in journalism,Diploma in language practice,Diploma in law,Diploma in legal support,Diploma in policing,Diploma in public affairs,Diploma in traffic safety and municipal police management,Diploma in computer science,Diploma in coumputer system engineering,Diploma in informatics,Diploma in information technology,Diploma in multimedia computing,Diploma in administrative information management,Diploma in adventure tourism management,Diploma in casino resort management,Diploma in credit management,Diploma in ecotourism management,Diploma in entrepreneurship,Diploma in ecent management,Diploma in food operations management,Diploma in hospitality management,Diploma in human resource management,diploma in operations management,Diploma in retail business management,Diploma in sports management,Diploma in supply chain management,Diploma in tourism management,Diploma in work study,Bachelor of health sciences in biokinetics,Bachelor of health science in medical orthotics and prosthetics,Bachelor of health science in veterinary technology,Bachelor of nursing,Bachelor of science in industrial chemistry,Diploma in animal sciences,Diploma in biotechnology,Diploma in crop production,Diploma in dental technology,Diploma in fire technology,Diploma in food technology,Diploma in horticulture,Diploma in water science and technology,Diploma in wildlife management,Higher certificate in resource and waste management,Higher certificate in water treatment,")
