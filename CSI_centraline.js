var po = org.polymaps;
var aperto = false;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
   //.centerRange([{lat: 46.66, lon:9.6}, {lat: 43.64, lon:6.36 }])
    .center({lat: 45.3, lon: 7.8})
    .zoom(8)
    .zoomRange([8,15])
    .add(po.interact());

var mappa= po.image();
map.add(mappa
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af"
    + "/39505/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));
//20760
//1796
// map.add(po.image()
//     .url(po.url("http://spaceclaw.stamen.com/toner/{Z}/{X}/{Y}.png")
//     .hosts(["a.", "b.", "c.", ""])));

var markerCentrali = po.geoJson();
var piemonte = po.geoJson();
var sezioni = po.geoJson();
var centrale = po.geoJson();

map.add(markerCentrali
    .url("centrali.json")
    .on("load", load_centrali)
    .id("LCentrali")
    //.clip(false)
    );
    
map.add(piemonte
    .url("piemonte.json")
    .on("load", load_boarders)
    );

map.add(po.compass()
    .pan("none"));

function load_centrali(e) {
  for (var i = 0; i < e.features.length; i++) {
  
	// var abitanti = (e.features[i].data.properties.ABITANTI);
	var tipo = (e.features[i].data.properties.TIPO_ADSL);
// 	var abitanti = (e.features[i].data.properties.POPOLAZIONE_SEZIONE);
    var c = e.features[i].element;
    
    c.setAttribute("opacity", 1);
    c.setAttribute("r", 4);
    c.setAttribute("class", "centrali");
    c.setAttribute("stroke-width", "1")
    c.setAttribute("stroke", "white")
    c.setAttribute("cursor", "pointer");
    
    
    if (tipo == "ADSL_2P"){
        c.setAttribute("fill", "#b93936");
    }
    else if (tipo == "ADSL_1"){
    	c.setAttribute("fill", "#ea7e24");
    }
    else if (tipo == "ADSL_M"){
    	c.setAttribute("fill", "#35627f");
    }
    else if (tipo == "NO"){
    	c.setAttribute("fill", "#85c0bc");
    }
    else {c.setAttribute("fill", "none");}
//     
//     
//     
//  	if (isNaN(abitanti)==false && tipo != null && nome == "ALESSANDRIA CRISTO"){
//         c.setAttribute("r", Math.log(abitanti)/Math.log(5));
//         c.setAttribute("fill", "#000000");
//         //c.setAttribute("r", 3);
//         }
//     else { c.setAttribute("r", 0);}
       // console.log(map.locationPoint({lat: e.features[i].data.geometry.coordinates[1], lon:e.features[i].data.geometry.coordinates[0]}))
    var p = e.features[i].data.properties;
    var coord = e.features[i].data.geometry.coordinates;
	c.addEventListener("click", layerSezioni(p.ID_Central, coord[1], coord[0] ), false);
    c.addEventListener("mouseover", mo_centrali(e.features[i].data), false);
    //console.log(e.features[i].data);

 }

}

function load_boarders(e) {
  for (var i = 0; i < e.features.length; i++) {
  
	//var op = (e.features[i].data.properties.alpha);
    var c = e.features[i].element;
        c.setAttribute("opacity", 0.6);
        c.setAttribute("fill", "none");
        c.setAttribute("stroke", "black");
        c.setAttribute("stroke-width", 2);
       // console.log(map.locationPoint({lat: e.features[i].data.geometry.coordinates[1], lon:e.features[i].data.geometry.coordinates[0]}))

 }
}

function load_centrale(e) {
  for (var i = 0; i < e.features.length; i++) {
  
	//var op = (e.features[i].data.properties.alpha);
    var c = e.features[i].element;
        c.setAttribute("opacity", 1);
        c.setAttribute("fill", "black");
        c.setAttribute("stroke", "white");
        c.setAttribute("stroke-width", 1);
        c.setAttribute("r", 4);
       // console.log(map.locationPoint({lat: e.features[i].data.geometry.coordinates[1], lon:e.features[i].data.geometry.coordinates[0]}))

 }
}

function load_sezioni(e) {
	var rangeSegnale = [];
	var totAbitanti = 0;
	var totSezioni = [];
	for (var i = 0; i < e.features.length; i++){
		
		var segnale = (e.features[i].data.properties.POTENZA_SEGNALE);
		var abitanti = (e.features[i].data.properties.POPOLAZIONE_SEZIONE);
		
		if (segnale > 0 && segnale != null){
			rangeSegnale.push(parseFloat(segnale));
		}
		
		if (abitanti > 0 && segnale != null){
		//console.log(abitanti);
			totAbitanti = totAbitanti+parseInt(abitanti);
			totSezioni.push(abitanti);
		}
	}
	var centr = e.features[0].data.properties;
	$('.centr_comune').text(centr.COMUNE_CENTR);
	$('.centr_nome').html('nome centrale:<br>'+ '<h4>'+toTitleCase(centr.NOME_CENTRALE)+'</h4>');
	$('.centr_indirizzo').html('indirizzo:<br>'+ '<h4>'+toTitleCase(centr.INDIRIZZO_CENTRALE)+'</h4>');
	$('.centr_potenza').text(centr.DESCRIZIONE_TIPO_ADSL);
	$('.centr_sezioni').html('sezioni servite:<br>'+'<h4>'+ totSezioni.length+'</h4>');
	$('.centr_utenti').html('abitanti serviti:<br>'+'<h4>'+ totAbitanti+'</h4>');
	
	
	
	var color = d3.scale.quantize()
			.domain([d3.min(rangeSegnale), d3.max(rangeSegnale)])
			.range(d3.range(4));
	//console.log(d3.min(rangeSegnale), d3.max(rangeSegnale));
	var sMin = d3.min(rangeSegnale);
	var sMax = d3.max(rangeSegnale);
	
  for (var i = 0; i < e.features.length; i++) {
  
	var abitanti = (e.features[i].data.properties.POPOLAZIONE_SEZIONE);
	var segnale = (e.features[i].data.properties.POTENZA_SEGNALE);
	var tipo = e.features[i].data.properties.TIPO_ADSL
    var c = e.features[i].element;
    c.setAttribute("stroke-width", "1");
    c.setAttribute("stroke", "white");
    c.setAttribute("cursor", "pointer");

	if (segnale > 0 && segnale != null && tipo == 'ADSL_2P'){
	
		if (color(segnale) == 0){c.setAttribute("fill", "#FCBBA1");}
		else if (color(segnale) == 1){c.setAttribute("fill", "#FC9272");}
		else if (color(segnale) == 2){c.setAttribute("fill", "#EF3B2C");}
		else if (color(segnale) == 3){c.setAttribute("fill", "#99000D");}
	
    }
    else if(segnale > 0 && segnale != null && tipo == 'ADSL_1'){
		
		if (color(segnale) == 0){c.setAttribute("fill", "#FEE391");}
		else if (color(segnale) == 1){c.setAttribute("fill", "#FEC44F");}
		else if (color(segnale) == 2){c.setAttribute("fill", "#FE9929");}
		else if (color(segnale) == 3){c.setAttribute("fill", "#EC7014");}
    
    }
    
    else if(segnale > 0 && segnale != null && tipo == 'ADSL_M'){
		
		if (segnale != 0 && segnale != null){c.setAttribute("fill", "#35627f");}
		else {c.setAttribute("fill", "#c2c2c2");}
    
    }
    
    else if(tipo == 'NO'){
    
    	c.setAttribute("fill", "#85c0bc")
    
    }
    else {c.setAttribute("fill", "#c2c2c2")}
    
//     if ( segnale >= 19523 && segnale < 19762 ){
//         c.setAttribute("fill", "#C24529");
//     }
//     else if (segnale >= 7000 && segnale < 19523){
//     	c.setAttribute("fill", "#CE665C");
//     }
//     else if (segnale >= 6875 && segnale < 7000){
//     	c.setAttribute("fill", "#D88A82");
//     }
//     else if (segnale >= 119 && segnale < 6875){
//     	c.setAttribute("fill", "#E2AEA8");
//     }
//     else {c.setAttribute("fill", "#333333");}
    
    //c.setAttribute("r", 10);
    
 	if (isNaN(abitanti)==false && abitanti > 0 ){
       c.setAttribute("r", Math.log(abitanti)*2);
        //c.setAttribute("r", 3);
        }
    else {
    	c.setAttribute("r", 0);
    	// c.setAttribute("r", 3);
//     	var strokeColor = c.getAttribute("fill");
//     	c.setAttribute("fill", "white");
//     	c.setAttribute("stroke", strokeColor);
//     	c.setAttribute("stroke-width", 1);
    }
       // console.log(map.locationPoint({lat: e.features[i].data.geometry.coordinates[1], lon:e.features[i].data.geometry.coordinates[0]}))
    
	c.addEventListener("click", infoSezioni(e.features[i].data, sMin, sMax ), false);
    c.addEventListener("mouseover", mo_sezioni(e.features[i].data), false);
    //console.log(e.features[i].data);

 }

}

function zoomHandler(e, lat_c, lon_c) {
          var level = 13,
          		i = 2, 
          		delta = (level -map.zoom())/i,
          		relativeTo = map.mouse(e);
          		//var prova = map.locationCoordinate({lat: lon_c, lon: lat_c});
          		//var relativeTo = {x: prova.column, y: prova.row};
            //console.log(map.locationCoordinate(map.center()), map.locationCoordinate({lat: lon_c, lon: lat_c}));

			//mappa.zoom(map.zoom());
          var int = setInterval(advance, 40);

          function advance() {
          
            map.zoomBy(delta, relativeTo);
            //console.log(map.locationCoordinate({lat: lon_c, lon: lat_c}));
           // map.center({lat: lon_c, lon: lat_c})
            if (--i == 0) {
              clearInterval(int);
             // mappa.zoom(null);
              map.zoom(level, relativeTo);
              map.zoomRange([12,15]);
              //console.log(map.center())
              //map.panBy({x: 700, y:700 })
              map.center({lat: lon_c, lon: lat_c})
              	function showText() {
      $("#dati_centr").show('slide', {direction: 'left'}, 1000);
	}
	
	showText();
              
            }
          }
        }

function zoomOutHandler() {
		map.zoomRange([8,15]);
          var level = 8,
          		i = 2, 
          		delta = (level - map.zoom())/i,
          		size= map.size();
          		relativeTo = { x: size.x / 2, y: size.y / 2 };
          		//var prova = map.locationCoordinate({lat: lon_c, lon: lat_c});
          		//var relativeTo = {x: prova.column, y: prova.row};
            //console.log(map.locationCoordinate(map.center()), map.locationCoordinate({lat: lon_c, lon: lat_c}));

			//mappa.zoom(map.zoom());
          var int = setInterval(advance, 40);

          function advance() {
          
            map.zoomBy(delta, relativeTo);
           // console.log(map.locationCoordinate({lat: lon_c, lon: lat_c}));
           // map.center({lat: lon_c, lon: lat_c})
            if (--i == 0) {
              clearInterval(int);
             // mappa.zoom(null);
              map.zoom(level, relativeTo);
            map.center({lat: 45.3, lon: 7.8});
    		//map.zoom(8);
    		markerCentrali.visible(true);
 		sezioni.visible(false);
 		centrale.visible(false);
    		
            }
          }
        }

function layerSezioni(id_centrale, lon_centrale, lat_centrale) {
	
	return function(e) {
	// var centrali = d3.select("#LCentrali");
// 	centrali.selectAll(".centrali")
//     	.transition()
//     	.duration(1000)
//       .attr("opacity", "0")
	
	$.ajax({
        type: 'GET',
        url: 'geojson/id_'+id_centrale+'.json',
        success: function() {
    markerCentrali.visible(false);	
    //map.remove(markerCentrali);
    //$('.centr_name').text(id_centrale)

	map.add(
	sezioni
	.url('geojson/id_'+id_centrale+'.json')
	.on("load", load_sezioni)
	)
	
	sezioni.visible(true);
	//clickedCentralina = [prova.properties.LONGITUDINE_CENTRALE, prova.properties.LATITUDE_CENTRALE];
	//console.log(lon_centrale, lat_centrale);
	//map.center([lon_centrale, lat_centrale]);
	
	map.add(
	centrale
	.features([{geometry: {coordinates: [lat_centrale, lon_centrale], type: "Point"}}])
	.on("load", load_centrale)
	)
		
	centrale.visible(true);
	zoomHandler(e, lat_centrale, lon_centrale);
        },
        error: function() {
            alert('non ci sono sezioni servite da questa centralina');
        }            
    });
      
	}
	
}

function infoSezioni(data, min, max) {
	
	return function(e) {
	// var centrali = d3.select("#LCentrali");
// 	centrali.selectAll(".centrali")
//     	.transition()
//     	.duration(1000)
//       .attr("opacity", "0")
	$('.sez_id').html('sezione numero: <br>'+'<h4>'+data.properties.ID_SEZIONE+'</h4>');
	$('.sez_potenza').html('velocit&agrave reale:<br>'+'<h4>'+data.properties.POTENZA_SEGNALE+' kb/s</h4>');
	$('.sez_utenti').html('abitanti servita:<br>'+'<h4>'+data.properties.POPOLAZIONE_SEZIONE+'</h4>');
	$('.sez_distanza').html('distanza dalla centrale: <br>'+'<h4>'+data.properties.DISTANZA_CALCOLATA+' m. </h4>');
	
	function showText() {
    	$('#dati_sez').show('slide', {direction: 'left'}, 1000);
      	aperto = true;
		}
	
	if (aperto != true){
		//showText();
		}
	var speed;
	if (data.properties.POTENZA_SEGNALE != '0.64'){ speed = data.properties.POTENZA_SEGNALE}
	else{speed = data.properties.POTENZA_SEGNALE*1000}

	var fsizeMp3 = 5;
	var fsizeDivx = 700;
	var scale = 1024;
	
 	var tMax = Math.log(compute(fsizeDivx, scale, min));
// 	var mp3 = Math.log(compute(fsizeMp3, scale, speed));
// 	var divx = Math.log(compute(fsizeDivx, scale, speed));
	
	//var tMax = compute(fsizeDivx, scale, min/8);
	var mp3 = compute(fsizeMp3, scale, speed);
	var divx = compute(fsizeDivx, scale, speed);
	
	var dataChart = [mp3, divx];
	
	console.log(speed);
	if (parseFloat(speed) == 0 || speed==''){
	console.log('ci sono'); d3.select('.chart').attr("visibility", "hidden");
	showText();
	}
	else{drawChart(dataChart);}
	
	function drawChart(dati){
		
	
	var	chart = d3.select(".chart");
	
	chart.attr("visibility", "visible");
	
	var y = d3.scale.ordinal()
     .domain(dati)
    .rangeBands([0, 50]);
    
    var x = d3.scale.linear()
     .domain([0, tMax])
     .range([0, 198]);

	
	var logos = [("img/mp3.svg"), ("img/video.svg")]
	
	if (aperto != true){
		
		showText();
		
chart.selectAll("rect")
    .data(dati)
  .enter().append("rect")
    .attr("y", y)
    .attr("transform", "translate(25,0)")
    .attr("width", function(d){ return x(Math.log(d))})
    .attr("height", y.rangeBand());


chart.selectAll("image")
    .data(dati)
  .enter().append("image")
    .attr("xlink:href", function(d, i){return logos[i]}) 
    .attr("y", 0)
    .attr("width", y.rangeBand())
    .attr("height", y.rangeBand())
    .attr("transform", function(d){ return "translate(0,"+ (y(d)+5) +") scale(.70, .70)"});

chart.selectAll("text")
    .data(dati)
  .enter().append("text")
    .attr("class", "bar")
    .attr("fill", function(d){if (d<4){ return "black" } else{return "white"}})
    .attr("x", function(d){ return x(Math.log(d))})
    .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
    .attr("dx", function(d){if (d<4){ return 2 } else{return -4}})
    .attr("dy", ".35em")
    .attr("transform", "translate(25,0)")
    .attr("text-anchor", function(d){if (d<4){ return "start" } else{return "end"}})
    .text(function(d){ return fromSecToTime(d)});
    }
    else {
 
    chart.selectAll("rect")
    .data(dati)
    .transition()
    .duration(1000)
    .attr("width", function(d){ return x(Math.log(d))});

chart.selectAll("text")
    .data(dati)
         .attr("fill", function(d){if (d<4){ return "black" } else{return "white"}})
         .attr("dx", function(d){if (d<4){ return 2 } else{return -4}})
     .transition()
    .duration(1000)
     .attr("x", function(d){ return x(Math.log(d))})
     .attr("text-anchor", function(d){if (d<4){ return "start" } else{return "end"}})
    //.tween("text", function(d) { var i = d3.interpolateRound(parseInt(this.textContent), parseInt(d)); return function(t) {this.textContent = i(t) + ' s'} });
    	.text(function(d){ return fromSecToTime(d)});
    	
    }
    
    }

	


	}
	
}

function mo_centrali(data) {
 	return function(e) {
 	//this.style.fill="#00ff00"
 	    $(this).mousemove(function(e){
 	  
        $("#tooltip").text(toTitleCase(data.properties.NOME_CENTR));
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY - 40) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 					}
 					
 					}
 
function mo_sezioni(data) {
 	return function(e) {
 	//this.style.fill="#00ff00"
 	    $(this).mousemove(function(e){
        $("#tooltip").text(toTitleCase(data.properties.DESCRIZIONE_TIPO_ADSL)+' - '+Math.floor((data.properties.POTENZA_SEGNALE)/1000)+'MB/s');
        var w = $("#tooltip").width();
        $("#tooltip").css({
            top: (e.pageY - 40) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 					}
 					
 					}

function map_back(){
 		zoomOutHandler(); 
 		function hideText() {
 		$('#dati_centr').hide("slide", { direction: "left" }, 1000);
 		$('#dati_sez').hide("slide", { direction: "left" }, 1000);
 		$('.chart').empty();
 		aperto = false;
 		}
 		hideText();
 	}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}

function compute(fsize, scale, speed){
	
	var size = fsize;
    var time = size * scale * 8.192 / speed;
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = Math.floor(time % 60);
    console.log(time, hours, minutes, seconds);
  	return Math.floor(time);
}

function fromSecToTime(time){

    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = Math.floor(time % 60);
    if (hours>0){
    	return hours+ 'h '+minutes + 'm '+seconds+'s'
    	}
    else if (minutes>0 && hours == 0){
    	return minutes + 'm '+seconds+'s'
    	}
    else { return seconds+' s'}
	
	}

 $(document).ready(function(){
    $("#tooltip").hide();
 	$('#dati_centr').hide();
 	$('#dati_sez').hide();
        });