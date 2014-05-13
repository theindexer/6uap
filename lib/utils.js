getTime = function(time) {
var seconds = Math.floor(time / 1000);
var minutes = Math.floor(seconds / 60);
var hours = Math.floor(minutes / 60);
var days = Math.floor(hours / 24);
minutes = minutes % 60
seconds = seconds % 60
hours = hours % 24
return [days, hours, minutes, seconds]
}

formatTime = function(time) {
  var timeString;
  var days = time[0]
  var hours = time[1]
  var minutes = time[2]
  var seconds = time[3]

  timeString = days > 0 ? (days + " day" + (days > 1 ? "s" : "") + " "):""
  timeString += hours > 0 ? (hours + " hour" + (hours > 1 ? "s" : "") + " ") : ""
  timeString += minutes > 0 ? (minutes + " minute" + (minutes > 1 ? "s" : "") + " ") : ""
  timeString += seconds > 0 ? (seconds + " second" + (seconds > 1 ? "s" : "") + " ") : ""
    
  return timeString
}

startWatch = function() {
  stopwatch = Date.now()
}

stopWatch = function() {
  var total = Date.now() - stopwatch
  console.log("Took " + total + " ms")
}

takeScreenshot = function(gameId) {
  console.log(gameId)
  var tiles = Games.findOne(gameId).layout
  tiles = _.sortBy(tiles, function(tile) { return 10000 + tile[2] * 1000 - tile[0] *50 + 50 * tile[1] })
  var canvas = document.createElement("canvas")
  canvas.width = 300;
  canvas.height = 300;
  ctx = canvas.getContext('2d');
  var drawn = 0
  tiles.forEach(function(tile) {
    var image = new Image();
    var x = tile[0]; var y = tile[1]; var z = tile[2]
    image.onload = function() {
      drawn++
      ctx.drawImage(image, x*18/2 + 2*z, y*28/2-z*3,20,30)
      if(drawn == 144) {
        Games.update(gameId, {$set:{'screenshot':canvas.toDataURL()}});
      }
    }
    image.src = "tiles-" + tile[3] + "-00.png"
  })
  
}
