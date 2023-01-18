const { getUserFromAssertionHeader } = require('../util');

const TOKEN_LIFETIME = 3600; // seconds

module.exports = function (app, db) {
  db.then((db) => {
    app.get('/api/token', (req, res) => {
      const user = getUserFromAssertionHeader(req);
      const iat = Math.round(Date.now() / 1000);
      const exp = iat + TOKEN_LIFETIME;
      const accessToken = [
        { typ: 'JWT', alg: 'HS256' },
        { aud: null, nbf: iat, iss: 'LeosApiId', exp, iat, user },
        '<SIGNATURE>',
      ]
        .map((p) => JSON.stringify(p))
        .map((p) => Buffer.from(p).toString('base64'))
        .join('.');

      res.send({
        accessToken,
        tokenType: 'jwt',
        expiresIn: Date.now() + TOKEN_LIFETIME * 1000,
        scope: null,
        state: null,
      });
    });
  });
};
