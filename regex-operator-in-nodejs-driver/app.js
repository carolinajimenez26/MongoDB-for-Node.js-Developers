const MongoClient = require('mongodb').MongoClient,
      commandLineArgs = require('command-line-args'),
      assert = require('assert');


const options = commandLineOptions();


MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  let query = queryDocument(options);
  let projection = projectionDocument(options);

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);

  let numMatches = 0;

  cursor.forEach(
    (doc) => {
      numMatches = numMatches + 1;
      console.log( doc );
    },
    (err) => {
      assert.equal(err, null);
      console.log("Our query was:" + JSON.stringify(query));
      console.log("Matching documents: " + numMatches);
      return db.close();
    }
  );

});


function queryDocument(options) {

  console.log(options);

  let query = {};

  if ("overview" in options) {
    query.overview = {"$regex": options.overview, "$options": "i"};
  }

  return query;

}


function projectionDocument(options) {

  let projection = {
    "_id": 0,
    "name": 1,
    "founded_year": 1,
    "overview": 1
  };

  return projection;
}


function commandLineOptions() {

  let cli = commandLineArgs([
    { name: "overview", alias: "o", type: String }
  ]);

  let options = cli.parse()
  if (Object.keys(options).length < 1) {
    console.log(cli.getUsage({
      title: "Usage",
      description: "You must supply at least one option. See below."
    }));
    process.exit();
  }

  return options;

}
