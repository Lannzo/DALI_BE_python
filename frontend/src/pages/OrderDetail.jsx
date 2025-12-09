import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Truck, CreditCard, X } from 'lucide-react';
import api from '../lib/api';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <p className="text-secondary-600">Order not found</p>
        </div>
      </div>
    );
  }

  const canCancel = order.shipping_status === 'PROCESSING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Order #{order.order_id}
          </h1>
          <p className="text-secondary-600">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-medium ${getStatusColor(
            order.shipping_status
          )}`}
        >
          {order.shipping_status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.order_item_id} className="flex gap-4">
                  <img
                    src={
                      item.product.image
                        ? `/static/${item.product.image}`
                        : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=200'
                    }
                    alt={item.product.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-secondary-900">
                      {item.product.product_name}
                    </h3>
                    <p className="text-sm text-secondary-600">Quantity: {item.quantity}</p>
                    <p className="text-primary-600 font-semibold mt-1">
                      ₱{Number(item.product.product_price).toLocaleString()} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary-900">
                      ₱{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </h2>
            <p className="text-secondary-700">{order.address?.additional_info}</p>
            <p className="text-secondary-600 mt-1">
              {order.address?.barangay?.barangay_name},{' '}
              {order.address?.city?.city_name},{' '}
              {order.address?.province?.province_name}
            </p>
            {order.address?.phone_number && (
              <p className="text-secondary-600 mt-1">{order.address.phone_number}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Method
            </h2>
            <p className="text-secondary-700">{order.delivery_method}</p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </h2>
            <p className="text-secondary-700">{order.payment_method}</p>
            <p className="text-sm text-secondary-600 mt-1">
              Status: {order.payment_status}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-secondary-700">
                <span>Subtotal</span>
                <span>₱{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-secondary-700">
                <span>Shipping Fee</span>
                <span>₱{order.shipping_fee?.toLocaleString()}</span>
              </div>
              <div className="border-t border-secondary-200 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">
                  ₱{Number(order.total_price).toLocaleString()}
                </span>
              </div>
            </div>

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
