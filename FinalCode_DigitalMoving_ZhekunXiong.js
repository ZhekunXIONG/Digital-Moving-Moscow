var mapimage;
var playimage;
var play = true;
var slider;
var time;

var allhour = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00","09:00","10:00","11:00","12:00","13:00", "14:00","15:00","16:00","17;00","18:00","19:00","20:00","21:00","22:00","23:00"]

var bounds = {}
var data = []
var dataCount = 10288;

var clat = 55.7558;
var clon = 37.6173;

// 55.9626736,37.2494326 max
// 55.538875,37.8949867 min
var zoom = 9;

var up = true
var down = true

var count

// proportional diagram
var rowtotal
var hourtotal
var height1
var height2
var height3

var onePoint
var rectHeight




function preload() {
  dataTable = loadTable("data/strictmoscow_hour_diff.csv", "header");
  lightR = loadFont("font/Roboto-Light.ttf");
  boldR = loadFont("font/Roboto-Bold.ttf");
  ralewayReg = loadFont("font/Raleway-Regular.ttf")
  ralewayBold = loadFont("font/Raleway-Bold.ttf")
  playimage = loadImage("img/play.png");
  playimage2 = loadImage("img/play2.png");
  mapimage = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/37.6173,55.7558,9,0,0/1200x650?access_token=pk.eyJ1IjoiY2hlc3Rlcmt1biIsImEiOiJjajI2d3NsYngwMXh5MzdxaTE1c2ZrcWp1In0.Mvs8qXyp-ZEVSDEmzMV7qQ");
}



function setup() { 
  createCanvas(1200, 780);
  //translate(1200/2, 650/2);

  
  bounds.left = 150;
  bounds.right = width - 150;
  bounds.top = 60;
  bounds.bottom = height - 60; 


  // Create Slider of Time
  slider = createSlider(0, 23, 0, 1);
  slider.position(bounds.left+5, 710);
  slider.size(width-2*bounds.left-10);
  slider.changed(showTime);
  
  textFont(boldR);
  textSize(10);
  textAlign(CENTER);
  
  // Center Point of Moscow
  var cx = mercX(clon);
  var cy = mercY(clat);
  
  
  // Create Data
  for (var i = 2; i < dataCount; i++) {
    var row = dataTable.findRow(String(i), 'No')
    var columnName = String(slider.value()) + '_tot_';
    var lon = row.getNum('xcoord')
    var lonPj = mercX(lon)-cx;
    var realLon = mercX(lon)
    var lat = row.getNum('ycoord')
    var latPj = mercY(lat)-cy;
    var realLat = mercY(lat)
    data.push(new Dot(i, row.getNum(columnName), lonPj, latPj, lon, lat));
  }


  // Create row for the total number of the whole area
  rowtotal = dataTable.findRow("10288", 'No')
  
  //two softfloat controlling the right rectangle
  onePoint = new SoftFloat(-40, 0.2, 0.8);
  rectHeight = new SoftFloat(100, 0.2, 0.8);
  
  
  
  
  // Create Buttons
  buttonUp = createButton('+');
  buttonUp.mousePressed(showUp);
  buttonUp.position(50, height/2 + 54);
  buttonUp.style('background-color', "e774e7");
  buttonUp.style("color", "ffffff");
  buttonUp.mouseOver(changeStyle1);
  buttonUp.mouseOut(revertStyle1); 

  buttonDown = createButton('-');
  buttonDown.mousePressed(showDown);
  buttonDown.position(50, height/2 + 143)
  buttonDown.style("background-color", "64ebeb")
  buttonDown.style("color", "ffffff")
  buttonDown.mouseOver(changeStyle2);
  buttonDown.mouseOut(revertStyle2)
  
  buttonAll = createButton('+/-');
  buttonAll.mousePressed(showAll);
  buttonAll.position(50,  height/2 + 99)
  buttonAll.style("background-color", "847ab4")
  buttonAll.style("color", "ffffff")
  buttonAll.mouseOver(changeStyle3);
  buttonAll.mouseOut(revertStyle3);
}



function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

  
function changeStyle1(){
  buttonUp.style("background-color", "ff00ff")
}

function revertStyle1(){
  buttonUp.style("background-color", "e774e7")
}

function changeStyle2(){
  buttonDown.style("background-color", "00ffff")
}

function revertStyle2(){
  buttonDown.style("background-color", "64ebeb")
}

function changeStyle3(){
  buttonAll.style("background-color", "8c73ff")
}

function revertStyle3(){
  buttonAll.style("background-color", "847ab4")
}

function showUp(){
  up = true
  down = false
}
  
function showDown(){
  up = false
  down = true
}  

function showAll(){
  up = true
  down = true
}

function showTime(){
  var column = dataTable.getColumn(String(slider.value()) + '_tot_')
  for (var i = 2; i < dataCount; i++){
    data[i-2].setAmount(column[i-2]) 
  } 
}


function showWork(){
  for (var i = 2; i < dataCount; i++){
    var row = dataTable.findRow(String(i), 'No')
    var columnName = String(slider.value()) + '_worklocprop';
    data[i-2].setAmount(2000 - row.getNum(columnName) * 2000) 
  }
}



function draw() { 
  background(0, 0, 0, 200)
  imageMode(CENTER);
  image(mapimage, 1200/2, 650/2);
  fill(0, 0, 0, 105);
  rect(0, 0, 1200, 650);
  fill(0, 0, 0, 150);
  rect(0, 68, 210, 525);
  fill(color(81, 1, 222));
  rect(0, 650, width, 180);
  
  
  // Play Button (Problem, can't figure out how to automatically move the slider)
  //imageMode(CENTER);
  //if (play == true){
  //  image(playimage, 67, 710, playimage.width/8, playimage.width/8); 
  //} else {
  //  image(playimage2, 67, 710, playimage.width/8, playimage.width/8);
  //}

  translate(1200/2, 650/2);
  
    
  // draw target line and rectangle on the right side
  if ((245 < mouseX) && (mouseX < 920) && (70 < mouseY) && (mouseY < 600)){
    onePoint.setTarget(-255);
    rectHeight.setTarget(525);
  }else{
    onePoint.setTarget(-40);
    rectHeight.setTarget(100);
  }
  
  onePoint.update();
  rectHeight.update();
  fill(0, 0, 0, 180);
  rect(350, onePoint.value, 207, rectHeight.value);
    
  if ((245 < mouseX) && (mouseX < 920) && (70 < mouseY) && (mouseY < 600)){
    push();
    textAlign(CENTER);
    stroke(255)
    strokeWeight(1)
    line(mouseX-600 - 75, mouseY-325, mouseX-600 - 45, mouseY-325);
    line(mouseX-600 + 45, mouseY-325, mouseX-600 + 75, mouseY-325);
    line(mouseX-600, mouseY-325 - 75, mouseX-600, mouseY-325 - 45);
    line(mouseX-600, mouseY-325 + 45, mouseX-600, mouseY-325 + 75);
    fill(255)
    noStroke()
    textFont(ralewayReg);
    textSize(12)
    text("Explore Each Data Point", 450, 225)
    pop();
  }else{
    push();
    textAlign(CENTER);
    fill(255);
    textFont(ralewayBold);
    textSize(30);
    text(rowtotal.getString(String(slider.value()) + "_tot"), 455, -20);
    textSize(15);
    fill(180);
    textFont(ralewayReg);
    text("in total in Moscow", 455, 20);
    textFont(ralewayBold);
    fill(255)
    text("at " + allhour[slider.value()], 455, 40); 
    
    pop();
  }
  
  
  data.forEach(function(entry){
    entry.update();
    noStroke();
    cursor(HAND);
    if ((up == true) && (entry.getAmount() >= 0)){
      entry.display();
    }
    
    if ((down ==true) && (entry.getAmount() < 0 )){
      entry.display();
    }    
  })
  
  
  // Title
  push();
  textFont(boldR);
  fill(255);
  textSize(30);
  textAlign(LEFT, TOP);
  text("DIGITAL MOVING", -550, -235, 100, 80);
  textFont(lightR);
  textSize(12);
  text("@ MOSCOW, RUSSIA", -550, -158);
  pop();
  
  push();
  stroke(255)
  strokeWeight(3)
  strokeCap(SQUARE)
  line(-550, -136, -435, -136)
  pop();
 
  
  
  // Intro
  push();
  textFont(boldR);
  fill(180);
  textSize(10);
  textAlign(LEFT, TOP);
  var intro0 = "We are living in the 21st century full of digital information."
  text(intro0, -550, -115, 120, 120);
  var intro1 = "Digital Moving project intends to use 24-hour cell phone data to indicate urban population flow in Moscow."
  text(intro1, -550, -70, 120, 120);
  pop();
  

  
  
  
  // Time on the slider  
  fill(255);
  textFont(ralewayReg)
  textAlign(CENTER);
  textSize(10);
  if (slider.value() != 0){
    text("00:00", bounds.left+10-600, 690-325)
  }
  if (slider.value() != 23){
    text("23:00", bounds.right-10-600, 690-325)
  }
  textSize(13)
  textFont(ralewayBold)
  var xTime= map(slider.value(), 0, 23, bounds.left+10-600, bounds.right-10-600)
  text(allhour[slider.value()], xTime, 690-325)

 
  
  // Legend
  fill(255)
  textAlign(LEFT, TOP);
  textFont(boldR)
  textSize(8)
  text("Change of Number of People in Surrounding 500m*500m Area in 1 Hour", -550, 27, 110, 100)
  text("Explore the Data", -550, 100, 150, 100)
  
  
  textAlign(LEFT, CENTER);
  textFont(boldR)
  textSize(10)

  fill(color(0, 255, 255));
  ellipse(-530, 83, 5, 5);
  text("Moving Out ", -490, 83)
  text("Select by Blue", -490, 225)
  
  
  fill(color(132, 122, 180))
  text("Select All", -490, 180)
  
  fill(color(255, 0, 255));
  text("Moving In", -490, 69);
  ellipse(-530, 69, 5, 5);
  text("Select by Red", -490, 135)
}





//function mouseClicked(){
//  if ((dist(mouseX, mouseY, 67, 710) <= 20) && (play == true)){
//    count = 0;
//    for (var i = 0; i < 4600000000; i +=1){      
//      //showTime();
//      if (i % 200000000 == 0){
//        count += 1;
//        slider.value(int(count))
//        showTime()
//        console.log(count)
//      }
      
      
      //while (count > 0 && count <20){
      //  slider.value(1);
      //}
      //while (count > 20 && count <40){
      //  slider.value(2);
      //}
      //while (count > 40 && count <60){
      //  slider.value(3);
//    }
//  }
//}



    
     //play = false
//      }
//    }
//  }  else if ((dist(mouseX, mouseY, 67, 710) <= 20) && (play == false)){
//    play = true
//  }
//}


