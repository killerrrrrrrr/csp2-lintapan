const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	firstName: {
	type: String
	},
	lastName: {
		type: String
	},
	mobileNo: {
		type: String
	},
	address: {
		streetAddress: {
		type: String
		},
		city: {
		type: String
		},
		province: {
		type: String
		},
		zipCode: {
		type: String
		},
		country: {
		type: String
		}
	}, 
	email: {
		type: String,
		required: [true, "Email is required!"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "Password is required!"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	cart: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Cart'
		},
	orders: [{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Order'
}],
	imagePath: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);