const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
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

// /*
//     config - firebase
// */

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


app.get('/users', (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*')

    // let users = [
    //     {
    //         name: 'Iosim Liviu',
    //         email: 'liviuiosim@gmail.com',
    //         password: 'pass123'
    //     },
    //     {
    //         name: 'baba Liviu',
    //         email: 'liviubaba@gmail.com',
    //         password: 'passbaba123'
    //     }
    // ]
    let users = []
    db.collection('users').get().then(snapshot => {
        snapshot.forEach((doc) => {
            users.push(doc.data())
        });
        res.send(users)
    });

})

/*
    listen
*/
app.listen(process.env.PORT || 8081, () => { console.log("server started") })
