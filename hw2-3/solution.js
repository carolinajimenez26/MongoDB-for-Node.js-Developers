db.movieDetails.find({"countries.1": { $eq: "Sweden" } }).count()
