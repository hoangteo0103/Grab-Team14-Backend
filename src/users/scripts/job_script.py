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

vertexai.init(project=os.getenv('PROJECT_ID'), location=os.getenv('LOCATION'))

def process_job(job_dict):
    load_dotenv()
    vertexai.init(project=os.getenv('PROJECT_ID'), location=os.getenv('LOCATION'))
    job_desc = job_dict.get('description', "")
    if job_desc == "":
        print("Job description is empty")
        return
    
    job_desc = job_desc.replace("\"", "\'")
    job_dict["description"] = job_desc

    extract_job_keywords_func = FunctionDeclaration(
        name="extract_job_keywords",
        description="Extract job information from a given job description.",
        parameters={
            "type": "object",
            "properties": {
                "industries": {
                    "type": "array",
                    "description": "A list of relevant industries",
                    "items": {
                        "description": "name of job industry in {ACCOMMODATION_SERVICES, ADMINISTRATIVE_AND_SUPPOR_SERVICES, CONSTRUCTION, CONSUMER_SERVICES, EDUCATION, ENTERTAINMENT_PROVIDERS, FARMING_RANCHING_FORESTRY, FINANCIAL_SERVICES, GOVERNMENT_ADMINISTRATION, HOSPITALS_AND_HEALTH_CARE, MANUFACTURING, PROFESSIONAL_SERVICES, REAL_ESTATE_AND_EQUIPMENT_RENTAL_SERVICES, RETAIL, TECHNOLOGY_INFORMATION_AND_MEDIA}",
                        "type": "string",
                    },
                },
                "requirements": {
                    "type": "array",
                    "description": "A list of position requirements",
                    "items": {
                        "description": "job requirement in English",
                        "type": "string",
                    },
                },
                # "responsibilities": {
                #     "type": "array",
                #     "description": "A list of position responsibilities",
                #     "items": {
                #         "description": "job responsibility",
                #         "type": "string",
                #     },
                # },
            },
            "required": ["industries", "requirements"],
        },
    )

    # Define a tool that includes the above functions
    job_tool = Tool(
        function_declarations=[extract_job_keywords_func],
    )

    # Define a tool config for the above functions
    job_tool_config = ToolConfig(
        function_calling_config=ToolConfig.FunctionCallingConfig(
            # ANY mode forces the model to predict a function call
            mode=ToolConfig.FunctionCallingConfig.Mode.ANY,
            # List of functions that can be returned when the mode is ANY.
            # If the list is empty, any declared function can be returned.
            allowed_function_names=["extract_job_keywords"],
        )
    )

    model = GenerativeModel('gemini-1.5-pro-preview-0409',
                            generation_config=GenerationConfig(temperature=0),
                            tools=[job_tool],
                            tool_config=job_tool_config
                            )
    chat = model.start_chat()

    try:
        response = chat.send_message(f"Give me the industries, and requirements corresponding with the given JD: ```{job_desc}```.  The industries must belong to the industry group: [ACCOMMODATION_SERVICES, ADMINISTRATIVE_AND_SUPPOR_SERVICES, CONSTRUCTION, CONSUMER_SERVICES, EDUCATION, ENTERTAINMENT_PROVIDERS, FARMING_RANCHING_FORESTRY, FINANCIAL_SERVICES, GOVERNMENT_ADMINISTRATION, HOSPITALS_AND_HEALTH_CARE, MANUFACTURING, PROFESSIONAL_SERVICES, REAL_ESTATE_AND_EQUIPMENT_RENTAL_SERVICES, RETAIL, TECHNOLOGY_INFORMATION_AND_MEDIA]. The answer must be in English.")
        fc = response.candidates[0].content.parts[0].function_call
        info_dict = type(fc).to_dict(fc)["args"]

        # update job dict
        # job_dict["responsibilities"] = info_dict["responsibilities"]
        job_dict["requirements"] = info_dict["requirements"]
        job_dict["industries"].extend(info_dict["industries"])
        job_dict["industries"] = list(set(job_dict["industries"]))
    except Exception as e:
        print(f"Error sending message: {e}")
        


