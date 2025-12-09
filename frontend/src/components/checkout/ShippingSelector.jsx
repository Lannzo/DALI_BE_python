import { useState, useEffect } from 'react';
import { Truck, Store, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

function ShippingSelector({ addressId, onSelect, onBack }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [shippingFee, setShippingFee] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        setStores(res.data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedMethod && selectedMethod !== 'Pickup Delivery' && addressId) {
      const calculateShipping = async () => {
        setIsCalculating(true);
        try {
          const res = await api.get(
            `/checkout/calculate-shipping?address_id=${addressId}&delivery_method=${encodeURIComponent(
              selectedMethod
            )}`
          );
          setShippingFee(res.data.shipping_fee);
        } catch (error) {
          console.error('Failed to calculate shipping:', error);
        } finally {
          setIsCalculating(false);
        }
      };
      calculateShipping();
    } else if (selectedMethod === 'Pickup Delivery') {
      setShippingFee(0);
    }
  }, [selectedMethod, addressId]);

  const handleContinue = () => {
    if (selectedMethod === 'Pickup Delivery' && !selectedStore) {
      alert('Please select a pickup store');
      return;
    }
    onSelect(selectedMethod, selectedStore);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Select Delivery Method
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Standard Delivery'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedMethod === 'Standard Delivery'}
            onChange={() => setSelectedMethod('Standard Delivery')}
            className="sr-only"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Standard Delivery</p>
              <p className="text-sm text-secondary-600">Delivery in 3-5 business days</p>
            </div>
            {isCalculating && selectedMethod === 'Standard Delivery' ? (
              <span className="text-sm">Calculating...</span>
            ) : shippingFee !== null && selectedMethod === 'Standard Delivery' ? (
              <span className="font-semibold text-primary-600">₱{shippingFee.toLocaleString()}</span>
            ) : null}
          </div>
        </label>

        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Priority Delivery'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedMethod === 'Priority Delivery'}
            onChange={() => setSelectedMethod('Priority Delivery')}
            className="sr-only"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Priority Delivery</p>
              <p className="text-sm text-secondary-600">Delivery in 1-2 business days</p>
            </div>
            {isCalculating && selectedMethod === 'Priority Delivery' ? (
              <span className="text-sm">Calculating...</span>
            ) : shippingFee !== null && selectedMethod === 'Priority Delivery' ? (
              <span className="font-semibold text-primary-600">₱{shippingFee.toLocaleString()}</span>
            ) : null}
          </div>
        </label>

        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Pickup Delivery'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedMethod === 'Pickup Delivery'}
            onChange={() => setSelectedMethod('Pickup Delivery')}
            className="sr-only"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Store Pickup</p>
              <p className="text-sm text-secondary-600">Pick up from our store</p>
            </div>
            <span className="font-semibold text-green-600">FREE</span>
          </div>
        </label>
      </div>

      {selectedMethod === 'Pickup Delivery' && (
        <div className="mb-6">
          <h3 className="font-medium text-secondary-900 mb-3">Select Pickup Store</h3>
          <div className="space-y-2">
            {stores.map((store) => (
              <label
                key={store.store_id}
                className={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStore === store.store_id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="store"
                  checked={selectedStore === store.store_id}
                  onChange={() => setSelectedStore(store.store_id)}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">{store.store_name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleContinue} disabled={!selectedMethod} className="btn-primary w-full">
        Continue to Payment
      </button>
    </div>
  );
}

export default ShippingSelector;
