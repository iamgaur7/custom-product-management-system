import React from 'react';

const InventoryStatus = ({ data }) => {
  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Inventory Status</h2>
      <p>Items in stock: {data.inStock}</p>
      <p>Items out of stock: {data.outOfStock}</p>
      <p>Total products: {data.totalProducts}</p>
    </div>
  );
};

export default InventoryStatus;
