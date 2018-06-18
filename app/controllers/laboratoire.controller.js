const Laboratoire = require('../models/laboratoire.model.js');
const User = require('../models/user.model.js');

//Enregistre un laboratoire
exports.create = (req, res) => {

  if(!req.body.nom || !req.body.adresse || !req.body.referent) {
    return res.status(400).send({
      message: "Il faut un nom, une adresse et un referent"
    });
  }

  const labo = Laboratoire({
        nom: req.body.nom,
        adresse: req.body.adresse,
        referent: req.body.referent
  });

  labo.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Une erreur est survenue lors de la creation du laboratoire."
    });
  })
};

//Recupere tout les laboratoires
exports.findAll = (req, res) => {

  Laboratoire.find()
  .then(labo => {
    res.send(labo);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Une erreur est survenie lors de la recuperation des laboratoires"
    });
  });
};

//Renvoie un laboratoire a partir de son ObjectId si il existe
exports.findOne = (req, res) => {

  Laboratoire.findById(req.params.laboId)
  .then(labo => {

    if(!labo) {
      return res.status(404).send({
        message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
      });
    }
    res.send(labo);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
          });
      }
      return res.status(500).send({
          message: "Une erreur est survenue"
      });
  });
};

//Remplace un laboratoire par celui recu
exports.update = (req, res) => {

  if(!req.body.nom || !req.body.adresse || !req.body.referent) {
    return res.status(400).send({
      message: "Il faut un nom, une adresse et un referent"
    });
  }

  Laboratoire.findByIdAndUpdate(req.params.laboId,{
        nom: req.body.nom,
        adresse: req.body.adresse,
        referent: req.body.referent,
  }, {new: true})
  .then(labo => {
    if(!labo) {
      return res.status(404).send({
          message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
      });
    }

    res.send(labo);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
          });
      }
      return res.status(500).send({
          message: "Une erreur est survenue"
      });
  });
};

//Supprime un laboratoire et toute les references
exports.delete = (req, res) => {

  Laboratoire.findByIdAndRemove(req.params.laboId)
  .then(labo => {
    if(!labo) {
      return res.status(400).send({
        message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
      });
    }
    //res.send({message: "Labo supprimé avec success"});

    return User.find({
            laboratoire : req.params.laboId
            },
            '_id nom prenom'
            ,
      function(err,docs) {

          if(docs) {
            return docs;
          } else {
            throw err;
          }
      }
    );
  }).then(data => {
    var promises = [];

    for(var i in data) {

      promises.push(User.findByIdAndUpdate(data[i]._id, {
        laboratoire: ""
      }, {new: true}));
    }

    return Promise.all(promises);
  }).then(data => {

    res.send({message: "Labo supprimé avec success"});
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Ce laboratoire semble ne pas exister : " + req.params.laboId
          });
      }
      return res.status(500).send({
          message: "Une erreur est survenue"
      });
  });
};


//Renvoie les laboratoire qui contiennent la chaine recu en parametre
exports.findEvery = (req, res) => {

  Laboratoire.find(
    {"nom": {$regex :  ".*" + req.params.str + ".*"}},
    function(err,docs) {
        if(docs) {
          res.send(docs);
        } else {
          res.send({message: "Aucun laboratoire contenant " + req.params.str });
        }
    }
  );
};
