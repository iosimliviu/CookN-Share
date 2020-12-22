const firebase = require('../services/firebase.js')

const register = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        await firebase.app.auth().createUserWithEmailAndPassword(email, password)

        firebase.admin.firestore().collection('users').doc(firebase.app.auth().currentUser.uid)
            .set({
                name: name,
                email: email,
                password: password
            })
            .catch(e => {
                console.error(e);
                res.status(500).send({
                    message: "Something went wrong with added user to firestore"
                });
            })

        res.status(200).send({
            message: `User ${name} with email ${email} was sucessfull registered`
        });

    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Something went wrong with sign up" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        await firebase.app.auth().signInWithEmailAndPassword(email, password);

        let userId = firebase.app.auth().currentUser.uid
        res.status(200).send({
            userId,
            message: `User with uId:${userId}`
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({
            message: "login failed"
        });
    }
}

const logout = async (req, res) => {
    try {
        await firebase.app.auth().signOut()
        res.status(200).send({ message: "Successful logout" });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({
            message: "logout failed"
        });
    }
}

module.exports = {
    register,
    login,
    logout
};

