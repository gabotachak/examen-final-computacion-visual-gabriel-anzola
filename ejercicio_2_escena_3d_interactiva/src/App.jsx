import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useHelper } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

/* ─── SOLAR PANEL (jerarquía: soporte → panel) ─── */
function SolarPanel({ position, roverPos }) {
  const groupRef = useRef()
  useFrame(() => {
    if (!groupRef.current) return
    const dir = new THREE.Vector3(roverPos.current[0], 0, roverPos.current[2])
      .normalize()
    const angle = Math.atan2(dir.x, dir.z)
    groupRef.current.rotation.y = angle
  })
  return (
    <group ref={groupRef} position={position}>
      {/* soporte */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* panel PBR */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial
          color="#1a3a7e"
          metalness={0.9}
          roughness={0.1}
          emissive="#0a1a3a"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

/* ─── ROVER (jerarquía: cuerpo → ruedas + cabina + antena) ─── */
function Rover({ roverPos, speed, onRoverNearFlag }) {
  const groupRef = useRef()
  const antennaRef = useRef()
  const angle = useRef(0)
  const RADIUS = 6

  useFrame((_, delta) => {
    angle.current += delta * speed * 0.3
    const x = Math.cos(angle.current) * RADIUS
    const z = Math.sin(angle.current) * RADIUS
    roverPos.current = [x, 0, z]
    if (groupRef.current) {
      groupRef.current.position.set(x, 0.35, z)
      groupRef.current.rotation.y = -angle.current + Math.PI / 2
    }
    if (antennaRef.current) {
      antennaRef.current.rotation.y += delta * 2
    }
    // interacción: rover cerca de la bandera (0,0,4)
    const distFlag = Math.sqrt(x * x + (z - 4) * (z - 4))
    onRoverNearFlag(distFlag < 2)
  })

  const wheelPositions = [
    [-0.55, -0.2, 0.5], [0.55, -0.2, 0.5],
    [-0.55, -0.2, -0.5], [0.55, -0.2, -0.5],
  ]

  return (
    <group ref={groupRef}>
      {/* cuerpo principal */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.4, 1.2]} />
        <meshStandardMaterial color="#c8a228" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* cabina */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <boxGeometry args={[0.7, 0.35, 0.6]} />
        <meshPhysicalMaterial
          color="#7ecfff"
          metalness={0.1}
          roughness={0}
          transmission={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* antena */}
      <group ref={antennaRef} position={[0, 0.55, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ff4040" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* 4 ruedas */}
      {wheelPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 12]} />
          <meshStandardMaterial color="#333" metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── ASTRONAUTA (flota + saluda al rover) ─── */
function Astronaut({ position, roverPos }) {
  const groupRef = useRef()
  const armRef = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (!groupRef.current) return
    // flotar
    groupRef.current.position.y = position[1] + Math.sin(t.current * 0.8) * 0.15
    groupRef.current.rotation.y = Math.sin(t.current * 0.3) * 0.2

    // brazo saluda cuando rover está cerca
    if (armRef.current) {
      const [rx, , rz] = roverPos.current
      const dist = Math.sqrt(
        (rx - position[0]) ** 2 + (rz - position[2]) ** 2
      )
      const target = dist < 5 ? Math.sin(t.current * 3) * 0.8 : 0
      armRef.current.rotation.z += (target - armRef.current.rotation.z) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* cuerpo */}
      <mesh castShadow>
        <capsuleGeometry args={[0.18, 0.4, 8, 16]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* casco */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0}
          transmission={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* brazo derecho (saluda) */}
      <group ref={armRef} position={[0.22, 0.1, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.3, 6, 8]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.6} />
        </mesh>
      </group>
      {/* piernas */}
      {[[-0.1, -0.5, 0], [0.1, -0.5, 0]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <capsuleGeometry args={[0.07, 0.25, 6, 8]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── BASE LUNAR (módulo + bandera) ─── */
function LunarBase({ flagColor }) {
  return (
    <group>
      {/* módulo principal */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 1, 8]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* domo */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#88aaff"
          transmission={0.5}
          transparent
          opacity={0.6}
          roughness={0}
          metalness={0}
        />
      </mesh>
      {/* puerta */}
      <mesh position={[0, 0.3, 1.7]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* pata de aterrizaje */}
      {[[1.5, 0, 0], [-1.5, 0, 0], [0, 0, 1.5], [0, 0, -1.5]].map((p, i) => (
        <mesh key={i} position={[p[0], -0.2, p[2]]} rotation={[0, 0, p[0] ? 0.3 : 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
          <meshStandardMaterial color="#777" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* bandera */}
      <group position={[0, 0, 4]}>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[0.3, 1.2, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.02]} />
          <meshStandardMaterial color={flagColor} />
        </mesh>
      </group>
    </group>
  )
}

/* ─── SUELO LUNAR ─── */
function LunarSurface() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 30, 30]} />
        <meshStandardMaterial color="#8a8070" roughness={0.95} metalness={0.0} />
      </mesh>
      {/* cráteres decorativos */}
      {[[-8, 3], [10, -5], [-12, -8], [5, 10]].map(([x, z], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.04, z]} receiveShadow>
          <ringGeometry args={[0.4 + i * 0.3, 0.8 + i * 0.3, 20]} />
          <meshStandardMaterial color="#6a6060" roughness={1} />
        </mesh>
      ))}
      {/* rocas */}
      {[[-3, -4], [4, 3], [-7, 2], [8, -3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} rotation={[0, i, 0.3]} castShadow>
          <dodecahedronGeometry args={[0.2 + i * 0.1]} />
          <meshStandardMaterial color="#7a7060" roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

/* ─── HUD ─── */
function HUD({ flagNear }) {
  return (
    <div style={{
      position: 'absolute', top: 16, left: 16, color: '#0ff',
      background: 'rgba(0,0,0,0.55)', padding: '10px 16px',
      borderRadius: 8, fontSize: 13, lineHeight: 1.6, pointerEvents: 'none',
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>EXPLORACIÓN ESPACIAL 3D</div>
      <div>🖱 Arrastrar: orbitar cámara</div>
      <div>🖱 Scroll: zoom</div>
      <div>🖱 Click derecho: paneo</div>
      <div style={{ marginTop: 6, color: '#aaa' }}>Panel derecho: controles de escena</div>
      {flagNear && (
        <div style={{ marginTop: 8, color: '#ff0', fontWeight: 'bold' }}>
          ⚡ Rover cerca de la bandera!
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [flagNear, setFlagNear] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [12, 8, 12], fov: 55 }}
        gl={{ antialias: true }}
      >
        <SceneWithCallback onFlagNear={setFlagNear} />
      </Canvas>
      <HUD flagNear={flagNear} />
    </div>
  )
}

/* wrapper to pass flagNear state up */
function SceneWithCallback({ onFlagNear }) {
  const roverPos = useRef([6, 0, 0])
  const [flagNear, setFlagNear] = useState(false)

  const handleFlagNear = (v) => {
    setFlagNear(v)
    onFlagNear(v)
  }

  const { roverSpeed, sunIntensity, ambientIntensity, flagColor } = useControls('Controles', {
    roverSpeed: { value: 1, min: 0, max: 3, step: 0.1, label: 'Velocidad rover' },
    sunIntensity: { value: 3, min: 0, max: 8, step: 0.1, label: 'Intensidad sol' },
    ambientIntensity: { value: 0.3, min: 0, max: 1, step: 0.05, label: 'Luz ambiente' },
    flagColor: { value: '#ff3300', label: 'Color bandera' },
  })

  return (
    <>
      <ambientLight intensity={ambientIntensity} color="#334455" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={sunIntensity}
        color="#fff8e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 1.5, 0]} intensity={0.8} color="#88aaff" distance={8} />
      {flagNear && (
        <pointLight position={[0, 2, 4]} intensity={2} color="#ffff00" distance={5} />
      )}

      <Stars radius={80} depth={50} count={3000} factor={4} />

      <LunarSurface />
      <LunarBase flagColor={flagNear ? '#ffff00' : flagColor} />

      <SolarPanel position={[3, 0.05, -3]} roverPos={roverPos} />
      <SolarPanel position={[-3, 0.05, -3]} roverPos={roverPos} />

      <Rover roverPos={roverPos} speed={roverSpeed} onRoverNearFlag={handleFlagNear} />

      <Astronaut position={[4, 1.2, 2]} roverPos={roverPos} />
      <Astronaut position={[-2, 1.5, -5]} roverPos={roverPos} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  )
}
