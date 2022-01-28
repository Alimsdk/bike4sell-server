const express=require('express');
const cors=require('cors');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const uri = "mongodb+srv://bike4sell:dnu3b8dXYhuxzkwB@cluster0.ofdnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app=express();
const port=5000

app.use(cors())
app.use(express.json());

async function run(){
    try{
        await client.connect();
        const database=client.db("bike4sell");
        const bikesCollection=database.collection('bikes');
        const usersCollection=database.collection('users');
        const ordersCollection=database.collection('orders');


        app.get('/bikes',async(req,res)=>{
            const bikes= bikesCollection.find({});
            const result=await bikes.toArray();
            res.json(result);
        })

        app.get('/bikes/:id',async(req,res)=>{
            const id=req.params.id;
            const key=parseInt(id);
            const query = { id:key };
           const bike=await bikesCollection.findOne(query);
           res.json(bike);
        })

        app.post('/users',async(req,res)=>{
            const user=req.body;
           const result=await usersCollection.insertOne(user);
           res.json(result);
        })

        app.get('/users',async(req,res)=>{
            const users=usersCollection.find({});
            const result=await users.toArray();
            res.send(result);
        })

        app.put('/users',async(req,res)=>{
            const user=req.body;
            const filter={email:user.email}
            const options = { upsert: true };
            const updateDoc =   {$set: user}
            const result=await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result);
              
        })

        app.get('/users/:email',async(req,res)=>{
            const email=req.params.email;
            const query= { email : email}
           const user=await usersCollection.findOne(query);
           let isAdmin=false;
           if(user?.role==='admin'){
               isAdmin=true;
           }
           res.json({admin:isAdmin})
        })

        app.put('/users/admin',async(req,res)=>{
            const user=req.body;
            const filter={email:user.email}
            const updateDoc={$set:{role:'admin'}}
            const result=await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
        })

        app.post('/orders',async(req,res)=>{
            const orderDetail=req.body;
            const result=await ordersCollection.insertOne(orderDetail);
            res.json(result);
        })

        app.get('/orders',async(req,res)=>{        
            const orders=ordersCollection.find({})
            const result=await orders.toArray();
            res.send(result);
        })

        app.get('/orders/:email',async(req,res)=>{
            const email=req.params.email;
            const query={userEmail:email}
            const order=ordersCollection.find(query);
            const result=await order.toArray();
            res.send(result);
        })

        app.delete('/orders/:key',async(req,res)=>{
            const key=req.params.key;
           const query={_id:ObjectId(`${key}`)}
           const result=await ordersCollection.deleteOne(query);
           res.json(result);
        })
    }
    
    finally{

    }
}

run().catch(console.dir)

app.get('/',async(req,res)=>{
    res.send('Hello from Server');
})

app.listen(port,()=>{
    console.log('listening to port', port);
})


// dnu3b8dXYhuxzkwB