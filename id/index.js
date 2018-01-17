const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.get('/health', (req, res) => {
  res.status(200);
  res.end();
});

app.post('/', (req, res) => {
  const timeout = parseInt(req.query.timeout, 10) || 0;

  setTimeout(() => {
    res.json(req.body)
      .status(200)
      .end();
  }, timeout);
});

app.listen(3000);
