// [SECTION]
const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");
const path = require('path');
const multer = require('multer');

const {verify, verifyAdmin} = auth;

// [SECTION] Routing Component
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

router.post('/upload', upload.single('image'), productController.uploadImage);

router.get('/images/:imageName', productController.getImage);



// [ROUTES]

// Route for creating a new product
router.post("/", verify, verifyAdmin, productController.addProduct);

// Route for retrieving all the product
router.get("/all-products", productController.getAllProducts);

// Route for retrieving all ACTIVE product
router.get("/active-products", productController.getAllActiveProducts);

// Route for retrieving a single product
router.get("/:productId", productController.getProduct);

// Route for updating a product (Admin)
router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

// Route for archiving a product (Admin)
router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route for activating a product (Admin)
router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Route to search for products by product name
router.post('/search', productController.searchProductsByName);

// Route to search for products by price range
router.post('/search-by-price-range', productController.searchByPriceRange);


// Route for retrieving products by category
router.get('/category/:category', productController.productByCategory);


module.exports = router;