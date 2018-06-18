const mongoose = require('mongoose');

const AppareilSchema = mongoose.Schema({
  groupes: [String],
  img: { data: Buffer, contentType: String }
}, {
    timestamps: true,
    strict: false
});


module.exports = mongoose.model('Appareil', AppareilSchema);
