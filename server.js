const express = require("express");
const app = express();

app.use(express.json());

app.listen(process.env.PORT, 5000, () => console.log("API running on " + process.env.PORT + ":" + 5000));

app.get("/api/sensor", (req, res) => {
  res.status(200).send({
    msg: 12345
  });
});

app.post("/api/sensor/data", (req, res) => {
  const { key, temp, hum, status } = req.body;

  if (!key) {
    res.status(418).send({ msg: "418 I'm a teapot" });
  }

  if (status == 404) {
    res.status(404).send({ msg: "404 Failed to read sensor" });
  }
  if (status == 400) {
    res.status(400).send({ msg: "400 Invalid sensor readings" });
  }
  if ((key, temp, hum)) {
    res.status(200).send({
      key: key,
      temp: temp,
      hum: hum,
    });
    /*try {
    contract(key, temp);
  } catch(error) {
    console.log(error);
  }*/
  }
});
