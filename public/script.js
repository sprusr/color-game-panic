Pusher.logToConsole = true;

var pusher = new Pusher("3409e87f00025d97cb39", {
  cluster: "eu",
  encrypted: true
});

var channel = pusher.subscribe("game");

channel.bind("new-round", function(data) {
  $("#colors").css("display", "none");
  $("#message").css("display", "block").text("New round starting in 3 seconds.");
})

channel.bind("round-start", function(d) {
  $.get("/colors", function(data) {
    for (var i = 0; i < data.colors.length; i++) {
      $("#color" + i)
        .css("color", data.colors[i][0])
        .css("background-color", data.colors[i][1])
        .text(data.colors[i][0])
        .click(function(e) {
          console.log(e.target.style.backgroundColor)
          $.post("/press", { color: [e.target.innerHTML, e.target.style.backgroundColor], socket: pusher.connection.socket_id }, function(data) {
            if (data.success) {
              $("#colors").css("display", "none");
              $("#message").css("display", "block").text("You won the round. Congrats.");
            } else {
              $("#colors").css("display", "none");
              $("#message").css("display", "block").text("Wrong.");
            }
          });
        });
    }
  })

  $("#message").css("display", "none");
  $("#colors").css("display", "flex");
});

channel.bind("round-won", function(data) {
  $("#colors").css("display", "none");
  $("#message").css("display", "block").text("You lost the round.");
});

channel.bind("game-won", function(data) {
  $("#colors").css("display", "none");
  $("#message").css("display", "block").text("You lost the game. The game.");
});
