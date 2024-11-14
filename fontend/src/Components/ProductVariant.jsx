import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ProductVariant({ product, onUpdateStock }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : {}
  );
  const [updatedStock, setUpdatedStock] = useState(selectedVariant.stock || 0);
  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bulkPriceResults, setBulkPriceResults] = useState([]);

  useEffect(() => {
    setUpdatedStock(selectedVariant.stock || 0);
  }, [selectedVariant]);

  const handleVariantChange = (event) => {
    const selected = product.variants.find(
      (variant) => String(variant.id) === String(event.target.value)
    );
    if (selected) {
      setSelectedVariant(selected);
      setUpdateError(null);
      setShowSuccess(false);
    } else {
      setUpdateError('Invalid variant selected.');
    }
  };

  const handleStockChange = (e) => {
    const newStock = parseInt(e.target.value, 10) || 0;
    if (newStock < 0) {
      setUpdateError('Stock cannot be negative');
      return;
    }
    setUpdatedStock(newStock);
    setUpdateError(null);
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setShowSuccess(false);
    try {
      const response = await api.updateBulkVariants([
        {
          variant_id: selectedVariant.id,
          stock: updatedStock,
          price: parseFloat(selectedVariant.price).toFixed(2),
        },
      ]);

      if (response) {
        onUpdateStock(product.id, selectedVariant.id, updatedStock);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setUpdateError('Failed to update stock. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkPriceCalculate = async () => {
    try {
      const response = await api.calculateBulkPrice({
        variants: [{ variant_id: selectedVariant.id, quantity }],
      });

      if (response && response.status === 'success') {
        const newResult = {
          variant_id: selectedVariant.id,
          quantity,
          price: parseFloat(selectedVariant.price || 0).toFixed(2),
          bulk_price: response.bulk_prices[0].bulk_price,
        };

        setBulkPriceResults((prevResults) => [...prevResults, newResult]);
      }
    } catch (error) {
      console.error('Error calculating bulk price:', error);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-md">
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <div className="block text-sm font-medium text-gray-600 mb-2">
        Product ID: {product.id}
      </div>
      <div className="block text-sm font-medium text-gray-600 mb-2">
        Price : {`$${parseFloat(selectedVariant.price || 0).toFixed(2)}`}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Variant
        </label>
        <select
          value={selectedVariant.id || ''}
          onChange={handleVariantChange}
          className="w-full px-3 py-2 border rounded-md"
          disabled={isUpdating}
        >
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {/* {variant.attributes?.pa_size || 'Size N/A'} -{' '} */}
              {variant.attributes?.pa_color || 'Color N/A'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Stock</label>
          <input
            type="number"
            value={updatedStock}
            onChange={handleStockChange}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isUpdating}
          />
        </div>
      </div>

      {updateError && (
        <div className="text-sm text-red-500 mb-4">{updateError}</div>
      )}

      <button
        onClick={handleUpdateClick}
        disabled={isUpdating}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isUpdating ? 'Updating...' : 'Update Stock'}
      </button>

      {showSuccess && (
        <div className="text-green-500 mt-2">Stock updated successfully!</div>
      )}

      <div className="flex justify-between py-5">
        <div>
          <label className="text-sm font-medium text-gray-600">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isUpdating}
          />
        </div>
        <button
          onClick={handleBulkPriceCalculate}
          className="w-1/2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Bulk Price Calculate
        </button>
      </div>

      {bulkPriceResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Bulk Price Results</h4>
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Variant ID</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Unit Price</th>
                <th className="px-4 py-2 text-left">Bulk Price</th>
              </tr>
            </thead>
            <tbody>
              {bulkPriceResults.map((result, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{result.variant_id}</td>
                  <td className="border px-4 py-2">{result.quantity}</td>
                  <td className="border px-4 py-2">${result.price}</td>
                  <td className="border px-4 py-2">${result.bulk_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
