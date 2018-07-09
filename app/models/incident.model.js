const mongoose = require('mongoose');

const IncidentSchema = mongoose.Schema({
    app_id: String,
    report: String,
    state: String,
    userID: String
},{
    timestamps: true,
    strict: false
});

module.exports = mongoose.model('Incident', IncidentSchema);
