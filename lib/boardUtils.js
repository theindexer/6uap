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
  var tiles = _.keys(temp)
  tiles = _.shuffle(tiles)
  var tileGroups = {}
  var tileStyles = _.shuffle(_.range(72))
  for(var i = 0; i < 36; i++) {
    tileGroups[tileStyles.pop()] = i;
    tileGroups[tileStyles.pop()] = i;
  }
  var currentTile = 0;
  var pairing = null;
  while(tiles.length > 0) {
    for(var i = 0; i < tiles.length; i++) {
      if (pairing != i && isFree(tiles[i], temp)) {
        if (pairing != null) {
          aBoard[tiles[pairing]] = tileGroups[currentTile];
          aBoard[tiles[i]] = tileGroups[currentTile];
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
          pairing = i;
        }
      }
    }
  }
} 
