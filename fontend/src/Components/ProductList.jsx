import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-bold text-xl">{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Price: ${product.price}</p>
            <p>Inventory: {product.inventory}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
