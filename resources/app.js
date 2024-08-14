// helper function

const RADIUS = 20;

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

function hexAdd(x0, y0, yup) {
  xdif = Math.abs(x - x0) / xmax;
  ydif = Math.abs(y - y0) / xmax;
  dif = Math.pow(xdif * xdif + ydif * ydif, 0.2);
  if (yup) {
    //hex = "#000000";  
    temp = Math.floor(dif * 255);
    hex = fullhex(temp, temp, temp);
  }
  else {
    hex = "#9bb4c4";
  }
  ctx.strokeStyle = "#f4f4f4";
  ctx.fillStyle = hex;
  ctx.lineWidth = sz / 8;
  ctx.beginPath()
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

function canvasDraw() {
  ang = (ang + 0.1) % (2 * Math.PI);
  up = (1 + Math.sin(ang / 10)) * 2 * 40;
  dn = (1 + Math.cos(ang / 6)) * 2 * 40;
  lf = (1 + Math.sin(ang / 7)) * 2 * 40;
  rt = (1 + Math.cos(ang / 9)) * 2 * 40;
  ctx.beginPath();
  var i = 1;
  x0 = xOG;
  y0 = yOG;
  yup = false;
  while (y0 < ymax) {
    while (x0 < xmax) {
      tst = (y0 - y < dn) && (y - y0 < up) && (x0 - x < rt) && (x - x0 < lf);
      if (tst) {
        yup = true;
      } else {
        yup = false;
      }
      hexAdd(x0, y0, yup);
      x0 = x0 + 2 * sz * (1 + c);
    }
    y0 = y0 + sz * s;
    if (i % 2 == 1) {
      x0 = xOG + sz * (1 + c);
    } else {
      x0 = xOG;
    }
    i++;
  }
  ctx.beginPath()
  ctx.moveTo(x + 5, y + 10);
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";
  ctx.lineTo(x+ 5, y + 20);
  ctx.lineTo(x + 7, y + 18);
  ctx.lineTo(x + 9, y + 22);
  ctx.lineTo(x + 10, y + 21);
  ctx.lineTo(x + 9, y + 17);
  ctx.lineTo(x + 12, y + 17);
  ctx.closePath();
  ctx.fill();

}


function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

function updatePosition(e) {
  dX = dX * visc + e.movementX * (1 - visc);
  dY = dY * visc + e.movementY * (1 - visc);
  x += dX / 4;
  y += dY / 4;
  if (x > canvas.width + RADIUS) {
    x = -RADIUS;
  }
  if (y > canvas.height + RADIUS) {
    y = -RADIUS;
  }  
  if (x < -RADIUS) {
    x = canvas.width + RADIUS;
  }
  if (y < -RADIUS) {
    y = canvas.height + RADIUS;
  }
  //tracker.textContent = "X position: " + x + ", Y position: " + y;

  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvas.width = xmax;
      canvas.height = ymax;
      canvasDraw();
    });
  }
}

// setup of the canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');


xmax = window.innerWidth;
ymax = window.innerHeight;
var x = xmax / 2;
var y = ymax / 2;
sz = 50;
s = Math.sin(Math.PI / 3);
c = Math.cos(Math.PI / 3);

var ang = 0;
var dn = 0.1;
var up = 0.1;
var rt = 0.1;
var lf = 0.1;

var dX = 0;
var dY = 0;
const visc = 0.96;

xOG = 0;
yOG = -sz * 2 * s;

canvas.width = xmax;
canvas.height = ymax;
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

// pointer lock event listeners
canvas.onclick = function() {
  canvas.requestPointerLock();
};

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

var tracker = document.getElementById('tracker');

var animation;