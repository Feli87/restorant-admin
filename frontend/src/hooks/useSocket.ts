import { useEffect, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '../socket/socket';
import { useAuthStore } from '../stores/authStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = connectSocket();
    }

    return () => {
      disconnectSocket();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  const on = useCallback(<T = unknown>(event: string, handler: (data: T) => void) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, handler as (...args: unknown[]) => void);
    }
  }, []);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    const socket = getSocket();
    if (socket) {
      if (handler) {
        socket.off(event, handler);
      } else {
        socket.off(event);
      }
    }
  }, []);

  const emit = useCallback(<T = unknown>(event: string, data?: T) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  return {
    socket: socketRef.current,
    on,
    off,
    emit,
    isConnected: socketRef.current?.connected ?? false,
  };
};
