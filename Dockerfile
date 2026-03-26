# Use the official Python image
FROM python:3.12-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file from the backend folder to the root
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
# This ensures the 'backend' folder exists for absolute imports
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start the application using the package notation
# This fixes "ImportError: attempted relative import with no known parent package"
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
