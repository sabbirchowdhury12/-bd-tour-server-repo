const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('hellow world');
});



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.6jo974x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});




async function run() {

    try {

    }
    finally {

    }
}

run().catch(error => console.log(error));










app.listen(port, () => {
    console.log('assignment site is running');
});