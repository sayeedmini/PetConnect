import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MapPin, Clock, Check, ZoomIn, Sparkles, ArrowRight } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import { getGroomerAvatar } from "../utils/groomerAvatar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GroomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groomer, setGroomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchGroomer = async () => {
      try {
        setLoading(true);
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
      <div className="container spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  if (!groomer) {
    return (
      <div className="container info-panel card" style={{ textAlign: 'center', margin: '40px auto', padding: '60px' }}>
        <h3>Groomer not found</h3>
        <button className="btn btn-secondary mt-4" onClick={() => navigate("/groomers")}>
          ← Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="container app-shell" style={{
      paddingTop: '20px',
      paddingBottom: '60px',
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
      {/* Hero Header */}
      <div className="spotlight-card card" style={{ padding: '40px', marginBottom: '24px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
        <ImageWithFallback
          src={getGroomerAvatar(groomer)}
          alt={groomer.name}
          style={{ width: '140px', height: '140px', borderRadius: 'var(--radius)', objectFit: 'cover', border: '3px solid var(--border)' }}
        />
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ marginTop: 0, fontSize: '2.5rem', color: 'var(--text)' }}>{groomer.name}</h1>
          <div style={{ display: 'flex', gap: '16px', margin: '16px 0', flexWrap: 'wrap' }}>
            <span className="badge badge-warning" style={{ color: '#0f172a', fontWeight: '800', background: '#facc15' }}>
              <Star className="w-3.5 h-3.5" style={{ fill: 'currentColor' }} />
              {(groomer.rating || 4.9).toFixed(1)}
            </span>
            <span className="badge badge-soft">
              <MapPin className="w-3.5 h-3.5" />
              {groomer.address || "Location not specified"}
            </span>
            <span className="badge badge-soft">
              <Clock className="w-3.5 h-3.5" />
              {groomer.experience || "Expert"} Experience
            </span>
          </div>
          <p className="page-subtitle" style={{ maxWidth: '600px', margin: 0, color: 'var(--text-soft)', fontWeight: '500' }}>
            {groomer.bio || "Professional pet grooming services tailored to your pet's needs."}
          </p>
        </div>
      </div>

      <div className="detail-layout" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)' }}>
        {/* Left Column */}
        <div className="page-stack">
          {groomer.services && groomer.services.length > 0 && (
            <section className="card form-card">
              <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem', color: 'var(--text)' }}>Services Offered</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {groomer.services.map((service, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{service}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="card form-card">
            <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem', color: 'var(--text)' }}>Portfolio — Best Buds</h3>
            {groomer.portfolioImages && groomer.portfolioImages.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {groomer.portfolioImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1/1' }} onClick={() => setLightboxImg(img)}>
                    <ImageWithFallback src={img} alt={`Portfolio ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                <p className="empty-state">No portfolio images yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="page-stack">
          <h3 style={{ margin: '0', fontSize: '1.25rem', color: 'var(--text)' }}>Pricing Packages</h3>
          {groomer.pricing && groomer.pricing.length > 0 ? (
            groomer.pricing.map((pkg, i) => (
              <div key={i} className={`card ${i === 0 ? 'spotlight-card' : ''}`} style={{ padding: '24px' }}>
                {i === 0 && (
                  <div className="badge" style={{ marginBottom: '16px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 'bold' }}>Most Popular</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{pkg.packageName}</h4>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>৳{pkg.price?.toLocaleString() || "N/A"}</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--muted)', fontWeight: '500' }}>{pkg.description}</p>

                {pkg.includes && pkg.includes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {pkg.includes.map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => navigate(`/groomers/${groomer._id}/book`)} style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: '#002045', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Book This Package
                </button>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <p className="text-muted" style={{ marginBottom: '16px' }}>No pricing packages available.</p>
              <button onClick={() => navigate(`/groomers/${groomer._id}/book`)} style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: '#002045', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>

      {lightboxImg && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', padding: '20px' }} onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Portfolio" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: 'var(--radius)', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
};

export default GroomerDetail;
