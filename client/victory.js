Template.victory.helpers({
  time : function () {
    return Games.findOne().elapsed
  },
  link: function() {
    return get_link();
  }
})

function get_link() {
  return window.location.host + "/#challenge/" + Games.findOne()._id
}
