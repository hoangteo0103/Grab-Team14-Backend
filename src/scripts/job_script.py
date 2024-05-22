import os
from pymongo import MongoClient
from dotenv import load_dotenv
import vertexai
from vertexai.generative_models import (
    Content,
    FunctionDeclaration,
    GenerationConfig,
    GenerativeModel,
    Part,
    Tool,
)
from vertexai.preview.generative_models import ToolConfig

import sys

def gen_cover_letter():
    load_dotenv()
    vertexai.init(project=os.getenv('PROJECT_ID'), location=os.getenv('LOCATION'))

    companyName = sys.argv[2]
    title = sys.argv[3]
    experience_level = sys.argv[4]
    requirement = sys.argv[5]
    job_desc = sys.argv[6]
    user_info = sys.argv[7]


    model = GenerativeModel('gemini-1.5-pro-preview-0409',
                            generation_config=GenerationConfig(temperature=0)
                            )
    chat = model.start_chat()

    job_information = {}
    job_information["job_desc"] = job_desc
    job_information["company_name"] = companyName
    job_information["title"] = title
    job_information["experience_level"] = experience_level
    job_information["requirements"] = requirement

    try:
        response = chat.send_message(f"You are an assistant who help users to find jobs. Generate a cover letter given job information: {job_information}. given personal information: {user_info}. The answer must be in English. Skip any information that is not provided to make sure no masked token")
        print(response.candidates[0].content.parts[0].text)
        return response.candidates[0].content.parts[0].text
    except Exception as e:
        print(f"Error sending message: {e}")
        return ''
    

if sys.argv[1] == 'generate_cover_letter':
    gen_cover_letter()
sys.stdout.flush()
