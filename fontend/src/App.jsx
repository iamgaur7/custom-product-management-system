import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './Components/ProductList';
import VariantEditor from './Components/VariantEditor';
import InventoryStatus from './Components/InventoryStatus';
import PriceCalculator from './Components/PriceCalculator';

const App = () => {
  const [products, setProducts] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://task.techwithnavi.com/wp-json/custom-shop/v1/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products.');
      }
    };

    // Fetch inventory status from the API
    const fetchInventoryStatus = async () => {
      try {
        const response = await axios.get('https://task.techwithnavi.com/wp-json/custom-shop/v1/inventory-status');
        setInventoryStatus(response.data);
      } catch (err) {
        setError('Error fetching inventory status.');
      }
    };

    fetchProducts();
    fetchInventoryStatus();
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Management Dashboard</h1>
      <InventoryStatus data={inventoryStatus} />
      <ProductList products={products} />
      <VariantEditor products={products} />
      <PriceCalculator products={products} />
    </div>
  );
};

export default App;
