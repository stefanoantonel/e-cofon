var leftArray=0
var rightArray=0
var numParts=0;
var secondWord = '';
var letter = "";
var countSameLetters;

function functionInit() {
	leftBoxTemp = $('#leftboxTemp');
	leftContainer = $('#leftContainer');
	return new Promise(function(resolve, reject) { 
		getConfig('21').then(function() {
			return getConfigByElement("consonants","lev_1",1,null);
		}).then(function(conf) {
			return functionCallback(conf);
		}).then(function() {
			removeLoading();
			playTutorial(actNum);
			resolve();	
		});
	});		
}

function functionCallback(conf){
	return new Promise(function(resolve, reject) {
		letter = conf[0];
		getConfigByElementWithFirstLetter("distractors","words",
			3,functInitWords,letter).then(function() {
			//functInitWords(conf);
			resolve();
		});
	});
	
}

function functionsDD(context,currElem){
	isCorrect=checkCorrect(currElem);
	if (isCorrect==true) { sessionCounter(); }
}

//sin desordenar
function functInitWords(words){
	//agregar palabras que empiezan con la letra seleccionada------------------------
	var wordSelected = [];
	$(words).each(function(index,e){
    	//t=$('#'+rightArray[index]);
    	t=$(leftBoxTemp).clone();
		$(t).attr('id','left'+index);
		$(t).removeAttr('hidden');
		name=words[index];
		addSound(name);
		$(t).attr('name',name);
		$(t).prop('num',index);
		$(t).mousedown(function(){
			var elem = this;
			$.data(this, "timer", setTimeout($.proxy(function() {
				playSound($(elem).html()); 
	        }, this), 300));
	        }, function() { clearTimeout($.data(this, "timer")); }
		);
		$(t).html(e.toUpperCase());
		wordSelected.push(t);
	});
	disorder(wordSelected);
	$(leftContainer).append(wordSelected);
	getConfigByElement("distractors","words",26,functInitImages);
}

function functInitImages(conf){
	conf.push(letter);
	conf.push(letter);
	//-------------"letters soup"
	imgs=[];
	$(conf).each(function(index,e){
    	//t=$('#'+rightArray[index]);
    	t=$('#rightboxTemp').clone();
		$(t).attr('id','right'+index);
		$(t).removeAttr('hidden');
		name=conf[index].substring(0,1);
		addSound(name);
		$(t).attr('name',name);
		$(t).prop('num',index);
		$(t).html(name.toUpperCase());
		$(t).hover(function(){
			var elem = this;
			$.data(this, "timer", setTimeout($.proxy(function() {
				playSound($(elem).attr("name")); 
	        }, this), 500));
	        }, function() { clearTimeout($.data(this, "timer")); }
		);
		$(t).mousedown(function() {
			checkCorrect(this);
		});
		imgs.push(t);
	});
	disorder(imgs);
	$("#rightContainer").append(imgs);
	//Count the amount of times that the letter appears
	countSameLetters = $("[name='"+letter+"']").size();
	$("#counterLeft").html(countSameLetters);
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
	if(name == letter) {
		$(part).addClass("animateToFront");
		waitInterval(1000).then(function(){
			$(part).addClass("deleted");
			$("#counterLeft").html(countSameLetters);
			$(part).addClass("animated fadeOut");
		});
		countSameLetters = countSameLetters - 1;
		if (countSameLetters == 0) {
			window.setTimeout(sessionCounter(), 2000);
		}
		return true;
	}
	else {
		deactivateMoves(".img");
		$(".img").css("pointer-events", "none");
		playSound("wrong").then(function() {
			playSound(name);
		});
		$(part).removeClass('normal');
		$(part).addClass('wrong');
		window.setTimeout(function() {
			$(part).removeClass('wrong');
			$(part).addClass('normal');
			changeScore(-10);
			activateMoves(".img");
		}, 500);
		return false;
	}
}
