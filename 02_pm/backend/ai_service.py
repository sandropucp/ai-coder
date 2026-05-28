import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "anthropic/claude-3.5-sonnet"

import json

async def call_ai(prompt: str):
    if not OPENROUTER_API_KEY:
        raise Exception("OPENROUTER_API_KEY not found in environment")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "PM MVP",
            },
            json={
                "model": MODEL,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30.0
        )
        if response.status_code != 200:
            raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
        data = response.json()
        return data["choices"][0]["message"]["content"]

async def call_ai_chat(message: str, current_board: dict, history: list = None):
    if not OPENROUTER_API_KEY:
        raise Exception("OPENROUTER_API_KEY not found in environment")

    system_prompt = f"""
You are a Project Management Assistant. You can help users manage their Kanban board.
Current Board State:
{json.dumps(current_board, indent=2)}

Rules:
1. Always respond in JSON format.
2. Your response must include an 'answer' (text for the user).
3. If the user asks to change the board (add/move/delete/rename), include the FULL updated 'board_update' object in your JSON response.
4. If no changes are needed, set 'board_update' to null.
5. Do not include any text outside the JSON.
"""

    messages = [{"role": "system", "content": system_prompt}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": message})

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "PM MVP",
            },
            json={
                "model": MODEL,
                "messages": messages,
                "response_format": {"type": "json_object"}
            },
            timeout=60.0
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
        
        data = response.json()
        raw_content = data["choices"][0]["message"]["content"]
        return json.loads(raw_content)
