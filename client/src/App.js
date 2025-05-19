import React, { useState, useEffect } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import { Rocket, ShieldCheck, Palette } from 'lucide-react';
import './styles/App.css';

const App = () => {
  const [currentPin, setCurrentPin] = useState(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const savedPin = localStorage.getItem('activeRoomPin');
    if (savedPin) setCurrentPin(savedPin);
  }, []);

  const handleRoomCreated = (pin, nick) => {
    localStorage.setItem('activeRoomPin', pin);
    setNickname(nick);
    setCurrentPin(pin);
  };

  const handleRoomJoined = (pin, nick) => {
    localStorage.setItem('activeRoomPin', pin);
    setNickname(nick);
    setCurrentPin(pin);
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem('activeRoomPin');
    setNickname('');
    setCurrentPin(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="title">💬 LiveChat</h1>
        <div className="header-divider"></div>
        <p className="subtitle">Conéctate en tiempo real, seguro y sin complicaciones</p>
      </header>

      <main className="app-main">
        {!currentPin ? (
          <>
            <section className="cards-wrapper animate-fade-in">
              <CreateRoom onRoomCreated={handleRoomCreated} />
              <JoinRoom onRoomJoined={handleRoomJoined} />
            </section>

            <section className="features-section">
              <div className="feature-card small-feature">
                <Rocket size={32} />
                <h3>Tiempo Real</h3>
                <p>Comunicación instantánea en cualquier momento.</p>
              </div>
              <div className="feature-card small-feature">
                <ShieldCheck size={32} />
                <h3>Acceso Seguro</h3>
                <p>Control por PIN único y restricción por dispositivo.</p>
              </div>
              <div className="feature-card small-feature">
                <Palette size={32} />
                <h3>Experiencia Visual</h3>
                <p>Interfaz responsive para cualquier dispositivo.</p>
              </div>
            </section>
          </>
        ) : (
          <ChatRoom pin={currentPin} nickname={nickname} onLeave={handleLeaveRoom} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-column">
          © {new Date().getFullYear()} LiveChat - Todos los derechos reservados
        </div>
        <div className="footer-column">
          Desarrollado por <strong>Autepim</strong>
        </div>
      </footer>
    </div>
  );
};

export default App;
