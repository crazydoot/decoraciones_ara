// Loading Home Page
(function (global) {

var aradeco = {};

var homeHTML = "snippets/home-snippet.html";
var allCategoriesURL = "";
var categoriesTitleUrl = "snippets/categoryOptions-snippet.html";
var categoryHTML  = "snippets/category-snippet.html";
var singleItemHtmlUrl = "snippets/singleItem-snippet.html";
var testUrl = "snippets/testSnippet.html";
var currWidth = 0;
var numOfTiles = 0;
var debug = true;
var checkedOptions = [];

var insertHTML = function (selector, html) {
	var element = document.querySelector(selector);
	element.innerHTML = html;
}



var showLoading = function (selector) {
	var html = "<div class='text-center'>";
	html += "<img src='media/loader.gif'></div>";
	insertHTML(selector, html);
}

var insertProperty = function (string, propName, propValue){
	var propToReplace = "{{" + propName + "}}";
	string = string.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
}

document.addEventListener("DOMContentLoaded", function(event){
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(homeHTML, function (responseText) {
		document.querySelector("#main-content").innerHTML = responseText;
		currWidth = $(global).width();
	},
	false);
});



aradeco.loadTest = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(testUrl, function(responseText){
		document.querySelector("#main-content").innerHTML = responseText;
	});
}
// Takes the category ID and loads the items for that category
// by updating the main content only.
aradeco.loadCategory = function (catID) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(catID, buildAndShowCategoriesHTML, true)
}


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
	console.log(categories,length)
	if(categories == undefined) {
		console.log("Categories is undefined!");
	} else {
	  // Load title snippet of categories page
		$ajaxUtils.sendGetRequest(categoriesTitleUrl, function (categoriesTitleHtml) {
		    	  // Retrieve single category snippet
		    	categoriesTitleHtml = buildOptionsView(categoriesTitleHtml, categories);
		    	$ajaxUtils.sendGetRequest(categoryHTML, function (categoryHtml) {
		      		var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
		        	insertHTML("#main-content", categoriesViewHtml);
		        	if($(global).width() > 992){
		        		$("#optsBtn").trigger('click');
		        	}
		    	},
		    	false);
	    },
	    false);
	}
}


function buildOptionsView(categoriesTitleHtml, categories){
	console.log("In buildOptionsView: Categories: " + categories[0].category);
	var finalSideHtml = "";
	var collapsedHtml = "";

	var currOptions;

	switch(categories[0].category){
		case 'decoraciones':
			currOptions = $aradeco.decoOptions;
			break;
		case 'arreglos':
			currOptions = arreglosOptions;
			break;
		case 'postres':
			currOptions = apostreOptions;
			break;
		default:
			currOptions = [];
	}

	for(var i=0; i < currOptions.title.length; i++){
		var html = "<li> \
						<input type='checkbox' id='{{OptID}}' onchange='$aradeco.loadOptions(this);' value='{{OptID}}' style='display: none;'> \
						<label for='{{OptID}}'> {{opcion}} </label> \
					</li>";
	
		html = insertProperty(html, "opcion", currOptions.title[i]);
		html = insertProperty(html, "OptID", currOptions.code[i]);

		finalSideHtml += html;


		html = "<li> \
					<input type='checkbox' id='{{OptID}}2' onchange='$aradeco.loadOptions(this);' value='{{OptID}}' style='display: none;'> \
					<label for='{{OptID}}'> \
						{{opcion}} \
					</label> \
				</li>";

		html = insertProperty(html, "opcion", currOptions.title[i]);
		html = insertProperty(html, "OptID", currOptions.code[i]);

		collapsedHtml += html;
	}
	var categoriesTitleUpdatedHtml = insertProperty(categoriesTitleHtml, "list-items", finalSideHtml);

	return categoriesTitleUpdatedHtml;
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section id='items-section' class='col-sm-12 col-md-12 col-lg-10'>";

  // Loop over categories
  for(numOfTiles = 0; numOfTiles < categories.length; numOfTiles++) {
    // Insert category values
    var html = categoryHtml;
    var title = "" + categories[numOfTiles].title;
    var category = categories[numOfTiles].category;
    var imgSrc = categories[numOfTiles].imgSrc;
    var itmID = categories[numOfTiles].itemID;
    var options = "";
    categories[numOfTiles].opciones.forEach(function(item, index){
    	options += item + " ";
    });
    
    html = insertProperty(html, "title", title);
    html = insertProperty(html, "category", category);
    html = insertProperty(html, "itmID", itmID);
    html = insertProperty(html, "img", imgSrc);
    html = insertProperty(html, "opciones", options);
    html = insertProperty(html, "num", numOfTiles);
    finalHtml += html;
  }

  if(debug){console.log("In buildCategoriesViewHtml: numOfTiles="+numOfTiles);}
  finalHtml += "</section> </div>";
  return finalHtml;
}


aradeco.loadItem = function (itemID) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(itemID, buildAndShowSingleItem, true);

}

function buildAndShowSingleItem(itemObj, itmFooter) {
	$ajaxUtils.sendGetRequest(singleItemHtmlUrl, function(singleItemHtml){

		finalHtml = "<div id='item-row' class='row'>";

		var html = singleItemHtml;
		var title = itemObj.title;
		var desc = itemObj.des;
		var category = itemObj.category;
		var imgSrc = itemObj.imgSrc;
		html = insertProperty(html, "title", title);
		html = insertProperty(html, "category", category);
		html = insertProperty(html, "img", imgSrc);
		html = insertProperty(html, "desc", desc);
		html = insertProperty(html, "itm-footer", itmFooter);

		finalHtml += html;
		finalHtml += "</div>";
		insertHTML("#main-content", finalHtml);
		var h = document.getElementById("myimage").clientHeight;
		var w = document.getElementById("myimage").clientWidth;
		$aradeco.zoomIn("myimage", "myresult", w, h); 
	});
}

aradeco.loadOptions = function(checkBox) {
	var optionsList;
	if(($.inArray(checkBox.value, decoOptions.code)) != -1){
		optionsList = decoOptions.code;
	} else if (($.inArray(checkBox.value, arreglosOptions.code)) != -1){
		optionsList = arreglosOptions.code;
	}
	var numChecked = document.querySelectorAll('input[type="checkbox"]:checked').length; //number of curr checked boxes
	var checked = checkBox.checked;

	// Checked if current items displayed have the class checked/unchecked
	// If so hide item or show all if all options are unchecked
	for(var i=0; i<numOfTiles; i++){
		if(checked){
	    	if(numChecked == 1){//Only Display checked option, removed the rest
	    		if(!($("#"+i).hasClass(checkBox.value))){
	    			$("#"+i).addClass("d-none");
	    		}
	    	}
		} else {
			if(numChecked == 0){
				if($("#"+i).hasClass("d-none")){
					$("#"+i).removeClass("d-none");
				}
			} else{
				if($("#"+i).hasClass(checkBox.value)){
					$("#"+i).addClass("d-none");
				}
			}
		}
	}

	// Add or remove checked.value to the array of currently
	// selected options
	if(checked){
		checkedOptions.push(checkBox.value);
	} else {
		checkedOptions.forEach(function(item, index){
			if(item === checkBox.value){
				checkedOptions.splice(index, 1);
			}
		});
	}

	// Checked if a still checked item was removed due to sharing
	// options with a prev unselected item
	checkedOptions.forEach(function(item, index){
		console.log("checkedOptions[i]:"+item);
		if($("section ."+checkedOptions[index]).hasClass("d-none")){
			console.log(item)
			$("."+item).removeClass("d-none");
		}
	});



}

function buildAndShowOptions(optionsList){
	//console.log(JSON.stringify(optionsList));
	$ajaxUtils.sendGetRequest(categoryHTML, function (responseText) {
		var numItem = optionsList.length;
		var finalHtml;
		for(var i=0; i < numItem; i++){

			var html = responseText;
			var title = optionsList[i].title;
			var category = optionsList[i].category;
			var imgSrc = optionsList[i].imgSrc;
			var itmID = optionsList[i].itemID;
			var options = optionsList[i].opciones;

			html = insertProperty(html, "title", title);
			html = insertProperty(html, "category", category);
			html = insertProperty(html, "img", imgSrc);
			html = insertProperty(html, "itmID", itmID);
			html = insertProperty(html, "opciones", options);

			finalHtml += html;
		}
		console.log("In buildAndShowOptions: numItem = " + numItem);
		$("#items-section").append(finalHtml);
	},
	false);
}

aradeco.test = function(checkBox){
	console.log("TEST***********---------------");
	if(checkBox.checked){
		console.log("CHECKED", checkBox.value);
		$('#'+checkBox.value+"2").addClass("checkedBox");
	} else {
		console.log("UNCHECKED");
	}
}



aradeco.zoomIn = function(imgID, resultID, width, height) {
	var img, lens, result, bck_x, bck_y, imgWidth, imgHeight;
	img = document.getElementById(imgID);
	result = document.getElementById(resultID);
	/* Create lens: */
	lens = document.createElement("DIV");
	lens.setAttribute("class", "img-zoom-lens");
	/* Insert lens: */
	img.parentElement.insertBefore(lens, img);
	/* Calculate the ratio between result DIV and lens: */
	cx = result.offsetWidth / lens.offsetWidth;
	cy = result.offsetHeight / lens.offsetHeight;

	/* Wait for image to load, then create lense and set up zoom */
	img.onload = function(){
		console.log("Image WIdth:5 " + img.height);
		console.log("Image WIdth:5 " + img.width);
		imgWidth = img.width;
		imgHeight = img.height;

		bck_x = imgWidth*cx;
		bck_y = imgHeight *cy;

		console.log("Image bck: " + imgWidth + "---- " + imgHeight);

		result.style.backgroundImage = "url('" + img.src + "')";
		result.style.backgroundSize = (bck_x) + "px " + (bck_y) + "px";
		/* Execute a function when someone moves the cursor over the image, or the lens: */
		lens.addEventListener("mousemove", moveLens);
		img.addEventListener("mousemove", moveLens);
		/* And also for touch screens: */
		lens.addEventListener("touchmove", moveLens);
		img.addEventListener("touchmove", moveLens);


		$('.img-zoom-lens').hover(function(){
			console.log('in Hover');
			$('#myresult').css('display', 'block');
			$('#myresult').css('float', 'left');			
		},
		function (){
			$('#myresult').css('display', 'none');
			$('#myresult').css('float', 'none');			
		});
	}

	function moveLens(e) {
		var pos, x, y;
		/* Prevent any other actions that may occur when moving over the image */
		e.preventDefault();
		/* Get the cursor's x and y positions: */
		pos = getCursorPos(e);
		/* Calculate the position of the lens: */
		x = pos.x - (lens.offsetWidth / 2);
		y = pos.y - (lens.offsetHeight / 2);
		/* Prevent the lens from being positioned outside the image: */
		if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
		if (x < 0) {x = 0;}
		if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
		if (y < 0) {y = 0;}
		/* Set the position of the lens: */
		lens.style.left = x + "px";
		lens.style.top = y + "px";
		/* Display what the lens "sees": */
		result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
	}
	function getCursorPos(e) {
		var a, x = 0, y = 0;
		e = e || window.event;
		/* Get the x and y positions of the image: */
		a = img.getBoundingClientRect();
		/* Calculate the cursor's x and y coordinates, relative to the image: */
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/* Consider any page scrolling: */
		x = x - window.pageXOffset;
		y = y - window.pageYOffset;
		return {x : x, y : y};
	}
} 

// Keep Navigaction var visible after scrolling past the header
$(global).bind('scroll', function() {
    var navHeight = 110; // custom nav height
    if($(global).scrollTop() > navHeight){
    	$('#main-bar').addClass('fixed-top');
    } else {
    	$('#main-bar').removeClass('fixed-top');
    }
        
});

$(global).resize(function() {
	var newWidth = $(global).width();
	if((newWidth < currWidth) && (newWidth < 992)){
		$("#collapsed-options").removeClass("show");
	} else if ((newWidth > currWidth) && (newWidth > 991)){
		$("#collapsed-options").addClass("show");
	}
	currWidth = newWidth;
});



const arreglosOptions = {
	title: ["Rosas", "Pareja", "Hombres", "Botana", "Funeral", "Centro Mesa", "Ramos", "Tulipanes", "Especial", "Chico", "Peluche"],
	code: ["RS", "SO", "ML", "SN", "FN", "CT", "BQ", "TP", "SP", "SM", "SA"]
};

const decoOptions = {
	title: ["Cartoons", "Ninos/Ninas", "Animales"],
	code: ["CT", "NN", "AN"]
};

const postreOptions = {
	title: ["Dulce", "Salado"],
	code: ["SW", "ST"]
};

aradeco.decoOptions = decoOptions;
aradeco.postreOptions = postreOptions;
aradeco.arreglosOptions = arreglosOptions;




global.$aradeco = aradeco;

})(window);


function testFunction(){

/*	var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
        origins: ['Greenwich, England'],
        destinations: ['Stockholm, Sweden'],
        travelMode: 'DRIVING',
    },
    function (response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            console.log('Error:', status);
        } else {
            console.log(response);
            console.log((response.rows[0].elements[0].distance.text));
        }
    });*/
/*
	var db = firebase.firestore();

	
	var newT = "arreglo-0";

	for(var i =11; i < 60; i++){
		var newT = newT + i;
		var currRef = db.collection("categorias").doc("arreglos").collection("tile-info").doc(newT);
		if(i < 25){
			currRef.update({
				opciones: firebase.firestore.FieldValue.arrayUnion("ST")
			});
		} else {
			currRef.update({
				opciones: firebase.firestore.FieldValue.arrayUnion("SW")
			});
		}
		newT = "arreglo-0";
	}*/
/*
	var db = firebase.firestore();

	var docTitle = "arreglo-00";

	for(var i=9; i < 60; i++){
		if(i > 9){ docTitle = "arreglo-0"; }
		docTitle = docTitle + i;
		var currRef = db.collection("categorias").doc("arreglos").collection("tile-info").doc(docTitle);

		currRef.update({
			itemID: (2000+i)
		})
		.then(function(){
			console.log("itemID: " + itemID)
		});
	}*/


/*	var db = firebase.firestore();


	var batch = db.batch();

	var docTitle = "arreglo-00";
	var docData = {
		category: "arreglos",
		des: "SAME",
		imgSrc: "arreglo-00",
		itemID: 2000,
		title: "title"
	}
	var i =8;
	for(;i<60;i++){

		if( i > 9){
			docTitle = "arreglo-0";
			docData.imgSrc = "arreglo-0"
		}

		var newTitle = docTitle + i;
		var imgSrc = docData.imgSrc + i;
		var itmID = docData.itemID + i;
		docData.imgSrc = imgSrc + ".jpg";
		docData.itemID = itmID+8;

		var currRef = db.collection("categorias").doc(docData.category).collection("item-info").doc(newTitle);
		batch.set(currRef, docData)
		console.log("WORKING" + newTitle + "\n")
		if( i > 9){
			docData.imgSrc = "arreglo-0"
		}
		docData.itemID = 2000;
	}

	batch.commit().then(function(){
		console.log("ADDED THEM");
	});*/



	/*
	var newRef = db.doc("categorias/postres/imagenes/arreglo-001")
	newRef.get().then(function (doc) {
		var data = doc.data();
		console.log(JSON.stringify(data) + ":::::::::::::::");
	});*/
};