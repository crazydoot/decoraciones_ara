// Loading Home Page
(function (global) {

var aradeco = {};

var homeHTML = "snippets/home-snippet.html";
var allCategoriesURL = "";
var categoriesTitleUrl = "snippets/category-title.html";
var categoryHTML  = "snippets/category-snippet.html";
var singleItemHtmlUrl = "snippets/singleItem-snippet.html";

var insertHTML = function (selector, html) {
	var element = document.querySelector(selector);
	element.innerHTML = html;
}


var showLoading = function (selector) {
	var html = "<div class='text-center'>";
	html += "<img src='media/loaging.gif'></div>";
	insertHTML(selector, html);
}

var insertProperty = function (string, propName, propValue){
	var propToReplace = "{{" + propName + "}}";
	string = string.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
}

document,addEventListener("DOMContentLoaded", function(event){
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(homeHTML, function (responseText) {
		document.querySelector("#main-content").innerHTML = responseText;
	},
	false);
});

// Takes the category ID and loads the items for that category
// by updating the main content only.
aradeco.loadCategory = function (catID) {
	console.log("CAT loadCategory: ", catID);
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
	    	$ajaxUtils.sendGetRequest(categoryHTML, function (categoryHtml) {
	      		var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
	        	insertHTML("#main-content", categoriesViewHtml);
	    	},
	    	false);
	    },
	    false);
	}
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section id='items-section' class='col-sm-12 col-md-12 col-lg-10'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
  	console.log("Looping: ", i);
    // Insert category values
    var html = categoryHtml;
    var title = "" + categories[i].title;
    var category = categories[i].category;
    var imgSrc = categories[i].imgSrc;
    var itmID = categories[i].itemID;

    html = insertProperty(html, "title", title);
    html = insertProperty(html, "category", category);
    html = insertProperty(html, "itmID", itmID);
    html = insertProperty(html, "img", imgSrc);
    finalHtml += html;
  }

  finalHtml += "</section> </div>";
  return finalHtml;
}


aradeco.loadItem = function (itemID) {
	showLoading("#main-content");
	console.log(itemID);
	$ajaxUtils.sendGetRequest(itemID, buildAndShowSingleItem, true);
}

function buildAndShowSingleItem(itemObj) {
	$ajaxUtils.sendGetRequest(singleItemHtmlUrl, function(singleItemHtml){

		finalHtml = "<div class='row'>";

		var html = singleItemHtml;
		var title = itemObj.title;
		var desc = itemObj.des;
		var category = itemObj.category;
		var imgSrc = itemObj.imgSrc;

		html = insertProperty(html, "category", category);
		html = insertProperty(html, "img", imgSrc);

		console.log(html);
		finalHtml += html;

		finalHtml += "</div>";
		insertHTML("#main-content", finalHtml);
	});


}









global.$aradeco = aradeco;

})(window);


function testFirebase(){
	var db = firebase.firestore();
/*	
	var newT = "arreglo-00";

	for(var i =0; i < 8; i++){
		var newT = curr + i;
		var currRef = db.collection("categorias").doc("postres").collection("item-info").doc(newT);
		currRef.update({
			img: firebase.firestore.FieldValue.arrayRemove("media/images/postres/",newT,".jpg")
		});
	}*/
	

/*	var batch = db.batch();

	var docTitle = "arreglo-00";
	var docData = {
		category: "arreglos",
		des: "SAME",
		imgSrc: "arreglo-00",
		itemID: 2000,
		title: "title"
	}
	var i =0;
	for(;i<8;i++){
		var newTitle = docTitle + i;
		var imgSrc = docData.imgSrc + i;
		var itmID = docData.itemID + i;
		docData.imgSrc = imgSrc + ".jpg";
		docData.itemID = itmID;

		var currRef = db.collection("categorias").doc(docData.category).collection("item-info").doc(newTitle);
		batch.set(currRef, docData)
		console.log("WORKING" + newTitle + "\n")
		docData.imgSrc = "arreglo-00";
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