import os
import shutil

print("Moving frontend to root...")
frontend_dir = 'frontend'
for item in os.listdir(frontend_dir):
    if item in ['node_modules', '.next']:
        continue
    src = os.path.join(frontend_dir, item)
    dst = os.path.join('.', item)
    if os.path.isdir(src):
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dst)

print("Moving backend to api...")
backend_dir = 'backend'
os.makedirs('api', exist_ok=True)
for item in os.listdir(backend_dir):
    if item in ['venv', '.pytest_cache', '__pycache__']:
        continue
    src = os.path.join(backend_dir, item)
    dst = os.path.join('api', item)
    if os.path.isdir(src):
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dst)

print("Setting up requirements.txt...")
if os.path.exists('api/requirements.txt'):
    shutil.copy2('api/requirements.txt', 'requirements.txt')

print("Creating vercel.json...")
vercel_json = """{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    }
  ]
}"""
with open('vercel.json', 'w') as f:
    f.write(vercel_json)

print("Creating api/index.py...")
index_py = """from fastapi import FastAPI
import sys
import os

# Add the api directory to the python path so it can find 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# Vercel serverless functions look for the 'app' variable in api/index.py
"""
with open('api/index.py', 'w') as f:
    f.write(index_py)

print("Migration complete!")
