import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVets } from '../services/vetApi';
import VetCard from '../components/VetCard';
import { getUser } from '../../auth/utils/auth';

const defaultFilters = {
  search: '',
  service: '',
  minRating: '',
  lat: '',
  lng: '',
  radiusKm: '',
};

function VetListPage() {
  const [vets, setVets] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const currentUser = getUser();

  const fetchVets = async (activeFilters = {}) => {
    try {
      setLoading(true);

      const cleanFilters = Object.fromEntries(
        Object.entries(activeFilters).filter(
          ([, value]) => value !== '' && value !== null && value !== undefined
        )
      );

      const data = await getAllVets(cleanFilters);
      setVets(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
          radiusKm: prev.radiusKm || '10',
        }));
        setLocationLoading(false);
      },
      (error) => {
        alert(error.message || 'Failed to fetch your location');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVets(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    fetchVets(defaultFilters);
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Vet Clinics</h1>
            <p className="page-subtitle">
              Search by clinic name, address, service, rating, and distance.
            </p>
          </div>

          <div className="toolbar">
            {['vet', 'admin'].includes(currentUser?.role) && (
              <Link className="btn btn-primary" to="/vets/add">
                + Add Vet Clinic
              </Link>
            )}
            {currentUser && (
              <Link className="btn btn-secondary" to="/appointments">
                My Appointments
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label>Search</label>
              <input
                name="search"
                placeholder="Clinic or address"
                value={filters.search}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Service</label>
              <input
                name="service"
                placeholder="e.g. surgery"
                value={filters.service}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Minimum rating</label>
              <input
                name="minRating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="0 to 5"
                value={filters.minRating}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Radius (km)</label>
              <input
                name="radiusKm"
                type="number"
                step="any"
                placeholder="10"
                value={filters.radiusKm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="toolbar" style={{ marginTop: '14px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? 'Getting location...' : 'Use My Location'}
            </button>

            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>

            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {loading ? (
          <div className="card">
            <div className="card-body">Loading vet clinics...</div>
          </div>
        ) : vets.length === 0 ? (
          <div className="card">
            <div className="card-body empty-state">No vet clinics found.</div>
          </div>
        ) : (
          <div className="list-grid">
            {vets.map((vet) => (
              <VetCard key={vet._id} vet={vet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VetListPage;