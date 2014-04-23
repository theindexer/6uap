Meteor.methods({
  //Start a new Mahjong game
  createGame : function() {
    var gameId = Games.insert({
      time: new Date()
    }) //create a new board
    var turtletiles = []
    var turtle={}
    //load the layout - array of tiles
    //not object because that's really annoying
    turtletiles = JSON.parse(Assets.getText("turtle.json"))
    //create an object to track the layout
    _.each(turtletiles, function(tile) {
      turtle[tile]=1
    });
    //generate a new tile covering
    resetBoard(turtle);
    //insert tiles into the collection/mongo db
    _.each(turtletiles, function(tile) {
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

Meteor.publish('tiles', function(gameId) {
  return Tiles.find({game:gameId});
});
