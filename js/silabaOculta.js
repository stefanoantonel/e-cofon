var target;
var syllableTemp;
var syllableContainer;
var completeWord;
var part;

function readyOk(){
	target = $('#target');
	firstPart = $('#firstPart');
	secondPart = $('#secondPart');
	syllableContainer=$('#syllableContainer');
	syllableTemp = $('#syllableTemp');
}

function functionInit() {
	return new Promise(function(resolve, reject) {
		getConfig(16).then(function() {
			return getConfigByElement("act16","act",1,null);	
		}).then(function(c) {
			return functionCallback(c);
		}).then(function() {
			removeLoading();
			playTutorial(actNum);
			resolve();
		});
		
		readyOk();
		window.setTimeout(function() {	ballBounce(); },300);
	});
}

function moveToTarget(elem) {
	$(target).append(elem);
	functionsDD(null,elem);
}

function functionCallback(conf){
	return new Promise(function(resolve, reject) {
		conf = conf[0];
		var syllableToSelect = conf["target"] - 1;
		var valueArray = conf["values"];
		completeWord = valueArray.join("")
		var valueLength = valueArray.length;
		var firstWord = valueArray.slice(0, syllableToSelect);
		var secondWord = valueArray.slice(syllableToSelect+1, valueLength);
		/* 
		* I had to do this toString() because it is an object and when 
		* I modify the syllable the value change
		*/
		syllableResult = valueArray[syllableToSelect];
		resultFirstWord = firstWord.join('').replace(',','');
		resultsecondWord = secondWord.join('').replace(',','');
		fillTemplateWord(resultFirstWord,resultsecondWord);
		getConfigByElementWithOne("distractors","syllables",
			2,functionCallback2,syllableResult).then(function() {
				resolve();
			});
	});		
}

function functionCallback2(conf) {
	fillTemplateSyllable(conf);
	images=syllableContainer.children().find("label");
	dragAndDrop(images,target,functionsDD,moveToTarget);
}

function fillTemplateWord(fPart,sPart){
	$(firstPart).text(fPart);
	$(secondPart).text(sPart);
}

function fillTemplateSyllable(syllables){
	var syllablesArray=[];
	$(syllables).each(function(index,e){
    	t=$(syllableTemp).clone();
		name=e;
		addSound(name);
		$(t).attr('name',name);
		$(t).attr('num',index);
		nameToShow = name.toUpperCase();
		$(t).html("<label name="+name+">"+nameToShow+"</label>");
		$(t).hover(function(){
			var elem = this;
			var name = elem.getAttribute("name");
			$.data(this, "timer", setTimeout($.proxy(function() {
				playSound(name); 
	        }, this), 300));
	        }, function() { clearTimeout($.data(this, "timer")); }
		);
		$(t).removeClass('hidden');
		syllablesArray.push(t);
	});
	addSound(completeWord);
	disorder(syllablesArray);
	$(syllableContainer).append(syllablesArray);
}

function functionsDD(context,currElem){
	isCorrect=checkCorrect(currElem);
	if (isCorrect==true){
		playSound(completeWord);
		window.setTimeout(function() {	sessionCounter(); },1500);
	}
}

function checkCorrect(syllable) {
	var name = $(syllable).html();
	if(name == syllableResult){
		window.setTimeout(function(){$(syllable).addClass("animateToFront");},500);
		// $(syllable).animate({
		//     width: "20%",
		// 	height: "20%",
		//     // opacity: 1.4,
		//     // marginLeft: "0.6in",
		//     fontSize: "2em",
		//     borderWidth: "10px",
		// 	borderColor: "green"
	  	// }, 500 );
		return true;
	}
	else{
		wrong(syllable,$(".sphere[name='"+$(syllable).attr("name")+"']"));
		return false;
	}
}


function ballBounce(){
	//$($(syllableContainer).find(".syllable")).addClass("bounceAnimate");
	$(syllableContainer).addClass("bounceAnimate");
}
