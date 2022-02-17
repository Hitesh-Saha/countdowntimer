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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Reciver_Window/rec-window.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Reciver_Window/rec-window.js":
/*!******************************************!*\
  !*** ./src/Reciver_Window/rec-window.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("Office.onReady().then(function () {\n  Office.context.ui.messageParent(JSON.stringify({type:\"ready\"}), { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n   Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onContactFromParent);\n});\n\nfunction onContactFromParent(msg){\nlet decrypted_data=JSON.parse(msg.message);\nif(decrypted_data.fromname==undefined){\n  decrypted_data.fromname=\"\";\n}\nif(decrypted_data.fromemail==undefined){\n  decrypted_data.fromemail=\"\";\n}\n// if(decrypted_data.fromname[0]==undefined){\n  \n// }\n  document.getElementById('intitals').innerHTML=decrypted_data.fromname[0];\n  document.getElementById('from-name').innerHTML=decrypted_data.fromname;\n// let fromName = document.getElementById(\"from-name\")\n// let FromNames = document.createElement(\"div\")\n// FromNames.textContent = decrypted_data.fromname\n// fromName.append(FromNames)\ndocument.getElementById('from-email').innerHTML=`<div>${decrypted_data.fromemail}</div>`;\n\n//--------------DATE--TIME--------------------------\ndocument.getElementById('date-time-value').textContent=decrypted_data.dateTime;\n\n// //--------TO,CC,BCC----------------\nlet To=[],Cc=[]\nif(decrypted_data.to==undefined){decrypted_data.to=[]}\nif(decrypted_data.cc==undefined){decrypted_data.cc=[]}\n\n To=()=>{\n  let div=[];\n  for(let i=0;i<decrypted_data.to.length;i++){\n    div.push(decrypted_data.to[i])\n  }\n  return div;\n}\n\nif(decrypted_data.cc.length==0){\n  document.getElementById('cc-address').style.display=\"none\"\n}else{\nCc=()=>{\n  let div=[];\n  for(let i=0;i<decrypted_data.cc.length;i++){\n    div.push(decrypted_data.cc[i])\n  }\n  return div;\n}\ndocument.getElementById('cc-value').innerHTML=Cc().join(\", \");;\n\n}\n\n document.getElementById('to-value').innerHTML=To().join(\", \");\n//  document.getElementById('bcc-value').innerHTML=Bcc().join(\", \");;\n\n//  //--------------SUBJECT,BODY-----------------\n\n//document.querySelector(\"div.ms-Dialog-title\").textContent=\"Subject\"\n\n document.getElementById('mail-display-area').innerHTML=decrypted_data.body;\n document.querySelector('.title-subject').innerHTML=decrypted_data.subject;\n//---------------ATTACHMENT------------------------------\nlet Attachment_Div=document.querySelector(\"#reciver_window > div.attachment-tab\")\nlet attachmentIcon=\"\";\nlet attachmentName=\"\";\nlet AttExtension=\"\";\n\nlet a=document.createElement('div')\nfor(let i=0;i<decrypted_data.attachment.length;i++){\n\nattachmentName=decrypted_data.attachment[i].filename;\nAttExtension=attachmentName.substring(attachmentName.lastIndexOf('.') + 1)\nconsole.log(AttExtension)\nattachmentIcon=attachmentIconType(AttExtension)\n a.innerHTML+=`<a><div class=\"attachment\" style=\"display:flex\">\n  <div class=\"attachment-icon\"><img style=\"width:30px;height:30px\" src=`+attachmentIcon+`></div>\n  <div class=\"attachment-details\">\n      <div class=\"attachment-name\">`+attachmentName+`</div>\n      <div class=\"attachment-size\">`+decrypted_data.attachment[i].size+`KB`+`</div>\n  </div>\n  <div class=\"attachment-arrow\"><img src=\"./assets/Arrow.svg\"></div>\n</div></a>` \n}\na.style.display=\"flex\"\nAttachment_Div.append(a)\n\nconsole.log(\"Fix onclick on attachment Icon\")\nlet attachclick=document.querySelector(\"#reciver_window > div.attachment-tab > div\")\nattachclick.onclick=(event)=>{\n // console.log(event.target.parentElement)\n  let file_name=event.target.querySelector(\".attachment-details>.attachment-name\").textContent\n  let index; \n  decrypted_data.attachment.forEach((element,i) => {\n    if(element.filename===file_name){\n      index=i\n    }\n  });\n  let content=(decrypted_data.attachment[index].content)\n  let type=decrypted_data.attachment[index].mimeType\n  let element = document.createElement('a');\n  event.target.parentElement.append(element)\n  let a=event.target.parentElement\n  a.setAttribute('href',`data:`+`text/plain;base64,`+content)  //`data:`+type+`;base64`+content\n  a.setAttribute('download', file_name);\n\n}\n\n\n//-----------------REPLY REPLY_ALL FORWARD FUNCTIONALITY---------------------------------\n\nlet replyBtn=document.getElementById('reply-button')\nlet replyAllBtn=document.getElementById('reply-all-button')\nlet forwardBtn=document.getElementById('forward-button')\n\nlet replyBtnsvg=document.getElementById('reply_svg')\nlet replyAllBtnsvg=document.getElementById('reply_all_svg')\nlet forwardBtnsvg=document.getElementById('forward_svg')\n\nlet window_html=document.querySelector(\"#reciver_window\").innerHTML;\n//console.log(window_html)\nreplyBtn.onclick=()=>{reply_popup(\"reply\",window_html)}//reply_popup(\"reply-button\")\nreplyAllBtn.onclick=()=>{reply_popup(\"reply-all\",window_html)}\nforwardBtn.onclick=()=>{reply_popup(\"forward\",window_html)}\n\nreplyBtnsvg.onclick=()=>{reply_popup(\"reply\",window_html)}//reply_popup(\"reply-button\")\nreplyAllBtnsvg.onclick=()=>{reply_popup(\"reply-all\",window_html)}\nforwardBtnsvg.onclick=()=>{reply_popup(\"forward\",window_html)}\n\n}\n\nfunction reply_popup(type,msg){\n\n//console.log(msg)\n\nlet send_msg={\n  type:\"reply-buttons\",\n  subtype:type,\n  msg:(msg)\n}\nOffice.context.ui.messageParent((JSON.stringify(send_msg)), { targetOrigin: \"https://localhost:3000/dist/taskpane.js\" });\n\n}\n\nfunction attachmentIconType(name){\n  let attachmentIcon=\"\"\n  if(name===\"txt\"){\n    attachmentIcon=\"./assets/DOC.svg\";\n  }\n  else if(name===\"docx\" || name===\"doc\" || name===\"odt\" || name===\"rtf\"){\n    attachmentIcon=\"./assets/DOC.svg\";\n  }\n  else if(name===\"pdf\"){\n    attachmentIcon=\"./assets/PDF.svg\";\n  }\n  else if(name===\"ppt\" || name===\"pptx\" || name===\"odp\"){\n    attachmentIcon=\"./assets/PPT.svg\";\n  }\n  else if(name===\"xls\" || name===\"xlxs\" || name===\"ods\"){\n    attachmentIcon=\"./assets/XL.svg\";\n  } \n  else if(name===\"jpg\" || name===\"ico\" || name===\"gif\" || name===\"png\" || name===\"svg\" || name===\"tiff\"){\n    attachmentIcon=\"./assets/IMG.svg\";\n  }\n  else if(name===\"mp4\" || name===\"mov\" || name===\"avi\" || name===\"webm\" || name===\"webp\" || name===\"wmv\"){\n    attachmentIcon=\"./assets/VID.svg\";\n  }\n  else if(name===\"ogg\" || name===\"wap\" || name===\"mp3\" || name===\"mp3\" || name===\"mp3\"){\n    attachmentIcon=\"./assets/Music.svg\";\n  }\n  // else if(name===\"ppt\"){\n  //   attachmentIcon=\"./assets/PPT.svg\";\n  // }\n  // else if(name===\"ppt\"){\n  //   attachmentIcon=\"./assets/PPT.svg\";\n  // }\n  else{\n    attachmentIcon=\"./assets/DEFAULT.svg\"\n  }\n  return attachmentIcon;\n}\n\n//# sourceURL=webpack:///./src/Reciver_Window/rec-window.js?");

/***/ })

/******/ });