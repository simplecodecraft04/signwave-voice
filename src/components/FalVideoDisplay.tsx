
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateVideo, VeoVideoResponse } from '../services/falAiService';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface FalVideoDisplayProps {
  text: string;
  apiKey: string;
}

const FalVideoDisplay = ({ text, apiKey }: FalVideoDisplayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when text changes
    if (text) {
      setVideoUrl(null);
      setError(null);
      generateVideoFromText();
    }
  }, [text, apiKey]);

  const generateVideoFromText = async () => {
    if (!text || !apiKey) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateVideo(apiKey, { text });
      
      if (response.video_url) {
        setVideoUrl(response.video_url);
        setIsLoading(false);
      } else if (response.status === "processing") {
        // If the video is still processing, poll for status
        // In a production app, you might want to use a more sophisticated approach
        toast({
          title: "Video is processing",
          description: "Please wait while your video is being generated",
        });
        
        // Simple polling mechanism - in real-world, use websockets or better polling
        const checkInterval = setInterval(async () => {
          try {
            const updatedResponse = await fetch(response.video_url);
            if (updatedResponse.ok) {
              clearInterval(checkInterval);
              setVideoUrl(response.video_url);
              setIsLoading(false);
            }
          } catch (e) {
            // Continue polling
          }
        }, 3000);
        
        // Clear interval after 2 minutes to prevent infinite polling
        setTimeout(() => {
          clearInterval(checkInterval);
          if (isLoading) {
            setIsLoading(false);
            setError("Video generation timed out. Please try again.");
          }
        }, 120000);
      }
    } catch (err) {
      console.error("Error generating video:", err);
      setError("Failed to generate video. Please check your API key and try again.");
      setIsLoading(false);
    }
  };

  const retryGeneration = () => {
    generateVideoFromText();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col items-center justify-center">
        {!text ? (
          <div className="text-center">
            <div className="w-72 h-72 bg-muted/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-5xl">🎬</span>
            </div>
            
            <h3 className="text-xl font-medium text-foreground/70">Speak to generate a video</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your spoken words will be transformed into a video using fal.ai
            </p>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground/70 mb-1">Text to Video Generation</h3>
              <p className="text-sm text-muted-foreground">Visualizing: {text}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <Skeleton className="w-72 h-72 rounded-lg" />
                    <p className="mt-4 text-muted-foreground">Generating video...</p>
                  </motion.div>
                )}
                
                {!isLoading && videoUrl && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <video
                      src={videoUrl}
                      className="w-72 h-72 object-cover rounded-lg"
                      controls
                      autoPlay
                      loop
                    />
                    <p className="mt-4 text-primary font-medium">{text}</p>
                  </motion.div>
                )}
                
                {!isLoading && error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-72 h-72 bg-muted/20 rounded-lg flex items-center justify-center">
                      <span className="text-5xl">❌</span>
                    </div>
                    <p className="mt-4 text-destructive">{error}</p>
                    <Button onClick={retryGeneration} className="mt-4">
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FalVideoDisplay;
