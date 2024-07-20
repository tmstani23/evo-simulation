const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
app.use(cors()); 
app.use(bodyParser.json());

let creatures = []; // Array to hold creature data
let environment = {}; // Object to hold environment data

app.get('/start', (req, res) => {
  console.log('Received GET /start');
  res.send('Simulation started');
});

app.post('/update', (req, res) => {
  console.log('Received POST /update');
  res.json({ creatures, environment });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
