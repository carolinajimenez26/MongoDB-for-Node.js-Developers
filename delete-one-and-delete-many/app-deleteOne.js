const MongoClient = require('mongodb').MongoClient,
      assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  let query = {"permalink": {"$exists": true, "$ne": null}};
  let projection = {"permalink": 1, "updated_at": 1};

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort({"permalink": 1})

  let numToRemove = 0;

  let previous = { "permalink": "", "updated_at": "" };
  cursor.forEach(
    (doc) => {

      if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
          console.log(doc.permalink);

          numToRemove = numToRemove + 1;

          var filter = {"_id": doc._id};

          db.collection('companies').deleteOne(filter, (err, res) => {

            assert.equal(err, null);
            console.log(res.result);

          });

      }

      previous = doc;

    },
    (err) => {

      assert.equal(err, null);

    }
  );

});
