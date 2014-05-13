Template.container.helpers({
  //!! is a quick boolean cast
  ready : function() { //if not loading && gameId obtained
    return !!!Session.get("loading") && !!Session.get("gameId")
  },
  isLoading : function() { //if loading
    return !!Session.get("loading")
  }
});
 
Template.main.helpers({
  recentGames: function() {
    var cursor = Games.find();
    var temp = []
    var grid = []
    cursor.forEach(function(game) {
      temp.push(game)
    });
    while(temp.lenth > 4) {
      grid.push({'row':temp.slice(0,4)})
    }
    grid.push({'row':temp})
    return grid;
  },
  challenge_time: function() {
    return formatTime(getTime(this.elapsed))
  }
});
 
Template.main.events({
  'click .new-game': function(e) {
    Session.set("loading", true)
    var tempTiles = []
    var tempBoard = {}
    $.getJSON("turtle.json", function(data) {
      tempTiles = data;
      _.each(tempTiles, function(tile) {
      tempBoard[tile] = 1;
      })
      resetBoard(tempBoard);
      for(var i = 0; i < tempTiles.length; i++) {
        //add style to [x,y,z]
        tempTiles[i] = tempTiles[i].concat(tempBoard[tempTiles[i]])
      }
      Meteor.call('createGame', tempTiles, function(err, gameId) {
        MahjonggRouter.navigate("/game/" + gameId, {trigger:"true"});
      })
    })
  }
});

