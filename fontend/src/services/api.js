import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://task.techwithnavi.com/wp-json/custom-shop/v1';

// Function to validate the product data
const validateProduct = (product) => {
  // Check if the product is an object and has the necessary fields
  if (!product || typeof product !== 'object') {
    console.warn('Invalid product structure:', product);
    throw new Error('Invalid product data');
  }

  // Check for required fields
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

      // Ensure response.data is an array of products
      if (!Array.isArray(response.data)) {
        console.error(
          'Expected response data to be an array of products',
          response.data
        );
        throw new Error('Invalid API response format');
      }

      // Filter and validate the products using the validateProduct function
      const filteredProducts = response.data.filter((product) => {
        try {
          return validateProduct(product); // Validate each product
        } catch (err) {
          console.warn('Invalid product data:', err.message);
          return false; // Exclude invalid products
        }
      });

      // Handle the case where no valid products are found
      if (filteredProducts.length === 0) {
        console.warn('No valid products found.');
      }

      // Map the valid products to the format required by your app
      const processedProducts = filteredProducts.map((product) => ({
        id: product.product_id,
        name: product.name || 'Unnamed Product', // Use a fallback name if it's missing
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

      // Return the processed products
      return {
        ...response,
        data: processedProducts,
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
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

  // Update bulk variants of products
  async updateBulkVariants(variants) {
    try {
      console.log('Updating variants:', variants);
      const validatedVariants = variants.map(validateProduct);

      const response = await axios.post(`${BASE_URL}/bulk-variant-update`, {
        variants: validatedVariants,
      });

      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateBulkVariants:', error);
      throw error;
    }
  },

  // Fetch the inventory status from the API
  async getInventoryStatus() {
    try {
      return await axios.get(`${BASE_URL}/inventory-status`);
    } catch (error) {
      console.error('Error in getInventoryStatus:', error);
      throw error;
    }
  },
};
