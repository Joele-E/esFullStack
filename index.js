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
  const arrPlanets = ["terra", "marte"];
  const arrSatellites = ["luna1", "luna2", "luna3"];

  // arrPlanets.forEach(el =>
  //   db.none(`INSERT INTO planets (name) VALUES ('${el}')`)
  // );

  // arrSatellites.forEach((el) =>
  //   db.none(`INSERT INTO satellites (name) VALUES ('${el}')`)
  // );

  const mapPianetsSatellites = {};

  const planetsId = [];
  const satId = [];

  arrPlanets.forEach((pianeta, index) => {
    const moon = arrSatellites.slice(index * 2, (index + 1) * 2);
    mapPianetsSatellites[pianeta] = moon;
    let planetId = null;
    let satelliteId = null;

    db.oneOrNone(`SELECT id FROM planets WHERE name=$1`, pianeta)
      .then((res) => {
        console.log(res);
        planetId = res;
      })
      .catch((err) => console.log(err));

    db.oneOrNone(`SELECT id FROM satellites WHERE name=$1`, moon)
      .then((res) => {
        console.log(res);
        satelliteId = res;
      })
      .catch((err) => console.log(err));

    if (planetId !== null && satelliteId !== null) {
      db.none(
        `INSERT INTO planets_satellites (planet_id, satellite_id) VALUES ($1, $2)`,
        [planetId, satelliteId]
      );
    }

    console.log(planetId);
  });

  console.log(mapPianetsSatellites);
  // arrPlanets.forEach((pianeta, index) => {
  //   const moon = arrSatellites.slice(index * 2, (index + 1) * 2);
  //   mapPianetsSatellites[pianeta] = moon;
  //   db.oneOrNone(`SELECT id FROM planets WHERE name=$1`, pianeta)
  //     .then((res) => {
  //       console.log(res);
  //       planetsId.push(res);
  //     })
  //     .catch((err) => console.log(err));
  // });
  // arrSatellites.forEach((sat) => {
  //   db.oneOrNone(`SELECT id FROM satellites WHERE name=$1`, sat)
  //     .then((res) => {
  //       console.log(res);
  //       satId.push(res);
  //     })
  //     .catch((err) => console.log(err));
  // });

  // console.log(mapPianetsSatellites);
};
setupDb();
// console.log(db);

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
