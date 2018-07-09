const mongoose = require('mongoose');

const EmpruntSchema = mongoose.Schema({
  userID: String,
  userID_rendu: String,
  longitude: Number,
  latitude: Number,
  id_appareil: String,
  is_rendu: Boolean,
  longitude_rendu: Number,
  latitude_rendu: Number,
  projetID: String,
  is_incident: Boolean,
  incident_id: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Emprunt', EmpruntSchema);
