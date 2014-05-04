Meteor.methods({
  //Start a new Mahjong game
  createGame : function(tiles) {
    var gameId = Games.insert({
      time: new Date(),
      time_started: -1,
      layout: tiles
    }) 
    _.each(tiles, function(tile) {
      var tempTile = {
        x:tile[0],
        y:tile[1],
        z:tile[2],
        type:tile[3],
        game : gameId
      }
      Tiles.insert(tempTile)
    });
    return gameId;
  },
  copyGame: function(oldGame) {
    var gameId = Games.insert({
      time: new Date(),
      time_started: -1,
      layout: oldGame.layout,
      original: oldGame._id
    });
    _.each(oldGame.layout, function(tile) {
      var tempTile = {
        x:tile[0],
        y:tile[1],
        z:tile[2],
        type:tile[3],
        game : gameId
      }
      Tiles.insert(tempTile)
    });
    console.log(gameId);
    return gameId;
  } 
 });
Meteor.publish('a-game', function(gameId) {
  return Games.find({_id:gameId});
});

Meteor.publish('tiles', function(gameId) {
  return Tiles.find({game:gameId});
});
