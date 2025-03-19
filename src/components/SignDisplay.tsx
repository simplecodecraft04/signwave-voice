
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignAvatar from './SignAvatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AvatarModel, signAnimations } from './SignAvatar';
import { parseHamburgNotation, hamburgToAnimationParams } from '../utils/hamburgNotation';

interface SignDisplayProps {
  text: string;
  hamburgNotation?: string;
}

const SignDisplay = ({ text, hamburgNotation = '' }: SignDisplayProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [hamburgGestures, setHamburgGestures] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (text) {
      const cleanedText = text.toLowerCase().replace(/[^\w\s]/gi, '');
      const wordsArray = cleanedText.split(' ');
      setWords(wordsArray);
      
      // Parse Hamburg notation if available
      if (hamburgNotation) {
        const gestures = parseHamburgNotation(hamburgNotation);
        setHamburgGestures(gestures);
      } else {
        setHamburgGestures([]);
      }
      
      setCurrentWordIndex(-1);
      setIsAnimating(true);
      
      // Start the animation sequence
      animateWords(wordsArray);
    }
  }, [text, hamburgNotation]);

  const animateWords = (wordsArray: string[]) => {
    setCurrentWordIndex(-1);
    
    wordsArray.forEach((_, index) => {
      setTimeout(() => {
        setCurrentWordIndex(index);
      }, index * 2000); // Show each word for 2 seconds to allow for 3D animations
    });
    
    // Reset after all words are shown
    setTimeout(() => {
      setIsAnimating(false);
    }, wordsArray.length * 2000 + 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col items-center justify-center">
        {text ? (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground/70 mb-1">3D Sign Language Display</h3>
              <p className="text-sm text-muted-foreground">Visualizing: {text}</p>
              {hamburgNotation && (
                <p className="text-xs text-primary/70 mt-1 max-w-sm mx-auto truncate">
                  Using Hamburg Notation
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                {isAnimating && (
                  <motion.div
                    key={currentWordIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <SignAvatar 
                      word={currentWordIndex >= 0 ? words[currentWordIndex] : "hello"} 
                      isActive={currentWordIndex >= 0}
                      hamburgGesture={currentWordIndex >= 0 && hamburgGestures.length > currentWordIndex ? 
                        hamburgGestures[currentWordIndex] : undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!isAnimating && words.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex flex-wrap justify-center gap-2"
                >
                  {words.map((word, index) => (
                    <div key={index} className="px-3 py-1.5 bg-secondary rounded-lg text-sm font-medium">
                      {word}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-72 h-72 mx-auto mb-4">
              <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  enableRotate={true}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 4}
                />
                <AvatarModel 
                  animation={signAnimations.default} 
                  isActive={true} 
                />
              </Canvas>
            </div>
            
            <h3 className="text-xl font-medium text-foreground/70">Speak to see 3D sign language</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your words will be visualized as 3D sign language gestures
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignDisplay;
