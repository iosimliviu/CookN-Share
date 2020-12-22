const firebase = require('../services/firebase.js')

const getPostsForUser = (req, res) => {
    let userId = req.params.userId;
    let posts = []
    firebase.admin.firestore().collection('posts').where('userId', '==', userId).get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                posts.push(doc.data())
            });
            res.send(posts)
        })
        .catch(e => {
            console.error(e);
            res.status(500).send({ message: "Error" });
        })
}

const getAllPosts = (req, res) => {
    let posts = []
    firebase.admin.firestore().collection('posts').get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                posts.push(doc.data())
            });
            res.send(posts)
        })
        .catch(e => {
            console.error(e);
            res.status(500).send({ message: "Error" });
        })
}

module.exports = {
    getPostsForUser,
    getAllPosts
};
