import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getVetById } from '../../vets/services/vetApi';
import { bookAppointment, getAvailableSlots } from '../services/appointmentApi';
import AppointmentSlotPicker from '../components/AppointmentSlotPicker';

const todayString = () => new Date().toISOString().slice(0, 10);

function BookAppointmentPage() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loadingClinic, setLoadingClinic] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: todayString(),
    petName: '',
    petType: '',
    reason: '',
    notes: '',
  });
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const response = await getVetById(clinicId);
        setClinic(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingClinic(false);
      }
    };

    fetchClinic();
  }, [clinicId]);

  const loadSlots = useCallback(async (dateValue) => {
    if (!dateValue) return;

    setLoadingSlots(true);
    setSelectedSlot(null);

    try {
      const response = await getAvailableSlots(clinicId, dateValue);
      setSlots(response.slots || []);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to load available slots');
      console.error(error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [clinicId]);

  useEffect(() => {
    loadSlots(formData.appointmentDate);
  }, [loadSlots, formData.appointmentDate]);

  const mapUrl = useMemo(() => {
    if (!clinic?.latitude || !clinic?.longitude) return '';
    return `https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`;
  }, [clinic]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('Please select an available slot first');
      return;
    }

    setSaving(true);

    try {
      const response = await bookAppointment({
        clinicId,
        appointmentDate: formData.appointmentDate,
        startTime: selectedSlot.startTime,
        petName: formData.petName,
        petType: formData.petType,
        reason: formData.reason,
        notes: formData.notes,
      });

      alert('Appointment booked successfully');
      navigate('/appointments', { state: { newAppointment: response.data } });
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to book appointment');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loadingClinic) {
    return <div style={{ padding: '30px' }}><p>Loading clinic...</p></div>;
  }

  if (!clinic) {
    return <div style={{ padding: '30px' }}><p>Clinic not found.</p></div>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <Link to={`/vets/${clinicId}`}>← Back to Clinic Details</Link>

      <h1 style={{ marginTop: '14px' }}>Book Appointment</h1>
      <p><strong>Clinic:</strong> {clinic.clinicName}</p>
      <p><strong>Working Hours:</strong> {clinic.workingHours?.openTime} - {clinic.workingHours?.closeTime}</p>

      {mapUrl && (
        <iframe
          title="book-appointment-clinic-map"
          src={mapUrl}
          style={{ width: '100%', height: '300px', border: 0, borderRadius: '12px', marginBottom: '16px' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Appointment Date
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            min={todayString()}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Pet Name
          <input
            name="petName"
            placeholder="Enter pet name"
            value={formData.petName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Pet Type
          <input
            name="petType"
            placeholder="Dog / Cat / Bird"
            value={formData.petType}
            onChange={handleChange}
          />
        </label>

        <label>
          Reason
          <textarea
            name="reason"
            placeholder="Describe the problem or checkup reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
          />
        </label>

        <label>
          Notes
          <textarea
            name="notes"
            placeholder="Any additional notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </label>

        <div style={styles.slotSection}>
          <h3>Select a time slot</h3>
          <AppointmentSlotPicker
            slots={slots}
            selectedStartTime={selectedSlot?.startTime}
            onSelect={setSelectedSlot}
            loading={loadingSlots}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Booking appointment...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '14px',
    maxWidth: '760px',
  },
  slotSection: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
  },
};

export default BookAppointmentPage;
