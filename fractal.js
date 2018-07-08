
var pixel=[];
var colornorm;
var dilatx=[];
var dilaty=[];
var angle=[];
var tx=[];
var ty=[];
var farb=[];
var eck=[];
var tnum=0;
var abbnum;
var showsquares=true;
var locked=false;
var xOffset, yOffset, txoff, tyoff; 

var breite;
var xversch, yversch;
var colorgradSlider, maxiterSlider;
var addButton,subButton,radio,selfrac;
var lines;

function preload(){
	lines=loadStrings('Ahorn.txt');
}


function setup()
{
  canvas = createCanvas(500, 500);
  canvas.position(300, 50);
  pixelDensity(1);
 
  colorgradSlider= createSlider(0.5, 2.5, 1, 0.01);
  colorgradSlider.position(20, 50);
  maxiterSlider=createSlider(0, 100, 20);
  maxiterSlider.position(20, 100);
  var colortxt=createDiv('Color');
  colortxt.position(20, 30);
  var itertxt=createDiv('Iterations');
  itertxt.position(20, 80);
  radio = createRadio();
  var radiotxt=createDiv('Action of Mouse Wheel:')
  radiotxt.position(20, 150);
  radio.position(20, 180);
  radio.option('rotate', 1);
  radio.option('xy-dilate', 2);
  radio.option('y-dilate', 3);
  radio.style('width', '60px');
  textAlign(CENTER);
  
  addButton = createButton('add transform');
  addButton.position(20, 350);
  addButton.mousePressed(addTransform);
  subButton = createButton('remove transform');
  subButton.position(20, 400);
  subButton.mousePressed(rmTransform);
  
  selfrac=createSelect();
  selfrac.position(20,450);
  selfrac.option('Ahorn');
  selfrac.option('Farn'); 
  selfrac.option('Duerer'); 
  selfrac.option('Romanesko'); 
  selfrac.option('Sierpinski'); 
  selfrac.option('Spirale');
  selfrac.option('Kochkurve');
  selfrac.option('Blatt');  
  selfrac.changed(mySelectEvent);
  loadValues(lines);
	 colornorm=0;
	drawsquare();
}

function loadValues(lines){
  for (var i=0; i<lines.length; i++) {        
    if (i==0) {
      breite=float(split(lines[i], ' '))[0];
      xversch=float(split(lines[i], ' '))[1];
      yversch=float(split(lines[i], ' '))[2];
      colorgrad=float(split(lines[i], ' '))[3];
    } else {
      angle[i-1] = float(split(lines[i], ' '))[0];
      dilatx[i-1] = float(split(lines[i], ' '))[1];
      dilaty[i-1] = float(split(lines[i], ' '))[2];
      tx[i-1] = float(split(lines[i], ' '))[3];
      ty[i-1] = float(split(lines[i], ' '))[4];
      farb[i-1] = float(split(lines[i], ' '))[5];
    }
  }
  abbnum=lines.length-1;
	
}

function mySelectEvent(){
	loadStrings(selfrac.value()+".txt",loadValues);
	 colornorm=0;
	drawsquare();
	}

function addTransform() {
  abbnum += 1;
  tnum=abbnum-1;
  angle[tnum]=0;
  dilatx[tnum]=0.5;
  dilaty[tnum]=0.5;
  tx[tnum]=0;
  ty[tnum]=0;
  farb[tnum]=0;
}

function rmTransform() {
  if (abbnum>0) {
    abbnum -= 1;
    tnum=abbnum-1;
  }
}

function mouseWheel(event)
{

  var zoom = 1.05;
  if (event.delta < 0) {
    zoom = 0.95;
  }

  var val=radio.value();
  if (val==2) {	
    dilatx[tnum] *=zoom;
    dilaty[tnum] *=zoom;
  }
  else if (val==3) {
    dilaty[tnum] *=zoom;
  }
  else if (val==1) {
    angle[tnum]+=(zoom-1)*20;
  }
  else{
    dilatx[tnum] *=zoom;
    dilaty[tnum] *=zoom;
  }
  reset();
}

function mousePressed() {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY <height) { 
    xOffset = mouseX; 
    yOffset = mouseY; 
    txoff=tx[tnum];
    tyoff=ty[tnum];
    locked=true;
  }
}

function mouseDragged() {
  if (locked) {
    tx[tnum] = txoff+(mouseX-xOffset)*breite/width; 
    ty[tnum] = tyoff-(mouseY-yOffset)*breite/width;
  }
}

function mouseReleased() {
  if (locked) { 
    locked=false;
    reset();
  }
}


function draw()
{
  var x, y, dist, disti, i;	
  var maxiter=maxiterSlider.value();
  var colorgrad=colorgradSlider.value();

  if (!locked) {
    x=width*(tx[tnum]/breite+xversch);
    y=height*(1-yversch)-width*ty[tnum]/breite;
    dist=(mouseX-x)*(mouseX-x)+(mouseY-y)*(mouseY-y);
    for (i=0; i < abbnum; i++) {
      x=width*(tx[i]/breite+xversch);
      y=height*(1-yversch)-width*ty[i]/breite;
      disti=(mouseX-x)*(mouseX-x)+(mouseY-y)*(mouseY-y);
      if (disti < dist) {
        tnum=i;
        dist=disti;
      }
    }
  }

  if (colornorm < maxiter || locked) {
    colornorm++;
    abbildung();
  }

  drawfractal(colorgrad);
  if (showsquares)
    drawsquares();
  if (maxiter==0) {
    colornorm=0;
    drawsquare();
  }
}



function reset() {
  colornorm=0;
  for (var i=0; i<height*width; ++i) 
    if (pixel[i]!=0xffffff) {
      pixel[i]=0;
    }
}

function drawsquares() {
  loadPixels();
  var i, j, l;
  var hpixel=[];
  for (j = 0; j < width*height; j+=1) 
    hpixel[j]=0xffffff;

  for (i=5; i<height-5; ++i) {
    hpixel[i*width+5] = 0;
    hpixel[i*width+width-5] = 0;
  }
  for (i=5; i<width-5; ++i) {
    hpixel[5*width+i] = 0;
    hpixel[(height-5)*width+i] = 0;
  }
  for (j = 0; j < width*height; j+=1) {
    pixels[4*j+3]=255;
    if (hpixel[floor(j)]!=0xffffff) {
      for ( i=0; i<abbnum; i++) {   

        for (l=0; l<3; l++) {
          pixels[4*transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])+l]=0;
        }
        if (i==tnum)
          pixels[4*transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])]=0xff;
      }
    }
  }

  updatePixels();
}

function drawsquare() {
  for (var i=0; i<height; ++i)
    for (var j=0; j<width; ++j)
      if (height/3<i && i<2*height/3 && width/3<j && j<2*width/3)
        pixel[i*width+j]=0;
      else
        pixel[i*width+j]=0xffffff;
}

function drawfractal(colorgrad) {
  var t;
  var k, l;
  loadPixels();
  //hier kannst du einen eigenen Farbverlauf einfügen
  var farbe=[0, 255, 0, 255, 255, 0, 255, 0, 0, 0, 0, 0];  

  for (var i=0; i < height*width; ++i) {
    pixels[4*i+3]=255;
    if (pixel[i]!=0xffffff) {
      t=2*exp(colorgrad*(pixel[i]*1.0/colornorm-1));               
      k = floor(t);
      for (l = 0; l < 3; l++)
        pixels[4*i+l]=floor(farbe[3*k+l]+(t-k)*(farbe[3+3*k+l]-farbe[3*k+l]));
    } else
      for (l = 0; l < 3; l++)
        pixels[4*i+l]=255;
  }
  updatePixels();
}

function abbildung() { 
  var j, hpixel=[];
  for (j = 0; j < width*height; j+=1)
    hpixel[j]=0xffffff;
  for (j = 0; j < width*height; j+=0.9) {
    if (pixel[floor(j)]!=0xffffff) {
      for (var i=0; i<abbnum; i++)
        hpixel[transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])]=pixel[floor(j)]+farb[i];
    }
  }
  for (j = 0; j < width*height; j+=1)
    pixel[j]=hpixel[j];
}


function transform(j, winkel, streckx, strecky, xverschiebung, yverschiebung) {
  var x, y;
  var xh, yh, xhh;
  xh=(j%width*1.0/width-xversch)*breite;
  yh=((1-yversch)*height-j/width)*breite/width;
  xh=xh*streckx;
  yh=yh*strecky;

  xhh=xh;
  xh = xh*cos(PI/180*winkel) - yh*sin(PI/180*winkel);        
  yh = yh*cos(PI/180*winkel) + xhh*sin(PI/180*winkel);

  xh+=xverschiebung;
  yh+=yverschiebung;

  x=floor(width*(xh/breite+xversch));
  y=floor(height*(1-yversch)-width*yh/breite);

  if (0 <= x && x < width && 0 <= y && y < height)  
    return width*y+x;
  else
    return 0;
}  
