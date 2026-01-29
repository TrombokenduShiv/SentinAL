import { useEffect, useRef, memo } from "react";
import { useThree } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import { MeshPhongMaterial } from "three";
import worldData from "../../assets/globe.json"; 

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
        // Keep your bright white dots setting
        .hexPolygonColor(() => globeConfig?.polygonColor || "rgba(255, 255, 255, 1.0)")
        .showAtmosphere(true)
        .atmosphereColor(globeConfig?.atmosphereColor || "#FFFFFF")
        .atmosphereAltitude(globeConfig?.atmosphereAltitude || 0.1);

        globe.rotation.y = Math.PI/2;

      globeRef.current = globe;
      scene.add(globe);
    }
  }, [scene, globeConfig]);

  useEffect(() => {
    if (globeRef.current && data) {
      // 1. The Lines (Arcs)
      globeRef.current
        .arcsData(data)
        .arcColor((d) => d.color)
        .arcAltitude((d) => d.arcAlt)
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(1500);

      // 2. The Landing Ripples (Rings)
      globeRef.current
        .ringsData(data)
        .ringColor((d) => d.color)
        .ringMaxRadius(6)         // How big the ripple gets
        .ringPropagationSpeed(3)  // How fast it ripples
        .ringRepeatPeriod(800);   // How often it ripples

      // 3. The Solid Dot at Destination (Point)
      globeRef.current
        .pointsData(data)
        .pointColor((d) => d.color)
        .pointAltitude(0)
        .pointRadius(0.5);        // Size of the solid dot
    }
  }, [data]);

  return null;
});