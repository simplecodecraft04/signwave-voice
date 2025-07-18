
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSignLanguageVideo } from '../services/falAiService';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import ApiKeyForm, { getStoredApiKey } from './ApiKeyForm';

interface FalVideoDisplayProps {
  text: string;
}

const FalVideoDisplay = ({ text }: FalVideoDisplayProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(getStoredApiKey());
  const [showApiKeyForm, setShowApiKeyForm] = useState<boolean>(false);

  // Check for API key on mount and when the text changes
  useEffect(() => {
    const storedApiKey = getStoredApiKey();
    setApiKey(storedApiKey);
    
    if (text && storedApiKey) {
      generateVideo();
    }
  }, [text]);

  // When API key is updated, try generating video if text exists
  useEffect(() => {
    if (text && apiKey) {
      generateVideo();
    }
  }, [apiKey]);

  const generateVideo = async () => {
    if (!text.trim()) return;
    
    const currentApiKey = getStoredApiKey();
    if (!currentApiKey) {
      setShowApiKeyForm(true);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Requesting video generation for:", text);
      const url = await generateSignLanguageVideo({
        prompt: text,
        apiKey: currentApiKey,
      });
      
      console.log("Video generation result:", url);
      
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Failed to generate video");
      }
    } catch (err) {
      console.error("Video generation error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  // If no API key is set, show the API key form
  if (showApiKeyForm || !apiKey) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-foreground/70 mb-1">API Key Required</h3>
            <p className="text-sm text-muted-foreground">
              To use the sign language video generation feature, you need to provide your fal.ai API key
            </p>
          </div>
          
          <ApiKeyForm />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4" 
            onClick={() => setShowApiKeyForm(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col items-center justify-center">
        {text ? (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground/70 mb-1">Sign Language Video</h3>
              <p className="text-sm text-muted-foreground">Converting: {text}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating sign language video...</p>
                    <p className="text-xs text-muted-foreground mt-2">This may take a minute</p>
                  </motion.div>
                ) : videoUrl ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-md"
                  >
                    <video 
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="mt-4 flex justify-center">
                      <Button onClick={generateVideo}>Regenerate</Button>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-destructive mb-4">{error}</p>
                    <div className="flex flex-col gap-2 items-center">
                      <Button onClick={generateVideo}>Try Again</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowApiKeyForm(true)}
                        className="flex items-center gap-1"
                      >
                        <KeyRound className="h-4 w-4" /> Update API Key
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <motion.div 
                className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-5xl">🎬</span>
              </motion.div>
            </div>
            
            <h3 className="text-xl font-medium text-foreground/70">Speak to generate sign language video</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your words will be transformed into sign language videos using fal.ai veo2
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiKeyForm(true)}
              className="mt-4 flex items-center gap-1"
            >
              <KeyRound className="h-4 w-4" /> API Key Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FalVideoDisplay;
