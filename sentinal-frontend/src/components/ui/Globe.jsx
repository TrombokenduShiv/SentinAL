import { useEffect, useRef, memo } from "react";
import { useThree } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import worldData from "../../assets/globe.json"; //

export const Globe = memo(({ data }) => {
  const globeRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (!globeRef.current) {
      const globe = new ThreeGlobe()
        .globeImageUrl(null)
        .hexPolygonsData(worldData.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .hexPolygonColor(() => "#1d4ed8") // Set globe to deep blue
        .showAtmosphere(true)
        .atmosphereColor("#0000ff")
        .atmosphereAltitude(0.15);

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
  
      // Pulsating Red Dots [cite: 62, 103]
      globeRef.current
        .htmlElementsData(data)
        .htmlElement((d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="pulse-container">
              <div class="pulse-ring"></div>
              <div class="pulse-dot" style="background-color: ${d.color}"></div>
            </div>
          `;
          return el;
        });
    }
  }, [data]);

  return null;
});