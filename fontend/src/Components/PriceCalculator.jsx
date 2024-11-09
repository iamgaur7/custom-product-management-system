import React, { useState } from 'react';
import axios from 'axios';

const PriceCalculator = ({ products }) => {
  const [newPrices, setNewPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBulkPriceCalculation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://task.techwithnavi.com/wp-json/custom-shop/v1/bulk-price-calculator', {
        products,
      });
      setNewPrices(response.data);
    } catch (err) {
      setError('Error calculating prices.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Bulk Price Calculator</h2>
      <button
        onClick={handleBulkPriceCalculation}
        className="px-6 py-2 bg-green-500 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Calculate Prices'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {newPrices.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Calculated Prices</h3>
          <ul>
            {newPrices.map((item, index) => (
              <li key={index} className="mt-2">
                <strong>{item.productName}:</strong> ${item.newPrice}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;
