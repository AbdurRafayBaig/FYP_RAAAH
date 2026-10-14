"""Serverless entry point of the AI Server for the interim Vercel deployment (docs/DEPLOYMENT.md).

Locally and in the container the engine is started with:  uvicorn app.main:app
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app  # noqa: E402,F401
