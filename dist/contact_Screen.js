/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Compose_Window/contact_Screen.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Compose_Window/contact_Screen.js":
/*!**********************************************!*\
  !*** ./src/Compose_Window/contact_Screen.js ***!
  \**********************************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ContactFactory_contactFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ContactFactory/contactFactory */ \"./src/ContactFactory/contactFactory.js\");\n\nconst [setAccessToken,getAccessToken,syncContact,getnextLink] = Object(_ContactFactory_contactFactory__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"a\"])();\n// let contactContainers;\n//document.querySelector(\"#sync\").onclick = syncContact\n // contactContainers = document.querySelector(\".main_Contact_container\")\n // console.log(contactContainers)\n  \n//   export default contactContainers;\n\n// Office.onReady().then(function () {\n// console.log(\"window ready\");\n// Office.context.ui.messageParent(\"ready\", { targetOrigin: \"https://localhost:3000/taskpane.js\" });\n// Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onContactFromParent);\n// });\n\n// var accessToken;\n// async function onContactFromParent(arg) {\n//   accessToken = JSON.parse(arg.message)\n// console.log(getAccessToken())\n// }\n\n\n//# sourceURL=webpack:///./src/Compose_Window/contact_Screen.js?");

/***/ }),

/***/ "./src/ContactFactory/contactFactory.js":
/*!**********************************************!*\
  !*** ./src/ContactFactory/contactFactory.js ***!
  \**********************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return Contactfactory; });\nfunction Contactfactory(){\n  var contactArray = [];\n  var contactName = [];\n  var accessToken;\n  var nextlink=\"\";\n  var hasMore = true;\n  var url  = \"https://outlook.office365.com/api/v2.0/me/contacts\";\n\n  \n  //intersection observer \n  let options = {\n   root: null ,\n   rootMargin: '0px',\n   threshold: 1\n }     \n let observerI;\n  return[\n\nfunction setAccessToken(acc)\n{\n      accessToken = acc;\n     //console.log(accessToken)\n},\n\nfunction getAccessToken(){      \n   return accessToken; \n   \n},\n async function syncContact(){\n   console.log(\"sync Contact\")\n   document.querySelector('#sync').style.pointerEvents = 'none';\n   var LoadingDiv;\n   let contact_Container=document.querySelector(\"#main_Container > div > div.contact_Container\")\n   contact_Container.innerHTML = \"\"\n   fetch(url,{\n      method: 'GET',\n      headers: \n      {\n        \"authorization\": \"Bearer \"+accessToken,\n      },\n    }).then(res=>res.json().then(items=>{\n//  await $.ajax({\n//  url: url,\n//  dataType: \"json\",\n//  headers: { Authorization: \"Bearer\" + accessToken },\n//     }).done((items) => {\n            if(nextlink){\n            hasMore=true;\n            }\n  let data = JSON.stringify(items.value);\n  LoadingDiv = document.createElement(\"div\")\n  LoadingDiv.setAttribute(\"id\",\"loading\")\n  LoadingDiv.innerText = \"Loading....\"\n  contact_Container.appendChild(LoadingDiv)\n\n  async function getnextLink(){\n   console.log(\"call getNextLink\")\n   if( hasMore === true ){\n     contactArray=[]\n     contactName=[]\n     fetch(url,{\n      method: 'GET',\n      headers: \n      {\n        \"authorization\": \"Bearer \"+accessToken,\n      },\n\n     }).then(res=>res.json())\n//     $.ajax({\n//     url: url,\n//     dataType: \"json\",\n//     headers: { Authorization: \"Bearer \" + accessToken },\n//  })\n .then((items) => {\n    url = items['@odata.nextLink']\n    if(url === undefined ){\n      hasMore = false\n     }\n    let data = JSON.stringify(items.value);\n   //  console.log(items)\n    for(let j=0;j<(items.value).length;j++){\n    contactArray.push((items.value)[j].EmailAddresses[0].Address)\n    contactName.push((items.value)[j].DisplayName)\n   //  console.log(contactName[j],contactArray[j])\n   }\n\n   if(contactArray.length === 0 ){\n    LoadingDiv.innerHTML = \" \"\n    let noContact = document.createElement('div');\n    noContact.classList.add('contact_div');\n    noContact.innerHTML =`<div class=\"no-contact\">\n                      No Contacts\n                  </div>\n    `\n    contact_Container.appendChild(noContact);\n   }else{\n   for (let i = 0; i <contactArray.length; i++) {\n     var newContact = document.createElement('div');\n     newContact.classList.add('contact_div');\n     newContact.innerHTML = `<div class=\"item-avatar\">\n                                <span>${contactName[i].split(\" \").map((n)=>n[0]).join(\"\").toUpperCase()}</span> \n                              </div>\n                              <div class=\"item-name-email\">\n                                 <div class=\"contact_name\">\n                                       ${contactName[i]}\n                                 </div>\n                                <div  class=\"contact_email\">\n                                   ${contactArray[i]}   \n                                </div>\n                              </div>\n                              <div class=\"invite_btn\">\n                                 <span>Invite</span>\n                              </div>`;\n                         LoadingDiv.before(newContact);\n     }    \n    }\n     console.log(hasMore)\n   })\n  }\n   else if(hasMore === false) {\n       console.log(\"disconnect\")\n       observerI.disconnect();\n       LoadingDiv.style.display = \"none\"\n   }\n}\n\nobserverI = new IntersectionObserver(getnextLink, options);\n   let target = document.getElementById(\"loading\")\n   //observer target\n   observerI.observe(target);\n    \n}))\n.catch((error)=> {\n   console.log(error);\n });\n\n\n },\n]\n}\n\n\n\n//# sourceURL=webpack:///./src/ContactFactory/contactFactory.js?");

/***/ })

/******/ });