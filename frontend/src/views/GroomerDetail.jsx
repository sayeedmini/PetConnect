import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GroomerDetail = () => {
  const { id } = useParams();
  const [groomer, setGroomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroomer = async () => {
      try {
        const { data } = await axios.get(`${API}/api/groomers/${id}`);
        setGroomer(data.data);
      } catch (err) {
        console.error("Error fetching groomer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroomer();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!groomer) {
    return <div className="empty-state">Groomer not found.</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="detail-header">
        <div>
          <h1 className="detail-name">{groomer.name}</h1>
          <p className="detail-subtitle">
            <MapPin size={15} />
            {groomer.address || "Location not specified"}
            <span style={{ margin: "0 6px", color: "#cbd5e1" }}>•</span>
            {groomer.experience} Experience
          </p>
        </div>
        <Link to={`/book/${groomer._id}`} className="btn btn-primary" style={{ width: "auto" }}>
          <Calendar size={16} />
          Book Now
        </Link>
      </div>

      {/* Content Grid */}
      <div className="detail-grid">
        {/* Left: Services & Pricing */}
        <div>
          <div className="panel">
            <div className="panel-header">Services Offered</div>
            <div className="panel-body">
              <ul className="service-list">
                {groomer.services?.map((svc, i) => (
                  <li key={i} className="service-item">
                    <CheckCircle size={18} />
                    {svc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">Pricing Packages</div>
            {groomer.pricing?.map((pkg, i) => (
              <div key={i} className="pricing-item">
                <div className="pricing-row">
                  <span className="pricing-name">{pkg.packageName}</span>
                  <span className="pricing-amount">${pkg.price}</span>
                </div>
                <div className="pricing-desc">{pkg.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Portfolio */}
        <div className="panel">
          <div className="panel-header">Portfolio</div>
          <div className="panel-body">
            {groomer.portfolioImages?.length > 0 ? (
              <div className="portfolio-grid">
                {groomer.portfolioImages.map((url, i) => (
                  <img key={i} className="portfolio-img" src={url} alt="Portfolio work" />
                ))}
              </div>
            ) : (
              <div className="empty-state">No portfolio images uploaded yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroomerDetail;
