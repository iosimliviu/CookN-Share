const firebase = require("../services/firebase.js");
let Busboy = require("busboy");
let path = require("path");
let os = require("os");
let fs = require("fs");
let UUID = require("uuid-v4");
var bucket = firebase.admin.storage().bucket();

const createPost = (req, res) => {
  let uuid = UUID();

  var busboy = new Busboy({ headers: req.headers });
  let fields = {};
  let fileData = {};

  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    console.log(
      "File [" +
        fieldname +
        "]: filename: " +
        filename +
        ", encoding: " +
        encoding +
        ", mimetype: " +
        mimetype
    );
    // /tmp/1321322-545364.png
    let filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimetype };
  });

  busboy.on("field", function(
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    fields[fieldname] = val;
  });

  busboy.on("finish", function() {
    bucket.upload(
      fileData.filepath,
      {
        uploadType: "media",
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile);
        }
      }
    );

    function createDocument(uploadedFile) {
      firebase.admin
        .firestore()
        .collection("posts")
        .doc(fields.id)
        .set({
          id: fields.id,
          userId: fields.userId,
          caption: fields.caption,
          location: fields.location,
          recipe: fields.recipe,
          date: parseInt(fields.date),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
        })
        .then(() => {
          res.send("Post added: " + fields.id);
        });
    }
  });
  req.pipe(busboy);
};

const getPost = async (req, res) => {
  try {
    let postId = req.params.postId;
    const postRef = firebase.admin
      .firestore()
      .collection("posts")
      .doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) {
      res.status(500).send({ message: "Post not found" });
    } else {
      let post = doc.data();
      res.status(200).send(post);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Get post failed" });
  }
};

const updatePost = async (req, res) => {
  try {
    let postId = req.params.postId;

    const caption = req.body.caption;
    const location = req.body.location;
    const recipe = req.body.recipe;

    await firebase.admin
      .firestore()
      .collection("posts")
      .doc(postId)
      .update({
        caption,
        location,
        recipe
      });

    res.status(200).send(`Post updated`);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Update post failed" });
  }
};

const deletePost = async (req, res) => {
  try {
    let postId = req.params.postId;
    const post = await firebase.admin
      .firestore()
      .collection("posts")
      .doc(postId)
      .delete();

    res.status(200).send(`Post deleted`);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Delete post failed" });
  }
};

const getPostsForUser = (req, res) => {
  let userId = req.params.userId;
  let posts = [];
  firebase.admin
    .firestore()
    .collection("posts")
    .orderBy("date", "desc")
    .where("userId", "==", userId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      res.send(posts);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ message: "Error" });
    });
};

const getAllPosts = (req, res) => {
  let posts = [];
  firebase.admin
    .firestore()
    .collection("posts")
    .orderBy("date", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      res.send(posts);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ message: "Error" });
    });
};

const getAllPostsLocationAZ = (req, res) => {
  let posts = [];
  firebase.admin
    .firestore()
    .collection("posts")
    .orderBy("location")
    .orderBy("date", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      res.send(posts);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ e, message: "Error" });
    });
};

module.exports = {
  getPost,
  getPostsForUser,
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getAllPostsLocationAZ
};
