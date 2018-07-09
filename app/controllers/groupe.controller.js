const Groupe = require('../models/groupe.model.js');
const Appareil = require('../models/appareils.model.js');

//Enregistre un groupe
exports.create = (req, res) => {

    //request validation
    if(!req.body.nom) {
      return res.status(400).send({
        message: "Il faut un nom."
      });
    }

    const groupe = Groupe({
      nom: req.body.nom,
      creator: req.decoded.userID,
      groupeList: [req.decoded.userID]
    });

    groupe.save()
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur est survenue lors de la creation du groupe."
      })
    });
};

//Renvoie tout les groupes
exports.findAll = (req, res) => {

    Groupe.find()
    .then(grp => {
      res.send(grp);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur est survenue lors de la creation du groupe."
      })
    });
};

//Renvoie le groupe selon l'ID
exports.findOne = (req, res) => {
    Groupe.findById(req.params.groupeId)
    .then(grp => {

      if(!grp) {
        return res.status(404).send({
            message: "Il semble de que ce groupe n'existe pas :" + req.params.groupeId
        });
      }
      res.send(grp);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Il semble de que ce groupe n'existe pas :" + req.params.groupeId
          });
        }
        return res.status(500).send({
            message: "Une erreur est survenue"
        });
    });
};


exports.update = (req, res) => {

    //request validation
    if(!req.body.nom) {
      return res.status(400).send({
        message: "Il faut un nom."
      });
    }

    Groupe.findOneAndUpdate({
      _id: req.params.groupeId,
      $or :[
        {creator: req.decoded.userID},
        {[req.decoded.userID] : 'admin'},
        {[req.decoded.userID] : 'gestionnaire'}
      ]
    }, {
      nom: req.body.nom
    }, {new: true})
    .then(grp => {
      if(!grp) {
        return res.status(404).send({
            message: "Il semble de que ce groupe n'existe pas :" + req.params.groupeId
        });
      }

      res.send(grp);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Il semble que vous n'ayez pas ce droit"
          });
        }
        return res.status(500).send({
            message: "Une erreur est survenue"
        });
    });
};

//Renvoie les groupes dans userID
exports.groupeList = (req, res) => {

    Groupe.find({groupeList: req.params.userId})
    .then(data => {
      res.send(data);
    }).catch(err => {
        return res.status(500).send({
            message: "Une erreur est survenue"
        });
    });
};

//Supprime un groupe
exports.delete = (req, res) => {

    Groupe.findOneAndDelete({
      _id: req.params.groupeId,
      creator: req.decoded.userID
    })
    .then(grp => {
      if(!grp) {
        return res.status(404).send({
            message: "Il semble que vous n'ayez pas ce droit"
        });

      }
      //res.send({message: "Groupe supprimé avec success"});
      return Appareil.find({
              groupes : req.params.groupeId
              }
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

        promises.push(Appareil.findByIdAndUpdate(data[i]._id, {
          $pull: { groupes: req.params.groupeId }
        }, {new: true}));
      }

      return Promise.all(promises);
    }).then(data => {
      res.send({message: "groupe delete !"});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Il semble de que ce groupe n'existe pas :" + req.params.groupeId
          });
        }
        return res.status(500).send({
            message: "Une erreur est survenue"
        });
    });
};

exports.changeRight = (req, res) => {

    //request validation
    if(!req.body.groupeId || !req.body.userId || !req.body.role) {
      return res.status(400).send({
        message: "Il faut le groupeId et le userId"
      });
    }

    Groupe.findOneAndUpdate({
      _id: req.body.groupeId,
      $or :[{creator: req.decoded.userID}, {[req.decoded.userID] : 'admin'}]
    },{
      [req.body.userId] : req.body.role
    }, {new : true})
    .then(data => {
      if(!data) {
        return res.status(404).send({
            message: "Il semble de que ce groupe n'existe pas :" + req.body.groupeId
        });
      }

      res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Il semble que vous n'ayez pas ce droit"
          });
        }
        return res.status(500).send({
            message: "Une erreur est survenue : " + err
        });
    });

};

//ajoute un id au groupe
exports.add = (req, res) => {

  //request validation
  if(!req.body.groupeId || !req.body.userId) {
    return res.status(400).send({
      message: "Il faut le groupeId et le userId"
    });
  }

  Groupe.findOneAndUpdate({
    _id: req.body.groupeId,
    $or :[
      {creator: req.decoded.userID},
      {[req.decoded.userID] : 'admin'},
      {[req.decoded.userID] : 'gestionnaire'}
    ]
  }, {
    $addToSet: { groupeList: req.body.userId }
  }, {new: true})
  .then(grp => {
    if(!grp) {
      return res.status(404).send({
          message: "Il semble de que ce groupe n'existe pas :" + req.body.groupeId
      });
    }
    res.send(grp);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il semble que vous n'ayez pas ce droit"
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};

//Supprime un id au groupe
exports.remove = (req, res) => {
  //request validation
  if(!req.body.groupeId || !req.body.userId) {
    return res.status(400).send({
      message: "Il faut le groupeId et le userId"
    });
  }

  if(req.body.userId == req.decoded.userID) {
    var promise = new Promise(function(resolve, reject) {
      Groupe.findByIdAndUpdate(req.body.groupeId,
        {
          $pull: {groupeList: req.body.userId},
          [req.body.userId] : undefined
      }
      ).then(function (data){
        resolve(data);
      });
    });
  } else {
    var promise = new Promise(function(resolve, reject) {
      Groupe.findOneAndUpdate({
        _id: req.body.groupeId,
        $or :[
          {creator: req.decoded.userID},
          {[req.decoded.userID] : 'admin'},
          {[req.decoded.userID] : 'gestionnaire'}
        ]
      },
        {
          $pull: { groupeList: req.body.userId },
          [req.body.userId] : undefined
      })
      .then(function (data){
        resolve(data);
      });
    });
  }

  promise.then(grp => {
    if(!grp) {
      return res.status(404).send({
          message: "Il semble de que ce groupe n'existe pas :" + req.body.groupeId
      });
    }
    res.send(grp);
  })
  .catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il semble que vous n'ayez pas ce droit"
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};

//Renvoie si l'utilisateur a la droit ou non
exports.droit = (req, res) => {

  // Groupe.findOne({_id: req.params.groupeId, groupeList: req.decoded.userID},
  // function (err, docs) {
  //
  //   if(docs) {
  //
  //     res.send({has_right: true});
  //   } else {
  //
  //     res.send({has_right: false});
  //   }
  // });

  Appareil.findById(req.params.groupeId,
    function (err, docs) {
      if(docs) {

        return docs;
      } else {

        throw err;
      }
  }).then(data => {
      var groupe_list = data.groupes;

        return Groupe.findOne({_id: groupe_list, groupeList: req.decoded.userID},
        function (err, docs) {

          if(docs) {

            res.send({has_right: true});
          } else {
            res.send({has_right: false});
          }
         });

  }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il semble de que ce groupe n'existe pas :" + req.body.groupeId
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};
