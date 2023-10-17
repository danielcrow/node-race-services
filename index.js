const express = require('express')
const race_model = require('./race_model')
const app = express()
const port = 3001

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  race_model.getSplits()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
}),

app.get('/results/:raceid', (req, res) => {
  console.log("HelloWOrld");
  let raceid =req.params.raceid
  if(raceid === "undefined" || raceid==="none"){
    raceid = 0
  }
  console.log(raceid)
  race_model.getResults(raceid)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/races', (req, res) => {

  race_model.getRaces()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
