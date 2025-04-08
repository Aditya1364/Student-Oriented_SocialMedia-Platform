import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/shared/Navbar";

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth?.userData);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

  useEffect(() => {
    if (!userData) navigate("/signin");
  }, [userData, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: userInput }] }] }),
      });

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 No response received.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      console.error("Error fetching response:", err);
      setError("🚨 Error fetching AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar userData={userData} />

      <button onClick={() => navigate(-1)} className="fixed top-16 left-4 flex items-center px-4 py-5 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition">
        <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
      </button>

      <main className="flex-grow flex flex-col p-6 pt-20 pb-24 max-w-3xl mx-auto w-full">
        {error && <div className="bg-red-500 p-3 rounded-lg text-center">{error}</div>}

        <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 border border-gray-700 p-4 rounded-lg backdrop-blur-md bg-opacity-30">
          {messages.length === 0 && <p className="text-gray-400 text-center italic">🤖 Start chatting...</p>}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" ? (
                <div className="flex items-center space-x-2 max-w-[80%]">
                  <span className="text-2xl">🤖</span>
                  <div className="bg-gray-700 text-gray-100 p-4 rounded-xl shadow-md max-w-[75%]">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-500 text-white p-4 rounded-xl shadow-md max-w-[75%]">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className="flex justify-center items-center mt-2 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="💬 Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-full text-white shadow-md transition-all transform active:scale-95" onClick={sendMessage} disabled={isLoading}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
