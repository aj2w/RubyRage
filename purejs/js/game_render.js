var canvas = $('canvas')[0];
var ctx = canvas.getContext( '2d' );
var W = 300, H = 600;

// Divides canvas into grid
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 ); //Fills the rectangle
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 ); //Fills border of rectangle
    // Both functions use (x position, y position, width, height)
}

//Preview box in upper-right corner of canvas
function drawSmallBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W/2 - 1 , BLOCK_H/2 - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W/2 - 1 , BLOCK_H/2 - 1 );
}

function render() {
    //Sets background color of canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, W, H );

    //Renders fallen blocks
    ctx.strokeStyle = 'black'; //Border color of fallen blocks
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 2; y < ROWS ; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = board[ y ][ x ];
                drawBlock( x, y );
            }
        }
    }

    //Renders falling blocks
    ctx.fillStyle = 'red'; //Line may be unnecessary
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 2; ++y ) {
        for ( var x = 0; x < 2; ++x ) {
            if ( current[ y ][ x ] && currentY + y > 1) {
                ctx.fillStyle =  current[ y ][ x ];
                drawBlock( currentX + x, currentY + y );
            }
        }
    }

    for ( var i = 0; i < 2; ++i ) {
        var index = (color_index + i)%puyocolors.length;
        var col =puyocolors[index];
        for ( var x = 0; x < 2; ++x ) {
            ctx.fillStyle =  col[x];
            drawSmallBlock( 4.5+i,x*0.5 )
        }
    }

    //For score
    ctx.font = "bold 20pt Sans-Serif";
    ctx.fillStyle = "white"
    ctx.fillText(score,BLOCK_H/2,BLOCK_W/2);

}

setInterval( render, 30 );