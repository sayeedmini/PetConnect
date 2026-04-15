import { useEffect, useMemo, useState } from 'react';
import { createVet, updateVet } from '../services/vetApi';

function VetForm({ initialData = null, isEdit = false, onSuccess }) {
  const [formData, setFormData] = useState({
    clinicName: '',
    address: '',
    contactNumber: '',
    servicesOffered: '',
    openTime: '',
    closeTime: '',
    consultationFee: '',
    rating: '',
    latitude: '',
    longitude: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        clinicName: initialData.clinicName || '',
        address: initialData.address || '',
        contactNumber: initialData.contactNumber || '',
        servicesOffered: Array.isArray(initialData.servicesOffered)
          ? initialData.servicesOffered.join(', ')
          : '',
        openTime: initialData.workingHours?.openTime || '',
        closeTime: initialData.workingHours?.closeTime || '',
        consultationFee: initialData.consultationFee || '',
        rating: initialData.rating || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
      });
    }
  }, [initialData]);

  const mapUrl = useMemo(() => {
    if (!formData.latitude || !formData.longitude) return '';
    return `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`;
  }, [formData.latitude, formData.longitude]);

  const handleChange = (e) => {
    setFormData((prev) => ({
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
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocationLoading(false);
      },
      (error) => {
        alert(error.message || 'Failed to fetch current location');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      clinicName: formData.clinicName,
      address: formData.address,
      contactNumber: formData.contactNumber,
      servicesOffered: formData.servicesOffered
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      consultationFee: Number(formData.consultationFee),
      rating: Number(formData.rating || 0),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    setSubmitting(true);

    try {
      let response;

      if (isEdit && initialData?._id) {
        response = await updateVet(initialData._id, payload);
        alert('Vet clinic updated successfully');
      } else {
        response = await createVet(payload);
        alert('Vet clinic added successfully');
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      if (!isEdit) {
        setFormData({
          clinicName: '',
          address: '',
          contactNumber: '',
          servicesOffered: '',
          openTime: '',
          closeTime: '',
          consultationFee: '',
          rating: '',
          latitude: '',
          longitude: '',
        });
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to save vet clinic');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="clinicName"
        placeholder="Clinic Name"
        value={formData.clinicName}
        onChange={handleChange}
        required
      />

      <input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <input
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />

      <input
        name="servicesOffered"
        placeholder="Services (comma separated)"
        value={formData.servicesOffered}
        onChange={handleChange}
      />

      <div style={styles.timeRow}>
        <input
          name="openTime"
          type="time"
          value={formData.openTime}
          onChange={handleChange}
          required
        />

        <input
          name="closeTime"
          type="time"
          value={formData.closeTime}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.timeRow}>
        <input
          name="consultationFee"
          type="number"
          placeholder="Consultation Fee"
          value={formData.consultationFee}
          onChange={handleChange}
          required
        />

        <input
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>

      <div style={styles.timeRow}>
        <input
          name="latitude"
          type="number"
          step="any"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />

        <input
          name="longitude"
          type="number"
          step="any"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
      </div>

      <button type="button" onClick={handleUseCurrentLocation} disabled={locationLoading}>
        {locationLoading ? 'Getting current location...' : 'Use Current Location'}
      </button>

      {mapUrl ? (
        <iframe
          title="clinic-location-preview"
          src={mapUrl}
          style={styles.map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div style={styles.mapPlaceholder}>
          Add latitude and longitude to preview the clinic location on Google Maps.
        </div>
      )}

      <button type="submit" disabled={submitting}>
        {submitting
          ? isEdit
            ? 'Updating...'
            : 'Saving...'
          : isEdit
          ? 'Update Vet Clinic'
          : 'Add Vet Clinic'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '12px',
    maxWidth: '720px',
    marginTop: '20px',
  },
  timeRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  map: {
    width: '100%',
    height: '300px',
    border: 0,
    borderRadius: '12px',
  },
  mapPlaceholder: {
    minHeight: '120px',
    display: 'grid',
    placeItems: 'center',
    background: '#eef2ff',
    borderRadius: '12px',
    padding: '16px',
    color: '#3730a3',
  },
};

export default VetForm;
