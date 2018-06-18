const Emprunt = require('../models/emprunt.model.js');

// Enregistre un emprunt
exports.create = (req, res) => {

    // Validate request
    if(!req.body.longitude || !req.body.latitude || !req.body.id_appareil
        || !req.body.id) {
      return res.status(400).send({
          message: "Pour faire un emprunt il faut la position, l'id de l'appareil et le userID"
      });
    }

    // Create a Scanner
    const emprunt = new Emprunt({
              userID: req.body.id,
              longitude: req.body.longitude,
              latitude: req.body.latitude,
              id_appareil: req.body.id_appareil,
              is_rendu: false,
              projetID: req.body.projetID || ""
    });

    Emprunt.findOne({id_appareil: req.body.id_appareil, is_rendu: false},
      function(err, obj) {

        // Si pas deja emprunter
        if(!obj) {
          emprunt.save()
          .then(data => {
              res.send(data);
          }).catch(err => {
              res.status(500).send({
                  message: err.message || "Some error occurred."
              });
          });
        } else {
          return res.status(400).send({
              message: "Deja utiliser !"
          });
        }

      }
    );

};

exports.update = (req, res) => {
  // Validate request
  if(!req.body.longitude || !req.body.latitude || !req.body.id_appareil
  || !req.body.id) {
    return res.status(400).send({
        message: "Pour faire un emprunt il faut la position, l'id de l'appareil et le userID"
    });
  }

  Emprunt.findOneAndUpdate({id_appareil: req.body.id_appareil, is_rendu: false}, {
      userID_rendu: req.body.id,
      is_rendu: true,
      longitude_rendu: req.body.longitude,
      latitude_rendu: req.body.latitude,
      is_incident: req.body.incident
  }, {new: true})
  .then(emprunt => {
      if(!emprunt) {
        return res.status(404).send({
            message: "Emprunt not found with id (!emprunt)" + req.body.id_appareil
        });
      }
      res.send(emprunt);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Emprunt not found with id " + req.body.id_appareil
          });
      }
      return res.status(500).send({
          message: "Error updating emprunt with id " + req.body.id_appareil
      });
  });
};

exports.findOne = (req, res) => {

  Emprunt.findOne({id_appareil: req.params.scannersId, is_rendu: false},
  function (err, obj) {

    if(obj) {
      res.send({
          disponible: false
      });
    } else {
      res.send({
          disponible: true
      });
    }
  });
};

exports.findWith = (req, res) => {

  Emprunt.find({id_appareil: req.params.scannersId},
  function (err, obj) {

    if(obj) {
      res.send(obj);
    } else {
      res.send({
          message: "error"
      });
    }
  });
};
