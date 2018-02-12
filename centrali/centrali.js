/*variabili globali*/
var interval;
var geoCodeURL = "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=";
var urlOption = " &countrycodes=it&addressdetails=1&viewbox=6.62726545333862%2C46.4642219543457%2C9.21424102783203%2C44.0611000061035&bounded=1";
var dock_visible = true;
var po = org.polymaps;
var map = po.map();
var sezioni = po.geoJson();
var centrale = po.geoJson();
var piemonte = po.geoJson();
var no_adsl = po.geoJson();
var adsl_2p = po.geoJson();
var adsl_m = po.geoJson();
var adsl_1 = po.geoJson();
var mappatore = d3.scale.linear().range([4, 17]);
var sc;
var sc_adsl_2p;
var sc_adsl_1;
var sc_adsl_m ;
var sc_no_adsl;


/*inizializzo interfaccia*/

$("#tooltip").hide();

$("#tooltip_2").hide();

$( "#grado" ).buttonset();

$( "#filter").change(function(){filterCentrali();});

$(".piemonte").click(function(){
		
		$('.centrale').empty();
		$('.centr_sezioni').empty();
		$('.centr_utenti').empty();
		sezioni.visible(false);
		centrale.visible(false);
		filterCentrali();
		var l= {lat: 45.25, lon: 7.9};
		map.zoomRange([8,16])
		animateCenterZoom(map, l, 8, 8);
		$( "#grado input" ).button("option", "disabled", false );
			});
   
$( "#slider_dock" ).click(function() {
            if(dock_visible==false){
            	$(this).animate({'right': '258px'},500, function() {$(this).css('background', 'url(img/right.png) #CFCFC6 center no-repeat')});
                showText();
                dock_visible = true;
            } else {
            	$(this).animate({'right': '5'},500, function() {$(this).css('background', 'url(img/left.png) #CFCFC6 center no-repeat')});
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

map.container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 45.25, lon: 8.3})
    .zoom(8)
    .zoomRange([8,16])
    .add(po.interact());

map.add(po.image()
	.id("tile")
    .url(po.url("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));


 d3.json("piemonte.json", function(data) {
    
map.add(piemonte
	.features(data.features)
    //.url("piemonte.json")
    .on("load", load_boarders)
    );

});

 d3.json("no_adsl.json", function(data) {
 
sc_no_adsl = data.features.map(function(d){return {label: toTitleCase(d.properties.NOME_CENTR), value: toTitleCase(d.properties.NOME_CENTR),lat: d.geometry.coordinates[1],lon: d.geometry.coordinates[0]}});
map.add(no_adsl
	.features(data.features)
    //.url("no_adsl.json")
    .id("no_adsl")
    .on("load", load_centrali)
    //.clip(false)
    );
    
     d3.json("adsl_m.json", function(data) {
 
 sc_adsl_m = data.features.map(function(d){return {label: toTitleCase(d.properties.NOME_CENTR), value: toTitleCase(d.properties.NOME_CENTR),lat: d.geometry.coordinates[1],lon: d.geometry.coordinates[0]}});
map.add(adsl_m
	.features(data.features)
    //.url("adsl_m.json")
    .id("adsl_m")
    .on("load", load_centrali)
    //.clip(false)
    );
    
     d3.json("adsl_1.json", function(data) {
 sc_adsl_1 = data.features.map(function(d){return {label: toTitleCase(d.properties.NOME_CENTR), value: toTitleCase(d.properties.NOME_CENTR),lat: d.geometry.coordinates[1],lon: d.geometry.coordinates[0]}});
map.add(adsl_1
	.features(data.features)
    //.url("adsl_1.json")
    .id("adsl_1")
    .on("load", load_centrali)
    //.clip(false)
    );
    
    d3.json("adsl_2p.json", function(data) {
sc_adsl_2p = data.features.map(function(d){return {label: toTitleCase(d.properties.NOME_CENTR), value: toTitleCase(d.properties.NOME_CENTR),lat: d.geometry.coordinates[1],lon: d.geometry.coordinates[0]}});
map.add(adsl_2p
	.features(data.features)
    //.url("adsl_2p.json")
    .id("adsl_2p")
    .on("load", load_centrali)
    //.clip(false)
    );
    
     sc = sc_no_adsl.concat(sc_adsl_2p, sc_adsl_1, sc_adsl_m);
    	 $("#city").autocomplete({
       source: sc,
        minLength: 2,
        delay: 200,
        select: function ( event, ui ) {
        	
        $('.centrale').empty();
		$('.centr_sezioni').empty();
		$('.centr_utenti').empty();
		sezioni.visible(false);
		centrale.visible(false);
		filterCentrali();
		var l= {lat: ui.item.lat, lon: ui.item.lon};
		console.log(l);
		map.zoomRange([8,16])
		animateCenterZoom(map, l, 14, 8);
		$( "#grado input" ).button("option", "disabled", false );
       // searchCenter(parseFloat(ui.item.lat), parseFloat(ui.item.lon));
       //$( this ).val("cerca centrale");
      
 
        },
        open: function () {
        	$('.ui-menu').width(185); d3.select('.ui-menu').style("position", "absolute");
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top");
        }, 
        close: function () {
            $( this ).removeClass( "ui-corner-top").addClass("ui-corner-all");
            
        }
   });

});      
});  
});    
});








map.add(po.compass()
	//.position("10")
    .pan("none"));


/* tutte le funzioni */

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

function load_centrali(e) {

	
  for (var i = 0; i < e.features.length; i++) {
  
	// var abitanti = (e.features[i].data.properties.ABITANTI);
	var tipo = (e.features[i].data.properties.TIPO_ADSL);
// 	var abitanti = (e.features[i].data.properties.POPOLAZIONE_SEZIONE);
    var c = e.features[i].element;
    
    
    if (tipo == "ADSL_2P"){
        c.setAttribute("fill", "#774038");
    }
    else if (tipo == "ADSL_1"){
    	c.setAttribute("fill", "#6CA880");
    }
    else if (tipo == "ADSL_M"){
    	c.setAttribute("fill", "#505270");
    }
    else if (tipo == "NO"){
    	c.setAttribute("fill", "#D0B58B");
    }
    else {c.setAttribute("fill", "none");}

    var p = e.features[i].data.properties;
    var coord = e.features[i].data.geometry.coordinates;
	
	var pn = c.parentNode;
    var u = po.svg("g");
    var transform = c.getAttribute("transform");
    var color = c.getAttribute("fill");
    u.setAttribute("transform", transform);
    u.setAttribute("class", "id_"+p.ID_Central);
    var gruppo = pn.appendChild(u);
    
    
	
	var data = {nome: p.NOME_CENTR, id: p.ID_Central, lat:coord[1], lon:coord[0] };
	
	var vis = d3.select(gruppo);
	vis.selectAll("path")
	.data([data])
    .enter().append("svg:path")
    .attr("d", d3.svg.symbol().type("triangle-up"))
    .attr("fill", color)
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .attr("cursor", "pointer")
    .on("mouseover", function(d){ $("#tooltip h2").text(d.nome);  $("#tooltip").show();})
	.on("mousemove", function(){ var w = $("#tooltip").width(); var h = $("#tooltip").height(); $("#tooltip").css({top: (d3.event.pageY - h-20) + "px", left: (d3.event.pageX - w/2 ) + "px"});})
	.on("mouseout", function(){ return $("#tooltip").hide();})
	.on("click",function(d){ layerSezioni(d.nome, d.id, d.lat, d.lon )});

   pn.removeChild(c);
 
 }
 
  		

}

function layerSezioni(nome_centrale, id_centrale, lon_centrale, lat_centrale) {
	
	$("#tooltip").hide();
//	return function() {
	
	// var centrali = d3.select("#LCentrali");
// 	centrali.selectAll(".centrali")
//     	.transition()
//     	.duration(1000)
//       .attr("opacity", "0")
	
	$.ajax({
		dataType: "json",
        //type: 'GET',
        url: 'geojson/id_'+id_centrale+'.json',
        success: function(data) {
    adsl_2p.visible(false);	
	adsl_1.visible(false);	
    adsl_m.visible(false);	
    no_adsl.visible(false);	
    
    var range_pop = data.features.map(function(d){ return parseInt(d.properties.POPOLAZIONE_SEZIONE)});
	mappatore.domain([d3.min(range_pop), d3.max(range_pop)]);
	var l ={lat:lon_centrale , lon:lat_centrale};
	animateCenterZoom(map, l, 14, 13);
	var z = map.zoom();
	map.add(
	sezioni
	.features(data.features)
	//.url('geojson/id_'+id_centrale+'.json')
	.on("load", load_sezioni)
	)
	
	//animateCenterZoom(map, l, 14, 13);
	sezioni.visible(true);
	
	map.add(
	centrale
	.features([{geometry: {coordinates: [lat_centrale, lon_centrale], type: "Point"}}])
	.on("load", load_centrale)
	)
		
	centrale.visible(true);
	
	$('#breadcrumbs .centrale').html(" > <img src='icone/centrale.png'/> "+nome_centrale+"&nbsp;&nbsp;&nbsp;")
	$( "#grado input" ).button("option", "disabled", true );
        },
        error: function() {
            alert('non ci sono sezioni servite da questa centralina');
        }            
    });
      
//	}
	
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
	//$('.centr_comune').text(centr.COMUNE_CENTR);
	//$('.centr_nome').html('nome centrale:<br>'+ '<h4>'+toTitleCase(centr.NOME_CENTRALE)+'</h4>');
	//$('.centr_indirizzo').html('indirizzo:<br>'+ '<h4>'+toTitleCase(centr.INDIRIZZO_CENTRALE)+'</h4>');
	//$('.centr_potenza').text(centr.DESCRIZIONE_TIPO_ADSL);
	$('.centr_sezioni').html("<img src='icone/sezione.png'/> "+totSezioni.length+"&nbsp;&nbsp;&nbsp;");
	$('.centr_utenti').html("<img src='icone/abitanti.png'/> "+totAbitanti);
	
	
	
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
	c.setAttribute("opacity", .9);

	if (segnale > 0 && segnale != null && tipo == 'ADSL_2P'){
		
		var col_2 = d3.rgb("#774038").brighter();
		var col_1 = d3.rgb(col_2).brighter();
		var col_0 = d3.rgb(col_1).brighter();
		//if (color(segnale) == 0){c.setAttribute("fill", "#FCBBA1");}
		//else if (color(segnale) == 1){c.setAttribute("fill", "#FC9272");}
		//else if (color(segnale) == 2){c.setAttribute("fill", "#EF3B2C");}
		//else if (color(segnale) == 3){c.setAttribute("fill", "#99000D");}
		if (color(segnale) == 0){c.setAttribute("fill", col_0);}
		else if (color(segnale) == 1){c.setAttribute("fill", col_1);}
		else if (color(segnale) == 2){c.setAttribute("fill", col_2)}
		else if (color(segnale) == 3){c.setAttribute("fill", "#774038");}
	
    }
    else if(segnale > 0 && segnale != null && tipo == 'ADSL_1'){
		
// 		if (color(segnale) == 0){c.setAttribute("fill", "#FEE391");}
// 		else if (color(segnale) == 1){c.setAttribute("fill", "#FEC44F");}
// 		else if (color(segnale) == 2){c.setAttribute("fill", "#FE9929");}
// 		else if (color(segnale) == 3){c.setAttribute("fill", "#EC7014");}

	var col_2 = d3.rgb("#6CA880").brighter();
		var col_1 = d3.rgb(col_2).brighter();
		var col_0 = d3.rgb(col_1).brighter();
		//if (color(segnale) == 0){c.setAttribute("fill", "#FCBBA1");}
		//else if (color(segnale) == 1){c.setAttribute("fill", "#FC9272");}
		//else if (color(segnale) == 2){c.setAttribute("fill", "#EF3B2C");}
		//else if (color(segnale) == 3){c.setAttribute("fill", "#99000D");}
		if (color(segnale) == 0){c.setAttribute("fill", col_0);}
		else if (color(segnale) == 1){c.setAttribute("fill", col_1);}
		else if (color(segnale) == 2){c.setAttribute("fill", col_2)}
		else if (color(segnale) == 3){c.setAttribute("fill", "#6CA880");}
    
    }
    
    else if(segnale > 0 && segnale != null && tipo == 'ADSL_M'){
		
		if (segnale != 0 && segnale != null){c.setAttribute("fill", "#505270");}
		else {c.setAttribute("fill", "#c2c2c2");}
    
    }
    
    else if(tipo == 'NO'){
    
    	c.setAttribute("fill", "#D0B58B")
    
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
     //  c.setAttribute("r", Math.log(abitanti)*2);
     //c.setAttribute("r", Math.sqrt(abitanti/Math.PI));
    	c.setAttribute("r", mappatore(abitanti));
        
        }
    else {
    	c.setAttribute("r", 0);
    	// c.setAttribute("r", 3);
//     	var strokeColor = c.getAttribute("fill");
//     	c.setAttribute("fill", "white");
//     	c.setAttribute("stroke", strokeColor);
//     	c.setAttribute("stroke-width", 1);
    }
    
	//c.addEventListener("click", infoSezioni(e.features[i].data, sMin, sMax ), false);
    c.addEventListener("mouseover", tooltipSezioni(e.features[i].data, sMin, sMax), false);

 }
console.log("check 2");
}
 
function load_centrale(e) {
  for (var i = 0; i < e.features.length; i++) {
  
    var c = e.features[i].element;

	
	var pn = c.parentNode;
    var u = po.svg("g");
    var transform = c.getAttribute("transform");
    var color = c.getAttribute("fill");
    u.setAttribute("transform", transform);
    var gruppo = pn.appendChild(u);

	var vis = d3.select(gruppo);
	vis.append("svg:path")
    .attr("d", d3.svg.symbol().type("triangle-up"))
    .attr("fill", "black")
    .attr("stroke-width", "1")
    .attr("stroke", "white");

   pn.removeChild(c);

 }
}

function filterCentrali(){
		
		var centraliChecked=[];
		var centraliUnChecked=[];
		sc=[];
$('#grado :input:not(:checked)').each(function() {
       centraliUnChecked.push($(this).val());
     });
$('#grado :checked').each(function() {
       centraliChecked.push($(this).val());
     });

$.each(centraliUnChecked, function(index, value) { 
		
	
		d3.select("#map #"+value).transition().duration(500).style("opacity", 0).each("end", function(){window[value].visible(false);});

		});
		
$.each(centraliChecked, function(index, value) { 
		
		window[value].visible(true);
		d3.select("#map #"+value).transition().duration(500).style("opacity", 1);
		sc=sc.concat(window["sc_"+value]);
		});
		//console.log(sc);
		 $("#city").autocomplete("option", "source", sc);
};

function infoSezioni(data, min, max) {
	
	return function(e) {
	// var centrali = d3.select("#LCentrali");
// 	centrali.selectAll(".centrali")
//     	.transition()
//     	.duration(1000)
//       .attr("opacity", "0")
	$('.sez_id').html('sezione numero: <br>'+'<h4>'+data.properties.ID_SEZIONE+'</h4>');
	$('.sez_potenza').html('velocit&agrave reale:<br>'+'<h4>'+data.properties.POTENZA_SEGNALE+' kb/s</h4>');
	$('.sez_utenti').html('popolazione servita:<br>'+'<h4>'+data.properties.POPOLAZIONE_SEZIONE+'</h4>');
	$('.sez_distanza').html('distanza dalla centrale: <br>'+'<h4>'+data.properties.DISTANZA_CALCOLATA+' m. </h4>');
	
// 	function showText() {
//     	$('#dati_sez').show('slide', {direction: 'left'}, 1000);
//       	aperto = true;
// 		}
// 	
// 	if (aperto != true){
// 		//showText();
// 		}
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
	
	//console.log(speed);
	if (parseFloat(speed) == 0 || speed==''){
	d3.select('.chart').attr("visibility", "hidden");

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
   
 
//     chart.selectAll("rect")
//     .data(dati)
//     .transition()
//     .duration(1000)
//     .attr("width", function(d){ return x(Math.log(d))});
// 
// chart.selectAll("text")
//     .data(dati)
//          .attr("fill", function(d){if (d<4){ return "black" } else{return "white"}})
//          .attr("dx", function(d){if (d<4){ return 2 } else{return -4}})
//      .transition()
//     .duration(1000)
//      .attr("x", function(d){ return x(Math.log(d))})
//      .attr("text-anchor", function(d){if (d<4){ return "start" } else{return "end"}})
//     //.tween("text", function(d) { var i = d3.interpolateRound(parseInt(this.textContent), parseInt(d)); return function(t) {this.textContent = i(t) + ' s'} });
//     	.text(function(d){ return fromSecToTime(d)});
    	

    
    }

	


	}
	
}

function tooltipSezioni(data, min, max) {
 	return function(e) {
 	    $(this).mousemove(function(e){
 	   //inizio a riempir eil tooltip 
 	    function formatSpeed(){
 	    		if(data.properties.POTENZA_SEGNALE != '0.64'){
 	    		return Math.round(data.properties.POTENZA_SEGNALE/10)/100;
 	    		}
 	    		else{return data.properties.POTENZA_SEGNALE}
 	    }
    
    $('.sez_id').html('sezione numero: <span class="novecento">'+data.properties.ID_SEZIONE+'</span>');
	$('.sez_potenza').html('velocit&agrave reale: <span class="novecento">'+formatSpeed()+'</span> Mb/s');
	$('.sez_utenti').html('<span class="novecento">'+data.properties.POPOLAZIONE_SEZIONE+'</span>');
	$('.sez_distanza').html('<span class="novecento">'+data.properties.DISTANZA_CALCOLATA+'</span>  m.');
	

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
	
	
	if (parseFloat(speed) == 0 || speed==''){
	
	d3.select('.chart').attr("visibility", "hidden");
		$('.sez_potenza').html('velocit&agrave reale: <span class="novecento"> - </span>');
	
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
	
		
chart.selectAll("rect")
    .data(dati)
  .enter().append("rect")
    .attr("y", y)
    .attr("transform", "translate(25,0)")
    .attr("fill", "#444446")
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
    .attr("fill", function(d){if (d<4){ return "#444446" } else{return "white"}})
    .attr("x", function(d){ return x(Math.log(d))})
    .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
    .attr("dx", function(d){if (d<4){ return 2 } else{return -4}})
    .attr("dy", ".35em")
    .attr("transform", "translate(25,0)")
    .attr("text-anchor", function(d){if (d<4){ return "start" } else{return "end"}})
    .text(function(d){ return fromSecToTime(d)});
    
    // else {
//  
//     chart.selectAll("rect")
//     .data(dati)
//     .transition()
//     .duration(1000)
//     .attr("width", function(d){ return x(Math.log(d))});
// 
// chart.selectAll("text")
//     .data(dati)
//          .attr("fill", function(d){if (d<4){ return "black" } else{return "white"}})
//          .attr("dx", function(d){if (d<4){ return 2 } else{return -4}})
//      .transition()
//     .duration(1000)
//      .attr("x", function(d){ return x(Math.log(d))})
//      .attr("text-anchor", function(d){if (d<4){ return "start" } else{return "end"}})
//     //.tween("text", function(d) { var i = d3.interpolateRound(parseInt(this.textContent), parseInt(d)); return function(t) {this.textContent = i(t) + ' s'} });
//     	.text(function(d){ return fromSecToTime(d)});
//     	
//     }
    
    }
       
       
       //setto altri par per tooltip
       var w = $("#tooltip_2").width();
       var h = $("#tooltip_2").height();
        $("#tooltip_2").css({
            top: (e.pageY - h-20) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
        $("#tooltip_2").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip_2").hide();
        $("#tooltip_2 .chart").empty();
    });
 			}
 					
 		}
 		
function showTooltip(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text(toTitleCase(data.properties.NOME_CENTR));
       var w = $("#tooltip").width();
       var h = $("#tooltip").height();
        $("#tooltip").css({
            top: (e.pageY - h-20) + "px",
            left: (e.pageX - w/2 ) + "px"
        });
        $("#tooltip").show();
    });
    $(this).mouseout(function(e){
        $("#tooltip").hide();
    });
 			}
 					
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

function showText() {
            $( "#dock" ).show( 'slide',{ direction: "right" }, 500);
        };
        
function hideText() {

            $( "#dock" ).hide( 'slide',{ direction: "right" }, 500);
        };

function checkEnter(e){ 
    var evtobj=window.event? event : e  ;
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode ;
    if(unicode == 13){
        return true ;
    }else{
        return false ;
    }
} 

function deltext_home(){
		   
   $('#city').click(
		function() {
				if (this.value == this.defaultValue) {
				this.value = '';}
				});
	$('#city').blur(
				function() {
				if (this.value == '' || this.value != this.defaultValue) {
				this.value = this.defaultValue;}
		});      
	
}

function searchCenter(searchLat, searchLon){
	var l ={lat: searchLat, lon: searchLon};
	//var z = map.zoom();
     animateCenterZoom(map, l, 13, 8);
	//map.center({lat: searchLat, lon: searchLon});
	}

/*da qui inizia lo zoom*/

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


// d3.json("centrali.json", function(centrali) {
// 			centrali.features.map(function(d, i){ nomiCentrali.push(toTitleCase(d.properties.NOME_CENTR))});
// 			
// 	// 		$("#city").autocomplete({
// //         minLength: 3,
// //         source: nomiCentrali,
// //         open: function() { $('.ui-menu').width(185); d3.select('.ui-menu').style("position", "absolute") },
// //         select: function( event, ui ) {
// //             //selectedSchool = ui.item.value;
// //             //markers.reshow(); 
// //             //searchCenter();
// //         }
// // 		});
// });

// function searchAddress(){
// try {
// 		var urlOption = "&addressdetails=1&limit=1&viewbox=6.62726545333862%2C46.4642219543457%2C9.21424102783203%2C44.0611000061035&bounded=1";
//           var query = "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=" + $("#city").val() + urlOption;
//           console.log(query);
//           $.ajax({
//             url: query,
//             dataType: "jsonp",
//             jsonp: "json_callback",
//             success: function (result) {
//               if (result && result.length > 0) {
//               console.log(parseFloat(result[0].lat), parseFloat(result[0].lon));
// 			searchCenter(parseFloat(result[0].lat), parseFloat(result[0].lon));
//               } else {
//                 alert("comune o centrale non trovato!");
//               }
//             },
//             error: function (xhr) {
//               console.log(xhr.statusText);
//             }
//           });
//         } 
//         catch (e) {
//           console.log("error" + e.toString());
//         }
// 
// }

//var geoCodeURL = "http://nominatim.openstreetmap.org/search";

			
// $("#city").autocomplete({
//        source: function ( request, response ) {
//            $.ajax({
//            			dataType: "json",
//                   url: geoCodeURL+ request.term + urlOption,
//                   success: function ( data ) {
//                       response( $.map( data, function( item ) {
//                       		if (item.class == "place" || item.class == "amenity"){
//                           return {label: item.display_name, value: item.display_name,lat: item.lat,lon: item.lon,type: item.type};
//                            };
//                           }));
//                       }
//                   });
//         },
//         minLength: 2,
//         delay: 200,
//         select: function ( event, ui ) {
//         	console.log(ui);
//         	searchCenter(parseFloat(ui.item.lat), parseFloat(ui.item.lon));
//  
//         },
//         open: function () {
//         	$('.ui-menu').width(185); d3.select('.ui-menu').style("position", "absolute");
//             $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top");
//         }, 
//         close: function () {
//             $( this ).removeClass( "ui-corner-top").addClass("ui-corner-all");
//         }
//    });