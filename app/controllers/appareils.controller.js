const Appareil = require('../models/appareils.model.js');

const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

// Create and Save a new Note
exports.create = (req, res) => {

// Validate request
/*
    if(!req.body.content) {
        return res.status(400).send({
            message: "Appareil content can not be empty"
        });
    }*/

    // Create a Appareil
    const appareil = new Appareil(req.body);

    // Save Appareil in the database
    appareil.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Appareil."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {

    Appareil.find()
    .then(appareil => {
        res.send(appareil);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving appareils."
        });
    });

};

// Find a single note with a noteId
exports.findOne = (req, res) => {

    Appareil.findById(req.params.appareilsId)
    .then(appareil => {
        if(!appareil) {
            return res.status(404).send({
                message: "Appareil not found with id " + req.params.appareilsId
            });
        }
        res.send(appareil);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Appareil not found with id " + req.params.appareilsId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Appareil with id " + req.params.appareilsId
        });
    });
};

exports.uploadImage = (req, res) => {
  // create an incoming form object
  var form = new formidable.IncomingForm();

  form.uploadDir = './uploads';//path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
};

exports.getImage = (req, res) => {

  var id = req.params.imageId;

  fs.readFile('./uploads/' + id, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

    // Validate Request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "Appareil content can not be empty"
        });
    }

    // Find note and update it with the request body
    Appareil.findByIdAndUpdate(req.params.appareilsId, {
        nom: req.body.nom
    }, {new: true})
    .then(appareil => {
        if(!appareil) {
            return res.status(404).send({
                message: "Appareil not found with id " + req.params.appareilsId
            });
        }
        res.send(appareil);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Appareil not found with id " + req.params.appareilsId
            });
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.appareilsId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

    Appareil.findByIdAndRemove(req.params.appareilsId)
    .then(appareil => {
        if(!appareil) {
            return res.status(404).send({
                message: "Appareil not found with id (!appareil)" + req.params.appareilsId
            });
        }
        res.send({message: "Appareil deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Appareil not found with id " + req.params.appareilsId
            });
        }
        return res.status(500).send({
            message: "Could not delete appareil with id " + req.params.appareilsId
        });
    });
};

//add groupeID
exports.add = (req, res) => {

  // Validate Request
  if(!req.body.appId || !req.body.groupeId) {
      return res.status(400).send({
          message: "Il faut un appareilId et un groupeId"
      });
  }

  // Find note and update it with the request body
  Appareil.findByIdAndUpdate(req.body.appId, {
    $addToSet : {groupes: req.body.groupeId}
  }, {new: true})
  .then(appareil => {
      if(!appareil) {
          return res.status(404).send({
              message: "Appareil not found with id " + req.body.appId
          });
      }
      res.send({message :"ajouter avec success"});
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Appareil not found with id " + req.body.appId
          });
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.body.appId
      });
  });
};


//add groupeID
exports.remove = (req, res) => {

  // Validate Request
  if(!req.body.appId || !req.body.groupeId) {
      return res.status(400).send({
          message: "Il faut un appareilId et un groupeId"
      });
  }

  // Find note and update it with the request body
  Appareil.findByIdAndUpdate(req.body.appId, {
    $pull : {groupes: req.body.groupeId}
  }, {new: true})
  .then(appareil => {
      if(!appareil) {
          return res.status(404).send({
              message: "Appareil not found with id " + req.body.appId
          });
      }
      res.send({message :"Supp. avec success"});
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Appareil not found with id " + req.body.appId
          });
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.body.appId
      });
  });
};


exports.findByGrp = (req, res) => {

  Appareil.find({
          groupes : req.params.grpId
          }
          ,
    function(err,docs) {

        if(docs) {
          return docs;
        } else {
          throw err;
        }
    }
  ).then(data => {
    res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Appareil not found with id " + req.body.appId
          });
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.body.appId
      });
  });
};
