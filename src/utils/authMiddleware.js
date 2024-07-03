// const jwt = require("jsonwebtoken");
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return req.status(401).json({ message: "Unauthorized access" });
//   }

//   const token = authHeader.split(" ")[1]; //Bearer token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

// module.exports = verifyToken;
