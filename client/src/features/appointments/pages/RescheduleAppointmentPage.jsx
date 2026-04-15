import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAppointmentById,
  getAvailableSlots,
  rescheduleAppointment,
} from '../services/appointmentApi';
import AppointmentSlotPicker from '../components/AppointmentSlotPicker';

function RescheduleAppointmentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await getAppointmentById(appointmentId);
        setAppointment(response.data);
        setSelectedDate(response.data.appointmentDate);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load appointment');
        console.error(error);
      } finally {
        setLoadingAppointment(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!appointment?.clinic?._id || !selectedDate) return;

      setLoadingSlots(true);
      setSelectedSlot(null);

      try {
        const response = await getAvailableSlots(appointment.clinic._id, selectedDate);
        setSlots(response.slots || []);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load slots');
        console.error(error);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [appointment, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('Please select a new slot');
      return;
    }

    setSaving(true);

    try {
      await rescheduleAppointment(appointmentId, {
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
      });

      alert('Appointment rescheduled successfully');
      navigate('/appointments');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to reschedule appointment');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loadingAppointment) {
    return <div style={{ padding: '30px' }}><p>Loading appointment...</p></div>;
  }

  if (!appointment) {
    return <div style={{ padding: '30px' }}><p>Appointment not found.</p></div>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <Link to="/appointments">← Back to My Appointments</Link>

      <h1 style={{ marginTop: '14px' }}>Reschedule Appointment</h1>
      <p><strong>Clinic:</strong> {appointment.clinic?.clinicName}</p>
      <p><strong>Current Slot:</strong> {appointment.appointmentDate} | {appointment.slotLabel}</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          New Date
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>

        <div style={styles.slotSection}>
          <h3>Select new slot</h3>
          <AppointmentSlotPicker
            slots={slots}
            selectedStartTime={selectedSlot?.startTime}
            onSelect={setSelectedSlot}
            loading={loadingSlots}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Updating appointment...' : 'Confirm Reschedule'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '16px',
    maxWidth: '760px',
  },
  slotSection: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
  },
};

export default RescheduleAppointmentPage;
