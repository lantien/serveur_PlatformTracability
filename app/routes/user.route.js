module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/api/users', users.findAll);

    // Retrieve 1 user
    app.get('/api/users/:userId', users.findOne);

    //Met a jour les infos d'un utilisateur
    app.put('/api/users/:userId', users.update);

    //Met a jour les infos d'un utilisateur
    app.put('/admin/makeAdminUser/:userId', users.makeAdmin);

    //Supprime un utilisateur
    app.delete('/api/users/:userId', users.delete);

    // Return if token is ok
    app.post('/api/test', users.test);

    // Retrieve a single Users with login and return token with authentification OK
    app.post('/login', users.login);

    //Ajoute un projet a un user
    app.post('/api/users/add', users.add);

    //Supprime un projet d'un user
    app.post('/api/users/remove', users.remove);

    //Cherche un user par nom
    app.get('/api/users/query/:str', users.search);

    //Cherche les users dans un projet
    app.get('/api/users/projets/:str', users.projetMembers);

    //Supprime le projetID de tt les membres
    app.delete('/api/users/projets/:str', users.removeAll);
}
