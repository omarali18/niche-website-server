const express = require("express");
const { MongoClient } = require('mongodb');
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

        app.get("/allcars", async (req, res) => {
            const carLimit = parseInt(req.query.datalimit)
            const cursor = allCarsCollection.find({});
            let result
            if (!carLimit) {
                result = await cursor.toArray()

            }
            else {
                result = await cursor.limit(carLimit).toArray()
            }
            // console.log(limit);
            // const query = { runtime: { $lt: limit } };
            res.send(result)

        })
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