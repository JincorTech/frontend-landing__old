!function e(t,i,n){function r(o,a){if(!i[o]){if(!t[o]){var l="function"==typeof require&&require;if(!a&&l)return l(o,!0);if(s)return s(o,!0);throw new Error("Cannot find module '"+o+"'")}var c=i[o]={exports:{}};t[o][0].call(c.exports,function(e){var i=t[o][1][e];return r(i||e)},c,c.exports,e,t,i,n)}return i[o].exports}for(var s="function"==typeof require&&require,o=0;o<n.length;o++)r(n[o]);return r}({1:[function(e,t,i){!function(){"use strict";function e(t){return void 0===this||Object.getPrototypeOf(this)!==e.prototype?new e(t):(P=this,P.version="3.3.6",P.tools=new S,P.isSupported()?(P.tools.extend(P.defaults,t||{}),P.defaults.container=i(P.defaults),P.store={elements:{},containers:[]},P.sequences={},P.history=[],P.uid=0,P.initialized=!1):"undefined"!=typeof console&&null!==console&&console.log("ScrollReveal is not supported in this browser."),P)}function i(e){if(e&&e.container){if("string"==typeof e.container)return window.document.documentElement.querySelector(e.container);if(P.tools.isNode(e.container))return e.container;console.log('ScrollReveal: invalid container "'+e.container+'" provided.'),console.log("ScrollReveal: falling back to default container.")}return P.defaults.container}function n(e,t){return"string"==typeof e?Array.prototype.slice.call(t.querySelectorAll(e)):P.tools.isNode(e)?[e]:P.tools.isNodeList(e)?Array.prototype.slice.call(e):[]}function r(){return++P.uid}function s(e,t,i){t.container&&(t.container=i),e.config?e.config=P.tools.extendClone(e.config,t):e.config=P.tools.extendClone(P.defaults,t),"top"===e.config.origin||"bottom"===e.config.origin?e.config.axis="Y":e.config.axis="X"}function o(e){var t=window.getComputedStyle(e.domEl);e.styles||(e.styles={transition:{},transform:{},computed:{}},e.styles.inline=e.domEl.getAttribute("style")||"",e.styles.inline+="; visibility: visible; ",e.styles.computed.opacity=t.opacity,t.transition&&"all 0s ease 0s"!==t.transition?e.styles.computed.transition=t.transition+", ":e.styles.computed.transition=""),e.styles.transition.instant=a(e,0),e.styles.transition.delayed=a(e,e.config.delay),e.styles.transform.initial=" -webkit-transform:",e.styles.transform.target=" -webkit-transform:",l(e),e.styles.transform.initial+="transform:",e.styles.transform.target+="transform:",l(e)}function a(e,t){var i=e.config;return"-webkit-transition: "+e.styles.computed.transition+"-webkit-transform "+i.duration/1e3+"s "+i.easing+" "+t/1e3+"s, opacity "+i.duration/1e3+"s "+i.easing+" "+t/1e3+"s; transition: "+e.styles.computed.transition+"transform "+i.duration/1e3+"s "+i.easing+" "+t/1e3+"s, opacity "+i.duration/1e3+"s "+i.easing+" "+t/1e3+"s; "}function l(e){var t,i=e.config,n=e.styles.transform;t="top"===i.origin||"left"===i.origin?/^-/.test(i.distance)?i.distance.substr(1):"-"+i.distance:i.distance,parseInt(i.distance)&&(n.initial+=" translate"+i.axis+"("+t+")",n.target+=" translate"+i.axis+"(0)"),i.scale&&(n.initial+=" scale("+i.scale+")",n.target+=" scale(1)"),i.rotate.x&&(n.initial+=" rotateX("+i.rotate.x+"deg)",n.target+=" rotateX(0)"),i.rotate.y&&(n.initial+=" rotateY("+i.rotate.y+"deg)",n.target+=" rotateY(0)"),i.rotate.z&&(n.initial+=" rotateZ("+i.rotate.z+"deg)",n.target+=" rotateZ(0)"),n.initial+="; opacity: "+i.opacity+";",n.target+="; opacity: "+e.styles.computed.opacity+";"}function c(e){var t=e.config.container;t&&-1===P.store.containers.indexOf(t)&&P.store.containers.push(e.config.container),P.store.elements[e.id]=e}function d(e,t,i){var n={target:e,config:t,interval:i};P.history.push(n)}function u(){if(P.isSupported()){g();for(var e=0;e<P.store.containers.length;e++)P.store.containers[e].addEventListener("scroll",h),P.store.containers[e].addEventListener("resize",h);P.initialized||(window.addEventListener("scroll",h),window.addEventListener("resize",h),P.initialized=!0)}return P}function h(){T(g)}function f(){var e,t,i,n;P.tools.forOwn(P.sequences,function(r){n=P.sequences[r],e=!1;for(var s=0;s<n.elemIds.length;s++)i=n.elemIds[s],t=P.store.elements[i],k(t)&&!e&&(e=!0);n.active=e})}function g(){var e,t;f(),P.tools.forOwn(P.store.elements,function(i){t=P.store.elements[i],e=v(t),y(t)?(t.config.beforeReveal(t.domEl),e?t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.target+t.styles.transition.delayed):t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.target+t.styles.transition.instant),p("reveal",t,e),t.revealing=!0,t.seen=!0,t.sequence&&m(t,e)):w(t)&&(t.config.beforeReset(t.domEl),t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.initial+t.styles.transition.instant),p("reset",t),t.revealing=!1)})}function m(e,t){var i=0,n=0,r=P.sequences[e.sequence.id];r.blocked=!0,t&&"onload"===e.config.useDelay&&(n=e.config.delay),e.sequence.timer&&(i=Math.abs(e.sequence.timer.started-new Date),window.clearTimeout(e.sequence.timer)),e.sequence.timer={started:new Date},e.sequence.timer.clock=window.setTimeout(function(){r.blocked=!1,e.sequence.timer=null,h()},Math.abs(r.interval)+n-i)}function p(e,t,i){var n=0,r=0,s="after";switch(e){case"reveal":r=t.config.duration,i&&(r+=t.config.delay),s+="Reveal";break;case"reset":r=t.config.duration,s+="Reset"}t.timer&&(n=Math.abs(t.timer.started-new Date),window.clearTimeout(t.timer.clock)),t.timer={started:new Date},t.timer.clock=window.setTimeout(function(){t.config[s](t.domEl),t.timer=null},r-n)}function y(e){if(e.sequence){var t=P.sequences[e.sequence.id];return t.active&&!t.blocked&&!e.revealing&&!e.disabled}return k(e)&&!e.revealing&&!e.disabled}function v(e){var t=e.config.useDelay;return"always"===t||"onload"===t&&!P.initialized||"once"===t&&!e.seen}function w(e){if(e.sequence){return!P.sequences[e.sequence.id].active&&e.config.reset&&e.revealing&&!e.disabled}return!k(e)&&e.config.reset&&e.revealing&&!e.disabled}function b(e){return{width:e.clientWidth,height:e.clientHeight}}function E(e){if(e&&e!==window.document.documentElement){var t=x(e);return{x:e.scrollLeft+t.left,y:e.scrollTop+t.top}}return{x:window.pageXOffset,y:window.pageYOffset}}function x(e){var t=0,i=0,n=e.offsetHeight,r=e.offsetWidth;do{isNaN(e.offsetTop)||(t+=e.offsetTop),isNaN(e.offsetLeft)||(i+=e.offsetLeft),e=e.offsetParent}while(e);return{top:t,left:i,height:n,width:r}}function k(e){var t=x(e.domEl),i=b(e.config.container),n=E(e.config.container),r=e.config.viewFactor,s=t.height,o=t.width,a=t.top,l=t.left,c=a+s,d=l+o;return function(){var t=a+s*r,u=l+o*r,h=c-s*r,f=d-o*r,g=n.y+e.config.viewOffset.top,m=n.x+e.config.viewOffset.left,p=n.y-e.config.viewOffset.bottom+i.height,y=n.x-e.config.viewOffset.right+i.width;return t<p&&h>g&&u<y&&f>m}()||function(){return"fixed"===window.getComputedStyle(e.domEl).position}()}function S(){}var P,T;e.prototype.defaults={origin:"bottom",distance:"20px",duration:500,delay:0,rotate:{x:0,y:0,z:0},opacity:0,scale:.9,easing:"cubic-bezier(0.6, 0.2, 0.1, 1)",container:window.document.documentElement,mobile:!0,reset:!1,useDelay:"always",viewFactor:.2,viewOffset:{top:0,right:0,bottom:0,left:0},beforeReveal:function(e){},beforeReset:function(e){},afterReveal:function(e){},afterReset:function(e){}},e.prototype.isSupported=function(){var e=document.documentElement.style;return"WebkitTransition"in e&&"WebkitTransform"in e||"transition"in e&&"transform"in e},e.prototype.reveal=function(e,t,a,l){var h,f,g,m,p,y;if(void 0!==t&&"number"==typeof t?(a=t,t={}):void 0!==t&&null!==t||(t={}),h=i(t),f=n(e,h),!f.length)return console.log('ScrollReveal: reveal on "'+e+'" failed, no elements found.'),P;a&&"number"==typeof a&&(y=r(),p=P.sequences[y]={id:y,interval:a,elemIds:[],active:!1});for(var v=0;v<f.length;v++)m=f[v].getAttribute("data-sr-id"),m?g=P.store.elements[m]:(g={id:r(),domEl:f[v],seen:!1,revealing:!1},g.domEl.setAttribute("data-sr-id",g.id)),p&&(g.sequence={id:p.id,index:p.elemIds.length},p.elemIds.push(g.id)),s(g,t,h),o(g),c(g),P.tools.isMobile()&&!g.config.mobile||!P.isSupported()?(g.domEl.setAttribute("style",g.styles.inline),g.disabled=!0):g.revealing||g.domEl.setAttribute("style",g.styles.inline+g.styles.transform.initial);return!l&&P.isSupported()&&(d(e,t,a),P.initTimeout&&window.clearTimeout(P.initTimeout),P.initTimeout=window.setTimeout(u,0)),P},e.prototype.sync=function(){if(P.history.length&&P.isSupported()){for(var e=0;e<P.history.length;e++){var t=P.history[e];P.reveal(t.target,t.config,t.interval,!0)}u()}else console.log("ScrollReveal: sync failed, no reveals found.");return P},S.prototype.isObject=function(e){return null!==e&&"object"==typeof e&&e.constructor===Object},S.prototype.isNode=function(e){return"object"==typeof window.Node?e instanceof window.Node:e&&"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},S.prototype.isNodeList=function(e){var t=Object.prototype.toString.call(e),i=/^\[object (HTMLCollection|NodeList|Object)\]$/;return"object"==typeof window.NodeList?e instanceof window.NodeList:e&&"object"==typeof e&&i.test(t)&&"number"==typeof e.length&&(0===e.length||this.isNode(e[0]))},S.prototype.forOwn=function(e,t){if(!this.isObject(e))throw new TypeError('Expected "object", but received "'+typeof e+'".');for(var i in e)e.hasOwnProperty(i)&&t(i)},S.prototype.extend=function(e,t){return this.forOwn(t,function(i){this.isObject(t[i])?(e[i]&&this.isObject(e[i])||(e[i]={}),this.extend(e[i],t[i])):e[i]=t[i]}.bind(this)),e},S.prototype.extendClone=function(e,t){return this.extend(this.extend({},e),t)},S.prototype.isMobile=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},T=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return e}):void 0!==t&&t.exports?t.exports=e:window.ScrollReveal=e}()},{}],2:[function(e,t,i){!function(e,n){"object"==typeof i&&"object"==typeof t?t.exports=n():"function"==typeof define&&define.amd?define("Siema",[],n):"object"==typeof i?i.Siema=n():e.Siema=n()}(this,function(){return function(e){function t(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var i={};return t.m=e,t.c=i,t.i=function(e){return e},t.d=function(e,i,n){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),o=function(){function e(t){var i=this;n(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.startIndex,this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler"].forEach(function(e){i[e]=i[e].bind(i)}),this.init()}return s(e,[{key:"init",value:function(){if(window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null},this.selector.addEventListener("touchstart",this.touchstartHandler,{passive:!0}),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler,{passive:!0}),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler)),null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selector.style.overflow="hidden",this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.config.draggable&&(this.selector.style.cursor="-webkit-grab");for(var e=document.createDocumentFragment(),t=0;t<this.innerElements.length;t++){var i=document.createElement("div");i.style.cssFloat="left",i.style.float="left",i.style.width=100/this.innerElements.length+"%",i.appendChild(this.innerElements[t]),e.appendChild(i)}this.sliderFrame.appendChild(e),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent(),this.config.onInit.call(this)}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===r(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e])}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;0===this.currentSlide&&this.config.loop?this.currentSlide=this.innerElements.length-this.perPage:this.currentSlide=Math.max(this.currentSlide-e,0),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide===this.innerElements.length-this.perPage&&this.config.loop?this.currentSlide=0:this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"slideToCurrent",value:function(){this.sliderFrame.style[this.transformProperty]="translate3d(-"+this.currentSlide*(this.selectorWidth/this.perPage)+"px, 0, 0)"}},{key:"updateAfterDrag",value:function(){var e=this.drag.endX-this.drag.startX,t=Math.abs(e),i=Math.ceil(t/(this.selectorWidth/this.perPage));e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent()}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.slideToCurrent()}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null}}},{key:"touchstartHandler",value:function(e){e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"touchmoveHandler",value:function(e){e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo&&(this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing,this.sliderFrame.style[this.transformProperty]="translate3d("+-1*(this.currentSlide*(this.selectorWidth/this.perPage)+(this.drag.startX-this.drag.endX))+"px, 0, 0)")}},{key:"mousedownHandler",value:function(e){e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"mousemoveHandler",value:function(e){e.preventDefault(),this.pointerDown&&(this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing,this.sliderFrame.style[this.transformProperty]="translate3d("+-1*(this.currentSlide*(this.selectorWidth/this.perPage)+(this.drag.startX-this.drag.endX))+"px, 0, 0)")}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.updateAfterDrag(),this.clearDrag())}},{key:"updateFrame",value:function(){this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.config.draggable&&(this.selector.style.cursor="-webkit-grab");for(var e=document.createDocumentFragment(),t=0;t<this.innerElements.length;t++){var i=document.createElement("div");i.style.cssFloat="left",i.style.float="left",i.style.width=100/this.innerElements.length+"%",i.appendChild(this.innerElements[t]),e.appendChild(i)}this.sliderFrame.appendChild(e),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent()}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");this.innerElements.splice(e,1),this.currentSlide=e<=this.currentSlide?this.currentSlide-1:this.currentSlide,this.updateFrame(),t&&t.call(this)}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(-1!==this.innerElements.indexOf(e))throw new Error("The same item in a carousel? Really? Nope 😭");this.innerElements.splice(t,0,e),this.currentSlide=t<=this.currentSlide?this.currentSlide+1:this.currentSlide,this.updateFrame(),i&&i.call(this)}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this)}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this)}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(window.removeEventListener("resize",this.resizeHandler),this.selector.style.cursor="auto",this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),e){for(var i=document.createDocumentFragment(),n=0;n<this.innerElements.length;n++)i.appendChild(this.innerElements[n]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style")}t&&t.call(this)}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,threshold:20,loop:!1,onInit:function(){},onChange:function(){}},i=e;for(var n in i)t[n]=i[n];return t}},{key:"webkitOrNot",value:function(){return"string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform"}}]),e}();t.default=o,e.exports=t.default}])})},{}],3:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var r=e("scrollreveal"),s=n(r),o=e("siema"),a=n(o);window.sr=(0,s.default)({duration:300,reset:!1,easing:"cubic-bezier(0.6, 0.2, 0.1, 1)"}),sr.reveal(".js-landing-section",{delay:550,duration:300,distance:"80px",scale:1,opaicty:1,viewFactor:1e-5}),sr.reveal(".landing__scroll-arrow",{delay:600,duration:300}),sr.reveal(".start__name",{delay:300,origin:"top",distance:"50px"}),sr.reveal(".start__title",{delay:200,origin:"top",distance:"50px"}),sr.reveal(".start__step--first",{delay:400,distance:"50px"}),sr.reveal(".start__step--second",{delay:500,distance:"50px"}),sr.reveal(".start__step--third",{delay:600,distance:"50px"}),sr.reveal(".start__divider",{delay:800,distance:"0px"}),sr.reveal(".start__button",{delay:800,distance:"100px"}),sr.reveal(".step-section__number",{delay:300,distance:"0px"}),sr.reveal(".step-section__title",{delay:200}),sr.reveal(".js-screenshot-first",{delay:200,duration:700}),sr.reveal(".js-screenshot-second",{delay:200,duration:700}),sr.reveal(".js-screenshot-third",{delay:200,duration:700}),sr.reveal(".step-section__text",{delay:200}),sr.reveal(".screenshot__dots",{delay:200}),sr.reveal(".footer__logo",{delay:200,origin:"top",distance:"50px"}),sr.reveal(".footer__description",{delay:300,origin:"top",distance:"50px"}),sr.reveal(".footer__try-button",{delay:400,origin:"top",distance:"50px"}),sr.reveal(".js-social-network1",{delay:500,distance:"50px"}),sr.reveal(".js-social-network2",{delay:600,distance:"50px"}),sr.reveal(".js-social-network3",{delay:500,distance:"50px"}),sr.reveal(".js-social-network4",{delay:600,distance:"50px"}),sr.reveal(".js-social-network5",{delay:700,distance:"50px"});var l=new a.default({selector:".js-slider",duration:500,easing:"cubic-bezier(0.6, 0.2, 0.1, 1)",perPage:1,startIndex:0,threshold:20,draggable:!1,loop:!1}),c=[].map.call(document.querySelectorAll(".js-dot"),function(e){return e}),d=[].map.call(document.querySelectorAll(".js-slide"),function(e){return e}),u=function(e,t){var i=e[t];i.className;e.map(function(e){return e.classList.remove("active")}),i.classList.toggle("active")};u(c,0),u(d,0),c.map(function(e,t){e.addEventListener("click",function(){return u(c,t),u(d,t),l.goTo(t)})})},{scrollreveal:1,siema:2}]},{},[3]);