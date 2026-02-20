import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || '';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
});

socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
});

socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err.message);
});

export default socket;
