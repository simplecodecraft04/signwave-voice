
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { textToHamburgNotation } from '../utils/hamburgNotation';

interface VoiceInputProps {
  onTranscription: (text: string, hamburgNotation: string) => void;
}

const VoiceInput = ({ onTranscription }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hamburgNotation, setHamburgNotation] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptResult = result[0].transcript;
      
      setTranscript(transcriptResult);
      
      // Convert to Hamburg Notation
      const hamburg = textToHamburgNotation(transcriptResult);
      setHamburgNotation(hamburg);
      
      setIsAnimating(true);
    };
    
    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current?.start();
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
      setTranscript('');
      setHamburgNotation('');
    }
  };
  
  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscription(transcript, hamburgNotation);
      setTranscript('');
      setHamburgNotation('');
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
    setHamburgNotation('');
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full">
            <div className="relative w-full min-h-32 bg-secondary/50 rounded-xl p-4 overflow-hidden">
              <AnimatePresence>
                {transcript ? (
                  <motion.div
                    key="transcript-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <motion.p
                      key="transcript"
                      className="text-foreground/90 text-lg font-medium"
                    >
                      {transcript}
                    </motion.p>
                    
                    {hamburgNotation && (
                      <motion.div
                        key="hamburg"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-sm font-medium bg-secondary/30 p-2 rounded-md"
                      >
                        <div className="text-xs text-primary/70 mb-1">Hamburg Notation:</div>
                        {hamburgNotation}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground text-lg font-medium"
                  >
                    {isListening 
                      ? "Speak now... I'm listening" 
                      : "Press the microphone button to start speaking"}
                  </motion.p>
                )}
              </AnimatePresence>
              
              {isListening && (
                <div className="absolute bottom-4 right-4 flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                      animate={{
                        height: [4, 12, 4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 flex items-center justify-center rounded-full focus-ring ${
                isListening
                  ? "bg-destructive text-white"
                  : "bg-primary text-white"
              } shadow-md`}
              onClick={toggleListening}
            >
              {isListening ? (
                <MicOff size={24} className="animate-pulse" />
              ) : (
                <Mic size={24} />
              )}
            </motion.button>
            
            {transcript && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-foreground shadow-sm focus-ring"
                  onClick={resetTranscript}
                >
                  <Square size={18} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-sm focus-ring"
                  onClick={handleSubmit}
                >
                  <Play size={18} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
