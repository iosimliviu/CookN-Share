const admin = require('firebase-admin');
const app = require('firebase')
const serviceAccount = require('../config/serviceAccountKey.json');
const firebaseConfig = require('../config/firebaseConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "cookn-share.appspot.com"
});
app.initializeApp(firebaseConfig);

module.exports = {
    admin,
    app
};

