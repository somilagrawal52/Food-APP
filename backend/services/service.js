const jwt = require("jsonwebtoken");

function getSecret() {
  return process.env.JWT_SECRET || "plateful_jwt_secret_secure_key_2026";
}

function createToken(user) {
  try {
    const payload = { id: user._id, email: user.email };
    const secret = getSecret();
    return jwt.sign(payload, secret, { expiresIn: "7d" });
  } catch (error) {
    console.error("Error creating token:", error);
    return null;
  }
}

function validate(token) {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
}

module.exports = { createToken, validate };
