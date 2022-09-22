const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.kw35307.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const alumniCollection = client.db('alumniList').collection('alumnus');
        const regCollection = client.db('regList').collection('regNumber');
        const jobCollection = client.db('joblist').collection('jobs')



        app.get('/alumnus', async (req, res) => {
            const query = {};
            const cursor = alumniCollection.find(query);
            const alumnus = await cursor.toArray();
            res.send(alumnus);
        });

        app.get('/reg-number', async (req, res) => {
            const query = {};
            const cursor = regCollection.find(query);
            const regNumber = await cursor.toArray();
            res.send(regNumber);
        });

        app.post('/register', async (req, res) => {
            const query = req.body;
            const cursor = await regCollection.find({}).toArray();
            const result = cursor.find(al => +al.alumni_registration_number === +query.regNumber)
            if (!result) {
                return res.send(false)
            }
            res.send(true)

        })

        app.post('/jobs', async (req, res) => {
            const jobs = req.body;
            const result = await jobCollection.insertOne(jobs);
            return res.send({ success: true, result })
        });

        app.get('/jobs', async (req, res) => {
            const query = {};
            const cursor = jobCollection.find(query);
            const jobs = await cursor.toArray();
            res.send(jobs);
        });


    }




    finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('running')
})



app.listen(port, () => {
    console.log('listenning to port', port);
})