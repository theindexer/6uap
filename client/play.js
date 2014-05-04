Template.container.helpers({
  //!! is a quick boolean cast
  ready : function() { //if not loading && gameId obtained
    return !!!Session.get("loading") && !!Session.get("gameId")
  },
  isLoading : function() { //if loading
    return !!Session.get("loading")
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
        tempTiles[i].push(tempBoard[tempTiles[i]])
      }
      Meteor.call('createGame', tempTiles, function(err, gameId) {
        MahjonggRouter.navigate("/game/" + gameId, {trigger:"true"});
      })
    })
  }
});

