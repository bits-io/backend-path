const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db-mongoose', { useNewUrlParser: true, useUnifiedTopology: true });

const fruitScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Data name tidak ada, isi dong']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    riview: String
});

const Fruit = mongoose.model("Fruit", fruitScheme);

const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Data name tidak ada, isi dong']
    },
    age: {
        type: Number
    },
    favoriteFruit: fruitScheme
});

const People = mongoose.model("People", peopleSchema);

const fruitDuku = new Fruit({
    name: "Apple",
    rating: 8,
    riview: "Rasanya Manis"
});

fruitDuku.save(function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("Berhasil simpan buah apek");
    }
});

const people = new People({
    name: "Dobith",
    age: 22,
    favoriteFruit: fruitDuku
});

people.save(function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("Berhasil create relationship dengan duku");
    }
});
