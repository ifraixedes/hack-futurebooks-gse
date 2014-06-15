
var moment = require('moment');
var db = require('elasticsearch').Client({ host: 'localhost:9200', log: 'error' });
var books = require('./database-import');


books.forEach(function (book) {
  book.datePub = moment(book.datePub, 'MM/DD/YY').format('YYYY/MM/DD');
  db.create({
    index: 'books',
    type: 'book',
    body: book
  }).then(null, function (error) {
    console.log(book.isbn, book.datePub);
    console.error(error.message);
  });
});
