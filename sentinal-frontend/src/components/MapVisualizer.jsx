import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "./ui/Globe";

// Demo coordinates
const COUNTRY_COORDS = {
  RU: { lat: 61.524, lng: 105.3188 },
  CN: { lat: 35.8617, lng: 104.1954 },
};

const INDIA = { lat: 20.5937, lng: 78.9629 };

/* -------------------- 🌍 GLOBE SCENE -------------------- */
function GlobeScene({ violations }) {
  // ✅ FUTURISTIC / MATRIX STYLE CONFIGURATION
  const globeConfig = {
    pointSize: 4,
    globeColor: "#000000",            // 🌑 Pitch Black Globe (Void look)
    showAtmosphere: true,
    atmosphereColor: "#333333",       // 🌫️ Dark Grey/White Mist
    atmosphereAltitude: 0.1,
    emissive: "#111111",              // 🌑 Very dark grey glow
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255, 255, 255, 1.0)", // ⚪ Solid Bright White Dots
    ambientLight: "#333333",          // 💡 White/Grey Ambient Light (No Blue)
    directionalLeftLight: "#ffffff",  // 💡 Pure White Light
    directionalTopLight: "#ffffff",   // 💡 Pure White Light
    pointLight: "#ffffff",            // 💡 Pure White Light
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#ffffff", "#cccccc", "#999999"]; // ⚪ Monochromatic Arcs (Greyscale)

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
          color: colors[Math.floor(Math.random() * colors.length)], // Random greyscale color
        };
      })
      .filter(Boolean);
  }, [violations]);

  return (
    <>
      <ambientLight intensity={2.0} color="#ffffff" />
      <pointLight position={[100, 100, 100]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-100, -100, -100]} intensity={1.5} color="#ffffff" />

      <Globe data={arcs} globeConfig={globeConfig} />

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

/* -------------------- 📦 EXPORT -------------------- */
export default function MapVisualizer({
  violations,
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
        <GlobeScene violations={violations} />
      </Canvas>
    </div>
  );
}