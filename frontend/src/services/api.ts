import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const voiceService = {
  // Initialize voice connection
  initializeVoice: async (roomName: string) => {
    try {
      const response = await api.post('/voice/initialize', { roomName });
      return response.data;
    } catch (error) {
      console.error('Error initializing voice:', error);
      throw error;
    }
  },

  // Send text message to voice assistant
  sendTextMessage: async (message: string) => {
    try {
      const response = await api.post('/voice/message', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // End voice session
  endVoiceSession: async () => {
    try {
      const response = await api.post('/voice/end');
      return response.data;
    } catch (error) {
      console.error('Error ending voice session:', error);
      throw error;
    }
  },
};

export default api; 