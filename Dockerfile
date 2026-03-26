# Use the official Python image
FROM python:3.12-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start the FastAPI application from the root main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
