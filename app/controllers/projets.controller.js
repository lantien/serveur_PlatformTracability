const Projet = require('../models/projets.model.js');
const User = require('../models/user.model.js');

exports.create = (req, res) => {

  if(!req.body.nom) {
    return res.status(400).send({
        message: "Projet need a name"
    });
  }

  const projet = Projet({
    nom: req.body.nom
  });

  projet.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Project."
    });
  })
};

// Retrieve and return all projets from the database.
exports.findAll = (req, res) => {

    Projet.find()
    .then(projet => {
        res.send(projet);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving projects."
        });
    });

};

// Find a single project with a ObjectId
exports.findOne = (req, res) => {

    Projet.findById(req.params.projectId)
    .then(projet => {
        if(!projet) {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        res.send(projet);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Projet with id " + req.params.projectId
        });
    });
};

// Update a projet identified by the objectId in the request
exports.update = (req, res) => {

    // Validate Request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "Projet name can not be empty"
        });
    }

    // Find note and update it with the request body
    Projet.findByIdAndUpdate(req.params.projectId, {
        nom: req.body.nom,
    }, {new: true})
    .then(projet => {
        if(!projet) {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        res.send(projet);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.projectId
        });
    });
};


// Delete a projet with his objectId
exports.delete = (req, res) => {

    Projet.findByIdAndRemove(req.params.projectId)
    .then(projet => {
        if(!projet) {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        //res.send({message: "Projet deleted successfully!"});
        return User.find({
                projets : req.params.projectId
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
          $pull: { projets: req.params.projectId }
        }, {new: true}));
      }

      return Promise.all(promises);
    }).then(msg => {
      res.send({message: "Projet deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Projet not found with id " + req.params.projectId
            });
        }
        return res.status(500).send({
            message: "Could not delete projet with id " + req.params.projectId
        });
    });
};

// Delete a projet with his objectId
exports.findEvery = (req, res) => {

    Projet.find(
    { "nom": {$regex : ".*" + req.params.str + ".*"} },
      function(err,docs) {

          if(docs) {
            res.send(docs);
          } else {
            res.send({message: "Aucun laboratoire contenant " + req.params.str });
          }
      }
    );
};
