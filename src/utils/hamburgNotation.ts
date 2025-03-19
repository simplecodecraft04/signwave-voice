
/**
 * Hamburg Notation System Utility
 * 
 * This utility converts spoken text to Hamburg Notation format,
 * which is a standardized notation system for transcribing sign language
 * elements including hand shapes, positions, movements, and non-manual components.
 */

// Basic mapping of common words to Hamburg Notation
// In a production system, this would be much more comprehensive
const hamburgNotationMap: Record<string, string> = {
  // Basic greetings and common phrases
  'hello': 'B-hands-chest-outward^smile',
  'hi': 'B-hand-wave-palm-out',
  'goodbye': 'B-hands-wave-outward',
  'thank': 'B-hand-chin-forward',
  'thanks': 'B-hand-chin-forward',
  'you': 'G-hand-point-forward',
  'me': 'G-hand-point-self',
  'please': 'flat-hand-circular-chest',
  'sorry': 'A-hand-circular-chest',
  'yes': 'head-nod^fist-up-down',
  'no': 'head-shake^index-wag',
  
  // Basic questions
  'what': 'open5-hands-outward-questioning',
  'where': 'open5-hands-outward-questioning',
  'when': 'index-wrist-circular',
  'who': 'G-hand-question-outward',
  'why': 'G-hand-side-forehead-outward',
  'how': 'flat-hands-upward-questioning',
  
  // Common nouns
  'name': 'H-hands-together-outward',
  'home': 'flat-hand-chin-down-touch-flat',
  'work': 'S-hands-alternating-downward',
  'school': 'flat-hands-clap-twice',
  'family': 'F-hands-circular-together',
  'friend': 'hook-index-fingers-together-twice',
  
  // Common actions
  'eat': 'flat-hand-mouth-repeatedly',
  'drink': 'C-hand-mouth-tilt',
  'sleep': 'open-hand-face-down-tilt',
  'go': 'G-hands-forward-movement',
  'come': 'G-hands-beckoning-movement',
  'look': 'V-hand-eyes-outward',
  'see': 'V-hand-eyes-outward',
  'talk': 'hand-mouth-opening-closing',
  'sign': 'index-fingers-circling-forward',
  
  // Time references
  'now': 'B-hands-down-emphatic',
  'today': 'A-thumb-chin-down',
  'tomorrow': 'A-thumb-cheek-forward-arc',
  'yesterday': 'A-thumb-cheek-backward-arc',
  'time': 'index-wrist-tap-twice',
  
  // Pronouns
  'i': 'G-hand-point-self',
  'we': 'circular-G-hand-point-self-others',
  'they': 'G-hand-point-outward-arc',
  'he': 'G-hand-point-side',
  'she': 'G-hand-point-side',
  'it': 'G-hand-point-neutral',
  
  // Default for unknown words
  'default': 'generic-signing-motion'
};

/**
 * Converts text to Hamburg Notation format
 * 
 * @param text The spoken/transcribed text
 * @returns Text in Hamburg Notation format
 */
export const textToHamburgNotation = (text: string): string => {
  if (!text) return '';
  
  // Normalize the text (lowercase, remove punctuation)
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = normalizedText.split(' ');
  
  // Convert each word to Hamburg Notation
  const hamburgWords = words.map(word => {
    return hamburgNotationMap[word] || `${word}(${hamburgNotationMap['default']})`;
  });
  
  // Join with notation separators
  return hamburgWords.join(' | ');
};

/**
 * Extracts actionable gestures from Hamburg Notation
 * for animation purposes
 * 
 * @param hamburgText The Hamburg Notation text
 * @returns Array of gesture instructions
 */
export const parseHamburgNotation = (hamburgText: string): string[] => {
  if (!hamburgText) return [];
  
  // Split by notation separator
  return hamburgText.split(' | ').filter(Boolean);
};

/**
 * Maps Hamburg Notation to animation parameters
 * for the 3D avatar
 * 
 * @param gesture A single gesture instruction in Hamburg Notation
 * @returns Animation parameters object or null if no mapping exists
 */
export const hamburgToAnimationParams = (gesture: string): any => {
  // Extract the primary hand shape and movement
  const handShapeMatch = gesture.match(/^([A-Z0-9]+-hand|flat-hand|open-hand|hook-index|open5-hands|[A-Z]-hands)/i);
  const handShape = handShapeMatch ? handShapeMatch[0] : '';
  
  // Create animation parameters based on the notation
  // This is a simplified mapping - a real implementation would be more sophisticated
  const animParams: any = {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: {
        rotation: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    }
  };
  
  // Hand position mapping
  if (gesture.includes('-chest-')) {
    animParams.rightArm.animate.rotation = [[0, 0, 0], [0.3, 0, 0], [0, 0, 0]];
  } else if (gesture.includes('-outward') || gesture.includes('-forward')) {
    animParams.rightArm.animate.rotation = [[0, 0, 0], [0.3, 0.3, 0], [0, 0, 0]];
  } else if (gesture.includes('-circular-')) {
    animParams.rightArm.animate.rotation = [[0, 0, 0], [0.3, 0.2, 0.2], [0, 0, 0.2], [0, 0, 0]];
    animParams.rightArm.animate.timing = [0, 0.3, 0.7, 1];
  } else if (gesture.includes('-wave-')) {
    animParams.rightArm.animate.rotation = [[0, 0, 0], [0.2, 0, 0.2], [0.2, 0, -0.2], [0, 0, 0]];
    animParams.rightArm.animate.timing = [0, 0.3, 0.7, 1];
  } else if (gesture.includes('-point-')) {
    animParams.rightArm.animate.rotation = [[0, 0, 0], [0, 0.4, 0.2], [0, 0, 0]];
  }
  
  // Add head movements if specified
  if (gesture.includes('head-nod') || gesture.includes('^smile')) {
    animParams.head = {
      initial: { rotation: [0, 0, 0] },
      animate: {
        rotation: [[0, 0, 0], [0.2, 0, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    };
  } else if (gesture.includes('head-shake')) {
    animParams.head = {
      initial: { rotation: [0, 0, 0] },
      animate: {
        rotation: [[0, 0, 0], [0, 0.2, 0], [0, -0.2, 0], [0, 0, 0]],
        timing: [0, 0.3, 0.7, 1],
        duration: 1.2,
        repeat: 1
      }
    };
  }
  
  // Both hands motions
  if (gesture.includes('-hands-')) {
    animParams.leftArm = {
      initial: { rotation: [0, 0, 0] },
      animate: {
        rotation: [[0, 0, 0], [0.3, -0.3, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    };
  }
  
  return animParams;
};

export default {
  textToHamburgNotation,
  parseHamburgNotation,
  hamburgToAnimationParams
};
