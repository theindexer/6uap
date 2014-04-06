getBoard = function() {
  var arr = []
  var result = []
  for(var i = 0; i < 36; i++) {
    arr.push(i);
  }
  while(arr.length != 0) {
    index = Math.floor(Math.random() * arr.length)
    for(var i = 0; i < 4; i++) {
      var tile = {
        group : index
      };
      result.push(tile);
    }
    arr.splice(index, 1)
  }
  return result;
}  


getTurtle = function(){
  var turtle = {}
  turtle = JSON.parse(Assets.getText("turtle.json"))
  return turtle
}
