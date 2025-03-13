
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignDisplayProps {
  text: string;
}

// Mock data for sign language animations
// In a real app, this would be replaced with actual sign language animations or images
const mockSigns: Record<string, string> = {
  hello: "👋",
  world: "🌎",
  my: "👉",
  name: "📛",
  is: "🟰",
  thank: "🙏",
  you: "👉",
  please: "🤲",
  sorry: "🙇",
  yes: "👍",
  no: "👎",
  help: "🆘",
  want: "👐",
  love: "❤️",
  good: "👌",
  bad: "👎",
  how: "❓",
  what: "❓",
  where: "📍",
  when: "⏰",
  who: "👤",
  why: "❓",
  // Add more as needed
};

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
      }, index * 1000); // Show each word for 1 second
    });
    
    // Reset after all words are shown
    setTimeout(() => {
      setIsAnimating(false);
    }, wordsArray.length * 1000 + 1000);
  };

  const getSignForWord = (word: string): string => {
    return mockSigns[word.toLowerCase()] || '🔄'; // Return the sign or a default
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-2xl min-h-[200px] flex flex-col items-center justify-center">
        {text ? (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground/70 mb-1">Sign Language Display</h3>
              <p className="text-sm text-muted-foreground">Visualizing: {text}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                {isAnimating && (
                  <motion.div
                    key={currentWordIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-7xl mb-4">
                      {currentWordIndex >= 0 ? getSignForWord(words[currentWordIndex]) : "👋"}
                    </div>
                    <div className="text-xl font-medium text-primary">
                      {currentWordIndex >= 0 ? words[currentWordIndex] : "Ready"}
                    </div>
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
              className="text-5xl mb-4"
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👋
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
