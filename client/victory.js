Template.victory.helpers({
  time : function () {
    var time = Games.findOne().elapsed;
    return formatTime(getTime(time))
  },
  link: function() {
    return get_link();
  }
})

function get_link() {
  return window.location.host + "/#challenge/" + Games.findOne()._id
}
