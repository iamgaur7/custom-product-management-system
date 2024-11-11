import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BulkPricing({ products, quantity }) {
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculatePrice = async () => {
    setLoading(true);
    setError(null);

    // Validate products and quantity before making the request
    if (!Array.isArray(products) || products.length === 0) {
      setError('Invalid products list.');
      setLoading(false);
      return;
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      setError('Invalid quantity.');
      setLoading(false);
      return;
    }

    try {
      const productIds = products.map((p) => p.product_id);
      const response = await api.calculateBulkPrice({
        products: productIds,
        quantity,
      });

      // Handle API response
      if (response.data) {
        setCalculatedPrice(response.data);
      } else {
        setError('No pricing data available.');
      }
    } catch (err) {
      setError('Failed to calculate bulk price');
      console.error('Bulk Pricing API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quantity > 0 && products.length > 0) {
      calculatePrice();
    }
  }, [quantity, products]);

  if (loading) {
    return <div className="animate-pulse">Calculating...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-3">Bulk Pricing</h3>
      {calculatedPrice ? (
        <div className="space-y-4">
          <div className="flex justify-between font-bold">
            <span>Price per unit ({quantity} units):</span>
            <span>
              {calculatedPrice.unitPrice !== undefined
                ? calculatedPrice.unitPrice.toFixed(2)
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total price:</span>
            <span>
              {calculatedPrice.totalPrice !== undefined
                ? calculatedPrice.totalPrice.toFixed(2)
                : 'N/A'}
            </span>
          </div>
          {calculatedPrice.discount > 0 && (
            <div className="text-green-600 text-sm">
              Discount applied: {(calculatedPrice.discount * 100).toFixed(0)}%
            </div>
          )}
        </div>
      ) : (
        <div>No pricing available.</div>
      )}
    </div>
  );
}
