import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_BUILDER_SERVER_WS_URL, {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
