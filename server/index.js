import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017/");

let dbClient;

// app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
  if (err) return console.log(err);
  dbClient = client;
  app.locals.collection = client
    .db("kanalservis-test")
    .collection("test-collection");

  let items = [
    { date: "03.02.2022", name: "potato", quantity: 20, distance: 15 },
    { date: "11.08.2021", name: "cabbage", quantity: 18, distance: 22 },
    { date: "13.01.2022", name: "	carrot", quantity: 10, distance: 38 },
    { date: "23.12.2021", name: "	pear", quantity: 16, distance: 5 },
    { date: "12.06.2021", name: "	pumpkin", quantity: 12, distance: 12 },
    { date: "15.10.2021", name: "melon", quantity: 15, distance: 11 },
    { date: "28.02.2022", name: "	onion", quantity: 7, distance: 33 },
    { date: "30.03.2022", name: "grape", quantity: 5, distance: 28 },
    { date: "8.06.2021", name: "orange", quantity: 3, distance: 17 },
    { date: "01.05.2022", name: "apple", quantity: 6, distance: 25 },
    { date: "02.03.2022", name: "avocado", quantity: 8, distance: 6 },
    { date: "03.05.2022", name: "papaya", quantity: 10, distance: 30 },
  ];

  app.locals.collection.countDocuments(function (err, result) {
    if (err) {
      return console.log(err);
    }

    console.log(result);

    if (!result)
      app.locals.collection.insertMany(items, function (err, result) {
        if (err) {
          return console.log(err);
        }
        console.log(result);
        // console.log(items);
      });
  });

  app.listen(5000, function () {
    console.log("Сервер ожидает подключения...");
  });
});

app.get("/", function (req, res) {
  const collction = req.app.locals.collection;
  collction.find({}).toArray(function (err, items) {
    if (err) return console.log(err);
    res.send(items);
  });
});
