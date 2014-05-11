timerHandle = 0
max_height = 600.0
max_width = 800.0
tile_width = 49
tile_height = 68
padding = 25
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
  board_style: function() {
    return "width:" + (padding + tile_width * scale.get() * 15) + "px;height:" +
    (padding + 20 + 7 + (tile_height - 7) * scale.get() * 8) + "px"
  },
  share_link: function() {
    return window.location.host + "/#game/" + Session.get("gameId")
  },
  userid: function() {
    return Meteor.userId();
  },
  tiles: function() {
    return Tiles.find({game:Session.get("gameId")});
  },
  relay_tile:function() {
    activeTiles.invalidate();
  },
  css_style: function() {
    var type = this.type
    var subtype = this.subtype
    var x = this.x
    var y = this.y
    var z = this.z
    return "background:url('tiles-" + type + "-0" + (subtype != null ? subtype : 0) + ".png') 0 0/100%;position:absolute;TOP:" +
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
  },
  time_remaining : function() {
    return timer_time.get()
  },
  done : function() {
    if(Session.get("gameover") && !Games.findOne(Session.get("gameId")).status) {
      var complete = 1
      if (_.isEmpty(board)) {
        complete = 2
      }
      clearInterval(timerHandle);
      var time = new Date();
      time = time.getTime() - get_time().getTime();
      Games.update(Session.get("gameId"), {$set:{'status':complete,'elapsed':time}});
    } else if (Games.findOne(Session.get("gameId")).status) { 
      return true;
    }
    return false;
  },
  challenge_time: function() {
    var game = Games.findOne(Session.get("gameId")).original
    if(!game) {
      return
    }
    var time = Games.findOne(Session.get("gameId")).originalT
    return "Time to beat: " + formatTime(getTime(time)) 
  },
  rescale: function() {
    getScale()
  }
});
timer_time = {
  time:"Not yet started",
  dep: new Deps.Dependency,
  set: function(timeString) {
    this.time = timeString;
    this.dep.changed()
  },
  get: function() {
    this.dep.depend();
    return this.time;
  }
}

timer = function() {
  var started = get_time();
  if (started == -1) {
    timer_time.set("Not yet started");
    return;
  }
  var now = new Date();
  var time = now.getTime() - started.getTime();
  var timeString = formatTime(getTime(time))
  timeString += "elapsed"
  timer_time.set(timeString);
}
startTimer = function() {
  timerHandle = setInterval("timer()", 1000);
}

//on resize, recompute sizes and invalidate layout
$(window).resize(function() {
  getScale()
});
var getScale = function() {
 var width = $(window).width();
 var height = $(window).height();
 var w_scale = Math.min(1, width/max_width);
 var h_scale = Math.min(1, height/max_height);
 scale.num = Math.min(w_scale, h_scale);
 scale.invalidate()
} 
var get_time = function() {
  return Games.findOne(Session.get("gameId")).time_started;
}
var y_offset = function(x, y, z) {
  return padding + scale.get() * (y * (tile_height - 7) / 2 - z * 6);
};
var x_offset = function(x, y, z) {
   return padding + scale.get() * (x * (tile_width - 6) / 2 + z * 5);
};
var zindex = function(x,y,z) {
  return 10000 + z * 1000 - x*50 + 50 * y
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
debug = false
Template.game.events({
 'click' : function(event) {
    console.log(event)
  },
 'click .tile': function(event) {
    //if the tile clicked is free...
    if(debug || isFree([this.x,this.y,this.z], board)) {
      //and another free tile has been clicked
      if(activeTiles.get() != null && activeTiles.get()._id != this._id) {
        var activeTile = activeTiles.get()
        //and we're matching types
        if(debug || (this.type == activeTile.type)) {
          //hide the overlay, remove the tiles
          Meteor.call("remove", this._id, activeTile._id, function(err, result) {
          if(!err && result != -1) {
            var myScore = Scores.findOne({game:Session.get("gameId"),user:Meteor.userId()})
            if(!myScore) {
              var scoreObj = {
                game:Session.get("gameId"),
                user:Meteor.userId(),
                score:1
              }
              Scores.insert(scoreObj)
            } else {
              Scores.update(myScore._id,{$inc:{score:1}});
            }
            Session.set("removedTiles",Session.get("removedTiles") + 1)
          }});
          //Tiles.remove(this._id);
          //Tiles.remove(activeTile._id);
          activeTiles.set(null);
          if(get_time() == -1) {
            Games.update({_id:Session.get("gameId")},{$set:{time_started: new Date()}});
          }
        } else { //otherwise make this the active tile
          moveActiveTile(this, event);
        }
      } else { //otherwise make this the active tile
        moveActiveTile(this, event);
      }
    }  
  },
 'click .cheat-lose': function(event) {
    var col = Tiles.find()
    var i = 0
    col.forEach(function(tile) {
      if(i < col.count() - 2) {
        Tiles.remove(tile._id);
        i++
      }
    })
  },
 'click .cheat-win': function(event) {
    var col = Tiles.find()
    var i = 0
    col.forEach(function(tile) {
      Tiles.remove(tile._id);
    })
  }
});

//in meteor version, just moves around activeTile
function moveActiveTile(tile, event) {
  activeTiles.set(tile);
}
board={}

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
  if(Session.get("loading")) { return }
  var grid = Tiles.find({"game" : Session.get("gameId")});
  board={}
  grid.forEach(function(tile) {
    board[[tile.x,tile.y,tile.z]]=tile.type
  });
  freeSpots = {}
  numMoves.num = 0
  grid.cursor_pos = 0;
  var stillActive = false;
  grid.forEach(function(tile) {
    if(activeTiles.tiles != null && activeTiles.tiles._id == tile._id) {
      stillActive = true;
    }
    var tilearr = [tile.x, tile.y, tile.z];
    if(isFree(tilearr,board)) {
      if(!freeSpots[tile.type]) {
        freeSpots[tile.type] = 1;
      } else {
        numMoves.num += freeSpots[tile.type]++;
      }
    }
  });
  if(!stillActive) { activeTiles.set(null); }
  if((grid.count() % 2 ==0) &&numMoves.num == 0) {
    console.log(grid.count() + "f u")
    Session.set("gameover",true);
  }
  numMoves.invalidate();
});
subG = null
subT = null
Deps.autorun(function() {
  //these subs should be stopped automagically but I think my redirects are screwing with them
  if(subG) {
    subG.stop()
  }
  if(subT) {
    subT.stop()
  }
  subG = Meteor.subscribe("a-game", Session.get("gameId"), function() {
    startTimer();
    subT = Meteor.subscribe("tiles", Session.get("gameId"), function() {
      Session.set("loading", false)
    });
  });
});

Deps.autorun(function() {
  Meteor.subscribe("chats", Session.get("gameId"));
  Meteor.subscribe("scores", Session.get("gameId"));
})
