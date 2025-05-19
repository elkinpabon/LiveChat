import React, { useState, useRef } from 'react';
import socket from '../services/socketService';
import { LogIn, User, Key } from 'lucide-react';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../styles/JoinRoom.css';

const JoinRoom = ({ onRoomJoined }) => {
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const toast = useRef(null);

  const handleJoinRoom = () => {
    if (!nickname.trim()) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debes ingresar un nickname', life: 3000 });
      return;
    }

    if (pin.length !== 6) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debes ingresar un PIN válido de 6 dígitos', life: 3000 });
      return;
    }

    socket.emit('joinRoom', { pin, nickname }, (response) => {
      if (response.success) {
        toast.current.show({ severity: 'success', summary: 'Unido', detail: `Te has unido a la sala ${pin}`, life: 2000 });
        setTimeout(() => {
          onRoomJoined(pin, nickname);
        }, 2000);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || 'Error al unirse a la sala', life: 3000 });
      }
    });
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="action-card">
        <LogIn size={48} className="card-icon" />
        <h2>Unirse a una Sala</h2>
        <div className="card-body">
          <label><User size={16} /> Nickname</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Tu nickname" />
          <label><Key size={16} /> PIN</label>
          <input type="text" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="PIN de 6 dígitos" maxLength={6} />
          <button onClick={handleJoinRoom}>Unirse a la Sala</button>
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
