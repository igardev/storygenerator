# User Story Generator Application

A Flask-based web application that simplifies the life of product owners by automatically generating user stories from requirements using Large Language Models (LLMs).

<img width="1809" height="1095" alt="image" src="https://github.com/user-attachments/assets/b3b02109-988f-4dc3-aa61-a38a8f04ac2e" />


## Features

- **LLM Integration**: Connect to any OpenAI-compatible LLM endpoint
- **User Story Generation**: Automatically create user stories following INVEST criteria
- **Modern UI**: Clean, responsive interface with a two-column layout
- **Copy to Clipboard**: One-click copy functionality for generated stories
- **Loading Indicators**: Visual feedback with spinning wheel during story generation
- **Error Handling**: Comprehensive error handling and user feedback

## Requirements

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd flask
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # On Linux/Mac:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```bash
   pip install .
   ```

## Running the Application

1. **Activate the virtual environment** (if not already activated):
   ```bash
   source venv/bin/activate
   ```

2. **Start the Flask server**:
   ```bash
   python app.py
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

The application will run in debug mode, so any code changes will automatically reload.

## Usage

1. **Configure LLM Settings**:
   - Enter your LLM endpoint URL (e.g., `https://openrouter.ai/api/v1/chat/completions`)
   - Enter the model name (e.g., `qwen/qwen3-30b-a3b-thinking-2507`)
   - Enter your API key

2. **Enter Requirements**:
   - Type or paste your requirements in the "Requirement" field

3. **Generate Story**:
   - Click the "Create Story" button
   - Wait for the story to be generated (a spinner will indicate progress)

4. **Copy Story**:
   - Once generated, click the "Copy" button above the Story field to copy it to your clipboard

## Project Structure

```
flask/
├── app.py                 # Main Flask application
├── prompts.py            # User story prompt template
├── pyproject.toml       # Project metadata and dependencies
├── README.md             # This file
├── .gitignore           # Git ignore rules
├── templates/
│   └── index.html       # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css    # Application styles
│   └── js/
│       └── main.js      # Frontend JavaScript
└── venv/                # Virtual environment (not in git)
```

## API Endpoints

### POST `/api/create-story`

Generates a user story from a requirement using an LLM.

**Request Body:**
```json
{
  "llmEndpoint": "https://api.openai.com/v1/chat/completions",
  "model": "gpt-4",
  "apiKey": "your-api-key",
  "requirement": "User requirement text here"
}
```

**Success Response (200):**
```json
{
  "story": "Generated user story text..."
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message description"
}
```

## Configuration

### LLM Endpoint Compatibility

The application is designed to work with OpenAI-compatible APIs. The expected request format is:

```json
{
  "model": "model-name",
  "messages": [
    {
      "role": "user",
      "content": "prompt text"
    }
  ],
  "temperature": 0.7
}
```

The expected response format should include:
- `choices[0].message.content` (OpenAI format), or
- `content` (alternative format)

### Prompt Template

The user story prompt template is defined in `prompts.py` and follows INVEST criteria:
- **I**ndependent
- **N**egotiable
- **V**aluable
- **E**stimable
- **S**mall
- **T**estable

## Dependencies

- **Flask** (3.0.0): Web framework
- **Werkzeug** (3.0.1): WSGI utilities
- **requests** (2.31.0): HTTP library for LLM API calls

## Development

The application runs in debug mode by default. To disable debug mode, modify `app.py`:

```python
app.run(debug=False, host='0.0.0.0', port=5000)
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, you can change it in `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

### LLM API Errors

- Verify your API endpoint URL is correct
- Check that your API key is valid
- Ensure the model name matches your LLM provider's available models
- Check network connectivity

### Import Errors

Make sure all dependencies are installed:
```bash
pip install .
```

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

