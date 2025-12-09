import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      try {
        const res = await api.get(`/products/categories/${selectedCategory}/subcategories`);
        setSubcategories(res.data.subcategories);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
        if (searchQuery) params.append('search', searchQuery);

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
      params.delete('subcategory');
    } else {
      params.delete('category');
      params.delete('subcategory');
    }
    setSearchParams(params);
  };

  const handleSubcategoryChange = (subcategory) => {
    const params = new URLSearchParams(searchParams);
    if (subcategory) {
      params.set('subcategory', subcategory);
    } else {
      params.delete('subcategory');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Products</h1>
          {searchQuery && (
            <p className="text-secondary-600 mt-1">
              Search results for "{searchQuery}"
            </p>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-outline"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 flex-shrink-0`}
        >
          <div className="card sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-secondary-900">Filters</h2>
              {(selectedCategory || selectedSubcategory) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-secondary-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => handleCategoryChange(null)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm text-secondary-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-secondary-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {subcategories.length > 0 && (
                <div>
                  <h3 className="font-medium text-secondary-900 mb-3">Subcategory</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={!selectedSubcategory}
                        onChange={() => handleSubcategoryChange(null)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-secondary-700">All</span>
                    </label>
                    {subcategories.map((subcategory) => (
                      <label key={subcategory} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubcategory === subcategory}
                          onChange={() => handleSubcategoryChange(subcategory)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm text-secondary-700">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-full h-48 bg-secondary-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-secondary-600">No products found</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-secondary-600">
                Showing {products.length} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
