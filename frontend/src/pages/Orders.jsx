import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../lib/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">No orders yet</h2>
          <p className="text-secondary-600 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.order_id}
              to={`/orders/${order.order_id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-secondary-600">
                    Order #{order.order_id}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.shipping_status
                  )}`}
                >
                  {order.shipping_status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 mb-2">
                    {order.order_items?.length || 0} item(s)
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    ₱{Number(order.total_price).toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-secondary-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
