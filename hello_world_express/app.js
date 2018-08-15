var express = require('express'),
    app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use((req, res) => {
  res.sendStatus(404);
});

var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Express server listening on port %s', port);
});
