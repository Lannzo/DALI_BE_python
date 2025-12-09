import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import api from '../../lib/api';

function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);

        const res = await api.get(`/admin/orders?${params.toString()}`);
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [searchQuery]);

  const getStatusColor = (status) => {
    const colors = {
      PROCESSING: 'bg-yellow-100 text-yellow-800',
      PREPARING_FOR_SHIPMENT: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COLLECTED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      DELIVERY_FAILED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-secondary-100 text-secondary-800';
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-secondary-900">Order Management</h1>
            <Link to="/admin" className="text-primary-600 hover:text-primary-700 text-sm">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
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

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse h-24"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-secondary-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.order_id}
                to={`/admin/orders/${order.order_id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="font-semibold text-secondary-900">
                        Order #{order.order_id}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.shipping_status
                        )}`}
                      >
                        {order.shipping_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      Customer: {order.account?.first_name} {order.account?.last_name}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1">
                        {order.order_items?.length || 0} item(s)
                      </p>
                      <p className="text-xl font-bold text-primary-600">
                        ₱{Number(order.total_price).toLocaleString()}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-secondary-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminOrders;
