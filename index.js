const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://alumni-association:JPGl8oVHhs6azlBv@cluster0.kw35307.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        console.log('db connected');
        const alumniCollection = client.db('alumniList').collection('alumnus');
        
    }
    

    

    finally{

    }
}
run().catch(console.dir);





app.get('/', (req,res)=>{
    res.send('running')
})



app.listen(port,()=>{
    console.log('listenning to port', port);
})