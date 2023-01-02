const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.kw35307.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    console.log("DB Connected");
    const alumniCollection = client.db("alumniList").collection("alumnus");
    const regCollection = client.db("regList").collection("regNumber");
    const jobCollection = client.db("joblist").collection("jobs");
    const photoCollection = client.db("photoList").collection("photos");
    const userCollection = client.db("userList").collection("users");
    const infoCollection = client.db("infoList").collection("infos");

    app.get("/alumnus", async (req, res) => {
      const query = {};
      const cursor = alumniCollection.find(query);
      const alumnus = await cursor.toArray();
      res.send(alumnus);
    });

    app.get("/alumnus/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const details = await alumniCollection.findOne(query);
      res.send(details);
    });

    app.get("/reg-number", async (req, res) => {
      const query = {};
      const cursor = regCollection.find(query);
      const regNumber = await cursor.toArray();
      res.send(regNumber);
    });

    app.post("/jobs", async (req, res) => {
      const jobs = req.body;
      const result = await jobCollection.insertOne(jobs);
      return res.send({ success: true, result });
    });

    app.get("/jobs", async (req, res) => {
      const query = {};
      const cursor = jobCollection.find(query);
      const jobs = await cursor.toArray();
      res.send(jobs);
    });

    app.post("/photos", async (req, res) => {
      const photos = req.body;
      const result = await photoCollection.insertOne(photos);
      return res.send({ success: true, result });
    });

    app.post("/register", async (req, res) => {
      const query = req.body;
      const cursor = await regCollection.find({}).toArray();
      const result = cursor.find(
        (al) => +al.alumni_registration_number === +query.regNumber
      );
      if (!result) {
        return res.send(false);
      } else {
        res.send({ success: true, result });
      }
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      return res.send({ result });
    });

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send({ admin: isAdmin });
    });

    app.put("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post("/info", async (req, res) => {
      const info = req.body;
      const result = await infoCollection.insertOne(info);
      return res.send({ result });
    });

    app.get("/info", async (req, res) => {
      const info = await infoCollection.find().toArray();
      res.send(info);
    });

    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    app.get("/photos", async (req, res) => {
      const query = {};
      const cursor = photoCollection.find(query);
      const photos = await cursor.toArray();
      res.send(photos);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running");
});

app.listen(port, () => {
  console.log("listenning to port", port);
});
