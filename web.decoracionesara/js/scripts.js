// Loading Home Page
(function (global) {

var aradeco = {};

var homeHTML = "snippets/home-snippet.html"

var insertHTML = function (selector, html) {
	var element = document.querySelector(selector);
	element.insertHTML = html;
}


var showLoading = function (selector) {
	var html = "<div class='text-center'>";
	html += "<img src='media/loaging.gif'></div>";
	insertHTML(selector, html);
}

document,addEventListener("DOMContentLoaded", function(event){
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(homeHTML, function (responseText) {
		document.querySelector("#main-content").innerHTML = responseText;
	},
	false);
});

global.$aradeco = aradeco;

})(window);