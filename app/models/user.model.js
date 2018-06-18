const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    login:{ type: String, unique: true },
    password:String,
    nom:String,
    prenom:String,
    mail:String,
    telephone:String,
    admin: Boolean,
    laboratoire: String,
    projets: [String]

}, {
    timestamps: true,
    strict: false
});


module.exports = mongoose.model('User', UserSchema);
