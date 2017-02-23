var width = 850;
var height = 500;
var margin = {top: 20, right: 15, bottom: 30, left: 40};
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

var dataset;

d3.csv("grammy-seats.csv", function(error, circleData) {
	if (error) return console.warn(error);
	circleData.forEach(function(d) {
		d.x = +d.x;
		d.y = +d.y;
    d.nominations = +d.nominations;
    d.won = +d.won;
	});
  dataset = circleData;
  drawCircles(dataset);
});
var xScale = d3.scaleLinear().domain([0, 9]).range([50, width - 50]);
var yScale = d3.scaleLinear().domain([0, 5]).range([height - 90, 40]);
function drawScatterPlot(data) {
  //div.transition().duration(10).style("opacity", 0);
  document.getElementById("chartLabel").innerHTML = "Nominations vs Wins";
  // var xScale = d3.scaleLinear().domain([0, 9]).range([50, width - 40]);
  // var yScale = d3.scaleLinear().domain([0, 5]).range([height - 90, 40]);

  
  var circles = svg.selectAll("circle")
     .data(data);

     //.enter().append("circle");
  circles.exit().remove();

  console.log(circles);
  
  var xAxis = d3.axisBottom() 
        .scale(xScale).ticks(4);
  svg.append("g") 
        .attr("transform",  "translate(0,"  + (height - 90) +  ")")
        .call(xAxis); 
  var yAxis = d3.axisLeft().scale(yScale).ticks(4);
  svg.append("g") 
        .attr("transform",  "translate(50,"  + 0 +  ")")
        .call(yAxis); 
  // now add titles to the axes
  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ 40 +","+20+")")  // text is drawn off the screen top left, move down and out and rotate
      .text("Wins");
  svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+(height-30)+")")  // centre below axis
            .text("Nominations");
  


  circles.transition()
  .duration(1000)
  .attr("cx", function(d) { return xScale(d.nominations); })
  .attr("cy", function(d) { return yScale(d.won); });

  
  circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.nominations); })
    .attr("cy", function(d) { return yScale(d.won); })
    .attr("r", function (d) { return 15; })
    .style("fill", "#d3d3d3");

  circles.on("mouseenter", handleMouseOver)
  .on("mouseleave", handleMouseOut)
  .on("click", handleClick);

}

var svg = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height);

function drawCircles(data) {
  //div.transition().duration(10).style("opacity", 0);
  document.getElementById("chart").innerHTML = "";
  document.getElementById("chartLabel").innerHTML = "Back of Venue";
  svg = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height);

  var circles = svg.selectAll("circle")
     .data(data);

  circles.exit().remove();

  circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle");

  var circleAttributes = circles
    .attr("cx", function (d) { return x(d.x); })
    .attr("cy", function (d) { return y(d.y); })
    .attr("r", function (d) { return 15; })
    .style("fill", "#d3d3d3");

  circles.on("mouseenter", handleMouseOver)
  .on("mouseleave", handleMouseOut)
  .on("click", handleClick);

}

var x = d3.scaleLinear()
        .domain([1, 22])
        .range([20, width - 20]);

var y = d3.scaleLinear()
      .domain([1, 10])
      .range([20, height - 70]);

function radius(d) {
  return d.nominations * 3 + 15; 
}

function handleClick(d) {
  document.getElementById("details").innerHTML = "";
  
  var url = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro=&explaintext=&titles=";
  //var url = "https://en.wikipedia.org/wiki/"
  url += d.name;
  // var win = window.open(url, '_blank');
  // win.focus();
  callAjax(url, createDiv); 
}


function createDiv(data) {
  data = JSON.parse(data);
  console.log(data.query.pages);

  var extract;
  for (var key in data.query.pages) {
    extract = data.query.pages[key];
  }
  console.log(extract.extract);
  if (extract.extract) {
  
    document.getElementById("detailLabel").innerHTML = "More Info About: " + extract.title;
    var iframe = document.createElement("p");
    iframe.innerHTML = extract.extract;
    document.getElementById("details").appendChild(iframe);
  } else {
    document.getElementById("detailLabel").innerHTML = "No details found for: " + extract.title;
  }

}
function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("Origin", "localhost:8080");
    //xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send();
}
// Define the div for the tooltip
var div = d3.select("body").append("div") 
  .attr("class", "tooltip")       
  .style("opacity", 0);

//document.getElementByTagName("tooltip").innerHTML = '<iframe src="https://embed.spotify.com/?uri=https://play.spotify.com/track/1OAYKfE0YdrN7C1yLWaLJo" frameborder="0" allowtransparency="true"></iframe>';

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    if (this.parentNode) {
    this.parentNode.appendChild(this);
  }
  });
};

function handleMouseOver(d, i) {
    //d3.select(this).style("fill", "red");
    //div.transition().duration(0);
    d3.select(this).transition().duration(500).style("fill", function(d) {
      if (d.won > 0) {
        return "#A2DDBB";
      } else if (d.nominations > 0) {
        return "#FFD88C";
      } else {
        return "#ff7171";
      }
    }).attr("r", radius);
    d3.select(this).moveToFront();
    div.transition().duration(500).style("opacity", .9);
    div.html("Artist: " + d.name + "<br />Nominations: " + d.nominations + "<br />Won: " + d.won)
      //+ '<br /><br /><iframe src="https://embed.spotify.com/?uri=https://play.spotify.com/track/1OAYKfE0YdrN7C1yLWaLJo" frameborder="0" allowtransparency="true"></iframe>')
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY) + "px");
  }

function handleMouseOut(d, i) {
  d3.select(this).transition().duration(10).style("fill", "#d3d3d3").attr("r", 15);
  div.transition().duration(10).style("opacity", 0);
}

function filter() {

  var num = document.getElementById("nominations").value;
  console.log(num);
  if (num != 0) {
  document.getElementById("toggle").disabled = true;
  document.querySelector(".slider").style.cursor = "default"; 
  

  var toVis = dataset.filter(function(d) {
    return d["nominations"] >= num;
  });
  console.log(toVis);
  if (!toggled) {
    // console.log(toggled);
    drawScatterPlot(toVis);
  } else {
    drawCircles(toVis);
  }
} else {
  document.getElementById("toggle").disabled = false; 
  document.querySelector(".slider").style.cursor = "pointer"; 
  
  if (!toggled) {
    // console.log(toggled);
    drawScatterPlot(dataset);
  } else {
    drawCircles(dataset);
  }
}
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};
var oldToVis = {}; 
function search() {
  
  var term = document.getElementById("term").value; 
  if (term != "") {
    document.getElementById("toggle").disabled = true;
    document.querySelector(".slider").style.cursor = "default"; 

    document.getElementById("nominations").value = 0;
    document.getElementById("nomVal").value = 0;
    document.getElementById("nominations").disabled = true;
    console.log("term disabled");

  } else {
    document.getElementById("toggle").disabled = false;
    document.querySelector(".slider").style.cursor = "pointer"; 

    document.getElementById("nominations").disabled = false;
  }
  console.log(term);
  term = term.toLowerCase();
  var toVis = dataset.filter(function(d) {
    return d.name.toLowerCase().indexOf(term) !== -1;
  });
  if (JSON.stringify(oldToVis) !== JSON.stringify(toVis)) {
  if (!toggled) {

    drawScatterPlot(toVis);
    
  } else {
    drawCircles(toVis); 
  }
  // console.log("hello from search");
  // console.log(toVis[0].nominations);
  // console.log(svg.selectAll("circle"));
  // console.log(svg.selectAll("circle"));
  
  if (ObjectLength(toVis) == 1) {
      handleClick(toVis[0]);
      svg.select('circle').transition().duration(1000).style("fill", function(d) {
        if (toVis[0].won > 0) {
          return "#A2DDBB";
        } else if (toVis[0].nominations > 0) {
          return "#FFD88C";
        } else {
          return "#ff7171";
        }
      }).attr("r", radius);
      svg.select('circle').moveToFront();
      svg.select('circle')
      .attr("cx", toggled ? x(toVis[0].x) : xScale(toVis[0].nominations))
      .attr("cy", toggled ? y(toVis[0].y) : xScale(toVis[0].won));

      //div.transition().duration(500).style("opacity", .9);
      //div.html("Artist: " + toVis[0].name + "<br />Nominations: " + toVis[0].nominations + "<br />Won: " + toVis[0].won);
        //+ '<br /><br /><iframe src="https://embed.spotify.com/?uri=https://play.spotify.com/track/1OAYKfE0YdrN7C1yLWaLJo" frameborder="0" allowtransparency="true"></iframe>')
      // .style("left", (d3.event.pageX) + "px")
      // .style("top", (d3.event.pageY) + "px");
      //.style("left", (document.querySelector("#chart circle").style.left) + "px")
      //.style("top", (document.querySelector("#chart circle").style.top) + "px");
    } else  {
      div.transition().duration(10).style("opacity", 0);
      svg.select('circle').transition().duration(10).style("fill", "#d3d3d3").attr("r", 15);
    }
    oldToVis = toVis;
  } else {
  console.log(oldToVis);
  console.log(toVis);
  // div.transition().duration(10).style("opacity", 0);
  // d3.select(this).transition().duration(10).style("fill", "#d3d3d3").attr("r", 15); 
}
  
}




var toggled = true; 
document.getElementById("toggle").onchange = toggle;
function toggle() {
  if (toggled) {
    drawScatterPlot(dataset);
    toggled = false;
  } else {
    drawCircles(dataset);
    toggled = true;
  }
  // toggled = !toggled;  
}


