import { useEffect, useState, useRef } from 'react';

export function useChat(roomId, username) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}?token=${token}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  const sendMessage = (text) => {
    const msg = { text, sender: username };
    socketRef.current?.send(JSON.stringify(msg));
  };

  return { messages, sendMessage };
}
