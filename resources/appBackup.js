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
  dif = Math.pow(xdif * xdif + ydif * ydif, 0.3);
  if (yup) {
    //hex = "#000000";  
    temp = Math.floor(dif * 255);
    hex = fullhex(temp, temp, temp);
  }
  else {
    hex = "#ffffff"
  }
  ctx.strokeStyle = "#f4f4f4";
  console.log(ang);
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
  ang = (ang + 0.3) % (2 * Math.PI);
  up = (0.1 * Math.abs(Math.sin(ang / 10))) * xmax;
  dn = (0.1 * Math.abs(Math.cos(ang / 6))) * xmax;
  lf = (0.1 * Math.abs(Math.sin(ang / 7))) * xmax;
  rt = (0.1 * Math.abs(Math.cos(ang / 9))) * xmax;
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
  //ctx.arc(x, y, RADIUS, 0, degToR(360), true);
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
  x += e.movementX / 5;
  y += e.movementY / 5;
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
sz = 20;
s = Math.sin(Math.PI / 3);
c = Math.cos(Math.PI / 3);

var ang = 0;
var dn = 0.1;
var up = 0.1;
var rt = 0.1;
var lf = 0.1;

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