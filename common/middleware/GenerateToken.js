/**
 * Project Name: Bug Analyzer
 * @Project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 29, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Contains functions to genereate and decode tokens for application.
 *
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 29, 2024        Initially Created
 * -----------------------------------------------------------------------------------
 */


let jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates a JWT token for the given data.
 *
 * @function
 * @param {string} data - The data for which the token is generated.
 * @returns {Promise<string>} - The generated JWT token.
 */
let GenerateToken = async function (data) {
  let payload = {
    data: data,
  };

  let secret = process.env.JWT_SECRET;
  let expiresIn = process.env.JWT_EXPIRES_IN;
  let token = jwt.sign(payload, secret, { expiresIn });

  return token;
};

/**
 * Decodes a JWT token and returns the decoded information.
 *
 * @function
 * @param {string} token - The JWT token to be decoded.
 * @returns {object} - The decoded information from the token.
 */
let DecodeToken = (token) => {
  let secret = process.env.JWT_SECRET;
  let decoded = jwt.verify(token, secret);
  return decoded;
};

module.exports = { GenerateToken, DecodeToken };