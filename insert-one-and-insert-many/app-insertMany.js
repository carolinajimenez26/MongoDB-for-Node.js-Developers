const MongoClient = require('mongodb').MongoClient,
      Twitter = require('twitter'),
      assert = require('assert');


require('dotenv').load();
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


MongoClient.connect('mongodb://localhost:27017/social', (err, db) => {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  let screenNames = ["Marvel", "DCComics", "TheRealStanLee"];
  let done = 0;

  screenNames.forEach((name) => {

      let cursor = db.collection("statuses").find({"user.screen_name": name});
      cursor.sort({ "id": -1 });
      cursor.limit(1);

      cursor.toArray((err, docs) => {
        assert.equal(err, null);

        let params;
        if (docs.length == 1) {
          params = { "screen_name": name, "since_id": docs[0].id, "count": 10 };
        } else {
          params = { "screen_name": name, "count": 10 };
        }

        client.get('statuses/user_timeline', params, (err, statuses, response) => {

          assert.equal(err, null);

          db.collection("statuses").insertMany(statuses, (err, res) => {

            console.log(res);

            done += 1;
            if (done == screenNames.length) {
              db.close();
            }

          });
        });
      })
  });
});
