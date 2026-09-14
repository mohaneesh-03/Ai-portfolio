import os
from dotenv import load_dotenv
from groq import Groq
from time import sleep
import requests

load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("groq api key not set")

client=Groq(api_key=my_api_key)
model="openai/gpt-oss-120b"

def read_google_doc(file_url):
    try:
        file_id = file_url.split("/d/")[1].split("/")[0]
    except:
        print("Invalid Drive url")
        return "N/A"

    download_url = f"https://docs.google.com/document/d/{file_id}/export?format=txt"

    print("Downloading doc as text...")
    response = requests.get(download_url)

    if response.status_code != 200:
        print("Error with request")
        return "N/A"

    return response.text

url = "https://docs.google.com/document/d/1it3-cchwvwgju8ASGfeXj8hSekv3ed0fzHJ_dWKwWVo/edit?usp=sharing"

doc_content = read_google_doc(url)

system_prompt=f"""
#ROLE
You are an expert HR assistant who is skilled in extracting useful information about a candidate from his profile.
#TASK
From the given file constent, you need to extract all the information and store it properly with appropriate headings
sub-headings. Fill the skills sections with all the skills you can find in projects, experience or the skills section.
#CONSTRAINTS
1. Do not invent or add any skill which are not mentioned
2. Do not miss out on any information that is mentioned.
3. Do not add unncessary summary or disclaimer for the document given.
4. Only parse thinga which are acceptable in a technical resume. Do not consume information which does not fit.
5. Make sure that the skills section only has unique skills.
in the constext.
#OUTPUT FORMAT
The output is desired as a Markdown. For every sub heading create a different section which can have all the information
for that particular sub heading
#EXAMPLE
For skills section have comma separated aggreagated skills from the entire document.
Skills - skill 1, skill 2, skill 3
For project or experience sections have proper title and descriptions alond with dates added where mentioned.
Experience-
experience 1 - start_date to end_date, location
                description
project 1 - description
#FALLBACK
For anything which is out of context for a technical resume just have N/A written.
"""

user_prompt = f"""
Parse this resume - 
{doc_content}
"""

messages = [
    {
        "role": "system",
        "content": system_prompt
    },
    {
        "role": "user",
        "content": user_prompt
    }
]

response = client.chat.completions.create(model = model, messages = messages)
parsed_doc = response.choices[0].message.content
print(parsed_doc)

file_path = "./Resume.md"
with open(file_path, "w", encoding="utf-8") as file:
    file.write(parsed_doc)