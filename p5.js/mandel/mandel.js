
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
  
  var x,y,cx,cy,n,xx,yy,s;
  var a=1/50.0;
  var b=1/log(2);
  var nu,s,t;
  var RADIUS=exp(50),R=1;
  var phi=0,phialt=0;
  var faktor=0.9;
  var c=4*(1-faktor)/(2-faktor);
  var farbe=[0,0,80, 200, 200, 200,  255, 150, 0,  0, 0, 80];
  var rgb=new Array(3);
  
  xmin = mx - ex/2;
  xmax = xmin+ex;
  ymin = my - ey/2;
  ymax = ymin+ey;
  
  for (var i=0; i< width; i++) {
    for (var j=0; j <height; j++) {
      cx =map(i, 0, width, xmin, xmax);
      cy =map(j, 0, height, ymax, ymin);
      n=1;
      phi=0;
      xx=yy=0;
      x=y=0;
      while(n<maxiter) {
		phialt=phi;
        phi*=faktor;
        y=2*x*y+cy;
        x=xx-yy+cx;
        xx=x*x;
        yy=y*y;
		R=xx+yy;
		phi+=1-abs(x)*x/R;
        if (R>RADIUS)
          break;
        ++n;
      }

      var pix =(i+j*width)*4;
      pixels[pix+3]=255;
        if (n<maxiter) {
		 nu=b*log(a*log(R));
		 s = (sqrt(n + 1-nu)*0.004*colorgrad)%3;
		 t=(((1-nu)*phi+nu*phialt)*c)%2*2;
		 if (t>2){t=4-t;}
         var k = floor(s);
         for (var l = 0; l < 3; l++) {
          rgb[l] =farbe[3*k+l]+(s-k)*(farbe[3+3*k+l]-farbe[3*k+l]);
          if (t < 1)
            pixels[pix+l]= floor((255 + t * (rgb[l] - 255)));
          else
            pixels[pix+l]= floor((2 - t) * rgb[l]);
         
         }
        
      } else {
        pixels[pix+0]=0;
        pixels[pix+1]=0;
        pixels[pix+2]=0;
        
      }
    }
  }
  updatePixels();
  text("Iterations", maxiterSlider.x * 2 + maxiterSlider.width, 495);
  text("Color", colorgradSlider.x * 2 + colorgradSlider.width, 465);
}
