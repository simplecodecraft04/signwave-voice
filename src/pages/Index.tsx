
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import VoiceInput from '../components/VoiceInput';
import FalVideoDisplay from '../components/FalVideoDisplay';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [transcription, setTranscription] = useState('');
  const [hamburgNotation, setHamburgNotation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');

  const handleTranscription = (text: string, hamburg: string) => {
    setTranscription(text);
    setHamburgNotation(hamburg);
  };

  const handleSaveApiKey = () => {
    setSavedApiKey(apiKey);
    // You could also save this to localStorage if you want it to persist
    // localStorage.setItem('falApiKey', apiKey);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <section className="mb-16 pt-8 pb-12">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block mb-4"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
              >
                <span className="text-5xl">🎬</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Voice to <span className="text-primary">Video</span> Generation
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Speak into your microphone and watch as your words are transformed 
                into videos in real-time using fal.ai's veo2 model.
              </p>
            </motion.div>
          </section>
          
          <motion.section 
            className="mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="space-y-4">
                <Label htmlFor="api-key">fal.ai API Key</Label>
                <Input 
                  id="api-key"
                  type="password"
                  placeholder="Enter your fal.ai API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  onClick={handleSaveApiKey} 
                  disabled={!apiKey} 
                  className="w-full"
                >
                  Save API Key
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored in browser memory only for this session.
                </p>
              </div>
            </div>
          </motion.section>
          
          <motion.section 
            className="mb-16 space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <VoiceInput onTranscription={handleTranscription} />
            <FalVideoDisplay text={transcription} apiKey={savedApiKey} />
          </motion.section>
          
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="glass-card rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Why Use Our Platform?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <motion.span 
                      className="text-3xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                    >
                      🔊
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Speech Recognition</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced speech recognition technology for accurate transcription
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <motion.span 
                      className="text-3xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                    >
                      🎬
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">AI Video Generation</h3>
                  <p className="text-muted-foreground text-sm">
                    Converts speech to high-quality videos using fal.ai veo2
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <motion.span 
                      className="text-3xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                    >
                      ♿
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Accessibility</h3>
                  <p className="text-muted-foreground text-sm">
                    Breaking communication barriers through technology
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
