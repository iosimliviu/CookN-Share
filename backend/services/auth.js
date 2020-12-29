const firebase = require("../services/firebase.js");

const checkLogin = async (req, res, next) => {
  const { token, id } = req.session;

  if (!token || !id) {
    res.status(403).send({ message: "Forbidden" });
  } else {
    let id = req.params.userId;
    const userRef = firebase.admin
      .firestore()
      .collection("users")
      .doc(id);
    const user = await userRef.where("token", "==", token).get();

    if (!user) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      res.status(403).send({ message: "user exists" });
      next();
    }
  }
};

module.exports = {
  checkLogin
};
