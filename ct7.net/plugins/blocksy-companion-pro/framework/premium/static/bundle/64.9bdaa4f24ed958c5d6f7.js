"use strict";(globalThis.webpackChunkblocksy_companion=globalThis.webpackChunkblocksy_companion||[]).push([[64,726],{726:function(e,t,n){function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}n.d(t,{Q:function(){return a},R:function(){return u}});var a=function(){var e=JSON.parse(localStorage.getItem("blocksyPastPopups")),t={};return Array.isArray(e)?e.forEach((function(e){t[e]={closed:{reason:"cancel",timestamp:(new Date).getTime()},pages:[]}})):t=e,(t=Object.keys(t||{}).reduce((function(e,n){var r=t[n],a=r.isExpired,u=c(r,["isExpired"]);return o(o({},e),{},i({},n,o(o({},u),u.closed?{}:{closed:a?{reason:"cancel",timestamp:(new Date).getTime()}:null})))}),{}))||{}},u=function(e){var t=e.id.replace("ct-popup-",""),n=a()[t];if(e.dataset.popupRelaunch&&e.dataset.popupRelaunch.indexOf("custom")>-1&&n){var r=e.dataset.popupRelaunch.split(":"),o=0,i=0;r.length>1&&(i=o=parseInt(r[1])),r.length>2&&(i=parseInt(r[2]));var c=n.closed;if(!c||!c.timestamp)return!1;var u="cancel"===c.reason?o:i;return!((new Date-new Date(c.timestamp))/864e5>u)}return n&&n.closed}},64:function(e,t,n){n.r(t),n.d(t,{handleTriggers:function(){return l}});var r=n(726);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var p=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];n.e(696).then(n.bind(n,696)).then((function(e){return e.openMicroPopup.apply(void 0,t)}))},l=function(){if(a(document.querySelectorAll('[data-popup-mode*="page_load"]')).filter((function(e){return!(0,r.R)(e)})).map((function(e){return p(e)})),a(document.querySelectorAll('[data-popup-mode*="after_x_time"]')).filter((function(e){return!(0,r.R)(e)})).map((function(e){var t=e.dataset.popupMode.split(":")[1];setTimeout((function(){p(e)}),1e3*parseInt(t,10))})),document.querySelector('[data-popup-mode*="after_x_pages"]')){var e=a(document.querySelectorAll('[data-popup-mode*="after_x_pages"]')).filter((function(e){return!(0,r.R)(e)}));if(e.length>0){var t=(0,r.Q)();e.map((function(e){var n,r,o=e.id.replace("ct-popup-",""),c=parseFloat(e.dataset.popupMode.split(":")[1])+1,u=i(i({},null!==(n=t[o])&&void 0!==n?n:{}),{},{pages:Array.from(new Set([].concat(a((null!==(r=t[o])&&void 0!==r?r:{}).pages||[]),[location.href])))});t[o]=u,u.pages.length>=c&&p(e)})),localStorage.setItem("blocksyPastPopups",JSON.stringify(t))}}if(document.querySelector('[data-popup-mode*="exit_intent"]')&&a(document.querySelectorAll('[data-popup-mode*="exit_intent"]')).filter((function(e){return!(0,r.R)(e)})).length>0){document.addEventListener("mouseout",(function e(t){(t.clientY<=0||t.clientX<=0||t.clientX>=window.innerWidth||t.clientY>=window.innerHeight)&&a(document.querySelectorAll('[data-popup-mode*="exit_intent"]')).map((function(t){t.classList.contains("active")||(p(t),document.removeEventListener("mouseout",e))}))}))}document.querySelector('[data-popup-mode*="element_reveal"]')&&a(document.querySelectorAll('[data-popup-mode*="element_reveal"]')).filter((function(e){return!(0,r.R)(e)})).map((function(e){var t=e.dataset.popupMode.split(":")[1];if(document.querySelector(t)){var n=new IntersectionObserver((function(t){0!==t.filter((function(e){return e.isIntersecting})).map((function(e){return e.target})).length&&(p(e),n.disconnect())}));a(document.querySelectorAll(t)).map((function(e){n.observe(e)}))}})),document.querySelector('[data-popup-mode*="element_click"]')&&a(document.querySelectorAll('[data-popup-mode*="element_click"]')).filter((function(e){return!(0,r.R)(e)})).map((function(e){var t=e.dataset.popupMode.split(":")[1];document.querySelector(t)&&a(document.querySelectorAll(t)).map((function(t){t.addEventListener("click",(function(t){t.preventDefault(),t.stopPropagation(),p(e)}))}))})),document.querySelector('[data-popup-mode*="after_inactivity"]')&&a(document.querySelectorAll('[data-popup-mode*="after_inactivity"]')).filter((function(e){return!(0,r.R)(e)})).map((function(e){var t;function n(){p(e),t&&clearTimeout(t),window.removeEventListener("load",r),window.removeEventListener("mousemove",r),window.removeEventListener("mousedown",r),window.removeEventListener("touchstart",r),window.removeEventListener("click",r),window.removeEventListener("keydown",r),window.removeEventListener("scroll",r,!0)}function r(){var r=e.dataset.popupMode.split(":")[1];clearTimeout(t),t=setTimeout(n,1e3*parseInt(r,10))}window.addEventListener("load",r),window.addEventListener("mousemove",r),window.addEventListener("mousedown",r),window.addEventListener("touchstart",r),window.addEventListener("click",r),window.addEventListener("keydown",r),window.addEventListener("scroll",r,!0)}))}}}]);