/* global moveOrigin */
/// <reference path="../typings/jquery/jquery.d.ts"/>
var target;
var imgTemp;
var imgContainer;
var completeWord;
var part;

function functionInit() {
	return new Promise(function(resolve, reject) {
		getConfig(10).then(function() {
			return getConfigByElement("act10","act",1,null);
		}).then(function(conf) {
			return functionCallback(conf);
		}).then(function() {
			removeLoading();
			playTutorial(actNum);
			resolve();
		});
		readyOk();		
	});
}

function readyOk(){
	target=$('#target');
	imgTemp=$('#imgTemp');
	imgContainer=$('#imgContainer');
	completeWord=$('#completeWord');
	part=$('#part');
}

function functionCallback(conf){
	return new Promise(function(resolve, reject) {
		conf = conf[0];
		var syllableToSelect = conf["target"] - 1;
		var values = conf["values"];
		/* 
		* I have to do this toString() because it is an object and when 
		* I modify the syllable the value change
		*/
		var res = conf["values"].toString();
		res = res.split(",");
		res[syllableToSelect] = "";
		resultWord = res.join('').replace(',','');
		fillTemplateWord(values,syllableToSelect);
		getConfigByElementWithOne("distractors","words",2,
			functionCallback2,resultWord).then(function() {
				resolve();
			});
	});	
}

function functionCallback2(conf) {
	fillTemplateImages(conf);
	images=imgContainer.children();
	dragAndDrop(images,target,functionsDD,moveToTarget);
}

function fillTemplateWord(wordComplete,wordToChange){
	originWord=wordComplete.join('');
	originWord = originWord.toUpperCase();
	$(completeWord).text(originWord);
	$(completeWord).attr("name",originWord);
	partSelected=$(wordComplete)[wordToChange];
	partSelected = partSelected.toUpperCase();
	$(part).text(partSelected);
	$(part).attr("name",partSelected);
	addSound(originWord);
}

function fillTemplateImages(images){
	imgs=[];
	$(images).each(function(index,e){
    	t=$(imgTemp).clone();
		name=e;
		addSound(name);
		$(t).attr('name',name);
		$(t).attr('num',index);
		$(t).attr('alt', name);
		$(t).attr('src','images/activities/' + name + '.jpg');
		$(t).hover(function(){
			var elem = this;
			$.data(this, "timer", setTimeout($.proxy(function() {
				playSound($(elem).attr("name")); 
	        }, this), 300));
	        }, function() { clearTimeout($.data(this, "timer")); }
		);
		$(t).removeClass('hidden');
		imgs.push(t);
	});
	disorder(imgs);
	$(imgContainer).append(imgs);
}

function functionsDD(context,currElem){
	isCorrect=checkCorrect(currElem);
	if (isCorrect==true){sessionCounter();}
}

function checkCorrect(img) {
	
	var name = $(img).attr("name");
	if(name == resultWord){
		window.setTimeout(function(){$(img).addClass("animateToFront");},0);
		//$(img).addClass("animateToFrontUpper");
		return true;
	}
	else{
		wrong(img,imgContainer);
		return false;
	}
}

function checkReplace(box,newDiv){
	if( $(target).has('img') ){
		prevDiv=$(target).children();
		$(prevDiv).addClass('normal');
		$(imgContainer).append(prevDiv);
		$(target).append(newDiv);

	}
}
function moveToTarget(elem) {
	$(target).append(elem);
	functionsDD(null,elem);
}