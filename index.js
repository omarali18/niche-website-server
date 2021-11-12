const express = require("express");
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;

// middel wire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6mz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log("database connected");
        const database = client.db("car-shop")
        const allCarsCollection = database.collection("allCars")
        const ordersCollection = database.collection("orders")
        const usersCollection = database.collection("users")

        // get all cars
        app.get("/allcars", async (req, res) => {
            const carLimit = parseInt(req.query.datalimit)
            const id = req?.query?.id
            const query = { _id: ObjectId(id) };
            const cursor = allCarsCollection.find({});
            let result
            if (id) {
                result = await allCarsCollection.findOne(query)
            }
            else if (!carLimit) {
                result = await cursor.toArray()
            }
            else {
                result = await cursor.limit(carLimit).toArray()
            }
            res.send(result)
        });
        // post user order
        app.post("/order", async (req, res) => {
            const order = req.body
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        })
        // post all users

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Data base connected")
});
app.listen(port, () => {
    console.log("Lostening to car seller bd to ", port);
})