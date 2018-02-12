// d3.json("comuni_new.json", function(comuni){
// 	var sc = d3.entries(comuni.features).map(function(d){ 
// 	var cen = centroid(d.value.geometry.coordinates[0]);
// 	return {label: d.value.properties.TOPONIMO, value: d.value.properties.TOPONIMO,lat: cen[1],lon: cen[0], istat:d.value.properties["ISTAT"], prov_num: d.value.properties["PROV"], sigla: d.value.properties["SIGLA"]};
// 								
// 								})
// 
// console.log(JSON.stringify(sc));
// });



var geoCodeURL = "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=";
var urlOption = " &countrycodes=it&addressdetails=1&viewbox=6.62726545333862%2C46.4642219543457%2C9.21424102783203%2C44.0611000061035&bounded=1";
var interval;
var comuni;
var scuole;
var agg_regione;
var agg_province;
var agg_comuni;
var provincia = false;
var comune = false;
var elenco;
var selScuola;
var dock_visible = true;
var selProvincia;
var carSito = ["Sito ufficiale", "Motore di ricerca"];
var info = ["informazioni URP", "PEC generica"];
var trasparenza = ["Indicatore performance trasparenza","Albo Pretorio","Pubblicazione Bilanci", "Bandi di gara"];
var servizi = ["Assegno nucleo familiare" ,"Autocertificazione anagrafica","Autorizzazione sanitaria somministrazione-alimenti e bevande","Autorizzazione Unica SUAP","Bandi di gara 2","Concorsi pubblici","Carta di identità","Comunicazione vendite straordinarie/liquidazioni/saldi/promozioni","Concessione occupazione suolo pubblico (COSAP – TOSAP)","Concessione passo carrabile","Consultazione cataloghi e prestito bibliotecario","Contrassegno di invalidità","Denuncia inizio attività edilizia (DIA edilizia)",      "Dichiarazione cambio di abitazione","Dichiarazione ICP","Dichiarazione Inizio Attività produttive (DIA)","Dichiarazione TARSU","Iscrizione a corsi comunali","Iscrizione asilo nido","Iscrizione centri estivi","Iscrizione servizio mensa scolastica","Pagamento canone/tassa occupazione suolo e aree pubbliche (COSAP/TOSAP)",      "Pagamento contravvenzioni","Pagamento ICI","Pagamento ICP","Pagamento quote mensa scolastica","Pagamento retta asilo nido comunale","Pagamento  TARSU-TIA","Permesso di transito per zone a traffico limitato (ZTL)","Richiesta assistenza domiciliare","Richiesta certificati anagrafici","Richiesta esenzione pagamento mensa scolastica","Segnalazione guasti / dissesto stradale","Visura catastale"];
var aggregati;
var luogo="PIEMONTE";
var prov_numero;
var cod_istat;
var comuni_stacked;

// var comunipa;
// 
// d3.json("comuni_new.json", function(comuni){
// 
// 
// d3.json("2007_pa.json", function(com){
// comunipa=com;
// 
// 	var sc = d3.entries(comuni.features).map(function(d, i){ 
// 	var cen = centroid(d.value.geometry.coordinates[0]);
// 	var ist = d.value.properties["ISTAT"]*1;
// 	
// 	return {label: d.value.properties.TOPONIMO, value: d.value.properties.TOPONIMO,lat: cen[1],lon: cen[0], istat:d.value.properties["ISTAT"], prov_num: d.value.properties["PROV"], sigla: d.value.properties["SIGLA"],
// 	caratteristiche: totali2(ist, carSito)*100/2, informazioni:totali2(ist, info)*100/2, trasprenza:totali2(ist, trasparenza)*100/4, servizi:totali2(ist, servizi)*100/34};
// 								
// 								})
// 
// console.log(JSON.stringify(sc));
// // 
// // 
// // 	var sc = d3.entries(com.comuni).map(function(d){ 
// // 		
// // 		      return {istat: d.key, caratteristiche: totali2(d.key, carSito), informazioni:totali2(d.key, info), trasprenza:totali2(d.key, trasparenza), servizi:totali2(d.key, servizi)};
// // 
// // 								})
// // 
// // console.log(sc);
// });
// });


function totali2(id, elements){
		var totale = 0;
		$.each(elements, function(index, value) {
		if(id!=0){
			if (comunipa.comuni[id][value] >0 ){totale++}
			}
			});
		//if (totale == null){totale = 0};
		return totale
		}

var w = 200,
    h = 20;

var x = d3.scale.linear().range([0, w-40]);

var chart_1;
var chart_2;
var chart_2_1;
var chart_3;

var w2 = 6,
    h2 = 150,
    pad = [20, 50, 30, 20],
    y3 = d3.scale.linear().range([0, h2-30]),
    z = d3.scale.ordinal().range(["#B5B26D", "#918182", "#5C9094","#C07E41"]);
    
var x3;

var chart_4;

$("#tooltip").hide();
$("#tooltip_2").hide();

d3.json("tot_2011.json", function(tot){
	aggregati = tot;
	initChart();
});

d3.json("comuni_2011.json", function(com){

comuni_stacked =com;

	$("#city").autocomplete({
		source: com.comuni,
        minLength: 2,
        delay: 200,
        select: function ( event, ui ) {
   	selectSearch(ui.item.prov_num, ui.item.lat, ui.item.lon, ui.item.sigla, ui.item.label, ui.item.istat)    
        },
        open: function () {
        	$('.ui-menu').width(185); d3.select('.ui-menu').style("position", "absolute");
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top");
        }, 
        close: function () {
            $( this ).removeClass( "ui-corner-top").addClass("ui-corner-all");
                        
        }
   });
   
   //init_2();
});


deltext_home();
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

$( "#grado" ).buttonset();
$( "#filter").change(function(){


	anno = $('#grado :checked').val();
	redrawStacked(anno);

	var file = "tot_"+anno+".json";
	d3.json(file, function(tot){
		if(provincia){
		d3.json(prov_numero+"_"+anno+"_pa.json", function(elements2) {
		selProvincia = elements2;
		aggregati = tot;
	redraw(luogo);
		});
		}
		else if(comune){
		d3.json(prov_numero+"_"+anno+"_pa.json", function(elements2) {
		selProvincia = elements2;
		aggregati = tot;
			redrawLivelloScuola(cod_istat*1);
			
			});
		}
		else{
		aggregati = tot;
	redraw(luogo);
		}
	
	});
	//console.log($('#grado :checked').val());
	
	})

var anno = $('#grado :checked').val();

redrawStacked(anno);

$( ".piemonte").click(function(){
		LProvince.visible(true);
		LComuni.visible(false);
		var centroid = [7.9,45.25]
		//zoomHandler(0, centroid, 7.6, 7, 9);
		var l = {lat: centroid[1], lon:centroid[0]};
		animateCenterZoom(map, l, 7.6, 7)
		luogo = "PIEMONTE";
		provincia = false;
		comune = false;
		$(".provincia").empty();
		$(".comune").empty();
		redraw("PIEMONTE");
		$("#stacked .overview").empty();
		 init_2();
		
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
        c.addEventListener("click", zoomInComune(centroidC, p.TOPONIMO, p.ISTAT), false);
        c.addEventListener("mouseover", showTooltip2(e.features[i].data), false);
         

 }
}

function addLayer(prov_num, sigla, centroid, prov_nome){
	return function(e) {
		prov_numero=prov_num;
		d3.json("comuni_"+prov_numero+".json", function(elements) {
		d3.json(prov_numero+"_"+anno+"_pa.json", function(elements2) {
		selProvincia = elements2;
		var l = {lat: centroid[1], lon:centroid[0]};
		$(".provincia").text(" > "+prov_nome);
		$(".comune").empty();
		$(".provincia").click(function(){
		
		LProvince.visible(true);
		$(".comune").empty();
		//zoomHandler(e, centroid, 9, 8, 10);
		animateCenterZoom(map, l, 9, 8)
		comune = false;
		luogo = sigla;
		//filterScuole(scuole,sigla,0);
		redraw(luogo);
		$("#stacked .overview").empty();
		 init_2();
			
			});
				luogo = sigla;
		//elenco = comuniWScuole(filterScuole(scuole,sigla,0));	
		//zoomHandler(e, centroid, 9, 8, 10);
		animateCenterZoom(map, l, 9, 8)
		//checkFilter(sigla,0);
		comune = false;
		provincia = true;
		//var filtered = filterScuole(scuole, sigla, 0);
		//redraw("province", sigla);
		comuni = elements;
		LComuni.features(elements.features);
		//LComuni.url("comuni_"+prov_num+".json");
		LComuni.visible(true);
    	LComuni.reload();
    	console.log(luogo, sigla);
    	redraw(luogo);
    	});
    	  
    });
    }
	
	}
	
function showTooltip(data) {
 	return function(e) {
 	 	$("#tooltip .nIndicatori").empty();
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text("Provincia di "+toTitleCase(data.properties.TOPONIMO));
       $("#tooltip .nScuole").text(data.properties.COMUNI+" comuni");
       $("#tooltip .nStudenti").text(data.properties.ABITANTI+" abitanti");
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
 					
 		};
 		
function showTooltip2(data) {
 	return function(e) {
 	    $(this).mousemove(function(e){
       $("#tooltip h2").text("Comune di "+toTitleCase(data.properties.TOPONIMO));
       var istat=(data.properties.ISTAT*1);
       $("#tooltip .nScuole").text(istat+" (codice istat)");
       $("#tooltip .nStudenti").text(selProvincia.comuni[istat]["Popolazione residente al 31/12/2010"]+" abitanti");
       $("#tooltip .nIndicatori").html("Caratteristiche sito "+totali(istat, carSito)+"/"+carSito.length+"<br>Informazioni comune "+totali(istat, info)+"/"+info.length+"<br>Trasparenza "+totali(istat, trasparenza)+"/"+trasparenza.length+"<br>Servizi on-line "+totali(istat, servizi)+"/"+servizi.length);
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
 					
 		};
 
function zoomInComune(centroid, com, istat){
	return function(e) {
	var l = {lat: centroid[1], lon:centroid[0]};
		
		$(".comune").text(" > "+toTitleCase(com));
		
		animateCenterZoom(map, l, 12, 11)
		cod_istat = istat;
		redrawLivelloScuola(istat*1);
		comune = true;
		provincia = false;
		opacity(istat*1);
    	
    }
	
	}
 		
function selectSearch(prov_num, la, lo, sigla, com, istat){
	
	prov_numero=prov_num;
		d3.json("comuni_"+prov_numero+".json", function(elements) {
		d3.json(prov_numero+"_"+anno+"_pa.json", function(elements2) {
		selProvincia = elements2;
		var l = {lat: la, lon:lo};
	
		$(".provincia").empty();
		$(".comune").empty();
		// $(".provincia").click(function(){
// 		
// 		LProvince.visible(true);
// 		$(".comune").empty();
// 		//zoomHandler(e, centroid, 9, 8, 10);
// 		animateCenterZoom(map, l, 9, 8)
// 		comune = false;
// 		luogo = sigla;
// 		//filterScuole(scuole,sigla,0);
// 		redraw(luogo);
// 			
// 			});
				luogo = sigla;
	
		comune = false;
		provincia = true;
		//var filtered = filterScuole(scuole, sigla, 0);
		//redraw("province", sigla);
		comuni = elements;
		LComuni.features(elements.features);
		//LComuni.url("comuni_"+prov_num+".json");
		LComuni.visible(true);
    	LComuni.reload();
    	redraw(luogo);
    	
    	$(".comune").text(" > "+toTitleCase(com));
		
		animateCenterZoom(map, l, 12, 11)
		cod_istat = istat;
		redrawLivelloScuola(istat*1);
		comune = true;
		provincia = false;
    	});
    	  
    });
    
    opacity(istat*1);
	
	}

function totali(id, elements){
		var totale = 0;
		$.each(elements, function(index, value) {
			if (selProvincia.comuni[id][value] >0){totale++}
			});
		//if (totale == null){totale = 0};
		return totale
		}
 		
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function initChart(){


//chart 1

 chart_1 = d3.select("#chart_1").append("svg")
    .attr("class", "chart_1")
    .attr("width", w+20);
    
    
	var dataC1 = d3.entries(aggregati["totali"]["PIEMONTE"]["caratteristiche"]).map(function(d) { return Math.floor(d.value*100)});
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
	chart_1.attr("height",h*(dataC1.length))
	x.domain([0, 100]);
  	y.domain(d3.entries(aggregati["totali"]["PIEMONTE"]["caratteristiche"]).map(function(d) { return d.key}));
  	
  
  	
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
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y.domain()[i])); return $("#tooltip_2").show();})
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
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y.domain()[i])); return $("#tooltip_2").show();})
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
    
	var dataC2 = d3.entries(aggregati["totali"]["PIEMONTE"]["informazioni"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
	chart_2.attr("height",h*(dataC2.length))
	y2.domain(d3.entries(aggregati["totali"]["PIEMONTE"]["informazioni"]).map(function(d) { return d.key}));
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
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2.domain()[i])); return $("#tooltip_2").show();})
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
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2.domain()[i])); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});
	
//chart 2_1

 chart_2_1 = d3.select("#chart_2_1").append("svg")
    .attr("class", "chart_2_1")
    .attr("width", w+20);
    
	var dataC2_1 = d3.entries(aggregati["totali"]["PIEMONTE"]["trasparenza"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2_1 = d3.scale.ordinal().rangeBands([0, h*(dataC2_1.length)]);
	chart_2_1.attr("height",h*(dataC2_1.length))
	y2_1.domain(d3.entries(aggregati["totali"]["PIEMONTE"]["trasparenza"]).map(function(d) { return d.key}));
  	//y2_1.domain(dataC2_1);
  	
  	chart_2_1.selectAll("rect.bar")
    .data(dataC2_1)
  .enter().append("rect")
  	.attr("class", "bar")
  	.attr("fill", "#444446")
  	.attr("stroke", "#F5F5EB")
    .attr("x", function(d) { return w-x(d) ; })
    .attr("y", function(d,i) { return y2_1.rangeBand()*i ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y2_1.rangeBand())
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2_1.domain()[i])); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

    chart_2_1.selectAll("text")
    .data(dataC2_1)
  .enter().append("text")
  	.attr("class", "valori")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .attr("y", function(d,i) { return (y2_1.rangeBand()*i)+y2_1.rangeBand()-4 ; })
    .attr("width", function(d) { return x(d); })
    .attr("height", y2_1.rangeBand())
    .attr("text-anchor", "end")
    .text(function(d){return d+"%"});
    
    
        chart_2_1.selectAll("image")
    .data(dataC2_1)
  .enter().append("image")
  	.attr("xlink:href", function(d,i){return "icone/3_"+(i+1)+".png"})
    .attr("x", function(d) { return w ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", y.rangeBand()-1)
    .attr("height", y.rangeBand()-1)
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y2_1.domain()[i])); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

//chart 3
 chart_3 = d3.select("#chart_3 .overview").append("svg")
    .attr("class", "chart_3")
    .attr("width", w+20);
    
	var dataC3 = d3.entries(aggregati["totali"]["PIEMONTE"]["servizi"]).map(function(d) { return Math.floor(d.value*100)});
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
	chart_3.attr("height",h*(dataC3.length))
	y3.domain(d3.entries(aggregati["totali"]["PIEMONTE"]["servizi"]).map(function(d) { return d.key}));
  	//y2.domain(dataC2);
  	
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
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y3.domain()[i])); return $("#tooltip_2").show();})
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
  	.attr("xlink:href", function(d,i){return "icone/4.png"})
    .attr("x", function(d) { return w ; })
    //.attr("x", 0)
    .attr("y", function(d,i) { return y.rangeBand()*i ; })
    .attr("width", y.rangeBand()-1)
    .attr("height", y.rangeBand()-1)
    .on("mouseover", function(d, i){$("#tooltip_2 p").text((y3.domain()[i])); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();});

$('#chart_3').tinyscrollbar();

}

function init_2() {

	//chart 4 (stacked)
 // Transpose the data into layers by cause.

  var totali = d3.layout.stack()(["caratteristiche", "informazioni", "trasprenza", "servizi"].map(function(totale) {
    return comuni_stacked.comuni.map(function(d) {
      return {x: d.istat, y: d[totale], data:d};
    });
  }));
  	
  	
  	
	x3 = d3.scale.ordinal().rangeBands([0, w2*(totali[0].length)], .4),
  
  chart_4 = d3.select("#stacked .overview").append("svg")
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
     	 .attr("class", function(d, i){ return "cs_"+d.x*1} )
      .attr("x", function(d) { return x3(d.x); })
      .attr("y", function(d) { return -y3(d.y0) - y3(d.y); })
      .attr("height", function(d) {return y3(d.y); })
      .attr("width", x3.rangeBand())
    .attr("opacity", 1)
      .on("mouseover", function(d, i){ $("#tooltip_2 p").html(d.data.label+" ("+d.data.sigla+")"); return $("#tooltip_2").show();})
	.on("mousemove", function(){
		var w = $("#tooltip_2").width(); var left = d3.event.pageX - w/2;
       if(d3.event.pageX-w/2 < 0){left=left+Math.abs(left);}
       else if(d3.event.pageX+w/2 > $(window).width()){left=left-(w/2-($(window).width()-d3.event.pageX));}
		 var h = $("#tooltip_2").height(); return $("#tooltip_2").css({top: (d3.event.pageY - h-20) + "px", left: left + "px"});})
	.on("mouseout", function(){return $("#tooltip_2").hide();})
	.on("click", function(d){selectSearch(d.data.prov_num,d.data.lat, d.data.lon, d.data.sigla, d.data.label, d.data.istat*1)});
		
	
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

if(comune){

opacity(cod_istat*1);
}
}

function redraw(data){
	
	//console.log(data)
//chart 1

	var dataC1 = d3.entries(aggregati["totali"][data]["caratteristiche"]).map(function(d) { return Math.floor(d.value*100)});
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(d3.entries(aggregati["totali"][data]["caratteristiche"]).map(function(d) { return d.key}));
  	
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
	
	
	var dataC2 = d3.entries(aggregati["totali"][data]["informazioni"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(d3.entries(aggregati["totali"][data]["informazioni"]).map(function(d) { return d.key}));
  	
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
  	
//chart 2_1
	
	
	var dataC2_1 = d3.entries(aggregati["totali"][data]["trasparenza"]).map(function(d) { return Math.floor(d.value*100)});
	var  y2_1 = d3.scale.ordinal().rangeBands([0, h*(dataC2_1.length)]);
  	y2_1.domain(d3.entries(aggregati["totali"][data]["trasparenza"]).map(function(d) { return d.key}));
  	
  	chart_2_1.selectAll("rect.bar")
    .data(dataC2_1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", function(d) { return x(d); });

    chart_2_1.selectAll("text")
    .data(dataC2_1)
  .transition()
    .duration(1000)
     .attr("fill", "#444446")
    .attr("x", function(d) { return w-x(d)-2 ; })
    .text(function(d){return d+"%"});
    
           chart_2_1.selectAll("image")
    .data(dataC2_1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});
    
    
//chart 3
	
	
	var dataC3 = d3.entries(aggregati["totali"][data]["servizi"]).map(function(d) { return Math.floor(d.value*100)});
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(d3.entries(aggregati["totali"][data]["servizi"]).map(function(d) { return d.key}));
  	
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
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/4.png"}else{return "icone/bn/4.png"}});
    
}

function redrawLivelloScuola(data){

//chart 1
	
	var dataC1 = [];
	$.each(carSito, function(index, value) {
		dataC1.push(selProvincia["comuni"][data][value]);
		});
	
	var  y = d3.scale.ordinal().rangeBands([0, h*(dataC1.length)]);
  	y.domain(carSito);
  	
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
    .attr("fill", function(d){if (d==1){return "#B5B26D"}})
    .attr("x", function(d, i) { return w-2 ; })
    .text(function(d,i){return y.domain()[i]});
    
           chart_1.selectAll("image")
    .data(dataC1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/1_"+(i+1)+".png"}else{return "icone/bn/1_"+(i+1)+".png"}});
    
    
//chart 2
		var dataC2 = [];
	$.each(info, function(index, value) {
		dataC2.push(selProvincia["comuni"][data][value]);
		});
	var  y2 = d3.scale.ordinal().rangeBands([0, h*(dataC2.length)]);
  	y2.domain(info);
  	
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
    .attr("fill", function(d){if (d==1){return "#918182"}})
    .text(function(d,i){return y2.domain()[i]});
    
           chart_2.selectAll("image")
    .data(dataC2)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/2_"+(i+1)+".png"}else{return "icone/bn/2_"+(i+1)+".png"}});
  	
//chart 2_1
		var dataC2_1 = [];
	$.each(trasparenza, function(index, value) {
		dataC2_1.push(selProvincia["comuni"][data][value]);
		});
	var  y2_1 = d3.scale.ordinal().rangeBands([0, h*(dataC2_1.length)]);
  	y2_1.domain(trasparenza);
  	
  	chart_2_1.selectAll("rect.bar")
    .data(dataC2_1)
	.transition()
    .duration(1000)
    .attr("x", function(d) { return w-x(d) ; })
    .attr("width", 0);

    chart_2_1.selectAll("text")
    .data(dataC2_1)
  .transition()
    .duration(1000)
    .attr("x", function(d) { return w-2 ; })
    .attr("fill", function(d){if (d==1){return "#918182"}})
    .text(function(d,i){ var testo=y2_1.domain()[i]; if(y2_1.domain()[i].length >20){testo =y2_1.domain()[i].substring(0,20)+"..."}; return (testo).toLowerCase()});
    
           chart_2_1.selectAll("image")
    .data(dataC2_1)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/3_"+(i+1)+".png"}else{return "icone/bn/3_"+(i+1)+".png"}});
    
    
//chart 3
	
	
    	var dataC3 = [];
	$.each(servizi, function(index, value) {
		
		dataC3.push(selProvincia["comuni"][data][value]);
		});
		
	var  y3 = d3.scale.ordinal().rangeBands([0, h*(dataC3.length)]);
  	y3.domain(servizi);
  	
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
    .attr("fill", function(d){if (d>0){return "#C07E41"}})
    .attr("x", function(d) { return w-2 ; })
    .text(function(d,i){var somma=0; if (d != null){somma = d}; var testo=y3.domain()[i]; if(y3.domain()[i].length >20){testo =y3.domain()[i].substring(0,20)+"..."}; return (testo+" ("+somma+")").toLowerCase()});
    
    chart_3.selectAll("image")
    .data(dataC3)
	.transition()
    .duration(1000)
  	.attr("xlink:href", function(d,i){if(d!=0){ return "icone/4.png"}else{return "icone/bn/4.png"}});
    
    
//     var classe = ".cs_"+data["codice scuola"];
//  	//console.log(classe);
// 	d3.selectAll('.overview rect')
// 		.attr("opacity",function(d){if (d.x !=data["codice scuola"]) {return 0.4}});
//     
//     	 var moveTo= (d3.select(classe).attr("x"));
//     	 var curr = (d3.select(classe).attr("x"));
//  			var cont = d3.select(".overview").attr("width");
//  			var box = 960;
//  			if (curr >= (cont-box) ){moveTo = cont-box}
//  	console.log(cont);
//    $('#stacked').tinyscrollbar_update(moveTo);
    


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
      "1_possibilità pubblicazione User Generated Content" : (possibilita*100)/elements.length,
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
      "2_N. attività extra curr." : (extra*100)/elements.length,
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
  	.attr("xlink:href", function(d,i){if(d!=0){return "icone/4.png"}else{return "icone/bn/4.png"}});


}

function redrawStacked(year){
	
	d3.json("comuni_"+year+".json", function (com){

		comuni_stacked =com;
		$("#stacked .overview").empty();
		init_2();
		});
	
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

function opacity(ist){
	   var classe = ".cs_"+ist;
 	console.log(classe);
	d3.selectAll('#stacked .overview rect')
		.attr("opacity",function(d){if (d.x !=ist) {return 0.4}});
        	
     var moveTo= (d3.select(classe).attr("x"));
    	 var curr = (d3.select(classe).attr("x"));
 			var cont = d3.select("#stacked .overview").attr("width");
 			var box = 960;
 			moveTo=moveTo-(box/2);
 			if (curr >= (cont-box) ){moveTo = cont-box};
 			//else if(curr < (960/2)){moveTo = 0}
 			
 			
   $('#stacked').tinyscrollbar_update(moveTo);
	}

function showText() {
            $( "#dock" ).show( 'slide',{ direction: "right" }, 500);
        };
        
function hideText() {

            $( "#dock" ).hide( 'slide',{ direction: "right" }, 500);
        };

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