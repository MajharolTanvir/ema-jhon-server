const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Middlewear
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvrae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emajhon').collection('product')

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const productCount = parseInt(req.query.productCount);
            const query = {};
            const cursor = productCollection.find(query)
            let products;
            if (page || productCount) {
                products = await cursor.skip(page * productCount).limit(productCount).toArray();
            }
            else {

                products = await cursor.toArray()
            }
            res.send(products)
        })

        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count })
        })
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            console.log(keys);
            const ids = keys.map(id => ObjectId(id))
            console.log(ids);
            const query = { _id: { $in: ids } }
            console.log(query);
            const cursor = productCollection.find(query)
            console.log(cursor);
            const products = await cursor.toArray()
            console.log(products);
            res.send(products)

        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('jhon can work', port);
})