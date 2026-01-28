import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Globe } from "./ui/Globe"; // Ensure you copy the Globe.jsx code from Aceternity
import worldData from "../assets/globe.json";

const MapVisualizer = ({ violations }) => {
  // Configuration for the "GitHub" style dark aesthetic
  const globeConfig = {
    pointSize: 1,
    globeColor: "#2c3e50", // A brighter, yet dark, blue-grey
    showAtmosphere: true,
    atmosphereColor: "#1d4ed8",
    atmosphereAltitude: 0.1,
    emissive: "#2c3e50",
    emissiveIntensity: 0.25,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
  };

  // Maps violation data to 3D Arcs (The "War" visualization)
  // Inside MapVisualizer.jsx
  const arcs = useMemo(
    () =>
      violations.map((v) => {
        // Hardcoded coordinates for the Demo as per your Checklist
        const coords =
          v.location === "RU"
            ? { lat: 61.524, lng: 105.3188 }
            : { lat: 35.8617, lng: 104.1954 };

        return {
          order: 1,
          startLat: 20.5937, // Origin: India
          startLng: 78.9629,
          endLat: coords.lat,
          endLng: coords.lng,
          // These properties are used by .pointsData()
          lat: coords.lat,
          lng: coords.lng,
          arcAlt: 0.5,
          color: v.type === "TERRITORY_BREACH" ? "#fb923c" : "#ef4444",
        };
      }),
    [violations],
  );

  return (
    <div className="w-full h-full bg-[#020617] flex items-center justify-center overflow-hidden">
      <div className="w-full h-full relative">
        <Canvas
          style={{ background: "#000000" }}
          camera={{ position: [0, 0, 600], fov: 45 }}
        >
          {/* Ambient light needs to be very high for the hex polygons to be visible */}
          <ambientLight intensity={100.0} />
          <pointLight position={[100, 100, 100]} intensity={2.5} />
          <pointLight
            position={[-100, -100, -100]}
            intensity={1.5}
            color="#1d4ed8"
          />

          <Globe data={arcs} globeConfig={globeConfig} />
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </div>
  );
};

export default MapVisualizer;
