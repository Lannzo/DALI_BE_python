import { useState } from 'react';
import { Banknote, CreditCard, ArrowLeft } from 'lucide-react';

function PaymentSelector({ onSelect, onBack, isProcessing }) {
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleContinue = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
    }
  };

  return (
    <div className="card">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Select Payment Method
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Cash on delivery (COD)'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === 'Cash on delivery (COD)'}
            onChange={() => setSelectedMethod('Cash on delivery (COD)')}
            className="sr-only"
          />
          <div className="flex items-center gap-3">
            <Banknote className="w-6 h-6 text-secondary-600" />
            <div>
              <p className="font-medium text-secondary-900">Cash on Delivery (COD)</p>
              <p className="text-sm text-secondary-600">Pay when you receive your order</p>
            </div>
          </div>
        </label>

        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Maya'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === 'Maya'}
            onChange={() => setSelectedMethod('Maya')}
            className="sr-only"
          />
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-secondary-600" />
            <div>
              <p className="font-medium text-secondary-900">Maya</p>
              <p className="text-sm text-secondary-600">Secure online payment</p>
            </div>
          </div>
        </label>

        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'Credit/Debit Card'
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === 'Credit/Debit Card'}
            onChange={() => setSelectedMethod('Credit/Debit Card')}
            className="sr-only"
          />
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-secondary-600" />
            <div>
              <p className="font-medium text-secondary-900">Credit/Debit Card</p>
              <p className="text-sm text-secondary-600">Pay securely with your card</p>
            </div>
          </div>
        </label>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedMethod || isProcessing}
        className="btn-primary w-full"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}

export default PaymentSelector;
