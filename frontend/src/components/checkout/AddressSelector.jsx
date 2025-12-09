import { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

function AddressSelector({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.is_default);
        if (defaultAddr) {
          setSelectedId(defaultAddr.address_id);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleContinue = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  if (isLoading) {
    return <div className="card animate-pulse h-40"></div>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Select Delivery Address
        </h2>
        <Link to="/addresses" className="text-primary-600 hover:text-primary-700 text-sm">
          Manage Addresses
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-secondary-600 mb-4">No saved addresses</p>
          <Link to="/addresses" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Address
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {addresses.map((address) => (
              <label
                key={address.address_id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedId === address.address_id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === address.address_id}
                  onChange={() => setSelectedId(address.address_id)}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      selectedId === address.address_id
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-secondary-300'
                    }`}
                  >
                    {selectedId === address.address_id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      {address.additional_info}
                    </p>
                    <p className="text-sm text-secondary-600 mt-1">
                      {address.barangay?.barangay_name}, {address.city?.city_name},{' '}
                      {address.province?.province_name}
                    </p>
                    {address.phone_number && (
                      <p className="text-sm text-secondary-600 mt-1">{address.phone_number}</p>
                    )}
                    {address.is_default && (
                      <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="btn-primary w-full"
          >
            Continue to Shipping
          </button>
        </>
      )}
    </div>
  );
}

export default AddressSelector;
