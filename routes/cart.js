// [SECTION]
const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");

const {verify, verifyAdmin} = auth;

// [SECTION] Routing Component
const router = express.Router();

// [ROUTES]

// Route for adding products to the cart
router.post('/add-to-cart', verify, cartController.addToCart);

// Route for retrieving cart
router.get('/', verify, cartController.getCart);

// Route for change for product quantities
router.put('/change-quantity', verify, cartController.changeQuantity);

// Route for removing products from cart
router.delete('/remove-from-cart', verify, cartController.removeProduct);

module.exports = router;