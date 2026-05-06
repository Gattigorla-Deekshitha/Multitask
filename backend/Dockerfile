FROM python:3.13-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Run migrations and start server
CMD python manage.py collectstatic --noinput && \
    python manage.py migrate && \
    gunicorn multitask_backend.wsgi --bind 0.0.0.0:$PORT
