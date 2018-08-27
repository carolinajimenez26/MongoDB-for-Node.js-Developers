const MongoClient = require('mongodb').MongoClient,
      assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  let query = {"permalink": {$exists: true, $ne: null}};
  let projection = {"permalink": 1, "updated_at": 1};

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort({"permalink": 1})

  let markedForRemoval = [];

  let previous = { "permalink": "", "updated_at": "" };
  cursor.forEach(
    (doc) => {

      if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
        markedForRemoval.push(doc._id);
      }

      previous = doc;
    },
    (err) => {

      assert.equal(err, null);

      let filter = {"_id": {"$in": markedForRemoval}};

      db.collection("companies").deleteMany(filter, (err, res) => {

        console.log(res.result);
        console.log(markedForRemoval.length + " documents removed.");

        return db.close();
      });
    }
  );

});
