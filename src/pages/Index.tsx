
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import VoiceInput from '../components/VoiceInput';
import SignDisplay from '../components/SignDisplay';
import Footer from '../components/Footer';

const Index = () => {
  const [transcription, setTranscription] = useState('');
  const [hamburgNotation, setHamburgNotation] = useState('');

  const handleTranscription = (text: string, hamburg: string) => {
    setTranscription(text);
    setHamburgNotation(hamburg);
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
                <span className="text-5xl">✋</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Voice to <span className="text-primary">Sign Language</span> Translation
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Speak into your microphone and watch as your words are transformed 
                into sign language gestures in real-time.
              </p>
            </motion.div>
          </section>
          
          <motion.section 
            className="mb-16 space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <VoiceInput onTranscription={handleTranscription} />
            <SignDisplay text={transcription} hamburgNotation={hamburgNotation} />
          </motion.section>
          
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="glass-card rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Why Use SignWave?</h2>
              
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
                      🤲
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Hamburg Notation</h3>
                  <p className="text-muted-foreground text-sm">
                    Converts speech to standardized sign language notation
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
