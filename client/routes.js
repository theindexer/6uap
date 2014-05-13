var Router = Backbone.Router.extend({
  routes : {
    "" : 'home',
    "game/:id" : 'loadGame',
    "challenge/:id" : 'challengeGame'
  },
  recentSub:null,
  home : function() {
    Meteor.subscribe('recentGames');
    Session.set("gameId", null)
  },

  loadGame : function(id) {
    Session.set("loading", true)
    Session.set("gameId", id)
    Session.set("gameover", false)
  },

  challengeGame : function(id) {
    Session.set("loading", true);
    var sub = Meteor.subscribe("a-game", id, function() {
      var game = Games.findOne(id);
      sub.stop();
      if(game) {
        Meteor.call("copyGame", game, function(err, newId) {
          window.location.hash="/game/" + newId;
        })
      }
      else {
      }
   });
 }
});

MahjonggRouter = new Router();
Backbone.history.start();
