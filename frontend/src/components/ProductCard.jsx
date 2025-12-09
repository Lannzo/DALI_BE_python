import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import useCartStore from '../stores/useCartStore';

function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addToCart(product.product_id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const imageUrl = product.image
    ? `/static/${product.image}`
    : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <Link
      to={`/products/${product.product_id}`}
      className="card group hover:shadow-lg transition-all duration-200"
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={imageUrl}
          alt={product.product_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {product.product_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
        {product.product_name}
      </h3>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary-600">
            ₱{Number(product.product_price).toLocaleString()}
          </p>
          {product.product_quantity > 0 && product.product_quantity < 10 && (
            <p className="text-xs text-orange-600 mt-1">
              Only {product.product_quantity} left
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.product_quantity === 0 || isAdding}
          className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
