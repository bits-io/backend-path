const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db-mongoose', { useNewUrlParser: true, useUnifiedTopology: true });

const fruitScheme = new mongoose.Schema({
    name: String,
    rating: Number,
    riview: String
});

const Fruit = mongoose.model("Fruit", fruitScheme);

Fruit.find(function(error, fruits){
    if(error) {
        console.log(error);
    } else {
        mongoose.connection.close();
        fruits.forEach(function(fruit){
            console.log(fruit.name);
        })
    }
});