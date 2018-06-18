module.exports = (app) => {
    const appareils = require('../controllers/appareils.controller.js');

    // Create a new Note
    app.post('/api/appareils', appareils.create);

    // Retrieve all Notes
    app.get('/api/appareils', appareils.findAll);

    // Retrieve a single Note with noteId
    app.get('/api/appareils/:appareilsId', appareils.findOne);

    // Retrieve a single Note with noteId
    app.post('/api/appareils_image', appareils.uploadImage);

    // Retrieve a single Note with noteId
    app.get('/appareils_image/:imageId', appareils.getImage);

    // Update a Note with noteId
    app.put('/api/appareils/:appareilsId', appareils.update);

    // Delete a Note with noteId
    app.delete('/api/appareils/:appareilsId', appareils.delete);

    //Add groupeID to appareils
    app.post('/api/appareils/add', appareils.add);

    //Remove groupeID to appareils
    app.post('/api/appareils/remove', appareils.remove);

    //Renvoie les appareil selon leur groupe
    app.get('/api/appareilsByGrp/:grpId', appareils.findByGrp);

    //Renvoie les appareil selon leur groupe
    app.post('/api/appareilsByGrp', appareils.findByGrp);
}
