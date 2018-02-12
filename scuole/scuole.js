//2146
var geoCodeURL = "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=";
var urlOption = " &countrycodes=it&addressdetails=1&viewbox=6.62726545333862%2C46.4642219543457%2C9.21424102783203%2C44.0611000061035&bounded=1";
var interval;
var comuni;
var scuole;
var agg_regione;
var agg_province;
var agg_comuni;
var provincia = 0;
var comune = 0;
var elenco;
var selScuola;
var dock_visible = true;

var w = 200,
    h = 20;

var x = d3.scale.linear().range([0, w-40]);

var chart_1;
var chart_2;
var chart_3;

var w2 = 6,
    h2 = 150,
    pad = [20, 50, 30, 20],
    y3 = d3.scale.linear().range([0, h2-30]),
    z = d3.scale.ordinal().range(["#B55A51", "#D3981E", "#637A6B"]);
    
var x3;

var chart_4;


$( "#slider_dock" ).click(function() {
            if(dock_visible==false){
            	$(this).animate({'right': '258px'},500, function() {$(this).css('background', 'url(img/right.png) #CFCFC6 center no-repeat')});
                showText();
                dock_visible = true;
            } else {
            	$(this).animate({'right': '0'},500, function() {$(this).css('background', 'url(img/left.png) #CFCFC6 center no-repeat')});
                hideText();
                dock_visible = false;
            }
	});
   
$(window).one("click", function() {
  $( "#slider_dock" ).animate({'right': '0'},500, function() {$(this).css('background', 'url(img/left.png) #CFCFC6 center no-repeat')});
                hideText();
                dock_visible = false;
});

deltext_home();
	
	d3.json("scuole.json", function(elements) {
	
	scuole = elements;
	console.log("scuole loaded!");
	
		d3.json("scuole_regione.json", function(elements) {
	
		agg_regione = elements;
		console.log("agg_regione loaded!");
		
			d3.json("scuole_province.json", function(elements) {
	
		agg_province = elements;
		console.log("agg_province loaded!");
		
			d3.json("scuole_comuni.json", function(elements) {
	
			agg_comuni = elements;
			console.log("agg_comuni loaded!");
		
		//qui ha finito di caricare tutto
		initChart();
		init_2();
		//comuniWScuole(scuole);
		$("#city").autocomplete({
		source: scuoleSearch(scuole),
        minLength: 2,
        delay: 200,
        select: function ( event, ui ) {
   
        	selScuola= ui.item.codice;
        	
        	LProvince.visible(false);
			LComuni.visible(false);
        	searchCenter(parseFloat(ui.item.lat), parseFloat(ui.item.lon));
        	//console.log(scuole.features.filter(function(d,i){ return d.properties["codice scuola"] == ui.item.codice})[0].properties);
        	provincia = 0;
		comune= 0;
		console.log(ui.item);
		$(".provincia").empty();
		$(".comune").text(" > "+ui.item.comune);
		filterScuole(scuole,provincia,comune);
		 $(".overview").empty();
		init_2();
        	redrawLivelloScuola2(scuole.features.filter(function(d,i){ return d.properties["codice scuola"] == ui.item.codice})[0].properties);
 		
 			var curr = d3.select(".cs_"+ui.item.codice).attr("x");
 			var cont = d3.select(".overview").attr("width");
 			var box = 960;
 			var moveTo= (d3.select(".cs_"+ui.item.codice).attr("x"));
 			moveTo=moveTo-(box/2);
 			if (curr >= (cont-box) ){moveTo = cont-box}
 			 
   			$('#stacked').tinyscrollbar_update(moveTo);
        },
        open: function () {
        	$('.ui-menu').width(185); d3.select('.ui-menu').style("position", "absolute");
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top");
        }, 
        close: function () {
            $( this ).removeClass( "ui-corner-top").addClass("ui-corner-all");
            $( this ).val("cerca scuola");
        }
   });
	
	
		});

	
		});
	
		});
	
	});
	

function scuoleSearch(elements){


		var sc = d3.entries(elements.features).map(function(d){ return {label: toTitleCase(d.value.properties.DESCRIZIONE+" "+d.value.properties.DENOMINAZIONE+" ("+d.value.properties.COMUNE+")"), value:  toTitleCase(d.value.properties.DESCRIZIONE+" "+d.value.properties.DENOMINAZIONE+" ("+d.value.properties.COMUNE+")"),lat: d.value.geometry.coordinates[1],lon: d.value.geometry.coordinates[0], codice:d.value.properties["codice scuola"], comune: toTitleCase(d.value.properties.COMUNE)};
								})

return sc;
}

function searchCenter(searchLat, searchLon){
	var l ={lat: searchLat, lon: searchLon};
	//var z = map.zoom();
     animateCenterZoom(map, l, 16, 7);
	//map.center({lat: searchLat, lon: searchLon});
	}
	
function deltext_home(){
		   
   $('#city').click(
		function() {
				if (this.value == this.defaultValue) {
				this.value = '';}
				});
	$('#city').blur(
				function() {
				if (this.value == '') {
				this.value = this.defaultValue;}
		});      
	
}

function comuniWScuole(elements) {

		
		var lista = d3.keys(d3.nest()
			.key(function(d){return d.properties.COMUNE})
			.map(elements))
			
		return lista;

}

function initChart(){


//chart 1

 chart_1 = d3.select("#chart_1").append("svg")
    .attr("class", "chart_1")
    .attr("width", w+20);
    
    
	var dataC1 = d3.entries(agg_regione["regione"]["PIEMONTE"]["caratteristiche"]).map(function(d) { return Math.floor(d.value*100)});
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
	chart_1.attr("height",h*(dataC1.length))
	x.domain([0, 100]);
  	y.domain(d3.entries(agg_regione["regione"]["PIEMONTE"]["caratteristiche"]).map(function(d) { return d.key}));
  	
  
  	
  	chart_1.selectAll("rect.bar")
    .data(dataC1)
  .enter().append("rect")
  	.attr("class", "bar")
  	.attr("fill", "#444446")
  	.attr("stroke", "#F5F5EB")
    .attr("x", function(d) { return w-x(d) ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y.rangeBand())
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y.domain()[i]).substr(2)); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});
	

    
    chart_1.selectAll("text")
    .data(dataC1)
  .enter().append("text")
  	.attr("class", "valori")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .attr("y", function(d,i) { return (y.rangeBand()*i)+y.rangeBand()-4 ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y.rangeBand())
    .attr("text-anchor", "end")
    .text(function(d){return d+"%"});
    
    chart_1.selectAll("image")
    .data(dataC1)
  .enter().append("image")
  	.attr("xlink:href", function(d,i){if(d!=0){return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}})
    .attr("x", function(d) { return w ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", y.rangeBand()-1)
    .attr("height", y.rangeBand()-1)
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y.domain()[i]).substr(2)); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

//chart 2
 chart_2 = d3.select("#chart_2").append("svg")
    .attr("class", "chart_2")
    .attr("width", w+20);
    
	var dataC2 = d3.entries(agg_regione["regione"]["PIEMONTE"]["informazioni"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
	chart_2.attr("height",h*(dataC2.length))
	y2.domain(d3.entries(agg_regione["regione"]["PIEMONTE"]["informazioni"]).map(function(d) { return d.key}));
  	//y2.domain(dataC2);
  	
  	chart_2.selectAll("rect.bar")
    .data(dataC2)
  .enter().append("rect")
  	.attr("class", "bar")
  	.attr("fill", "#444446")
  	.attr("stroke", "#F5F5EB")
    .attr("x", function(d) { return w-x(d) ; })
    .attr("y", function(d,i) { return y2.rangeBand()*i ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y2.rangeBand())
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2.domain()[i]).substr(2)); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

    chart_2.selectAll("text")
    .data(dataC2)
  .enter().append("text")
  	.attr("class", "valori")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .attr("y", function(d,i) { return (y2.rangeBand()*i)+y2.rangeBand()-4 ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y2.rangeBand())
    .attr("text-anchor", "end")
    .text(function(d){return d+"%"});
    
    
        chart_2.selectAll("image")
    .data(dataC2)
  .enter().append("image")
  	.attr("xlink:href", function(d,i){return "icone/2_"+(i+1)+".png"})
    .attr("x", function(d) { return w ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", y.rangeBand()-1)
    .attr("height", y.rangeBand()-1)
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2.domain()[i]).substr(2)); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

//chart 3
 chart_3 = d3.select("#chart_3").append("svg")
    .attr("class", "chart_3")
    .attr("width", w+20);
    
	var dataC3 = d3.entries(agg_regione["regione"]["PIEMONTE"]["servizi"]).map(function(d) { return Math.floor(d.value*100)});
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
	chart_3.attr("height",h*(dataC3.length))
	y3.domain(d3.entries(agg_regione["regione"]["PIEMONTE"]["servizi"]).map(function(d) { return d.key}));
  	
  	chart_3.selectAll("rect.bar")
    .data(dataC3)
  .enter().append("rect")
  	.attr("class", "bar")
  	.attr("fill", "#444446")
  	.attr("stroke", "#F5F5EB")
    .attr("x", function(d) { return w-x(d) ; })
    .attr("y", function(d,i) { return y3.rangeBand()*i ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y3.rangeBand())
    .on("mouseover", function(d, i){$("#tooltip_2 p").text(); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});
    
        chart_3.selectAll("text")
    .data(dataC3)
  .enter().append("text")
  	.attr("class", "valori")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .attr("y", function(d,i) { return (y3.rangeBand()*i)+y3.rangeBand()-4 ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y3.rangeBand())
    .attr("text-anchor", "end")
    .text(function(d){return d+"%"});
    
        chart_3.selectAll("image")
    .data(dataC3)
  .enter().append("image")
  	.attr("xlink:href", function(d,i){return "icone/3_"+(i+1)+".png"})
    .attr("x", function(d) { return w ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", y.rangeBand()-1)
    .attr("height", y.rangeBand()-1)
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y3.domain()[i]).substr(2)); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});


}

function init_2() {

	//chart 4 (stacked)
 // Transpose the data into layers by cause.
  var totali = d3.layout.stack()(["tot Caratteristiche sito", "tot Info scuola", "tot Servizi"].map(function(totale) {
    return scuole.features.map(function(d) {
      return {x: d.properties["codice scuola"], y: d.properties[totale], descrizione: d.properties.DESCRIZIONE, denominazione: d.properties.DENOMINAZIONE,indirizzo: d.properties.INDIRIZZO, comune: d.properties.COMUNE, provincia: d.properties.PROV, mpi: d.properties.COD_MPI, data:d};
    });
  }));
  	
  	
  	
	x3 = d3.scale.ordinal().rangeBands([0, w2*(totali[0].length)], .4),
  
  chart_4 = d3.select(".overview").append("svg")
    .attr("width", w2*(totali[0].length))
    .attr("height", h2-30)
  .append("svg:g")
    .attr("transform", "translate( 0 ," + (h2-30) + ")");

  // Compute the x-domain (by date) and y-domain (by top).
  x3.domain(totali[0].map(function(d) { return d.x; }));
  y3.domain([0, d3.max(totali[totali.length - 1], function(d) { return d.y0 + d.y; })]);

  // Add a group for each cause.
  var cause = chart_4.selectAll("g.cause")
      .data(totali)
    .enter().append("g")
      .attr("class", "cause")
      .style("fill", function(d, i) {  return z(i); })
      .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

  // Add a rect for each date.
  var rect = cause.selectAll("rect")
      .data(Object)
    .enter().append("svg:rect")
     	 .attr("class", function(d, i){ return "cs_"+d.x} )
      .attr("x", function(d) { return x3(d.x); })
      .attr("y", function(d) { return -y3(d.y0) - y3(d.y); })
      .attr("height", function(d) {return y3(d.y); })
      .attr("width", x3.rangeBand())
    .attr("opacity", 1)
      .on("mouseover", function(d, i){ $("#tooltip_2 p").html(toTitleCase(d.descrizione.split("-",1)+" - "+d.denominazione+"<br> "+toTitleCase(d.comune)+" ("+d.provincia.toUpperCase()+")")); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();})
	.on("click", function(d){clickBar(d.data.properties["codice scuola"],d.data.geometry.coordinates[1],d.data.geometry.coordinates[0], d.data.properties["COMUNE"])});
		
	
d3.select('#stacked .overview').attr("width",w2*(totali[0].length));
 $('#stacked').tinyscrollbar({ axis: 'x'});

  // Add a label per date.
//   var label = chart_4.selectAll("text")
//       .data(x3.domain())
//     .enter().append("svg:text")
//       .attr("x", function(d) { return x3(d) + x3.rangeBand() / 2; })
//       .attr("y", 6)
//       .attr("text-anchor", "middle")
//       .attr("dy", ".71em")
//       .text(String);

  // Add y-axis rules.
 //  var rule = chart_4.selectAll("g.rule")
//       .data(y3.ticks(5))
//     .enter().append("svg:g")
//       .attr("class", "rule")
//       .attr("transform", function(d) { return "translate(0," + -y3(d) + ")"; });
// 
//   rule.append("svg:line")
//       .attr("x2", w2 - p[1] - p[3])
//       .style("stroke", function(d) { return d ? "#fff" : "#000"; })
//       .style("stroke-opacity", function(d) { return d ? .7 : null; });
// 
//   rule.append("svg:text")
//       .attr("x", w2 - p[1] - p[3] + 6)
//       .attr("dy", ".35em")
//       .text(d3.format(",d"));

}

function redraw_stacked(elements){

    $(".overview").empty();
    //chart 4 (stacked)
 // Transpose the data into layers by cause.
  var totali = d3.layout.stack()(["tot Caratteristiche sito", "tot Info scuola", "tot Servizi"].map(function(totale) {
    return elements.map(function(d) {
      return {x: d.properties["codice scuola"], y: d.properties[totale], descrizione: d.properties.DESCRIZIONE, denominazione: d.properties.DENOMINAZIONE,indirizzo: d.properties.INDIRIZZO, comune: d.properties.COMUNE, provincia: d.properties.PROV, mpi: d.properties.COD_MPI, data:d};
    });
  }));
  	
  	
  	
	x3 = d3.scale.ordinal().rangeBands([0, w2*(totali[0].length)], .4),
  
  chart_4 = d3.select(".overview").append("svg")
    .attr("width", w2*(totali[0].length))
    .attr("height", h2-30)
  .append("svg:g")
    .attr("transform", "translate( 0 ," + (h2-30) + ")");

d3.select('.overview svg').attr("width", w2*(totali[0].length));

  // Compute the x-domain (by date) and y-domain (by top).
  x3.domain(totali[0].map(function(d) { return d.x; }));
  //y3.domain([0, d3.max(totali[totali.length - 1], function(d) { return d.y0 + d.y; })]);

  // Add a group for each cause.
  var cause = chart_4.selectAll("g.cause")
      .data(totali)
          .enter().append("g")
      .attr("class", "cause")
      .style("fill", function(d, i) { return z(i); })
      .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });
      

  // Add a rect for each date.
      // var rect = cause.selectAll("rect")
      //.data(Object)
      //.exit().remove();
      
      var rect = cause.selectAll("rect")
      .data(Object)
 .enter().append("rect")
 		//.transition()
 		//.duration(1000)
 	  .attr("class", function(d, i){ return "cs_"+d.x} )
 	  .attr("opacity", 1)
      .attr("x", function(d) { return x3(d.x); })
      .attr("y", function(d) { return -y3(d.y0) - y3(d.y); })
      .attr("height", function(d) { return y3(d.y); })
      .attr("width", x3.rangeBand())
            .on("mouseover", function(d, i){$("#tooltip_2 p").html(toTitleCase(d.descrizione.split("-",1)+" - "+d.denominazione+"<br> "+toTitleCase(d.comune)+" ("+d.provincia.toUpperCase()+")")); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();})
		.on("click", function(d){clickBar(d.data.properties["codice scuola"],d.data.geometry.coordinates[1],d.data.geometry.coordinates[0], d.data.properties["COMUNE"])});

      
 

d3.select('#stacked .overview').attr("width",w2*(totali[0].length));
 //$('#stacked').tinyscrollbar({ axis: 'x'});
 $('#stacked').tinyscrollbar_update();
   
}

function redraw(livello, luogo){
	
	
//chart 1

	var dataC1 = d3.entries(window["agg_"+livello][livello][luogo]["caratteristiche"]).map(function(d) { return Math.floor(d.value*100)});
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(d3.entries(window["agg_"+livello][livello][luogo]["caratteristiche"]).map(function(d) { return d.key}));
  	
  	chart_1.selectAll("rect.bar")
    .data(dataC1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });
    
    chart_1.selectAll("text")
    .data(dataC1)
  .transition()
    .duration(1000)
        .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
           chart_1.selectAll("image")
    .data(dataC1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}});
    
 
    
//chart 2
	
	
	var dataC2 = d3.entries(window["agg_"+livello][livello][luogo]["informazioni"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(d3.entries(window["agg_"+livello][livello][luogo]["informazioni"]).map(function(d) { return d.key}));
  	
  	chart_2.selectAll("rect.bar")
    .data(dataC2)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });

    chart_2.selectAll("text")
    .data(dataC2)
  .transition()
    .duration(1000)
     .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
           chart_2.selectAll("image")
    .data(dataC2)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/2_"+(i+1)+".png"}else{return "icone/bn/2_"+(i+1)+".png"}});
    
    
//chart 3
	
	
	var dataC3 = d3.entries(window["agg_"+livello][livello][luogo]["servizi"]).map(function(d) { return Math.floor(d.value*100)});
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(d3.entries(window["agg_"+livello][livello][luogo]["servizi"]).map(function(d) { return d.key}));
  	
  	chart_3.selectAll("rect.bar")
    .data(dataC3)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });
    
    chart_3.selectAll("text")
    .data(dataC3)
  .transition()
    .duration(1000)
     .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
           chart_3.selectAll("image")
    .data(dataC3)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});
    
    
    


}

function redrawFiltri(elements){

	var sito = 0;
	var   raccolta= 0;
    var possibilita= 0;
     var 	forum=0;
     
     var recapiti=0;
     var PEC=0;
      var organigramma=0;
      var organizzazione=0;
      var pubblico=0;
      var docenti=0;
      var POF=0;
      var elenco=0;
      var libri=0;
      var extra=0;
      var laboratori=0;
	
		var iscrizione=0;
      var mensa=0;
      var biblioteca=0;
       var servizi=0;
	
	$.each(elements, function(index, value) {
			 sito = sito+value.properties["sito attivo"];
	    raccolta = raccolta+value.properties["raccolta feedback"];
      	possibilita = possibilita+value.properties["User Generated Content"];
      	forum = forum+value.properties["forum"];
      	
      	recapiti = recapiti+value.properties["recapiti scuola"];
      	 PEC = PEC+value.properties["PEC"];
       organigramma = organigramma+value.properties["Organigramma"];
       organizzazione =organizzazione+value.properties["Organizzazione"];
       pubblico = pubblico+value.properties["orari apertura al pubblico"];
       docenti = docenti+value.properties["Orari docenti"];
       POF= POF+value.properties["POF"];
       elenco= elenco+value.properties["Elenco docenti"];
       libri= libri+value.properties["Libri di testo"];
       extra=extra+value.properties["attivita extra curr"];
       laboratori=laboratori+value.properties["Laboratori"];
       
       var isc = value.properties["ISCRIZIONE"];
       var men = value.properties["MENSA"];
       var bib = value.properties["BIBLIOTECA"];
       var reg = value.properties["REGISTRO ON LINE"];
       if (isc >=1){
       	isc = 1;
       	iscrizione=iscrizione+isc;
       	}
       	if(men>=1){
      	mensa=mensa+men;
      	}
      	if(bib){
      	biblioteca=biblioteca+bib;
      	}
		if(reg >=1){
    	servizi=servizi+reg;
    	}
	});
	
	 	 	var dataFiltri= {
"caratteristiche":{
      "1_sito attivo" : (sito*100)/elements.length,
      "1_raccolta feedback, giudizi, suggerimenti" : (raccolta*100)/elements.length,
      "1_possibilitˆ pubblicazione User Generated Content" : (possibilita*100)/elements.length,
      "1_forum, chat, blog, fotoblog" : (forum*100)/elements.length
       },
       "informazioni":{      
"2_recapiti scuola" :(recapiti*100)/elements.length ,
      "2_PEC" : (PEC*100)/elements.length,
      "2_Organigramma" : (organigramma*100)/elements.length,
      "2_Organizzazione" : (organizzazione*100)/elements.length,
      "2_Orari apertura al pubblico" :(pubblico*100)/elements.length ,
      "2_Orari docenti" : (docenti*100)/elements.length,
      "2_POF" : (POF*100)/elements.length,
      "2_Elenco docenti" : (elenco*100)/elements.length,
      "2_Libri di testo" :(libri*100)/elements.length ,
      "2_N. attivitˆ extra curr." : (extra*100)/elements.length,
      "2_Laboratori" : (laboratori*100)/elements.length
      },
      "servizi":{
"3_Iscrizione" :(iscrizione*100)/elements.length,
      "3_Mensa" :(mensa*100)/elements.length ,
      "3_Biblioteca" :(biblioteca*100)/elements.length ,
      "3_Registro on-line" : (servizi*100)/elements.length
}
       };
       

	

//chart 1

var dataC1 = d3.entries(dataFiltri["caratteristiche"]).map(function(d) { return Math.floor(d.value)});
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(d3.entries(dataFiltri["caratteristiche"]).map(function(d) { return d.key}));
  	
  	chart_1.selectAll("rect.bar")
    .data(dataC1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });
    
    chart_1.selectAll("text")
    .data(dataC1)
  .transition()
    .duration(1000)
        .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
       chart_1.selectAll("image")
    .data(dataC1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}});
    
//chart 2
	
	
	var dataC2 = d3.entries(dataFiltri["informazioni"]).map(function(d) { return Math.floor(d.value)});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(d3.entries(dataFiltri["informazioni"]).map(function(d) { return d.key}));
  	
  	chart_2.selectAll("rect.bar")
    .data(dataC2)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });

    chart_2.selectAll("text")
    .data(dataC2)
  .transition()
    .duration(1000)
     .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
       chart_2.selectAll("image")
    .data(dataC2)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/2_"+(i+1)+".png"}else{return "icone/bn/2_"+(i+1)+".png"}});
  	
//chart 3
	
	
	var dataC3 = d3.entries(dataFiltri["servizi"]).map(function(d) { return Math.floor(d.value)});
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(d3.entries(dataFiltri["servizi"]).map(function(d) { return d.key}));
  	
  	chart_3.selectAll("rect.bar")
    .data(dataC3)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });
    
    chart_3.selectAll("text")
    .data(dataC3)
  .transition()
    .duration(1000)
     .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
       chart_3.selectAll("image")
    .data(dataC3)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});


}

function redrawLivelloScuola(data){
	
return function(){
	

//chart 1

	var dataC1 = [data["sito attivo"],data["raccolta feedback"],data["User Generated Content"],data["forum"]];
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(["sito attivo", "raccolta feedback", "User Generated Content","forum"]);
  	
  	chart_1.selectAll("rect.bar")
    .data(dataC1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0);
    
    chart_1.selectAll("text")
    .data(dataC1)
  .transition()
    .duration(1000)
    .attr("fill", function(d){if (d==1){return "#B55A51"}})
    .attr("x", function(d, i) { return w-2 ; })
    .text(function(d,i){return y.domain()[i]});
    
           chart_1.selectAll("image")
    .data(dataC1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}});
    
    
//chart 2
    var dataC2 = [data[ "recapiti scuola"],data["PEC"],data["Organigramma"],data["Organizzazione"],data["orari apertura al pubblico"],data["Orari docenti"],data["POF"],data["Elenco docenti"],data["Libri di testo"],data["attivita extra curr"],data["Laboratori"]];
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(["recapiti scuola", "PEC", "Organigramma","Organizzazione", "orari apertura al pubblico", "Orari docenti","POF","Elenco docenti", "Libri di testo", "attivita extra curr","Laboratori"]);
  	
  	chart_2.selectAll("rect.bar")
    .data(dataC2)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0);

    chart_2.selectAll("text")
    .data(dataC2)
  .transition()
    .duration(1000)
    .attr("x", function(d) { return w-2 ; })
    .attr("fill", function(d){if (d==1){return "#D3981E"}})
    .text(function(d,i){return y2.domain()[i]});
    
           chart_2.selectAll("image")
    .data(dataC2)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/2_"+(i+1)+".png"}else{return "icone/bn/2_"+(i+1)+".png"}});
    
    
//chart 3
	
	
    var dataC3 = [data[ "ISCRIZIONE"],data["MENSA"],data["BIBLIOTECA"], data["REGISTRO ON LINE"]];
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(["ISCRIZIONE","MENSA", "BIBLIOTECA", "REGISTRO ON LINE"]);
  	
  	chart_3.selectAll("rect.bar")
    .data(dataC3)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0 );

    
    chart_3.selectAll("text")
    .data(dataC3)
  .transition()
    .duration(1000)
    .attr("fill", function(d){if (d>0){return "#637A6B"}})
    .attr("x", function(d) { return w-2 ; })
    .text(function(d,i){return (y3.domain()[i]+" ("+d+")").toLowerCase()});
    
           chart_3.selectAll("image")
    .data(dataC3)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});
    
    
    var classe = ".cs_"+data["codice scuola"];
 	//console.log(classe);
	d3.selectAll('.overview rect')
		.attr("opacity",function(d){if (d.x !=data["codice scuola"]) {return 0.4}});
    
    	 var moveTo= (d3.select(classe).attr("x"));
    	 var curr = (d3.select(classe).attr("x"));
 			var cont = d3.select(".overview").attr("width");
 			var box = 960;
 			moveTo = moveTo-(box/2);
 			if (curr >= (cont-box) ){moveTo = cont-box};
 			
   $('#stacked').tinyscrollbar_update(moveTo);
    }


}

function redrawLivelloScuola2(data){
	
	

//chart 1

	var dataC1 = [data["sito attivo"],data["raccolta feedback"],data["User Generated Content"],data["forum"]];
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(["sito attivo", "raccolta feedback", "User Generated Content","forum"]);
  	
  	chart_1.selectAll("rect.bar")
    .data(dataC1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0);
    
    chart_1.selectAll("text")
    .data(dataC1)
  .transition()
    .duration(1000)
    .attr("fill", function(d){if (d==1){return "#B55A51"}})
    .attr("x", function(d, i) { return w-2 ; })
    .text(function(d,i){return y.domain()[i]});
    
     chart_1.selectAll("image")
    .data(dataC1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}});
    
//chart 2
    var dataC2 = [data[ "recapiti scuola"],data["PEC"],data["Organigramma"],data["Organizzazione"],data["orari apertura al pubblico"],data["Orari docenti"],data["POF"],data["Elenco docenti"],data["Libri di testo"],data["attivita extra curr"],data["Laboratori"]];
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(["recapiti scuola", "PEC", "Organigramma","Organizzazione", "orari apertura al pubblico", "Orari docenti","POF","Elenco docenti", "Libri di testo", "attivita extra curr","Laboratori"]);
  	
  	chart_2.selectAll("rect.bar")
    .data(dataC2)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0);

    chart_2.selectAll("text")
    .data(dataC2)
  .transition()
    .duration(1000)
    .attr("x", function(d) { return w-2 ; })
    .attr("fill", function(d){if (d==1){return "#D3981E"}})
    .text(function(d,i){return y2.domain()[i]});
    
     chart_2.selectAll("image")
    .data(dataC2)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/2_"+(i+1)+".png"}else{return "icone/bn/2_"+(i+1)+".png"}});
    
//chart 3
	
	
    var dataC3 = [data[ "ISCRIZIONE"],data["MENSA"],data["BIBLIOTECA"], data["REGISTRO ON LINE"]];
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(["ISCRIZIONE","MENSA", "BIBLIOTECA", "REGISTRO ON LINE"]);
  	
  	chart_3.selectAll("rect.bar")
    .data(dataC3)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0 );

    
    chart_3.selectAll("text")
    .data(dataC3)
  .transition()
    .duration(1000)
    .attr("fill", function(d){if (d>0){return "#637A6B"}})
    .attr("x", function(d) { return w-2 ; })
    .text(function(d,i){return (y3.domain()[i]+" ("+d+")").toLowerCase()});
    
     chart_3.selectAll("image")
    .data(dataC3)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});
    
    var classe = ".cs_"+data["codice scuola"];
 	//console.log(classe);
	d3.selectAll('.overview rect')
		.attr("opacity",function(d){if (d.x !=data["codice scuola"]) {return 0.4}});
        
     var moveTo= (d3.select(classe).attr("x"));
    	 var curr = (d3.select(classe).attr("x"));
 			var cont = d3.select(".overview").attr("width");
 			var box = 960;
 			moveTo=moveTo-(box/2);
 			if (curr >= (cont-box) ){moveTo = cont-box};
 			//else if(curr < (960/2)){moveTo = 0}
 			
 			
   $('#stacked').tinyscrollbar_update(moveTo);
    


}


$("#tooltip").hide();
$("#tooltip_2").hide();
$( "#grado" ).buttonset();
$( "#tipo" ).buttonset();
$( "#filter").change(function(){

	var filtered = filterScuole(scuole,provincia,comune);
	redrawFiltri(filtered);
	
	})
$( ".piemonte").click(function(){
		LProvince.visible(true);
		LComuni.visible(false);
		var centroid = [7.9,45.25]
		//zoomHandler(0, centroid, 7.6, 7, 9);
		var l = {lat: centroid[1], lon:centroid[0]};
		animateCenterZoom(map, l, 7.6, 7)
		
		provincia = 0;
		comune= 0;
		$(".provincia").empty();
		$(".comune").empty();
		filterScuole(scuole,provincia,comune);
		redraw("regione", "PIEMONTE");
		
		
	});


var po = org.polymaps;


var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 45.25, lon: 7.9})
    .zoom(7.6)
    .zoomRange([7.6,16])
    .add(po.interact());

map.add(po.image()
	.id("tile")
    .url(po.url("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

var LScuole = po.geoJson();
map.add(LScuole
    .url("scuole.json")
    //.features(checkFilter())
    .on("load", loadScuole)
    );

var LProvince = po.geoJson();
map.add(LProvince
    .url("province.json")
    .on("load", loadProvince)
    );
    
var LComuni = po.geoJson();

map.add(LComuni
    .on("load", loadComuni));


map.add(po.compass()
	//.position("10")
    .pan("none"));





function loadScuole(e) {
	
  for (var i = 0; i < e.features.length; i++) {
  
    var c = e.features[i].element;
    c.setAttribute("r", 3);
    	if (selScuola == e.features[i].data.properties["codice scuola"]){c.setAttribute("stroke", "#B55A51");c.setAttribute("stroke-width", 3);c.setAttribute("r", 5);}
        if(e.features[i].data.properties["DESCRIZIONE"]=="SCUOLA D'INFANZIA"){c.setAttribute("fill", "#D0B58B")}
        else if(e.features[i].data.properties["DESCRIZIONE"]=="SCUOLA PRIMARIA"){c.setAttribute("fill", "#505270")}
        else if(e.features[i].data.properties["DESCRIZIONE"]=="SCUOLA SEC. I GRADO"){c.setAttribute("fill", "#6CA880")}
        else{c.setAttribute("fill", "#774038")}
        //c.setAttribute("fill", "#444446");
		c.setAttribute("opacity", "0.8");        
        c.addEventListener("mouseover", showTooltip4(e.features[i].data), false);
        c.addEventListener("click", redrawLivelloScuola(e.features[i].data.properties), false);


 }
}

function loadProvince(e) {
  for (var i = 0; i < e.features.length; i++) {
  
  	
  	
  	var p = e.features[i].data.properties;
    var c = e.features[i].element;
    	c.setAttribute("class", "provincia");
        c.setAttribute("fill", "gray");
        c.setAttribute("fill-opacity", 0.1);
        c.setAttribute("stroke", "gray");
        c.setAttribute("stroke-width", 1);
     	c.addEventListener("click", addLayer(p.PROV, p.SIGLA, p.CENTROID, p.TOPONIMO), false);
		c.addEventListener("mouseover", showTooltip(e.features[i].data), false);
     	 //centroid(e.features[i].data.geometry.coordinates[0], e.features[i].data.properties.PROV )

 }
 
}

function loadComuni(e) {
		
  for (var i = 0; i < e.features.length; i++) {
  
  	var p = e.features[i].data.properties;
    var c = e.features[i].element;
    	c.setAttribute("class", "comune");
        c.setAttribute("fill", "gray");
        c.setAttribute("fill-opacity", 0.1);
        c.setAttribute("stroke", "gray");
        c.setAttribute("stroke-width", 1);
    var centroidC =  centroid(e.features[i].data.geometry.coordinates[0]);
 
    	var presenza = $.inArray(p.TOPONIMO.toUpperCase(), elenco);
    	if (presenza != -1){
        c.addEventListener("click", zoomInComune(centroidC, p.TOPONIMO, p.PROV), false);
        c.addEventListener("mouseover", showTooltip2(e.features[i].data), false);
        }
	  else{c.addEventListener("mouseover", showTooltip3(e.features[i].data), false);}      

 }
}

function addLayer(prov_num, sigla, centroid, prov_nome){
	return function(e) {
		
		d3.json("comuni_"+prov_num+".json", function(elements) {
		
		var l = {lat: centroid[1], lon:centroid[0]};
		$(".provincia").text(" > "+prov_nome);
		$(".comune").empty();
		$(".provincia").click(function(){
		
		LProvince.visible(true);
		$(".comune").empty();
		//zoomHandler(e, centroid, 9, 8, 10);
		animateCenterZoom(map, l, 9, 8)
		comune= 0;
		provincia = sigla;
		filterScuole(scuole,sigla,0);
		redraw("province", sigla);
			
			});

		elenco = comuniWScuole(filterScuole(scuole,sigla,0));	
		//zoomHandler(e, centroid, 9, 8, 10);
		animateCenterZoom(map, l, 9, 8)
		//checkFilter(sigla,0);
		comune = 0;
		provincia = sigla;
		var filtered = filterScuole(scuole, sigla, 0);
		redraw("province", sigla);
		comuni = elements;
		LComuni.features(elements.features);
		//LComuni.url("comuni_"+prov_num+".json");
		LComuni.visible(true);
    	LComuni.reload();
    	
    	});
    	
    	
    	
    
		
    
    }
	
	}
	
function zoomInComune(centroid, com, prov_num){
	return function(e) {
	var l = {lat: centroid[1], lon:centroid[0]};
		$(".comune").click(function(){
		
animateCenterZoom(map, l, 12, 11)
		//provincia = 0;
		comune = com;
		//filterScuole(scuole, provincia, comune);
		
		//da sistemare
 
    	redraw("comuni", com.toUpperCase());
			
			});
		$(".comune").text(" > "+toTitleCase(com));
		
		//zoomHandler(e, centroid, 12, 11, 14);
		animateCenterZoom(map, l, 12, 11)
		provincia = 0;
		comune = com;
		filterScuole(scuole, provincia, comune);
		
		//da sistemare
		LComuni.features(filterSelCom(comuni.features, com));
    	LComuni.reload();
    	LProvince.visible(false);
    	redraw("comuni", com.toUpperCase());
    }
	
	}

function filterScuole(elements, prov, com){

	var grado=[];
var tipo=[];

$('#grado :checked').each(function() {
       grado.push($(this).val());
     });

$('#tipo :checked').each(function() {
       tipo.push($(this).val());
     });


	
	filtro_loc=[];

	if(prov !=0){ filtro_loc= elements.features.filter(function(d,i){ return d.properties.PROV == prov});}
	else if(com !=0){ filtro_loc= elements.features.filter(function(d,i){ return (d.properties.COMUNE).toLowerCase() == com.toLowerCase()});}
	else{filtro_loc = elements.features}
	
	
	
	
	var filtro_grado=[];
	$.each(grado, function(index, value) { 
		filtro_grado = filtro_grado.concat(filtro_loc.filter(function(d,i){ return d.properties.GRADO_SCOLASTICO == value}));

		});

	var filtro_tipo=[];
	
	$.each(tipo, function(index, value) { 
		
		filtro_tipo = filtro_tipo.concat(filtro_grado.filter(function(d,i){ return d.properties.TIPO_SCUOLA == value}));
		
		});
	
	var filteredScuole = filtro_tipo;
	
	if (com == 0){redraw_stacked(filteredScuole)};
	LScuole.features(filteredScuole);
	LScuole.reload();
	return filteredScuole;
	
	};
	


function filterJson(elements, condition){
	
	
	var filteredComuni = elements.features.filter(function(d, i){ return parseInt(d.properties.PROV) == parseInt(condition) })
	
	return filteredComuni;
	
	};

function filterSelCom(elements, condition){
	
	//elements = (d3.entries(elements).map(function(d){return d.value.data}));
	var filteredComuni = elements.filter(function(d, i){ return d.properties.TOPONIMO != condition })
	
	
	return filteredComuni;
	
	};
	
	

// d3.json("scuole.json", function(scuole) {
// 	
// 
// 			var scuole_f = scuole.features.map(function(d, i){ if (d.properties["sito attivo"] == 1){d.properties["tot Caratteristiche sito"]++} return d})
// 			
// 	var new_school = {"type": "FeatureCollection","features":scuole_f};
// 	d3.select('#result').text(JSON.stringify(new_school));
// 	
// 	
// });

function clickBar(codice,lat,lon,com){
			provincia = 0;
		comune= 0;
		$(".provincia").empty();
		$(".comune").text(" > "+com);
		filterScuole(scuole,provincia,comune);
		selScuola= codice
			LScuole.reload();
        	LProvince.visible(false);
			LComuni.visible(false);
        	searchCenter(parseFloat(lat), parseFloat(lon));
        	//console.log(scuole.features.filter(function(d,i){ return d.properties["codice scuola"] == ui.item.codice})[0].properties);
        	redrawLivelloScuola2(scuole.features.filter(function(d,i){return d.properties["codice scuola"] == codice})[0].properties);
			
		
		}

function zoomHandler(e, centroid, zoomTarget, zoomMax, zoomMin) {
var centroidProv = {lat: centroid[1], lon:centroid[0]};
		//console.log(map.center(), map.pointLocation(map.mouse(e)), centroidProv);
		
          var level = zoomTarget,
          		i = 2, 
          		delta = (level -map.zoom())/i,
          		//relativeTo = map.mouse(e);
          		relativeTo = map.locationPoint(centroidProv);
          		//var prova = map.locationCoordinate({lat: lon_c, lon: lat_c});
          		//var relativeTo = {x: prova.column, y: prova.row};
            //console.log(map.locationCoordinate(map.center()), map.locationCoordinate({lat: lon_c, lon: lat_c}));

			//mappa.zoom(map.zoom());
          var int = setInterval(advance, 40);

          function advance() {
          	 map.zoomRange([zoomMax, zoomMin]);
            map.zoomBy(delta, relativeTo);
            //console.log(map.locationCoordinate({lat: lon_c, lon: lat_c}));
           // map.center({lat: lon_c, lon: lat_c})
            if (--i == 0) {
              clearInterval(int);
             // mappa.zoom(null);
              map.zoom(level, relativeTo);
              //map.panBy({x: 700, y:700 })
              
            map.center(centroidProv);
	
              
            }
          }
        }

function centroid(element){

var latXTotal = 0;
var latYTotal = 0;
var lonDegreesTotal = 0;

var currentLatLong;
for (var i = 0; currentLatLong = element[i]; i++) { 
    var latDegrees = currentLatLong[0];
    var lonDegrees = currentLatLong[1];
    var latRadians = Math.PI * latDegrees / 180;
    latXTotal += Math.cos(latRadians);
    latYTotal += Math.sin(latRadians);

    lonDegreesTotal += lonDegrees;
}

var finalLatRadians = Math.atan2(latYTotal, latXTotal);
var finalLatDegrees = finalLatRadians * 180 / Math.PI;

var finalLonDegrees = lonDegreesTotal / element.length;

return [finalLatDegrees, finalLonDegrees];

}

function showTooltip(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text("Provincia di "+toTitleCase(data.properties.TOPONIMO));
       $("#tooltip .nScuole").text(agg_province.province[data.properties.SIGLA].N_SCUOLE);
       $("#tooltip .nStudenti").text(agg_province.province[data.properties.SIGLA].N_STUDENTI);
       var w = $("#tooltip").width();
       var h = $("#tooltip").height();
              var left = e.pageX - w/2;
       if(e.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(e.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-e.pageX));}
        $("#tooltip").css({
            top: (e.pageY - h-20) + "px",
            left: left + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 			}
 					
 		}
 
function showTooltip2(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text("Comune di "+toTitleCase(data.properties.TOPONIMO));
         $("#tooltip .nScuole").text(agg_comuni.comuni[(data.properties.TOPONIMO).toUpperCase()].N_SCUOLE);
         var nstud= agg_comuni.comuni[(data.properties.TOPONIMO).toUpperCase()].N_STUDENTI;
         if (agg_comuni.comuni[(data.properties.TOPONIMO).toUpperCase()].N_STUDENTI == 0){ nstud = "ND"}
       $("#tooltip .nStudenti").text(nstud);
       var w = $("#tooltip").width();
       var h = $("#tooltip").height();
        var left = e.pageX - w/2;
       if(e.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(e.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-e.pageX));}
        $("#tooltip").css({
            top: (e.pageY - h-20) + "px",
            left: left + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 			}
 					
 		}
 
 function showTooltip3(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text("Comune di "+toTitleCase(data.properties.TOPONIMO));
         $("#tooltip .nScuole").text("Nessuna scuola presente");
        $("#tooltip .nStudenti").text("-");
       var w = $("#tooltip").width();
       var h = $("#tooltip").height();
            var left = e.pageX - w/2;
       if(e.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(e.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-e.pageX));}
        $("#tooltip").css({
            top: (e.pageY - h-20) + "px",
            left:left + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 			}
 					
 		}

function showTooltip4(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){

 	    var servizi = 0;
 	    if(data.properties.ISCRIZIONE !=0){servizi++}
 	    if(data.properties.MENSA !=0){servizi++}
 	    if(data.properties.BIBLIOTECA !=0){servizi++}
 	    if(data.properties["REGISTRO ON LINE"] !=0){servizi++}
 	    
 	    var tipo;
 	   if(data.properties.TIPO_SCUOLA == 1){tipo = "Statale"}
 	   else{tipo="Privata"}
       $("#tooltip h2").text(toTitleCase(data.properties.DESCRIZIONE).split("-",1)+" - "+toTitleCase(data.properties.DENOMINAZIONE));
         $("#tooltip .nScuole").text(toTitleCase(data.properties.INDIRIZZO));
        $("#tooltip .nStudenti").text(data.properties["N. studenti"]);
         $("#tooltip .nIndicatori").html("Scuola "+tipo+"<br>Caratteristiche sito "+data.properties["tot Caratteristiche sito"]+"/4<br>Informazioni scuola "+data.properties["tot Info scuola"]+"/11<br>Servizi on-line "+servizi+"/4");
       var w = $("#tooltip").width();
       var h = $("#tooltip").height();
       var left = e.pageX - w/2;
       if(e.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(e.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-e.pageX));}
        $("#tooltip").css({
            top: (e.pageY - h-20) + "px",
            left: left + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
         $("#tooltip .nIndicatori").empty();
    });
 			}
 					
 		}
 		
function showText() {
            $( "#dock" ).show( 'slide',{ direction: "right" }, 500);
        };
        
function hideText() {

            $( "#dock" ).hide( 'slide',{ direction: "right" }, 500);
        };

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


/*zoom*/
function animateCenterZoom(map, l1, z1, z2) {

    var start = po.map.locationCoordinate(map.center()),
        end   = po.map.locationCoordinate(l1);
        
    var c0 = { x: start.column, y: start.row },
        c1 = { x: end.column, y: end.row };

    // how much world can we see at zoom 0?
    var w0 = visibleWorld(map);

    // z1 is ds times bigger than this zoom:
    var ds = Math.pow(2, z1 - map.zoom());
    
    // so how much world at zoom z1?
    var w1 = w0 / ds;
    
    if (interval) {
        clearInterval(interval);
        interval = 0;
        
    }
    
    // GO!
    animateStep(z1, z2, map, c0, w0, c1, w1);

}

function visibleWorld(map) {
    // how much world can we see at zoom 0?
    var tileCenter = po.map.locationCoordinate(map.center());
    var topLeft = map.pointCoordinate(tileCenter, { x:0, y:0 });
    var bottomRight = map.pointCoordinate(tileCenter, map.size())
    var correction = Math.pow(2, topLeft.zoom);
    topLeft.column /= correction;
    bottomRight.column /= correction;
    topLeft.row /= correction;
    bottomRight.row /= correction;
    topLeft.zoom = bottomRight.zoom = 0;
    return Math.max(bottomRight.column-topLeft.column, bottomRight.row-topLeft.row);
}

function sq(n) { return n*n; }

function dist(a,b) { return Math.sqrt(sq(b.x-a.x)+sq(b.y-a.y)); }

function lerp1(a,b,p) { return a + ((b-a) * p) }

function lerp2(a,b,p) { return { x: lerp1(a.x,b.x,p), y: lerp1(a.y,b.y,p) }; }

function cosh(x) { return (Math.exp(x) + Math.exp(-x)) / 2; }

function sinh(x) { return (Math.exp(x) - Math.exp(-x)) / 2; }

function tanh(x) { return sinh(x) / cosh(x); }

function animateStep(z, z2, map,c0,w0,c1,w1,V,rho) {

    // see section 6 for user testing to derive these values (they can be tuned)
    if (V === undefined)     V = 2.0;  // section 6 suggests 0.9
    if (rho === undefined) rho = 1.42; // section 6 suggests 1.42

    // simple interpolation of positions will be fine:
    var u0 = 0,
        u1 = dist(c0,c1);

    // i = 0 or 1
    function b(i) {
        var n = sq(w1) - sq(w0) + ((i ? -1 : 1) * Math.pow(rho,4) * sq(u1-u0));
        var d = 2 * (i ? w1 : w0) * sq(rho) * (u1-u0);
        return n / d;
    }
    
    // give this a b(0) or b(1)
    function r(b) {
        return Math.log(-b + Math.sqrt(sq(b)+1));
    }
    
    var r0 = r(b(0)),
        r1 = r(b(1)),
        S = (r1-r0) / rho; // "distance"
    
    function u(s) {
        var a = w0/sq(rho),
            b = a * cosh(r0) * tanh(rho*s + r0),
            c = a * sinh(r0);
        return b - c + u0;
    }
    
    function w(s) {
        return w0 * cosh(r0) / cosh(rho*s + r0);
    }

    // special case
    if (Math.abs(u0-u1) < 0.000001) {
        if (Math.abs(w0-w1) < 0.000001) return;
    
        var k = w1 < w0 ? -1 : 1;
        S = Math.abs(Math.log(w1/w0)) / rho;
        u = function(s) { 
            return u0;
        }
        w = function(s) { 
            return w0 * Math.exp(k * rho * s);
        }
    }

    var t0 = Date.now();
    interval = setInterval(function() {
        var t1 = Date.now();
        var t = (t1 - t0) / 250.0;
        var s = V * t;
        if (s > S) {
            s = S;
            clearInterval(interval);
            interval = 0;
            map.zoomRange([z2,16])
        }
        var us = u(s);
        var pos = lerp2(c0,c1,(us-u0)/(u1-u0));
        applyPos(map, pos, w(s));
    }, 40);

}

function applyPos(map,pos,w) {
    var w0 = visibleWorld(map), // how much world can we see at zoom 0?
        size = map.size(),
       z = Math.log(w0/w) / Math.LN2,
	//z = map.zoom();
        p = { x: size.x / 2, y: size.y / 2 },
        l  = po.map.coordinateLocation({ row: pos.y, column: pos.x, zoom: 0 });
    map.zoomBy(z, p, l);
} 


//debug

d3.json("scuole.json", function(elements) {
	

})