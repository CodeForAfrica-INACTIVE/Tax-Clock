var canvas;
var clocked;
var pie;
var init = true;
var salary = 50000;
var hourly = 24;
var year = 2010;
var offset = 0;
  var right = 50;
  var top = 100;
jQuery(document).ready(function($) {
  
  canvas = Raphael("canvas", 1300, 1000);
  clocked = canvas.clock(400,400,400);
  pie = canvas.g.timechart(450, 500, 410);
  
  timeline = Raphael("theyears", 450, 8).timeline(400,31);
  
  $("#slider").slider({ 
    min: 1984,
    max: 2015,
    slide: function(event, ui) { $("#year").html(ui.value); },
    change: function(event, ui) {
      year =  parseInt($("#salary").html());
      getData("agency", ui.value, year);
      },
    value: 2011
  });
  
  
  $("#info").click(function(){
    getData("agency", year, salary);
  });
  
  $("#salaryRight").click(function(){
    salary = salary+5000;
    hourly = Math.round(salary / 260 / 8);
    $("#hourly").html(hourly);
    $("#salary").html(salary);
    getData("agency", year, salary);
  });
  
  $("#salaryLeft").click(function(){
    if(salary > 5000){
      salary = salary-5000;
      hourly = Math.round(salary / 260 / 8);
      $("#hourly").html(hourly);
      $("#salary").html(salary);
      getData("agency", year, salary);
    }
  });

  $("#hourlyRight").click(function(){
    hourly = hourly+1;
    salary = Math.round(hourly * 260 * 8);
    
    $("#hourly").html(hourly);
    $("#salary").html(salary);
    getData("agency", year, salary);
  });

  $("#hourlyLeft").click(function(){
    if(salary > 1){
      hourly = hourly-1;
      salary = Math.round(hourly * 260 * 8);
      
      $("#hourly").html(hourly);
      $("#salary").html(salary);
      getData("agency", year, salary);
    }
  });
  
});



var getData = function(group,year,income) {
    var base = "http://www.whatwepayfor.com/api/";
   
   var type  = "getBudgetAggregate/";
   
    var call = 
          "?group=" + group +
          "&year=" + year + 
          "&income=" + income ;
          
          
    var api  = base + type + call;
    
    Ajax.get(api, function(data) {
         var xml = data;
         if(typeof data == 'string') {
           xml = stringToXml(data);
         }
         var items = xml.getElementsByTagName('item');

         analyzeData(items, income);
         
    });
    

}

var getSubData = function(agency,year,income, place) {
   //http://www.whatwepayfor.com/api/getBudgetAccount?income=50000&year=2010&bureau=2
   
   var base = "http://www.whatwepayfor.com/api/";
   
   var type  = "getBudgetAccount/";
   
    var call = 
          "?agency=" + agency +
          "&year=" + year + 
          "&income=" + income ;
          
    var api  = base + type + call;

    Ajax.get(api, function(data) {
         var xml = data;
         if(typeof data == 'string') {
           xml = stringToXml(data);
         }
         var items = xml.getElementsByTagName('item');
         
         analyzeSubData(items, income, place);
         
    });
    

}

window.onload = getData("agency", "2011", "50000");

function analyzeData(data, income){
  var items = [],
      labels = [],
      ids = [],
      leftover = income;
      
      $(data).each(function () {
            var id     = $(this).attr('dimensionID');
            var name   = $(this).attr('dimensionName');
            var amount = Math.abs(parseInt($(this).attr('mycosti')));

            if(amount > 0){
            
            items.push(amount);
            labels.push(name);
            ids.push(id);
            
            leftover -= amount;
          }
      });
      
      var state = income * .10;
      items.push(state);
      labels.push("State/Local");
      leftover -= state;
      
      items.push(leftover);
      labels.push("Money");
      
      if(init){
        pie.draw(items, labels, ids);
        clocked.toFront();
        init = false;
      }else{
        pie.update(items, labels, ids);
      }
}

function analyzeSubData(data, income, place){
  var subitems = [],
      sublabels = [],
      other = [],
      otherlabels = [];
      
      $(data).each(function () {
            var id     = $(this).attr('accountID');
            var name   = $(this).attr('account');
            var amount = Math.abs(parseInt($(this).attr('mycosti')));
            if(amount >= 10){              
              subitems.push(amount);
              sublabels.push(name); 
            }else{
              other.push(amount);
              otherlabels.push(amount);
              
            }           
      });
      
      
      
      subpie = canvas.g.piechart(450, 500, 350);
      
      if(typeof(subpie) == 'object'){
        subpie.draw(subitems, sublabels);
      }else{
        subpie.update(subitems, sublabels);
        
      }
      
      subpie.showInfo(place);
      
      
}


function getInfo(id, place, label, val){
  
  a = getSubData(id, year, salary, place);
  
  
}

// function createPie(items, labels){
//   pie = canvas.g.piechart(402 + right, 402+top, 400, items, {legend: labels, legendpos: "east", stroke: "none"});
//   clocked.toFront();
//   
//   pie.hover(function () {
//       this.sector.stop();
//          this.sector.animate({scale: [1.04, 1.04, this.cx, this.cy]}, 500, "bounce");
//          if (this.label) {
//              this.label[0].stop();
//              this.label[0].scale(1.5);
//              this.label[1].attr({"font-weight": 800});
//          }
//      }, function () {
//          this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
//          if (this.label) {
//              this.label[0].animate({scale: 1}, 500, "bounce");
//              this.label[1].attr({"font-weight": 400});
//          }
//      });
// }
