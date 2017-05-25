function Dot(idx, amt, lonPj, latPj, lon, lat) {  
  var index = idx;
  var amount = amt;
  this.lonPj = lonPj;
  this.latPj = latPj;
  this.lon = lon;
  this.lat = lat;
  
  // set these null so that they can be set the first time around
  var x = null;
  var y = null;
  var colDown = color(0, 255, 255);
  var colUp = color(255, 0, 255);
  var size = null

  // this handles updating any animated variables
  this.update = function() {
    //x.update();
    //y.update(); 
    size.update();
  }
  
  this.display = function(){
    // draw colorcoded circle
    if ((250 < mouseX) && (mouseX < 930) && (70 < mouseY) && (mouseY < 600)){
      if (dist(mouseX, mouseY, lonPj + 600, latPj + 325) < 70){
        if (amount < 0){
          fill(colDown);
        }else{
          fill(colUp)
        }
        ellipse(lonPj, latPj, size.value, size.value);
      }else{
        if (amount < 0){
          fill(66, 174, 174, 200);
        }else{
          fill(178, 72, 178, 200)
        }
        ellipse(lonPj, latPj, size.value, size.value);        
      }
    }else{
      if (amount < 0){
        fill(colDown);
      }else{
        fill(colUp)
      }
      ellipse(lonPj, latPj, size.value, size.value);
    }
    
    // mouse over point, show text
    if (dist(mouseX, mouseY, lonPj + 600, latPj + 325) < 0.8*size.value) {
      textAlign(CENTER);
      if (amount < 0){
        fill(colDown);
        textFont(ralewayBold);
        textSize(30);
        text((String(-amount)), 450, -220)        
        textFont(ralewayReg)
        textSize(15)
        text("people moving out", 450, -180);
      }else{
        fill(colUp);
        textFont(ralewayBold);
        textSize(30);
        text((String(amount)), 450, -220)        
        textFont(ralewayReg)
        textSize(15)
        text("people moving in", 450, -180);
      }

 
      push();
      fill(255)
      var rowHighlight = dataTable.findRow(String(index), 'No')
      
      textFont(ralewayBold);
      textSize(30)
      text(rowHighlight.getString(String(slider.value()) + "_tot"), 450, -140)
      textSize(15)
      fill(180)
      textFont(ralewayReg);
      text("in total in this region", 450, -100)
      
      fill(255)
      textFont(ralewayBold);
      text("at " + allhour[slider.value()], 450, -80)
      
      // coordination text
      textSize(10)
      rectMode(CENTER)
      fill(70)
      var addWidth = textWidth("@ " + rowHighlight.getString("add"))
      rect(lonPj, latPj+94, addWidth+30, 20)
      fill(230)
      text("@ " + rowHighlight.getString("add"),lonPj, latPj+93)
      
      text(String(lon)+"E", lonPj, latPj-90)
      text(String(lat)+"N", lonPj-110, latPj)
      pop();
      
      
      // Proportion
      var locprop = rowHighlight.getNum(String(slider.value()) + '_locprop')
      var worklocprop = rowHighlight.getNum(String(slider.value()) + '_worklocprop')
      fill(255)
      rect(370, -10, 170, 20)
      var xloc = map(locprop, 0, 1, 370, 540)
      var xworklocprop = map(worklocprop, 0, 1, 370, 540)
      
      fill(180)
      rect(370, -10, xworklocprop-370, 20)
      
      fill(100)
      rect(370, -10, xloc-370, 20)
      
      fill(255)
      textSize(8)
      textFont(ralewayBold)
      text("0", 365, 0)
      text("1", 545, 0)
      fill(100)
      text("in residence", xloc, -20)
      fill(180)
      text("in workplace", xworklocprop, 20)
      
      
      
      
      // Generate data for one point and also keep track of which one is the max and min
      var maxVal = null;
      var maxHour = null;
      var minVal = null;
      var minHour = null;
      
      var dataPoint = [];
        for (var i = 0; i < 24; i++){
          dataPoint.push(rowHighlight.getNum(String(i)+"_tot"));
          if (i == 0){
            maxVal = int(rowHighlight.getNum(String(i)+"_tot"))
            maxHour = String(i)
            minVal = int(rowHighlight.getNum(String(i)+"_tot"))
            minHour = String(i)
          }else{
            if (int(rowHighlight.getNum(String(i)+"_tot")) > maxVal){
              maxVal = int(rowHighlight.getNum(String(i)+"_tot"))
              maxHour = String(i)
            }
            if (int(rowHighlight.getNum(String(i)+"_tot")) < minVal){
              minVal = int(rowHighlight.getNum(String(i)+"_tot"))
              minHour = String(i)
            } 
          }
        } 
      

      textSize(13);
      fill(colDown);
      text("Lowest: " + String(minVal) + "   at " + allhour[minHour], 450, 80);
      fill(colUp);
      text("Highest: " + String(maxVal) + "   at " + allhour[maxHour], 450, 100);
      fill(255);
      textSize(8);
      text("00:00", 370, 170);
      text("23:00", 540, 170);
      
      // draw 24 hours' population based on one point
      var xs=[];
      var ys=[];
        
      for (var i = 0; i < 24; i++){ 
        var xPoint=map(i, 0, 23, 365, 545);
        var num = norm(dataPoint[i], 0, 3000);
        var yhigh = 5 * pow(num, 0.5)
        var yPoint = 150 - yhigh
        xs.push(xPoint)
        ys.push(yPoint)
        fill(255);
        textFont(lightR);
        textSize(7)
        textAlign(CENTER)
        
        if (i == slider.value()){
          if(amount < 0){
            fill(colDown);
            ellipse(xPoint, yPoint, 6, 6);
          }else{
            fill(colUp);
            ellipse(xPoint, yPoint, 6, 6);
          } 
        }else{
          fill(255)
          ellipse(xPoint, yPoint, 3, 3);
        }     
      }    
    }    
  }
  
  
  
  // a function to set the 'index' (where it is in the array) 
  // which we can use to determine the x-position 
  this.setIndex = function(idx) {
    index = idx;
    // use setTarget() instead of x= so that it will animate
    var newX = map(index, 0, dataCount, bounds.left, bounds.right);
    // if this is the first time it's being set, create the SoftFloat
    if (x == null) {
      x = new SoftFloat(newX);
    } else {
      x.setTarget(newX);
    }
  }

  // this sets the actual value for this data point
  this.setAmount = function(amt) {
    this.amount = amt;
    amount = amt;
    if (amount < 0){
      var n = norm(-amount, 0, 2000);
      var newSize = 5 * pow(n, 0.4)
    }else{
      var n = norm(amount, 0, 2000);
      var newSize = 5 * pow(n, 0.4)
    }
    
    if (size == null) {
      size = new SoftFloat(newSize);
    } else {
      size.setTarget(newSize);
    }
  }
  
  // function to get the data point's value so it can be sorted
  this.getAmount = function() {
    return amount;
  }
  
  
  // because these are inside DataPoint, not inside another function,
  // this code will run when "new DataPoint(idx, amt)" is called, 
  // setting the initial index and amount to the numbers passed in. 
  this.setAmount(amt);
}