
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SignAvatarProps {
  word: string;
  isActive: boolean;
}

// Dictionary mapping words to sign animation parameters
export const signAnimations: Record<string, any> = {
  hello: {
    rightArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, 0, 0.5], [0, 0, 0]],
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
        rotation: [[0, 0, 0], [0.3, 0, -0.5], [0, 0, 0]],
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
        rotation: [[0, 0, 0], [0.5, 0, 0], [0, 0, 0]],
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
        rotation: [[0, 0, 0], [0, 0.4, 0.2], [0, 0, 0]],
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
    leftArm: {
      initial: { rotation: [0, 0, 0] },
      animate: { 
        rotation: [[0, 0, 0], [0.3, -0.3, 0], [0, 0, 0]],
        timing: [0, 0.5, 1],
        duration: 1.2,
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
    }
  }
};

// Simple interpolation function
const interpolate = (progress: number, timings: number[], values: number[]) => {
  if (progress <= timings[0]) return values[0];
  if (progress >= timings[timings.length - 1]) return values[values.length - 1];
  
  // Find the appropriate segment
  for (let i = 0; i < timings.length - 1; i++) {
    if (progress >= timings[i] && progress <= timings[i + 1]) {
      // Calculate the normalized position within this segment
      const segmentProgress = (progress - timings[i]) / (timings[i + 1] - timings[i]);
      // Linear interpolation between the two values
      return values[i] + segmentProgress * (values[i + 1] - values[i]);
    }
  }
  
  return values[0]; // Fallback
};

// Realistic 3D Avatar Model with animated parts
export const AvatarModel = ({ animation, isActive }: { animation: any, isActive: boolean }) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  
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
  
  // Animation loop
  useFrame(() => {
    if (!animationActive.current) return;
    
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const headAnimation = animation.head?.animate;
    const rightArmAnimation = animation.rightArm?.animate;
    const leftArmAnimation = animation.leftArm?.animate;
    
    // Get duration from longest animation
    const maxDuration = Math.max(
      headAnimation?.duration || 0,
      rightArmAnimation?.duration || 0,
      leftArmAnimation?.duration || 0
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
        leftArmAnimation?.repeat || 0
      );
      
      if (maxRepeats > 0) {
        startTime.current = Date.now();
        // Decrement repeat counter
        if (headAnimation) headAnimation.repeat = Math.max(0, headAnimation.repeat - 1);
        if (rightArmAnimation) rightArmAnimation.repeat = Math.max(0, rightArmAnimation.repeat - 1);
        if (leftArmAnimation) leftArmAnimation.repeat = Math.max(0, leftArmAnimation.repeat - 1);
      } else {
        animationActive.current = false;
      }
    }
    
    // Animate head if available
    if (headRef.current && headAnimation) {
      const rotationX = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, headAnimation.timing, headAnimation.rotation.map(r => r[2]));
      
      headRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    // Animate right arm if available
    if (rightArmRef.current && rightArmAnimation) {
      const rotationX = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map(r => r[2]));
      
      rightArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    // Animate left arm if available
    if (leftArmRef.current && leftArmAnimation) {
      const rotationX = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[0]));
      const rotationY = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[1]));
      const rotationZ = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map(r => r[2]));
      
      leftArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
  });
  
  // Create materials with better textures and colors
  const skinMaterial = new THREE.MeshStandardMaterial({ 
    color: "#FDE1D3", 
    roughness: 0.7,
    metalness: 0.1
  });
  
  const hairMaterial = new THREE.MeshStandardMaterial({ 
    color: "#403E43", 
    roughness: 0.8,
    metalness: 0.1
  });
  
  const shirtMaterial = new THREE.MeshStandardMaterial({ 
    color: "#3b82f6", 
    roughness: 0.5,
    metalness: 0.2
  });
  
  const pantsMaterial = new THREE.MeshStandardMaterial({ 
    color: "#1e3a8a", 
    roughness: 0.6,
    metalness: 0.1
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
        
        {/* Hair */}
        <mesh castShadow position={[0, 0.2, 0]} scale={[1.1, 0.35, 1.1]}>
          <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={hairMaterial} />
        </mesh>
        
        {/* Eyes with more detail */}
        <group position={[0.15, 0.1, 0.4]}>
          {/* Eye white */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Iris and pupil */}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#5B9BD5" />
          </mesh>
          
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        <group position={[-0.15, 0.1, 0.4]}>
          {/* Eye white */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Iris and pupil */}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#5B9BD5" />
          </mesh>
          
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        {/* Mouth with more detail */}
        <mesh position={[0, -0.15, 0.4]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#c1665a" />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.45]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh castShadow position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <primitive object={skinMaterial} />
      </mesh>
      
      {/* Body with better proportions */}
      <group ref={bodyRef} position={[0, 1.5, 0]}>
        {/* Torso */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.2, 0.5]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Collar */}
        <mesh position={[0, 0.6, 0.25]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#285fc4" />
        </mesh>
      </group>
      
      {/* Right Arm with joints */}
      <group ref={rightArmRef} position={[0.6, 2, 0]}>
        {/* Upper arm */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Elbow joint */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Lower arm */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Right Hand with more detail */}
        <group position={[0, -1.1, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.25, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Thumb */}
          <mesh castShadow position={[-0.1, -0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Fingers */}
          {[0.05, 0.02, -0.01, -0.04].map((x, i) => (
            <mesh key={i} castShadow position={[x, -0.2, 0]} rotation={[0, 0, 0]}>
              <capsuleGeometry args={[0.02, 0.15, 8, 8]} />
              <primitive object={skinMaterial} />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Left Arm with joints */}
      <group ref={leftArmRef} position={[-0.6, 2, 0]}>
        {/* Upper arm */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Elbow joint */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <primitive object={shirtMaterial} />
        </mesh>
        
        {/* Lower arm */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Left Hand with more detail */}
        <group position={[0, -1.1, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.25, 0.08]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Thumb */}
          <mesh castShadow position={[0.1, -0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
            <primitive object={skinMaterial} />
          </mesh>
          
          {/* Fingers */}
          {[0.05, 0.02, -0.01, -0.04].map((x, i) => (
            <mesh key={i} castShadow position={[-x, -0.2, 0]} rotation={[0, 0, 0]}>
              <capsuleGeometry args={[0.02, 0.15, 8, 8]} />
              <primitive object={skinMaterial} />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Legs with better proportions */}
      <group position={[0.25, 0.4, 0]}>
        {/* Upper leg */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Lower leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 8, 8]} />
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
        
        {/* Lower leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 8, 8]} />
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
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }} shadows>
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
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={true} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
          <AvatarModel animation={animation} isActive={isActive} />
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
