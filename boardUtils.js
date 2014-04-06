isFree = function(tile, configuration) { 
 var x = tile[0]
 var y = tile[1]
 var z = tile[2]
 for(var i = x-1; i <= x + 1; i++) {
   for(var j = y-1; j<= y+1; j++) {
     if(configuration[[i,j,z + 1]]) {
       return false;
     }
   }
 }
 var i = x - 2
 for(var j = y - 1; j <= y + 1; j++) {
   if(configuration[[i, j, z]]) {
     i = x + 2
     for(var k = y - 1; k <= y + 1; k++) {
       if(configuration[[i, k, z]]) {
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
  var currentTile = 0;
  var pairing;
  while(tiles.length > 0) {
    for(var i = 0; i < tiles.length; i++) {
      if (isFree(tiles[i], temp)) {
        if (pairing) {
          aBoard[pairing] = currentTile;
          aBoard[i] = currentTile;
          delete temp[pairing];
          delete temp[tiles[i]];
          pairing = null;
          currentTile++;
        } else {
          pairing = tiles[i];
        }
      }
    }
    tiles = _.keys(temp)
    tiles = _.shuffle(tiles)
  }


} 
