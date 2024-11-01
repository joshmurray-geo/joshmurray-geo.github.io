// helper function

const RADIUS = 20;
const minWidth = 1000;

var col2hex = function(val) {
  var hex = Number(val).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
}

var fullhex = function(r, g, b) {
  var red = col2hex(r);
  var green = col2hex(g);
  var blue = col2hex(b);
  return "#" + red+green+blue;
}

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

// function for drawing hexagons
function hexAdd(x0, y0, yup) {
  // difference of hex from mouse
  xdif = Math.abs(x - x0) / (sz*4);
  ydif = Math.abs(y - y0) / (sz*4);
  dif = (xdif * xdif + ydif * ydif);
  // if it's in the picture box draw a hollow hex
  if (x0 > sz && x0 < picX2 && y0 > picY1 && y0 < picY2) {
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.strokeStyle = "rgba(240,240,240,0)";
    ctx.lineWidth = sz / 20;
  }
  // otherwise, if close enough to cursor fill based on dist
  else if (yup) {
    col = targetColour();
    r = Math.floor(fc1[0] * dif + col[0] * (1 - dif));
    g = Math.floor(fc1[1] * dif + col[1] * (1 - dif));
    b = Math.floor(fc1[2] * dif + col[2] * (1 - dif));
    ctx.fillStyle = fullhex(r, g, b); 
    ctx.strokeStyle = fullhex(strk[0], strk[1], strk[2]);
    ctx.lineWidth = sz / 10;
  }
  // or, if the window is too narrow, don't fill at all
  else {
    ctx.fillStyle = fullhex(fc1[0], fc1[1], fc1[2]);
    ctx.strokeStyle = fullhex(strk[0], strk[1], strk[2]);
    ctx.lineWidth = sz / 10;
  }
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + sz, y0);
  ctx.lineTo(x0 + sz + sz * c, y0 + sz * s);
  ctx.lineTo(x0 + sz, y0 + 2 * sz * s);
  ctx.lineTo(x0, y0 + 2 * s * sz);
  ctx.lineTo(x0 - c * sz, y0 + s * sz);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function boxNum() {
  if (y > b1y[0] && y < b1y[1] && x > b1x[0] && x < b1x[1]){
    return 1;
  } else  if (y > b2y[0] && y < b2y[1] && x > b2x[0] && x < b2x[1]){
    return 2;
  } else  if (y > b3y[0] && y < b3y[1] && x > b3x[0] && x < b3x[1]){
    return 3;
  } else if (y > b4y[0] && y < b4y[1] && x > b4x[0] && x < b4x[1]){
    return 4;
  } else {
    return 0;
  }

}


function targetColour() {
  bNum = boxNum();
  if (bNum == 1){
    return b1col;
  } else  if (bNum == 2){
    return b2col;
  } else  if (bNum == 3){
    return b3col;
  } else  if (bNum == 4){
    return b4col;
  }else {
    return fc2;
  }
}

function canvasDraw() {
  // canvas of window size
  xmax = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  ymax = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  ctx.canvas.width = document.documentElement.clientWidth;
  ctx.canvas.height = document.documentElement.clientHeight;

  // picture bounding box
  picX1 = sz;
  picX2 = xmax - 2 * sz;
  picY1 = ymax * 0.05;
  picY2 = ymax * 0.4 + sz;

  // defines the distance of shaded hexagons
  // ang updates to pseudorandomise the shape of the shaded region
  ang = ang % (2 * Math.PI);
  dist = 3;
  up = (1 + Math.sin(ang/3) / 2) *  dist * sz;
  dn = (1 + Math.sin(ang/4) / 2) *dist * sz;
  lf = (1 + Math.sin(ang/5) / 2) *dist * sz;
  rt = (1 + Math.sin(ang/7) / 2) *dist * sz;
  // start drawing the hexagons
  ctx.beginPath();
  var i = 1;
  x0 = xOG;
  y0 = yOG;
  yup = false;

  // while loop until the entire window is filled
  while (y0 < ymax) {
    while (x0 < xmax + sz) {
      // prox is a bool for close enough to the cursor
      prox = (y0 - y < dn) && (y - y0 < up) && (x0 - x < rt) && (x - x0 < lf);
      if (prox) {
        yup = true;
      } else {
        yup = false;
      }
      // add hex at x0, y0
      hexAdd(x0, y0, yup);
      // incriment x0
      x0 = x0 + 2 * sz * (1 + c);
    }
    // add hex at y0
    y0 = y0 + sz * s;
    // have to alternate between in line and offset
    if (i % 2 == 1) {
      x0 = xOG + sz * (1 + c);
    } else {
      x0 = xOG;
    }
    i++;
  }
}

// function to collect mouse position
function getMousePos(e) {
    return {tempX:e.clientX,tempY:e.clientY};
}

// detect mouse movement and return position
document.onmousemove=function(e) {
   var mousecoords = getMousePos(e);
   xMouse = mousecoords.tempX;
   yMouse = mousecoords.tempY;
}

document.onmousedown = function(){
  bNum = boxNum();
  if (bNum == 1) {
    window.location.href = 'index.html'
  } else  if (bNum == 2) {
    window.location.href = 'science.html'
    console.log('clicked');
  } else if (bNum == 3) {
    window.location.href = 'notscience.html'
  } else if (bNum == 4) {
    window.location.href = 'globalWeathering.html'
  }
}


// function to change the movement of the "mouse"
function drawRepeat() {
    // update the difference between hex and cursor
    deltaX = xMouse - x;
    deltaY = yMouse - y;
    // dX and dY are velocities
    dX = deltaX * visc + dX * (0.05 - visc);
    dY = deltaY * visc + dY * (0.05 - visc);
    // if hex close enough to mouse, call them the same
    if (Math.abs(dX) + Math.abs(dY) < 0.1) {
        x = xMouse;
        y = yMouse;
    } else {
      // otherwise update the hex position
        x += dX;
        y += dY;
    }
    // loop
    requestAnimationFrame(drawRepeat);
    // stop drawing if the window is made too small
    if (xmax >= minWidth) {
      canvasDraw();
    }
}

// shading colours
fc1 = [245, 245, 245];
strk = [240, 240, 240];
fc2 = [170, 170, 170];
b1col = [119,51,68];
b2col = [190,186,218];
b3col = [141,211,199];
b4col = [251,128,114];


// ----------  setup of the canvas ---------------------
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// outer bounds
var xmax = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
console.log(xmax);
var ymax = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
// start at middle middle
var xMouse = xmax / 2; // cursor position
var yMouse = ymax / 2; // cursor position
var x = xmax / 2; // hex position
var y = ymax / 2; // hex position


// width of the hexagons
sz = 45;
// sine and cosine 60
s = Math.sin(Math.PI / 3);
c = Math.cos(Math.PI / 3);

// variables for drawing the hexagons
var ang = 0;
var dn = 0.1;
var up = 0.1;
var rt = 0.1;
var lf = 0.1;

// velocity
var dX = 0;
var dY = 0;
// viscocity
const visc = 0.06;

// boxes for "nav bar"
b1x = [xmax * 0.04, xmax * 0.18];
b1y = [0, ymax * 0.25];
b2x = [xmax * 0.25, xmax * 0.46];
b2y = [0, ymax * 0.25];
b3x = [xmax * 0.5, xmax * 0.65];
b3y = [0, ymax * 0.25];
b4x = [xmax * 0.72, xmax * 0.92];
b4y = [0, ymax * 0.25];

xOG = 0;
yOG = -sz * 2 * s;

canvas.width = xmax;
canvas.height = ymax;
if (xmax > minWidth) {
  canvasDraw();
  requestAnimationFrame(drawRepeat)
  // document.body.style.cursor = "url(bsCursor.png), url(./cursor.svg), pointer";
  console.log('updateCursor');
} else {
  // document.body.style.cursor = "url(bsCursor.png), url(./cursor.svg), pointer";
  document.body.style.overflow = "scroll";
  var para = document.getElementById("mainText");
  para.textContent += "this website is better suited for use on desktop"
  console.log('updateCursor');
}

