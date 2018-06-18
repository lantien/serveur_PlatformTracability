module.exports = (app) => {
    const emprunt = require('../controllers/emprunt.controller.js');

    // Create a new Emprunt -> j'emprunte
    app.post('/api/emprunt', emprunt.create);

    // Update un 'Emprunt' -> rendu
    app.put('/api/emprunt', emprunt.update);

    //Renvoie si un appareil est dispo ou non
    app.get('/api/emprunt/:scannersId', emprunt.findOne);

    //Renvoie le suivie d'un appareil
    app.get('/api/emprunt/suivie/:scannersId', emprunt.findWith);
}
