var counter;
var soundsArray = [];
var score=100;


function dragAndDrop(idImg,idBoxes,functions) {
	$(idImg).each(function(ind,part){
		$(this).draggable({
			revert:true,
		});
	});

    $(idBoxes).each(function(ind,box){
    	$( this ).droppable({
        	drop: function( event, ui ) {
        		$(ui.draggable).css({top:0,left:0});
        		$( this )
        			.addClass( "ui-state-highlight" )
        			.append(ui.draggable);  
        		functions(this,ui.draggable); 		
        	}
        });
    });
}

function getConfig(numAct,callBack){
	$.getJSON("js/configGroups.json",function(result,callBack){
	    	c=result["act"+numAct];
	    }).done(function (){
	    	callBack(c.act);
	    	loadDescription(c.description);
	    	getStyle();
	    	loadTutorialVoice(numAct);
	    	loadCounter(c.repeat);
	    	loadSounds();
	    });
}

function getConfig(numAct){
	saveArticle();
	$.getJSON("js/configGroups.json",function(result){
	    	 c=result["act"+numAct];
	    }).done(function (){
	    	loadDescription(c.description);
	    	getStyle();
	    	loadTutorialVoice(numAct);
	    	loadCounter(c.repeat);
	    	loadSounds();
	    	
	    });
}

function getConfigByElement(element,level,quantity,callBack){
	$.getJSON("js/configGroups.json",function(config,callBack){
	    	var element_config = config[element][level];
	    	var result_disorder = disorder(element_config);
	    	result = result_disorder.slice(0,quantity);
	    }).done(function(){
	    	console.log("result:",result);
	    	callBack(result);
	    	//getStyle();
	    });
}

function getRhymes(element,level,quantity,callBack){
	$.getJSON("js/configGroups.json",function(config,callBack){
	    	var element_config = config[element][level];
	    	var result_disorder = disorder(element_config);
	    	result = result_disorder.slice(0,quantity);
	    	$(result).each(function(ind,value){
	    		val=disorder(value);
	    		result[ind]=val.slice(0,2);
	    	});
	    }).done(function(){
	    	console.log("result:",result);
	    	callBack(result);
	    });
}


function getConfigByElementWithOne(type, level, quantity, callBack, elementExcept){
	$.getJSON("js/configGroups.json",function(config,callBack){
	    	element_config = config[type][level];
	    	element_config = removeOneElement(element_config,elementExcept);
	    	element_config = disorder(element_config);
	    	result_disorder = element_config.slice(0,quantity);
	    	result_disorder.push(elementExcept);
			result = disorder(result_disorder);
	    	// result = result_disorder.slice(0,quantity);
	    	
	    }).done(function(){
	    	//console.log("result:",result);
	    	callBack(result);
	    });
}

function saveArticle() {
	originTemplateHTML = $("article").clone();
}

function getStyle(){
	$.getJSON("js/configGroups.json",function(result){
	    	c=result["skin"];
	    }).done(function (){
	    	skin=disorder(c);
	    	console.log("skinks",skin);
	    	$('head').append('<link rel="stylesheet" href="css/skin/'+skin[0]+'.css" type="text/css" />');
	    });
}

function loadCounter(count){
	if(counter == null) {
		counter = parseInt(count);
	}
}

function disorder(o){ 
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function congratulations(){
	// $("article").delay( 200 ).hide();
	
	$("body").append('<div id="alertOk" class="alert-box success hidden="true">'
			+'<span>Felicitaciones </span>'
			+'</br><img class="imagenSucced" src="images/caraContenta.jpg">'
			+'</br>Has completado muy bien tu ejercicio'
		+'</div>');
	
	$("#alertOk").delay(100).fadeIn(200);
}

function passActivity(){
	$("article").delay( 400 ).hide();
	
	$("body").append('<div id="alertOk" class="alert-box success">'
			+'<span>Pasaste el nivel!</span>'
			+'<div><a id="next">Siguiente</a></div>'
		+'</div>');
	
	$("#next").click(function(){
		var base_url=document.URL.slice(0, document.URL.lastIndexOf("/"));
		//actividad.end("incomplete");
		window.parent.document.getElementById("nav_next-button").click();
	});
	
}


function setNextAction(){
	$("#next-activity").click(function(){
		var base_url=document.URL.slice(0, document.URL.lastIndexOf("/"));
		window.parent.document.getElementById("nav_next-button").click();
	});
}

function setPrevAction(){
	$("#prev-activity").click(function(){
		var base_url=document.URL.slice(0, document.URL.lastIndexOf("/"));
		window.parent.document.getElementById("nav_prev-button").click();
	});
}

function passed(){
	actividad.end("passed",score);
}

function loadDescription(descrip){	
	title=$("title").text();
	//debugger;
	$.get("popUp.html",function(result){
		modal=result;
    }).done(function(){
    	$("article").append(modal);
		$(".modal-body").html(descrip);
        $(".modal-title").html(title);
    });
}

function loadSounds(){
	setTimeout(function() {
	/* In order to make an asyncronous task */
		$(soundsArray).each(function(index,value){
			var aud=document.createElement('audio');
			$(aud).attr('id','sound'+value);
			$(aud).attr('src','audio/'+value+'.mp3');
			$(aud).attr('type','audio/mp3');
			$(aud).appendTo('body');
		});
	}, 3000);
}

function loadTutorialVoice(actNum) {
	if(counter == null) {
		try {
			var aud=document.createElement('audio');
			$(aud).attr('id','tutorial'+actNum);
			$(aud).attr('src','audio/tutorial/'+actNum+'.mp3');
			$(aud).attr('type','audio/mp3');
			$(aud).appendTo('body');
			window.setTimeout(function() {playTutorial(actNum);}, 1000);		
		}
		catch(e) {console.error("Tutorial sound not found")}
	}
	
}

function playSound(soundName){
	try{ $('#sound'+soundName)[0].play(); }
	catch(e){ console.error('Sonido no encontrado') }
	
}

function playTutorial(actNumb) {
	try{ $('#tutorial'+actNumb)[0].play(); }
	catch(e){ console.error('Tutorial no encontrado'); }
}
function moveOrigin(target,origin){
	$(target).removeClass('wrong');
	$(target).addClass('normal');
	$(target).appendTo(origin);
	changeScore(-10);
}

function sessionCounter() {
	counter = counter - 1;
		if(counter == 0){
			passed();
			window.setTimeout(function(){$(".deleted").remove();},1000);
			window.setTimeout(passActivity, 1000);

		}

		else {
			window.setTimeout(function() {
				$(".deleted").remove();
				$("article").remove();
				
			}, 1000);
			window.setTimeout(function() {
				congratulations();
			}, 1000);
			window.setTimeout(function(){
				$("body").append(originTemplateHTML);
				$('#alertOk').hide();
				$('#alertOk').remove();
				
				//$("article").show();
				functionInit();
				}, 2000);	
		}

}

function translate(target){
	$(target).addClass("animateUpperCorner");
}


function removeOneElement(array,element){
	var index = array.indexOf(element.toString());
	if(index != -1) {
		array.splice(index, 1);	
	}
	return array;
}

function addSound(elem) {
	if(elem.constructor == Array) { soundsArray.push(elem.join("")); }
	else { soundsArray.push(elem); }
}

function changeScore(value){
	score = score + value;
}
