import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function InventoryStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedStock, setUpdatedStock] = useState({}); // New state for tracking stock changes

  const fetchStatus = async () => {
    try {
      const response = await api.getInventoryStatus();
      setStatus(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory status');
      console.error('Error fetching inventory status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStockChange = (productId, newStock) => {
    setUpdatedStock({
      ...updatedStock,
      [productId]: newStock, // Update the stock for a specific product
    });
  };

  const updateStock = async (productId) => {
    const newStock = updatedStock[productId]; // Get the updated stock for this product
    if (newStock !== undefined) {
      try {
        // Call the API to update the stock in the backend
        const response = await api.updateStock(productId, newStock);
        if (response.data.success) {
          // If successful, update the status state with the new stock
          setStatus((prevStatus) => ({
            ...prevStatus,
            products: prevStatus.products.map((product) =>
              product.product_id === productId
                ? { ...product, stock: newStock }
                : product
            ),
          }));
        }
      } catch (err) {
        setError('Failed to update stock');
        console.error('Error updating stock:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 className="font-semibold mb-3">Inventory Status</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-xl font-bold">{status?.totalProducts || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Stock</p>
          <p className="text-xl font-bold">{status?.totalStock || 0}</p>
        </div>
      </div>
      <div className="mt-4">
        {status?.products?.map((product) => (
          <div
            key={product.product_id}
            className="flex justify-between items-center mt-2"
          >
            <span className="text-sm truncate flex-1 mr-2">{product.name}</span>
            <span
              className={`text-sm font-semibold ${
                product.stock <= 0
                  ? 'text-red-600'
                  : product.stock < 20
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              {product.stock <= 0
                ? 'Out of Stock'
                : product.stock < 20
                ? 'Low Stock'
                : 'In Stock'}{' '}
              ({product.stock})
            </span>
            {/* Add input field to update stock */}
            <input
              type="number"
              min="0"
              value={updatedStock[product.product_id] || product.stock}
              onChange={(e) =>
                handleStockChange(product.product_id, e.target.value)
              }
              className="ml-4 p-1 border border-gray-300 rounded"
            />
            <button
              onClick={() => updateStock(product.product_id)}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
