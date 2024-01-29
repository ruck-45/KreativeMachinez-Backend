const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "secrets", "rsaPrivKey.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

function issueJWT(userId, remember) {
  let expiresIn;
  if (typeof remember === "boolean") {
    expiresIn = remember ? "7d" : "1d"; // 7 days if remember is true, 1 day if false
  } else if (typeof remember === "string" && remember.endsWith("m")) {
    expiresIn = remember; 
  } 
  const payload = {
    uid: userId,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn: `${expiresIn}`, algorithm: "RS256" });

  return {
    token: signedToken,
    expires: expiresIn,
  };
}

module.exports = {
  issueJWT,
};
