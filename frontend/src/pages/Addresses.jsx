import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../lib/api';

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [formData, setFormData] = useState({
    province_id: '',
    city_id: '',
    barangay_id: '',
    additional_info: '',
    phone_number: '',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await api.get('/locations/provinces');
      setProvinces(res.data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const res = await api.get(`/locations/provinces/${provinceId}/cities`);
      setCities(res.data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchBarangays = async (cityId) => {
    try {
      const res = await api.get(`/locations/cities/${cityId}/barangays`);
      setBarangays(res.data);
    } catch (error) {
      console.error('Failed to fetch barangays:', error);
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setFormData({ ...formData, province_id: provinceId, city_id: '', barangay_id: '' });
    if (provinceId) {
      fetchCities(provinceId);
    }
    setCities([]);
    setBarangays([]);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormData({ ...formData, city_id: cityId, barangay_id: '' });
    if (cityId) {
      fetchBarangays(cityId);
    }
    setBarangays([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, formData);
      } else {
        await api.post('/addresses', formData);
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to save address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete address');
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.address_id);
    setFormData({
      province_id: address.province_id,
      city_id: address.city_id,
      barangay_id: address.barangay_id,
      additional_info: address.additional_info,
      phone_number: address.phone_number,
      is_default: address.is_default,
    });
    fetchCities(address.province_id);
    fetchBarangays(address.city_id);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      province_id: '',
      city_id: '',
      barangay_id: '',
      additional_info: '',
      phone_number: '',
      is_default: false,
    });
    setCities([]);
    setBarangays([]);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">Province</label>
                <select
                  value={formData.province_id}
                  onChange={handleProvinceChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.province_id} value={p.province_id}>
                      {p.province_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">City</label>
                <select
                  value={formData.city_id}
                  onChange={handleCityChange}
                  className="input-field"
                  required
                  disabled={!formData.province_id}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.city_id} value={c.city_id}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">Barangay</label>
                <select
                  value={formData.barangay_id}
                  onChange={(e) => setFormData({ ...formData, barangay_id: e.target.value })}
                  className="input-field"
                  required
                  disabled={!formData.city_id}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((b) => (
                    <option key={b.barangay_id} value={b.barangay_id}>
                      {b.barangay_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">
                Street Address, Building, Unit
              </label>
              <textarea
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-secondary-700">Set as default address</span>
            </label>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Save'} Address
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.address_id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-secondary-600" />
                  {address.is_default && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-medium text-secondary-900">{address.additional_info}</p>
                <p className="text-secondary-600 mt-1">
                  {address.barangay?.barangay_name}, {address.city?.city_name},{' '}
                  {address.province?.province_name}
                </p>
                {address.phone_number && (
                  <p className="text-secondary-600 mt-1">{address.phone_number}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(address.address_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Addresses;
