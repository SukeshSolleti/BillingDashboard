const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    // Extract the token from the Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token payload to the request object
    req.user = decoded.user;

    // Call the next middleware in the chain
    next();
  } catch (error) {
    // Handle token verification errors
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
