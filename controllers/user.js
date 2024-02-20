// Dependencies and Modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// User registration
module.exports.registerUser = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: hashedPassword,
      isAdmin: req.body.isAdmin
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      res.status(200).json(true); // Registration successful
    } else {
      res.status(500).json(false); // Registration failed
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json(false); // Registration failed due to an error
  }
};





// User authentication
module.exports.loginUser = (req, res) => {

	return User.findOne({email: req.body.email})
	.then(result => {

		// Check if user does not exist
		if (result == null) {

			return res.send(false);

		// If user exists
		} else {

			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			// Check if the passwords are the same
			if(isPasswordCorrect) {

				return res.send({ access: auth.createAccessToken(result) })

			} else {

				return res.send(false);
			}

		}
	})
	.catch(err => res.send(err));
}


// Retrieving User's details
module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id)
	.then(result => {

      result.password = " ";
			return res.send(result);
	})
	.catch(error => res.send(error));

}

// Retrieve User's Orders

module.exports.getUserOrders = (req, res) => {

    if(req.user.isAdmin) {

    return res.send("Action Forbidden");

  }

  return User.findById(req.user.id)
  .then(result => {

    return res.send(result.orders);

  })
  .catch(error => res.send(error));

}

// Controller function to update the user to admin
module.exports.updateUsertoAdmin = async (req, res) => {
  try {
    // Extract user ID from the request body
    const { userId } = req.body;

    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden. Admin privileges required.' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's role to admin
    user.isAdmin = true;

    // Save the updated user to the database
    await user.save();

    // Return success message
    return res.json({ message: 'User role updated to admin successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;



    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        'firstName': firstName,
        'lastName': lastName,
        'mobileNo': mobileNo
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await updatedUser.save();

    res.json(updatedUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id; // Access user ID directly from req.user

    const user = await User.findById(userId); // Find user by ID in your User model
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.imagePath = req.file.path; // Store the image path in the user object
    await user.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports.getImage = (req, res) => {

  const imageName = req.params.imageName; // Assuming the image name is passed in the route parameter

  // Get the absolute path to the image file
  const imagePath = path.join(__dirname, `./Images/${imageName}`); // Adjust the path as per your file structure

  // Send the image file as a response
  res.sendFile(imagePath);

  console.log(imagePath)
};
