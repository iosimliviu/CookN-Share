const firebase = require("../services/firebase.js");

const checkLogin = async (req, res, next) => {
  const { token, id } = req.session;
  console.log("plpl " + token + " " + id);
  if (!token || !id) {
    res.status(403).send({ message: "Forbidden" });
  } else {
    const userRef = firebase.admin.firestore().collection("users");
    const snapshot = await userRef.where("token", "==", token).get();

    if (snapshot.empty) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      next();
    }
  }
};

module.exports = {
  checkLogin
};
