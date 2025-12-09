import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Search, Edit } from 'lucide-react';
import api from '../../lib/api';

function AdminInventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);

        const [productsRes, categoriesRes] = await Promise.all([
          api.get(`/admin/inventory?${params.toString()}`),
          api.get('/products/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedCategory]);

  const handleUpdateStock = async (productId) => {
    try {
      await api.put(`/admin/products/${productId}/stock`, {
        quantity: parseInt(newQuantity),
      });
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      const res = await api.get(`/admin/inventory?${params.toString()}`);
      setProducts(res.data);
      setEditingId(null);
      setNewQuantity('');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to update stock');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-secondary-900">Inventory Management</h1>
            <Link to="/admin" className="text-primary-600 hover:text-primary-700 text-sm">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      params.set('search', e.target.value);
                    } else {
                      params.delete('search');
                    }
                    setSearchParams(params);
                  }}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('category', e.target.value);
                } else {
                  params.delete('category');
                }
                setSearchParams(params);
              }}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-900">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-900">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-900">Stock</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-secondary-600">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.product_id} className="border-b border-secondary-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.image
                              ? `/static/${product.image}`
                              : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100'
                          }
                          alt={product.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-medium text-secondary-900">
                          {product.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary-700">{product.product_category}</td>
                    <td className="py-3 px-4 text-right font-semibold text-primary-600">
                      ₱{Number(product.product_price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === product.product_id ? (
                        <input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="w-24 px-2 py-1 border border-secondary-300 rounded text-center"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`font-semibold ${
                            product.product_quantity === 0
                              ? 'text-red-600'
                              : product.product_quantity < 10
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.product_quantity}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === product.product_id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStock(product.product_id)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setNewQuantity('');
                            }}
                            className="text-sm text-secondary-600 hover:text-secondary-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(product.product_id);
                            setNewQuantity(product.product_quantity.toString());
                          }}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminInventory;
