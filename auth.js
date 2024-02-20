// Dependencies and Modules
const jwt = require("jsonwebtoken");

// Used in algorithm for encrypting our data which makes it difficult to decode
const secret = "EcommerceAPI";



// Token Creation
module.exports.createAccessToken = (user) => {


	// Payload - when the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	// Generate a JSON web toke using the sign() method
	// data is the payload
	// secret is use to hash/encrypt/secure properly
	// {} empty object is for options
	return jwt.sign(data, secret, {});
}

/*

NOTE:

-jwt are not meant to have sensitive data
-the purpose of jwt is to verify if the user is legit or not

*/

// Token Verification

// .verify is our middleware, this is like a gate to enter controllers
// "next" is a function , it will allow us to proceed to next function
module.exports.verify = (req, res, next) => {

	// "req.headers.authorization" to get the authorization provided in postman under Autorization  > Bearer Token
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	// Check if the token (JWT) exists
	if (typeof token === "undefined") {

		return res.send({ auth: "Failed. No Token"})
	} else {

		console.log(token);

		// The data that will be received from req.headers.authorization will be having a "Bearer " before the token
		token = token.slice(7, token.length);
		console.log(token);

		// secret is to verify that our token is legit
		// function will what happened next
		// decodedToken will contain payload
		jwt.verify(token, secret, function(err, decodedToken) {

			if(err) {

				return res.send({
					auth: "Failed",
					message: err.message
				})

			} else {

				console.log(decodedToken) //contains the data/payload from our token

				// this reassigning will be used later on in our controller
				// it can be accessed in the next middleware/controller like getProfile
				req.user = decodedToken;

				// next() will let us proceed to the next middleware/controller
				next();
			}
		});
	}
}


// IsAdmin Verification / Authorization

module.exports.verifyAdmin = (req, res, next) => {

	// Note: You can only have req.user for any middleware or controller that comes after verify
	if (req.user.isAdmin) {

		next();

	} else {


		return res.send({
			auth: "Failed",
			message: "Actionn Forbidden"
		})
	}
}

