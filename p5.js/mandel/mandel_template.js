
var mx = -0.7,my = 0.0;
var ex = 2.8,ey = 2.8;
var xmin,xmax,ymin,ymax;
var colorgradSlider,maxiterSlider;
var dragx, dragy;



function setup() {
  createCanvas(500, 500);
  textSize(15);
  noStroke();
  pixelDensity(1);
  colorgradSlider= createSlider(0,200,70);
  colorgradSlider.position(20,450);
  maxiterSlider=createSlider(0,300,50);
  maxiterSlider.position(20,480);
}

function mousePressed()
{
  dragx = map(mouseX, 0, width, xmin, xmax);
  dragy = map(mouseY, 0, height, ymax, ymin);
}

function mouseDragged()
{
  mx -= map(mouseX, 0, width, xmin, xmax)-dragx;
  my -= map(mouseY, 0, height, ymax, ymin)-dragy;
}

function mouseWheel(event)
{
  var zoom = 1.125;
  if (event.delta < 0) {
    zoom = 0.8;
  }
  
  var ix = map(mouseX, 0, width, xmin, xmax);
  var iy = map(mouseY, 0, height, ymax, ymin);

  ex *= zoom;
  ey *= zoom;

  mx = ix - (ix-mx)*zoom;
  my = iy - (iy-my)*zoom;
}

function draw(){
  loadPixels();
  var maxiter=maxiterSlider.value();
  var colorgrad=colorgradSlider.value();
  
  var x,y,cx,cy;
  var n,i,j;
  var farbe=[0,0,80, 200, 200, 200,  255, 150, 0,  0, 0, 80];
  
  
  xmin = mx - ex/2;
  xmax = xmin+ex;
  ymin = my - ey/2;
  ymax = ymin+ey;
  
  //hier Doppelschleife einfügen
      cx =map(i, 0, width, xmin, xmax);
      cy =map(j, 0, height, ymax, ymin);
     
      
		var s = (n*0.1)%3;	 
		 if (t>2){t=4-t;}
         var k = floor(s);
         for (var l = 0; l < 3; l++) {
          pixels[pix+l] =farbe[3*k+l]+(s-k)*(farbe[3+3*k+l]-farbe[3*k+l]);
         }
        
  //Ende der Doppelschleife 
  updatePixels();
  text("Iterations", maxiterSlider.x * 2 + maxiterSlider.width, 495);
  text("Color", colorgradSlider.x * 2 + colorgradSlider.width, 465);
}
