import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

 

function ChatInterface() {
      const { id: documentId } = useParams();
const { user } = useAuth();
const [history, setHistory] = useState([]);
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  const fetchChatHistory = async () => {
    try {
      setInitialLoading(true);
      const response = await aiService.getChatHistory(documentId);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      setHistory([]);
    } finally {
      setInitialLoading(false);
    }
  };

  fetchChatHistory();
}, [documentId]);

useEffect(() => {
  scrollToBottom();
}, [history]);

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!message.trim()) return;

  const userMessage = {
    role: 'user',
    content: message,
    timestamp: new Date()
  };

  setHistory(prev => [...prev, userMessage]);
  setMessage('');
  setLoading(true);

  try {
    const response = await aiService.chat(documentId, userMessage.content);

    // ✅ SAFE extraction
    const answer = response?.data?.data?.answer || "No response from AI";
    const relevantChunks = response?.data?.data?.relevantChunks || [];

    const assistantMessage = {
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
      relevantChunks
    };

    setHistory(prev => [...prev, assistantMessage]);

  } catch (error) {
    console.error('Chat error:', error);

    const errorMessage = {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    };

    setHistory(prev => [...prev, errorMessage]);

  } finally {
    setLoading(false);
  }
};

const renderMessage = (msg, index) => {
  const isUser = msg.role === "user"; // adjust if your field is different

  return (
    <div
      key={index}
      className={`flex items-start gap-3 my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-emerald-600" strokeWidth={2} />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] sm:max-w-lg px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={msg.content} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
          {msg?.user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};

 if (initialLoading) {
  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-100 to-teal-100 mb-4 flex items-center justify-center">
        <MessageSquare className="h-7 w-7 text-emerald-600" strokeWidth={2} />
      </div>
      <Spinner />
      <p className="text-sm text-slate-500 mt-3 font-medium">Loading chat history...</p>
    </div>
  );
}

  return (
 <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
    {history.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-center h-full py-10">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <MessageSquare
            className="w-7 h-7 text-emerald-600"
            strokeWidth={2}
          />
        </div>

        <h3 className="text-lg font-semibold text-slate-800">
          Start a conversation
        </h3>

        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Ask me anything about the document!
        </p>
      </div>
    ) : (
      history.map(renderMessage)
    )}

    {/* Typing Loader */}
    {loading && (
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Sparkles
            className="w-5 h-5 text-emerald-600"
            strokeWidth={2}
          />
        </div>

        <div className="bg-slate-100 px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>

  {/* Chat Input */}
  <div>
   <form
  onSubmit={handleSendMessage}
  className="flex items-center gap-3 p-3 sm:p-4 bg-white/70 backdrop-blur-xl border-t border-slate-200"
>
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Ask a follow-up question..."
    disabled={loading}
    className="flex-1 px-4 py-2.5 text-sm sm:text-base text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-50"
  />

  <button
    type="submit"
    disabled={loading || !message.trim()}
    className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <Send className="w-5 h-5" strokeWidth={2} />
  </button>
</form>
  </div>
</div>
  )
}

export default ChatInterface
