module.exports = (app) => {
  const groupe = require('../controllers/groupe.controller.js');

  //Crée un groupe
  app.post('/api/groupe', groupe.create);

  //Recupere tout les groupeList
  app.get('/api/groupe', groupe.findAll);

  //Recupere un groupe a partir de son ObjectID
  app.get('/api/groupe/:groupeId', groupe.findOne);

  //Met a jour un groupe
  app.put('/api/groupe/:groupeId', groupe.update);

  //Supprime un groupe
  app.delete('/api/groupe/:groupeId', groupe.delete);


  //Ajoute un userID au groupe
  app.post('/api/groupe/add/', groupe.add);

  //Supprime un userID du groupe
  app.post('/api/groupe/remove', groupe.remove);

  //Renvoie si l'utilisateur a la droit d'emprunter l'appareil
  app.get('/api/groupe/me/droit/:groupeId', groupe.droit);
}
