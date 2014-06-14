'use strict';

module.exports = function (config) {
  function Gossip(data) {
    this.text = data.text
    this.location = data.location;
    this.createdAt = new Date();
  }

  Gossip.prototype.save = function () {
    db.create({
      //index: 
    });
  };

  var db = config.db;
  return Gossip;
};
