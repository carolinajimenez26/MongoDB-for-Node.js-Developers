Suppose you have a MongoDB collection called school.grades that is composed
solely of these 20 documents (see data.json)

Assuming the variable db holds a connection to the school database in the following code snippet.

```
var cursor = db.collection("grades").find({});
cursor.skip(6);
cursor.limit(2);
cursor.sort({"grade": 1});
```

Which student's documents will be returned as part of a subsequent call to toArray()?
