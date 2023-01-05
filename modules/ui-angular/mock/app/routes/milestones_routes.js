module.exports = function (app, db) {
  db.then((db) => {
    app.get('/api/proposals/milestones/', (req, res) => {
      res.send(db.get('milestones'));
    });
  });
};
