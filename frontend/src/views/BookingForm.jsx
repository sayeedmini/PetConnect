import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { MapPin, Lock, Unlock, CheckCircle } from "lucide-react";
import { geocode } from "../utils/mockLocationService";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Custom Destination Icon (D)
const destIcon = L.divIcon({
  html: `<div style="
    background-color: var(--color-primary);
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
  ">D</div>`,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Helper component to handle map clicks and move the marker
const LocationPicker = ({ position, setPosition, isLocked }) => {
  useMapEvents({
    click(e) {
      if (!isLocked) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return position ? <Marker position={position} icon={destIcon} /> : null;
};

// Helper to center map when coordinates change
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
};

const BookingForm = () => {
  const { groomerId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ petOwnerName: "", date: "", time: "", address: "" });
  const [selectedCoords, setSelectedCoords] = useState([23.8103, 90.4125]); // Default Dhaka
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto-locate when user finishes typing address
  const handleAddressBlur = async () => {
    if (form.address.trim() && !isLocked) {
      try {
        const coords = await geocode(form.address);
        // geocode returns [lng, lat], Leaflet needs [lat, lng]
        setSelectedCoords([coords[1], coords[0]]);
      } catch (err) {
        console.error("Auto-locate failed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLocked) {
      alert("Please confirm your location on the map before booking.");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/bookings`, {
        groomerId,
        petOwnerName: form.petOwnerName,
        date: form.date,
        time: form.time,
        coordinates: [selectedCoords[1], selectedCoords[0]], // [lng, lat] for backend
        address: form.address,
      });

      navigate(`/tracking/${data.data._id}`);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card wide-card">
        <h2 className="form-title">Schedule Home Grooming</h2>

        <div className="booking-grid">
          {/* Left Side: Form Fields */}
          <form onSubmit={handleSubmit} className="booking-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="petOwnerName">Your Name</label>
              <input
                className="form-input"
                type="text"
                name="petOwnerName"
                id="petOwnerName"
                placeholder="John Doe"
                required
                value={form.petOwnerName}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="time">Time</label>
                <input
                  className="form-input"
                  type="time"
                  name="time"
                  id="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Service Address</label>
              <div className="input-with-icon">
                <input
                  className="form-input"
                  type="text"
                  name="address"
                  id="address"
                  placeholder="e.g. CMH, Gulshan..."
                  required
                  disabled={isLocked}
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleAddressBlur}
                />
                <MapPin size={18} className="input-icon" />
              </div>
              <small className="form-help">Type your area to auto-locate, then fix the pin on the map.</small>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-full ${!isLocked ? "btn-disabled" : ""}`} 
              disabled={loading || !isLocked}
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>

          {/* Right Side: Interactive Map */}
          <div className="booking-map-section">
            <div className={`map-wrapper ${isLocked ? "map-locked" : ""}`}>
              <MapContainer 
                center={selectedCoords} 
                zoom={14} 
                scrollWheelZoom={!isLocked}
                className="booking-map"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={selectedCoords} />
                <LocationPicker 
                  position={selectedCoords} 
                  setPosition={setSelectedCoords} 
                  isLocked={isLocked} 
                />
              </MapContainer>
              
              {isLocked && (
                <div className="map-overlay">
                  <CheckCircle size={48} color="var(--color-primary)" />
                  <span>Location Fixed</span>
                </div>
              )}
            </div>

            <button 
              type="button"
              className={`btn btn-block ${isLocked ? "btn-outline" : "btn-secondary"}`}
              onClick={() => setIsLocked(!isLocked)}
            >
              {isLocked ? (
                <><Unlock size={16} /> Unlock to Edit Pin</>
              ) : (
                <><Lock size={16} /> Confirm Pin Location</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
