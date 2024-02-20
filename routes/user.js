// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");
const path = require('path');
const multer = require('multer');

// Destructure the verify and verifyAdmin from auth
const { verify, verifyAdmin } = auth;


// Routing component 
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/upload',verify, upload.single('image'), userController.uploadImage);

router.get('/images/:imageName', userController.getImage);


// Routes

// Route for user registration
router.post("/register", userController.registerUser)

// Route for user authentication
router.post("/login", userController.loginUser);

// Route for retrieving user's details
router.get("/userDetails", verify, userController.getProfile);

// Retrieve user's orders
router.get('/myOrders', verify, userController.getUserOrders)

// Update user into admin route
router.put('/setAsAdminn', verify, verifyAdmin, userController.updateUsertoAdmin);

// Route for resetting the password
router.put('/reset-password', verify, userController.resetPassword);

// Update user profile route
router.put('/profile', verify, userController.updateProfile);



module.exports = router;