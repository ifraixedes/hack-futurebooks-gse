'use strict';

var _ = require('lodash');

var _extend = _.extend;

function dbResultToData(dbResult) {
  return dbResult.hits.hits;
}

module.exports = function (config) {
  function Gossip(data) {
    this.text = data.text
    this.location = data.location;
  }

  Gossip.prototype.toDataObject = function () {
    return {
      text: this.text,
      location: this.location,
    };
  };

  Gossip.prototype.save = function () {
    var gossipData = _extend({}, baseGossipData)

    if (!this.id) {
      gossipData.id = this.id;
    }

    if (!this.timestamp) {
      gossipData.timestamp = this.timestamp;
    }

    gossipData.body = this.toDataObject();

    return db.create(gossipData)
      .then(function (dbResult) { 
        console.log(dbResult);
        return { status: 'ok' };
      });
  };

  Gossip.findById = function (id) {
    db.get(_extend({ id: id }, baseGossipData))
    .then(function (dbResult) {
      console.log(dbResult);
    });
  }

  /**
   *
   * [distance] (number|string): distance radius in kilometers when number. Default 50km
   * */
  Gossip.findSimilar = function (text, location, distance) {
    var queryObj = _extend({}, baseGossipData);
    var body;

    if (location) {
      queryObj.body = {
        filtered: {
          strategy: "leap_frog_filter_first"
        }
      };
      body = queryObj.body.filtered;

      switch (distance) {
        case 'number': 
          distance = distance + 'km';
          break;
        case 'string':
          break;
        default:
          distance = '50km';
      }

      body.filter = {
        geo_distance: {
          distance: distance,
          location: {
            lat: location.lat,
            lon: location.lon
          }
        }
      };
    }

    body.query = {
      fuzzy_like_this: {
        fields: ['text'],
        like_this: text,
        max_query_terms: 25
      }
    };

    db.search(queryObj)
    .then(function (dbResult) {
    });
  };

  var baseGossipData = {
    index: 'books',
    type: 'gossip'
  };
  var db = config.db;
  return Gossip;
};
