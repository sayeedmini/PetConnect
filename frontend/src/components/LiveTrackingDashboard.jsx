import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Navigation } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '500px'
};


const LiveTrackingDashboard = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [groomerLocation, setGroomerLocation] = useState(null);
  const [homeLocation, setHomeLocation] = useState({ lat: 23.8103, lng: 90.4125 });
  const socketRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    // Connect Socket.io
    socketRef.current = io('http://localhost:5000');

    // Fetch booking details
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
        const b = response.data.data;
        setBooking(b);
        if (b.serviceLocation && b.serviceLocation.coordinates) {
          const [lng, lat] = b.serviceLocation.coordinates;
          setHomeLocation({ lat, lng });
          // Initially set groomer location slightly offset from home
          setGroomerLocation({ lat: lat - 0.01, lng: lng - 0.01 });
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    };

    fetchBooking();

    // Join room
    socketRef.current.emit('join-booking', bookingId);

    // Listen for updates
    socketRef.current.on('location-updated', (coords) => {
      setGroomerLocation({ lat: coords[1], lng: coords[0] });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [bookingId]);

  // --- MOCK GROOMER APP SIMULATION ---
  // The user requested a "simpler version" to test location updates manually
  const simulateGroomerMovement = () => {
    if (!groomerLocation || !homeLocation) return;
    
    // Calculate a point closer to home
    const newLat = groomerLocation.lat + (homeLocation.lat - groomerLocation.lat) * 0.1;
    const newLng = groomerLocation.lng + (homeLocation.lng - groomerLocation.lng) * 0.1;
    
    const newCoords = { lat: newLat, lng: newLng };
    setGroomerLocation(newCoords);

    // Emit to server
    if (socketRef.current) {
       socketRef.current.emit('groomer-location-update', {
         bookingId,
         coordinates: [newLng, newLat]
       });
    }
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(homeLocation);
    if(groomerLocation) bounds.extend(groomerLocation);
    map.fitBounds(bounds);
  }, [homeLocation, groomerLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
           <div>
             <h3 className="text-lg leading-6 font-medium text-gray-900">Live Tracking</h3>
             <p className="mt-1 max-w-2xl text-sm text-gray-500">
               Status: <span className="font-semibold text-indigo-600">{booking?.status || 'Loading...'}</span>
             </p>
           </div>
           
           {/* Mock Control for Developer Testing */}
           <button 
             onClick={simulateGroomerMovement}
             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
           >
             <Navigation className="mr-2 h-4 w-4"/>
             Simulate Groomer Moving
           </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg rounded-lg overflow-hidden border border-gray-200">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={homeLocation}
            zoom={13}
            onLoad={onLoad}
          >
            {/* Home Marker */}
            <Marker 
              position={homeLocation} 
              label="H"
              title="Home"
            />
            {/* Groomer Marker */}
            {groomerLocation && (
               <Marker 
                 position={groomerLocation}
                 icon={{
                   url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                 }}
                 label="G"
                 title="Groomer"
               />
            )}
          </GoogleMap>
        ) : (
          <div className="h-[500px] flex items-center justify-center bg-gray-50 text-gray-500">
             {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Loading Map..." : "Map strictly requires VITE_GOOGLE_MAPS_API_KEY in .env"}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingDashboard;
