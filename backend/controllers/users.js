const firebase = require("../services/firebase.js");

const getAllUsers = (req, res) => {
  let users = [];
  firebase.admin
    .firestore()
    .collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        users.push(doc.data());
      });
      res.status(200).send(users);
    });
};

const getUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    const userRef = firebase.admin
      .firestore()
      .collection("users")
      .doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      res.status(500).send({ message: "User not found" });
    } else {
      let user = doc.data();
      res.status(200).send(user);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Get user failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    await firebase.admin
      .firestore()
      .collection("users")
      .doc(userId)
      .delete();

    res.status(200).send(`User was deleted`);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Delete user failed" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser
};
