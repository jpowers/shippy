const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    platform: {
      type: Sequelize.STRING, allowNull: false
    },
    platformId: {
      type: Sequelize.STRING, allowNull: false, unique: true
    }
  });
};
