import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import useCartStore from '../stores/useCartStore';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.product_id, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.product_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <p className="text-secondary-600">Product not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = product.image
    ? `/static/${product.image}`
    : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative rounded-lg overflow-hidden bg-secondary-100">
            <img
              src={imageUrl}
              alt={product.product_name}
              className="w-full h-[500px] object-cover"
            />
            {product.product_quantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {product.product_category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            {product.product_name}
          </h1>

          <div className="mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              ₱{Number(product.product_price).toLocaleString()}
            </div>
            {product.product_quantity > 0 && (
              <p className="text-secondary-600">
                {product.product_quantity < 10 ? (
                  <span className="text-orange-600 font-medium">
                    Only {product.product_quantity} left in stock
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">In Stock</span>
                )}
              </p>
            )}
          </div>

          {product.product_description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Description</h2>
              <p className="text-secondary-700 leading-relaxed">
                {product.product_description}
              </p>
            </div>
          )}

          {product.product_subcategory && (
            <div className="mb-6">
              <p className="text-sm text-secondary-600">
                <span className="font-medium">Category:</span> {product.product_subcategory}
              </p>
            </div>
          )}

          {product.product_quantity > 0 && (
            <div className="border-t border-secondary-200 pt-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border border-secondary-300 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.product_quantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 text-center border border-secondary-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.product_quantity}
                    className="w-10 h-10 flex items-center justify-center border border-secondary-300 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
