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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Passphrase-Screen.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/MasterKeyFactory/index.js":
/*!***************************************!*\
  !*** ./src/MasterKeyFactory/index.js ***!
  \***************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return MasterKey; });\nlet masterkey;\nlet passphrase;\n// var userEmail;\n// Office.onReady((info) => {\n    //  userEmail=Office.context.mailbox.userProfile.emailAddress  \n// });\n\nfunction MasterKey(){\n    return [\n                async function getMasterKey(userEmail){\n                         const cacheStorage   = await caches.open(userEmail+\"\")\n                         const cachedResponse = await cacheStorage.match( '/omailKey' );\n                         let response = \"\"\n                         try{\n                              response = await cachedResponse.text()\n                            }\n                         catch { return  \"\"}\n                         return response\n                },\n                async function setMasterKey(userEmail,masterKey){\n                         const cache = await window.caches.open(userEmail+\"\");\n                        //  console.log(getMasterKey(userEmail))\n                         const response = new Response(JSON.stringify(masterKey), {\n                             status: 200,\n                             statusText: \"OMail Cache\",\n                         });\n                         cache.put(\"/omailKey\", response) \n                         .then(async() => {\n        \n                            const cacheStorage   = await caches.open(userEmail+\"\");\n                            const cachedResponse = await cacheStorage.match( '/omailKey' );\n                            let response = await cachedResponse.text() \n                            return response                    \n                        })\n                        .catch(err=>console.log(err));\n                },\n               async function removeMasterkey(userEmail){\n                         await caches.delete(userEmail)\n                         .then(function(boolean) {console.log(\"cache deleted successfully\",userEmail);})\n                         .catch(err=>console.log(err))\n                },\n               async function setPassphrase(pass){\n                //    console.log(pass)\n                //  passphrase=JSON.stringify(pass)\n                //  console.log(passphrase);\n                    const cache = await window.caches.open(\"passphrase\");\n                    const response = new Response((pass), {\n                        status: 200,\n                        statusText: \"Passphrase Cache\",\n                    });\n                    cache.put(\"/Passphrase\", response) \n                  },\n                  async function getPassphrase(){\n                    const cacheStorage   = await caches.open(\"passphrase\")\n                    const cachedResponse = await cacheStorage.match( '/Passphrase' );\n                    let response = \"\"\n                    try{\n                         response = await cachedResponse.text()\n                       }\n                    catch { return  \"\"}\n                    return response\n                    // console.log(passphrase);\n                    // return JSON.parse(passphrase)\n\n                },\n                async function removePassphrase(pass=\"\"){\n                    // passphrase=\"\";\n                     const cache = await window.caches.open(\"passphrase\");\n                     const response = new Response((pass), {\n                         status: 200,\n                         statusText: \"Passphrase Cache\",\n                     });\n                     cache.put(\"/Passphrase\", response) \n                   },\n\n    ]\n}\n\n//# sourceURL=webpack:///./src/MasterKeyFactory/index.js?");

/***/ }),

/***/ "./src/Passphrase-Screen.js":
/*!**********************************!*\
  !*** ./src/Passphrase-Screen.js ***!
  \**********************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MasterKeyFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MasterKeyFactory */ \"./src/MasterKeyFactory/index.js\");\n\n\nconst [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = Object(_MasterKeyFactory__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"a\"])();\nOffice.onReady()\n.then(function () {\n  // Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);\n  Office.context.ui.messageParent(\"Ready\", { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);\n  document.querySelector(\".passphrase-copy\").onclick = copyPassphrase\n  document.querySelector(\".passphrase-copy-text\").onclick = copyPassphrase\n  document.getElementById(\"passphrase-btn-ok\").onclick = closePassWindow\n  // displayPass()\n}); \n\n function onMessageFromParent(arg) {\n  var msgP;\n  msgP  = JSON.parse(arg.message)\n  console.log(msgP)\n  displayPass(msgP)\n  }\n\nasync function displayPass(msgP){\n// let msgP=JSON.parse(await getPassphrase())\n// console.log(msgP);\n// let date=new Date(parseInt(msgP.date))\ndocument.querySelector('.pass-view-subject-value').innerText=msgP.subject\ndocument.querySelector('.pass-view-recepient-result').innerText=msgP.To\ndocument.querySelector('.passphrase-input').value=msgP.Passphrase\ndocument.querySelector('.pass-view-time').innerText=msgP.date\n}\nfunction copyPassphrase(){\n  console.log(\"copying passphrase\") \n   let copyText = document.querySelector('.passphrase-input').select();//.innerText\n   document.execCommand(\"copy\");\n  //Office.context.ui.messageParent(\"COPY \"+copyText, { targetOrigin: \"https://localhost:3000/taskpane.js\" });\n  //navigator.clipboard.writeText(copyText.value);\n}\nfunction closePassWindow(){\n  Office.context.ui.messageParent(\"OK\", { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Passphrase-Screen.js?");

/***/ })

/******/ });