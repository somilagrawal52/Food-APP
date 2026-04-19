const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function createToken(user) {
  try {
    const payload = { id: user._id, email: user.email };
    if (!secret) {
      console.error("JWT secret is not set");
      return null;
    }
    return jwt.sign(payload, secret, { expiresIn: "1d" });
  } catch (error) {
    console.error("Error creating token:", error);
    return null;
  }
}

function validate(token) {
  try {
    if (!secret) {
      throw new Error("JWT secret is not set");
    }
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Error validating token:", error);
    // return null to allow callers to treat invalid token without crashing
    return null;
  }
}

module.exports = { createToken, validate };
