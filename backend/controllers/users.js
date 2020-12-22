const firebase = require('../services/firebase.js')

const getAllUsers = (req, res) => {
    let users = []
    firebase.admin.firestore().collection('users').get().then(snapshot => {
        snapshot.forEach((doc) => {
            users.push(doc.data())
        });
        res.send(users)
    });
}

module.exports = {
    getAllUsers
};

