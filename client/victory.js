Template.victory.helpers({
  time : function () {
    var time = Games.findOne(Session.get("gameId")).elapsed;
    return formatTime(getTime(time))
  },
  link: function() {
    return get_link();
  },
  hiscore : function() {
    var hiscore = Scores.findOne({game:Session.get("gameId")},{sort:{score:-1}})
    return hiscore.user + " scored the most with " + hiscore.score + " pairs removed!"
  },
  your_score: function() {
    return Scores.findOne({game:Session.get("gameId"),user:Meteor.userId()}).score
  }
})

function get_link() {
  return window.location.host + "/#challenge/" + Games.findOne()._id
}
