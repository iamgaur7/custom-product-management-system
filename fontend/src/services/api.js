import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://task.techwithnavi.com/wp-json/custom-shop/v1';

// Function to validate the product data
const validateProduct = (product) => {
  if (!product || typeof product !== 'object') {
    console.warn('Invalid product structure:', product);
    throw new Error('Invalid product data');
  }

  if (!product.product_id || !product.variants) {
    console.warn('Missing required fields:', product);
    throw new Error('Product ID and variants are required');
  }

  return product;
};

// Main API object to handle various requests
export const api = {
  // Fetch products from the API
  async getProducts() {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      console.log('Raw API Response:', response.data);

      if (!Array.isArray(response.data)) {
        console.error('Expected response data to be an array of products');
        throw new Error('Invalid API response format');
      }

      const filteredProducts = response.data.filter((product) => {
        try {
          return validateProduct(product);
        } catch (err) {
          console.warn('Invalid product data:', err.message);
          return false;
        }
      });

      if (filteredProducts.length === 0) {
        console.warn('No valid products found.');
      }

      const processedProducts = filteredProducts.map((product) => ({
        id: product.product_id,
        name: product.name || 'Unnamed Product',
        variants: Array.isArray(product.variants)
          ? product.variants.map((variant) => ({
              id: variant.variant_id || Math.random().toString(36).substr(2, 9),
              sku: variant.sku || 'N/A',
              stock:
                variant.stock !== null && variant.stock !== undefined
                  ? parseInt(variant.stock, 10)
                  : 0,
              price: variant.price
                ? parseFloat(variant.price).toFixed(2)
                : '0.00',
              attributes: variant.attributes || {},
            }))
          : [],
      }));

      return { ...response, data: processedProducts };
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  // Fetch the inventory status from the API
  async getInventoryStatus() {
    try {
      const response = await axios.get(`${BASE_URL}/inventory-status`);

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid inventory status response');
      }

      return response.data; // Return the valid data
    } catch (error) {
      console.error('Error in getInventoryStatus:', error);
      throw error;
    }
  },

  // Calculate bulk price for products based on certain criteria
  async calculateBulkPrice(data) {
    try {
      console.log('Bulk Price Request Data:', data);
      const response = await axios.post(
        `${BASE_URL}/bulk-price-calculator`,
        data
      );
      console.log('Bulk Price Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in calculateBulkPrice:', error);
      throw error;
    }
  },

  async updateBulkVariants(variants) {
    try {
      console.log('Updating variants:', variants);
      const response = await axios.post(`${BASE_URL}/bulk-variant-update`, {
        variants,
      });
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateBulkVariants:', error);
      throw error;
    }
  },
};
