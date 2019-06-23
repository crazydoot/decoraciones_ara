// Loading Home Page
(function (global) {

var aradeco = {};

var homeHTML = "snippets/home-snippet.html";
var allCategoriesURL = "";
var categoriesTitleUrl = "snippets/category-title.html";
var categoryHTML  = "snippets/category-snippet.html";

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

aradeco.loadCategory = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(2, buildAndShowCategoriesHTML, true)
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
    var name = "" + categories[i].title;
    var category = categories[i].title;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "category", category);
    finalHtml += html;
  }

  finalHtml += "</section> </div>";
  return finalHtml;
}


global.$aradeco = aradeco;

})(window);


function testFirebase(){
	/*var db = firebase.firestore();
	
	var batch = db.batch();

	var docTitle = "arreglo-00";
	var docData = {
		title: "TITLE",
		des: "SAME",
		src:""
	}
	var i =0;
	for(;i<10;i++){
		var newTitle = docTitle + i;
		var currRef = db.collection("categorias").doc("arreglos").collection("imagenes").doc(newTitle);
		batch.set(currRef, docData)
		console.log("WORKING" + newTitle + "\n")
	}

	batch.commit().then(function(){
		console.log("ADDED THEM");
	});*/



	/*
	var newRef = db.doc("categorias/arreglos/imagenes/arreglo-001")
	newRef.get().then(function (doc) {
		var data = doc.data();
		console.log(JSON.stringify(data) + ":::::::::::::::");
	});*/
};