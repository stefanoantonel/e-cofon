var leftArray=0
var rightArray=0
var numParts=0;
var secondWord = '';
var letter = "";

function functionInit() {
	getConfig('21');
	getConfigByElement("consonants","lev_1",1,functionCallback);
}

function functionCallback(conf){
	var letter = conf.toUpperCase();
	var wordToChange = conf["target"] - 1;
	var values = conf["values"];

	// Choose firstone, they are disordered.
	left=values[0].join('').replace(/,/g, ""); //no se van a mover
	right=values[1].join('').replace(/,/g, "");
	// wordToChange=group["wordToChange"];
	functInitWords(left,right,wordToChange); //muestra una palabra y oculta la otra
	secondWord = right;
	
	getConfigByElementWithOne("distractors","words",2,functInitImages,right);

	
}

function functionsDD(context,currElem){
	isCorrect=checkCorrect(currElem);
	if (isCorrect==true) { sessionCounter(); }
}

function moveToTarget(elem) {
	$('#target').append(elem);
	functionsDD($('#target'),elem);
	
}

function changeColor(cont,words,wordToChange){
	parts=words.split("");
	elements=[];
	$(parts).each(function(ind,elem){
		d=document.createElement('div');
		elem = elem.toUpperCase();
		$(d).html(elem);
		a=$(d).mouseover(function(){
			playSound(words);
		});
		a=$(d).addClass('inline');
		elements.push(a);
	});
	wordToChange=$(elements[wordToChange]);

	$(wordToChange).addClass('wordSelected');
	$(wordToChange).click(function(){	
		$('.firstWord').fadeOut();
		$('.secondWord').removeAttr('hidden');
		$('#target').removeAttr('hidden');
		$('#rightContainer').removeAttr('hidden');
		$('#firstImage').remove();
		$('#left1').removeClass('secondWordHidden');
		playSound( $(this).html() );
	});
	return elements;
}

//sin desordenar
function functInitWords(first,second,wordToChange){
	
	//palabra inicial con letra llamativa------------------------
	t=$('#leftboxTemp').clone();
	$(t).attr('id','left0');
	name=first;
	addSound(name);
	$(t).attr('name',name);
	$(t).addClass('firstWord');
	$(t).addClass('textBackground');
	$(t).removeAttr('hidden');
	$(t).mousedown(function() {
		playSound(this.name);
	});
	changed=changeColor($(t),name,wordToChange);

	$(t).html(changed);
	$('#leftContainer').append(t);
	t='';
	//----------------------------------------------------------------------
	//palabra oculta -----------------------------------------------
	t=$('#leftboxTemp').clone();
	$(t).attr('id','left1');
	name=second;
	addSound(name);
	$(t).attr('name',name);
	$(t).removeAttr('hidden');
	$(t).addClass('secondWordHidden');
	$(t).addClass('textBackground');
	$(t).mousedown(function() {
		playSound(this.name);
	});
	changed=changeColor($(t),name,wordToChange);

	$(t).html(changed);
	$('#leftContainer').append(t);
	//-------------------------------------------------------
	//---------------initial Image
	firstImg(left);
}

function functInitImages(conf,x){
	
	//-------------second stage images
	imgs=[];
	$(conf).each(function(index,e){
    	//t=$('#'+rightArray[index]);
    	t=$('#rightboxTemp').clone();
		$(t).attr('id','right'+index);
		$(t).removeAttr('hidden');
		name=conf[index];
		addSound(name);
		$(t).attr('name',name);
		$(t).prop('num',index);
		//$(t).css({backgroundImage : 'url(images/imgOculta/' + $(t).attr("name") + '.jpg)'});
		$(t).attr('src','images/activities/' + name + '.jpg');
		$(t).mousedown(function(){
			var elem = this;
			$.data(this, "timer", setTimeout($.proxy(function() {
				playSound($(elem).html()); 
	        }, this), 300));
	        }, function() { clearTimeout($.data(this, "timer")); }
		);
		imgs.push(t);
	});
	disorder(imgs);
	$("#rightContainer").append(imgs);

	contRight=$('#rightContainer').children();
	idObj=$('#target');
	dragAndDrop(contRight,idObj,functionsDD,moveToTarget);
}

function firstImg(conf){
	//-------------------------show image
	t1=$('#rightboxTemp').clone();
	$(t1).attr('id','firstImage');
	$(t1).addClass('firstImage');
	$(t1).attr('src','images/activities/' + conf + '.jpg');	
	$(t1).removeAttr('hidden');
	$("#leftContainer").append(t1);
}

function checkCorrect(part) {
	var name = $(part).attr("name");
	$(part).removeClass('img-rigth');
	if(name.valueOf() == secondWord.valueOf()) {
		window.setTimeout(function(){$(part).addClass("animateToFront");},0);
		return true;
	}
	else {
		wrong(part,"#rightContainer");
		window.setTimeout(function(){
			$(part).addClass('img-rigth');
		}, 1000);
		return false;
	}
}

function checkReplace(box,newDiv){
	if( $(box).has('img') ){
		prevDiv=$(box).children();
		$(prevDiv).removeClass('wrong');
		$(prevDiv).addClass('normal');
		$('#rightContainer').append(prevDiv);
		$(box).append(newDiv);

	}
}