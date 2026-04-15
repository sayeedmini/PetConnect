import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  const { groomerId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '' // Simplified for demo. Geocoding this to Lng/Lat would be ideal in production.
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app we'd get the actual petOwnerId from Auth context
      // And we'd use Google Maps Geocoding API to convert 'address' to [longitude, latitude]
      // Mocking coordinates for demonstration purposes
      const mockCoordinates = [90.4125, 23.8103]; // Dhaka Center as fallback for Demo

      const defaultCenter = {
        lat: 23.8103,
        lng: 90.4125
      };

      const payload = {
        petOwnerId: '650a1b2c3d4e5f6a7b8c9d0e', // Mock User ID
        groomerId,
        date: formData.date,
        time: formData.time,
        coordinates: mockCoordinates
      };

      const response = await axios.post('http://localhost:5000/api/bookings', payload);
      navigate(`/tracking/${response.data.data._id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white py-8 px-10 shadow rounded-lg sm:px-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Schedule Home Grooming</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <div className="mt-1">
              <input
                type="time"
                name="time"
                id="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
             <label htmlFor="address" className="block text-sm font-medium text-gray-700">Service Address</label>
             <div className="mt-1">
               <input
                 type="text"
                 name="address"
                 id="address"
                 placeholder="123 Main St, City, ST"
                 required
                 value={formData.address}
                 onChange={handleChange}
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               />
             </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
