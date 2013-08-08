

//////////////////////////////////////////////////////////////////////////////
// PART 1: GLOBAL VARIABLES - CONSTANT
//////////////////////////////////////////////////////////////////////////////

var gameboard = $('#gameboard')[0];
var ctxGameboard = gameboard.getContext( '2d' );

var gameboardColumns = 6;
var gameboardRows = 12;
var gameboardWitdh = 300;
var gameboardHeight = 480; // TODO: NEED TO MAKE THE WIDTH RESPONSIVE
var eachColumnWidth = gameboardWitdh / gameboardColumns;
var eachRowHeight = gameboardHeight / gameboardRows;

var preview = $('#preview')[0];
var ctxPreview = preview.getContext( '2d' );
var previewWitdh = 50;
var previewdHeight = 100; // TODO: NEED TO MAKE THE WIDTH RESPONSIVE

var rubymonImgArray = $('.rubymon-img');
var colors = [1, 2, 3, 4, 5, 6]; // 1:red, 2:blue, 3:green, 4:purple, 5:yellow, 6:grey(sad)

//////////////////////////////////////////////////////////////////////////////
// PART 2: GLOBAL VARIABLES - REFRESHABLE
//////////////////////////////////////////////////////////////////////////////

var inputFlag = true;
var rensaCount = 0;
var anotherX = 0;
var anotherY = 0;
// var puyoGroup = [];
// var score = 0;
var currentRubyBox;
var currentX, currentY;
var newX, newY;
var lostStatus;
var interval;
var tickSpeed = 450;
var rensaInterval;

var gameboardInplay;
var gameboardInit = [[0, 0, 0, 0, 0, 0], // Top Row
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0]]; // Bottom Row, 12  rows total

var rubymonPairsPreset = [];
var currentRubymonIndex = 0;

//////////////////////////////////////////////////////////////////////////////
// PART 3: INITIALIZE GAME
//////////////////////////////////////////////////////////////////////////////

function prepareEmptyPreset() {
  for ( var i = 0; i < 150; i++ ) {
    rubymonPairsPreset[i] = [0, 0];
  }
}

function prepareRubymonPreset() {
  prepareEmptyPreset();
  var colorTrays = [60, 60, 60, 60, 60];
  for (var i = 0; i < 300; i++) {
    var randomIndex = _.random(0, colorTrays.length - 1);
    if ( colorTrays[randomIndex] > 0) {
      rubymonPairsPreset[i % 150][Math.floor(i / 150)] = colors[randomIndex];
      colorTrays[randomIndex]--;
    }
  }
}

function deployNewRubymonPair() {
  var currentRubyPair = rubymonPairsPreset[currentRubymonIndex];
  currentRubyBox = [[currentRubyPair[0],0],
                    [currentRubyPair[1],0]];
  currentX = 2;
  currentY = 1;
  currentRubymonIndex  = ( currentRubymonIndex + 1 ) % rubymonPairsPreset.length;
}

function prepareBlankGameboardArray() {
    gameboardInplay = gameboardInit;
}

function newGame() {
  clearInterval(interval);
  prepareBlankGameboardArray();
  prepareRubymonPreset();
  deployNewRubymonPair();
  lostStatus = false;
  interval = setInterval( tick, tickSpeed );
}

newGame();

//////////////////////////////////////////////////////////////////////////////
// PART 4: RUBYRAGE GAME LOGIC
//////////////////////////////////////////////////////////////////////////////

function tick() {
  if ( valid( 0, 1 ) ) {
      ++currentY;
      return
  }

  if(freeze()){ return; }

  if(clear()){ return; }

  if (lostStatus) {
      newGame();
      return false;
  }

  deployNewRubymonPair();
}

function freeze() {
  for ( var y = 1; 0 <= y; --y ) {
    for ( var x = 0; x < 2; ++x ) {
      if ( (y + currentY) >= (gameboardRows - 1)  ||
         gameboardInplay[ y + 1 +currentY][ x + currentX ] != 0){
        if ( currentRubyBox[ y ][ x ] ) {
            gameboardInplay[ y + currentY ][ x + currentX ] = currentRubyBox[ y ][ x ];
            currentRubyBox[y][x] = 0;
        }
      }
    }
  }

  for ( var y = 1; 0 <= y; --y ) {
    for ( var x = 0; x < 2; ++x ) {
      if( currentRubyBox[y][x] ){
          return true;
      }
    }
  }

  return false;
}

function rotate( currentRubyBox ) {
  newX = 0;
  newY = 0;
  if (currentRubyBox[0][0] != 0 ){
    if ( currentRubyBox[0][1] != 0 ){  //  **
        newX = - 1;
                     //  --
      if(currentY == 13 || gameboardInplay[currentY+1][currentX] != 0 ) {
        newY--;
      }
    }else if ( currentRubyBox[1][0] != 0){  //  *-
        newY = 1;                    //  *-
      if(currentX == 5){
        newX--;
      }else if(gameboardInplay[currentY+1][currentX+newX+1] != 0){
        newY--;
      }
    }

  } else if ( currentRubyBox[1][1] != 0 ){
    if ( currentRubyBox[0][1] != 0 ){  //  --
        newY = -1;              //  **
        if ( currentX == -1 ) {
          newX++;
          newY++;
        }
    } else if ( currentRubyBox[1][0] != 0){ //  -*
        newX = 1;                   //  -*
    }
  }

  var newCurrent = [];
  for ( var y = 0; y < 2; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < 2; ++x ) {
        newCurrent[ y ][ x ] = currentRubyBox[ 1 - x ][ y ];
    }
  }

  return newCurrent;
}

function pauseScreen(){
  if ( interval != 0 ){
    clearInterval( interval );
    interval = 0;
  } else {
    interval = setInterval( tick, tickSpeed )
  }
}

function clear() {

  var is_erased;
  is_erased = false;
  for ( var y = 0; y < gameboardRows; ++y ) {
    for ( var x = 0; x < gameboardColumns; ++x ) {
      if ( gameboardInplay[y][x] != 0) {
        if ( clearPuyo(x,y) ) {
            is_erased = true;
        }
      }
    }
  }

  if (is_erased){
      if (interval != 0) {
        clearInterval(interval);
        interval = 0;
        inputFlag = false;
        rensaInterval = setInterval(clear,500);
      }
      packPuyos();
      rensaCount++;
      puyoGroup = [];
      return true;

  }

  if (interval == 0) {
      clearInterval(rensaInterval);
      deployNewRubymonPair();
      interval = setInterval( tick, tickSpeed );
      inputFlag = true;
      rensaCount = 0
  }
  return false;

}

function packPuyos(){
  for ( var x = 0; x < gameboardColumns; ++x ) {
    for ( var y = 0; y < gameboardRows-1; ++y ) {
      var starty = gameboardRows - y - 2
      if (gameboardInplay[starty][x] != 0){
        var my = starty + 1
        for ( ; my < gameboardRows; my++) {
            if ( gameboardInplay[my][x] != 0) break;
        }
        if (my != starty + 1 &&  gameboardInplay[my-1][x] == 0) {
            gameboardInplay[my-1][x]  = gameboardInplay[starty][x];
            gameboardInplay[starty][x] = 0;
        }
      }
    }
  }
}

function createRubymon(x,y,col){ // THIS CREATE A PUYO OBJECT
    var puyo = {x: x , y: y, col: col};
    return puyo;
}

function clearPuyo(x,y) {
  var marked = [];
  for (var i = 0 ; i< gameboardRows; i++ ){
    marked[i] = [];
    for (var j = 0 ; j< gameboardColumns; j++ ){
        marked[i][j] = 0;
    }
  }

  var puyo = createRubymon(x,y,gameboardInplay[y][x]);
  var same_puyos = [puyo];

  if( puyo.col == 0 || puyo.col == 'gray') return false;

  findPuyos(same_puyos,marked);

  if(same_puyos.length >= 4){
    // var pi = { size: same_puyos.length, color: same_puyos[ 0 ].col };
    // puyoGroup.push(pi);
    while( puyo = same_puyos.pop()){
      // clearOPuyo( puyo );
      gameboardInplay[puyo.y][puyo.x] = 0;
    }
    return true
  }
  return false;
}

function checkPuyo(cond,x,y,col,same_puyos,marked){
  if(cond){
    if(gameboardInplay[y][x] == col ){
        same_puyos.push(createRubymon(x,y,col));
        findPuyos(same_puyos,marked);
    }else{
        marked[y][x] = true;
    }
  }
}

function findPuyos(same_puyos,marked){
  var puyo = same_puyos.pop()

  for(var i = 0; i<same_puyos.length; i++){ // THIS FUNCTION CHECKS FOR DUPLICATE PUYO / CAN BE SHORTENED
      if (same_puyos[i].x  == puyo.x
          && same_puyos[i].y == puyo.y
          && same_puyos[i].col == puyo.col){
          return;
      }
  }
  same_puyos.push(puyo);

  if(puyo.col == 0) {
      marked[puyo.y][puyo.x] = true;
      return;
  }

  if(marked[puyo.y][puyo.x] == true) {
      return;
  }

  marked[puyo.y][puyo.x] = true;
  var x = puyo.x;
  var y = puyo.y;
  var col = puyo.col;

  checkPuyo(x>0,x-1,y,col,same_puyos,marked);
  checkPuyo(x<gameboardColumns-1,x+1,y,col,same_puyos,marked);
  checkPuyo(y>1,x,y-1,col,same_puyos,marked);
  checkPuyo(y<gameboardRows-1,x,y+1,col,same_puyos,marked);
}

function keyPress( key ) {
  if (inputFlag == false) {
      return;
  }

  switch ( key ) {
  case 'left':
    if ( valid( -1, 0 ) && puyoSize() > 1  ) {
        --currentX;
    }
    break;
  case 'right':
    if ( valid( 1, 0 ) && puyoSize() > 1  ) {
        ++currentX;
    }
    break;
  case 'down':
    if ( valid( 0, 1 ) && puyoSize() > 1 ) {
        ++currentY;
    }
    break;
  case 'rotate':
    var rotated = rotate( currentRubyBox );
    //        f0001( rotated );
    if ( valid( newX, newY, rotated ) ) {
        currentRubyBox = rotated;
        currentX = currentX + newX
        currentY = currentY + newY
    } else if ( valid( newX + anotherX, newY + anotherY, rotated ) ) {
      currentRubyBox = rotated;
      currentX = currentX + newX + anotherX
      currentY = currentY + newY + anotherY;
    }
    break;
  case 'pauseScreen':
    pauseScreen();
    break;
  }
}

document.body.onkeydown = function( e ) {
  var keys = {
      37: 'left',
      39: 'right',
      40: 'down',
      38: 'rotate',
      13: 'pauseScreen'
  };
  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
      keyPress( keys[ e.keyCode ] );
      // renderAll();
  }
};

function valid( offsetX, offsetY, newCurrent ) {
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || currentRubyBox;

  for ( var y = 0; y < 2; ++y ) {
    for ( var x = 0; x < 2; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if ( typeof gameboardInplay[ y + offsetY ] == 'undefined'
           || typeof gameboardInplay[ y + offsetY ][ x + offsetX ] == 'undefined'
           || gameboardInplay[ y + offsetY ][ x + offsetX ]
           || x + offsetX < 0
           || y + offsetY >= gameboardRows
           || x + offsetX >= gameboardColumns ) {
          if (offsetY == 3 && offsetX == 2) lostStatus = true;
          if (offsetY == 2 && offsetX == 2) lostStatus = true;
          return false;
        }
      }
    }
  }
  return true;
}

function puyoSize() {
  var z = 0;
  for ( var y = 1; 0 <= y; --y ) {
    for ( var x = 0; x < 2; ++x ) {
      if ( currentRubyBox[ x ][ y ] != 0 ) {
        z++;
      }
    }
  }
  return z;
}


//////////////////////////////////////////////////////////////////////////////
// PART 4: GAME RENDERING
//////////////////////////////////////////////////////////////////////////////

function selectRubymon(colorNumber) {
  return rubymonImgArray[colorNumber];
}

function showRubymon(whichCtx, img, xPosition, yPosition) {
  whichCtx.drawImage( img, 0, 0, 140, 126, eachColumnWidth * xPosition, eachRowHeight * yPosition, 50, 40);
}

function renderSittingRubymons() {
  for ( var x = 0; x < gameboardColumns; ++x ) {
    for ( var y = 0; y < gameboardRows ; ++y ) {
      var selectedRubymon = selectRubymon(gameboardInplay[ y ][ x ]);
      showRubymon(ctxGameboard, selectedRubymon, x, y);
    }
  }
}

function renderFallingRubymons() {
  for ( var y = 0; y < 2; y++ ) {
    for ( var x = 0; x < 2; x++ ) {
      var selectedRubymon = selectRubymon(currentRubyBox[ y ][ x ]);
      showRubymon(ctxGameboard, selectedRubymon, currentX + x, currentY + y);
      // debugger;
    }
  }
}

function renderNextRubymons() {
  var nextRubymonIndex = currentRubymonIndex + 1;
  var nextRubymonPair = rubymonPairsPreset[nextRubymonIndex]
  for ( var yPosition = 0; yPosition < 2; yPosition++) {
    var selectedRubymon = selectRubymon(nextRubymonPair[yPosition]);
    showRubymon(ctxPreview, selectedRubymon, 0, yPosition);
  }
}

function paintOverGameboardAndPrewview() {
  ctxGameboard.fillStyle = 'lightgrey';
  ctxGameboard.fillRect( 0, 0, gameboardWitdh, gameboardHeight );
  ctxPreview.fillStyle = 'lightblue';
  ctxPreview.fillRect( 0, 0, previewWitdh, previewdHeight );
}

function renderAll() {
  paintOverGameboardAndPrewview();
  renderSittingRubymons();
  renderFallingRubymons();
  renderNextRubymons();
}

setInterval( renderAll, 30 );

