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

//UPDATE
// Fruit.updateOne({ _id: '62f66d1deca5ecaa23389421'}, { name: 'Nanas' }, function(error){
//     if(error){
//         console.log(error);
//     } else {
//         console.log('berhasil ubahhhhh');
//     }
// } );

//DELETE
Fruit.deleteOne({ _id: '62f66d1deca5ecaa23389421'}, function(error){
    if(error){
        console.log(error);
    } else {
        console.log('berhasil deelte data nanas');
    }
} );

Fruit.find(function(error, fruits){
    if(error) {
        console.log(error);

        console.log('nama-nama setelah data delete');
    } else {
        mongoose.connection.close();
        fruits.forEach(function(fruit){
            console.log(fruit.name);
        })
    }
});
