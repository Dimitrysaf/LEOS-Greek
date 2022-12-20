const User = require('../models/user');
const uuid = require('uuid');
const fetch = require('node-fetch');

module.exports = function (app, db) {
  db.then((db) => {
    app.get('/api/user-details', (req, res) => {
      res.send(db.get('user-details'));
    });

    app.get('/api/users', (req, res) => {
      res.send(db.get('users'));
    });

    app.get('/api/secured/users/searchUsers', (req, res) => {
      const users = db
        .get('users.users')
        .filter((user) =>
          user.fullName.toLowerCase().startsWith(req.query.name.toLowerCase()),
        )
        .value();
      if (users) {
        res.send(users);
      } else {
        res.sendStatus(404);
      }
    });

    app.post('/api/users', (req, res) => {
      db.get('users')
        .push({ ...User, ...req.body, ...{ id: uuid.v1() } })
        .last()
        .write()
        .then((user) => res.send(user));
    });

    app.post('/api/listProposals', (req, res) => {
      const proposals = db.get('proposals').value();
      res.send({ proposals, proposalCount: proposals.length });
    });
  });
};
