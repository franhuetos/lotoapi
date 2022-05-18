var mongoose = require('mongoose');  
var GordoPrimitivaSchema = new mongoose.Schema({
  date: Date,
  n1: Number,
  n2: Number,
  n3: Number,
  n4: Number,
  n5: Number,
  reintegro: Number,
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
    sexta: {
        acertantes: String,
        premio: String
    },
    septima: {
        acertantes: String,
        premio: String
    },
    octava: {
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
mongoose.model('GordoPrimitiva', GordoPrimitivaSchema);

module.exports = mongoose.model('GordoPrimitiva');