import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './api';

let socket: Socket | null = null;

/* ================= CREATE ================= */
const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BASE_URL, {
      autoConnect: false,
      transports: ['websocket'], // 🔥 stable
    });
  }
  return socket;
};

/* ================= ACTIONS ================= */

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const joinRoom = (roomId: string) => {
  const s = getSocket();
  if (s.connected) {
    s.emit('joinRoom', roomId);
  }
};

export const onReceiveMessage = (cb: (msg: any) => void) => {
  const s = getSocket();
  s.off('newMessage');
  s.on('newMessage', cb);
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export default getSocket;
