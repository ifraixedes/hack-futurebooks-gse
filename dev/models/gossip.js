'use strict';

var _ = require('lodash');
var modelHelper = require('./_helper');

var _extend = _.extend;

module.exports = function (config) {
  function Gossip(data) {
    this.id = data.id || null;
    this.text = data.text
    this.location = data.location;
  }

  Gossip.prototype.toDataObject = function () {
    return {
      text: this.text,
      location: this.location
    };
  };

  Gossip.prototype.save = function () {
    var _this = this;
    var gossipData = _extend({}, baseGossipData)

    if (this.id) {
      gossipData.id = this.id;
    }

    if (this.timestamp) {
      gossipData.timestamp = this.timestamp;
    } else {
      gossipData.timestamp = Date.now();
    }

    gossipData.body = this.toDataObject();

    return db.create(gossipData)
      .then(modelHelper.dbResultFromInsertToData)
      .then(function (data) {
        _this.id = data.id;
        return { status: 'ok' };
      });
  };

  Gossip.findById = function (id) {
    return db.get(_extend({ id: id }, baseGossipData))
    .then(modelHelper.dbResultFromSingleDocument)
    .then(function (data) {
      return new Gossip(data);
    });
  }

  /**
   *
   * geo (Object)
   *    [distance] (number|string): distance radius in kilometers when number. Default 50km
   * */
  Gossip.findSome = function (text, geo, limit) {
    var queryObj = _extend({
      body: {
        filtered: {
          filter: {
            limit: limit || ('number' === typeof geo) ? geo : 10
          }
          //strategy: "leap_frog_filter_first"
        }
      }
    }, baseGossipData);
    var body =  queryObj.body.filtered;

    if (geo && geo.location) {
      switch (geo.distance) {
        case 'number':
          distance = geo.distance + 'km';
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
            lat: geo.location.lat,
            lon: geo.location.lon
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

    return db.search(queryObj)
    .then(modelHelper.dbResultFromSearchToData);
  };

  var baseGossipData = {
    index: 'books',
    type: 'gossip'
  };
  var db = config.db;
  return Gossip;
};
