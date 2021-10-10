const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const sensorRouter = require('./routes/sensor');

app.use(express.json());
app.use('/sensor', sensorRouter);

app.get('/', (req, res) => {
  res.send('<h1>MedPass API</h1> <h4>Message: Success</h4><p>Version: 1.0</p>');
})

app.get('/test', (req, res) => {
  res.send();
})

app.listen(port, () => {
  console.log('Demo app is up and listening to port: ' + port);
})