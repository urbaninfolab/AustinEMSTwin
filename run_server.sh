#!/bin/bash
# Simple HTTP server to run the EMS website locally
cd "$(dirname "$0")"
echo "Starting local HTTP server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
python3 -m http.server 8000

