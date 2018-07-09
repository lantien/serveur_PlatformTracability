module.exports = (app) => {
    const appareils = require('../controllers/appareils.controller.js');

    // Create a new Note
    app.post('/admin/appareils', appareils.create);

    // Retrieve all Notes
    app.get('/api/appareils', appareils.findAll);

    // Retrieve a single Note with noteId
    app.get('/api/appareils/:appareilsId', appareils.findOne);

    // Retrieve a single Note with noteId
    app.post('/admin/appareils_image', appareils.uploadImage);

    // Retrieve a single Note with noteId
    app.get('/appareils_image/:imageId', appareils.getImage);

    // Update a Note with noteId
    app.put('/admin/appareils/:appareilsId', appareils.update);

    // Delete a Note with noteId
    app.delete('/admin/appareils/:appareilsId', appareils.delete);

    //Add groupeID to appareils
    app.post('/admin/appareils/add', appareils.add);

    //Remove groupeID to appareils
    app.post('/admin/appareils/remove', appareils.remove);

    //Renvoie les appareil selon leur groupe
    app.get('/api/appareilsByGrp/:grpId', appareils.findByGrp);

    //Change l'etat d'un appareil
    app.post('/api/appareils/etat', appareils.setState);
}
