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
        subtype:tile[4],
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
      original: oldGame._id,
      originalT: oldGame.elapsed
    });
    _.each(oldGame.layout, function(tile) {
      var tempTile = {
        x:tile[0],
        y:tile[1],
        z:tile[2],
        type:tile[3],
        subtype:tile[4],
        game : gameId
      }
      Tiles.insert(tempTile)
    });
    console.log(gameId);
    return gameId;
  }, 
  remove: function(id, id2) {
    var aTile = Tiles.findOne({_id:id2})
    if(aTile == null) { return -1 }
    if(Tiles.remove(id) == 0) { return -1 }
    Tiles.remove(id2)
    return 2
  }
  });
Meteor.publish('a-game', function(gameId) {
  return Games.find({_id:gameId});
});

Meteor.publish('tiles', function(gameId) {
  return Tiles.find({game:gameId});
});

Meteor.publish('chats', function(gameId) {
  return Chats.find({game:gameId})
});

Meteor.publish('scores', function(gameId) {
  return Scores.find({game:gameId})
});

Meteor.publish('recentGames', function() {
  return Games.find({'status':2},{sort:{finished:-1},limit:8})
})

//var gameOver = Games.find()
//get phantomjs to work?
/*gameOver.observeChanges({
  changed: function(id, fields) {
    if (fields['status'] == 2) {
      var page = Npm.require('phantomjs').create();
      page.viewportSize = { width:300, height:300 };
      page.content='<html><body><canvas id="canvas"></canvas></body></html>'
      page.evaluate(function() {
        var tiles = Games.find(id).layout;
        tiles = _.sortBy(tiles, function(tile) { return 10000 + tile[2] * 1000 - tile[0] *50 + 50 * tile[1] })
        var canvas = document.getElementById('canvas')
        canvas.width=300;
        canvas.height=300;
	ctx = canvas.getContext('2d');
	var drawn = 0
	tiles.forEach(function(tile) {
	  var image = new Image();
	  var x = tile[0]; var y = tile[1]; var z = tile[2]
	  image.onload = function() {
	    drawn++
	    ctx.drawImage(image, x*36/2 + 4*z, y*55/2-z*5,40,60)
	    if(drawn == 144) {
	      return canvas.toDataURL()
	    }
	  }
	image.src = "tiles-" + tile[3] + "-00.png"
        })
      })
    }
  }
});*/
