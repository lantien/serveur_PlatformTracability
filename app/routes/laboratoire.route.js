module.exports = (app) => {
  const laboratoires = require('../controllers/laboratoire.controller.js');

  //Crée un laboratoire
  app.post('/api/laboratoires', laboratoires.create);

  //Recupere tout les laboratoires
  app.get('/laboratoires', laboratoires.findAll);

  //Recupere un laboratoire a partir de son ObjectId
  app.get('/api/laboratoires/:laboId', laboratoires.findOne);

  //Met a jour un laboratoire avec les informations recu
  app.put('/api/laboratoires/:laboId', laboratoires.update);

  //Supprime un laboratoire
  app.delete('/api/laboratoires/:laboId', laboratoires.delete);

  //Recupere les laboratoires qui contiennent la chaine recu
  app.get('/api/laboratoires/query/:str', laboratoires.findEvery);
}
