const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const proposalRoutes = require('./proposal_routes');
const milestoneRoutes = require('./milestones_routes');
const versionRoutes = require('./version_routes');

module.exports = function (app, db) {
  authRoutes(app, db);
  userRoutes(app, db);
  proposalRoutes(app, db);
  milestoneRoutes(app, db);
  versionRoutes(app, db);
};
