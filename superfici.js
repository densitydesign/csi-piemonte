var w = 700,
    h = 400,
    w2 = 675,
    h2 = 200,
    w3 = 200,
    h3 = 200,
    x = d3.scale.ordinal().rangePoints([0,w2]),
    y = d3.scale.linear().range([h2, 0]);
	y2 = d3.scale.linear().range([0, h3]);
  
//$("#slider").css("width", w);
$("#button_switch").buttonset();
//$("#sau").button( { icons: {primary:'ui-icon-gear',secondary:'ui-icon-triangle-1-s'} } );
var area = $("input[name='radio']:checked").val();

function switchColor(area) {if(area=='sau'){return "url(#yellowGradient)";}else{return "url(#redGradient)";} }



var force = d3.layout.force()
    .charge(0)
    .gravity(0)
    .size([w, h]);

var svg = d3.select("#cartogram").append("svg")
	.attr("width", w)
	.attr("height", h);

var svg2 = d3.select("#line_chart").append("svg")
	.attr("width", w2)
	.attr("height", h2)
	.append("g")
	.attr("id", "graph");

var svg3 = d3.select("#square_chart").append("svg")
	.attr("width", w3)
	.attr("height", h3);

//d3.select("#graph").attr("transform", "scale(0.9, 0.9)")

// d3.json("piemonte.json", function(piemonte) {
// 
// 
// 	var prj = d3.geo.mercator();
// 	prj.scale(45634);
// 	var translate = prj.translate();
// 	translate[0] = -700;
// 	translate[1] = 6617;
// 	prj.translate(translate);
// 	var path = d3.geo.path().projection(prj);
// 	
// 	svg
//     .selectAll("path.piemonte")
//       .data(piemonte.features)
//     .enter().append("path")
//     	.attr("class", "piemonte")
//       .attr("d", path);
// 	
// 	});
	

d3.json("superfici_1961_2010.json", function(province) {
	
	
	
var dati_provincia = function(provincia, area) {
	return	d3.entries(province.place[provincia]).map(function(d) {
		return {x: d.key, y: d.value[area]};
			});
	}
	
	x.domain(d3.entries(province.place["Piemonte"]).map(function(d) { return d.key}));
	y.domain([0, d3.max(d3.entries(dati_provincia("altre province",area)).map(function(d){ return d.value.y}))]);
	

	// svg2.selectAll("path.Piemonte")
// 	.data([dati_provincia("Piemonte",area)])
// 	.enter().append("path")
//     .attr("class", "Piemonte")
//     .attr("d", d3.svg.line()
//     .x(function(d) {return x(d.x)})
//     .y(function(d) { return y(d.y); }));
    
svg2.selectAll("path.Asti")
	.data([dati_provincia("Asti",area)])
	.enter().append("path")
    .attr("class", "Asti")
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
    .attr("fill", switchColor(area));

svg2.selectAll("path.Alessandria")
	.data([dati_provincia("Alessandria",area)])
	.enter().append("path")
    .attr("class", "Alessandria")
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
    .attr("fill", switchColor(area));

svg2.selectAll("path.Cuneo")
	.data([dati_provincia("Cuneo",area)])
	.enter().append("path")
    .attr("class", "Cuneo")
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
    .attr("fill", switchColor(area));
    
svg2.selectAll("path.altre")
	.data([dati_provincia("altre province",area)])
	.enter().append("path")
    .attr("class", "altre")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    .y(function(d) { return y(d.y); }));


svg2.selectAll("text")
     .data(dati_provincia("Piemonte",area))
   .enter().append("text")
     .attr("x", function(d) { return x(d.x); })
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", 13)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", function(d, i){ return "ticks pos_"+i})
     .style("fill", "#ccc")
    .text(function(d){ return d.x});
    
svg2.selectAll("circle.altreC")
     .data(dati_provincia("altre province",area))
   .enter().append("circle")
   	.attr("class", "altreC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2)
     .style("fill", "#ccc");
     
svg2.selectAll("circle.AstiC")
     .data(dati_provincia("Asti",area))
   .enter().append("circle")
      	.attr("class", "AstiC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2)
     .style("fill", "#ccc");
     
svg2.selectAll("circle.AlessandriaC")
     .data(dati_provincia("Alessandria",area))
   .enter().append("circle")
      	.attr("class", "AlessandriaC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2)
     .style("fill", "#ccc");

svg2.selectAll("circle.CuneoC")
     .data(dati_provincia("Cuneo",area))
   .enter().append("circle")
      	.attr("class", "CuneoC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2)
     .style("fill", "#ccc");


var supTotP = province.place["Piemonte"]["1961"]["tot"];
	y2.domain([0, supTotP]);

var data_square = [province.place["Piemonte"]["1961"]["tot"], province.place["Piemonte"]["1961"]["sau"],province.place["Piemonte"]["1961"]["suv"]];

svg3.selectAll("rect.square")
    .data(data_square)
  .enter().append("rect")
  	.attr("class", function(d, i){ return "square_"+area+"_"+i})
  	.attr("fill", function(d, i){ if (i==1){return "url(#yellowGradient)";}else if(i==2){return "url(#redGradient)";}})
    //.style("stroke", "#fff")
	//.style("stroke-width", 1)
	//.style("stroke-dasharray", 5,5)
    //.attr("x", function(d, i) { return x(i) ; })
    .attr("x", 0)
    .attr("y", function(d){return h2 - y2(d)})
    .attr("width", function(d){return y2(d)})
    .attr("height", function(d) { return y2(d); });




function icon(date, area) {
		var dati = province.place["Piemonte"];
		var percentage =Math.floor((dati[date][area]*100)/(dati["1961"][area]));
		$( "#cont_txt h3").text(percentage+'%');
		//$( "#cont_img" ).html("<img src='img/"+area+"_"+date+".png' height='150'/>")
		$( "#cont_img img" ).attr("src", "img/"+area+"_"+date+".png");
		$( ".end").hide();
		var oldIcon = $( ".start");
		oldIcon.fadeOut('fast', function(){
				$(this).attr("class", "oldStart"); 
				$( ".end").fadeIn('fast', function(){$( ".end").attr("class", "start"); $( ".oldStart").attr("class", "end")});
				
				});

		//return "<img src='img/"+area+"_"+date+".png' height='200'/><p>"+percentage+"%</p>"
		}

icon("1961", area);
//inizia il confine della regione


    
//inizia la parte del cartogramma

d3.json("province_2.json", function(states) {


	var prj = d3.geo.mercator();
	prj.scale(45634);
	var translate = prj.translate();
	translate[0] = -700;
	translate[1] = 6617;
	prj.translate(translate);
	var path = d3.geo.path().projection(prj);
	
	var nodes = [];
	links = [],
	
		states.features.forEach(function(d) { nodes.push({
		id: d.properties.NAME,
		x: path.centroid(d)[0],
		y: path.centroid(d)[1],
		gravity: {x: path.centroid(d)[0], y: path.centroid(d)[1]},
		r: Math.sqrt(d.properties.DATA["1961"][area]/100),
		value: d.properties.DATA["1961"][area]
		})
		});
	
	

	force
      .nodes(nodes)
      .links(links)
      .start()
      .on("tick", function(e) {
    var k = e.alpha * .2,
        kg = k * .1;
    nodes.forEach(function(a, i) {
      // Apply gravity forces.
      a.x += (a.gravity.x - a.x) * kg;
      a.y += (a.gravity.y - a.y) * kg;
      nodes.slice(i + 1).forEach(function(b) {
        // Check for collision
        var dx = a.x - b.x,
            dy = a.y - b.y,
            d = a.r + b.r,
            lx = Math.abs(dx),
            ly = Math.abs(dy);
        if (lx < d && ly < d) {
          lx = (lx - d) / lx * k;
          ly = (ly - d) / ly * k;
          dx *= lx;
          dy *= ly;
          a.x -= dx;
          a.y -= dy;
          b.x += dx;
          b.y += dy;
        }
      });
    });

    svg.selectAll("rect")
        .attr("x", function(d) { return d.x - d.r; })
        .attr("y", function(d) { return d.y - d.r; });
  });

  svg.selectAll("rect")
      .data(nodes)
    .enter().append("rect")
      .attr("fill", switchColor(area))
      .attr("x", function(d) { return d.x - d.r; })
      .attr("y", function(d) { return d.y - d.r; })
      .attr("width", function(d) { return d.r * 2; })
      .attr("height", function(d) { return d.r * 2; })
      .attr("class", function(d) { return d.id; })
      .attr("onmouseover", function(d) { if (d.value!=1000){return "tooltipShow('"+d.id+" - "+Math.floor(d.value)+" ha')";}})
      //.attr("onmouseover", function(d) { console.log(d); return "tooltipShow('"+d+"')";})
      .attr("onmouseout", function(d) { return "tooltipHide()";})
      .append("title")
      .text(function(d) { return d.id; });
    





$("input:radio[name=radio]").click(function() {
    area = $(this).val();
    //redraw( $("#slider").slider("value"), area);
    var date = x.domain()[$("#slider").slider("value")];
    redraw( date, area);
    icon(date, area);
});


		$( "#slider" ).slider({
			value:0,
			min: 0,
			max: x.domain().length-1,
			step: 1,
			slide: function( event, ui ) { 
			redraw(x.domain()[ui.value], area); icon(x.domain()[ui.value], area); 
			}
			
		});

	




function redraw(date, area) {
	
	//cambio titolo
	if (area == 'sau'){ 
		$("#title h1").text('superficie agricola - '+date);
		$("#right h2:first").text('variazione superficie agricola');
		}
	else{
		$("#title h1").text('superficie vite - '+date)
		$("#right h2:first").text('variazione superficie vite');
		};
	
	//ridisegno cartogramma
	states.features.forEach(function(d, i) { 
	nodes[i].r = Math.sqrt(d.properties.DATA[date][area]/100);
	//nodes[i].r = Math.log(d.properties.DATA[date][area]*100);
	nodes[i].value = d.properties.DATA[date][area];
		});	
		
		force
      .nodes(nodes)
      .links(links)
      .start()
      .on("tick", function(e) {
    var k = e.alpha * .2,
        kg = k * .1;
    nodes.forEach(function(a, i) {
      // Apply gravity forces.
      a.x += (a.gravity.x - a.x) * kg;
      a.y += (a.gravity.y - a.y) * kg;
      nodes.slice(i + 1).forEach(function(b) {
        // Check for collision
        var dx = a.x - b.x,
            dy = a.y - b.y,
            d = a.r + b.r,
            lx = Math.abs(dx),
            ly = Math.abs(dy);
        if (lx < d && ly < d) {
          lx = (lx - d) / lx * k;
          ly = (ly - d) / ly * k;
          dx *= lx;
          dy *= ly;
          a.x -= dx;
          a.y -= dy;
          b.x += dx;
          b.y += dy;
        }
      });
    });
	
	
    svg.selectAll("rect")
        .attr("x", function(d) { return d.x - d.r  ; })
        .attr("y", function(d) { return d.y - d.r ; });
  });
		
		  svg.selectAll("rect")
      .data(nodes)
    	.transition()
    	.duration(1000)
    	    .attr("fill", switchColor(area))
      .attr("x", function(d) { return d.x - d.r; })
      .attr("y", function(d) { return d.y - d.r; })
      .attr("width", function(d) { return d.r * 2; })
      .attr("height", function(d) { return d.r * 2; })
      .attr("onmouseover", function(d) { if (d.value!=1000){return "tooltipShow('"+d.id+" - "+Math.floor(d.value)+" ha')";}});
      
      	//ridisegno linegraph
      	
if (area == 'sau'){

			y.domain([0, d3.max(d3.entries(dati_provincia("altre province",area)).map(function(d){ return d.value.y}))]);
			
		}
else { 			y.domain([0, d3.max(d3.entries(dati_provincia("Asti",area)).map(function(d){ return d.value.y}))]);
}


// svg2.selectAll("path.Piemonte")
// 	.data([dati_provincia("Piemonte",area)])
//     	.transition()
//     	.duration(1000)
//     .attr("d", d3.svg.line()
//     .x(function(d) {return x(d.x)})
//     .y(function(d) { return y(d.y); }));
    

svg2.selectAll("path.Asti")
	.data([dati_provincia("Asti",area)])
    	.transition()
    	.duration(1000)
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
        .attr("fill", switchColor(area));

svg2.selectAll("path.Alessandria")
	.data([dati_provincia("Alessandria",area)])
    	.transition()
    	.duration(1000)
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
    .attr("fill", switchColor(area));

svg2.selectAll("path.Cuneo")
	.data([dati_provincia("Cuneo",area)])
    	.transition()
    	.duration(1000)
    .attr("d", d3.svg.area()
    .x(function(d) {return x(d.x)})
    .y0(h)
    .y1(function(d) { return y(d.y); }))
        .attr("fill", switchColor(area));

svg2.selectAll("path.altre")
	.data([dati_provincia("altre province",area)])
    	.transition()
    	.duration(1000)
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    .y(function(d) { return y(d.y); }));
    

svg2.selectAll("circle.altreC")
     .data(dati_provincia("altre province",area))
    	.transition()
    	.duration(1000)
    	.attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; });
     
svg2.selectAll("circle.AstiC")
     .data(dati_provincia("Asti",area))
    	.transition()
    	.duration(1000)
    	.attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; });
     
svg2.selectAll("circle.AlessandriaC")
     .data(dati_provincia("Alessandria",area))
    	.transition()
    	.duration(1000)
    	.attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; });

svg2.selectAll("circle.CuneoC")
     .data(dati_provincia("Cuneo",area))
       	.transition()
    	.duration(1000)
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; });
    

 
      
      	//ridisegno quadrati
      
      var data_square = [province.place["Piemonte"][date]["tot"], province.place["Piemonte"][date]["sau"],province.place["Piemonte"][date]["suv"]];
	
	svg3.selectAll("rect")
    .data(data_square)
	.transition()
    .duration(1000)
    .attr("class", function(d, i){ return "square_"+area+"_"+i})
    .attr("y", function(d){return h2 - y2(d)})
    .attr("width", function(d){return y2(d)})
    .attr("height", function(d) { return y2(d) });
}

});
    
    
});

function tooltipShow(data) {
 $("#tooltip").fadeIn('fast');
 
        $(this).mousemove(function(e){
        $("#tooltip").text(data);
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY - 40) + "px",
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