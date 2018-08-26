db.movieDetails.find({}, {title: 1, _id: 0}).pretty()
db.movieDetails.find({year: 1964}, {title: 1, _id: 0}).pretty()
