var mongoose = require('mongoose');  
var EuromillonSchema = new mongoose.Schema({
  date: Date,
  n1: Number,
  n2: Number,
  n3: Number,
  n4: Number,
  n5: Number,
  star1: Number,
  star2: Number,
  millon: String,
  premiosMillon: {
      acertantesTotal: String,
      premio: String
  },
  info: {
    primera: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    segunda: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    tercera: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    cuarta: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    quinta: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    sexta: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    septima: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    octava: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    novena: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    decima: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    undecima: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    duodecima: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    },
    trigesima: {
      acertantes: String,
      acertantesTotal: String,
      premio: String
    }
  }

  
});

//Mongoose pluralize collection name and set to lowercase
//so will search on 'draws' collection
mongoose.model('Euromillon', EuromillonSchema);

module.exports = mongoose.model('Euromillon');