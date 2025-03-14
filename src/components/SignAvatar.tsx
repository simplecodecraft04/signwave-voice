
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface SignAvatarProps {
  word: string;
  isActive: boolean;
}

// Dictionary mapping words to sign animation parameters with improved realistic hand gestures
export const signAnimations: Record<string, any> = {
  hello: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0.4, 0.2], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0.5, 0.5, 0.5, 0.5], [0, 0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    head: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0, 0.2, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    }
  },
  goodbye: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.1, 0.5, -0.2], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.2, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0.2, 0.2, 0.2, 0.2], [0, 0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    }
  },
  thank: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [-0.2, 0.3, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    head: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.2, 0, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    }
  },
  you: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0, 0.2, 0.4], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0, 0, 0.2], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        fingerPoint: true,
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    }
  },
  please: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0.3, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.1, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0.1, 0.1, 0.1, 0.1], [0, 0, 0, 0]],
        circularMotion: true,
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    leftArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, -0.3, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    },
    leftHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.1, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0.1, 0.1, 0.1, 0.1], [0, 0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
        repeat: 1
      }
    }
  },
  yes: {
    head: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0, 0], [0, 0, 0], [-0.3, 0, 0], [0, 0, 0]],
        timing: [0, 0.25, 0.5, 0.75, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.2, 0, 0.3], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.2, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        fist: true,
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    }
  },
  no: {
    head: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0, -0.2, 0], [0, 0, 0], [0, 0.2, 0], [0, 0, 0]],
        timing: [0, 0.25, 0.5, 0.75, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.1, 0.3, 0.1], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0, 0, 0.2], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        indexFinger: true,
        timing: [0, 0.5, 1],
        duration: 1.5,
        repeat: 1
      }
    }
  },
  // Default animation for words without specific animations
  default: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.2, 0.2, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1,
        repeat: 1
      }
    },
    rightHand: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.1, 0, 0], [0, 0, 0]],
        fingerSpread: [[0, 0, 0, 0], [0.2, 0.2, 0.2, 0.2], [0, 0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1,
        repeat: 1
      }
    }
  }
};

// Enhanced interpolation function for smoother animations
const interpolate = (progress: number, timings: number[], values: number[]) => {
  if (progress <= timings[0]) return values[0];
  if (progress >= timings[timings.length - 1]) return values[values.length - 1];
  
  // Find the appropriate segment
  for (let i = 0; i < timings.length - 1; i++) {
    if (progress >= timings[i] && progress <= timings[i + 1]) {
      // Calculate the normalized position within this segment
      const segmentProgress = (progress - timings[i]) / (timings[i + 1] - timings[i]);
      // Smoothed interpolation with easing function
      const easedProgress = easeInOutCubic(segmentProgress);
      // Linear interpolation between the two values with easing
      return values[i] + easedProgress * (values[i + 1] - values[i]);
    }
  }
  
  return values[0]; // Fallback
};

// Easing function for smoother motion
const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// Realistic 3D Avatar Model with enhanced animated parts and improved hand gestures
export const AvatarModel = ({ animation, isActive }: { animation: any, isActive: boolean }) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightFingerRefs = useRef<THREE.Object3D[]>([]);
  const leftFingerRefs = useRef<THREE.Object3D[]>([]);
  
  // Track animation progress
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationActive = useRef(false);
  const startTime = useRef(0);
  
  useEffect(() => {
    if (isActive) {
      animationActive.current = true;
      startTime.current = Date.now();
    }
  }, [isActive]);
  
  // Animation loop with enhanced realistic movements
  useFrame(() => {
    if (!animationActive.current) return;
    
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const headAnimation = animation.head?.animate;
    const rightArmAnimation = animation.rightArm?.animate;
    const leftArmAnimation = animation.leftArm?.animate;
    const rightHandAnimation = animation.rightHand?.animate;
    const leftHandAnimation = animation.leftHand?.animate;
    
    // Get duration from longest animation
    const maxDuration = Math.max(
      headAnimation?.duration || 0,
      rightArmAnimation?.duration || 0,
      leftArmAnimation?.duration || 0,
      rightHandAnimation?.duration || 0,
      leftHandAnimation?.duration || 0
    );
    
    // Calculate progress (0 to 1)
    const progress = Math.min(elapsedTime / maxDuration, 1);
    setAnimationProgress(progress);
    
    // Reset when complete
    if (progress >= 1) {
      // Check if we should repeat
      const maxRepeats = Math.max(
        headAnimation?.repeat || 0,
        rightArmAnimation?.repeat || 0,
        leftArmAnimation?.repeat || 0,
        rightHandAnimation?.repeat || 0,
        leftHandAnimation?.repeat || 0
      );
      
      if (maxRepeats > 0) {
        startTime.current = Date.now();
        // Decrement repeat counter
        if (headAnimation) headAnimation.repeat = Math.max(0, headAnimation.repeat - 1);
        if (rightArmAnimation) rightArmAnimation.repeat = Math.max(0, rightArmAnimation.repeat - 1);
        if (leftArmAnimation) leftArmAnimation.repeat = Math.max(0, leftArmAnimation.repeat - 1);
        if (rightHandAnimation) rightHandAnimation.repeat = Math.max(0, rightHandAnimation.repeat - 1);
        if (leftHandAnimation) leftHandAnimation.repeat = Math.max(0, leftHandAnimation.repeat - 1);
      } else {
        animationActive.current = false;
      }
    }
    
    // Animate head with improved physics
    if (headRef.current && headAnimation) {
      const rotationX = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[2]));
      
      headRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    // Animate right arm with improved joint movement
    if (rightArmRef.current && rightArmAnimation) {
      const rotationX = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[2]));
      
      rightArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    // Animate left arm with improved joint movement
    if (leftArmRef.current && leftArmAnimation) {
      const rotationX = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[2]));
      
      leftArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    // Animate right hand with detailed finger positions
    if (rightHandRef.current && rightHandAnimation) {
      const rotationX = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map(r => r[2]));
      
      rightHandRef.current.rotation.set(rotationX, rotationY, rotationZ);
      
      // Animate fingers for sign language gestures
      if (rightFingerRefs.current.length > 0 && rightHandAnimation.fingerSpread) {
        rightFingerRefs.current.forEach((finger, index) => {
          if (!finger) return;
          
          // Apply different finger positions based on specific gestures
          if (rightHandAnimation.fingerPoint && index === 1) {
            // Index finger pointing gesture
            finger.rotation.set(0, 0, -0.5);
          } else if (rightHandAnimation.fist) {
            // Fist gesture
            finger.rotation.set(0, 0, 0.8);
          } else if (rightHandAnimation.indexFinger && index === 1) {
            // Index finger extended (for signs like "no")
            finger.rotation.set(0, 0, 0);
          } else if (rightHandAnimation.fingerSpread) {
            // Apply the spread values from the animation
            const spreadValue = rightHandAnimation.fingerSpread ? 
              interpolate(progress, rightHandAnimation.timing, rightHandAnimation.fingerSpread.map(s => s[index] || 0)) : 0;
            
            finger.rotation.set(0, 0, -spreadValue);
          }
          
          // Add circular motion for specific gestures like "please"
          if (rightHandAnimation.circularMotion) {
            const circleX = Math.sin(progress * Math.PI * 2) * 0.1;
            const circleZ = Math.cos(progress * Math.PI * 2) * 0.1;
            finger.position.x += circleX;
            finger.position.z += circleZ;
          }
        });
      }
    }
    
    // Animate left hand with detailed finger positions
    if (leftHandRef.current && leftHandAnimation) {
      const rotationX = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map(r => r[2]));
      
      leftHandRef.current.rotation.set(rotationX, rotationY, rotationZ);
      
      // Animate fingers
      if (leftFingerRefs.current.length > 0 && leftHandAnimation.fingerSpread) {
        leftFingerRefs.current.forEach((finger, index) => {
          if (!finger) return;
          
          const spreadValue = leftHandAnimation.fingerSpread ? 
            interpolate(progress, leftHandAnimation.timing, leftHandAnimation.fingerSpread.map(s => s[index] || 0)) : 0;
          
          finger.rotation.set(0, 0, spreadValue);
        });
      }
    }
  });
  
  // Create materials with enhanced textures and colors for greater realism
  const skinMaterial = new THREE.MeshStandardMaterial({ 
    color: "#F5D5C0", 
    roughness: 0.5,
    metalness: 0.1,
    envMapIntensity: 0.8
  });
  
  const hairMaterial = new THREE.MeshStandardMaterial({ 
    color: "#403E43", 
    roughness: 0.8,
    metalness: 0.2,
    envMapIntensity: 0.5
  });
  
  const shirtMaterial = new THREE.MeshStandardMaterial({ 
    color: "#3b82f6", 
    roughness: 0.5,
    metalness: 0.2,
    envMapIntensity: 0.8
  });
  
  const pantsMaterial = new THREE.MeshStandardMaterial({ 
    color: "#1e3a8a", 
    roughness: 0.6,
    metalness: 0.1,
    envMapIntensity: 0.6
  });
  
  return (
    <group position={[0, -1, 0]}>
      {/* Head with more detailed features */}
      <group ref={headRef} position={[0, 2.7, 0]}>
        {/* Base head */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Hair with more natural styling */}
        <mesh castShadow position={[0, 0.2, 0]} scale={[1.1, 0.35, 1.1]}>
          <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={hairMaterial} />
        </mesh>
        
        {/* Eyes with more lifelike details */}
        <group position={[0.15, 0.1, 0.4]}>
          {/* Eye white */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Iris with realistic color and detail */}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#5B9BD5" />
          </mesh>
          
          {/* Pupil */}
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Eyelid */}
          <mesh position={[0, 0.05, 0.03]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.15, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
        </group>
        
        <group position={[-0.15, 0.1, 0.4]}>
          {/* Eye white */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Iris with realistic color and detail */}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#5B9BD5" />
          </mesh>
          
          {/* Pupil */}
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Eyelid */}
          <mesh position={[0, 0.05, 0.03]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.15, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
        </group>
        
        {/* Mouth with more realistic shape and expression */}
        <mesh position={[0, -0.15, 0.4]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#c1665a" />
        </mesh>
        
        {/* Lips highlight for realism */}
        <mesh position={[0, -0.13, 0.43]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[0.22, 0.03]} />
          <meshStandardMaterial color="#d17e73" transparent opacity={0.6} />
        </mesh>
        
        {/* Nose with better shaping */}
        <mesh position={[0, 0, 0.45]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Ears with realistic shape */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Eyebrows for more expressiveness */}
        <mesh position={[0.15, 0.25, 0.4]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <primitive object={hairMaterial} />
        </mesh>
        
        <mesh position={[-0.15, 0.25, 0.4]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <primitive object={hairMaterial} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh castShadow position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <primitive object={skinMaterial} />
      </mesh>
      
      {/* Body with better proportions and details */}
      <group ref={bodyRef} position={[0, 1.5, 0]}>
        {/* Torso */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.2, 0.5]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Collar and shirt details */}
        <mesh position={[0, 0.6, 0.25]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#285fc4" />
        </mesh>
        
        {/* Shirt wrinkles for realism */}
        <mesh position={[0, 0.2, 0.26]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#285fc4" transparent opacity={0.3} />
        </mesh>
      </group>
      
      {/* Right Arm with improved joints and natural movement */}
      <group ref={rightArmRef} position={[0.6, 2, 0]}>
        {/* Upper arm */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Elbow joint with more natural bend */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Lower arm */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Right Hand with detailed articulations for sign language */}
        <group ref={rightHandRef} position={[0, -1.1, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.25, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Thumb with improved articulation */}
          <mesh 
            castShadow 
            position={[-0.1, -0.1, 0]} 
            rotation={[0, 0, -Math.PI / 4]}
          >
            <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Fingers with individual movement for signing */}
          {[0.05, 0.02, -0.01, -0.04].map((x, i) => {
            return (
              <mesh
                key={i}
                ref={(el) => {
                  if (el) rightFingerRefs.current[i] = el;
                }}
                castShadow
                position={[x, -0.18, 0]}
                rotation={[0, 0, 0]}
              >
                <capsuleGeometry args={[0.02, 0.15, 8, 8]} />
                <primitive object={skinMaterial} />
                
                {/* Finger joints for detailed hand signs */}
                <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0]}>
                  <capsuleGeometry args={[0.018, 0.1, 8, 8]} />
                  <primitive object={skinMaterial} />
                </mesh>
                
                {/* Fingertips */}
                <mesh position={[0, -0.16, 0]} rotation={[0, 0, 0]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <primitive object={skinMaterial} />
                </mesh>
              </mesh>
            );
          })}
        </group>
      </group>
      
      {/* Left Arm with improved joints and natural movement */}
      <group ref={leftArmRef} position={[-0.6, 2, 0]}>
        {/* Upper arm */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Elbow joint with more natural bend */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Lower arm */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Left Hand with detailed articulations for sign language */}
        <group ref={leftHandRef} position={[0, -1.1, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.25, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Thumb with improved articulation */}
          <mesh 
            castShadow 
            position={[0.1, -0.1, 0]} 
            rotation={[0, 0, Math.PI / 4]}
          >
            <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Fingers with individual movement for signing */}
          {[0.05, 0.02, -0.01, -0.04].map((x, i) => {
            return (
              <mesh
                key={i}
                ref={(el) => {
                  if (el) leftFingerRefs.current[i] = el;
                }}
                castShadow
                position={[-x, -0.18, 0]}
                rotation={[0, 0, 0]}
              >
                <capsuleGeometry args={[0.02, 0.15, 8, 8]} />
                <primitive object={skinMaterial} />
                
                {/* Finger joints for detailed hand signs */}
                <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0]}>
                  <capsuleGeometry args={[0.018, 0.1, 8, 8]} />
                  <primitive object={skinMaterial} />
                </mesh>
                
                {/* Fingertips */}
                <mesh position={[0, -0.16, 0]} rotation={[0, 0, 0]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <primitive object={skinMaterial} />
                </mesh>
              </mesh>
            );
          })}
        </group>
      </group>
      
      {/* Legs with better proportions and natural stance */}
      <group position={[0.25, 0.4, 0]}>
        {/* Upper leg */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Knee */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Lower leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Ankle */}
        <mesh position={[0, -1.24, 0.05]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Shoe */}
        <mesh castShadow position={[0, -1.3, 0.1]}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#403E43" />
        </mesh>
      </group>
      
      <group position={[-0.25, 0.4, 0]}>
        {/* Upper leg */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Knee */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Lower leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Ankle */}
        <mesh position={[0, -1.24, 0.05]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Shoe */}
        <mesh castShadow position={[0, -1.3, 0.1]}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#403E43" />
        </mesh>
      </group>
    </group>
  );
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
      <div className="w-72 h-72 relative">
        <Canvas 
          camera={{ position: [0, 1.5, 5], fov: 50 }} 
          shadows 
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={0.5} castShadow />
          <directionalLight
            position={[0, 10, 5]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Environment preset="apartment" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={true} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
          <AvatarModel animation={animation} isActive={isActive} />
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={1.5} 
            far={2} 
          />
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -1.5, 0]} 
            receiveShadow
          >
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
        </Canvas>
      </div>
      <div className="mt-4 text-xl font-medium text-primary">{word}</div>
    </div>
  );
};

export default SignAvatar;
