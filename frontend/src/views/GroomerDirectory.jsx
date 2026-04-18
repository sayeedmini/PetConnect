import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GroomerDirectory = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState("");

  useEffect(() => {
    const fetchGroomers = async () => {
      try {
        setLoading(true);
        const url = serviceFilter
          ? `${API}/api/groomers/search?service=${encodeURIComponent(serviceFilter)}`
          : `${API}/api/groomers/search`;
        const { data } = await axios.get(url);
        setGroomers(data.data);
      } catch (err) {
        console.error("Error fetching groomers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroomers();
  }, [serviceFilter]);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header + Filter */}
      <div className="page-header">
        <h1 className="page-title">Find a Groomer</h1>
        <select
          className="filter-select"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="">All Services</option>
          <option value="Bath & Brush">Bath &amp; Brush</option>
          <option value="Full Grooming">Full Grooming</option>
          <option value="Nail Trimming">Nail Trimming</option>
          <option value="Ear Cleaning">Ear Cleaning</option>
          <option value="Teeth Brushing">Teeth Brushing</option>
          <option value="De-Shedding">De-Shedding</option>
          <option value="Flea Treatment">Flea Treatment</option>
          <option value="Creative Styling">Creative Styling</option>
          <option value="Spa Massage">Spa Massage</option>
        </select>
      </div>

      {/* Groomer Cards */}
      <div className="card-grid">
        {groomers.length === 0 ? (
          <div className="empty-state">No groomers found matching your criteria.</div>
        ) : (
          groomers.map((g) => (
            <div key={g._id} className="groomer-card clickable-card">
              <Link to={`/groomer/${g._id}`} className="card-link">
                {g.portfolioImages?.length > 0 ? (
                  <img
                    className="groomer-card-image"
                    src={g.portfolioImages[0]}
                    alt={g.name}
                  />
                ) : (
                  <div className="groomer-card-image-placeholder">No Image</div>
                )}

                <div className="groomer-card-body">
                  <div className="groomer-card-name">{g.name}</div>

                  <div className="rating">
                    <Star size={14} />
                    <span>4.9 (128 reviews)</span>
                  </div>

                  <div className="groomer-card-meta">
                    <MapPin size={16} color="var(--color-primary)" />
                    <span className="groomer-location">{g.address || "Location not specified"}</span>
                  </div>

                  <div className="tags">
                    {g.services?.slice(0, 3).map((svc, i) => (
                      <span key={i} className="tag">{svc}</span>
                    ))}
                    {g.services?.length > 3 && (
                      <span className="tag">+{g.services.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="groomer-card-footer">
                  <span className="btn btn-primary btn-full">View Profile</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default GroomerDirectory;
