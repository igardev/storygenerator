document.addEventListener('DOMContentLoaded', function() {
    const createStoryBtn = document.getElementById('createStoryBtn');
    const copyStoryBtn = document.getElementById('copyStoryBtn');
    const llmEndpointInput = document.getElementById('llmEndpoint');
    const modelInput = document.getElementById('model');
    const apiKeyInput = document.getElementById('apiKey');
    const requirementInput = document.getElementById('requirement');
    const storyInput = document.getElementById('story');

    createStoryBtn.addEventListener('click', async function() {
        // Get values from form fields
        const endpoint = llmEndpointInput.value.trim();
        const model = modelInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const requirement = requirementInput.value.trim();

        // Validate inputs
        if (!endpoint) {
            alert('Please enter LLM Endpoint');
            return;
        }
        if (!model) {
            alert('Please enter Model');
            return;
        }
        if (!apiKey) {
            alert('Please enter API Key');
            return;
        }
        if (!requirement) {
            alert('Please enter Requirement');
            return;
        }

        // Disable button and show loading state
        createStoryBtn.disabled = true;
        createStoryBtn.textContent = 'Creating Story...';
        
        // Show spinner and clear story field
        const spinner = document.getElementById('spinner');
        spinner.classList.remove('hidden');
        storyInput.value = '';

        try {
            // Make the API request to Flask backend
            const response = await fetch('/api/create-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    llmEndpoint: endpoint,
                    model: model,
                    apiKey: apiKey,
                    requirement: requirement
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            // Populate the Story field with the story from backend
            storyInput.value = data.story || '';
            
            // Hide spinner
            spinner.classList.add('hidden');

        } catch (error) {
            console.error('Error creating story:', error);
            storyInput.value = `Error: ${error.message}`;
            alert(`Failed to create story: ${error.message}`);
            
            // Hide spinner even on error
            spinner.classList.add('hidden');
        } finally {
            // Re-enable button
            createStoryBtn.disabled = false;
            createStoryBtn.textContent = 'Create Story';
        }
    });

    // Copy story to clipboard
    copyStoryBtn.addEventListener('click', async function() {
        const storyText = storyInput.value.trim();
        
        if (!storyText) {
            alert('No story content to copy');
            return;
        }

        try {
            // Use the Clipboard API
            await navigator.clipboard.writeText(storyText);
            
            // Visual feedback
            const originalText = copyStoryBtn.innerHTML;
            copyStoryBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
            copyStoryBtn.style.background = '#4caf50';
            
            setTimeout(() => {
                copyStoryBtn.innerHTML = originalText;
                copyStoryBtn.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            storyInput.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = copyStoryBtn.innerHTML;
            copyStoryBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
            copyStoryBtn.style.background = '#4caf50';
            
            setTimeout(() => {
                copyStoryBtn.innerHTML = originalText;
                copyStoryBtn.style.background = '';
            }, 2000);
        }
    });
});
