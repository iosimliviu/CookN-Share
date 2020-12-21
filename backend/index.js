const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");

const serviceAccount = require('./config/serviceAccountKey.json');
const firebaseConfig = require('./config/firebaseConfig.json');

let firebase = require('firebase')
firebase.initializeApp(firebaseConfig);
/*
    config - express
*/

const app = express()

const corsOptions = {
    origin: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Methods",
        "Access-Control-Request-Headers",
    ],
    credentials: true,
    enablePreflight: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next()
})
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/posts', (req, res) => {
    try {
        let posts = []
        db.collection('posts').get().then(snapshot => {
            snapshot.forEach((doc) => {
                posts.push(doc.data())
            });
            res.send(posts)
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: "Error"
        });
    }

})

app.get('/posts/users/:userId', (req, res) => {
    try {
        let userId = req.params.userId;
        let posts = []
        db.collection('posts').where('userId', '==', userId).get().then(snapshot => {
            snapshot.forEach((doc) => {
                posts.push(doc.data())
            });
            res.send(posts)
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: "Error"
        });
    }
})

app.get('/users', (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*')
    let users = []
    db.collection('users').get().then(snapshot => {
        snapshot.forEach((doc) => {
            users.push(doc.data())
        });
        res.send(users)
    });

})

app.post('/register', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        await firebase.auth().createUserWithEmailAndPassword(email, password)

        admin.firestore().collection('users').doc(firebase.auth().currentUser.uid)
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
})

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        await firebase.auth().signInWithEmailAndPassword(email, password);

        let userId = firebase.auth().currentUser.uid
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

app.post('/login', userLogin)

const logout = async (req, res) => {
    try {
        await firebase.auth().signOut()
        res.status(200).send({ message: "Successful logout" });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({
            message: "logout failed"
        });
    }
}
app.get("/logout", logout);

/*
    listen
*/
app.listen(process.env.PORT || 8081, () => { console.log("server started") })
