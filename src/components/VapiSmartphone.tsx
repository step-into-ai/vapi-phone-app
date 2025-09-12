'use client';

import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  Loader, 
  AlertTriangle, 
  Volume2,
  Signal,
  Battery,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CallStatus = 'idle' | 'connecting' | 'active' | 'stopping' | 'ended';

interface VapiConfig {
  apiKey: string;
  assistantId: string;
}

interface VapiSmartphoneProps {
  className?: string;
  config: VapiConfig;
}

export default function VapiSmartphone({ className, config }: VapiSmartphoneProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const vapiRef = useRef<Vapi | null>(null);

  console.log('VapiSmartphone component loaded');
  console.log('Config:', { 
    apiKey: config.apiKey.substring(0, 10) + '...', 
    assistantId: config.assistantId.substring(0, 8) + '...' 
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reinitialize Vapi when config changes
  useEffect(() => {
    const initializeVapi = async () => {
      // Clear existing instance
      if (vapiRef.current) {
        vapiRef.current.removeAllListeners();
        vapiRef.current = null;
      }

      try {
        console.log('🔄 Initializing Vapi with new config...');
        
        if (!config.apiKey || !config.assistantId) {
          throw new Error('API Key and Assistant ID are required');
        }

        console.log('Creating Vapi instance with token:', config.apiKey.substring(0, 10) + '...');
        const vapiInstance = new Vapi(config.apiKey);
        vapiRef.current = vapiInstance;
        console.log('✅ Vapi instance created successfully');

        // Event listeners
        vapiInstance.on('call-start', () => {
          console.log('✅ Call has started');
          setCallStatus('active');
          setError(null);
        });

        vapiInstance.on('call-end', () => {
          console.log('✅ Call has ended');
          setCallStatus('ended');
          setIsTalking(false);
          setIsListening(false);
          setTimeout(() => setCallStatus('idle'), 2000);
        });

        vapiInstance.on('speech-start', () => {
          console.log('🎤 Speech started');
          setIsTalking(true);
          setIsListening(false);
        });

        vapiInstance.on('speech-end', () => {
          console.log('🔇 Speech ended');
          setIsTalking(false);
          setIsListening(true);
        });

        // Add more event listeners for debugging
        vapiInstance.on('message', (message) => {
          console.log('📨 Vapi message:', message);
        });

        vapiInstance.on('volume-level', (volume) => {
          console.log('🔊 Volume level:', volume);
        });

        vapiInstance.on('error', (error) => {
          console.error('🚨 Vapi error details:', {
            error,
            type: typeof error,
            message: error?.message || 'No message',
            code: error?.code || 'No code',
            stack: error?.stack,
            stringified: JSON.stringify(error),
            keys: Object.keys(error || {})
          });
          
          let errorMessage = 'Verbindungsfehler aufgetreten';
          
          // Handle specific error cases
          if (error?.message?.includes('microphone')) {
            errorMessage = 'Mikrofon-Zugriff verweigert';
          } else if (error?.message?.includes('assistant')) {
            errorMessage = 'Assistant nicht gefunden';
          } else if (error?.message?.includes('network') || error?.message?.includes('connection')) {
            errorMessage = 'Netzwerkfehler - bitte erneut versuchen';
          } else if (error?.code === 'PERMISSION_DENIED') {
            errorMessage = 'Browser-Berechtigung erforderlich';
          } else if (error?.message) {
            errorMessage = `Fehler: ${error.message}`;
          } else if (typeof error === 'string') {
            errorMessage = `Fehler: ${error}`;
          } else if (Object.keys(error || {}).length === 0) {
            errorMessage = 'Unbekannter Fehler - prüfen Sie Browser-Berechtigungen';
          }
          
          setError(errorMessage);
          setCallStatus('idle');
        });

      } catch (e) {
        console.error("❌ Vapi-Initialisierung fehlgeschlagen:", e);
        setError("Anruf-Service nicht verfügbar: " + (e as Error).message);
        setCallStatus('idle');
      }
    };
    
    initializeVapi();

    return () => {
      vapiRef.current?.removeAllListeners();
    };
  }, [config.apiKey, config.assistantId]); // Reinitialize when config changes

  const startCall = async () => {
    console.log('📞 Starting call with assistant ID:', config.assistantId);
    console.log('🔧 Vapi instance:', vapiRef.current);
    setError(null);
    setCallStatus('connecting');
    
    if (!vapiRef.current) {
      console.error('❌ Vapi instance not initialized');
      setError('Vapi nicht initialisiert');
      setCallStatus('idle');
      return;
    }
    
    if (!config.assistantId || config.assistantId.trim() === '') {
      console.error('❌ Assistant ID is missing or invalid');
      setError('Assistant ID fehlt');
      setCallStatus('idle');
      return;
    }
    
    // Check microphone permissions before starting call
    try {
      console.log('🎤 Checking microphone permissions...');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // This will prompt for permission if not already granted
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Microphone access granted');
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
      } else {
        console.warn('⚠️ getUserMedia not supported');
      }
    } catch (permError) {
      console.error('❌ Microphone permission error:', permError);
      setError(`Mikrofon-Berechtigung erforderlich: ${(permError as Error).message}`);
      setCallStatus('idle');
      return;
    }
    
    try {
      console.log('🚀 Attempting to start call...');
      vapiRef.current.start(config.assistantId);
      console.log('✅ Call start command sent');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      setError(`Fehler beim Starten: ${(error as Error).message || 'Unbekannter Fehler'}`);
      setCallStatus('idle');
    }
  };

  const stopCall = () => {
    setCallStatus('stopping');
    vapiRef.current?.stop();
  };
  
  const getStatusInfo = () => {
    if (error) {
      return { 
        text: error, 
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        color: 'text-red-500' 
      };
    }
    switch (callStatus) {
      case 'connecting':
        return { 
          text: 'Verbindung wird hergestellt...', 
          icon: <Loader className="animate-spin h-4 w-4 text-blue-500" />,
          color: 'text-blue-500'
        };
      case 'active':
        if (isTalking) {
          return { 
            text: 'KI spricht...', 
            icon: <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />,
            color: 'text-green-500'
          };
        } else if (isListening) {
          return { 
            text: 'Zuhörend...', 
            icon: <Mic className="h-4 w-4 text-blue-500 animate-pulse" />,
            color: 'text-blue-500'
          };
        } else {
          return { 
            text: 'Verbunden', 
            icon: <Phone className="h-4 w-4 text-green-500" />,
            color: 'text-green-500'
          };
        }
      case 'stopping':
        return { 
          text: 'Anruf wird beendet...', 
          icon: <Loader className="animate-spin h-4 w-4 text-orange-500" />,
          color: 'text-orange-500'
        };
      case 'ended':
        return { 
          text: 'Anruf beendet', 
          icon: <PhoneOff className="h-4 w-4 text-gray-500" />,
          color: 'text-gray-500'
        };
      default:
        return { 
          text: 'Bereit für Anruf', 
          icon: <Phone className="h-4 w-4 text-gray-600" />,
          color: 'text-gray-600'
        };
    }
  };

  const { text, icon, color } = getStatusInfo();
  const showActiveState = ['connecting', 'active', 'stopping'].includes(callStatus);
  const canStartCall = callStatus === 'idle' || callStatus === 'ended';
  const canEndCall = ['connecting', 'active'].includes(callStatus);

  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Smartphone Frame */}
      <div className="relative w-80 h-[680px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
        {/* Outer Frame */}
        <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
          
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] relative">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center px-6 pt-2 z-20">
              <div className="flex items-center space-x-1 text-white text-sm font-medium">
                <span>{currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="h-4 w-4 text-white" />
                <Wifi className="h-4 w-4 text-white" />
                <Battery className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 p-6 h-full flex flex-col">
              
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">AI Assistant</h1>
                <p className="text-gray-400 text-sm">Sprechen Sie mit Ihrem KI-Agent</p>
              </div>

              {/* Central Display Area */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                
                {/* Status Display */}
                <motion.div 
                  className="text-center space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Main Status Icon */}
                  <div className="relative">
                    <motion.div
                      className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center",
                        showActiveState 
                          ? "bg-gradient-to-r from-green-500 to-blue-500" 
                          : "bg-gradient-to-r from-gray-600 to-gray-700"
                      )}
                      animate={showActiveState ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className="text-white text-3xl">
                        {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8" } as React.Attributes)}
                      </div>
                    </motion.div>
                    
                    {/* Pulse Animation for Active States */}
                    {showActiveState && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </div>

                  {/* Status Text */}
                  <div className="space-y-2">
                    <p className={cn("text-lg font-medium", color)}>{text}</p>
                    {showActiveState && (
                      <motion.div
                        className="flex justify-center space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Voice Visualization */}
                {(isTalking || isListening) && (
                  <motion.div
                    className="flex justify-center space-x-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "w-1 bg-gradient-to-t rounded-full",
                          isTalking 
                            ? "from-green-500 to-green-300" 
                            : "from-blue-500 to-blue-300"
                        )}
                        animate={{
                          height: [10, Math.random() * 30 + 20, 10],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.5 + Math.random() * 0.5,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {canStartCall && (
                    <motion.button
                      key="start"
                      onClick={startCall}
                      disabled={!!error}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200",
                        "bg-gradient-to-r from-green-500 to-green-600 text-white",
                        "hover:from-green-600 hover:to-green-700 active:scale-95",
                        "disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed",
                        "shadow-lg hover:shadow-xl"
                      )}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="h-5 w-5" />
                        <span>Anruf starten</span>
                      </div>
                    </motion.button>
                  )}
                  
                  {canEndCall && (
                    <motion.button
                      key="end"
                      onClick={stopCall}
                      disabled={callStatus === 'stopping'}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200",
                        "bg-gradient-to-r from-red-500 to-red-600 text-white",
                        "hover:from-red-600 hover:to-red-700 active:scale-95",
                        "disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed",
                        "shadow-lg hover:shadow-xl"
                      )}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <PhoneOff className="h-5 w-5" />
                        <span>Anruf beenden</span>
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}