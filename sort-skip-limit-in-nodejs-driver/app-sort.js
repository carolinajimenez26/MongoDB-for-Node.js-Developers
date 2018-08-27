const MongoClient = require('mongodb').MongoClient,
      commandLineArgs = require('command-line-args'),
      assert = require('assert');


const options = commandLineOptions();


MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  let query = queryDocument(options);
  let projection = {"_id": 0, "name": 1, "founded_year": 1,
                    "number_of_employees": 1};

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);
  //cursor.sort({founded_year: -1});
  cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);

  let numMatches = 0;

  cursor.forEach(
    (doc) => {
      numMatches = numMatches + 1;
      console.log(doc.name + "\n\tfounded " + doc.founded_year +
                  "\n\t" + doc.number_of_employees + " employees");
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

  let query = {
    "founded_year": {
      "$gte": options.firstYear,
      "$lte": options.lastYear
    }
  };

  if ("employees" in options) {
    query.number_of_employees = { "$gte": options.employees };
  }

  return query;

}


function commandLineOptions() {

  let cli = commandLineArgs([
    { name: "firstYear", alias: "f", type: Number },
    { name: "lastYear", alias: "l", type: Number },
    { name: "employees", alias: "e", type: Number }
  ]);

  let options = cli.parse()
  if ( !(("firstYear" in options) && ("lastYear" in options))) {
    console.log(cli.getUsage({
      title: "Usage",
      description: "The first two options below are required. The rest are optional."
    }));
    process.exit();
  }

  return options;

}
