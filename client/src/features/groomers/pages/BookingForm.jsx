import React, { useState, useCallback, useEffect } from "react"; // React hooks for state and lifecycle
import { useParams, useNavigate } from "react-router-dom"; // Navigation and route parameters
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"; // Leaflet map components
import L from "leaflet"; // Core Leaflet library for icons and bounds
import axios from "axios"; // HTTP client for API calls
import { MapPin, Lock, Unlock, CheckCircle, ArrowLeft, User, Calendar, Clock, Home } from "lucide-react"; // UI Icons
import { geocode } from "../utils/mockLocationService"; // Helper to convert address string to lat/lng coordinates

// API Base URL from environment variables
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Custom Leaflet icon for the Destination marker (styled with Tailwind-like CSS)
const destIcon = L.divIcon({
  html: `<div style="background:linear-gradient(135deg,#002045,#002045);color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:3px solid white;box-shadow:0 3px 8px rgba(13,148,136,0.4);">D</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/**
 * Component to handle clicking on the map to set a position
 */
const LocationPicker = ({ position, setPosition, isLocked }) => {
  useMapEvents({
    click(e) {
      // Only allow moving the pin if it's not locked
      if (!isLocked) setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  // Show marker at current position
  return position ? <Marker position={position} icon={destIcon} /> : null;
};

/**
 * Component to programmatically move the map view
 */
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => { 
    if (center) map.setView(center, 14); // Zoom to level 14 when center changes
  }, [center, map]);
  return null;
};

// Reusable Tailwind CSS class string for form inputs
const inputClass = "w-full px-4 py-3 rounded-full border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002045] focus:bg-white focus:ring-2 focus:ring-[#d1d5db] transition-all text-xs";

/**
 * Reusable wrapper for form fields with label and icon
 */
function FormField({ icon, label, required, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        <span className="text-slate-400">{icon}</span>
        {label}
        {required && <span style={{ color: "#002045" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const BookingForm = () => {
  const { groomerId } = useParams(); // Get groomer ID from URL
  const navigate = useNavigate(); // Navigation function
  const [groomer, setGroomer] = useState(null); // Data for the selected groomer
  const [form, setForm] = useState({ petOwnerName: "", date: "", time: "", address: "", service: "" }); // Form fields state
  const [selectedCoords, setSelectedCoords] = useState([23.8103, 90.4125]); // Coordinates for the map marker
  const [isLocked, setIsLocked] = useState(false); // Whether the location pin is confirmed/locked
  const [loading, setLoading] = useState(false); // Submission loading state
  const [booked, setBooked] = useState(false); // Whether booking was successful
  const [bookingId, setBookingId] = useState(null); // ID of the created booking

  // Fetch groomer info on load
  useEffect(() => {
    if (!groomerId) return;
    axios.get(`${API}/api/groomers/${groomerId}`)
      .then(({ data }) => setGroomer(data.data))
      .catch(console.error);
  }, [groomerId]);

  // Handle address input losing focus: try to auto-locate on map
  const handleAddressBlur = async () => {
    if (form.address.trim() && !isLocked) {
      try {
        const coords = await geocode(form.address); // Convert address text to lat/lng
        setSelectedCoords([coords[1], coords[0]]); // Update map position
      } catch (err) { console.error("Auto-locate failed:", err); }
    }
  };

  // Submit the booking to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: must lock location before booking
    if (!isLocked) { alert("Please confirm your location on the map before booking."); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/bookings`, {
        groomerId,
        petOwnerName: form.petOwnerName,
        date: form.date,
        time: form.time,
        coordinates: [selectedCoords[1], selectedCoords[0]], // [lng, lat] for GeoJSON
        address: form.address,
        service: form.service
      });
      setBookingId(data.data._id); // Store new booking ID
      setBooked(true); // Switch to success view
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  // Helper for form validation
  const isFormValid = form.petOwnerName && form.date && form.time && form.address && isLocked;

  // Success View: shown after booking is confirmed
  if (booked) {
    return (
      <div className="container app-shell" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', paddingBottom: '60px',
        background: 'var(--bg)', color: 'var(--text)',
        '--bg': '#F7F9FB', '--surface': '#ffffff', '--text': '#002045', '--text-soft': '#0f172a', '--muted': '#334155', '--border': '#e2e8f0', '--primary': '#002045', '--primary-soft': '#84add5ff'
      }}>
        <div className="card spotlight-card" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#f4f7fb" }}>
            <CheckCircle className="w-8 h-8" style={{ color: "#002045" }} />
          </div>
          <h2 className="text-slate-900 mb-2" style={{ fontWeight: 800, fontSize: "1.25rem" }}>Booking Confirmed!</h2>
          <p className="text-slate-500 mb-6 text-xs">Your appointment with <strong>{groomer?.name || "your groomer"}</strong> has been scheduled successfully.</p>
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 mb-8">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium"><User className="w-4 h-4 text-[#002045]" /><span>{form.petOwnerName}</span></div>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium"><Calendar className="w-4 h-4 text-[#002045]" /><span>{form.date} at {form.time}</span></div>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium"><MapPin className="w-4 h-4 text-[#002045]" /><span>{form.address}</span></div>
          </div>
          <div className="flex flex-col gap-3">
            {/* Primary Action: Go to Tracking Page */}
            <button onClick={() => navigate(`/grooming/track/${bookingId}`)} style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: '#002045', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Track Your Groomer</button>
            <button onClick={() => navigate("/groomers")} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '10px', background: '#fff', color: '#002045', fontWeight: '700', cursor: 'pointer' }}>View Other Groomers</button>
          </div>
        </div>
      </div>
    );
  }

  // Primary Booking Form View
  return (
    <div className="container app-shell" style={{
      paddingTop: '20px', paddingBottom: '60px',
      background: 'var(--bg)', color: 'var(--text)',
      '--bg': '#F7F9FB', '--surface': '#ffffff', '--text': '#002045', '--text-soft': '#0f172a', '--muted': '#334155', '--border': '#e2e8f0', '--primary': '#002045', '--primary-soft': '#84add5ff'
    }}>
      {/* Sub-header with back button */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(groomerId ? `/groomers/${groomerId}` : "/groomers")} style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text)' }}>Confirm Booking</h1>
          <p className="page-subtitle" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-soft)' }}>{groomer ? `Selected Groomer: ${groomer.name}` : "Professional Home Grooming"}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="page-stack">
            {/* Personal Details Card */}
            <div className="card form-card">
              <h2 className="page-title" style={{ fontSize: '1.15rem', color: 'var(--text)', marginBottom: '20px' }}>Your Details</h2>
              <div className="space-y-4">
                <FormField icon={<User className="w-4 h-4" />} label="Your Name" required>
                  <input type="text" placeholder="e.g. Sakib Al Hasan" value={form.petOwnerName} onChange={(e) => setForm({ ...form, petOwnerName: e.target.value })} className={inputClass} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField icon={<Calendar className="w-4 h-4" />} label="Date" required>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
                  </FormField>
                  <FormField icon={<Clock className="w-4 h-4" />} label="Time" required>
                    <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass} />
                  </FormField>
                </div>
                {/* Service Selection Dropdown */}
                {groomer?.services?.length > 0 && (
                  <FormField icon={<Home className="w-4 h-4" />} label="Service">
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputClass}>
                      <option value="">Select a service</option>
                      <option value="All Services">All Services</option>
                      {groomer.services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FormField>
                )}
              </div>
            </div>
            {/* Location Confirmation Card */}
            <div className="card form-card" style={{ padding: '32px' }}>
              <h2 className="page-title" style={{ fontSize: '1.15rem', color: 'var(--text)', marginBottom: '4px' }}>Service Location</h2>
              <p className="page-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '24px' }}>Type your area below, then fix your pin on the map.</p>
              <div className="space-y-6">
                <FormField icon={<MapPin className="w-4 h-4" />} label="Home Address" required>
                  <input type="text" placeholder="e.g. Road 5, Block D, Bashundhara R/A" value={form.address} disabled={isLocked} onChange={(e) => setForm({ ...form, address: e.target.value })} onBlur={handleAddressBlur} className={inputClass} />
                </FormField>
                
                {/* Lock/Unlock Toggle Button */}
                <button type="button" onClick={() => setIsLocked(!isLocked)} style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: isLocked ? '#7a8ca5' : '#002045', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isLocked ? <><Unlock className="w-3.5 h-3.5" /> Change Location Pin</> : <><Lock className="w-3.5 h-3.5" /> Confirm Pin on Map</>}
                </button>
                
                {isLocked && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f4f7fb] border border-[#d1d5db] text-[11px] font-bold" style={{ color: "#002045" }}>
                    <CheckCircle className="w-4 h-4" />
                    <span>Location Verified & Confirmed</span>
                  </div>
                )}
              </div>
            </div>
 
            {/* Main Submit Button */}
            <button onClick={handleSubmit} disabled={!isFormValid || loading} style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: (!isFormValid || loading) ? '#7a8ca5' : '#002045', color: '#fff', fontWeight: '700', cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer' }}>
              {loading ? "Processing..." : isFormValid ? "Complete Booking" : "Confirm Pin to Continue"}
            </button>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative z-0" style={{ height: "540px" }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f4f7fb]0 animate-pulse" />
                  <span className="text-slate-700 text-xs font-bold uppercase tracking-wider">Set Service Pin</span>
                </div>
                {isLocked && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#f4f7fb]0 text-white shadow-sm">Pin Secured</span>}
              </div>
              <div style={{ height: "calc(100% - 53px)" }} className="relative z-0">
                {/* Leaflet Map Component */}
                <MapContainer center={selectedCoords} zoom={14} scrollWheelZoom={!isLocked} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                  <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <ChangeView center={selectedCoords} />
                  <LocationPicker position={selectedCoords} setPosition={setSelectedCoords} isLocked={isLocked} />
                </MapContainer>
              </div>
            </div>
            <p className="text-slate-400 text-xs text-center">Click on the map to move your pin, then confirm to lock it.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
