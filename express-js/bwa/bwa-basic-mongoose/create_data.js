const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db-mongoose', { useNewUrlParser: true, useUnifiedTopology: true });

const fruitScheme = new mongoose.Schema({
    name: String,
    rating: Number,
    riview: String
});

const Fruit = mongoose.model("Fruit", fruitScheme);

// const apple = new Fruit({
//     name: "Apple",
//     rating: 8,
//     riview: "Rasanya Manis"
// });

// apple.save(function(error){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Berhasil simpan buah apek");
//     }
// });

const kiwi = new Fruit({
    name: "Kiwi",
    rating: 9,
    riview: "Rasanya Manis"
});

const jeruk = new Fruit({
    name: "Jeruk",
    rating: 10,
    riview: "Rasanya Manis"
});

const pisang = new Fruit({
    name: "Pisang",
    rating: 8,
    riview: "Rasanya Manis"
});

Fruit.insertMany([kiwi, jeruk, pisang], function (error){
    if(error) {
        console.log(error);
    } else {
        mongoose.connection.close();
        console.log('berhasil insert many');
    }
});