/*
 * Falta corregir el tema de los contenedores originales
*/

var leftArray=0
var rightArray=0
var numParts=0;
var contOriginal;
var contSegundo;


//function moveOrigin(img1,img2,contOriginal1,contOriginal2){
//	
//	$("#target").find("#"+img1).addClass('normal');
//	$("#target").find("#"+img2).addClass('normal');
//	
//	$("#target").find("#"+img1).appendTo($("#"+contOriginal1));
//	$("#target").find("#"+img2).appendTo($("#"+contOriginal2));
//}


function functionsDD(context,currElem){
	//$( ".img" ).on( "dragstop", function( event, ui ) {
		if(img1==null){
			img1=currElem.attr("id");
			contOriginal1=currElem.attr("column");
		
			}
		else{
			img2=currElem.attr("id");
			contOriginal2=currElem.attr("column");
		
			if(img1==img2){
				imageOk($("#target").find("img"));
				window.setTimeout(function(){$("#target").html("");}, 3000);
				contador=contador-1;
				if(contador==0){ cartelFelicitaciones();}
			}
		else{
			console.log("imgs: ",img1,img2);
			var img_target1=$("#target").find("#"+img1);
			var img_target2=$("#target").find("#"+img2);
			img_target1.addClass('wrong').effect('shake');
			img_target2.addClass('wrong').effect('shake');
			window.setTimeout(moveOrigin, 1000,img_target1,$("#"+contOriginal1));
			window.setTimeout(moveOrigin, 1000,img_target2,$("#"+contOriginal2));
			
		}
		img1=null;
		img2=null;
		
		}
}

function imageOk(target){
	target.removeClass("ui-draggable-dragging");
	target.addClass("animateToFront"); 
} 

function readyOk(idObj,left,right){
	getConfigByElement("rhymes","lev_2",3,fillTemplate);
}


function randomGroup(conf){
	group=disorder(conf)[0];//elijo el primero porque estan todos desordenados ya
	left=group["1"];
	right=group["2"];
	functInit(left,"left"); //adds elements disorderly   
	functInit(right,"right"); 
	contRight=$('#rightContainer').children();
	contLeft=$('#leftContainer').children();
	idObj=$('#target');
	dragAndDrop(contRight,idObj,functionsDD);
	dragAndDrop(contLeft,idObj,functionsDD);
	//console.log("drag",$( ".img" ));
	
}

function fillTemplate(conf){
	var left=[];
	var right=[];
	$(conf).each(function(index,element){
		left.push(element[0]);
		right.push(element[1]);
	});
	functInit(left,"left"); //adds elements disorderly   
	functInit(right,"right"); 
	contRight=$('#rightContainer').children();
	contLeft=$('#leftContainer').children();
	idObj=$('#target');
	dragAndDrop(contRight,idObj,functionsDD);
	dragAndDrop(contLeft,idObj,functionsDD);
}



function functInit(conf,place){
	imgs=[];
	$(conf).each(function(index,e){
    	t=$('#'+place+'boxTemp').clone();
		$(t).attr('id',index);
		$(t).removeAttr('hidden');
		name=conf[index];
		$(t).attr('name',name);
		$(t).prop('num',index);
		//$(t).css({backgroundImage : 'url(images/imgOculta/' + $(t).attr("name") + '.jpg)'});
		$(t).attr('src','images/activities/' + name + '.jpg');
		$(t).mousedown(function(){
			playSound(this.name);
		});	
		imgs.push(t);
	});
	disorder(imgs);
	$("#"+place+"Container").append(imgs);
	
}

