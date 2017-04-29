var config = require("./config")
var express = require("express")
var bodyParser = require("body-parser")
var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var Pusher = require("pusher")

var pusher = new Pusher(config.pusher)

var gameStarted = false
var chosenColor = ""

var colors = [
  ['red', 'blue'],
  ['red', 'green'],
  ['red', 'orange'],
  ['red', 'black'],
  ['yellow', 'blue'],
  ['yellow', 'green'],
  ['yellow', 'orange'],
  ['yellow', 'black'],
  ['purple', 'blue'],
  ['purple', 'green'],
  ['purple', 'orange'],
  ['purple', 'black'],
  ['black', 'blue'],
  ['black', 'green'],
  ['black', 'orange'],
  ['black', 'purple']
]

var newColors = []

app.post("/press", function(req, res) {
  console.log("pressed", req.body.color, "chosen", chosenColor)
  if (req.body.color[0] == chosenColor[0] && req.body.color[1] == chosenColor[1]) {
    res.json({ success: true })
    pusher.trigger("game", "round-won", {}, req.body.socket)
    setTimeout(newRound, 1000)
  } else {
    res.json({ success: false })
  }
})

app.get("/start", function(req, res) {
  if (!gameStarted) {
    gameStarted = true
    newRound()
    res.send("game started")
  } else {
    res.send("the game is already running")
  }
})

app.get("/colors", function(req, res) {
  var newNewColors = newColors.slice(0)
  var chosenColors = [chosenColor, newNewColors.popRandom(), newNewColors.popRandom(), newNewColors.popRandom()]
  shuffle(chosenColors)
  res.json({ colors: chosenColors })
})

app.use(express.static("public"))

app.listen(8000)

function shuffle (a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

Array.prototype.popRandom = function () {
  var rand = Math.floor(Math.random()*this.length)
  var returnVal = this[rand]
  this.splice(this[rand], 1)
  return returnVal
}

var newRound = function () {
  newColors = colors.slice(0)
  chosenColor = newColors.popRandom()

  console.log(chosenColor)

  pusher.trigger("game", "new-round", {})
  setTimeout(function() {
    pusher.trigger("game", "round-start", {})
  }, 3000)
}
