Template.victory.helpers({
  time : function () {
    var time = Games.findOne().elapsed;
    var seconds = Math.floor(time / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    minutes = minutes % 60
    seconds = seconds % 60

    var timeString;

    timeString = days > 0 ? (days + " day" + (days > 1 ? "s" : "") + " "):""
    timeString += hours > 0 ? (hours + " hour" + (hours > 1 ? "s" : "") + " ") : ""
    timeString += minutes > 0 ? (minutes + " minute" + (minutes > 1 ? "s" : "") + " ") : ""
    timeString += seconds > 0 ? (seconds + " second" + (seconds > 1 ? "s" : "") + " ") : ""
    
    return timeString
  },
  link: function() {
    return get_link();
  }
})

function get_link() {
  return window.location.host + "/#challenge/" + Games.findOne()._id
}
