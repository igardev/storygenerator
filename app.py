from flask import Flask, render_template, request, jsonify
from datetime import datetime
import requests
import json

from prompts import USER_STORY_PROMPT

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/api/create-story', methods=['POST'])
def create_story():
    try:
        data = request.get_json()
        
        # Extract parameters
        llm_endpoint = data.get('llmEndpoint', '').strip()
        model = data.get('model', '').strip()
        api_key = data.get('apiKey', '').strip()
        requirement = data.get('requirement', '').strip()
        
        # Validate inputs
        if not llm_endpoint:
            return jsonify({'error': 'LLM Endpoint is required'}), 400
        if not model:
            return jsonify({'error': 'Model is required'}), 400
        if not api_key:
            return jsonify({'error': 'API Key is required'}), 400
        if not requirement:
            return jsonify({'error': 'Requirement is required'}), 400
        
        # Create the prompt
        prompt = USER_STORY_PROMPT + requirement
        print(prompt)
        
        # Prepare the request body (OpenAI-compatible format)
        request_body = {
            'model': model,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7
        }
        
        # Make the API request to the LLM endpoint
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        response = requests.post(
            llm_endpoint,
            json=request_body,
            headers=headers,
            timeout=60
        )
        
        # Check if the request was successful
        if not response.ok:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
            error_message = error_data.get('error', {}).get('message', f'HTTP error! status: {response.status_code}')
            return jsonify({'error': error_message}), response.status_code
        
        # Parse the response
        llm_data = response.json()
        
        # Extract the story from the response (handle different response formats)
        story_text = ''
        if llm_data.get('choices') and llm_data['choices'][0] and llm_data['choices'][0].get('message'):
            story_text = llm_data['choices'][0]['message'].get('content', '')
        elif llm_data.get('content'):
            story_text = llm_data['content']
        elif isinstance(llm_data, str):
            story_text = llm_data
        else:
            story_text = json.dumps(llm_data, indent=2)
        
        return jsonify({'story': story_text})
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

