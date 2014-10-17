var target;
var numberTemp;
var numberContainer;
var completeWord;
var numberToSelect;

function readyOk(targ,imgT,cont,complete){
	target=targ;
	numberTemp=imgT;
	numberContainer=cont;
	completeWord=complete;
	// conf=getConfig("12",randomGroup);
	functionInit();
}

function functionInit() {
	getConfigByElement("act12","act",1,functionCallback);
}

function functionCallback(conf){
	// group=disorder(conf)[0];//elijo el primero porque estan todos desordenados ya
	var conf = conf[0];
	
	var sentenceSelected = conf["values"];
	numberToSelect= sentenceSelected.length;
	
	// var firstWord = sentenceSelected[0];
	// var secondWord = values[1];

	// sentenceSelected=group["sentence"]; 
	// numbersSelected=group["quantity"]; //in number
	//images=group["images"];
	fillTemplateWord(sentenceSelected);


	fillTemplateNumber(getRandomNumber(2));
	number2=numberContainer.children();
	dragAndDrop(number2,target,functionsDD);
	
}

function getRandomNumber(quantity) {
	var random = [];
	for (var i = quantity - 1; i >= 0; i--) {
		random.push( Math.floor((Math.random()*10)+1) );	
	};	
	return random;
}

function fillTemplateWord(wordComplete){
	originWord=wordComplete.join(' ');
	$(completeWord).text(originWord);
}

function fillTemplateNumber(number){
	numberArray=[];
	number.unshift(numberToSelect);
	$(number).each(function(index,e){
    	t=$(numberTemp).clone();
		name=e;
		$(t).attr('name',name);
		$(t).attr('num',index);
		//$(t).attr('src','images/activities/' + name + '.jpg');
		$(t).mouseover(function(){
			playSound($(this).attr('name'));
		});
		$(t).text(name);
		$(t).removeClass('hidden');
		numberArray.push(t);
	});
	disorder(numberArray);
	$(numberContainer).append(numberArray);
}

function functionsDD(context,currElem){
	checkReplace(context,currElem);
	isCorrect=checkCorrect(currElem);
	if (isCorrect==true){
		origin=$(currElem).attr('name');
		playSound(origin);
		$(document).delay(400);
		cartelFelicitaciones();
	}
	if (isCorrect==true){cartelFelicitaciones();}
}

function checkCorrect(number) {
	num=$(number).attr("num");
	if(num==0){
		return true;
	}
	else{
		$(number).effect('shake');
		$(number).removeClass('normal');
		$(number).addClass('wrong');
		window.setTimeout(moveOrigin, 1000,$(number),numberContainer);
		return false;
	}
}

function checkReplace(box,newDiv){
	if( $(box).has('b') ){
		prevDiv=$(box).children();
		$(prevDiv).removeClass('wrong');
		$(numberContainer).append(prevDiv);
		$(box).append(newDiv);

	}
}