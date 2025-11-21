import React, { useState } from 'react';
import axios from 'axios';

/**
 * Chat page component.
 *
 * Displays a simple chat interface with a history area and an input
 * for sending messages. Messages from the user and SevenAI are
 * displayed in different styles. This component expects the backend
 * to manage authentication via headers (e.g. with an Axios
 * interceptor).
 */
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    try {
      const res = await axios.post('/api/chat', { message: userMsg.content });
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-primary">المحادثة مع SevenAI</h2>
      <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded bg-gray-100">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const bubbleClasses = isUser
            ? 'bg-primary text-white self-end'
            : 'bg-gray-200 text-gray-800 self-start';
          return (
            <div key={index} className={`mb-2 p-2 rounded ${bubbleClasses}`}>
              {msg.content}
            </div>
          );
        })}
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex items-center space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded p-2 resize-none"
          rows={2}
          placeholder="اكتب رسالتك هنا..."
        ></textarea>
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-green-800"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}

export default Chat;