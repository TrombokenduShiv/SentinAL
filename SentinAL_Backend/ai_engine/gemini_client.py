import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from .prompts import CONTRACT_PARSER_SYSTEM_PROMPT, LEGAL_NOTICE_SYSTEM_PROMPT

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=api_key)

# Initialize the Model (Gemini 1.5 Flash is fast and cheap)
model = genai.GenerativeModel('gemini-1.5-flash')

def parse_contract_pdf(pdf_text_content):
    """
    Sends raw text from a PDF to Gemini to extract structured JSON.
    """
    try:
        # Construct the Prompt
        full_prompt = f"{CONTRACT_PARSER_SYSTEM_PROMPT}\n\nCONTRACT TEXT:\n{pdf_text_content}"
        
        response = model.generate_content(full_prompt)
        raw_text = response.text

        # Clean up Markdown code blocks if Gemini adds them
        if "```json" in raw_text:
            raw_text = raw_text.replace("```json", "").replace("```", "")
        
        return json.loads(raw_text)

    except Exception as e:
        print(f"Error parsing contract: {e}")
        return None

def draft_legal_notice(violation_details):
    """
    Generates a Cease & Desist letter based on violation data.
    """
    try:
        # Construct the Prompt
        details_str = json.dumps(violation_details, indent=2)
        full_prompt = f"{LEGAL_NOTICE_SYSTEM_PROMPT}\n\nVIOLATION DETAILS:\n{details_str}"
        
        response = model.generate_content(full_prompt)
        return response.text

    except Exception as e:
        print(f"Error drafting notice: {e}")
        return "NOTICE GENERATION FAILED due to AI Error."