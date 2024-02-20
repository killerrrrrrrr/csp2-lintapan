const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	userId: {
			    type: mongoose.Schema.Types.ObjectId,
			    ref: 'User',
			    required: true
			  },
	name: {
		type: String,
		required: [true, "Course is required!"]
	},
	description: {
		type: String,
		required: [true, "Description is required!"]
	},
	price: {
		type: Number,
		required: [true, "Price is required!"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	imagePath: {
    type: String
  },
  category: {
    type: String
  },
	createdOn: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);