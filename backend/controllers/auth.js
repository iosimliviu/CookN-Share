// const User = require("../models/index.js").User;
const adminconfig = require("../config/adminconfig.json");

const registerUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const errors = [];
        if (!name) {
            errors.push("name is empty");
        }
        if (!email) {
            errors.push("Email is empty");
        } else if (
            !email.match(
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
            )
        ) {
            errors.push("Email is not valid");
        }
        if (!password) {
            errors.push("Password is empty");
        }
        if (errors.length === 0) {

            // REGISTER USER

        } else {
            res.status(400).send({ errors });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: "Error"
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // const user = await User.findOne({ where: { email, password }, raw: true });

    // if (!user) {
    //     //   res.status(403).send({ message: "Incorrect email or password" });
    // } else {
    //     if (req.session.id) {
    //         res.status(202).send({ message: "Already logged it" });
    //     } else {
    //         req.session.id = user.id;
    //         req.session.token = user.token;
    //         res.status(200).send({
    //             message: "Successful login", details: {
    //                 id: user.id,
    //                 name: user.firstName + " " + user.lastName,
    //                 isAdmin: user.isAdmin,
    //                 isObserver: user.isObserver
    //             }
    //         });
    //     }
    // }
}

module.exports = {
    loginUser,
    registerUser
};
