export function latLngToVector3(lat, lng, radius = 1.01) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
  
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  }
  export const COUNTRY_COORDS = {
    RU: { lat: 61, lng: 105 },
    CN: { lat: 35, lng: 103 },
    IN: { lat: 21, lng: 78 },
    US: { lat: 37, lng: -95 },
  };
    