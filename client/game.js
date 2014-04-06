Template.game.helpers({
  tiles: function() {
    return Tiles.find({"game" : Session.get("gameId")});
  },
  height: function(x, y, z) {
    return y * 65 / 2 - z * 3;
  },
  width: function(x, y, z) {
     return x * 47 / 2 + z*3;
  },
  zindex: function(x,y,z) {
    return z * 1000 - x*50 + 50 * y
  }
});

Template.game.events({
 'click .tile': function(event) {
    if(isFree([this.x,this.y,this.z], board)) {
      //var elem = event.currentTarget;
      //$(elem).addClass("active-tile");
      Tiles.remove(this._id);
    }  
  }
});

board={}
Tiles = new Meteor.Collection("tiles")
Deps.autorun(function(){
  var grid = Tiles.find({"game" : Session.get("gameId")});
  board={}
  grid.forEach(function(tile) {
    board[[tile.x,tile.y,tile.z]]=tile
  });
});


