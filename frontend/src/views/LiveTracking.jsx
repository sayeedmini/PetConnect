import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import axios from "axios";
import { Navigation } from "lucide-react";
import { getLiveRoute } from "../utils/mockLocationService";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Custom icons for Leaflet
const createCustomIcon = (label, color) => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">${label}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const destIcon = createCustomIcon("D", "var(--color-primary)");
const groomerIcon = createCustomIcon("G", "#4f46e5");

// Component to handle map bounds automatically
const MapBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
};

const LiveTracking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [groomerPos, setGroomerPos] = useState(null);
  const [destPos, setDestPos] = useState([23.8103, 90.4125]); // Final destination
  const [routePath, setRoutePath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API);

    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`${API}/api/bookings/${bookingId}`);
        const b = data.data;
        setBooking(b);
        if (b.serviceLocation?.coordinates) {
          const [lng, lat] = b.serviceLocation.coordinates;
          const dPos = [lat, lng];
          
          // Use the ACTUAL groomer location from the database
          const gCoord = b.groomerId?.location?.coordinates || [lng - 0.012, lat - 0.015];
          const gStart = [gCoord[1], gCoord[0]]; // [lat, lng]
          
          setDestPos(dPos);
          setGroomerPos(gStart);

          // Get DYNAMIC road-following route from OSRM to exactly where they pinned
          const pathObjects = await getLiveRoute({ lat: gStart[0], lng: gStart[1] }, { lat: dPos[0], lng: dPos[1] });
          const path = pathObjects.map(p => [p.lat, p.lng]);
          setRoutePath(path);
          setCurrentStep(0);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };
    fetchBooking();

    socketRef.current.emit("join-booking", bookingId);
    socketRef.current.on("location-updated", (coords) => {
      setGroomerPos([coords[1], coords[0]]);
    });

    return () => socketRef.current.disconnect();
  }, [bookingId]);

  // Simulate groomer moving along the route (road-following)
  const simulateMove = async () => {
    if (routePath.length === 0) return;
    
    // Jump forward (move roughly 1/15th of the way per click)
    const stepIncrement = Math.max(1, Math.ceil(routePath.length / 15));
    const nextStep = Math.min(currentStep + stepIncrement, routePath.length - 1);
    const newPos = routePath[nextStep];
    
    setGroomerPos(newPos);
    setCurrentStep(nextStep);

    // If reached destination, update status
    if (nextStep === routePath.length - 1) {
      try {
        await axios.put(`${API}/api/bookings/${bookingId}/status`, { status: "Arrived" });
        setBooking(prev => ({ ...prev, status: "Arrived" }));
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }

    socketRef.current?.emit("groomer-location-update", {
      bookingId,
      coordinates: [newPos[1], newPos[0]], // [lng, lat] for backend
    });
  };

  const allPoints = [destPos, ...(groomerPos ? [groomerPos] : []), ...routePath];

  return (
    <>
      <div className="tracking-header">
        <div>
          <div className="tracking-title">Live Tracking</div>
          <div className="tracking-status">
            Status: <strong>{booking?.status || "Groomer in Transit"}</strong>
          </div>
        </div>
        <button className="btn btn-outline" onClick={simulateMove} disabled={currentStep >= routePath.length - 1}>
          <Navigation size={14} />
          {currentStep >= routePath.length - 1 ? "Groomer Arrived" : "Simulate Groomer Moving"}
        </button>
      </div>

      <div className="map-container">
        <MapContainer 
          center={destPos} 
          zoom={13} 
          style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds points={allPoints} />

          <Marker position={destPos} icon={destIcon}>
          </Marker>

          {groomerPos && (
            <Marker position={groomerPos} icon={groomerIcon}>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div className="tracking-info-footer">
        <div className="info-item">
          <span className="info-label">Grooming Destination: </span>
          <span className="info-value">{booking?.serviceLocation?.address || "Reading Map Coordinates..."}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Starting Location: </span>
          <span className="info-value">{booking?.groomerId?.address || "Reading Address..."}</span>
        </div>
      </div>
    </>
  );
};

export default LiveTracking;
