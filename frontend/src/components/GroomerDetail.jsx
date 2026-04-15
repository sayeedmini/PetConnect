import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

const GroomerDetail = () => {
  const { id } = useParams();
  const [groomer, setGroomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groomers/${id}`);
        setGroomer(response.data.data);
      } catch (error) {
        console.error('Error fetching groomer detail', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!groomer) {
    return <div className="text-center mt-20 text-gray-500">Groomer not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-3xl leading-6 font-bold text-gray-900">{groomer.userId?.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1"/> {groomer.addressString || 'Location not specified'}
              <span className="mx-2">&bull;</span>
              {groomer.experience} Experience
            </p>
          </div>
          <Link
            to={`/book/${groomer.userId?._id}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Calendar className="mr-2 h-5 w-5"/>
            Book Now
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Services & Pricing */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Services Offered</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-3">
                {groomer.services?.map((svc, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{svc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pricing Packages</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {groomer.pricing?.map((pkg, i) => (
                <li key={i} className="px-4 py-4 sm:px-6">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900">{pkg.packageName}</p>
                    <p className="text-lg font-bold text-indigo-600">${pkg.price}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Portfolio Images */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg h-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Portfolio</h3>
            </div>
            <div className="p-6">
              {groomer.portfolioImages && groomer.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {groomer.portfolioImages.map((imgUrl, i) => (
                    <div key={i} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden relative group">
                      <img 
                        src={imgUrl} 
                        alt="Portfolio work" 
                        className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  No portfolio images uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroomerDetail;
