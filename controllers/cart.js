// [SECTION] Modules and Dependencies
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");




// Add a product to the cart
module.exports.addToCart = async (req, res) => {
  try {
    
    const { name, price, productId, quantity, userId } = req.body;

    if (!productId || !quantity || !name || !price || !userId) {
      return res.status(400).json({ error: 'Missing required fields in the request body' });
    }

    // Fetch the product based on the productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Check if the product already exists in the cart
    const existingItemIndex = cart ? cart.items.findIndex(item => item.productId.equals(productId)) : -1;


    if (existingItemIndex !== -1) {
      // If the product exists, update its quantity and subtotal
      cart.items[existingItemIndex].quantity += quantity || 1;
      cart.items[existingItemIndex].itemSubtotal = product.price * cart.items[existingItemIndex].quantity;
    } else {
      // If the product is not in the cart, add it as a new item
      const newItem = {
        name: name,
        price: price,
        productId: product._id,
        quantity: quantity || 1,
        itemSubtotal: product.price * (quantity || 1),
        userId: userId
      };

      if (!cart) {
        cart = new Cart({ user: req.user.id, items: [newItem] });
      } else {
        cart.items.push(newItem);
      }
    }

    cart.subTotalAmount = cart.items.reduce((total, item) => total + item.itemSubtotal, 0);
    await cart.save();

    const customerId = req.user.id;
    const user = await User.findByIdAndUpdate(customerId, { cart: cart._id  }, { new: true })
   

    return res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCart = await Cart.findOne({ user: userId }) // Find the cart associated with the user ID

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

     const populatedItems = await Promise.all(userCart.items.map(async (item) => {
      const product = await Product.findById(item.productId, 'name price userId');
      return {
        ...item.toObject(),
        name: product.name,
        price: product.price,
        userId: product.userId
      };
    }));

userCart.items = populatedItems;


    return res.status(200).json( userCart ); // Sending the cart retrieved from the database
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Change product quantity in the cart
module.exports.changeQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate the quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity provided' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (existingItemIndex !== -1) {
        // If the product exists, update its quantity and subtotal
        const product = await Product.findById(productId); // Assuming you have a Product model
        if (product) {
          cart.items[existingItemIndex].quantity = quantity;
          cart.items[existingItemIndex].itemSubtotal = product.price * quantity;
        } else {
          return res.status(404).json({ message: 'Product not found' });
        }
      } else {
        // Product not found in the cart, you might want to handle this case
        return res.status(404).json({ message: 'Product not found in the cart' });
      }

      // Update subtotalAmount in the cart
      cart.subTotalAmount = cart.items.reduce((total, item) => total + item.itemSubtotal, 0);

      // Save the updated cart
      await cart.save();

      const userId = req.user.id;
      const user = await User.findByIdAndUpdate(userId, { cart }, { new: true })

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Quantity updated successfully', cart });
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};





// Remove product from the cart
module.exports.removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Validate productId
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const cartItem = await Cart.findOne({ user: userId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product in the cart's items array
    const productIndex = cartItem.items.findIndex(item => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the items array based on its index
    cartItem.items.splice(productIndex, 1);

    // If no items left in the cart, delete the cart
    if (cartItem.items.length === 0) {
      await Cart.findOneAndDelete({ user: userId });
      // Also remove the cart reference from the user document
      await User.findByIdAndUpdate(userId, { cart: null });
      return res.status(200).json({ message: 'Product removed from cart and cart deleted' });
    }

    // Recalculate subtotal or any other necessary updates to the cart
    // For example, updating subTotalAmount:
    cartItem.subTotalAmount = cartItem.items.reduce((total, item) => total + item.itemSubtotal, 0);

    // Save the changes to the cart
    await cartItem.save();

    // Update the user's cart
    const user = await User.findByIdAndUpdate(userId, { cart: cartItem }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Product removed from cart', cart: cartItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};
