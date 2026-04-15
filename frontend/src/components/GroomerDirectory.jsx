import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, MoreHorizontal } from 'lucide-react';

const GroomerDirectory = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('');
  
  useEffect(() => {
    fetchGroomers();
  }, [serviceFilter]);

  const fetchGroomers = async () => {
    try {
      setLoading(true);
      // In a real app we would use user's GPS for lng/lat if location search is active
      const url = serviceFilter 
        ? `http://localhost:5000/api/groomers/search?service=${encodeURIComponent(serviceFilter)}`
        : `http://localhost:5000/api/groomers/search`;
        
      const response = await axios.get(url);
      setGroomers(response.data.data);
    } catch (error) {
      console.error('Error fetching groomers', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Find a Groomer</h1>
        
        {/* Filters */}
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="pl-10 block w-full pl-3 pr-10 py-2 border border-gray-300 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Services</option>
              <option value="Bath & Brush">Bath & Brush</option>
              <option value="Full Grooming">Full Grooming</option>
              <option value="Nail Trimming">Nail Trimming</option>
              <option value="Ear Cleaning">Ear Cleaning</option>
              <option value="Teeth Brushing">Teeth Brushing</option>
              <option value="De-Shedding">De-Shedding</option>
              <option value="Flea Treatment">Flea Treatment</option>
              <option value="Creative Styling">Creative Styling</option>
              <option value="Spa Massage">Spa Massage</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groomers.length === 0 ? (
             <div className="col-span-full text-center text-gray-500 py-12">
               No groomers found matching your criteria.
             </div>
          ) : (
            groomers.map((groomer) => (
              <div key={groomer._id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 w-full bg-gray-200">
                  {groomer.portfolioImages && groomer.portfolioImages.length > 0 ? (
                     <img 
                       src={groomer.portfolioImages[0]} 
                       alt={`Portfolio of ${groomer.userId?.name}`}
                       className="w-full h-full object-cover"
                     />
                  ) : (
                     <div className="flex items-center justify-center h-full text-gray-400">
                       <MapPin className="h-10 w-10 mr-2"/> No Image
                     </div>
                  )}
                </div>
                <div className="px-4 py-5 flex-grow">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                    {groomer.userId?.name || 'Unknown Groomer'}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Star className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-400 fill-current" />
                    <span>4.9 (128 reviews)</span> {/* Hardcoded for demonstration */}
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {groomer.addressString || 'Location not specified'}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                     {groomer.services?.slice(0, 3).map((svc, i) => (
                       <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                         {svc}
                       </span>
                     ))}
                     {groomer.services?.length > 3 && (
                       <span className="inline-flex items-center px-1 py-0.5 text-xs text-gray-500"><MoreHorizontal className="h-3 w-3"/></span>
                     )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <Link
                    to={`/groomer/${groomer._id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroomerDirectory;
