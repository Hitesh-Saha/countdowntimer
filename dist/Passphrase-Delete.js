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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Passphrase-Delete.js");
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

/***/ "./src/Passphrase-Delete.js":
/*!**********************************!*\
  !*** ./src/Passphrase-Delete.js ***!
  \**********************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MasterKeyFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MasterKeyFactory */ \"./src/MasterKeyFactory/index.js\");\n/* harmony import */ var _vaultUtils_passphraseUtils_deletePassphrase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vaultUtils/passphraseUtils/deletePassphrase */ \"./src/vaultUtils/passphraseUtils/deletePassphrase.js\");\n\n\nconst [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = Object(_MasterKeyFactory__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"a\"])();\nOffice.onReady()\n.then(function () {\n  Office.context.ui.messageParent(\"Ready\", { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n  console.log(\"sended ready\")\n Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);\n  document.querySelector(\".pass-delete\").onclick = deletePassWindow\n  document.querySelector(\".pass-cancel\").onclick = closePassWindow\n});\nvar msgPassphrase;\n async function onMessageFromParent(arg) {\n   var msgP;\n  console.log(arg.message)\n   msgP  = JSON.parse(arg.message)\n  displayPass(msgP)\n  }\n  // if(msgP===undefined){\n    // console.log(\"not received data\")\n  // }else{\n  async function displayPass(msgP){\n    console.log(msgP)\n    msgPassphrase=msgP\n  // msgP=JSON.parse(await getPassphrase())\n  // console.log(msgP);\n  // let date=new Date(parseInt(msgP.date))\n  document.querySelector('.pass-view-subject-value').innerText=msgPassphrase.subject\n  document.querySelector('.pass-view-recepient-result').innerText=msgPassphrase.To\n  document.querySelector('.passphrase-input').innerText=msgPassphrase.Passphrase\n  document.querySelector('.pass-view-time').innerText=msgPassphrase.date\n}\nfunction closePassWindow(){\n  Office.context.ui.messageParent(\"OK\", { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n}\nasync function deletePassWindow(){\n  console.log(msgPassphrase)\n  console.log(msgPassphrase.usr,msgPassphrase.msgId);\nconst resp = await Object(_vaultUtils_passphraseUtils_deletePassphrase__WEBPACK_IMPORTED_MODULE_1__[/* default */ \"a\"])(msgPassphrase.usr,msgPassphrase.msgId)\n  if(resp){\n    Office.context.ui.messageParent(\"OK\", { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n  }\n  else{\n    console.log(\"Some error in deleting passphrase\");\n  }\n}\n  \n\n//# sourceURL=webpack:///./src/Passphrase-Delete.js?");

/***/ }),

/***/ "./src/vaultUtils/passphraseUtils/deletePassphrase.js":
/*!************************************************************!*\
  !*** ./src/vaultUtils/passphraseUtils/deletePassphrase.js ***!
  \************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("const deletePassphrase = (user, id) => {\n\n  return new Promise((res, rej) => {\n    var requestOptions = {\n      method: \"DELETE\",\n      redirect: \"follow\",\n    };\n  \n    fetch(\n      \"https://omail.vault.ziroh.com/api/v1/omail/pp/\" + user + \"?msgId=\" + id,\n      requestOptions\n    )\n      .then((response) => response.text())\n      .then((result) => res(true))\n      .catch((error) => res(false));\n  })\n\n  \n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (deletePassphrase);\n\n\n//# sourceURL=webpack:///./src/vaultUtils/passphraseUtils/deletePassphrase.js?");

/***/ })

/******/ });