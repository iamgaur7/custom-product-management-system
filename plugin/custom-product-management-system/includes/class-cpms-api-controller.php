<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}
class CPMS_API_Controller {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('custom-shop/v1', '/products', [
            'methods' => 'GET',
            'callback' => [$this, 'get_products'],
        ]);

        register_rest_route('custom-shop/v1', '/bulk-variant-update', [
            'methods' => 'POST',
            'callback' => [$this, 'bulk_variant_update'],
            //'permission_callback' => [$this, 'permissions_check']
        ]);

        register_rest_route('custom-shop/v1', '/inventory-status', [
            'methods' => 'GET',
            'callback' => [$this, 'get_inventory_status'],
            //'permission_callback' => [$this, 'permissions_check']
        ]);

        register_rest_route('custom-shop/v1', '/bulk-price-calculator', [
            'methods' => 'POST',
            'callback' => [$this, 'bulk_price_calculator'],
           // 'permission_callback' => [$this, 'permissions_check']
        ]);
    }

    function permissions_check() {
    	return current_user_can('read'); // Adjust permission as needed
	}

public function get_products() {
    $args = [
        'status' => 'publish',
        'limit'  => -1,
    ];

    $query = new WC_Product_Query($args);
    $products = $query->get_products();
    $response = [];

    foreach ($products as $product) {
        $product_data = [
            'product_id' => $product->get_id(),
            'name' => $product->get_name(),
            'variants' => [],
            'bulk_prices' => $this->get_bulk_prices($product) // Add bulk prices here
        ];

        if ($product->is_type('variable')) {
            $variations = $product->get_children();
            foreach ($variations as $variation_id) {
                $variant = wc_get_product($variation_id);
                $product_data['variants'][] = [
                    'variant_id' => $variant->get_id(),
                    'sku' => $variant->get_sku(),
                    'attributes' => $variant->get_attributes(),
                    'stock' => $variant->get_stock_quantity(),
                    'price' => $variant->get_price()
                ];
            }
        }

        $response[] = $product_data;
    }

    return new WP_REST_Response($response, 200);
}

public function get_bulk_prices($product) {
   global $wpdb;
    $bulk_discounts = [];

    // Check if the Discount Rules table exists (replace with actual table name if needed)
    $table_name = $wpdb->prefix . 'woo_discount_rules';

    // Query for bulk discount rules based on product ID
    $rules = $wpdb->get_results($wpdb->prepare("
        SELECT * FROM $table_name 
        WHERE product_id = %d 
        AND rule_type = %s
    ", $product->get_id(), 'bulk'), ARRAY_A);

    // Process each rule and add it to the bulk_discounts array
    foreach ($rules as $rule) {
        // Assuming `min_quantity` and `price` fields exist in the rule data
        $bulk_discounts[] = [
            'min_quantity' => $rule['min_quantity'],
            'price' => $rule['price']
        ];
    }

    return $bulk_discounts;
}

    public function bulk_variant_update($request) {
        $variants = $request->get_param('variants');
        $updated_variants = [];

        foreach ($variants as $variant_data) {
            $variant_id = $variant_data['variant_id'];
            $stock = $variant_data['stock'];
            $price = $variant_data['price'];

            $variant = wc_get_product($variant_id);
            if ($variant && $variant->is_type('variation')) {
                $variant->set_stock_quantity($stock);
                $variant->set_price($price);
                $variant->save();

                $updated_variants[] = [
                    'variant_id' => $variant_id,
                    'stock' => $stock,
                    'price' => $price
                ];
            }
        }

        return new WP_REST_Response(['status' => 'success', 'updated_variants' => $updated_variants], 200);
    }

    public function get_inventory_status() {
        $products = wc_get_products(['status' => 'publish', 'limit' => -1]);
        $inventory_status = [];

        foreach ($products as $product) {
            $inventory_status[] = [
                'product_id' => $product->get_id(),
                'name' => $product->get_name(),
                'stock' => $product->get_stock_quantity()
            ];
        }

        return new WP_REST_Response($inventory_status, 200);
    }

    public function bulk_price_calculator($request) {
        $bulk_prices = [];
        $variants = $request->get_param('variants');

        foreach ($variants as $variant_data) {
            $variant_id = $variant_data['variant_id'];
            $quantity = $variant_data['quantity'];

            $variant = wc_get_product($variant_id);
            if ($variant && $variant->is_type('variation')) {
                $base_price = $variant->get_price();
                $discounted_price = $this->calculate_bulk_price($base_price, $quantity);

                $bulk_prices[] = [
                    'variant_id' => $variant_id,
                    'quantity' => $quantity,
                    'bulk_price' => $discounted_price
                ];
            }
        }

        return new WP_REST_Response(['status' => 'success', 'bulk_prices' => $bulk_prices], 200);
    }

    private function calculate_bulk_price($base_price, $quantity) {
        if ($quantity >= 100) {
            return $base_price * 0.85;
        } elseif ($quantity >= 50) {
            return $base_price * 0.90;
        } elseif ($quantity >= 20) {
            return $base_price * 0.95;
        }
        return $base_price;
    }
}

new CPMS_API_Controller();