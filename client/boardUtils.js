isFree = function(tile, configuration) { 
 var x = tile[0]
 var y = tile[1]
 var z = tile[2]
 for(var i = x-1; i <= x + 1; i++) {
   for(var j = y-1; j<= y+1; j++) {
     if(configuration[[i,j,z + 1]] != null) {
       return false;
     }
   }
 }
 var i = x - 2
 for(var j = y - 1; j <= y + 1; j++) {
   if(configuration[[i, j, z]] != null) {
     i = x + 2
     for(var k = y - 1; k <= y + 1; k++) {
       if(configuration[[i, k, z]] != null) {
         return false;
       }
     }
     break;
   }
 }
 return true;
} 

resetBoard = function(aBoard) {
  var temp = _(aBoard).clone()
  var tiles = _.keys(temp) //144 tiles
  tiles = _.shuffle(tiles)
  var tileGroups = {}
  var tileStyles = _.shuffle(_.range(72)) //72 pairs
  //there are 36 different tiles
  for(var i = 0; i < 36; i++) {
    tileGroups[tileStyles.pop()] = i;
    tileGroups[tileStyles.pop()] = i;
  }
  var currentTile = 0;
  var pairing = null;
  var flower = 0
  var season = 0
  while(tiles.length > 0) {
    //go through and look for free tiles
    for(var i = 0; i < tiles.length; i++) {
      if (pairing != i && isFree(tiles[i], temp)) {
        if (pairing != null) { //we're matching this to a tile
          var style = tileGroups[currentTile]
          if(style == 34) {  //flower
            aBoard[tiles[pairing]] = [34,flower++]
            aBoard[tiles[pairing]] = [34,flower++]
          } else if (style == 35) { //season
            aBoard[tiles[pairing]] = [35,season++]
            aBoard[tiles[pairing]] = [35,season++]
          } else {
            aBoard[tiles[pairing]] = [tileGroups[currentTile]];
            aBoard[tiles[i]] = [tileGroups[currentTile]];
          }
          delete temp[tiles[pairing]];
          delete temp[tiles[i]];
          var bigger = Math.max(pairing, i)
          var smaller = Math.min(pairing, i)
          tiles.splice(bigger,1)
          tiles.splice(smaller,1)
          pairing = null;
          currentTile++;
          break;
        } else {
          pairing = i; //we will match next free tile here
        }
      }
    }
  }
} 
