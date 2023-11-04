import pgPromise from "pg-promise";
import "dotenv/config";
import express from "express";

const db = pgPromise()(process.env.DB_KEY);
const setupDb = () => {
  db.none(
    `CREATE TABLE IF NOT EXISTS planets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  ) `
  );
  db.none(`CREATE TABLE IF NOT EXISTS satellites (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )`);
  db.none(`CREATE TABLE IF NOT EXISTS planets_satellites (
    id SERIAL PRIMARY KEY,
    planet_id INT NOT NULL,
    satellite_id INT NOT NULL,
    FOREIGN KEY (planet_id) REFERENCES planets (id),
    FOREIGN KEY (satellite_id) REFERENCES satellites (id)
  )`);
  // db.none(`INSERT INTO planets (name) VALUES ('terra'), ('marte')`);
  // db.none(`INSERT INTO satellites (name) VALUES ('luna'),('luna2'),('luna3')`);
  const arrPlanets = ["Terra", "Marte"];
  const arrSatellites = ["Luna1", "Luna2", "Luna3"];

  const mapPianetsSatellites = {};

  arrPlanets.forEach((pianeta, index) => {
    const moon = arrSatellites.slice(index * 2, (index + 1) * 2);
    mapPianetsSatellites[pianeta] = moon;
  });

  console.log(mapPianetsSatellites);
};
setupDb();
console.log(db);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/getDb", async (req, res) => {
  const users = await db.none(`SELECT * FROM user`);
  res.send(JSON.stringify(users));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
