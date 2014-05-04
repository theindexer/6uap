Template.gameover.helpers({
  defeated : function() {
    return Games.findOne().status == 1
  }
})
