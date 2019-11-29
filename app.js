const express = require('express')
const server = express();
CircularJSON = require('circular-json')

var bodyParser = require("body-parser");
server.use(express.static('./project'))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())


// ----- Data Base start ---------
// ---------local link start-------
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/sams-spin', { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log("Database Connncted.");
//   });
// ---------local link end-------



// ------online link start---------
var mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://samtufail:Dell@2019@spindb-gm9jn.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected with Cluster');
});
// ------online link start---------



var parties = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});
var teams = new mongoose.Schema({
  name: String,
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parties'
  },

});
var persons = new mongoose.Schema({
  name: String,
  number: {
    type: Number,
    required: true,
    unique: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parties'
  },
});

var party = mongoose.model('parties', parties);
var team = mongoose.model('teams', teams);
var person = mongoose.model('persons', persons);

// --------- Party  start ---------

server.get('/addParty', function (req, res) {
  var addParty = new party({ name: "party" });
  res.send("party saved.")
  addParty.save(function (err, result) {
    if (err)
      return console.error(err);
    // console.log(result)
  });
});
server.get('/deleteParty', function (req, res) {
  party.deleteOne({ name: 'party' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
  });
  res.send("party Deleted.")
});
server.get('/updateParty', function (req, res) {
  var query = { name: 'party' };
  party.findOneAndUpdate(query, { name: 'updateparty' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
  })
  res.send("party Updated.")
});
server.get('/allParty', function (req, res) {
  party.find(function (err, result) {
    if (err)
      return console.error(err);
    // console.log(result)
    res.send(result)
  });
});
// --------- Party  End ---------

// --------- Team  start ---------

server.get('/addteam', async function (req, res) {
  var partyID;
  await party.find({ name: 'party' }, function (err, result) {
    if (err)
      return console.error(err);
    partyID = result
  });
  res.send(partyID[0]._id);
  var addTeam = new team({ name: "team", party: partyID[0]._id });
  // res.send("Team saved.")
  addTeam.save(function (error) {
    if (!error) {
      team.find({})
        .populate('party')
        // .populate('comments.postedBy')
        .exec(function (error, posts) {
          console.log(JSON.stringify(posts, null, "t"))
        })
    }
  });
});
server.get('/deleteteam', function (req, res) {
  team.deleteOne({ name: 'team' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
  });
  res.send("Team Deleted.")
});
server.get('/updateteam', function (req, res) {
  var query = { name: 'team' };
  team.findOneAndUpdate(query, { name: 'updatedteam' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
  })
  res.send("Team Updated.")
});
server.get('/allteam', function (req, res) {
  team.find({})
  .populate('party')
  .exec(function (error, posts) {
    console.log(JSON.stringify(posts))
    res.send((posts))
  })
});
// --------- Team  End ---------

// --------- Person  start ---------

server.get('/addperson', async function (req, res) {
  var partyID;
  await party.find({ name: 'party' }, function (err, result) {
    if (err)
      return console.error(err);
    partyID = result
  });
  res.send(partyID[0]._id);
  var addPerson = new person({ name: "person", number: 2, party: partyID[0]._id });
  addPerson.save(function (error) {
    if (!error) {
      person.find({})
        .populate('party')
        .exec(function (error, posts) {
          console.log(JSON.stringify(posts, null, "t"))
        })

    }
    console.log(error)
  });
  // res.send(jamia)
});
server.get('/deleteperson', function (req, res) {
  person.deleteOne({ name: 'person' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
  });
  res.send("person Deleted.")
});
server.get('/updateperson', function (req, res) {
  var query = { name: 'person' };
  person.findOneAndUpdate(query, { name: 'updatedperson' }, function (err, result) {
    if (err)
      return console.error(err);
    console.log(result)
    res.send("person Updated.")
  })
});
server.get('/allperson', function (req, res) {
  person.find({})
  .populate('party')
  .exec(function (error, posts) {
    console.log(JSON.stringify(posts))
    res.send((posts))
  })
});
// --------- Person  End ---------

// ----- Data Base End -----------

server.listen(2000, () => {
  console.log('Example app listening on port 2000!')
});