# Custom Product Management System

## Overview

The Custom Product Management System is a custom solution built to manage product-related functionalities within a WooCommerce-powered WordPress site. This repository consists of two main folders: `plugin` and `frontend`. The `plugin` folder contains a custom WordPress plugin that integrates with WooCommerce, while the `frontend` folder holds the frontend React.js application. Together, these components enable custom product management features and a streamlined user experience.

---

## Folder Structure

1. plugin: Contains the custom WordPress plugin.
2. frontend: Contains the React.js code for the frontend interface.

---

## Requirements

### Prerequisites
- WordPress installation (with WooCommerce plugin installed and activated)
- Node.js (for frontend installation)
- npm (Node Package Manager)

---

## Setup and Installation

### 1. Plugin Folder

The `plugin` folder contains the `custom-product-management-system` plugin, designed to be installed within WordPress.

#### Steps:
1. Ensure that you have WooCommerce installed and activated on your WordPress site.
2. Copy the `custom-product-management-system` folder to your WordPress installation's `wp-content/plugins` directory.
3. In the WordPress admin panel, navigate to Plugins > Installed Plugins.
4. Find the Custom Product Management System plugin and activate it.

### 2. Frontend Folder

The `frontend` folder contains the React.js files for the frontend interface of the Custom Product Management System. 

#### Steps:
1. Navigate to the `frontend` folder in the terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend in development mode:
   ```bash
   npm run dev
   ```

   This command starts the frontend application, allowing you to develop and test the user interface.

---

## Usage

1. Once both the plugin and frontend are installed, users can manage products directly within the WooCommerce section of the WordPress dashboard.
2. The React.js frontend provides an interface that connects with the backend through the WordPress REST API, allowing real-time updates to product information and management features.

---

## Contact

For further inquiries or support, please contact the repository maintainer or open an issue in this GitHub repository.

---

Thank you for using the Custom Product Management System!