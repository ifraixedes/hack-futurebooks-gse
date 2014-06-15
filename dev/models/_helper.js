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

function gossipTextToBookFields(gossipText) {
  var authorRegExp = /(?:(?:author(?: is| was|:)?)|(?:by)) ([\w]*)/i;
  var match = null;
  var textLeft = gossipText;
  var queryFields = {};

  if (match = authorRegExp.exec(gossipText)) {
    queryFields.author = match[1];
    textLeft =  textLeft.replace(match[0], '');
  }

  if (Object.keys(queryFields).length === 0) {
    return null;
  } else {
    return {
      textLeft: textLeft || null,
      queryFields: queryFields
    }
  }
}

module.exports = {
  dbResultFromSearchToData: dbResultFromSearchToData,
  dbResultFromInsertToData: dbResultFromInsertToData,
  dbResultFromSingleDocument: dbResultFromSingleDocument,
  gossipTextToBookFields: gossipTextToBookFields
};
