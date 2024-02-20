// [SECTION] Modules and Dependencies
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");


// Controller for user checkout (create order)

const Cart = require('../models/Cart'); // Import Cart model

module.exports.createOrder = async (req, res) => {
  try {
    const {
      subShippingFee,
      shippingInformation,
      shippingMethod,
      shippingFee,
      orderStatus
    } = req.body;


    const userId = req.user.id;
    const email = req.user.email;

    // Fetch the user's cart with all cart items
    const userCart = await Cart.findOne({ user: userId }).populate('items.productId');

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return res.status(404).json({ error: 'Cart not found or cart is empty' });
    }

    // Calculate the total amount based on the prices of products in the cart and shipping fee
    let totalAmount = shippingFee + userCart.subTotalAmount;

    // Extract purchased items from the user's cart
    const purchasedItems = {
      items: userCart.items.map(cartItem => ({
        userId: cartItem.userId,
        productId: cartItem.productId._id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        itemSubtotal: cartItem.itemSubtotal,
        subShippingFee: req.body.subShippingFee
      })),
      subTotalAmount: userCart.subTotalAmount
    };

    // Create an order object
    const newOrder = new Order({
      userId,
      email,
      purchasedItems,
      totalAmount,
      purchasedOn: new Date(),
      orderStatus,
      shippingInformation,
      shippingMethod,
      shippingFee
    });

    

    // Save the order
    await newOrder.save();

    // Remove the cart after placing the order
    await Cart.deleteOne({ user: userId });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { orders: newOrder.id }, $set: { cart: null } },
      { new: true }
    );


    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all orders (admin only)
module.exports.getAllOrders = (req, res) => {

  return Order.find({})
  .then(result => {
     res.send(result);
  })
   .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });

}


// Controller function to update the regular user's order status as an admin
module.exports.updateOrder = async (req, res) => {
   try {

    const { orderId } = req.params;

    const { orderStatus,
            trackingInformation
          } = req.body;


    const validOrderStatusValues = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validOrderStatusValues.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value.' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId,
      { $set: { 
        orderStatus: orderStatus,
        trackingInformation: trackingInformation
         } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(updatedOrder);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



// Get a specific order
module.exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(404).json({ message: 'Order ID not provided' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get order by status
module.exports.orderByStatus = (req, res) => {
  const { status } = req.params; 

  Order.find({ orderStatus: status }) 
    .then(result => {
      return res.status(200).json({ orders: result });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    });
};


// Get order by date
module.exports.getOrdersByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    const orders = await Order.find({
      purchasedOn: { $gte: startDate, $lte: endDate }
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified date.' });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

