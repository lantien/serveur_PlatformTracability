const Incident = require('../models/incident.model.js');

exports.create = (req, res) => {

  if(!req.body.app_id || !req.body.report || !req.body.state || !req.body.userID) {
    return res.status(400).send({
        message: "Pas tout les champs recu"
    });
  }

  const incident = new Incident({
    app_id: req.body.app_id,
    report: req.body.report,
    state: req.body.state,
    userID: req.body.userID
  });

  incident.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the report."
      });
  });

};

exports.findAll = (req, res) => {

  Incident.find()
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while getting the reports."
      });
  });

};

exports.findOne = (req, res) => {

  Incident.findById(req.params.incidentId)
  .then(data => {
    if(!data) {
      return res.status(404).send({
        message: "This report doesnt exist " + req.params.incidentId
      });
    }
    res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while getting the report : "+req.params.incidentId
      });
  });
};

exports.findWith = (req, res) => {

  Incident.find({
    app_id: req.params.appId
  }).then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while getting the report for the app : "+req.params.appId
      });
  });

};
