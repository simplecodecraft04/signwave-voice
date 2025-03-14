
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SignAvatarProps {
  word: string;
  isActive: boolean;
}

// Dictionary mapping words to sign animation states
const signAnimations: Record<string, any> = {
  hello: {
    initial: { rotate: 0, x: 0 },
    animate: { 
      rotate: [0, 30, 0],
      x: [0, 10, 0],
      transition: { 
        duration: 1,
        repeat: 1,
        ease: "easeInOut" 
      }
    }
  },
  goodbye: {
    initial: { rotate: 0, x: 0 },
    animate: { 
      rotate: [0, -30, 0],
      x: [0, -10, 0],
      transition: { 
        duration: 1, 
        repeat: 1,
        ease: "easeInOut" 
      }
    }
  },
  thank: {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: { 
        duration: 0.8, 
        repeat: 1,
        ease: "easeInOut" 
      }
    }
  },
  you: {
    initial: { x: 0 },
    animate: { 
      x: [0, 20, 0],
      transition: { 
        duration: 0.7, 
        repeat: 1,
        ease: "easeInOut" 
      }
    }
  },
  please: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 0.9, 1],
      transition: { 
        duration: 0.8, 
        repeat: 1,
        ease: "easeInOut" 
      }
    }
  },
  // Default animation for words without specific animations
  default: {
    initial: { opacity: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: { 
        duration: 0.8, 
        repeat: 0,
        ease: "easeInOut" 
      }
    }
  }
};

const SignAvatar = ({ word, isActive }: SignAvatarProps) => {
  const [animation, setAnimation] = useState(signAnimations.default);
  
  useEffect(() => {
    // Look up the animation for this word, or use default if not found
    const wordAnimation = signAnimations[word.toLowerCase()] || signAnimations.default;
    setAnimation(wordAnimation);
  }, [word]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative"
        initial={animation.initial}
        animate={isActive ? animation.animate : animation.initial}
      >
        <div className="w-48 h-48 relative">
          {/* Avatar body */}
          <motion.div className="absolute inset-0 flex items-center justify-center">
            {/* Head */}
            <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center">
              {/* Face */}
              <div className="flex flex-col items-center">
                <div className="flex space-x-5 mb-2">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
                <div className="w-4 h-1 bg-gray-800 rounded-full mt-2"></div>
              </div>
            </div>
            
            {/* Body */}
            <div className="absolute w-20 h-40 bg-blue-500 rounded-2xl top-16"></div>
            
            {/* Left arm */}
            <motion.div 
              className="absolute w-8 h-24 bg-blue-500 rounded-full -left-2 top-20"
              initial={{ rotate: 0 }}
              animate={isActive ? { rotate: animation.animate.rotate || 0 } : { rotate: 0 }}
              transition={animation.animate.transition}
            >
              {/* Left hand */}
              <div className="absolute w-10 h-10 bg-amber-200 rounded-full bottom-0 -right-1"></div>
            </motion.div>
            
            {/* Right arm */}
            <motion.div 
              className="absolute w-8 h-24 bg-blue-500 rounded-full -right-2 top-20"
              initial={{ rotate: 0 }}
              animate={isActive ? { rotate: animation.animate.rotate ? -animation.animate.rotate : 0 } : { rotate: 0 }}
              transition={animation.animate.transition}
            >
              {/* Right hand */}
              <div className="absolute w-10 h-10 bg-amber-200 rounded-full bottom-0 -left-1"></div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="mt-4 text-xl font-medium text-primary">{word}</div>
    </div>
  );
};

export default SignAvatar;
