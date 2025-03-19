
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pipeline } from '@huggingface/transformers';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

const VoiceInput = ({ onTranscription }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const huggingfaceModelRef = useRef<any>(null);
  
  // Initialize Hugging Face model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        setError(null);
        
        // Load the speech recognition model
        const speechRecognizer = await pipeline(
          "automatic-speech-recognition", 
          "harislania/urdu-speech-to-text"
        );
        
        huggingfaceModelRef.current = speechRecognizer;
        setIsModelReady(true);
        console.log("Hugging Face model loaded successfully");
      } catch (err) {
        console.error("Error loading Hugging Face model:", err);
        setError("Failed to load speech recognition model. Falling back to browser API.");
        // We'll still initialize the browser's SpeechRecognition as fallback
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    // Initialize browser's SpeechRecognition as fallback
    if (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)) {
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
        setIsAnimating(true);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isListening]);
  
  const startRecordingForHuggingFace = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0 && huggingfaceModelRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          try {
            // Process the audio using the Hugging Face model
            const result = await huggingfaceModelRef.current(audioBlob);
            console.log("Hugging Face transcription result:", result);
            
            if (result && result.text) {
              setTranscript(result.text);
              setIsAnimating(true);
            }
          } catch (err) {
            console.error("Error during Hugging Face transcription:", err);
            setError("Error processing speech. Please try again.");
          }
        }
      };
      
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      if (isModelReady && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Start listening
      setTranscript('');
      setError(null);
      
      if (isModelReady) {
        startRecordingForHuggingFace();
      } else if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setError("Speech recognition is not available in this browser.");
        return;
      }
      
      setIsListening(true);
    }
  };
  
  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscription(transcript);
      setTranscript('');
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col items-center space-y-6">
          {isModelLoading && (
            <div className="text-center text-amber-500 mb-2">
              Loading speech recognition model...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 mb-2">
              {error}
            </div>
          )}
          
          <div className="w-full">
            <div className="relative w-full h-32 bg-secondary/50 rounded-xl p-4 overflow-hidden">
              <AnimatePresence>
                {transcript ? (
                  <motion.p
                    key="transcript"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-foreground/90 text-lg font-medium"
                  >
                    {transcript}
                  </motion.p>
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
              } shadow-md ${isModelLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={toggleListening}
              disabled={isModelLoading}
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
          
          <div className="text-center text-sm text-muted-foreground">
            {isModelReady ? 
              "Using Urdu Speech-to-Text model from Hugging Face" : 
              "Using browser's speech recognition API"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
