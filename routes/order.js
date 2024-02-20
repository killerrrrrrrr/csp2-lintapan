// [SECTION]
const express = require("express");
const orderController = require("../controllers/order");
const auth = require("../auth");

const {verify, verifyAdmin} = auth;

// [SECTION] Routing Component
const router = express.Router();

// [ROUTES]


// Route for user checkout (create order)
router.post('/checkout', verify, orderController.createOrder);

// Retrieve all orders
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

// Update order status
router.put('/:orderId', verify, orderController.updateOrder);

// Retrieve a single order
router.get('/:orderId',verify, orderController.getOrder);

// Retrieve orders by status 
router.get('/orderByStatus/:status',verify, orderController.orderByStatus);

// Retrieve orders by date
router.get('/order-by-date/:date', verify, orderController.getOrdersByDate);





module.exports = router;