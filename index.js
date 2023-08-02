const express = require("express");
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

// midleWare 
app.use(express.json());
app.use(cors());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50l1tkw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const taskListCollection = client.db("taskManagement").collection('taskList')
    // const taskListCollection = client.db("taskManagement").collection('taskList')
    // add task api

    app.post('/addJob', async (req, res) => {

      try {
        const item = req?.body;

        console.log("helo", item);
        const result = await taskListCollection?.insertOne(item)
        res.send(result)
      } catch (error) {
        // res.status(500).send({ error: true, message: 'Internal server error' });
        res.send(error)
      }
    })


    app.get('/all-taskList', async (req, res) => {

      try {
        const result = await taskListCollection.find().toArray()
        res.send(result)
      } catch (error) {
        res.send(error)
      }

    })


    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const result = await taskListCollection.deleteOne({ _id: new ObjectId(id) })
      res.send(result)
    })


    app.put("/update/:id", async (req, res) => {

      try {
        const id = req.params.id;
        const body = req.body;
        const query = { _id: new ObjectId(id) }
        const updateDoc = {
          $set: {
            title: body?.title,
            description: body?.description,

            status:body?.status,
            
            companyName: body?.companyName,
            jobType:body?.jobType

          }
        }

        const result = await taskListCollection.updateOne(query, updateDoc)
        res.send(result);
      } catch (error) {
        res.send(error)
      }
    })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("summer is running")
})

app.listen(port, () => {
  console.log(`server is runnig ${port}`);
})