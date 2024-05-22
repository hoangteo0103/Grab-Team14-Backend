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
import sys 
from vertexai.preview.generative_models import ToolConfig
import json


from langchain_community.document_loaders import PyPDFLoader

def scan_pdf(url):
    loader = PyPDFLoader(url)
    pages = loader.load()
    content = ''
    for page in pages:
        content += page.page_content
    return content


def extract_info_by_cv(cv_url, chat):
    content = scan_pdf(cv_url)
    content = content.replace('\"', '\'')
    try:
        response = chat.send_message(f"You are doing keywords extracting task to preprocess data. Give me the skill keywords and information of job applicant from given resume content: ```{content}```. The answer must be in English.")
        fc = response.candidates[0].content.parts[0].function_call
        info = type(fc).to_dict(fc)["args"]
        info_dict = {'skills': []}
        for skill in ['technical_skills', 'soft_skills', 'additional_skills']:
            info_dict['skills'].extend(info[skill])

        info_dict['personal_information'] = info['personal_information']

        return info_dict
    except Exception as e:
        print(f"Error sending message: {e}")
        return {'skills': [], 'personal_information': {}}

    
def process_cv():
    load_dotenv()
    vertexai.init(project=os.getenv('PROJECT_ID'), location=os.getenv('LOCATION'))
    cv_url = sys.argv[2]
    extract_information_func = FunctionDeclaration(
    name="extract_information",
    description="Extract skill keywords, and job applicant information from a given resume.",
    parameters={
        "type": "object",
        "properties": {
            "technical_skills": {
                "type": "array",
                "description": "A list of technical skills",
                "items": {
                    "description": "technical skill keyword in English",
                    "type": "string",
                },
            },
            "soft_skills": {
                "type": "array",
                "description": "A list of soft skills",
                "items": {
                    "description": "soft skill keyword in English",
                    "type": "string",
                },
            },
            "additional_skills": {
                "type": "array",
                "description": "A list of additional skills",
                "items": {
                    "description": "additional skill keyword in English",
                    "type": "string",
                },
            },
            "personal_information": {
                "type": "object",
                "properties": {
                    "name": {
                        "description": "name of job applicant in English",
                        "type": "string",
                    },
                    "phone_number": {
                        "description": "phone number of job applicant in English",
                        "type": "string",
                    },
                    "email": {
                        "description": "email of job applicant in English",
                        "type": "string",
                    },
                },
                "required": ["name", "phone_number", "email"],
            },
        },
        "required": ["technical_skills", "soft_skills", "additional_skills", "personal_information"],
    },
    )

    # Define a tool that includes the above functions
    resume_tool = Tool(
        function_declarations=[extract_information_func],
    )

    # Define a tool config for the above functions
    resume_tool_config = ToolConfig(
        function_calling_config=ToolConfig.FunctionCallingConfig(
            # ANY mode forces the model to predict a function call
            mode=ToolConfig.FunctionCallingConfig.Mode.ANY,
            # List of functions that can be returned when the mode is ANY.
            # If the list is empty, any declared function can be returned.
            allowed_function_names=["extract_information"],
        )
    )

    model = GenerativeModel('gemini-1.5-pro-preview-0409',
                            generation_config=GenerationConfig(temperature=0),
                            tools=[resume_tool],
                            tool_config=resume_tool_config
                            )
    chat = model.start_chat()

    info_dict = extract_info_by_cv(cv_url, chat)
    print(json.dumps(info_dict))
    return json.dumps(info_dict)


if sys.argv[1] == 'process_cv':
    process_cv()
sys.stdout.flush()
