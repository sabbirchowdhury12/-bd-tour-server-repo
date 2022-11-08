const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //get data for limit 
        app.get('/limitServices', async (req, res) => {
            const cursor = Services.find({});
            const result = await cursor.limit(3).toArray();
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