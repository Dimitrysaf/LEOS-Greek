const { getUserFromAssertionHeader } = require('../util');

const TOKEN_LIFETIME = 3600; // seconds

module.exports = function (app, db) {
  db.then((db) => {
    app.get('/api/token', (req, res) => {
      const user = getUserFromAssertionHeader(req);
      if (!/^[\w.@-]{1,255}$/.test(user)) {
        return res.status(400).send('Invalid user identity');
      }
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

      res.json({
        accessToken,
        tokenType: 'jwt',
        expiresIn: Date.now() + TOKEN_LIFETIME * 1000,
        scope: null,
        state: null,
      });
    });
  });
};
