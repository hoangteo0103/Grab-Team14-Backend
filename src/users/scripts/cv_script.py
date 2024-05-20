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


def extract_skill_by_cv(cv_url, chat):
    content = scan_pdf(cv_url)
    try:
        response = chat.send_message(f"Give me skill keywords from given resume content: ```{content}```")
        fc = response.candidates[0].content.parts[0].function_call
        skills = type(fc).to_dict(fc)["args"]
        skills_dict = {'skills': []}
        for skill in skills:
            skills_dict['skills'].extend(skills[skill])

        return skills_dict
    except Exception as e:
        print(f"Error sending message: {e}")
        return {'skills': []}
    
def process_cv():
    load_dotenv()
    vertexai.init(project=os.getenv('PROJECT_ID'), location=os.getenv('LOCATION'))
    cv_url = sys.argv[2]
    extract_skill_keywords_func = FunctionDeclaration(
    name="extract_skill_keywords",
    description="Extract skill keywords from a given resume.",
    parameters={
        "type": "object",
        "properties": {
            "technical_skills": {
                "type": "array",
                "description": "A list of technical skills",
                "items": {
                    "description": "technical skill keyword",
                    "type": "string",
                },
            },
            "soft_skills": {
                "type": "array",
                "description": "A list of soft skills",
                "items": {
                    "description": "soft skill keyword",
                    "type": "string",
                },
            },
            "additional_skills": {
                "type": "array",
                "description": "A list of additional skills",
                "items": {
                    "description": "additional skill keyword",
                    "type": "string",
                },
            },
        },
        "required": ["technical_skills", "soft_skills", "additional_skills"],
    },
    )

    # Define a tool that includes the above functions
    resume_tool = Tool(
        function_declarations=[extract_skill_keywords_func],
    )

    # Define a tool config for the above functions
    resume_tool_config = ToolConfig(
        function_calling_config=ToolConfig.FunctionCallingConfig(
            # ANY mode forces the model to predict a function call
            mode=ToolConfig.FunctionCallingConfig.Mode.ANY,
            # List of functions that can be returned when the mode is ANY.
            # If the list is empty, any declared function can be returned.
            allowed_function_names=["extract_skill_keywords"],
        )
    )

    model = GenerativeModel('gemini-1.5-pro-preview-0409',
                            generation_config=GenerationConfig(temperature=0),
                            tools=[resume_tool],
                            tool_config=resume_tool_config
                            )
    chat = model.start_chat()

    skills_dict = extract_skill_by_cv(cv_url, chat)
    print(json.dumps(skills_dict))
    return json.dumps(skills_dict)


if sys.argv[1] == 'process_cv':
    process_cv()
sys.stdout.flush()
