
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignAvatar from './SignAvatar';

interface SignDisplayProps {
  text: string;
}

const SignDisplay = ({ text }: SignDisplayProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (text) {
      const cleanedText = text.toLowerCase().replace(/[^\w\s]/gi, '');
      const wordsArray = cleanedText.split(' ');
      setWords(wordsArray);
      setCurrentWordIndex(-1);
      setIsAnimating(true);
      
      // Start the animation sequence
      animateWords(wordsArray);
    }
  }, [text]);

  const animateWords = (wordsArray: string[]) => {
    setCurrentWordIndex(-1);
    
    wordsArray.forEach((_, index) => {
      setTimeout(() => {
        setCurrentWordIndex(index);
      }, index * 1500); // Show each word for 1.5 seconds
    });
    
    // Reset after all words are shown
    setTimeout(() => {
      setIsAnimating(false);
    }, wordsArray.length * 1500 + 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl min-h-[350px] flex flex-col items-center justify-center">
        {text ? (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground/70 mb-1">Sign Language Display</h3>
              <p className="text-sm text-muted-foreground">Visualizing: {text}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[250px]">
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
            <motion.div 
              className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {/* Default avatar in resting position */}
              <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-5 mb-2">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="w-4 h-1 bg-gray-800 rounded-full mt-2"></div>
                </div>
              </div>
              
              <div className="absolute w-20 h-40 bg-blue-500 rounded-2xl top-16"></div>
              
              <div className="absolute w-8 h-24 bg-blue-500 rounded-full -left-2 top-20">
                <div className="absolute w-10 h-10 bg-amber-200 rounded-full bottom-0 -right-1"></div>
              </div>
              
              <div className="absolute w-8 h-24 bg-blue-500 rounded-full -right-2 top-20">
                <div className="absolute w-10 h-10 bg-amber-200 rounded-full bottom-0 -left-1"></div>
              </div>
            </motion.div>
            
            <h3 className="text-xl font-medium text-foreground/70">Speak to see sign language</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your words will be visualized as sign language gestures
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignDisplay;
