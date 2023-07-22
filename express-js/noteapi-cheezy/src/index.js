const express = require('express');
const app = express();
const quotes = require('./quotes.json');
const userRouter = require('./routes/userRoutes');
const noteRouter = require('./routes/noteRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
// const fileupload = require('express-fileupload');

const mongoose = require('mongoose');
const employeeRouter = require('./routes/employeeRoutes');

dotenv.config();
// app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

app.use(cors());

app.use('/users', userRouter);
app.use('/note', noteRouter);
app.use('/employee', employeeRouter);
app.use('/uploads', express.static('uploads'))

// app.post('/upload', (req, res, next)=>{
//     console.log(req.files);
//     res.send({
//         success: true,
//         message: 'File uploaded'
//     })
// })

app.get('/', (req, res)=>{
    res.send('Notes API From CheezyCode');
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const PORT = process.env.PORT || 5000;
// const PORT =  5000;
//sad
// mongoose.connect('mongodb://localhost:27017/note_api')
// .then(()=>{
//     app.listen(PORT, ()=>{
//         console.log('Server started on port . ' + PORT);
//     });
// })
// .catch((error)=>{
//     console.log(error);
// })
mongoose.connect('mongodb+srv://admin:ip0uu1lkNZzxyW0R@cluster0.smftdru.mongodb.net/note_api', { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
.then(()=>{
    app.listen(PORT, ()=>{
        console.log('Server started on port . ' + PORT);
    });
})
.catch((error)=>{
    console.log(error);
})



// const uri = "mongodb+srv://admin:ip0uu1lkNZzxyW0R@cluster0.smftdru.mongodb.net/?retryWrites=true&w=majority";
// const client = mongoose(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("note_api").collection("users");
//   console.log(collection);
//   // perform actions on the collection object
//   client.close();
// });
