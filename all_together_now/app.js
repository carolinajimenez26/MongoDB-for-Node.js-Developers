const express     = require('express'),
      app         = express(),
      engines     = require('consolidate'),
      MongoClient = require('mongodb').MongoClient,
      assert      = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

const url = 'mongodb://localhost:27017/';
const dbName = 'video';

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', (req, res) => {

    db.collection('movies').find({}).toArray((err, docs) => {
        res.render('movies', { 'movies': docs } );
    });

  });

  app.use((req, res) => {
    res.sendStatus(404);
  });

  const server = app.listen(3000, () => {
    const port = server.address().port;
    console.log('Express server listening on port %s.', port);
  });

});
