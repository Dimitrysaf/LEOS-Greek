module.exports = {
  getUserFromAuthorizationHeader,
  getUserFromAssertionHeader,
  getUserFromToken,
  parseJwt,
};

/**
 * @param {{headers: {authorization: string}}} req
 * @returns {string}
 */
function getUserFromAuthorizationHeader(req) {
  const token = req.headers.authorization?.split(' ')[1];
  return getUserFromToken(token);
}

/**
 * @param {{headers: {assertion: string}}} req
 * @returns {string}
 */
function getUserFromAssertionHeader(req) {
  const token = req.headers.assertion;
  return getUserFromToken(token);
}

/** @param {string} token */
function getUserFromToken(token) {
  return token ? parseJwt(token).user : 'jane';
}

/**
 * @param {string} token
 * @returns {{ aud: null, nbf:number, iss: string, exp: number, iat: number, user: string }}
 */
function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
