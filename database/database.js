const Sequelize = require("sequelize");

const connection = new Sequelize("guiapergunta", "root", "Redhot", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
