const MongoClient = require('mongodb').MongoClient,
      assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/school', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  let cursor = db.collection('grades').find({});
  cursor.limit(2);
  cursor.skip(6);
  cursor.sort({"grade": 1});

  cursor.forEach(
    (doc) => {
      console.log(doc);
    },
    (err) => {
      assert.equal(err, null);
      return db.close();
    }
  );

});
