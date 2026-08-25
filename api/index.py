from fastapi import FastAPI
import sys
import os

# Add the api directory to the python path so it can find 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# Vercel serverless functions look for the 'app' variable in api/index.py
