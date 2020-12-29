const firebase = require("../services/firebase.js");

const register = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await firebase.app.auth().createUserWithEmailAndPassword(email, password);

    firebase.admin
      .firestore()
      .collection("users")
      .doc(firebase.app.auth().currentUser.uid)
      .set({
        id: firebase.app.auth().currentUser.uid,
        name: name,
        email: email,
        password: password,
        token: Math.random().toString(36)
      })
      .catch(e => {
        console.error(e);
        res.status(500).send({
          message: "Something went wrong with added user to firestore"
        });
      });

    res.status(200).send({
      message: `User ${name} with email ${email} was sucessfull registered`
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong with sign up" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRef = firebase.admin.firestore().collection("users");
    const snapshot = await userRef
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      res.status(403).send({ message: "Incorrect email or password" });
    } else {
      if (req.session.id) {
        res.status(202).send({ message: "Already logged it" });
      } else {
        await snapshot.forEach(doc => {
          req.session.id = doc.id;
          req.session.token = doc.data().token;
        });

        console.log(req.session.id + " " + req.session.token);
        res.status(200).send({
          userId: req.session.id,
          message: "Successful login"
        });
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "login failed"
    });
  }
};

const logout = async (req, res) => {
  try {
    await req.session.reset();
    res.status(200).send({ message: "Successful logout" });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "logout failed"
    });
  }
};

module.exports = {
  register,
  login,
  logout
};
