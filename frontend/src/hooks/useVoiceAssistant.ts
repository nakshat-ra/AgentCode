import { useState, useCallback } from 'react';
import { voiceService } from '@/services/api';

interface VoiceAssistantState {
  isConnected: boolean;
  isListening: boolean;
  error: string | null;
}

export const useVoiceAssistant = () => {
  const [state, setState] = useState<VoiceAssistantState>({
    isConnected: false,
    isListening: false,
    error: null,
  });

  const initializeVoice = useCallback(async (roomName: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await voiceService.initializeVoice(roomName);
      setState(prev => ({ ...prev, isConnected: true }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to initialize voice' 
      }));
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await voiceService.sendTextMessage(message);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      }));
    }
  }, []);

  const endSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await voiceService.endVoiceSession();
      setState(prev => ({ ...prev, isConnected: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to end session' 
      }));
    }
  }, []);

  return {
    ...state,
    initializeVoice,
    sendMessage,
    endSession,
  };
}; 