FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker's layer caching.
# This step is only re-run if requirements.txt changes.
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's source code
COPY . .

# Your application runs on port 8000, so expose that port
EXPOSE 8000

# Run the application when the container launches
CMD ["python", "run.py"]