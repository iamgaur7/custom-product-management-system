<?php
/*
Plugin Name: Custom Product Management System
Description: Extends WooCommerce to manage product variants, inventory, and bulk pricing with custom REST API endpoints.
Version: 1.0
Author: Naveen Gaur
Text Domain: custom-product-management-system
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants for easy reference
define('CPMS_VERSION', '1.0');
define('CPMS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CPMS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include main API controller class
include_once CPMS_PLUGIN_PATH . 'includes/class-cpms-api-controller.php';

// Plugin activation and deactivation hooks
function cpms_activate() {
    // Any setup needed upon activation
}
register_activation_hook(__FILE__, 'cpms_activate');

function cpms_deactivate() {
    // Any cleanup needed upon deactivation
}
register_deactivation_hook(__FILE__, 'cpms_deactivate');
