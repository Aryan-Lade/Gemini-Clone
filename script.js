// This script now directly handles Gemini API communication and UI updates.
// Firebase integration has been removed as per the new JavaScript snippet provided.

// Global references to DOM elements
const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input'); // Corrected ID from text-input to user-input
const sendButton = document.getElementById('send-button');
const greetingElement = document.getElementById('greeting');
const messageContainer = document.getElementById('message-container');
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

// Function to display a message in the chat UI
function displayMessage(text, sender) {
    // Hide the initial greeting message if it's visible
    if (greetingElement.style.display !== 'none') {
        greetingElement.style.display = 'none';
    }

    // Create the main message div
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender); // Add 'user', 'gemini', or 'system-error' class for styling

    // Create and append the sender label (e.g., "You" or "Gemini")
    const senderLabel = document.createElement('div');
    senderLabel.classList.add('message-label');
    senderLabel.textContent = sender === 'user' ? 'You' : (sender === 'system-error' ? 'System Error' : 'Gemini');
    messageDiv.appendChild(senderLabel);

    // Create and append the message text content
    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageDiv.appendChild(messageText);

    // Add the complete message div to the message container
    messageContainer.appendChild(messageDiv);

    // Scroll to the bottom of the chat area to show the latest message
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Function to call the Gemini API
async function fetchApiResponse(chatPrompt) {
    // Replace with your actual Gemini API key. It's generally not recommended to hardcode API keys in client-side code.
    // For this example, I'm using the key you provided directly in the previous snippet.
    const apiKey = "AIzaSyC3-KbbnOLpCtxQls73HPa_eUAYXrDesaQ"; // User-provided API Key

    // Display a "Generating response..." message as a loading indicator
    displayMessage("Generating response...", "gemini-loading");

    try {
        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: chatPrompt,
                        }
                    ]
                }
            ]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("Gemini API response:", result);

        // Remove the "Generating response..." loading indicator
        const loadingMessage = document.querySelector('.gemini-loading');
        if (loadingMessage) loadingMessage.remove();

        // Check if the API response contains generated content
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            displayMessage(text, 'gemini');
        } else {
            // If no valid response is received, display a fallback message
            displayMessage("Sorry, I couldn't generate a response. No valid content received.", "gemini");
            console.error("Gemini API response did not contain expected content structure:", result);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Remove loading indicator in case of API error
        const loadingMessage = document.querySelector('.gemini-loading');
        if (loadingMessage) loadingMessage.remove();
        // Display an error message to the user
        displayMessage(`An error occurred while communicating with Gemini: ${error.message || error}`, "system-error");
    }
}

// Function to handle sending a message
function sendMessage() {
    const chat = userInput.value.trim();
    if (!chat) return; // Do not send empty messages

    displayMessage(chat, 'user'); // Display user's message immediately
    userInput.value = ''; // Clear the input field

    fetchApiResponse(chat); // Call the function to send the message to Gemini API
}

// Event Listeners
window.onload = function() {
    // Any initialization needed on window load can go here, e.g., pre-populating chat or other UI setup.
    console.log("Gemini Clone loaded.");
};

// Listen for click event on the send button
sendButton.addEventListener('click', sendMessage);

// Listen for keypress events on the user input textarea
userInput.addEventListener('keypress', (e) => {
    // If 'Enter' key is pressed with 'Shift', send the message
    // Otherwise, allow default behavior for 'Enter' (new line)
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Prevent default Shift+Enter behavior (often adds an extra newline)
        sendMessage();      // Call the sendMessage function
    }
});


// Sidebar collapse functionality
if (menuIcon && sidebar) {
    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed'); // Toggle the 'collapsed' class on click
    });
}
