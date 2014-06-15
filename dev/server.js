'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var elasticsearch = require('elasticsearch');
var appRoutesConfigurer = require('./routes');
var middlewares = require('./middlewares');

var server = null;

function start(config, callback) {
  var expressApp = express();
  var appRoutes = appRoutesConfigurer(config);

  server = http.createServer(expressApp);
  expressApp.engine('html', consolidate.swig);
  expressApp.set('view engine', 'html');
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.use(compression());
  expressApp.use(express.static(path.join(__dirname, 'public')));
  expressApp.use(bodyParser.urlencoded());
  expressApp.use(bodyParser.json());

  for (var route in appRoutes) {
    expressApp.use('/' + route, appRoutes[route]);
  }

  expressApp.use(middlewares.errorHandler);

  server.listen(config.port, config.ipAddress, function () {
    if (config.ipAddress) {
      console.info('Server running on port %s:%s', config.ipAddress, config.port);
    } else {
      console.info('Server running on port %s', config.port);
    }

    if (callback) {
      callback();
    }
  });
}

function stop(callback) {
  if (server) {
    server.close(callback);
    server = null;
  } else {
    if (callback) {
      callback();
    }
  }
}

function bootstrap(serverConfig, callback) {
  var key;
  var config = {};

  for (key in serverConfig) {
    config[key] = serverConfig[key];
  }

  config.rootPath = __dirname;
  config.db = elasticsearch.Client({ host: 'localhost:9200', log: 'trace' });
  start(config, callback);
}

module.exports = {
  start: bootstrap,
  stop: stop
};
