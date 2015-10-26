// initialize sequelize library with plugins and database connection settings
SLib = Npm.require("sequelize");

Sequelize = new SLib(
    Meteor.settings.connection.database,
    Meteor.settings.connection.username,
    Meteor.settings.connection.password,
    {
        host: Meteor.settings.connection.host,
        dialect: Meteor.settings.connection.dialect,

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

var sequelizeTransforms = Npm.require('sequelize-transforms');
sequelizeTransforms(Sequelize);