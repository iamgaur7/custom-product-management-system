import React, { useState } from 'react';
import axios from 'axios';

const VariantEditor = ({ products }) => {
  const [updatedVariants, setUpdatedVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBulkUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://task.techwithnavi.com/wp-json/custom-shop/v1/bulk-variant-update', {
        variants: updatedVariants,
      });
      alert('Variants updated successfully!');
    } catch (err) {
      setError('Error updating variants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Bulk Variant Editor</h2>
      <textarea
        className="w-full p-4 border rounded-md"
        rows="5"
        placeholder="Enter variant data in JSON format"
        onChange={(e) => setUpdatedVariants(e.target.value)}
      />
      <button
        onClick={handleBulkUpdate}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Variants'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default VariantEditor;
