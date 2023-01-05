module.exports = function (app, db) {
  db.then((db) => {
    app.get('/api/secured/documents/:id/versions/', (req, res) => {
      res.send(db.get('versions'));
    });
  });
};
