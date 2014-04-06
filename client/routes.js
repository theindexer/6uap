var Router = Backbone.Router.extend({
  routes : {
    "" : 'home',
    "game/:id" : 'loadGame'
  },

  home : function() {
  },

  loadGame : function(id) {
    Session.set("gameId", id)
  }

});

MahjonggRouter = new Router();
Backbone.history.start();
