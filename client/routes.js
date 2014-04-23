var Router = Backbone.Router.extend({
  routes : {
    "" : 'home',
    "game/:id" : 'loadGame'
  },

  home : function() {
  },

  loadGame : function(id) {
    Session.set("loading", true)
    Session.set("gameId", id)
    Meteor.subscribe("tiles", id, function() {
      Session.set("loading", false)
   });
  }

});

MahjonggRouter = new Router();
Backbone.history.start();
