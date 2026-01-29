import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "./ui/Globe";

// Demo coordinates
const COUNTRY_COORDS = {
  RU: { lat: 61.524, lng: 105.3188 },
  CN: { lat: 35.8617, lng: 104.1954 },
};

const INDIA = { lat: 20.5937, lng: 78.9629 };

/* -------------------- 🔴 PULSE DOT -------------------- */
import * as THREE from "three";

function PulseRing({ lat, lng }) {
  const ringRef = useRef();
  const meshRef = useRef();

  // ThreeGlobe sphere radius is 100 units
  const GLOBE_RADIUS = 100;

  function latLngToWorld(lat, lng, radius = GLOBE_RADIUS) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = lng * Math.PI / 180;
  
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = -radius * Math.sin(phi) * Math.sin(theta);
  
    return new THREE.Vector3(x, y, z);
  }
  

  useFrame(({ clock }) => {
    if (!ringRef.current) return;

    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 3) * 0.3;

    ringRef.current.scale.set(s, s, s);
    ringRef.current.material.opacity = 0.6 - Math.sin(t * 3) * 0.3;
  });

  const position = latLngToWorld(lat, lng)



  // Calculate rotation to make ring parallel to globe surface
  // The ring should be tangent to the globe at the position
  // Create a quaternion that rotates from the default orientation to the normal direction
  const normal = position.clone().normalize();
  const defaultUp = new THREE.Vector3(0, 0, 1); // Ring's default normal
  const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultUp, normal);

  return (
    <mesh
      ref={ringRef}
      position={position}
      quaternion={quaternion}
    >
      <ringGeometry args={[2, 3, 32]} />
      <meshBasicMaterial
        color="#ef4444"
        transparent
        opacity={0.6}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}


/* -------------------- 🌍 GLOBE SCENE -------------------- */
function GlobeScene({ violations, selectedViolation }) {
  const globeConfig = {
    pointSize: 10,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const arcs = useMemo(() => {
    return violations
      .map((v) => {
        const coords = COUNTRY_COORDS[v.location_code];
        if (!coords) return null;

        return {
          order: 1,
          startLat: INDIA.lat,
          startLng: INDIA.lng,
          endLat: coords.lat,
          endLng: coords.lng,
          lat: coords.lat,
          lng: coords.lng,
          arcAlt: 0.4,
          color: colors[Math.floor(Math.random() * (colors.length - 1))],
        };
      })
      .filter(Boolean);
  }, [violations]);

  const selectedCoords =
    selectedViolation && COUNTRY_COORDS[selectedViolation.location_code];

  return (
    <>
      <ambientLight intensity={2.7} color="#38bdf8" />
      <pointLight position={[100, 100, 100]} intensity={2.5} />
      <pointLight
        position={[-100, -100, -100]}
        intensity={1.5}
        color="#1d4ed8"
      />

      <Globe data={arcs} globeConfig={globeConfig} />
      {selectedCoords && (
        <PulseRing lat={selectedCoords.lat} lng={selectedCoords.lng} />
      )}

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

/* -------------------- 📦 EXPORT -------------------- */
export default function MapVisualizer({
  violations,
  selectedViolation,
  loading,
}) {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/70 text-sm text-zinc-300 rounded border border-zinc-700 animate-pulse">
            Scanning global web…
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 600], fov: 45 }}>
        <GlobeScene
          violations={violations}
          selectedViolation={selectedViolation}
        />
      </Canvas>
    </div>
  );
}
