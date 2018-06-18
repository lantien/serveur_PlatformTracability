const mongoose = require('mongoose');

const ProjetSchema = mongoose.Schema({
  nom: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Projets', ProjetSchema);
