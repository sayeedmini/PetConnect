import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MapPin, ChevronDown, Search, ArrowRight, Sparkles } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import { getGroomerAvatar } from "../utils/groomerAvatar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const allServices = [
  "All Services",
  "Bath & Brush",
  "Full Grooming",
  "Nail Trimming",
  "Ear Cleaning",
  "Teeth Brushing",
  "De-Shedding",
  "Flea Treatment",
  "Creative Styling",
  "Spa Massage",
];

const GroomerDirectory = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroomers = async () => {
      try {
        setLoading(true);
        const url =
          selectedService !== "All Services"
            ? `${API}/api/groomers/search?service=${encodeURIComponent(selectedService)}`
            : `${API}/api/groomers/search`;
        const { data } = await axios.get(url);
        setGroomers(data.data || []);
      } catch (err) {
        console.error("Error fetching groomers:", err);
        setGroomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroomers();
  }, [selectedService]);

  const filtered = groomers.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.address && g.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="container app-shell" style={{ 
      paddingTop: '40px', 
      background: 'var(--bg)', 
      color: 'var(--text)',
      '--bg': '#F7F9FB',
      '--surface': '#ffffff',
      '--text': '#002045',
      '--text-soft': '#0f172a',
      '--muted': '#334155',
      '--border': '#e2e8f0',
      '--primary': '#002045',
      '--primary-soft': '#84add5ff',
    }}>
      {/* Hero Section */}
      <div className="page-hero">
        <div>
          <div className="badge badge-soft" style={{ marginBottom: '16px' }}>
            <Sparkles className="w-4 h-4" />
            Trusted Pet Care
          </div>
          <h1 className="page-title" style={{ color: 'var(--text)' }}>
            Find the perfect <span style={{ color: 'var(--primary)', fontWeight: '800' }}>groomer</span>
          </h1>
          <p className="page-subtitle page-subtitle-lg" style={{ marginTop: '16px', color: 'var(--text-soft)', fontWeight: '500' }}>
            Browse verified, experienced groomers near you — professional care delivered right to your doorstep.
          </p>

          <div className="toolbar" style={{ marginTop: '32px', marginBottom: '40px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search className="w-4 h-4 text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-surface"
                style={{ paddingLeft: '42px' }}
              />
            </div>
            <div style={{ position: 'relative', width: '200px' }}>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="input-surface"
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                {allServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '80px' }}>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          {loading ? (
            "Loading groomers..."
          ) : (
            <>
              Showing <strong>{filtered.length}</strong> groomers
              {selectedService !== "All Services" && (
                <>
                  {" "}for{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    "{selectedService}"
                  </strong>
                </>
              )}
            </>
          )}
        </p>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="info-panel card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Search className="w-10 h-10 text-muted" style={{ margin: '0 auto 16px' }} />
            <h3>No groomers found</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
              Try adjusting your filters or search term to find the right groomer.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedService("All Services");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="home-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filtered.map((g, idx) => (
              <GroomerCard
                key={g._id}
                groomer={g}
                index={idx}
                onClick={() => navigate(`/groomers/${g._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function GroomerCard({ groomer, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card glass-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'var(--transition)'
      }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <ImageWithFallback
          src={getGroomerAvatar(groomer)}
          alt={groomer.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="badge badge-warning" style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#0f172a', fontWeight: '800', background: '#facc15' }}>
          <Star className="w-3 h-3" style={{ fill: 'currentColor' }} />
          {(groomer.rating ?? 4.9).toFixed(1)}
        </div>
        {groomer.experience && (
          <div className="badge" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
            {groomer.experience}
          </div>
        )}
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: 'var(--text)' }}>
          {groomer.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '16px' }}>
          <MapPin className="w-3.5 h-3.5" />
          {groomer.address || "Location not specified"}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {groomer.services?.slice(0, 3).map((s, i) => (
            <span key={i} className="badge badge-soft" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
              {s}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: '#002045', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            View Profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroomerDirectory;
