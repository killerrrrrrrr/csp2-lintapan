// [SECTION] Modules and Dependencies
const Product = require("../models/Product");
const User = require("../models/User");
const path = require('path');




// Create new product
module.exports.addProduct = (req, res) => {

	const userId = req.user.id;

	let newProduct = new Product ({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		userId
			});

	// Saves the created object to our database
	return newProduct.save()
	.then((product, error) => {

		if(error){
			return res.send(false);
		} else {
			return res.send(true)
		}
	})
	.catch(err => res.send(err));

}

// Retrieve all products
module.exports.getAllProducts = (req, res) => {

	return Product.find({})
	.then(result => {
		return res.send(result);
	})
	.catch(err => res.send(err))

}


// Retrieve all ACTIVE products
module.exports.getAllActiveProducts = (req, res) => {

	return Product.find({isActive: true})
	.then(result => {

		return res.send(result);
	})
	.catch(err => res.send(err))
}


//Retrieving a specific Product
module.exports.getProduct = (req, res) => {

	return Product.findById(req.params.productId)
	.then(result => {
		return res.send(result);
	})
}

// Update a product
module.exports.updateProduct = (req, res) => {

	let updatedProduct = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category
	}

	// Syntax
		// findByIdAndUpdate(documentID, udpatesToBeApplied)
	return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
	.then((result, error) => {

		// Product not Updated
		if(error){
			return res.send(false);

		// Product updated successfully
		} else {
			return res.send(true);
		}
	})

}

// Archive a product
module.exports.archiveProduct = (req, res) => {


	let updateActiveField = {
		isActive: false
	}

	return Product.findByIdAndUpdate(req.params.productId,updateActiveField)
	.then((result, error) => {

		if(error) {

			return res.send(false);

		} else {

			return res.send(true);
		}
	})
	.catch(err => res.send(err));

}

// Activate a product
module.exports.activateProduct = (req,res) => {

	let updateActiveField = {
		isActive: true
	}

	return Product.findByIdAndUpdate(req.params.productId,updateActiveField)
	.then((result, error) => {

		if(error) {

			return res.send(false);

		} else {

			return res.send(true);
		}
	})
	.catch(err => res.send(err));

}


// Controller action to search for Products by Product name
module.exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller action to search for Products by price range
module.exports.searchByPriceRange = async (req, res) => {
  const { minPrice, maxPrice } = req.body;

  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.json({products});

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 


module.exports.uploadImage = 	 async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save imagePath to the product document in MongoDB
    const { productId } = req.body; // Assuming productId is sent from the frontend

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.imagePath = req.file.path; // Store the image path in the product object
    await product.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports.getImage = (req, res) => {

  const imageName = req.params.imageName; // Assuming the image name is passed in the route parameter

  // Get the absolute path to the image file
  const imagePath = path.join(__dirname, `./Images/${imageName}`); // Adjust the path as per your file structure

  // Send the image file as a response
  res.sendFile(imagePath);

  console.log(imagePath)
};


module.exports.productByCategory = (req, res) => {
  Product.find({ category: req.params.category })
    .then((result) => {
      if (!result || result.length === 0) {
        // If no products are found for the specified category
        return res.status(404).json({ message: 'No products found for this category' });
      }

      console.log(result);
      return res.status(200).json(result); // Sending the found products as a JSON response
    })
    .catch((err) => {
      console.error('Error finding products by category:', err);
      return res.status(500).json({ message: 'Internal server error' }); // Sending a generic error message for any unexpected errors
    });
};