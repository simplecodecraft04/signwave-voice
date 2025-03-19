
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { hamburgToAnimationParams } from '../utils/hamburgNotation';

interface SignAvatarProps {
  word: string;
  isActive: boolean;
  hamburgGesture?: string;
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
  
  for (let i = 0; i < timings.length - 1; i++) {
    if (progress >= timings[i] && progress <= timings[i + 1]) {
      const segmentProgress = (progress - timings[i]) / (timings[i + 1] - timings[i]);
      return values[i] + segmentProgress * (values[i + 1] - values[i]);
    }
  }
  
  return values[0];
};

// Realistic 3D Avatar Model with animated parts
export const AvatarModel = ({ animation, isActive }: { animation: any, isActive: boolean }) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationActive = useRef(false);
  const startTime = useRef(0);
  
  useEffect(() => {
    if (isActive) {
      animationActive.current = true;
      startTime.current = Date.now();
    }
  }, [isActive]);
  
  useFrame(() => {
    if (!animationActive.current) return;
    
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const headAnimation = animation.head?.animate;
    const rightArmAnimation = animation.rightArm?.animate;
    const leftArmAnimation = animation.leftArm?.animate;
    const rightHandAnimation = animation.rightHand?.animate;
    const leftHandAnimation = animation.leftHand?.animate;
    
    const maxDuration = Math.max(
      headAnimation?.duration || 0,
      rightArmAnimation?.duration || 0,
      leftArmAnimation?.duration || 0,
      rightHandAnimation?.duration || 0,
      leftHandAnimation?.duration || 0
    );
    
    const progress = Math.min(elapsedTime / maxDuration, 1);
    setAnimationProgress(progress);
    
    if (progress >= 1) {
      const maxRepeats = Math.max(
        headAnimation?.repeat || 0,
        rightArmAnimation?.repeat || 0,
        leftArmAnimation?.repeat || 0,
        rightHandAnimation?.repeat || 0,
        leftHandAnimation?.repeat || 0
      );
      
      if (maxRepeats > 0) {
        startTime.current = Date.now();
        if (headAnimation) headAnimation.repeat = Math.max(0, headAnimation.repeat - 1);
        if (rightArmAnimation) rightArmAnimation.repeat = Math.max(0, rightArmAnimation.repeat - 1);
        if (leftArmAnimation) leftArmAnimation.repeat = Math.max(0, leftArmAnimation.repeat - 1);
        if (rightHandAnimation) rightHandAnimation.repeat = Math.max(0, rightHandAnimation.repeat - 1);
        if (leftHandAnimation) leftHandAnimation.repeat = Math.max(0, leftHandAnimation.repeat - 1);
      } else {
        animationActive.current = false;
      }
    }
    
    if (headRef.current && headAnimation) {
      const rotationX = interpolate(progress, headAnimation.timing, headAnimation.rotation.map((r: number[]) => r[0]));
      const rotationY = interpolate(progress, headAnimation.timing, headAnimation.rotation.map((r: number[]) => r[1]));
      const rotationZ = interpolate(progress, headAnimation.timing, headAnimation.rotation.map((r: number[]) => r[2]));
      
      headRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    if (rightArmRef.current && rightArmAnimation) {
      const rotationX = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map((r: number[]) => r[0]));
      const rotationY = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map((r: number[]) => r[1]));
      const rotationZ = interpolate(progress, rightArmAnimation.timing, rightArmAnimation.rotation.map((r: number[]) => r[2]));
      
      rightArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    if (leftArmRef.current && leftArmAnimation) {
      const rotationX = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map((r: number[]) => r[0]));
      const rotationY = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map((r: number[]) => r[1]));
      const rotationZ = interpolate(progress, leftArmAnimation.timing, leftArmAnimation.rotation.map((r: number[]) => r[2]));
      
      leftArmRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    if (rightHandRef.current && rightHandAnimation) {
      const rotationX = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map((r: number[]) => r[0]));
      const rotationY = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map((r: number[]) => r[1]));
      const rotationZ = interpolate(progress, rightHandAnimation.timing, rightHandAnimation.rotation.map((r: number[]) => r[2]));
      
      rightHandRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
    
    if (leftHandRef.current && leftHandAnimation) {
      const rotationX = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map((r: number[]) => r[0]));
      const rotationY = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map((r: number[]) => r[1]));
      const rotationZ = interpolate(progress, leftHandAnimation.timing, leftHandAnimation.rotation.map((r: number[]) => r[2]));
      
      leftHandRef.current.rotation.set(rotationX, rotationY, rotationZ);
    }
  });
  
  // Materials for realistic avatar
  const skinMaterial = new THREE.MeshStandardMaterial({ 
    color: "#F4D3B8", // Warmer skin tone 
    roughness: 0.5,
    metalness: 0.1
  });
  
  const hairMaterial = new THREE.MeshStandardMaterial({ 
    color: "#1A1A1A", // Darker black hair
    roughness: 0.7,
    metalness: 0.1
  });
  
  const jacketMaterial = new THREE.MeshStandardMaterial({ 
    color: "#F99820", // Orange/yellow jacket color
    roughness: 0.4,
    metalness: 0.2
  });
  
  const shirtMaterial = new THREE.MeshStandardMaterial({ 
    color: "#F5F5F5", // White/cream shirt
    roughness: 0.5,
    metalness: 0.1
  });
  
  const pantsMaterial = new THREE.MeshStandardMaterial({ 
    color: "#2C3E50", // Dark blue/navy pants
    roughness: 0.6,
    metalness: 0.1
  });
  
  return (
    <group position={[0, -1, 0]}>
      {/* Head & Face */}
      <group ref={headRef} position={[0, 2.7, 0]}>
        {/* Head Base */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Jaw */}
        <mesh castShadow position={[0, -0.15, 0]} scale={[0.9, 0.6, 0.8]}>
          <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Hair */}
        <group position={[0, 0.1, 0]}>
          {/* Top Hair */}
          <mesh castShadow position={[0, 0.2, 0]} scale={[1.1, 0.35, 1.1]}>
            <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <primitive object={hairMaterial} />
          </mesh>
          
          {/* Side Hair */}
          <mesh castShadow position={[0.4, 0, 0]} scale={[0.2, 0.5, 0.8]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <primitive object={hairMaterial} />
          </mesh>
          
          <mesh castShadow position={[-0.4, 0, 0]} scale={[0.2, 0.5, 0.8]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <primitive object={hairMaterial} />
          </mesh>
          
          {/* Front Hair (styled quiff) */}
          <mesh castShadow position={[0, 0.3, 0.3]} rotation={[Math.PI * 0.15, 0, 0]} scale={[0.8, 0.3, 0.4]}>
            <boxGeometry args={[0.6, 0.4, 0.4]} />
            <primitive object={hairMaterial} />
          </mesh>
        </group>
        
        {/* Eyes */}
        <group position={[0.15, 0.1, 0.4]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#593C32" /> {/* Brown eyes */}
          </mesh>
          
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        <group position={[-0.15, 0.1, 0.4]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#593C32" /> {/* Brown eyes */}
          </mesh>
          
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        {/* Eyebrows */}
        <mesh position={[0.15, 0.22, 0.41]} rotation={[0.1, 0, -0.1]} scale={[0.15, 0.02, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={hairMaterial} />
        </mesh>
        
        <mesh position={[-0.15, 0.22, 0.41]} rotation={[0.1, 0, 0.1]} scale={[0.15, 0.02, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={hairMaterial} />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.15, 0.4]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.04, 0.05]} />
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
      
      {/* Body / Torso */}
      <group ref={bodyRef} position={[0, 1.5, 0]}>
        {/* Upper Body / Chest */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.2, 0.5]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Jacket Collar */}
        <mesh position={[0, 0.5, 0.26]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.8, 0.15, 0.1]} />
          <meshStandardMaterial color="#DA8717" /> {/* Darker orange for collar */}
        </mesh>
        
        {/* Jacket Zipper/Buttons */}
        <mesh position={[0, 0.3, 0.28]} rotation={[Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.05]} />
          <meshStandardMaterial color="#C47615" /> {/* Darker orange for zipper */}
        </mesh>
        
        {/* Shirt beneath jacket */}
        <mesh position={[0, 0.2, 0.28]} scale={[0.5, 0.5, 0.1]}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={shirtMaterial} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.6, 2, 0]}>
        {/* Upper Arm - Jacket */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.14, 0.5, 8, 8]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Lower Arm - Jacket */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.13, 0.5, 8, 8]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Jacket Cuff */}
        <mesh position={[0, -1.05, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.14, 0.1, 16]} />
          <meshStandardMaterial color="#DA8717" /> {/* Darker orange for cuff */}
        </mesh>
        
        {/* Hand */}
        <group ref={rightHandRef} position={[0, -1.2, 0]}>
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
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.6, 2, 0]}>
        {/* Upper Arm - Jacket */}
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.14, 0.5, 8, 8]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Lower Arm - Jacket */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <capsuleGeometry args={[0.13, 0.5, 8, 8]} />
          <primitive object={jacketMaterial} />
        </mesh>
        
        {/* Jacket Cuff */}
        <mesh position={[0, -1.05, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.14, 0.1, 16]} />
          <meshStandardMaterial color="#DA8717" /> {/* Darker orange for cuff */}
        </mesh>
        
        {/* Hand */}
        <group ref={leftHandRef} position={[0, -1.2, 0]}>
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
      
      {/* Legs */}
      <group position={[0.25, 0.4, 0]}>
        {/* Upper Leg */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.17, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Lower Leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Shoe */}
        <mesh castShadow position={[0, -1.3, 0.1]}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      <group position={[-0.25, 0.4, 0]}>
        {/* Upper Leg */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.17, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Lower Leg */}
        <mesh castShadow position={[0, -0.9, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <primitive object={pantsMaterial} />
        </mesh>
        
        {/* Shoe */}
        <mesh castShadow position={[0, -1.3, 0.1]}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </group>
  );
};

const SignAvatar = ({ word, isActive, hamburgGesture }: SignAvatarProps) => {
  const [animation, setAnimation] = useState(signAnimations.default);
  
  useEffect(() => {
    if (hamburgGesture) {
      const hamburgAnimation = hamburgToAnimationParams(hamburgGesture);
      setAnimation(hamburgAnimation);
    } else {
      const wordAnimation = signAnimations[word.toLowerCase()] || signAnimations.default;
      setAnimation(wordAnimation);
    }
  }, [word, hamburgGesture]);

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
      {hamburgGesture && (
        <div className="mt-1 text-xs text-muted-foreground max-w-xs truncate">
          {hamburgGesture}
        </div>
      )}
    </div>
  );
};

export default SignAvatar;
