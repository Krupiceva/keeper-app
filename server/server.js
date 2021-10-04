//external node module for environment variables, need to be on top
require('dotenv').config()

//external node modules, installed via npm
const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path");

//const cors = require("cors");

const PORT = process.env.PORT || 4747;
const DB_URI = "mongodb://localhost:27017/"
const DB = "keeperDB";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());

//Database initialization
mongoose.connect(DB_URI + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   connectTimeoutMS: 10000
});

const db = mongoose.connection;

// Event listeners
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to ${DB} database`));

//Note Schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Create Model
let NoteModel = db.model("Note", noteSchema);

//REST for route /notes (GET, POST)
app.route("/api/notes")
.get(function(req, res) {
  NoteModel.find({}, {__v: 0}, (err, foundNotes) => {
    if (!err) {
      res.json(foundNotes)
    } else {
      res.status(400).json({"error": err});
    }
  })
})
.post(function(req, res) {
  const newNote = new NoteModel({
    title: req.body.title,
    content: req.body.content
  });
  newNote.save((err, result) => {
      if (!err) {
         delete result._doc.__v;
         res.json(result._doc);
      } else {
         res.status(400).json({"error": err});
      }
   });
});

app.route("/api/notes/:id")
.delete(function(req, res){
  NoteModel.findById(req.params.id, function(err, note) {
      if (!note) {
        res.status(404).send("Note not found.");
      } else {
        NoteModel.findByIdAndRemove(req.params.id)
          .then(() => {
              res.status(200).json("Note deleted.");
            })
          .catch(err => {
            res.status(400).send("Note delete failed. Error: " + err);
          });
      }
    });
});


app.listen(process.env.PORT || 4747, function() {
  console.log("Server started successffuly");
});
