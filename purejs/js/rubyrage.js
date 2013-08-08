var COLS = 6;
var ROWS = 14;
var board = [];
var lose;
var interval;
var rensaInterval;
var current;
var currentX, currentY;
var newX, newY;
var colors = ['blue', 'yellow' ,'red', 'green', 'gray'];
var puyocolors = [];
var color_index =0;
var inputFlag = true;
var rensaCount = 0;
var puyoGroup = [];
var score = 0;
var anotherX = 0;
var anotherY = 0;

function newShape() {
    var col = puyocolors[color_index];
    current = [[col[0],0],[col[1],0]];
    currentX = 2; //sets the x-axis starting location for blocks to drop
    currentY = 0; //sets the y-axis starting location for blocks to drop
    color_index  = ( color_index + 1 ) % puyocolors.length;
}

function createColors(){
    var cols = [64,64,64,64];

    //Creates 128 color elements with [0,0] value
    for ( var a = 0; a < 128; ++a ) {
        puyocolors[a] = [0,0];
    }

    for (var tomato = 0; tomato < 256; tomato) {
        var cur = (Math.ceil(Math.random()*cols.length))%cols.length; //Generates random # bt 0 and 3

        //Pushes 128 color combinations into the puyocolors array set up above
        if ( cols[cur] > 0 ) {
            cols[cur]--;
            puyocolors[tomato%128][Math.floor(tomato/128)]=colors[cur];
            tomato++;
        }
    }
}

function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
    createColors();
}

function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
        return
    }

    if(blockLanding()){
        return;
    }

    if(clear()){
        return;
    }

    if (lose) {
        newGame();
        return false;
    }

    newShape();

}


function blockLanding() {

    // Attaches fallen board pieces onto board
    for ( var y = 1; 0 <= y; --y ) {
        for ( var x = 0; x < 2; ++x ) {
            if ( (y + currentY) >= (ROWS - 1) || board[ y + 1 +currentY][ x + currentX ] != 0){
                if ( current[y][x] ) {
                    board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
                    current[y][x] = 0;
                }
            }
        }
    }

    // Allows blocks to fall naturally when other blocks are in the way
    for ( var y = 1; 0 <= y; --y ) {
        for ( var x = 0; x < 2; ++x ) {
            if( current[y][x] ){
                return true;
            }
        }
    }

    return false;

}

function rotate( current ) {
    newX = 0;
    newY = 0;
    if (current[0][0] != 0 ){
        if ( current[0][1] != 0 ){
            newX = - 1;

            if(currentY == 13 || board[currentY+1][currentX] != 0 ) {
                newY--;
            }
        }else if ( current[1][0] != 0){
            newY = 1;
            if(currentX == 5){
                newX--;
            }else if(board[currentY+1][currentX+newX+1] != 0){
                newY--;
            }
        }

    }else if ( current[1][1] != 0 ){
        if ( current[0][1] != 0 ){
            newY = -1;
            if ( currentX == -1 ) {
                newX++;
                newY++;
            }
        }else if ( current[1][0] != 0){
            newX = 1;
        }
    }

    var newCurrent = [];
    for ( var y = 0; y < 2; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 2; ++x ) {
            newCurrent[ y ][ x ] = current[ 1 - x ][ y ];
        }
    }

    return newCurrent;
}

function pauseScreen(){
    if ( interval != 0 ){
        clearInterval( interval );
        interval = 0;
    }else {
        interval = setInterval( tick, 250 )
    }
}


function clear() {
    //If clearPuyo, defined below, is true, is_erased is set to true
    var is_erased;
    is_erased = false;
    for ( var y = 0; y < ROWS; ++y ) {
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[y][x] != 0) {
                if ( clearPuyo(x,y) ) {
                    is_erased = true;
                }
            }
        }
    }
    //If is_erased is true, it stops the timer, calls clear again, and adds score
    if (is_erased){
        if (interval != 0) {
            clearInterval(interval);
            interval = 0;
            inputFlag = false;
            rensaInterval = setInterval(clear,500);
        }
        scorer();
        packPuyos();
        rensaCount++;
        puyoGroup = [];
        return true;

    }

    //Restarts the timer if the second statement above returns false on later iterations
    if (interval == 0) {
        clearInterval(rensaInterval);
        newShape();
        interval = setInterval( tick, 250 );
        inputFlag = true;
        rensaCount = 0
    }
    return false;

}

//
function packPuyos(){
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS-1; ++y ) {
            var startY = ROWS - y - 2

            if (board[startY][x] != 0){
                var my = startY + 1
                for ( ; my < ROWS; my++) {
                    if ( board[my][x] != 0) break;
                }

                if (my != startY + 1 &&  board[my-1][x] == 0) {
                    board[my-1][x]  = board[startY][x];
                    board[startY][x] = 0;
                }

            }
        }
    }

}

function createPuyo(x,y,col){
    var puyo = {x: x , y: y, col: col};
    return puyo;
}

function clearPuyo(x,y) {
    var marked = [];
    for (var i = 0 ; i< ROWS; i++ ){
        marked[i] = [];
        for (var j = 0 ; j< COLS; j++ ){
            marked[i][j] = 0;
        }
    }

    var puyo = createPuyo(x,y,board[y][x]);
    var same_puyos = [puyo];

    if( puyo.col == 0 || puyo.col == 'gray') return false;

    findPuyos(same_puyos,marked);

    if(same_puyos.length >= 4){
        var pi = { size: same_puyos.length, color: same_puyos[ 0 ].col };
        puyoGroup.push(pi);
        while( puyo = same_puyos.pop()){
            clearOPuyo( puyo );
            board[puyo.y][puyo.x] = 0;
        }
        return true
    }
    return false;
}

function checkPuyo(cond,x,y,col,same_puyos,marked){
    if(cond){
        if(board[y][x] == col ){
            same_puyos.push(createPuyo(x,y,col));
            findPuyos(same_puyos,marked);
        }else{
            marked[y][x] = true;
        }
    }
}

function findPuyos(same_puyos,marked){
    var puyo = same_puyos.pop()

    for(var i = 0; i<same_puyos.length; i++){
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
checkPuyo(x<COLS-1,x+1,y,col,same_puyos,marked);
checkPuyo(y>1,x,y-1,col,same_puyos,marked);
checkPuyo(y<ROWS-1,x,y+1,col,same_puyos,marked);

}

function keyPress( key ) {

    if (inputFlag == false) {
        return;
    }

    switch ( key ) {
        case 'left':
        if ( valid( -1 ) && puyoSize() > 1  ) {
            --currentX;
        }
        break;
        case 'right':
        if ( valid( 1 ) && puyoSize() > 1  ) {
            ++currentX;
        }
        break;
        case 'down':
        if ( valid( 0, 1 ) && puyoSize() > 1 ) {
            ++currentY;
        }
        break;
        case 'rotate':
        var rotated = rotate( current );

        if ( valid( newX, newY, rotated ) ) {
            current = rotated;
            currentX = currentX + newX
            currentY = currentY + newY
        }else if ( valid( newX + anotherX, newY + anotherY, rotated ) ) {
            current = rotated;
            currentX = currentX + newX + anotherX
            currentY = currentY + newY + anotherY;
        }
        break;
        case 'pauseScreen':
        pauseScreen();
        break;
    }
}

function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0; //first parameter is equal to itself or 0
    offsetY = offsetY || 0; //second parameter is equal to itself or 0
    offsetX = currentX + offsetX; //first parameter equal to itself plus currentX
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( var y = 0; y < 2; ++y ) {
        for ( var x = 0; x < 2; ++x ) {
            if ( newCurrent[ y ][ x ] ) {

                if ( typeof board[ y + offsetY ] == 'undefined'
                    || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                    || board[ y + offsetY ][ x + offsetX ]
                    || x + offsetX < 0
                    || y + offsetY >= ROWS
                    || x + offsetX >= COLS ) {
                    if (offsetY == 3 && offsetX == 2) lose = true;
                if (offsetY == 2 && offsetX == 2) lose = true;
                return false;
            }
        }
    }
}
return true;
}

function scorer() {
    var colorBonus = [ 0, 0, 3, 6, 12];
    var rensaBonus = [ 0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512, 544];
    var connectBonus = [ 0, 0, 0, 0, 0, 2, 3, 4, 5, 6, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,];
    var currentBonus = 0;
    var erasedPuyos = 0;
    var uniquecolors = []
    for ( var  x = 0; x < puyoGroup.length; x++ ) {
        currentBonus = currentBonus + connectBonus[puyoGroup[x].size];
    }
    currentBonus = currentBonus + rensaBonus[rensaCount];
    for ( var  y = 0; y < puyoGroup.length; y++ ) {
        erasedPuyos = erasedPuyos + puyoGroup[y].size;
    }
    for ( var  z = 0; z < puyoGroup.length; z++ ) {
        var inserted = false;
        for ( var i = 0; i < uniquecolors.length; i++ ) {
            if ( uniquecolors[i] == puyoGroup[z].color ) {
                inserted = true;
                break;
            }
        }
        if ( inserted == false ) {
            uniquecolors.push(puyoGroup[z].color);
        }
    }
    currentBonus = currentBonus + connectBonus[uniquecolors.length];
    currentBonus = currentBonus || 1;
    score = score + currentBonus*10*erasedPuyos;
}

function clearOPuyo( puyo ) {
    for ( var x = -1 ; x < 2; x++ ) {
        for ( var y = -1 ; y < 2; y++ ) {
            if ( Math.abs(x) != Math.abs(y) &&
                0 <= (puyo.y + y) &&
                (puyo.y + y) < board.length &&
                0 <= (puyo.x + x) &&
                (puyo.x + x) < board[0].length &&
                board[puyo.y + y][puyo.x + x] == 'gray' ) {
                board[puyo.y + y][puyo.x + x] = 0;
        }
    }
}
}

function newGame() {
    clearInterval(interval);
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 250 );
    score = 0;
}

newGame();

function puyoSize() {
    var z = 0;
    for ( var y = 1; 0 <= y; --y ) {
        for ( var x = 0; x < 2; ++x ) {
            if ( current[ x ][ y ] != 0 ) {
                z++;
            }
        }
    }
    return z;
}
