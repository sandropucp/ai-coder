import React, { useState, useRef, useEffect } from 'react';
import { useKanban } from '../KanbanContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { refreshBoard } = useKanban();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
        if (data.boardUpdated) {
          await refreshBoard();
        }
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button className={`ai-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : 'AI Assistant'}
      </button>

      <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="ai-sidebar-header">
          <h3>AI Assistant</h3>
          <p>Manage your board with chat</p>
        </div>

        <div className="ai-messages" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="ai-welcome">
              Hello! I can help you add, move, or rename cards. Try saying "Add a task about testing to the Review column".
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`ai-message ${m.role}`}>
              <div className="message-bubble">{m.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message assistant">
              <div className="message-bubble typing">AI is thinking...</div>
            </div>
          )}
        </div>

        <form className="ai-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping}>Send</button>
        </form>
      </div>
    </>
  );
};
