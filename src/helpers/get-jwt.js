import jwt from "jsonwebtoken";

export const getJWT = async (payload) => {
  console.log(`Generating JWT for payload ${JSON.stringify(payload)}`);

  const JWTPrivateKey = process.env.JWTPrivateKey;
  // Create a payload using the secret key and set the validity of 2h
  const jwtToken = jwt.sign(payload, JWTPrivateKey, {
    expiresIn: "2h",
  });
  return jwtToken;
};
