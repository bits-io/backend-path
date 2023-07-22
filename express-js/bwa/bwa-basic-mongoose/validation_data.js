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

const apple = new Fruit({
    name: "Mangga",
    rating: 10,
    riview: "Rasanya Manis"
});

apple.save(function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("Berhasil simpan buah apek");
    }
});
