const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Fetch response from Groq API
async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP Error: ${response.status}\n${errorBody}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching Groq API:", error);
    throw new Error("Oops! Something went wrong. Please try again later.");
  }
}

// Append a message to the chat display
function appendMessage(content, type = "bot") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (type === "user") {
    messageElement.classList.add("user-message");
  } else if (type === "error") {
    messageElement.classList.add("error-message");
  } else {
    messageElement.classList.add("bot-message");
  }

  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Handle user input
async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  userInput.value = "";

  try {
    const conversation = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ];

    const botResponse = await fetchGroqData(conversation);
    appendMessage(botResponse, "bot");
  } catch (error) {
    appendMessage(error.message, "error");
  }
}

// Event listeners
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

// Initialize chat display
chatDisplay.innerHTML = "";
