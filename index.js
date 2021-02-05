const ItchDB = require('./itch.db.js');
const config = {
  username: "QUIBBL",
  password: process.env.PASSWORD,
  project: "482581004",
  webserver: true,
  port: 8080
};
var database = new ItchDB.Database(config);
database.start();