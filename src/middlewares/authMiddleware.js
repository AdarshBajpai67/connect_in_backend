// Desc: Middleware to authenticate user using JWT token
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticate = (req, res, next) => {
  //get jwt token from request header
  const token = req.headers.authorization;

  // console.log("Token received:", token); // Log the token received

  //check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    // Remove "Bearer " prefix from token
    const tokenWithoutBearer = token.split(" ")[1]; // Extract token after "Bearer" prefix

    // console.log("without bearer " + tokenWithoutBearer);

    //verify token
    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);

    // console.log("Decoded token:", decoded); // Log decoded token payload

    // console.log(`Token received: ${token}`);
    // console.log(`Decoded token: `, decoded); // Inspect structure and userID value
    // console.log(`Setting req.user to: ${decoded.userID}`);

    //set user in request object
    req.user = decoded.userID.toString();

    //move to next middleware
    next();
  } catch (err) {
    console.error(err);
    // console.log("Invalid token", token);
    return res.status(401).json({ message: "Invalid token" });
  }
};
