#!/bin/bash

echo "Assuming you have Node and Python3 installed, this script will install dependencies from package.json, flask and pymongo for backend if required and setup the application"

echo "Installing frontend dependencies from package.json"
cd frontend && npm install
wait
cd ..

echo "Installing backend dependencies from requirements.txt"
cd backend
python3 -m pip install -r requirements.txt
wait