module.exports = (app) => {
    const projets = require('../controllers/projets.controller.js');

    // Create a new Projet
    app.post('/api/projets', projets.create);

    // Retrieve all Projets
    app.get('/api/projets', projets.findAll);

    // Retrieve a single Projets with his objectId
    app.get('/api/projets/:projectId', projets.findOne);

    // Update a Projet with his objectId
    app.put('/api/projets/:projectId', projets.update);

    // Delete a Project with his objectId
    app.delete('/api/projets/:projectId', projets.delete);

    // Retrieve every projet that contain the string given
    app.get('/api/projets/query/:str', projets.findEvery);

}
