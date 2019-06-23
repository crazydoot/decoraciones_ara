(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};

// Get Firesstore DB reference and save to current namespace
var dataBase = firebase.firestore();
ajaxUtils.firestoreDB = dataBase;



// Returns an HTTP request object
function getRequestObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (window.ActiveXObject) {
    // For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
}


// Makes an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest = 
  function(requestUrl, responseHandler, isFirestore) {
    if(isFirestore == undefined) {isFirestore = false;}
    if(isFirestore) {
      handleResponse(requestUrl, responseHandler, isFirestore);
    } else {
      var request = getRequestObject();
      request.onreadystatechange = 
      function() { 
        handleResponse(request, responseHandler); 
      };
      request.open("GET", requestUrl, true);
      request.send(null); // for POST only
    }
    
    
    
  };


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler, isFirestore) {
  if(isFirestore){
    getFirestoreCategories(request, responseHandler);
    console.log("In handleResponse: request=",request);
  } else if ((request.readyState == 4) && (request.status == 200)) {
      responseHandler(request.responseText);
  }
}


//
//
//
function getFirestoreCategories(cat, handler){
  var categoryDataList = [];
  var category;
  switch(cat){
    case 1: category = "decoraciones"; break;
    case 2: category = "arreglos"; break;
    case 3: category = "postres"; break;
    default: break;
  }
  console.log("CAT: ", category);
  var i = 0;
  var categoryRef = dataBase.collection("categorias").doc(category).collection("imagenes");
  categoryRef.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      //handler(doc.data());
      categoryDataList.push(doc.data());
      console.log("Printing Single Item#", i ,": ",doc.data());
      i++;
    });
    console.log("DATA LIST: \n", categoryDataList);
    handler(categoryDataList);
  }).catch(function(err){
    console.log("ERROR: ", err);
  });
}

// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;

})(window);