import React, { useState } from 'react';
import { api } from '../services/api';

export default function InventoryStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventoryStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getInventoryStatus();
      setStatus(response);
    } catch (err) {
      setError('Failed to fetch inventory status');
      console.error('Error fetching inventory status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="w-full p-4 bg-gray-100 border-l border-gray-200">
        <button
          onClick={fetchInventoryStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Inventory Status'}
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {status ? (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Stock</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {status.map((product) => (
                <tr key={product.product_id}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">
                    {product.stock !== null ? product.stock : 'N/A'}
                  </td>
                  <td
                    className={`border px-4 py-2 ${
                      product.stock === null || product.stock <= 0
                        ? 'text-red-600'
                        : product.stock < 20
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {product.stock === null
                      ? 'Out of Stock'
                      : product.stock <= 0
                      ? 'Out of Stock'
                      : product.stock < 20
                      ? 'Low Stock'
                      : 'In Stock'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">
            {loading ? 'Fetching data...' : 'No data available'}
          </div>
        )}
      </div>
    </div>
  );
}