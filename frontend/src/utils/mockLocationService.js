// Real Geocoding using Nominatim (OpenStreetMap)
const LOCATIONS = {
  dhaka: [90.4125, 23.8103],
  gulshan: [90.4152, 23.8161],
  banani: [90.4066, 23.7937],
  uttara: [90.3881, 23.8724],
  dhanmondi: [90.3742, 23.7461],
};

export const geocode = async (address) => {
  if (!address) return LOCATIONS.dhaka;
  
  try {
    // Append Dhaka, Bangladesh for higher accuracy
    const query = encodeURIComponent(`${address}, Dhaka, Bangladesh`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "PetConnect-Demo-App" // Required by Nominatim Policy
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      console.log(`Nominatim found [${address}]:`, { lat, lon });
      return [parseFloat(lon), parseFloat(lat)]; // Returns [lng, lat]
    }
  } catch (err) {
    console.error("Nominatim API lookup failed, using fallback:", err);
  }

  // Fallback to local lookup for common areas
  const cleanAddress = address.toLowerCase();
  for (const key in LOCATIONS) {
    if (cleanAddress.includes(key)) return LOCATIONS[key];
  }
  
  return LOCATIONS.dhaka;
};

// OSRM Public API for road-following routes
export const getLiveRoute = async (start, end) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      // OSRM returns [lng, lat], our Leaflet uses [lat, lng]
      return data.routes[0].geometry.coordinates.map((coord) => ({
        lat: coord[1],
        lng: coord[0],
      }));
    }
  } catch (err) {
    console.error("OSRM Routing Error:", err);
  }
  
  // Minimal fallback if routing fails
  return [
    { lat: start.lat, lng: start.lng },
    { lat: end.lat, lng: end.lng }
  ];
};
