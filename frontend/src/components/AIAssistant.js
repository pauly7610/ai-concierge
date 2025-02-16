import React, { useState } from 'react';

function AIAssistant() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const handleSendMessage = () => {
        // Placeholder for AI message handling
        const newMessage = {
            text: userInput,
            sender: 'user'
        };
        setMessages([...messages, newMessage]);
        setUserInput('');
    };

    return (
        <div className="ai-assistant">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about your home search..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default AIAssistant; 