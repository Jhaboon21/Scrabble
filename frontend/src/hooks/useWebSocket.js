import { useState, useEffect } from 'react';

/** custome hook for handling web socket messages */
export function useWebSocket(url) {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('Connected to websocket');
            setWs(socket);
        };
        socket.onclose = () => {
            console.log('Connection closed');
        };
        return () => socket.close();
    }, [url]);

    return ws;
}

export function useWebSocketMessage(ws, handleMessage) {
    useEffect(() => {
      if (!ws) return;
  
      function handleWebSocketMessage(message) {
        handleMessage(JSON.parse(message.data));
      }
  
      ws.onmessage = handleWebSocketMessage;
  
      return () => {
        ws.onmessage = null;
      };
    }, [ws, handleMessage]);
  }