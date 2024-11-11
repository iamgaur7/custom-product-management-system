import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ProductVariant({ product, onUpdateStock }) {
  console.log('Product:', product);

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="text-red-500">
        No variants available for this product.
      </div>
    );
  }

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [updatedStock, setUpdatedStock] = useState(selectedVariant.stock || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log('Product on update:', product); // Log on update

    setUpdatedStock(selectedVariant.stock || 0);
  }, [selectedVariant]);

  const handleVariantChange = (event) => {
    const selected = product.variants.find(
      (variant) => String(variant.id) === String(event.target.value)
    );
    if (selected) {
      setSelectedVariant(selected);
      setUpdateError(null);
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
    if (!product?.id) {
      setUpdateError('Product ID is missing');
      return;
    }

    if (updatedStock < 0) {
      setUpdateError('Please provide a valid stock value.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const response = await api.updateBulkVariants([
        {
          product_id: product.id,
          variant_id: selectedVariant.id,
          stock: updatedStock,
          sku: selectedVariant.sku,
        },
      ]);

      if (response && response.data) {
        onUpdateStock(product.id, selectedVariant.id, updatedStock);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setUpdateError('Failed to update stock. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-md">
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

      {/* Ensure Product ID is displayed */}
      <div className="text-sm text-gray-600 mb-2">
        Product ID: {product?.id || 'N/A'}
      </div>

      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Stock updated successfully!
        </div>
      )}

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
              {variant.attributes?.pa_size || 'Size N/A'} -{' '}
              {variant.attributes?.pa_color || 'Color N/A'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">SKU</label>
          <input
            type="text"
            value={selectedVariant.sku || 'N/A'}
            readOnly
            className="w-full px-3 py-2 border rounded-md text-gray-600"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            Unit Price
          </label>
          <input
            type="text"
            value={`$${parseFloat(selectedVariant.price || 0).toFixed(2)}`}
            readOnly
            className="w-full px-3 py-2 border rounded-md text-gray-600"
          />
        </div>

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
    </div>
  );
}
