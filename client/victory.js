Template.victory.helpers({
  time : function () {
    var time = Games.findOne().elapsed;
    return formatTime(getTime(time))
  },
  link: function() {
    return get_link();
  },
  hiscore : function() {
    var hiscore = Scores.findOne({},{sort:{score:-1}})
    return hiscore.user + " scored the most with " + hiscore.score + " pairs removed!"
  }
})

function get_link() {
  return window.location.host + "/#challenge/" + Games.findOne()._id
}
