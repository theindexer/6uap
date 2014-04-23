Template.container.helpers({
  //!! is a quick boolean cast
  ready : function() { //if not loading && gameId obtained
    return !!!Session.get("loading") && !!Session.get("gameId")
  },
  isLoading : function() { //if loading
    return !!Session.get("loading")
  }
});
  
Template.main.events({
  'click .new-game': function(e) {
    Meteor.call('createGame', function(err, gameId) {
      MahjonggRouter.navigate("/game/" + gameId, {trigger:"true"});
    } 
   )
  }
});

