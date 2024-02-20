## E-COMMERCE API DOCUMENTATION

***INSTALLATION COMMAND:***

```npm install```

***TEST ACCOUNTS:***
- Regular User:
    - email: user@gmail.com
    - pwd: user
- Admin User:
    - email: admin@gmail.com
    - pwd: admin
    

***ROUTES:***

USER:

- User registration (POST)
	- http://localhost:4000/users/register
    - auth header required: NO
    - request body: 
        - email (string)
        - password (string)
- User authentication (POST)
	- http://localhost:4000/users/login
    - auth header required: NO
    - request body: 
        - email (string)
        - password (string)
- Retrieve user details (GET)
    - http://localhost:4000/users/userDetails
    - auth header required: YES
    - request body: none
- Retrieve user orders (GET)
    - http://localhost:4000/users/myOrders
    - auth header required: YES
    - request body: none
- Set user to admin (Admin only) (PUT)
    - http://localhost:4000/users/setAsAdminn
    - auth header required: YES
    - request body: 
        - userId (string)
- Reset Passsword (PUT)
    - http://localhost:4000/users/reset-password
    - auth header required: YES
    - request body: 
        - newPassword (string)
- Update Profile information (PUT)
    - http://localhost:4000/users/profile
    - auth header required: YES
    - request body: 
        - firstName (string)
        - lastName (string)
        - mobileNo (string)
        - address (object):
            -streetAddress (string)
            -city (string)
            -province (string)
            -zipCode (string)
            -country (string)

PRODUCT:

- Create Product (Admin only) (POST)
	- http://localhost:4000/products/
    - auth header required: YES
    - request body: 
        - name (string)
        - description (string)
        - price (number)
- Retrieve all products (Admin only) (GET)
	- http://localhost:4000/products/all-products
    - auth header required: YES
    - request body: none
- Retrieve all active products (GET)
	- http://localhost:4000/products/active-products
    - auth header required: NO
	- request body: none
- Retrieve specific product (GET)
    - http://localhost:4000/products/:productId
    - auth header required: NO
    - request body: none
- Update a product (Admin only) (PUT)
    - http://localhost:4000/products/:productId
    - auth header required: YES
    - request body: 
        - name (string)
        - description (string)
        - price (number)
- Archive a product (Admin only) (PUT)
    - http://localhost:4000/products/:productId/archive
    - auth header required: YES
    - request body: none
- Activate a product (Admin only) (PUT)
    - http://localhost:4000/products/:productId/activate
    - auth header required: YES
    - request body: none
- Search product by name (POST)
    - http://localhost:4000/products/search
    - auth header required: NO
    - request body: 
        - name (string)
- Search product by price range (POST)
    - http://localhost:4000/products/search-by-price-range
    - auth header required: NO
    - request body: 
        - minPrice (number) 
        - maxPrice (number)   

CART:

- Add product to cart (POST)
    - http://localhost:4000/cart/add-to-cart
    - auth header required: YES
    - request body: 
        - productId (string) 
        - maxPrice (number)   
- Retrieve cart (GET)
    - http://localhost:4000/cart
    - auth header required: YES
    - request body: none
- Update product quantity (PUT)
    - http://localhost:4000/cart/change-quantity
    - auth header required: YES
    - request body:
        - productId (string)
        - quantity (number)
- Remove product from cart (DELETE)
    - http://localhost:4000/cart/remove-from-cart
    - auth header required: YES
    - request body:
        - productId (string)

ORDER:

- Create order (POST)
    - http://localhost:4000/orders/checkout
    - auth header required: YES
    - request body: 
        - shippingMethod (string)
        - orderStatus (string)
        - shippingFee (number)
        - shippingInformation (object):
            -streetAddress (string)
            -city (string)
            -province (string)
            -zipCode (string)
            -country (string)
- Retrieve all orders (Admin only) (GET)
    - http://localhost:4000/orders/all-orders
    - auth header required: YES
    - request body: none
- Update order status (Admin only) (PUT)
    - http://localhost:4000/orders/:orderId
    - auth header required: YES
    - request body:
        - orderStatus (string)
- Add tracking info (Admin only) (POST)
    - http://localhost:4000/orders/:orderId
    - auth header required: YES
    - request body:
        - trackingInformation (string)
- Retrieve an order (GET)
    - http://localhost:4000/orders/:orderId
    - auth header required: YES
    - request body: none
- Retrieve order by status (GET)
    - http://localhost:4000/orders/orderByStatus/:status
    - auth header required: YES
    - request body: none 
- Retrieve order by date (GET)
    - http://localhost:4000/orders/order-by-date/:date
    - auth header required: YES
    - request body: none