const MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbName = 'video';

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  assert.equal(null, err);
  console.log("Successfully connected to server");
  // Find some documents in our collection
  db.collection('movies').find({}).toArray((err, docs) => {
    // Print the documents returned
    // console.log(docs);
    docs.forEach((doc) => {
        console.log(doc.title);
    });
    // Close the client
    client.close();
  });

  // Declare success
  console.log("Called find()");
});
