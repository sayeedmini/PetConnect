import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { deleteVet, getVetById } from '../services/vetApi';
import { getUser } from '../../auth/utils/auth';

function VetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = getUser();

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const response = await getVetById(id);
        setVet(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVet();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this clinic?');
    if (!confirmed) return;

    try {
      await deleteVet(id);
      alert('Vet clinic deleted successfully');
      navigate('/vets');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete vet clinic');
      console.error(error);
    }
  };

  if (loading) return <div style={{ padding: '30px' }}><p>Loading clinic details...</p></div>;
  if (!vet) return <div style={{ padding: '30px' }}><p>Vet clinic not found.</p></div>;

  const mapUrl = `https://maps.google.com/maps?q=${vet.latitude},${vet.longitude}&z=15&output=embed`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${vet.latitude},${vet.longitude}`
  )}`;

  const isOwner = currentUser?._id === vet?.owner?._id;
  const isAdmin = currentUser?.role === 'admin';
  const canManage = isOwner || isAdmin;
  const canBook = currentUser && ['petOwner', 'admin'].includes(currentUser.role);

  return (
    <div style={{ padding: '30px' }}>
      <Link to="/vets">← Back to Vet Clinics</Link>

      <h1 style={{ marginTop: '14px' }}>{vet.clinicName}</h1>

      <p><strong>Status:</strong> {vet.isOpenNow ? 'Open now' : 'Closed now'}</p>
      <p><strong>Address:</strong> {vet.address}</p>
      <p><strong>Contact:</strong> {vet.contactNumber}</p>
      <p><strong>Working Hours:</strong> {vet.workingHours?.openTime} - {vet.workingHours?.closeTime}</p>
      <p><strong>Consultation Fee:</strong> ৳{vet.consultationFee}</p>
      <p><strong>Rating:</strong> {vet.rating}</p>
      <p><strong>Services:</strong> {vet.servicesOffered?.join(', ') || 'Not specified'}</p>
      <p><strong>Coordinates:</strong> {vet.latitude}, {vet.longitude}</p>

      {vet.owner && (
        <p>
          <strong>Owner:</strong> {vet.owner.name} ({vet.owner.email})
        </p>
      )}

      <iframe
        title="vet-map"
        src={mapUrl}
        style={{ width: '100%', height: '340px', border: 0, borderRadius: '14px', marginTop: '12px' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div style={{ display: 'flex', gap: '14px', marginTop: '18px', flexWrap: 'wrap' }}>
        <a href={googleMapsLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
        {canBook && <Link to={`/vets/${vet._id}/book`}>Book Appointment</Link>}
        {canManage && <Link to={`/vets/${vet._id}/edit`}>Edit Clinic</Link>}
        {canManage && <button onClick={handleDelete}>Delete Clinic</button>}
      </div>
    </div>
  );
}

export default VetDetailsPage;
