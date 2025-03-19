import * as Location from "expo-location";

export const createGeoJSONCircle = (
  center: GeoJSON.Position,
  radiusInKm: number,
  points = 64
): any => {
  const coords = [];
  const earthRadius = 6371; // Earth's radius in km

  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const radians = (angle * Math.PI) / 180;

    const dx = (radiusInKm / earthRadius) * Math.cos(radians);
    const dy = (radiusInKm / earthRadius) * Math.sin(radians);

    // Convert from spherical coordinates to latitude/longitude
    const lat = center[1] + (dy * 180) / Math.PI;
    const lon =
      center[0] + (dx * 180) / Math.PI / Math.cos((center[1] * Math.PI) / 180);

    coords.push([lon, lat]);
  }
  coords.push(coords[0]); // Close the polygon

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
};

export const createGeoJSONLine = (
  start: GeoJSON.Position,
  end: GeoJSON.Position
): any => {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [start, end],
    },
  };
};

export const fromLocationObjectToPosition = (
  location: Location.LocationObject
): GeoJSON.Position => {
  return [location.coords.longitude, location.coords.latitude];
};

export const haversineDistance = (
  coord1: GeoJSON.Position,
  coord2: GeoJSON.Position
) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Distance in m
};
