import React, { useState, useEffect } from 'react';
import { api } from './services/api'; // Adjust the path if necessary
import ProductVariant from './Components/ProductVariant';
import BulkPricing from './Components/BulkPricing';
import InventoryStatus from './Components/InventoryStatus';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      console.log('Raw API Response:', response); // Debug log to inspect the response

      // Check if response.data exists and is an array
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const validProducts = response.data.filter((product) => {
        return (
          product &&
          typeof product === 'object' &&
          Array.isArray(product.variants)
        );
      });

      console.log('Filtered Valid Products:', validProducts);

      if (validProducts.length === 0) {
        console.warn('No valid products found');
      }

      const productsWithVariants = validProducts.filter((product) => ({
        id: product.product_id,
        name: product.name || 'Unnamed Product',
        variants: product.variants.map((variant) => ({
          id: variant.variant_id || Math.random().toString(36).substr(2, 9),
          sku: variant.sku || 'N/A',
          stock: variant.stock || 0,
          price: variant.price ? parseFloat(variant.price).toFixed(2) : '0.00',
          attributes: variant.attributes || {},
        })),
      }));

      console.log('Processed Products with Variants:', productsWithVariants);
      setProducts(productsWithVariants);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch products';
      setError(`Error: ${errorMessage}`);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle stock updates in the parent component
  const handleUpdateStock = (productId, variantId, newStock) => {
    if (!productId || !variantId) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === variantId
                  ? { ...variant, stock: newStock }
                  : variant
              ),
            }
          : product
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-center my-5 text-2xl">Product Management</h1>
      <div className="flex justify-around">
        {error && <div>Error: {error}</div>}

        {products.length === 0 && !error && <div>No products found</div>}

        <div>
          {products.map((product) => (
            <ProductVariant
              key={product.id}
              product={product}
              onUpdateStock={handleUpdateStock} // Passing the function to child
            />
          ))}
        </div>
        <div>
          <InventoryStatus   />
          <BulkPricing />
        </div>
      </div>
    </div>
  );
}

export default App;
