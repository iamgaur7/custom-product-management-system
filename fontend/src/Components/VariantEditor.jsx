import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BulkVariantUpdate = () => {
  const [variants, setVariants] = useState([]);

  // Fetch existing variants from WooCommerce (you may need an authenticated REST API call here)
  useEffect(() => {
    axios.get('https://task.techwithnavi.com/wp-json/custom-shop/v1/products', {
     /* headers: {
        Authorization: 'Bearer YOUR_ACCESS_TOKEN',
      },*/
    })
    .then(response => {
      setVariants(response.data);
    })
    .catch(error => {
      console.error("There was an error fetching the variants!", error);
    });
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubmit = () => {
    axios.post('https://yourdomain.com/wp-json/custom/v1/bulk-update-variants', {
      variants: variants.map(variant => ({
        id: variant.id,
        price: variant.price,
        stock: variant.stock_quantity,
      })),
    }, {
      headers: {
        Authorization: 'Bearer YOUR_ACCESS_TOKEN',
      },
    })
    .then(response => {
      alert("Variants updated successfully!");
    })
    .catch(error => {
      console.error("There was an error updating the variants!", error);
    });
  };

  return (
    <div>
      <h2>Bulk Variant Update</h2>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        {variants.map((variant, index) => (
          <div key={variant.id}>
            <h4>Variant {variant.id}</h4>
            <label>
              Price:
              <input
                type="number"
                value={variant.price || ''}
                onChange={(e) => handleInputChange(index, 'price', e.target.value)}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                value={variant.stock_quantity || ''}
                onChange={(e) => handleInputChange(index, 'stock_quantity', e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="submit">Update Variants</button>
      </form>
    </div>
  );
};

export default BulkVariantUpdate;
