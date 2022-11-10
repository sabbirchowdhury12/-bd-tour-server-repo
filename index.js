const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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


//verify jwt
function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'unauthorized access' });
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {

    try {

        const Services = client.db('bdTour').collection('services');
        const Reviews = client.db('bdTour').collection('reviews');


        //token
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        });

        //get data for limit 
        app.get('/limitServices', async (req, res) => {
            const cursor = Services.find({}).sort({ date: -1 });
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

        //add a service 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await Services.insertOne(service);
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

        //review by data
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Reviews.findOne(query);
            res.send(result);
        });

        //update a review
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    tourist: review.tourist,
                    rating: review.rating,
                    message: review.message
                }
            };
            const result = await Reviews.updateOne(filter, updatedReview, option);
            res.send(result);
        });

        // review data filter by email
        app.get('/reviews', verifyJWT, async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                };
            }
            const cursor = Reviews.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        //delete a review 
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Reviews.deleteOne(query);
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