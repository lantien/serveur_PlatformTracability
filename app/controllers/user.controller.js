const User = require('../models/user.model.js');
const passwordHash = require('password-hash');

// Create and Save a new Note
exports.create = (req, res) => {

  // Validate request
  if(!req.body.nom || !req.body.password ||
   !req.body.prenom || !req.body.email || !req.body.telephone) {
      return res.status(400).send({
          message: "Pas tout les champs recu"
      });
  }

    req.body.password = passwordHash.generate(req.body.password);

    // Create a Scanner
    const user = new User({
      login: req.body.login || req.body.nom,
      password: req.body.password,
      nom : req.body.nom,
      prenom: req.body.prenom,
      mail: req.body.email,
      telephone: req.body.telephone,
      admin: false,
      laboratoire: req.body.laboratoire || "",
      projets: req.body.projets || []
    });

    // Save Scanner in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
};

// Return if token is ok
exports.test = (req, res) => {

  res.send({connection : 'true'});
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {

    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });

};

exports.makeAdmin = (req, res) => {

  User.findByIdAndUpdate(req.params.userId,  {
    admin: req.body.admin
  }, {new : true})
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while making user admin."
    });
  });
};

//Return a user find by ObjectId
exports.findOne = (req, res) => {

  User.findById(req.params.userId)
  .then(user => {
    if(!user) {
      return res.status(404).send({
        message: "Cet utilisateur semble ne pas exister : " + req.params.userId
      });
    }
    res.send(user);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Cet utilisateur semble ne pas exister : " + req.params.userId
        });
    }
    return res.status(500).send({
        message: "Une erreur est survenue"
    });
  });
};

//Update un utilisateur
exports.update = (req, res) => {

    //check right si pas mon compte et pas admin rejette
    if(req.decoded.userID != req.params.userId
      && req.decoded.admin == false)
    {
      return res.status(404).send({
          message: "You don't have right"
      });
    }

    // Validate request
    if(!req.body.nom || !req.body.login ||
     !req.body.prenom || !req.body.email || !req.body.telephone) {
        return res.status(400).send({
            message: "Pas tout les champs recu"
        });
    }

    var objForUpdate = {
      login: req.body.login,
      nom : req.body.nom,
      prenom: req.body.prenom,
      mail: req.body.email,
      telephone: req.body.telephone
    };

    if(req.body.laboratoire) {
      objForUpdate.laboratoire = req.body.laboratoire;
    }

    User.findByIdAndUpdate(req.params.userId,
      objForUpdate, {new: true})
    .then(user => {
      if(!user) {
        return res.status(404).send({
          message: "Cet utilisateur semble ne pas exister : " + req.params.userId
        });
      }
      res.send(user);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Cet utilisateur semble ne pas exister : " + req.params.userId
          });
      }
      return res.status(500).send({
          message: "Une erreur est survenue"
      });
    });
};

//Supprime un utilisateur
exports.delete = (req, res) => {

    //check right si pas mon compte et pas admin rejette
    if(req.decoded.userID != req.params.userId
      && req.decoded.admin == false)
    {
      return res.status(404).send({
          message: "You don't have right"
      });
    }

    User.findByIdAndRemove(req.params.userId)
    .then(user => {
      if(!user) {
        return res.status(404).send({
          message: "Cet utilisateur semble ne pas exister : " + req.params.userId
        });
      }
      res.send({message: "Utilisateur supprimé avec success"});
    }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Cet utilisateur semble ne pas exister : " + req.params.userId
          });
      }
      return res.status(500).send({
          message: "Une erreur est survenue"
      });
    });
};

// Find a single note with a noteId
exports.login = (req, res) => {

    User.findOne({login :req.body.login})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.body.userID
            });
        }

      	if(passwordHash.verify(req.body.password, user.get("password"))) {

      		// sign with default (HMAC SHA256)
      		var jwt = require('jsonwebtoken');
      		var token = jwt.sign({
            admin: user.get("admin"),
            userID: user.get("_id")
        }, 'shhhhh');
              	res.send({
                      tokenJSON :token,
                      userID: user.get("_id"),
                      admin: user.get("admin")
                    });
      	} else {
      		return res.status(404).send({
                      	message: "Wrong password or login"
      		});
      	}
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.body.userID
            });
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.body.userID
        });
    });
};

//ajoute un projet a un utilisateur
exports.add = (req, res) => {

  //request validation
  if(!req.body.projetId || !req.body.userId) {
    return res.status(400).send({
      message: "Il faut le projetId et le userId"
    });
  }

  User.findByIdAndUpdate(req.body.userId, {
    $addToSet: { projets: req.body.projetId }
  }, {new: true})
  .then(user => {
    if(!user) {
      return res.status(404).send({
          message: "Il que cette utilisateur n'existe pas :" + req.body.userId
      });
    }
    res.send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il que cette utilisateur n'existe pas :" + req.body.userId
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};

//Supprime un projet
exports.remove = (req, res) => {

  //request validation
  if(!req.body.projetId || !req.body.userId) {
    return res.status(400).send({
      message: "Il faut le projetId et le userId"
    });
  }

  User.findByIdAndUpdate(req.body.userId, {
    $pull: { projets: req.body.projetId }
  }, {new: true})
  .then(user => {
    if(!user) {
      return res.status(404).send({
          message: "Il que cette utilisateur n'existe pas :" + req.body.userId
      });
    }
    res.send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il que cette utilisateur n'existe pas :" + req.body.userId
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};

//cherche un user par nom ou prenom
exports.search = (req, res) => {

  User.find(
  { $or : [{"nom": {$regex : ".*" + req.params.str + ".*"}},
          {"prenom": {$regex : ".*" + req.params.str + ".*"}}
          ] },
          '_id nom prenom projets'
          ,
    function(err,docs) {

        if(docs) {
          res.send(docs);
        } else {
          res.send({message: "Aucun utilisateur contenant " + req.params.str });
        }
    }
  );
};

//cherche les users dans un projet avec l'id
exports.projetMembers = (req, res) => {

  User.find({
          projets : req.params.str
          },
          '_id nom prenom'
          ,
    function(err,docs) {

        if(docs) {
          res.send(docs);
        } else {
          res.send({message: "Aucun utilisateur contenant " + req.params.str });
        }
    }
  );
};

//cherche les users dans un projet avec l'id
exports.removeAll = (req, res) => {

  User.find({
          projets : req.params.str
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
  ).then(docs => {

    var promises = [];

    for(var i in docs) {

      promises.push(User.findByIdAndUpdate(docs[i]._id, {
        $pull: { projets: req.params.str }
      }, {new: true}));
    }

    return Promise.all(promises);

  }).then(msg => {
    res.send({message: "all occrences delete !"});
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Il que cette utilisateur n'existe pas :" + req.body.userId
        });
      }
      return res.status(500).send({
          message: "Une erreur est survenue : " + err
      });
  });
};
