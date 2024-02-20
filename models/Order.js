const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({

	userId: {
			    type: mongoose.Schema.Types.ObjectId,
			    ref: 'User',
			    required: true
			  },
	email: {
    type: String,
    ref: 'User',
    required: true
  	},
	purchasedItems: {
		      items: [{
		          productId: {
		            type: mongoose.Schema.Types.ObjectId,
		            ref: 'Product',
		            required: true
		          },
		        name: {
		        	type: String
		        },
		        price: {
		        	type: Number
		        },
		        quantity: {
		          type: Number,
		          default: 1
		        },
		        itemSubtotal: {
		          type: Number,
		          default: 0
		        },
		        userId: {
		          type: mongoose.Schema.Types.ObjectId,
		          ref: 'User',
		        },
		        subShippingFee: {
		        	type: Number,
		        	default: 0
		        }
		        }],
		        subTotalAmount: {
		          type: Number,
		          default: 0
		        }
		    },
	purchasedOn: {
				type: Date,
				default: new Date()
			},
	 shippingInformation: {
					streetAddress: {
					type: String,
					required: [true, "Street is required!"]
					},
					city: {
					type: String,
					required: [true, "City is required!"]
					},
					province: {
					type: String,
					required: [true, "Province is required!"]
					},
					zipCode: {
					type: String,
					required: [true, "Zip Code is required!"]
					},
					country: {
					type: String,
					required: [true, "Country is required!"]
					},
					mobileNo: {
					type: String,
					required: [true, "Mobile No. is required!"]
					}
				},
	shippingMethod: String,
	shippingFee: Number,
	totalAmount: {
				type: Number,
				required: [true, "Total Amount is required"]
			},
	orderStatus: {
			   type: String,
			   enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
			   default: 'Processing'
			 },
	trackingInformation: String,
		});

module.exports = mongoose.model("Order", orderSchema);