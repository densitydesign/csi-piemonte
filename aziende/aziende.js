var w = 900,
    h = 150;


var y = d3.scale.linear().range([0, h-30]);
var  x = d3.scale.ordinal().rangeBands([0, w], 0.5);

var y2 = d3.scale.linear().range([0, h]);
var  x2 = d3.scale.ordinal().rangeBands([0, w], 0.5);

var home = $( ".home" ).button({
            icons: {
                primary: "ui-icon-home"
            },
            text: false
        });

home.click(function() {
  // window.location = "http://labs.densitydesign.org/CSI";
  window.location = "../";
});

$("#button_switch").buttonset();
$('#button_switch .ui-button').mouseover(function() {
	//console.log($(this).attr("for"));
	tooltipShow2($(this).attr("for"))
	});

$('#button_switch .ui-button').mouseout(function() {
	tooltipHide();
	});
var area = $("input[name='radio']:checked").val();
    
// var vis = d3.select("#chart")
// 			.append('svg:svg')
// 			.attr('width',w)
// 			.attr('height',h)
// 			.append('svg:g')

var chart = d3.select("#chart").append("svg")
    .attr("class", "chart")
    .attr("width", w+100)
    .attr("height", h)  
    .append('svg:g');

var chart2 = d3.select("#chart2").append("svg")
    .attr("class", "chart")
    .attr("width", w+100)
    .attr("height", h);

$("#slider").css("width", w-90);

d3.json("aziende_agg.json", function(data) {

  // Parse numbers, and sort by value.
  // var a1982 = d3.entries(data["tipo"]).map(function(d) { return d.value["1982"].aziende});
//   var a1990 = d3.entries(data["tipo"]).map(function(d) { return d.value["1990"].aziende});
//   var a2000 = d3.entries(data["tipo"]).map(function(d) { return d.value["2000"].aziende});
//   var a2010 = d3.entries(data["tipo"]).map(function(d) { return d.value["2010"].aziende});
//   var s1982 = d3.entries(data["tipo"]).map(function(d) { return d.value["1982"].suv});
//   var s1990 = d3.entries(data["tipo"]).map(function(d) { return d.value["1990"].suv});
//   var s2000 = d3.entries(data["tipo"]).map(function(d) { return d.value["2000"].suv});
//   var s2010 = d3.entries(data["tipo"]).map(function(d) { return d.value["2010"].suv});
  //chart.attr("width",  w * a2000.length -1);
 var date="1982";
	var data_aziende = function (date, area){
	
	var aziende = d3.entries(data["tipo"]).map(function(d) { return d.value[date][area+"_a"]})
	return aziende;
	
	}
	
	var data_sup = function (date, area){
	
	var sup = d3.entries(data["tipo"]).map(function(d) { return d.value[date][area+"_s"]})
	return sup;
	
	}
	
	function switchColor(area){
		
		//if (area=="sau"){return "rgba(218,163,63, .90)"}else{return "rgba(168,29,57, .90)"}
		if (area=="sau"){return "url(#yellowGradient)"}else{return "url(#redGradient)"}
		
		}
		
	function switchTitle(area){
		
		
		if (area=="sau"){
			$("#int_tit h1").text("aziende agricole");
			$("#aziende p").text("classi di SAU");
			d3.select("#chart2 .etichetta").text("SAU");
			}
		else{
			$("#int_tit h1").text("aziende agricole con vite");
			$("#aziende p").text("classi di superficie a vite");
			d3.select("#chart2 .etichetta").text("superficie a vite");
			}
		
		}

  // Set the scale domain.
  y.domain([0, d3.max(data_aziende(date, area))]);
  x.domain(d3.entries(data["tipo"]).map(function(d) { return d.key}));
  
  y2.domain([0, Math.sqrt(d3.max(data_sup(date,area)))]);
  x2.domain(d3.entries(data["tipo"]).map(function(d) { return d.key}));

  // var bar = vis.selectAll("g.bar")
//       .data(a2000)
//     .enter().append("g")
//       .attr("class", "bar")
//       .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });
//  
//    bar.append("rect")
//       .data(a2000)
//       .attr("height", function(d) { return y(d); })
//       .attr("width", x.rangeBand())
//       .attr("transform", function(d) { return "translate(0,"+ (h-y(d)) +")"; });


// chart.selectAll("rect.back")
//     .data(a1982)
//   .enter().append("rect")
//     .attr("class","back")
//     //.attr("x", function(d, i) { return x(i) ; })
//     .attr("x", function(d) { return x(d) ; })
//     .attr("y", function(d) { return h - y(d) ; })
//     .attr("width", x.rangeBand())
//     .attr("height", function(d) { return y(d); });

chart.selectAll("rect.bar")
    .data(data_aziende(date, area))
  .enter().append("rect")
  	.attr("class", "bar")
  	.attr("fill", switchColor(area))
    //.attr("x", function(d, i) { return x(i) ; })
    .attr("x", function(d) { return x(d) ; })
    .attr("y", function(d) { return h - y(d) ; })
    .attr("width", x.rangeBand())
    .attr("height", function(d) { return y(d); });
    
chart.selectAll("text")
     .data(data_aziende(date, area))
   .enter().append("text")
     .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
     .attr("y", function(d) { return h - y(d) - 5 ; })
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
     .attr("text-anchor", "middle")
     .attr("class", "rule")
     .style("fill", "gray")
    .text(function(d){return numberWithPoint(d)});

// chart.selectAll("line")
//      .data(a1982)
//    .enter().append("line")
//      .attr("x1", function(d) { return x(d) + x.rangeBand() / 2; })
// 	 .attr("y1", function(d) { return h - y(d); })
// 	 .attr("x2", function(d) { return x(d) + x.rangeBand() / 2; })
//      .attr("y2", 0)
//      .style("stroke", "#ccc")
//      .style("stroke-dasharray", 5,5);

// chart.append("line")
//     .attr("x1", 0)
//     .attr("x2", w * a1982.length)
//     .attr("y1", h - .5)
//     .attr("y2", h - .5)
//     .style("stroke", "#000");

chart.append("text")
    .attr("x", w +100)
    .attr("y", h)
    .attr("class", "etichetta")
    .attr("text-anchor", "end")
    .text("Numero Aziende");
    

chart2.selectAll("line")
     .data(y2.ticks(8))
   .enter().append("line")
     .attr("x1", 0)
	 .attr("x2", w+15-x2.rangeBand())
     .attr("y1", function(d) { return h - y2(d) ; })
     .attr("y2", function(d) { return h - y2(d) ; })
     .style("stroke", "#ccc");
     
 chart2.append("text")
 	.attr("class", "etichetta")
     .attr("x", w +100)
     .attr("y", h)
     .attr("text-anchor", "end")
     .text("SAU");
  

// chart2.selectAll("rect.back")
//     .data(data_sup(date,area))
//   .enter().append("rect")
//     .attr("class","back")
//     //.attr("x", function(d, i) { return x(i) ; })
//     .attr("x", function(d) { return x2(d) ; })
//     .attr("y", function(d) { return h - y2(d) ; })
//     .attr("width", x2.rangeBand())
//     .attr("height", function(d) { return y2(d); });

chart2.selectAll("rect.bar")
    .data(data_sup(date,area))
  .enter().append("rect")
  	.attr("class", "bar")
  	  	.attr("fill", switchColor(area))
    //.attr("x", function(d, i) { return x(i) ; })
    .attr("x", function(d) { return x2(d) ; })
    .attr("y", function(d) { return h - y2(Math.sqrt(d)) ; })
    .attr("width", x2.rangeBand())
    .attr("height", function(d) { return y2(Math.sqrt(d)); });



chart2.selectAll(".rule")
     .data(y2.ticks(3))
     .enter().append("text")
     .attr("class", "rule")
     .attr("x", 0)
     .attr("dx", 10)
     .attr("y", function(d) { return (h - y2(d)-5); })
     .attr("text-anchor", "left")
    .text(function(d){return numberWithPoint(Math.pow(d, 2)) +" ha";})
    .style("fill", "gray");
    
// 
//   bar.append("text")
//       .attr("class", "value")
//       .attr("x", function(d) { return x(d.value); })
//       .attr("y", y.rangeBand() / 2)
//       .attr("dx", -3)
//       .attr("dy", ".35em")
//       .attr("text-anchor", "end")
//       .text(function(d) { return format(d.value); });


// $(function() {
// 		$( "#slider" ).slider({
// 			value:0,
// 			min: 0,
// 			max: 99,
// 			step: 99/3,
// 			slide: function( event, ui ) { 
// 			if (ui.value==0){redraw(a1982, s1982); $( "#amount" ).val("1982"); }
// 			else if (ui.value==33){redraw(a1990, s1990); $( "#amount" ).val("1990"); }
// 			else if (ui.value==66){redraw(a2000, s2000); $( "#amount" ).val("2000"); }
// 			else if (ui.value==99){redraw(a2010, s2010); $( "#amount" ).val("2010"); }
// 			}
// 			
// 		});
// 		$( "#label" ).append("<ul><li class='labels' style='left:0%'>1982</li><li class='labels' style='left:27%'>1990</li><li class='labels' style='left:56%' >2000</li><li class='labels' style='left:82%'>2010</li></ul>");
// 	});
	var dDate = d3.scale.ordinal().rangePoints([0,w])
	dDate.domain(d3.entries(data["tipo"]["3_0,5-1"]).map(function(d) { return d.key}));
	
	var timerCount = 0;
	
$( "#slider" ).slider({
			value:0,
			min: 0,
			max: dDate.domain().length-1,
			step: 1,
			slide: function( event, ui ) { 
			redraw(data_aziende(dDate.domain()[ui.value], area),data_sup(dDate.domain()[ui.value], area) ); 
			timerCount = ui.value;
			timer.stop();
			},
			start: function( event, ui ) { timer.stop();
			$( "#play" ).button( "option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
			}
		});
					$( "#label" ).append("<ul><li class='labels' style='left:0%'>1982</li><li class='labels' style='left:27%'>1990</li><li class='labels' style='left:56%' >2000</li><li class='labels' style='left:82%'>2010</li></ul>");


var timerMax = $("#slider").slider("option","max");
			
			var timer = $.timer(function() {
                
                if(timerCount == timerMax ){ timerCount = 0}else{timerCount++}
                $("#slider").slider("value", timerCount);
                   var date = dDate.domain()[$("#slider").slider("value")];
                redraw( data_aziende(date,area), data_sup(date,area));
               
        });
        timer.set({ time : 1500 });

$( "#play" ).button({
			text: false,
			icons: {
				primary: "ui-icon-play"
			}
		})
		.click(function() {
			var options;
			if ( $( this ).text() === "play" ) {
				
			
				options = {
					label: "pause",
					icons: {
						primary: "ui-icon-pause"
					}
					};
		
        timer.play();
	
			} else {
				
				options = {
					label: "play",
					icons: {
						primary: "ui-icon-play"
					}
				};
			timer.pause();
			}
			$( this ).button( "option", options );
		});

$("input:radio[name=radio]").click(function() {
    area = $(this).val();
    //redraw( $("#slider").slider("value"), area);
    var date = dDate.domain()[$("#slider").slider("value")];
    redraw( data_aziende(date,area), data_sup(date,area));
    switchTitle(area);
    
});


  function redraw(data1, data2) {
   
	console.log(data1, data2);
   
    chart.selectAll("rect.bar")
    	  	.attr("fill", switchColor(area))
    	.data(data1)
    	.transition()
    	.duration(1000)
    	.attr("height", function(d) { return y(d); })
    	.attr("y", function(d) { return h - y(d) - .5; })
    	//.attr("width", x.rangeBand())
    	//.attr("transform", function(d) { return "translate(0,"+ (h-y(d)) +")"; });
    	
    y2.domain([0, Math.sqrt(d3.max(data_sup(date,area)))]);
 
 	chart2.selectAll("rect.bar")
 	  	.attr("fill", switchColor(area))
    	.data(data2)
    	.transition()
    	.duration(1000)
    	.attr("height", function(d) { return y2(Math.sqrt(d)); })
    	.attr("y", function(d) { return h - y2(Math.sqrt(d)) - .5; });
    	
    	
    chart2.selectAll(".rule")
     .data(y2.ticks(3))
       .transition()
    	.duration(1000)
     .attr("y", function(d) { return (h - y2(d)-5); })
    .text(function(d){return numberWithPoint(Math.pow(d, 2)) +" ha";})
    
//     chart2.selectAll("line")
//      .data(y2.ticks(8))
//          .transition()
//     	.duration(1000)
//      .attr("y1", function(d) { return h - y2(d) ; })
//      .attr("y2", function(d) { return h - y2(d) ; });
    	
    	chart.selectAll("text.rule")
     .data(data1)
   .transition()
    .duration(1000)
     .attr("y", function(d) { d3.scale.linear().invert(d); return h - y(d) - 5 ; })
    .tween("text", function(d) { var i = d3.interpolateRound(parseInt(numberWithOutPoint(this.textContent)), parseInt(d)); return function(t) {this.textContent = numberWithPoint(i(t));}; });
 }
 
 
 

});

 function tooltipShow2(area) {
 $("#tooltip").fadeIn('fast');
 var text_sau = "Aziende agricole e SAU <br>per classi di SAU dal 1982 al 2010";
 var text_suv ="Aziende agricole con vite e superficie a vite<br> per classi di superficie a vite dal 1982 al 2010";
 var text;
 if (area == "sau"){text=text_sau}else{text=text_suv};
        $(this).mousemove(function(e){
        $("#tooltip").html(text);
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY + 20) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
       
        
  		});
}
 		
 function tooltipHide(){
			
 	        $("#tooltip").fadeOut('fast');
 	}
 			
$(document).ready(function(){
    $("#tooltip").hide();
        });
        
function numberWithPoint(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function numberWithOutPoint(x) {
    return x.toString().replace(".", "");
}