// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');



// Cross Origin Resource Sharing - it allow our backend app to be available and share resources to our frontend app, like routes etc.
const cors = require("cors");

// External Route
	// Users
	const userRoutes = require("./routes/user");

	// Products
	const productRoutes = require("./routes/product");
	
	// Orders
	const orderRoutes = require("./routes/order");

	// Cart
	const cartRoutes = require("./routes/cart");
	

// Environment Setup
const port = 4002;

// Server Setup
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Database Connection
mongoose.connect("mongodb+srv://killersheena123:admin123@cluster0.y3z25gg.mongodb.net/ecommerce?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."))

// Backend Routes

	// Users
	app.use("/b2/users", userRoutes);

	// Courses
	app.use("/b2/products", productRoutes);

	// Orders
	app.use("/b2/orders", orderRoutes);

	// Cart
	app.use("/b2/cart", cartRoutes);

	app.use('/b2/images', express.static(path.join(__dirname, './Images')));






// Server Gateway Response  
if(require.main === module) {
	app.listen(port, () => {
		console.log(`API is now online on port ${port}.`)
	})
}

module.exports = {app, mongoose};
