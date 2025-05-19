import React, { useState, useEffect, useRef } from 'react';
import socket from '../services/socketService';
import { Send, LogOut, Users, MessageCircle } from 'lucide-react';
import '../styles/ChatRoom.css';

const ChatRoom = ({ pin, nickname, onLeave }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [limit, setLimit] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chatMessage', ({ sender, text }) => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender, text, timestamp }]);
    });

    socket.on('userJoined', ({ count, limit: roomLimit }) => {
      setParticipants(count);
      setLimit(roomLimit);
    });

    socket.on('userLeft', ({ count, limit: roomLimit }) => {
      setParticipants(count);
      setLimit(roomLimit);
    });

    return () => {
      socket.off('chatMessage');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('chatMessage', { pin, text: message });
      setMessage('');
    }
  };

  return (
    <div className="chat-wrapper">
      <header className="chat-topbar">
        <div className="room-info">
          <MessageCircle size={20} /> Sala <strong>{pin}</strong> - {nickname}
        </div>
        <div className="topbar-actions">
          <div className="user-count">
            <Users size={18} /> {participants} {limit ? `/ ${limit}` : ''}
          </div>
          <button className="exit-btn" onClick={() => { socket.emit('leaveRoom', { pin }); onLeave(); }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender === nickname ? 'self' : 'other'}`}>
            <span className="sender">{msg.sender} <small>{msg.timestamp}</small></span>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-input-bar">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
};

export default ChatRoom;
