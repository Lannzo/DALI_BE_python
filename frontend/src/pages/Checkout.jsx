import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, CreditCard, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import useCartStore from '../stores/useCartStore';
import AddressSelector from '../components/checkout/AddressSelector';
import ShippingSelector from '../components/checkout/ShippingSelector';
import PaymentSelector from '../components/checkout/PaymentSelector';

const STEPS = {
  ADDRESS: 'address',
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
};

function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.ADDRESS);
  const [checkoutData, setCheckoutData] = useState({});
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const res = await api.get('/checkout/details');
        setCheckoutData(res.data);
        if (res.data.address_id) setCurrentStep(STEPS.SHIPPING);
        if (res.data.delivery_method) setCurrentStep(STEPS.PAYMENT);
      } catch (error) {
        console.error('Failed to fetch checkout details:', error);
      }
    };
    fetchCheckoutDetails();
  }, []);

  const handleAddressSelect = async (addressId) => {
    try {
      await api.post('/checkout/address', { address_id: addressId });
      setCheckoutData({ ...checkoutData, address_id: addressId });
      setCurrentStep(STEPS.SHIPPING);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to set address');
    }
  };

  const handleShippingSelect = async (deliveryMethod, storeId = null) => {
    try {
      const data = { delivery_method: deliveryMethod };
      if (storeId) data.store_id = storeId;

      await api.post('/checkout/shipping', data);
      setCheckoutData({
        ...checkoutData,
        delivery_method: deliveryMethod,
        store_id: storeId,
      });
      setCurrentStep(STEPS.PAYMENT);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to set shipping method');
    }
  };

  const handlePayment = async (paymentMethod) => {
    setIsProcessing(true);
    setError('');

    try {
      const res = await api.post('/checkout/payment', {
        payment_method: paymentMethod,
      });

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        navigate(`/orders/${res.data.order_id}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed');
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <p className="text-secondary-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Checkout</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Object.entries(STEPS).map(([key, step], index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === step;
            const isCompleted = Object.values(STEPS).indexOf(currentStep) > index;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isActive || isCompleted
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-200 text-secondary-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-sm mt-2 font-medium capitalize">{step}</span>
                </div>
                {index < Object.keys(STEPS).length - 1 && (
                  <div
                    className={`h-1 flex-1 ${
                      isCompleted ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === STEPS.ADDRESS && (
            <AddressSelector onSelect={handleAddressSelect} />
          )}
          {currentStep === STEPS.SHIPPING && (
            <ShippingSelector
              addressId={checkoutData.address_id}
              onSelect={handleShippingSelect}
              onBack={() => setCurrentStep(STEPS.ADDRESS)}
            />
          )}
          {currentStep === STEPS.PAYMENT && (
            <PaymentSelector
              onSelect={handlePayment}
              onBack={() => setCurrentStep(STEPS.SHIPPING)}
              isProcessing={isProcessing}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="font-semibold text-secondary-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-secondary-700">
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="font-medium">₱{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₱{cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {checkoutData.shipping_fee
                    ? `₱${checkoutData.shipping_fee.toLocaleString()}`
                    : 'TBD'}
                </span>
              </div>
              <div className="border-t border-secondary-200 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  ₱
                  {(
                    cart.subtotal + (checkoutData.shipping_fee || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
