max_height = 600.0
max_width = 800.0
tile_width = 49
tile_height = 68
scale = {
  dep: new Deps.Dependency,
  num: 1.0,
  get: function() {
    this.dep.depend();
    return this.num;
  },
  invalidate: function() {
    this.dep.changed();
  }
}

Template.game.helpers({
  tiles: function() {
    return Tiles.find();
  },
  relay_tile:function() {
    activeTiles.invalidate();
  },
  css_style: function(type, x, y, z) {
    return "background:url('tiles-" + type + "-00.png') 0 0/100%;position:absolute;TOP:" +
    y_offset(x, y, z) + "px;LEFT:" + x_offset(x, y, z) +
    "px;z-index:" + zindex(x, y, z)+";width:"+(tile_width * scale.get()) + "px;height:" + (tile_height * scale.get())+"px"
  },  
  remainingMoves: function() {
    var moves = numMoves.get();
    var moveString = " move";
    if(moves != 1) { moveString += "s" }
    return moves + moveString + " remaining";
  },
  //if active tile, set css to show overlay over active tile
  active_tile_style : function() {
    if (activeTiles.get() == null) {
      return "visibility:hidden;";
    } else {
      var tile = activeTiles.get();
      var x = tile.x; var y = tile.y; var z = tile.z;
      css = "z-index:" + (zindex(x,y,z)+1) +";visibility:visible;left:" +
      (x_offset(x,y,z) + 5 * scale.get()) + "px;top:" + y_offset(x,y,z) + 
      "px;width:" + (tile_width-5)*scale.num + 
      "px;height:" + (tile_height-8) * scale.num + "px;"
      return css;
    }
  }
});

//on resize, recompute sizes and invalidate layout
$(window).resize(function() {
 var width = $(window).width();
 var height = $(window).height();
 var w_scale = Math.min(1, width/max_width);
 var h_scale = Math.min(1, height/max_height);
 scale.num = Math.min(w_scale, h_scale);
 scale.invalidate()

}); 

var y_offset = function(x, y, z) {
  return 50 + scale.get() * (y * (tile_height - 7) / 2 - z * 6);
};
var x_offset = function(x, y, z) {
   return 50 + scale.get() * (x * (tile_width - 6) / 2 + z * 5);
};
var zindex = function(x,y,z) {
  return z * 1000 - x*50 + 50 * y
};
var tileX = function(type) {
  return -64 * type;
}

//reactive version of activeTile
activeTiles = {
  tiles : null,
  get : function() {
    this.dep.depend();
    return this.tiles;
  },
  set : function(items) {
    this.tiles = items;
    this.dep.changed();
  },
  dep: new Deps.Dependency,
  invalidate: function() {
    this.dep.changed();
  }
}
debug = true
Template.game.events({
 'click .tile': function(event) {
    //if the tile clicked is free...
    if(debug || isFree([this.x,this.y,this.z], board)) {
      //and another free tile has been clicked
      if(activeTiles.get() != null && activeTiles.get()._id != this._id) {
        var activeTile = activeTiles.get()
        //and we're matching types
        if(this.type == activeTile.type) {
          //hide the overlay, remove the tiles
          $(".active-tile").css({visibility:"hidden"});
          Tiles.remove(this._id);
          Tiles.remove(activeTile._id);
          activeTiles.set(null);
        } else { //otherwise make this the active tile
          moveActiveTile(this, event);
        }
      } else { //otherwise make this the active tile
        moveActiveTile(this, event);
      }
    }  
  }
});

//in meteor version, just moves around activeTile
function moveActiveTile(tile, event) {
        activeTiles.set(tile);
}
board={}
Tiles = new Meteor.Collection("tiles")

//displays the number of possibilities left
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
        console.log(tile)
        numMoves.num += freeSpots[tile.type]++;
      }
    }
  });
  numMoves.invalidate();

});


