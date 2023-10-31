import pgPromise from "pg-promise";
import "dotenv/config";
import express from "express";

const db = pgPromise()(process.env.DB_KEY);

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
