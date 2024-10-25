import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]; 

  // Log the incoming request for better debugging
  console.log("Incoming request:", req.method, req.originalUrl);
  console.log("Token:", token); // Log the token

  // Check if token is present
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Verify token using the secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info to req object
    console.log("Token verified successfully:", decoded); // Log decoded user info
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Unauthorized - Token verification failed' });
  }
};

export { authenticateUser };
