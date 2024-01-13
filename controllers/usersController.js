// Local Files
const { genHashPassword, validatePassword } = require("../utils/password");
const { issueJWT } = require("../utils/jwt");
const { executeQuery } = require("../utils/database");
const { insertUserDetails, findUserEmail } = require("../constants/queries");

const genUid = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (5 digits)
  const randomComponent = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  // Counter Component - Resets every Day
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const userId = timestampComponent + randomComponent + counterComponent;

  return userId;
};

/**
 *
 * username : maximum char - 50
 * email : maximum char - 100
 *
 */

const createUser = async (req, res) => {
  const { username, email, password, registerCounter } = req.body;

  // Return If Partial Information Provided
  if (username === undefined || email === undefined || password === undefined) {
    return res.status(206).json({ success: false, message: "Partial Content Provided" });
  }

  // Return If Data Exceeds Length
  if (username.length > 50 || email.length > 100) {
    return res.status(406).json({ success: false, message: "Data Not Acceptable" });
  }

  // Hash Password generation
  const { salt, hashPassword } = genHashPassword(password);

  // User Id generation
  const userId = genUid(registerCounter);

  // Insert Into Database
  const details = [userId, username, salt, hashPassword, email];
  const qreryRes = await executeQuery(insertUserDetails, details);

  // Return If Creation Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, message: qreryRes.result });
  }

  return res.status(201).json({ success: true, message: "User Creation Successful" });
};

/**
 *
 * email : maximum char - 100
 * remember : Boolean
 *
 */

const loginUser = async (req, res) => {
  const { email, password, remember } = req.body;

  // Return If Partial Information Provided
  if (email === undefined || remember === undefined || password === undefined) {
    return res.status(206).json({ success: false, message: "Partial Content Provided" });
  }

  // Return If Data Exceeds Length
  if (email.length > 100) {
    return res.status(406).json({ success: false, message: "Data Not Acceptable" });
  }

  // Search User In Database
  const qreryRes = await executeQuery(findUserEmail, [email]);
  const userDetails = qreryRes.result[0];

  // Return If Query Unsuccessful
  if (userDetails.length === 0) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  // Extracting user Details
  const userId = userDetails[0].user_id;
  const salt = userDetails[0].password_salt;
  const hashPassword = userDetails[0].password_hash;

  // Validating Password
  const passwordValidity = validatePassword(password, hashPassword, salt);

  // Return If Invalid Password
  if (!passwordValidity) {
    return res.status(400).json({ success: false, message: "Invalid Password" });
  }

  // Issue JWT
  const jwt = issueJWT(userId, remember);
  
  return res.status(201).json({ success: true, message: { message: "User Authenticated Successfully", ...jwt } });
};

module.exports = {
  createUser,
  loginUser,
};