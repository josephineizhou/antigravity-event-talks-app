# BigQuery Release Notes App

A lightweight, modern web application that fetches and displays the official Google Cloud BigQuery Release Notes in real-time. Built with a Python Flask backend and a Vanilla JS/CSS glassmorphic frontend.

## Features
- **Live Updates**: Fetches the official XML feed from Google Cloud on demand.
- **Modern UI**: A responsive, aesthetic layout using CSS variables, glassmorphism, and smooth animations.
- **Twitter Integration**: Select any release note and instantly share it with a pre-filled Twitter composer.
- **Proxy Architecture**: The Flask backend handles cross-origin (CORS) feed fetching securely.

## Prerequisites
- Python 3.x
- `pip` package manager

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/josephineizhou/antigravity-event-talks-app.git
   cd antigravity-event-talks-app
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Start the Flask server**:
   ```bash
   python3 app.py
   ```

2. **Open the App**:
   Navigate your web browser to `http://127.0.0.1:5002`.

3. **Refresh**: Use the "Refresh" button in the top right to pull the latest updates!

## Project Structure
- `app.py`: The Flask server, routing, and feed fetching logic.
- `requirements.txt`: Python package dependencies.
- `templates/index.html`: The core HTML structure.
- `static/css/styles.css`: CSS styling and animations.
- `static/js/main.js`: Client-side logic for data fetching, DOM manipulation, and Twitter integration.
