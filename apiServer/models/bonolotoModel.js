var mongoose = require('mongoose');  
var BonolotoSchema = new mongoose.Schema({
  date: Date,
  n1: Number,
  n2: Number,
  n3: Number,
  n4: Number,
  n5: Number,
  n6: Number,
  complementary: Number,
  refund: Number,
  info: {
    primera: {
      acertantes: String,
      premio: String
    },
    segunda: {
      acertantes: String,
      premio: String
    },
    tercera: {
      acertantes: String,
      premio: String
    },
    cuarta: {
      acertantes: String,
      premio: String
    },
    quinta: {
      acertantes: String,
      premio: String
    },
    reintegro: {
      acertantes: String,
      premio: String
    }
  }

  
});

//Mongoose pluralize collection name and set to lowercase
//so will search on 'draws' collection
mongoose.model('Bonoloto', BonolotoSchema);

module.exports = mongoose.model('Bonoloto');