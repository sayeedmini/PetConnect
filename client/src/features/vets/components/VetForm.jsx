import { useState } from 'react';
import { createVet } from '../services/vetApi';

function VetForm() {
  const [formData, setFormData] = useState({
    clinicName: '',
    address: '',
    contactNumber: '',
    servicesOffered: '',
    workingHours: '',
    consultationFee: '',
    rating: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      consultationFee: Number(formData.consultationFee),
      rating: Number(formData.rating || 0),
      servicesOffered: formData.servicesOffered
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await createVet(payload);
      alert('Vet clinic added successfully');

      setFormData({
        clinicName: '',
        address: '',
        contactNumber: '',
        servicesOffered: '',
        workingHours: '',
        consultationFee: '',
        rating: '',
        location: '',
      });
    } catch (error) {
      alert('Failed to add vet clinic');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input name="clinicName" placeholder="Clinic Name" value={formData.clinicName} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
      <input name="servicesOffered" placeholder="Services (comma separated)" value={formData.servicesOffered} onChange={handleChange} />
      <input name="workingHours" placeholder="Working Hours" value={formData.workingHours} onChange={handleChange} required />
      <input name="consultationFee" type="number" placeholder="Consultation Fee" value={formData.consultationFee} onChange={handleChange} required />
      <input name="rating" type="number" step="0.1" placeholder="Rating" value={formData.rating} onChange={handleChange} />
      <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
      <button type="submit">Add Vet Clinic</button>
    </form>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '12px',
    maxWidth: '500px',
    marginTop: '20px',
  },
};

export default VetForm;