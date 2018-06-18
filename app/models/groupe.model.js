const mongoose = require('mongoose');

const GroupeSchema = mongoose.Schema({
    nom: String,
    groupeList: [String]
},{
    timestamps: true,
    strict: false
});

module.exports = mongoose.model('Groupe', GroupeSchema);
