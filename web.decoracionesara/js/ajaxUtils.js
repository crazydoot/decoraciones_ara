(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};

// Get Firesstore DB reference and save to current namespace
var dataBase = firebase.firestore();
ajaxUtils.firestoreDB = dataBase;

//Utility
function getCategoryFromOption(option){
  decoList = ["NN", "CT"];

  if($.inArray(option, decoList) != -1){
    return 1;
  }
}

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
              console.log("In handleResponse: requestUrl=" + requestUrl);
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
  if(isFirestore && (request <= 10)){
    getFirestoreCategories(request, responseHandler);
    console.log("In handleResponse: request=",request);
  } else if (isFirestore && (request > 10)){
    getFiresStoreItem(request, responseHandler);
  } else if(isFirestore && ((typeof(request)=="string") && (request.length == 2))){
    console.log("In handleResponse:Firestore Options");
    getFirestoreOptions(request, responseHandler);
  } else if ((request.readyState == 4) && (request.status == 200)) {
      responseHandler(request.responseText);
  }
}


//
//
//
function getFirestoreCategories(catID, handler){
  var categoryDataList = [];
  var category;
  switch(catID){
    case 1: category = "decoraciones"; break;
    case 2: category = "arreglos"; break;
    case 3: category = "postres"; break;
    default: break;
  }

  var categoryRef = dataBase.collection("categorias").doc(category).collection("tile-info");
  categoryRef.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      //handler(doc.data());
      categoryDataList.push(doc.data());
    });
    handler(categoryDataList);
  }).catch(function(err){
    console.log("ERROR: ", err);
  });
}

function getFiresStoreItem(itemID, handler){
  var category;
  var idPre;
  var id;
  console.log("INSIDE getFiresStoreItem: itmID="+ itemID);

  if(itemID > 999 && itemID < 1999) {
    category = "decoraciones";
    idPre ="deco";
  } else if (itemID > 1999 && itemID < 2999){ 
    category = "arreglos";
    idPre = "arreglo"
  } else if (itemID > 2999 && itemID < 3999){ 
    category = "postres";
    idPre = "postre"
  }

  id = resolveID(parseInt(itemID));
  console.log("Before dbRref: " + idPre + "---" + id);
  var dbRef = dataBase.collection("categorias").doc(category).collection("item-info").doc(idPre+id);
  dbRef.get().then(function(doc){
    var newDbRef = dataBase.collection("categorias").doc(category);
    newDbRef.get().then(function(doc1){
      var itemFooter =  doc1.data().footer;
      handler(doc.data(), itemFooter);
    })
  });
}

function resolveID(itemID){
  if(itemID%1000 == 0){
    return "-000";
  } else if ((itemID%1000) < 10) {
    return "-00"+(itemID%1000);
  } else if ((itemID%1000) >= 10){
    return "-0"+(itemID%1000);
  }
}


function getFirestoreOptions(request, handler){
  var optionDataList = [];
  var catID = getCategoryFromOption(request);
  var optID = request;
  var category;
  switch(catID){
    case 1: category = "decoraciones"; break;
    case 2: category = "arreglos"; break;
    case 3: category = "postres"; break;
    default: break;
  }

  var categoryRef = dataBase.collection("categorias").doc(category).collection("tile-info");
  categoryRef.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      //handler(doc.data());
      if($.inArray(optID, doc.data().opciones)){
        console.log("in getFirestoreOptions about to add doc.data()=" + doc.data());
        optionDataList.push(doc.data());
      }
    });
    console.log("IN getFirestoreOptions before handler()");
    handler(optionDataList);
  }).catch(function(err){
    console.log("ERROR: ", err);
  });
}


// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;

})(window);