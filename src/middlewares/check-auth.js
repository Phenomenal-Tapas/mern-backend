import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const JWTPrivateKey = process.env.JWTPrivateKey;

  const bearerHeader = req.header("Authorization");

  if (!bearerHeader) {
    return res.status(401).json({
      status: 401,
      message: "Access Denied. No token provided.",
    });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Access Denied. No token provided.",
    });
  }

  try {
    // using jwt.verify to verify if it is a valid token
    const decoded = jwt.verify(token, JWTPrivateKey);

    // If email and userId does not exist on the token, throw an error
    if (typeof decoded !== "object" || !decoded.email || !decoded.userId) {
      throw {};
    }
    // returns the value of the jwt if the token is verified
    req.user = decoded;
    next();
  } catch (err) {
    next({
      statusCode: 403,
      customMessage: "Invalid token.",
    });
  }
};
