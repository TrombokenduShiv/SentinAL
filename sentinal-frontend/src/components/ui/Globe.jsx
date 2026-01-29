import { useEffect, useRef, memo } from "react";
import { useThree } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import { MeshPhongMaterial } from "three";
import worldData from "../../assets/globe.json"; //

export const Globe = memo(({ data, globeConfig }) => {
  const globeRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (!globeRef.current) {
      const globe = new ThreeGlobe()
        .globeImageUrl(null)
        .globeMaterial(new MeshPhongMaterial({
          color: globeConfig?.globeColor || "#062056",
          emissive: globeConfig?.emissive || "#062056",
          emissiveIntensity: globeConfig?.emissiveIntensity || 0.1,
          shininess: globeConfig?.shininess || 0.9
        }))
        .hexPolygonsData(worldData.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .hexPolygonColor(() => globeConfig?.polygonColor || "rgba(255,255,255,0.7)")
        .showAtmosphere(true)
        .atmosphereColor(globeConfig?.atmosphereColor || "#FFFFFF")
        .atmosphereAltitude(globeConfig?.atmosphereAltitude || 0.1);

        globe.rotation.y = Math.PI/2;

      globeRef.current = globe;
      scene.add(globe);
    }
  }, [scene]);

  useEffect(() => {
    if (globeRef.current && data) {
      // Animated Arcs (Red Lines) [cite: 61]
      globeRef.current
        .arcsData(data)
        .arcColor((d) => d.color)
        .arcAltitude((d) => d.arcAlt)
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(1500);
  
      // Pulsating White Dots
      globeRef.current
        .htmlElementsData(data)
        .htmlElement((d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="pulse-container">
              <div class="pulse-ring"></div>
              <div class="pulse-dot" style="background-color: #ffffff"></div>
            </div>
          `;
          return el;
        });
    }
  }, [data]);

  return null;
});