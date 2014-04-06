Template.container.helpers({
  ready : function() {
    return !!Session.get("gameId")
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

