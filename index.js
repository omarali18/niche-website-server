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
        const reviewCollection = database.collection("reviews")

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

        app.post("/allcars", async (req, res) => {
            const newProduct = req.body
            const result = await allCarsCollection.insertOne(newProduct)
            console.log(result);
            res.json(result)
        })
        // post user order
        app.get("/order", async (req, res) => {
            const myOrder = req.query
            const query = { email: myOrder.myOrder }
            const result = await ordersCollection.find(query).toArray()
            res.send(result)
        })

        app.post("/order", async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        })





        app.delete("/order", async (req, res) => {
            const id = req.query.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })




        // post all users
        app.post("/users", async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(result);
            res.json(result)

        })
        app.put("/users", async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(query, updateDoc, options)
            console.log(result);
            res.json(result)

        });

        // add a review
        app.post("/review", async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            console.log(result);
            res.json(result)
        })
        app.get("/review", async (req, res) => {
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray()
            console.log(result);
            res.json(result)
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