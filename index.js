const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hellow world');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.6jo974x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        const Services = client.db('bdTour').collection('services');
        const Reviews = client.db('bdTour').collection('reviews');

        //get data for limit 
        app.get('/limitServices', async (req, res) => {
            const cursor = Services.find({});
            const result = await cursor.limit(3).toArray();
            res.send(result);
        });

        //get all services data from db
        app.get('/services', async (req, res) => {
            const cursor = Services.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //get data by ID from db
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Services.findOne(query);
            res.send(result);
        });

        //get review data from client side
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await Reviews.insertOne(review);
            res.send(result);
        });

        //get review data from database
        app.get('/review', async (req, res) => {
            const cursor = Reviews.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(error => console.log(error));










app.listen(port, () => {
    console.log('assignment site is running');
});