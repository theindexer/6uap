Meteor.methods({
  createGame : function() {
    var gameId = Games.insert({
      time: new Date()
    })
    var turtle = {}
    turtle = JSON.parse(Assets.getText("turtle.json"))
    resetBoard(turtle);
    _.each(_.keys(turtle), function(tile) {
      var tempTile = {
        x:tile[0],
        y:tile[1],
        z:tile[2],
        type:turtle[tile],
        game : gameId
      }
      Tiles.insert(tempTile)
    });
    return gameId;
  }
});
