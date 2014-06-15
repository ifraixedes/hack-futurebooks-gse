'use strict';

function dbResultFromSearchToData(dbResult) {
  return dbResult.hits.hits;
}

function dbResultFromInsertToData(dbResult) {
  var data = {
    id: dbResult._id,
  };

  if (dbResult.timestamp) {
    data.timestamp = dbResult.timestamp;
  }

  return data;
}

function dbResultFromSingleDocument(dbResult) {
  var key;
  var data = dbResultFromInsertToData(dbResult);

  for (key in dbResult._source) {
    data[key] = dbResult._source[key];
  }

  return data;
}

module.exports = {
  dbResultFromSearchToData: dbResultFromSearchToData,
  dbResultFromInsertToData: dbResultFromInsertToData,
  dbResultFromSingleDocument: dbResultFromSingleDocument
};
