module.exports = (app) => {
    const incident = require('../controllers/incident.controller.js');

    //Crée un incident
    app.post('/api/incident', incident.create);

    //Recupere tout les incident
    app.get('/api/incident', incident.findAll);

    //Recupere un incident
    app.get('/api/incident/:incidentId', incident.findOne);

    //Recupere tout les incident d'un appareil
    app.get('/api/incidentApp/:appId', incident.findWith);

}
