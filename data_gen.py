import os
import requests
from gtts import gTTS
from dotenv import load_dotenv
import asyncio
import speech_recognition as sr
from pydub import AudioSegment

# Load environment variables from .env file
load_dotenv()

# API credentials
GROQ_API_URL = os.getenv("GROQ_API_URL")
GROQ_API_TOKEN = os.getenv("GROQ_API_TOKEN")

# Sample interview questions for synthetic data generation
questions = [
    "Tell us about a challenging project you've worked on.",
    "Why are you excited about this role?",
    "What are your strengths as a developer?"
]

# Function to generate answers using LLaMA via the Groq API
async def generate_answer_with_llama(question):
    headers = {
        "Authorization": f"Bearer {GROQ_API_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": question,
        "max_tokens": 100  # Adjust based on desired response length
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=data)
    
    # Check for successful response
    if response.status_code == 200:
        answer = response.json().get("text", "").strip()
        return answer if answer else "No response generated."
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return "Error generating response."

# Generate synthetic interview data
async def generate_synthetic_interviews():
    synthetic_interviews = []
    for question in questions:
        answer = await generate_answer_with_llama(question)
        synthetic_interviews.append({"question": question, "answer": answer})
    return synthetic_interviews

# Function to save synthetic answers as audio (Text-to-Speech)
async def save_audio(text, filename):
    tts = gTTS(text, lang='en')
    tts.save(filename)
    await asyncio.sleep(1)  # Ensure file I/O is complete
    print(f"Saved audio to {filename}")

# Function to transcribe audio using SpeechRecognition with delay
async def transcribe_audio_speechrecognition(audio_path):
    # Add a small delay to ensure audio file is completely saved and accessible
    await asyncio.sleep(2)

    # Convert mp3 to wav for compatibility with SpeechRecognition
    wav_path = audio_path.replace(".mp3", ".wav")
    audio = AudioSegment.from_mp3(audio_path)
    audio.export(wav_path, format="wav")

    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio_data = recognizer.record(source)
        try:
            # Using Google's free API
            transcript = recognizer.recognize_google(audio_data)
            return transcript
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError:
            return "Error with Google API"

# Full Workflow: Generate Q&A, Save Audio, and Transcribe with SpeechRecognition
async def create_interview_dataset():
    interviews = await generate_synthetic_interviews()
    
    for idx, interview in enumerate(interviews):
        # Save the answer as audio
        audio_path = f"synthetic_interview_{idx}.mp3"
        await save_audio(interview["answer"], audio_path)
        
        # Delay added before transcription to ensure file readiness
        transcript = await transcribe_audio_speechrecognition(audio_path)
        interview["transcript"] = transcript
        
        print(f"Q: {interview['question']}\nA: {interview['answer']}\nTranscript: {transcript}\n")

# Run the complete workflow to generate, save, and transcribe interview data
asyncio.run(create_interview_dataset())