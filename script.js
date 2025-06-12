const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const greetingElement = document.getElementById('greeting');
const messageContainer = document.getElementById('message-container');
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

function displayMessage(text, sender) {
    if (greetingElement.style.display !== 'none') {
        greetingElement.style.display = 'none';
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender);

    const senderLabel = document.createElement('div');
    senderLabel.classList.add('message-label');
    senderLabel.textContent = sender === 'user' ? 'You' : (sender === 'system-error' ? 'System Error' : 'Gemini');
    messageDiv.appendChild(senderLabel);

    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageDiv.appendChild(messageText);

    messageContainer.appendChild(messageDiv);

    chatArea.scrollTop = chatArea.scrollHeight;
}

async function fetchApiResponse(chatPrompt) {
    const apiKey = "AIzaSyC3-KbbnOLpCtxQls73HPa_eUAYXrDesaQ";

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

        const loadingMessage = document.querySelector('.gemini-loading');
        if (loadingMessage) loadingMessage.remove();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            displayMessage(text, 'gemini');
        } else {
            displayMessage("Sorry, I couldn't generate a response. No valid content received.", "gemini");
            console.error("Gemini API response did not contain expected content structure:", result);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const loadingMessage = document.querySelector('.gemini-loading');
        if (loadingMessage) loadingMessage.remove();
        displayMessage(`An error occurred while communicating with Gemini: ${error.message || error}`, "system-error");
    }
}

function sendMessage() {
    const chat = userInput.value.trim();
    if (!chat) return;

    displayMessage(chat, 'user');
    userInput.value = '';

    fetchApiResponse(chat);
}

window.onload = function() {
    console.log("Gemini Clone loaded.");
};

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

if (menuIcon && sidebar) {
    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}