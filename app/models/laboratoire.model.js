const mongoose = require('mongoose');

const LaboratoireSchema = mongoose.Schema({
  nom: String,
  adresse: String,
  referent: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Laboratoire', LaboratoireSchema);
