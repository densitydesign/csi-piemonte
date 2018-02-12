var w = 700,
    h = 400,
    w2 = 675,
    h2 = 200,
    w3 = 200,
    h3 = 200,
    x = d3.scale.ordinal().rangePoints([0,w2]),
    y = d3.scale.linear().range([h2, 0]);
	y2 = d3.scale.linear().range([0, h3]);
  
var t = .5;
//$("#slider").css("width", w);
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

//$("#sau").button( { icons: {primary:'ui-icon-gear',secondary:'ui-icon-triangle-1-s'} } );
var area = $("input[name='radio']:checked").val();

function switchColor(area) {if(area=='sau'){return "url(#yellowGradient";}else{return "url(#redGradient";} }



var force = d3.layout.force()
    .charge(0)
    .gravity(0)
    .size([w, h]);

var svg = d3.select("#cartogram").append("svg")
	.attr("width", w)
	.attr("height", h);

var svg2_1 = d3.select("#line_chart").append("svg")
	.attr("width", w2)
	.attr("height", h2+50);

	
var svg2 = svg2_1.append("g")
			.attr("id", "graph")
			.attr("transform", "translate(2,30) scale(.99,.99)");

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
    
svg2.selectAll("path.gAsti")
	.data([dati_provincia("Asti",area)])
	.enter().append("path")
    .attr("class", "gAsti "+area+"_l_3")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
   // .y0(h2)
    .y(function(d) { return y(d.y); }))
   // .attr("stroke", switchColor(area)+")");

svg2.selectAll("path.gAlessandria")
	.data([dati_provincia("Alessandria",area)])
	.enter().append("path")
    .attr("class", "gAlessandria "+area+"_l_2")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    //.y0(h2)
    .y(function(d) { return y(d.y); }))
    //.attr("stroke", switchColor(area)+"_2)");

svg2.selectAll("path.gCuneo")
	.data([dati_provincia("Cuneo",area)])
	.enter().append("path")
    .attr("class", "gCuneo "+area+"_l_1")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    //.y0(h2)
    .y(function(d) { return y(d.y); }))
   // .attr("stroke", switchColor(area)+"_3)");
    
svg2.selectAll("path.altre")
	.data([dati_provincia("altre province",area)])
	.enter().append("path")
    .attr("class", "altre")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    .y(function(d) { return y(d.y); }));


svg2_1.selectAll("text")
     .data(dati_provincia("Piemonte",area))
   .enter().append("text")
     .attr("x", function(d) { return x(d.x); })
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", 13)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", function(d, i){ return "ticks pos_"+i})
     .style("fill", "black")
    .text(function(d){ return d.x});

// la legenda


var legendaSvg2 = svg2_1.append("g");

legendaSvg2.append("text")
     .attr("x", 20)
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", h2+48)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", "ticks")
     .style("fill", "black")
     .style("font-size", "80%")
    .text("Cuneo");
    
legendaSvg2.append("rect")
	.attr("x", 2)
      .attr("y", h2+35)
     .attr("width", 15) 
     .attr("height", 15) 
     //.attr("fill", "#F4E19B")
     .attr("class", area+"_l_1 l_1");
     
legendaSvg2.append("text")
     .attr("x", 103)
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", h2+48)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", "ticks")
     .style("fill", "black")
     .style("font-size", "80%")
    .text("Alessandria");
    
legendaSvg2.append("rect")
	.attr("x", 85)
      .attr("y", h2+35)
     .attr("width", 15) 
     .attr("height", 15) 
     //.attr("fill", "#ECCB6E")
     .attr("class", area+"_l_2 l_2");

legendaSvg2.append("text")
     .attr("x", 223)
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", h2+48)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", "ticks")
     .style("fill", "black")
     .style("font-size", "80%")
    .text("Asti");
    
legendaSvg2.append("rect")
	.attr("x", 205)
      .attr("y", h2+35)
     .attr("width", 15) 
     .attr("height", 15) 
     //.attr("fill", "#E6BB56")
     .attr("class", area+"_l_3 l_3");
     
legendaSvg2.append("text")
     .attr("x", 283)
     //.attr("y", function(d) { return y(d.y)  ; })
      .attr("y", h2+48)
     //.attr("dx", -3) // padding-right
     //.attr("dy", ".35em") // vertical-align: middle
    //.attr("text-anchor", "middle")
     .attr("class", "ticks")
     .style("fill", "black")
     .style("font-size", "80%")
    .text("Altre province");
    
legendaSvg2.append("rect")
	.attr("x", 265)
      .attr("y", h2+35)
     .attr("width", 14) 
     .attr("height", 14) 
     .attr("fill", "none")
     .attr("class", "altre");
     


// finisce la legenda
    
svg2.selectAll("circle.altreC")
     .data(dati_provincia("altre province",area))
   .enter().append("circle")
   	.attr("class", "altreC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2.5)
     .style("fill", "gray")
    .attr("onmouseover", function(d) { var prov="altre province"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});
     
svg2.selectAll("circle.AstiC")
     .data(dati_provincia("Asti",area))
   .enter().append("circle")
      	.attr("class", "AstiC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2.5)
     .style("fill", "gray")
         .attr("onmouseover", function(d) { var prov="AT"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});
     
svg2.selectAll("circle.AlessandriaC")
     .data(dati_provincia("Alessandria",area))
   .enter().append("circle")
      	.attr("class", "AlessandriaC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2.5)
     .style("fill", "gray")
    .attr("onmouseover", function(d) { var prov="AL"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});

svg2.selectAll("circle.CuneoC")
     .data(dati_provincia("Cuneo",area))
   .enter().append("circle")
      	.attr("class", "CuneoC")
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
     .attr("r", 2.5)
     .style("fill", "gray")
         .attr("onmouseover", function(d) { var prov="CN"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});


var supTotP = province.place["Piemonte"]["1961"]["tot"];
	y2.domain([0, Math.sqrt(supTotP)]);

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
    .attr("y", function(d){return h3 - y2(Math.sqrt(d))})
    .attr("width", function(d){return y2(Math.sqrt(d))})
    .attr("height", function(d) { return y2(Math.sqrt(d)); });




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

d3.json("piemonte.json", function(piemonte) {
	
	var prj = d3.geo.mercator();
	prj.scale(40000);
	var translate = prj.translate();
	translate[0] = -570;
	translate[1] = 5850;
	prj.translate(translate);
	var path = d3.geo.path().projection(prj);
	
	svg
    .selectAll("path.borderPiemonte")
      .data(piemonte.features)
    .enter().append("path")
    	.attr("class", "borderPiemonte")
      .attr("d", path);
      //.attr("style", "filter:url(#dropshadow)");
	
	

d3.json("province_2.json", function(states) {


// 	var prj = d3.geo.mercator();
// 	prj.scale(40000);
// 	var translate = prj.translate();
// 	translate[0] = -600;
// 	translate[1] = 5850;
// 	prj.translate(translate);
// 	var path = d3.geo.path().projection(prj);
	

	
	var nodes = [];
	links = [],
	
		states.features.forEach(function(d) { nodes.push({
		sigla: d.properties.SIGLA,
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
    
    svg.selectAll("text")
        .attr("x", function(d) { return d.x ; })
        .attr("y", function(d) { return d.y ; });
  });

  svg.selectAll("rect")
      .data(nodes)
    .enter().append("rect")
      .attr("fill", switchColor(area)+")")
      .attr("x", function(d) { return d.x - d.r; })
      .attr("y", function(d) { return d.y - d.r; })
      .attr("width", function(d) { return d.r * 2; })
      .attr("height", function(d) { return d.r * 2; })
      .attr("class", function(d) { return d.id; })
     // .attr("onmouseover", function(d) { if (d.value!=1000){return "tooltipShow('"+d.id+" - "+Math.floor(d.value)+" ha')";}})
      //.attr("onmouseover", function(d) { console.log(d); return "tooltipShow('"+d+"')";})
     // .attr("onmouseout", function(d) { return "tooltipHide()";})
      .append("title")
      .text(function(d) { return d.id; });
      
  svg.selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("x", function(d) { return d.x ; })
      .attr("y", function(d) { return d.y ; })
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("class", "sigle")
      .text(function(d) {  if (d.value!=1000){return d.sigla}; });
    




$("input:radio[name=radio]").click(function() {
    area = $(this).val();
    //redraw( $("#slider").slider("value"), area);
    var date = x.domain()[$("#slider").slider("value")];
    redraw( date, area);
    icon(date, area);
});

			var timerCount = 0;
		$( "#slider" ).slider({
			value:0,
			min: 0,
			max: x.domain().length-1,
			step: 1,
			slide: function( event, ui ) { 
			redraw(x.domain()[ui.value], area); icon(x.domain()[ui.value], area); 
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

			
			var timerMax = $("#slider").slider("option","max");
			
			var timer = $.timer(function() {
                
                if(timerCount == timerMax ){ timerCount = 0}else{timerCount++}
                $("#slider").slider("value", timerCount);
                redraw( x.domain()[$("#slider").slider("value")], area);
                icon(x.domain()[$("#slider").slider("value")], area); 
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

function redraw(date, area) {
	
	//cambio titolo
	if (area == 'sau'){ 
		$("#title h1").text('superficie agricola utilizzata - '+date);
		$("#right h2:first").text('variazione superficie agricola utilizzata');
		}
	else{
		$("#title h1").text('superficie a vite - '+date)
		$("#right h2:first").text('variazione superficie a vite');
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
        
    svg.selectAll("text")
        .attr("x", function(d) { return d.x ; })
        .attr("y", function(d) { return d.y ; });
  });
		
		  svg.selectAll("rect")
      .data(nodes)
    	.transition()
    	.duration(1000)
    	    .attr("fill", switchColor(area)+")")
      .attr("x", function(d) { return d.x - d.r; })
      .attr("y", function(d) { return d.y - d.r; })
      .attr("width", function(d) { return d.r * 2; })
      .attr("height", function(d) { return d.r * 2; });
     // .attr("onmouseover", function(d) { if (d.value!=1000){return "tooltipShow('"+d.id+" - "+Math.floor(d.value)+" ha')";}});
      
    
      svg.selectAll("text")
      .data(nodes)
            .text(function(d) {if (d.value!=1000){return d.sigla;} })
    	.transition()
    	.duration(1000)
      .attr("x", function(d) { return d.x ; })
      .attr("y", function(d) { return d.y ; });      
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
    

svg2.selectAll("path.gAsti")
	.data([dati_provincia("Asti",area)])
    	.transition()
    	.duration(1000)
     .attr("class", "gAsti "+area+"_l_3")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    //.y0(h2)
    .y(function(d) { return y(d.y); }))
       // .attr("stroke", switchColor(area)+")");

svg2.selectAll("path.gAlessandria")
	.data([dati_provincia("Alessandria",area)])
    	.transition()
    	.duration(1000)
     .attr("class", "gAlessandria "+area+"_l_2")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    //.y0(h2)
    .y(function(d) { return y(d.y); }))
   // .attr("stroke", switchColor(area)+"_2)");

svg2.selectAll("path.gCuneo")
	.data([dati_provincia("Cuneo",area)])
    	.transition()
    	.duration(1000)
    	 .attr("class", "gCuneo "+area+"_l_1")
    .attr("d", d3.svg.line()
    .x(function(d) {return x(d.x)})
    //.y0(h2)
    .y(function(d) { return y(d.y); }))
       // .attr("stroke", switchColor(area)+"_3)");

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
     .attr("cy", function(d) { return y(d.y)  ; })    
     .attr("onmouseover", function(d) { var prov="altre province"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});
     
svg2.selectAll("circle.AstiC")
     .data(dati_provincia("Asti",area))
    	.transition()
    	.duration(1000)
    	.attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
         .attr("onmouseover", function(d) { var prov="AT"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});
     
svg2.selectAll("circle.AlessandriaC")
     .data(dati_provincia("Alessandria",area))
    	.transition()
    	.duration(1000)
    	.attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
         .attr("onmouseover", function(d) { var prov="AL"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});

svg2.selectAll("circle.CuneoC")
     .data(dati_provincia("Cuneo",area))
       	.transition()
    	.duration(1000)
     .attr("cx", function(d) { return x(d.x); })
     .attr("cy", function(d) { return y(d.y)  ; })
         .attr("onmouseover", function(d) { var prov="CN"; return "tooltipShow('"+prov+"','"+ d.y+"')";})
     .attr("onmouseout", function(d) { return "tooltipHide()";});
    
// ridisegno legenda

legendaSvg2.select("rect.l_1")
	.attr("class", area+"_l_1 l_1");

legendaSvg2.select("rect.l_2")
	.attr("class", area+"_l_2 l_2");

legendaSvg2.select("rect.l_3")
	.attr("class", area+"_l_3 l_3");
 
      
      	//ridisegno quadrati
      
      var data_square = [province.place["Piemonte"][date]["tot"], province.place["Piemonte"][date]["sau"],province.place["Piemonte"][date]["suv"]];

	svg3.selectAll("rect")
    .data(data_square)
	.transition()
    .duration(1000)
    .attr("class", function(d, i){ return "square_"+area+"_"+i})
    .attr("y", function(d){return h3 - y2(Math.sqrt(d))})
    .attr("width", function(d){return y2(Math.sqrt(d))})
    .attr("height", function(d) { return y2(Math.sqrt(d)) });
}



});
    
    });
});

// function tooltipShow(data) {
//  $("#tooltip").fadeIn('fast');
//  
//         $(this).mousemove(function(e){
//         $("#tooltip").text(data);
//         var w = $("#tooltip").width();
//         $("#tooltip").css({
//             top: (e.pageY - 40) + "px",
//             left: (e.pageX - w/2 ) + "px"
//         });
//        
//         
//   		});
// 		
//  					
//  					}
 
 function tooltipShow(prov, data) {
 $("#tooltip").fadeIn('fast');
 
        $(this).mousemove(function(e){
        $("#tooltip").text(prov+"-"+numberWithPoint(Math.floor(data))+" ha");
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY - 30) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
       
        
  		});
		
 					
 					}
 					
 function tooltipHide(){
			
 	        $("#tooltip").fadeOut('fast');
 	}
 	
 function tooltipShow2(area) {
 $("#tooltip").fadeIn('fast');
 var text_sau = "Variazioni della SAU dal 1961 al 2010";
 var text_suv ="Variazioni della superficie a vite dal 1961 al 2010";
 var text;
 if (area == "sau"){text=text_sau}else{text=text_suv};
        $(this).mousemove(function(e){
        $("#tooltip").text(text);
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY + 20) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
       
        
  		});
		
 					
 					}
 					

$(document).ready(function(){
    $("#tooltip").hide();
        });
        
function numberWithPoint(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}