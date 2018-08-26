db.movieDetails.find({"genres.0": { $eq: "Comedy" }, "genres.1": { $eq: "Crime" }, genres: { $size: 2 } }).count()
