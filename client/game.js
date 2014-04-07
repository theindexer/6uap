Template.game.helpers({
  tiles: function() {
    return Tiles.find({"game" : Session.get("gameId")});
  },
  y_offset: function(x, y, z) {
    return 50 + y * 64 / 2 - z * 4;
  },
  x_offset: function(x, y, z) {
     return 50 + x * 46 / 2 + z*3;
  },
  zindex: function(x,y,z) {
    return z * 1000 - x*50 + 50 * y
  },
  remainingMoves: function() {
    var moves = numMoves.get();
    var moveString = " move";
    if(moves > 1) { moveString += "s" }
    return moves + moveString + " remaining";
  }
});
activeTile = null;
Template.game.events({
 'click .tile': function(event) {
    //if the tile clicked is free...
    if(isFree([this.x,this.y,this.z], board)) {
      //and another free tile has been clicked
      if(activeTile != null && activeTile != this) {
        //and we're matching types
        if(this.type == activeTile.type) {
          //hide the overlay, remove the tiles
          $(".active-tile").css({visibility:"hidden"});
          Tiles.remove(this._id);
          Tiles.remove(activeTile._id);
          activeTile = null;
        } else { //otherwise make this the active tile
          moveActiveTile(this, event);
        }
      } else { //otherwise make this the active tile
        moveActiveTile(this, event);
      }
    }  
  }
});

//move the thing that shows which tile is active
function moveActiveTile(tile, event) {
        activeTile=tile;
        var elem = event.currentTarget;
        var offset = $(elem).position();
        var zindex = Number($(elem).css("z-index")) + 1;
        $(".active-tile").css({'z-index':zindex,visibility:"visible",left:offset["left"]+4,top:offset["top"]})
}
board={}
Tiles = new Meteor.Collection("tiles")

numMoves = {
  dep: new Deps.Dependency,
  num: 0,
  get: function() {
    this.dep.depend();
    return this.num;
  },
  invalidate: function() {
    this.dep.changed();
  }
}
//rebuild the board structure on update
Deps.autorun(function(){
  var grid = Tiles.find({"game" : Session.get("gameId")});
  board={}
  grid.forEach(function(tile) {
    board[[tile.x,tile.y,tile.z]]=tile.type
  });
  freeSpots = {}
  numMoves.num = 0
  grid.cursor_pos = 0;
  grid.forEach(function(tile) {
    var tilearr = [tile.x, tile.y, tile.z];
    if(isFree(tilearr,board)) {
      if(!freeSpots[tile.type]) {
        freeSpots[tile.type] = 1;
      } else {
        numMoves.num += freeSpots[tile.type]++;
      }
    }
  });
  numMoves.invalidate();

});


