window.JSCompiler_renameProperty=function(e){return e};let workingURL,resolveDoc,CSS_URL_RX=/(url\()([^)]*)(\))/g,ABS_URL=/(^\/)|(^#)|(^[\w-\d]*:)/;function resolveUrl(e,t){if(e&&ABS_URL.test(e))return e;if(void 0===workingURL){workingURL=!1;try{const e=new URL("b","http://a");e.pathname="c%20d",workingURL="http://a/c%20d"===e.href}catch(e){}}return t||(t=document.baseURI||window.location.href),workingURL?new URL(e,t).href:(resolveDoc||((resolveDoc=document.implementation.createHTMLDocument("temp")).base=resolveDoc.createElement("base"),resolveDoc.head.appendChild(resolveDoc.base),resolveDoc.anchor=resolveDoc.createElement("a"),resolveDoc.body.appendChild(resolveDoc.anchor)),resolveDoc.base.href=t,resolveDoc.anchor.href=e,resolveDoc.anchor.href||e)}function resolveCss(e,t){return e.replace(CSS_URL_RX,function(e,s,r,i){return s+"'"+resolveUrl(r.replace(/["']/g,""),t)+"'"+i})}function pathFromUrl(e){return e.substring(0,e.lastIndexOf("/")+1)}var resolveUrl$1={resolveUrl:resolveUrl,resolveCss:resolveCss,pathFromUrl:pathFromUrl};const useShadow=!window.ShadyDOM,useNativeCSSProperties=Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss),useNativeCustomElements=!window.customElements.polyfillWrapFlushCallback;let rootPath=pathFromUrl(document.baseURI||window.location.href);const setRootPath=function(e){rootPath=e};let sanitizeDOMValue=void 0;const setSanitizeDOMValue=function(e){sanitizeDOMValue=e};let passiveTouchGestures=!1;const setPassiveTouchGestures=function(e){passiveTouchGestures=e};var settings={useShadow:useShadow,useNativeCSSProperties:useNativeCSSProperties,useNativeCustomElements:useNativeCustomElements,get rootPath(){return rootPath},setRootPath:setRootPath,get sanitizeDOMValue(){return sanitizeDOMValue},setSanitizeDOMValue:setSanitizeDOMValue,get passiveTouchGestures(){return passiveTouchGestures},setPassiveTouchGestures:setPassiveTouchGestures};let dedupeId=0;function MixinFunction(){}MixinFunction.prototype.__mixinApplications,MixinFunction.prototype.__mixinSet;const dedupingMixin=function(e){let t=e.__mixinApplications;t||(t=new WeakMap,e.__mixinApplications=t);let s=dedupeId++;return function(r){let i=r.__mixinSet;if(i&&i[s])return r;let n=t,a=n.get(r);a||(a=e(r),n.set(r,a));let o=Object.create(a.__mixinSet||i||null);return o[s]=!0,a.__mixinSet=o,a}};var mixin={dedupingMixin:dedupingMixin};const MODULE_STYLE_LINK_SELECTOR="link[rel=import][type~=css]",INCLUDE_ATTR="include",SHADY_UNSCOPED_ATTR="shady-unscoped";function importModule(e){const t=customElements.get("dom-module");return t?t.import(e):null}function styleForImport(e){const t=resolveCss((e.body?e.body:e).textContent,e.baseURI),s=document.createElement("style");return s.textContent=t,s}let templateWithAssetPath;function stylesFromModules(e){const t=e.trim().split(/\s+/),s=[];for(let e=0;e<t.length;e++)s.push(...stylesFromModule(t[e]));return s}function stylesFromModule(e){const t=importModule(e);if(!t)return console.warn("Could not find style data in module named",e),[];if(void 0===t._styles){const e=[];e.push(..._stylesFromModuleImports(t));const s=t.querySelector("template");s&&e.push(...stylesFromTemplate(s,t.assetpath)),t._styles=e}return t._styles}function stylesFromTemplate(e,t){if(!e._styles){const s=[],r=e.content.querySelectorAll("style");for(let e=0;e<r.length;e++){let i=r[e],n=i.getAttribute(INCLUDE_ATTR);n&&s.push(...stylesFromModules(n).filter(function(e,t,s){return s.indexOf(e)===t})),t&&(i.textContent=resolveCss(i.textContent,t)),s.push(i)}e._styles=s}return e._styles}function stylesFromModuleImports(e){let t=importModule(e);return t?_stylesFromModuleImports(t):[]}function _stylesFromModuleImports(e){const t=[],s=e.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);for(let e=0;e<s.length;e++){let r=s[e];if(r.import){const e=r.import,s=r.hasAttribute(SHADY_UNSCOPED_ATTR);if(s&&!e._unscopedStyle){const t=styleForImport(e);t.setAttribute(SHADY_UNSCOPED_ATTR,""),e._unscopedStyle=t}else e._style||(e._style=styleForImport(e));t.push(s?e._unscopedStyle:e._style)}}return t}function cssFromModules(e){let t=e.trim().split(/\s+/),s="";for(let e=0;e<t.length;e++)s+=cssFromModule(t[e]);return s}function cssFromModule(e){let t=importModule(e);if(t&&void 0===t._cssText){let e=_cssFromModuleImports(t),s=t.querySelector("template");s&&(e+=cssFromTemplate(s,t.assetpath)),t._cssText=e||null}return t||console.warn("Could not find style data in module named",e),t&&t._cssText||""}function cssFromTemplate(e,t){let s="";const r=stylesFromTemplate(e,t);for(let e=0;e<r.length;e++){let t=r[e];t.parentNode&&t.parentNode.removeChild(t),s+=t.textContent}return s}function cssFromModuleImports(e){let t=importModule(e);return t?_cssFromModuleImports(t):""}function _cssFromModuleImports(e){let t="",s=_stylesFromModuleImports(e);for(let e=0;e<s.length;e++)t+=s[e].textContent;return t}var styleGather={stylesFromModules:stylesFromModules,stylesFromModule:stylesFromModule,stylesFromTemplate:stylesFromTemplate,stylesFromModuleImports:stylesFromModuleImports,cssFromModules:cssFromModules,cssFromModule:cssFromModule,cssFromTemplate:cssFromTemplate,cssFromModuleImports:cssFromModuleImports};let modules={},lcModules={};function findModule(e){return modules[e]||lcModules[e.toLowerCase()]}function styleOutsideTemplateCheck(e){e.querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}class DomModule extends HTMLElement{static get observedAttributes(){return["id"]}static import(e,t){if(e){let s=findModule(e);return s&&t?s.querySelector(t):s}return null}attributeChangedCallback(e,t,s,r){t!==s&&this.register()}get assetpath(){if(!this.__assetpath){const e=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,t=resolveUrl(this.getAttribute("assetpath")||"",e.baseURI);this.__assetpath=pathFromUrl(t)}return this.__assetpath}register(e){(e=e||this.id)&&(this.id=e,modules[e]=this,lcModules[e.toLowerCase()]=this,styleOutsideTemplateCheck(this))}}DomModule.prototype.modules=modules,customElements.define("dom-module",DomModule);var domModule={DomModule:DomModule};function isPath(e){return e.indexOf(".")>=0}function root(e){let t=e.indexOf(".");return-1===t?e:e.slice(0,t)}function isAncestor(e,t){return 0===e.indexOf(t+".")}function isDescendant(e,t){return 0===t.indexOf(e+".")}function translate(e,t,s){return t+s.slice(e.length)}function matches(e,t){return e===t||isAncestor(e,t)||isDescendant(e,t)}function normalize(e){if(Array.isArray(e)){let t=[];for(let s=0;s<e.length;s++){let r=e[s].toString().split(".");for(let e=0;e<r.length;e++)t.push(r[e])}return t.join(".")}return e}function split(e){return Array.isArray(e)?normalize(e).split("."):e.toString().split(".")}function get(e,t,s){let r=e,i=split(t);for(let e=0;e<i.length;e++){if(!r)return;r=r[i[e]]}return s&&(s.path=i.join(".")),r}function set(e,t,s){let r=e,i=split(t),n=i[i.length-1];if(i.length>1){for(let e=0;e<i.length-1;e++){if(!(r=r[i[e]]))return}r[n]=s}else r[t]=s;return i.join(".")}const isDeep=isPath;var path={isPath:isPath,root:root,isAncestor:isAncestor,isDescendant:isDescendant,translate:translate,matches:matches,normalize:normalize,split:split,get:get,set:set,isDeep:isDeep};const caseMap={},DASH_TO_CAMEL=/-[a-z]/g,CAMEL_TO_DASH=/([A-Z])/g;function dashToCamelCase(e){return caseMap[e]||(caseMap[e]=e.indexOf("-")<0?e:e.replace(DASH_TO_CAMEL,e=>e[1].toUpperCase()))}function camelToDashCase(e){return caseMap[e]||(caseMap[e]=e.replace(CAMEL_TO_DASH,"-$1").toLowerCase())}var caseMap$1={dashToCamelCase:dashToCamelCase,camelToDashCase:camelToDashCase};let microtaskCurrHandle=0,microtaskLastHandle=0,microtaskCallbacks=[],microtaskNodeContent=0,microtaskNode=document.createTextNode("");function microtaskFlush(){const e=microtaskCallbacks.length;for(let t=0;t<e;t++){let e=microtaskCallbacks[t];if(e)try{e()}catch(e){setTimeout(()=>{throw e})}}microtaskCallbacks.splice(0,e),microtaskLastHandle+=e}new window.MutationObserver(microtaskFlush).observe(microtaskNode,{characterData:!0});const timeOut={after:e=>({run:t=>window.setTimeout(t,e),cancel(e){window.clearTimeout(e)}}),run:(e,t)=>window.setTimeout(e,t),cancel(e){window.clearTimeout(e)}},animationFrame={run:e=>window.requestAnimationFrame(e),cancel(e){window.cancelAnimationFrame(e)}},idlePeriod={run:e=>window.requestIdleCallback?window.requestIdleCallback(e):window.setTimeout(e,16),cancel(e){window.cancelIdleCallback?window.cancelIdleCallback(e):window.clearTimeout(e)}},microTask={run:e=>(microtaskNode.textContent=microtaskNodeContent++,microtaskCallbacks.push(e),microtaskCurrHandle++),cancel(e){const t=e-microtaskLastHandle;if(t>=0){if(!microtaskCallbacks[t])throw new Error("invalid async handle: "+e);microtaskCallbacks[t]=null}}};var async={timeOut:timeOut,animationFrame:animationFrame,idlePeriod:idlePeriod,microTask:microTask};const microtask=microTask,PropertiesChanged=dedupingMixin(e=>{return class extends e{static createProperties(e){const t=this.prototype;for(let s in e)s in t||t._createPropertyAccessor(s)}static attributeNameForProperty(e){return e.toLowerCase()}static typeForProperty(e){}_createPropertyAccessor(e,t){this._addPropertyToAttributeMap(e),this.hasOwnProperty("__dataHasAccessor")||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[e]||(this.__dataHasAccessor[e]=!0,this._definePropertyAccessor(e,t))}_addPropertyToAttributeMap(e){if(this.hasOwnProperty("__dataAttributes")||(this.__dataAttributes=Object.assign({},this.__dataAttributes)),!this.__dataAttributes[e]){const t=this.constructor.attributeNameForProperty(e);this.__dataAttributes[t]=e}}_definePropertyAccessor(e,t){Object.defineProperty(this,e,{get(){return this._getProperty(e)},set:t?function(){}:function(t){this._setProperty(e,t)}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let e in this.__dataHasAccessor)this.hasOwnProperty(e)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[e]=this[e],delete this[e])}_initializeInstanceProperties(e){Object.assign(this,e)}_setProperty(e,t){this._setPendingProperty(e,t)&&this._invalidateProperties()}_getProperty(e){return this.__data[e]}_setPendingProperty(e,t,s){let r=this.__data[e],i=this._shouldPropertyChange(e,t,r);return i&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),!this.__dataOld||e in this.__dataOld||(this.__dataOld[e]=r),this.__data[e]=t,this.__dataPending[e]=t),i}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,microtask.run(()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())}))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){const e=this.__data,t=this.__dataPending,s=this.__dataOld;this._shouldPropertiesChange(e,t,s)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(e,t,s))}_shouldPropertiesChange(e,t,s){return Boolean(t)}_propertiesChanged(e,t,s){}_shouldPropertyChange(e,t,s){return s!==t&&(s==s||t==t)}attributeChangedCallback(e,t,s,r){t!==s&&this._attributeToProperty(e,s),super.attributeChangedCallback&&super.attributeChangedCallback(e,t,s,r)}_attributeToProperty(e,t,s){if(!this.__serializing){const r=this.__dataAttributes,i=r&&r[e]||e;this[i]=this._deserializeValue(t,s||this.constructor.typeForProperty(i))}}_propertyToAttribute(e,t,s){this.__serializing=!0,s=arguments.length<3?this[e]:s,this._valueToNodeAttribute(this,s,t||this.constructor.attributeNameForProperty(e)),this.__serializing=!1}_valueToNodeAttribute(e,t,s){const r=this._serializeValue(t);void 0===r?e.removeAttribute(s):e.setAttribute(s,r)}_serializeValue(e){switch(typeof e){case"boolean":return e?"":void 0;default:return null!=e?e.toString():void 0}}_deserializeValue(e,t){switch(t){case Boolean:return null!==e;case Number:return Number(e);default:return e}}}});var propertiesChanged={PropertiesChanged:PropertiesChanged};let caseMap$2=caseMap$1;const nativeProperties={};let proto=HTMLElement.prototype;for(;proto;){let e=Object.getOwnPropertyNames(proto);for(let t=0;t<e.length;t++)nativeProperties[e[t]]=!0;proto=Object.getPrototypeOf(proto)}function saveAccessorValue(e,t){if(!nativeProperties[t]){let s=e[t];void 0!==s&&(e.__data?e._setPendingProperty(t,s):(e.__dataProto?e.hasOwnProperty(JSCompiler_renameProperty("__dataProto",e))||(e.__dataProto=Object.create(e.__dataProto)):e.__dataProto={},e.__dataProto[t]=s))}}const PropertyAccessors=dedupingMixin(e=>{const t=PropertiesChanged(e);return class extends t{static createPropertiesForAttributes(){let e=this.observedAttributes;for(let t=0;t<e.length;t++)this.prototype._createPropertyAccessor(caseMap$2.dashToCamelCase(e[t]))}static attributeNameForProperty(e){return caseMap$2.camelToDashCase(e)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(e){for(let t in e)this._setProperty(t,e[t])}_ensureAttribute(e,t){const s=this;s.hasAttribute(e)||this._valueToNodeAttribute(s,t,e)}_serializeValue(e){switch(typeof e){case"object":if(e instanceof Date)return e.toString();if(e)try{return JSON.stringify(e)}catch(e){return""}default:return super._serializeValue(e)}}_deserializeValue(e,t){let s;switch(t){case Object:try{s=JSON.parse(e)}catch(t){s=e}break;case Array:try{s=JSON.parse(e)}catch(t){s=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${e}`)}break;case Date:s=isNaN(e)?String(e):Number(e),s=new Date(s);break;default:s=super._deserializeValue(e,t)}return s}_definePropertyAccessor(e,t){saveAccessorValue(this,e),super._definePropertyAccessor(e,t)}_hasAccessor(e){return this.__dataHasAccessor&&this.__dataHasAccessor[e]}_isPropertyPending(e){return Boolean(this.__dataPending&&e in this.__dataPending)}}});var propertyAccessors={PropertyAccessors:PropertyAccessors};const templateExtensions={"dom-if":!0,"dom-repeat":!0};function wrapTemplateExtension(e){let t=e.getAttribute("is");if(t&&templateExtensions[t]){let s=e;for(s.removeAttribute("is"),e=s.ownerDocument.createElement(t),s.parentNode.replaceChild(e,s),e.appendChild(s);s.attributes.length;)e.setAttribute(s.attributes[0].name,s.attributes[0].value),s.removeAttribute(s.attributes[0].name)}return e}function findTemplateNode(e,t){let s=t.parentInfo&&findTemplateNode(e,t.parentInfo);if(!s)return e;for(let e=s.firstChild,r=0;e;e=e.nextSibling)if(t.parentIndex===r++)return e}function applyIdToMap(e,t,s,r){r.id&&(t[r.id]=s)}function applyEventListener(e,t,s){if(s.events&&s.events.length)for(let r,i=0,n=s.events;i<n.length&&(r=n[i]);i++)e._addMethodEventListenerToNode(t,r.name,r.value,e)}function applyTemplateContent(e,t,s){s.templateInfo&&(t._templateInfo=s.templateInfo)}function createNodeEventHandler(e,t,s){e=e._methodHost||e;return function(t){e[s]?e[s](t,t.detail):console.warn("listener method `"+s+"` not defined")}}const TemplateStamp=dedupingMixin(e=>{return class extends e{static _parseTemplate(e,t){if(!e._templateInfo){let s=e._templateInfo={};s.nodeInfoList=[],s.stripWhiteSpace=t&&t.stripWhiteSpace||e.hasAttribute("strip-whitespace"),this._parseTemplateContent(e,s,{parent:null})}return e._templateInfo}static _parseTemplateContent(e,t,s){return this._parseTemplateNode(e.content,t,s)}static _parseTemplateNode(e,t,s){let r,i=e;return"template"!=i.localName||i.hasAttribute("preserve-content")?"slot"===i.localName&&(t.hasInsertionPoint=!0):r=this._parseTemplateNestedTemplate(i,t,s)||r,i.firstChild&&(r=this._parseTemplateChildNodes(i,t,s)||r),i.hasAttributes&&i.hasAttributes()&&(r=this._parseTemplateNodeAttributes(i,t,s)||r),r}static _parseTemplateChildNodes(e,t,s){if("script"!==e.localName&&"style"!==e.localName)for(let r,i=e.firstChild,n=0;i;i=r){if("template"==i.localName&&(i=wrapTemplateExtension(i)),r=i.nextSibling,i.nodeType===Node.TEXT_NODE){let s=r;for(;s&&s.nodeType===Node.TEXT_NODE;)i.textContent+=s.textContent,r=s.nextSibling,e.removeChild(s),s=r;if(t.stripWhiteSpace&&!i.textContent.trim()){e.removeChild(i);continue}}let a={parentIndex:n,parentInfo:s};this._parseTemplateNode(i,t,a)&&(a.infoIndex=t.nodeInfoList.push(a)-1),i.parentNode&&n++}}static _parseTemplateNestedTemplate(e,t,s){let r=this._parseTemplate(e,t);return(r.content=e.content.ownerDocument.createDocumentFragment()).appendChild(e.content),s.templateInfo=r,!0}static _parseTemplateNodeAttributes(e,t,s){let r=!1,i=Array.from(e.attributes);for(let n,a=i.length-1;n=i[a];a--)r=this._parseTemplateNodeAttribute(e,t,s,n.name,n.value)||r;return r}static _parseTemplateNodeAttribute(e,t,s,r,i){return"on-"===r.slice(0,3)?(e.removeAttribute(r),s.events=s.events||[],s.events.push({name:r.slice(3),value:i}),!0):"id"===r&&(s.id=i,!0)}static _contentForTemplate(e){let t=e._templateInfo;return t&&t.content||e.content}_stampTemplate(e){e&&!e.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(e);let t=this.constructor._parseTemplate(e),s=t.nodeInfoList,r=t.content||e.content,i=document.importNode(r,!0);i.__noInsertionPoint=!t.hasInsertionPoint;let n=i.nodeList=new Array(s.length);i.$={};for(let e,t=0,r=s.length;t<r&&(e=s[t]);t++){let s=n[t]=findTemplateNode(i,e);applyIdToMap(this,i.$,s,e),applyTemplateContent(this,s,e),applyEventListener(this,s,e)}return i=i}_addMethodEventListenerToNode(e,t,s,r){let i=createNodeEventHandler(r=r||e,t,s);return this._addEventListenerToNode(e,t,i),i}_addEventListenerToNode(e,t,s){e.addEventListener(t,s)}_removeEventListenerFromNode(e,t,s){e.removeEventListener(t,s)}}});var templateStamp={TemplateStamp:TemplateStamp};const CaseMap=caseMap$1;let dedupeId$1=0;const TYPES={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},capitalAttributeRegex=/[A-Z]/;let DataTrigger,DataEffect,PropertyEffectsType;function ensureOwnEffectMap(e,t){let s=e[t];if(s){if(!e.hasOwnProperty(t)){s=e[t]=Object.create(e[t]);for(let e in s){let t=s[e],r=s[e]=Array(t.length);for(let e=0;e<t.length;e++)r[e]=t[e]}}}else s=e[t]={};return s}function runEffects(e,t,s,r,i,n){if(t){let a=!1,o=dedupeId$1++;for(let l in s)runEffectsForProperty(e,t,o,l,s,r,i,n)&&(a=!0);return a}return!1}function runEffectsForProperty(e,t,s,r,i,n,a,o){let l=!1,p=t[a?root(r):r];if(p)for(let t,d=0,c=p.length;d<c&&(t=p[d]);d++)t.info&&t.info.lastRun===s||a&&!pathMatchesTrigger(r,t.trigger)||(t.info&&(t.info.lastRun=s),t.fn(e,r,i,n,t.info,a,o),l=!0);return l}function pathMatchesTrigger(e,t){if(t){let s=t.name;return s==e||t.structured&&isAncestor(s,e)||t.wildcard&&isDescendant(s,e)}return!0}function runObserverEffect(e,t,s,r,i){let n="string"==typeof i.method?e[i.method]:i.method,a=i.property;n?n.call(e,e.__data[a],r[a]):i.dynamicFn||console.warn("observer method `"+i.method+"` not defined")}function runNotifyEffects(e,t,s,r,i){let n,a,o=e[TYPES.NOTIFY],l=dedupeId$1++;for(let a in t)t[a]&&(o&&runEffectsForProperty(e,o,l,a,s,r,i)?n=!0:i&&notifyPath(e,a,s)&&(n=!0));n&&(a=e.__dataHost)&&a._invalidateProperties&&a._invalidateProperties()}function notifyPath(e,t,s){let r=root(t);if(r!==t){return dispatchNotifyEvent(e,camelToDashCase(r)+"-changed",s[t],t),!0}return!1}function dispatchNotifyEvent(e,t,s,r){let i={value:s,queueProperty:!0};r&&(i.path=r),e.dispatchEvent(new CustomEvent(t,{detail:i}))}function runNotifyEffect(e,t,s,r,i,n){let a=(n?root(t):t)!=t?t:null,o=a?get(e,a):e.__data[t];a&&void 0===o&&(o=s[t]),dispatchNotifyEvent(e,i.eventName,o,a)}function handleNotification(e,t,s,r,i){let n,a=e.detail,o=a&&a.path;o?(r=translate(s,r,o),n=a&&a.value):n=e.target[s],n=i?!n:n,t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][r]||!t._setPendingPropertyOrPath(r,n,!0,Boolean(o))||a&&a.queueProperty||t._invalidateProperties()}function runReflectEffect(e,t,s,r,i){let n=e.__data[t];sanitizeDOMValue&&(n=sanitizeDOMValue(n,i.attrName,"attribute",e)),e._propertyToAttribute(t,i.attrName,n)}function runComputedEffects(e,t,s,r){let i=e[TYPES.COMPUTE];if(i){let n=t;for(;runEffects(e,i,n,s,r);)Object.assign(s,e.__dataOld),Object.assign(t,e.__dataPending),n=e.__dataPending,e.__dataPending=null}}function runComputedEffect(e,t,s,r,i){let n=runMethodEffect(e,t,s,r,i),a=i.methodInfo;e.__dataHasAccessor&&e.__dataHasAccessor[a]?e._setPendingProperty(a,n,!0):e[a]=n}function computeLinkedPaths(e,t,s){let r=e.__dataLinkedPaths;if(r){let i;for(let n in r){let a=r[n];isDescendant(n,t)?(i=translate(n,a,t),e._setPendingPropertyOrPath(i,s,!0,!0)):isDescendant(a,t)&&(i=translate(a,n,t),e._setPendingPropertyOrPath(i,s,!0,!0))}}}function addBinding(e,t,s,r,i,n,a){s.bindings=s.bindings||[];let o={kind:r,target:i,parts:n,literal:a,isCompound:1!==n.length};if(s.bindings.push(o),shouldAddListener(o)){let{event:e,negate:t}=o.parts[0];o.listenerEvent=e||CaseMap.camelToDashCase(i)+"-changed",o.listenerNegate=t}let l=t.nodeInfoList.length;for(let s=0;s<o.parts.length;s++){let r=o.parts[s];r.compoundIndex=s,addEffectForBindingPart(e,t,o,r,l)}}function addEffectForBindingPart(e,t,s,r,i){if(!r.literal)if("attribute"===s.kind&&"-"===s.target[0])console.warn("Cannot set attribute "+s.target+' because "-" is not a valid attribute starting character');else{let n=r.dependencies,a={index:i,binding:s,part:r,evaluator:e};for(let s=0;s<n.length;s++){let r=n[s];"string"==typeof r&&((r=parseArg(r)).wildcard=!0),e._addTemplatePropertyEffect(t,r.rootProperty,{fn:runBindingEffect,info:a,trigger:r})}}}function runBindingEffect(e,t,s,r,i,n,a){let o=a[i.index],l=i.binding,p=i.part;if(n&&p.source&&t.length>p.source.length&&"property"==l.kind&&!l.isCompound&&o.__isPropertyEffectsClient&&o.__dataHasAccessor&&o.__dataHasAccessor[l.target]){let r=s[t];t=translate(p.source,l.target,t),o._setPendingPropertyOrPath(t,r,!1,!0)&&e._enqueueClient(o)}else{applyBindingValue(e,o,l,p,i.evaluator._evaluateBinding(e,p,t,s,r,n))}}function applyBindingValue(e,t,s,r,i){if(i=computeBindingValue(t,i,s,r),sanitizeDOMValue&&(i=sanitizeDOMValue(i,s.target,s.kind,t)),"attribute"==s.kind)e._valueToNodeAttribute(t,i,s.target);else{let r=s.target;t.__isPropertyEffectsClient&&t.__dataHasAccessor&&t.__dataHasAccessor[r]?t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][r]||t._setPendingProperty(r,i)&&e._enqueueClient(t):e._setUnmanagedPropertyToNode(t,r,i)}}function computeBindingValue(e,t,s,r){if(s.isCompound){let i=e.__dataCompoundStorage[s.target];i[r.compoundIndex]=t,t=i.join("")}return"attribute"!==s.kind&&("textContent"!==s.target&&("value"!==s.target||"input"!==e.localName&&"textarea"!==e.localName)||(t=null==t?"":t)),t}function shouldAddListener(e){return Boolean(e.target)&&"attribute"!=e.kind&&"text"!=e.kind&&!e.isCompound&&"{"===e.parts[0].mode}function setupBindings(e,t){let{nodeList:s,nodeInfoList:r}=t;if(r.length)for(let t=0;t<r.length;t++){let i=r[t],n=s[t],a=i.bindings;if(a)for(let t=0;t<a.length;t++){let s=a[t];setupCompoundStorage(n,s),addNotifyListener(n,e,s)}n.__dataHost=e}}function setupCompoundStorage(e,t){if(t.isCompound){let s=e.__dataCompoundStorage||(e.__dataCompoundStorage={}),r=t.parts,i=new Array(r.length);for(let e=0;e<r.length;e++)i[e]=r[e].literal;let n=t.target;s[n]=i,t.literal&&"property"==t.kind&&(e[n]=t.literal)}}function addNotifyListener(e,t,s){if(s.listenerEvent){let r=s.parts[0];e.addEventListener(s.listenerEvent,function(e){handleNotification(e,t,s.target,r.source,r.negate)})}}function createMethodEffect(e,t,s,r,i,n){n=t.static||n&&("object"!=typeof n||n[t.methodName]);let a={methodName:t.methodName,args:t.args,methodInfo:i,dynamicFn:n};for(let i,n=0;n<t.args.length&&(i=t.args[n]);n++)i.literal||e._addPropertyEffect(i.rootProperty,s,{fn:r,info:a,trigger:i});n&&e._addPropertyEffect(t.methodName,s,{fn:r,info:a})}function runMethodEffect(e,t,s,r,i){let n=e._methodHost||e,a=n[i.methodName];if(a){let r=marshalArgs(e.__data,i.args,t,s);return a.apply(n,r)}i.dynamicFn||console.warn("method `"+i.methodName+"` not defined")}const emptyArray=[],IDENT="(?:[a-zA-Z_$][\\w.:$\\-*]*)",NUMBER="(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",SQUOTE_STRING="(?:'(?:[^'\\\\]|\\\\.)*')",DQUOTE_STRING='(?:"(?:[^"\\\\]|\\\\.)*")',STRING="(?:"+SQUOTE_STRING+"|"+DQUOTE_STRING+")",ARGUMENT="(?:("+IDENT+"|"+NUMBER+"|"+STRING+")\\s*)",ARGUMENTS="(?:"+ARGUMENT+"(?:,\\s*"+ARGUMENT+")*)",ARGUMENT_LIST="(?:\\(\\s*(?:"+ARGUMENTS+"?)\\)\\s*)",BINDING="("+IDENT+"\\s*"+ARGUMENT_LIST+"?)",OPEN_BRACKET="(\\[\\[|{{)\\s*",CLOSE_BRACKET="(?:]]|}})",NEGATE="(?:(!)\\s*)?",EXPRESSION=OPEN_BRACKET+NEGATE+BINDING+"(?:]]|}})",bindingRegex=new RegExp(EXPRESSION,"g");function literalFromParts(e){let t="";for(let s=0;s<e.length;s++){t+=e[s].literal||""}return t}function parseMethod(e){let t=e.match(/([^\s]+?)\(([\s\S]*)\)/);if(t){let e={methodName:t[1],static:!0,args:emptyArray};if(t[2].trim()){return parseArgs(t[2].replace(/\\,/g,"&comma;").split(","),e)}return e}return null}function parseArgs(e,t){return t.args=e.map(function(e){let s=parseArg(e);return s.literal||(t.static=!1),s},this),t}function parseArg(e){let t=e.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),s={name:t,value:"",literal:!1},r=t[0];switch("-"===r&&(r=t[1]),r>="0"&&r<="9"&&(r="#"),r){case"'":case'"':s.value=t.slice(1,-1),s.literal=!0;break;case"#":s.value=Number(t),s.literal=!0}return s.literal||(s.rootProperty=root(t),s.structured=isPath(t),s.structured&&(s.wildcard=".*"==t.slice(-2),s.wildcard&&(s.name=t.slice(0,-2)))),s}function marshalArgs(e,t,s,r){let i=[];for(let n=0,a=t.length;n<a;n++){let a,o=t[n],l=o.name;if(o.literal?a=o.value:o.structured?void 0===(a=get(e,l))&&(a=r[l]):a=e[l],o.wildcard){let e=0===l.indexOf(s+"."),t=0===s.indexOf(l)&&!e;i[n]={path:t?s:l,value:t?r[s]:a,base:a}}else i[n]=a}return i}function notifySplices(e,t,s,r){let i=s+".splices";e.notifyPath(i,{indexSplices:r}),e.notifyPath(s+".length",t.length),e.__data[i]={indexSplices:null}}function notifySplice(e,t,s,r,i,n){notifySplices(e,t,s,[{index:r,addedCount:i,removed:n,object:t,type:"splice"}])}function upper(e){return e[0].toUpperCase()+e.substring(1)}const PropertyEffects=dedupingMixin(e=>{const t=TemplateStamp(PropertyAccessors(e));class s extends t{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataCounter=0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo}get PROPERTY_EFFECT_TYPES(){return TYPES}_initializeProperties(){super._initializeProperties(),hostStack.registerHost(this),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_initializeProtoProperties(e){this.__data=Object.create(e),this.__dataPending=Object.create(e),this.__dataOld={}}_initializeInstanceProperties(e){let t=this[TYPES.READ_ONLY];for(let s in e)t&&t[s]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[s]=this.__dataPending[s]=e[s])}_addPropertyEffect(e,t,s){this._createPropertyAccessor(e,t==TYPES.READ_ONLY);let r=ensureOwnEffectMap(this,t)[e];r||(r=this[t][e]=[]),r.push(s)}_removePropertyEffect(e,t,s){let r=ensureOwnEffectMap(this,t)[e],i=r.indexOf(s);i>=0&&r.splice(i,1)}_hasPropertyEffect(e,t){let s=this[t];return Boolean(s&&s[e])}_hasReadOnlyEffect(e){return this._hasPropertyEffect(e,TYPES.READ_ONLY)}_hasNotifyEffect(e){return this._hasPropertyEffect(e,TYPES.NOTIFY)}_hasReflectEffect(e){return this._hasPropertyEffect(e,TYPES.REFLECT)}_hasComputedEffect(e){return this._hasPropertyEffect(e,TYPES.COMPUTE)}_setPendingPropertyOrPath(e,t,s,r){if(r||root(Array.isArray(e)?e[0]:e)!==e){if(!r){let s=get(this,e);if(!(e=set(this,e,t))||!super._shouldPropertyChange(e,t,s))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(e,t,s))return computeLinkedPaths(this,e,t),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[e])return this._setPendingProperty(e,t,s);this[e]=t}return!1}_setUnmanagedPropertyToNode(e,t,s){s===e[t]&&"object"!=typeof s||(e[t]=s)}_setPendingProperty(e,t,s){let r=this.__dataHasPaths&&isPath(e),i=r?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(e,t,i[e])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),e in this.__dataOld||(this.__dataOld[e]=this.__data[e]),r?this.__dataTemp[e]=t:this.__data[e]=t,this.__dataPending[e]=t,(r||this[TYPES.NOTIFY]&&this[TYPES.NOTIFY][e])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[e]=s),!0)}_setProperty(e,t){this._setPendingProperty(e,t,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(e){this.__dataPendingClients=this.__dataPendingClients||[],e!==this&&this.__dataPendingClients.push(e)}_flushProperties(){this.__dataCounter++,super._flushProperties(),this.__dataCounter--}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let e=this.__dataPendingClients;if(e){this.__dataPendingClients=null;for(let t=0;t<e.length;t++){let s=e[t];s.__dataEnabled?s.__dataPending&&s._flushProperties():s._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(e,t){for(let s in e)!t&&this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][s]||this._setPendingPropertyOrPath(s,e[s],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(e,t,s){let r=this.__dataHasPaths;this.__dataHasPaths=!1,runComputedEffects(this,t,s,r);let i=this.__dataToNotify;this.__dataToNotify=null,this._propagatePropertyChanges(t,s,r),this._flushClients(),runEffects(this,this[TYPES.REFLECT],t,s,r),runEffects(this,this[TYPES.OBSERVE],t,s,r),i&&runNotifyEffects(this,i,t,s,r),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(e,t,s){this[TYPES.PROPAGATE]&&runEffects(this,this[TYPES.PROPAGATE],e,t,s);let r=this.__templateInfo;for(;r;)runEffects(this,r.propertyEffects,e,t,s,r.nodeList),r=r.nextTemplateInfo}linkPaths(e,t){e=normalize(e),t=normalize(t),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[e]=t}unlinkPaths(e){e=normalize(e),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[e]}notifySplices(e,t){let s={path:""};notifySplices(this,get(this,e,s),s.path,t)}get(e,t){return get(t||this,e)}set(e,t,s){s?set(s,e,t):this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][e]||this._setPendingPropertyOrPath(e,t,!0)&&this._invalidateProperties()}push(e,...t){let s={path:""},r=get(this,e,s),i=r.length,n=r.push(...t);return t.length&&notifySplice(this,r,s.path,i,t.length,[]),n}pop(e){let t={path:""},s=get(this,e,t),r=Boolean(s.length),i=s.pop();return r&&notifySplice(this,s,t.path,s.length,0,[i]),i}splice(e,t,s,...r){let i,n={path:""},a=get(this,e,n);return t<0?t=a.length-Math.floor(-t):t&&(t=Math.floor(t)),i=2===arguments.length?a.splice(t):a.splice(t,s,...r),(r.length||i.length)&&notifySplice(this,a,n.path,t,r.length,i),i}shift(e){let t={path:""},s=get(this,e,t),r=Boolean(s.length),i=s.shift();return r&&notifySplice(this,s,t.path,0,0,[i]),i}unshift(e,...t){let s={path:""},r=get(this,e,s),i=r.unshift(...t);return t.length&&notifySplice(this,r,s.path,0,t.length,[]),i}notifyPath(e,t){let s;if(1==arguments.length){let r={path:""};t=get(this,e,r),s=r.path}else s=Array.isArray(e)?normalize(e):e;this._setPendingPropertyOrPath(s,t,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(e,t){this._addPropertyEffect(e,TYPES.READ_ONLY),t&&(this["_set"+upper(e)]=function(t){this._setProperty(e,t)})}_createPropertyObserver(e,t,s){let r={property:e,method:t,dynamicFn:Boolean(s)};this._addPropertyEffect(e,TYPES.OBSERVE,{fn:runObserverEffect,info:r,trigger:{name:e}}),s&&this._addPropertyEffect(t,TYPES.OBSERVE,{fn:runObserverEffect,info:r,trigger:{name:t}})}_createMethodObserver(e,t){let s=parseMethod(e);if(!s)throw new Error("Malformed observer expression '"+e+"'");createMethodEffect(this,s,TYPES.OBSERVE,runMethodEffect,null,t)}_createNotifyingProperty(e){this._addPropertyEffect(e,TYPES.NOTIFY,{fn:runNotifyEffect,info:{eventName:CaseMap.camelToDashCase(e)+"-changed",property:e}})}_createReflectedProperty(e){let t=this.constructor.attributeNameForProperty(e);"-"===t[0]?console.warn("Property "+e+" cannot be reflected to attribute "+t+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(e,TYPES.REFLECT,{fn:runReflectEffect,info:{attrName:t}})}_createComputedProperty(e,t,s){let r=parseMethod(t);if(!r)throw new Error("Malformed computed expression '"+t+"'");createMethodEffect(this,r,TYPES.COMPUTE,runComputedEffect,e,s)}static addPropertyEffect(e,t,s){this.prototype._addPropertyEffect(e,t,s)}static createPropertyObserver(e,t,s){this.prototype._createPropertyObserver(e,t,s)}static createMethodObserver(e,t){this.prototype._createMethodObserver(e,t)}static createNotifyingProperty(e){this.prototype._createNotifyingProperty(e)}static createReadOnlyProperty(e,t){this.prototype._createReadOnlyProperty(e,t)}static createReflectedProperty(e){this.prototype._createReflectedProperty(e)}static createComputedProperty(e,t,s){this.prototype._createComputedProperty(e,t,s)}static bindTemplate(e){return this.prototype._bindTemplate(e)}_bindTemplate(e,t){let s=this.constructor._parseTemplate(e),r=this.__templateInfo==s;if(!r)for(let e in s.propertyEffects)this._createPropertyAccessor(e);if(t&&((s=Object.create(s)).wasPreBound=r,!r&&this.__templateInfo)){let e=this.__templateInfoLast||this.__templateInfo;return this.__templateInfoLast=e.nextTemplateInfo=s,s.previousTemplateInfo=e,s}return this.__templateInfo=s}static _addTemplatePropertyEffect(e,t,s){(e.hostProps=e.hostProps||{})[t]=!0;let r=e.propertyEffects=e.propertyEffects||{};(r[t]=r[t]||[]).push(s)}_stampTemplate(e){hostStack.beginHosting(this);let t=super._stampTemplate(e);hostStack.endHosting(this);let s=this._bindTemplate(e,!0);if(s.nodeList=t.nodeList,!s.wasPreBound){let e=s.childNodes=[];for(let s=t.firstChild;s;s=s.nextSibling)e.push(s)}return t.templateInfo=s,setupBindings(this,s),this.__dataReady&&runEffects(this,s.propertyEffects,this.__data,null,!1,s.nodeList),t}_removeBoundDom(e){let t=e.templateInfo;t.previousTemplateInfo&&(t.previousTemplateInfo.nextTemplateInfo=t.nextTemplateInfo),t.nextTemplateInfo&&(t.nextTemplateInfo.previousTemplateInfo=t.previousTemplateInfo),this.__templateInfoLast==t&&(this.__templateInfoLast=t.previousTemplateInfo),t.previousTemplateInfo=t.nextTemplateInfo=null;let s=t.childNodes;for(let e=0;e<s.length;e++){let t=s[e];t.parentNode.removeChild(t)}}static _parseTemplateNode(e,t,s){let r=super._parseTemplateNode(e,t,s);if(e.nodeType===Node.TEXT_NODE){let i=this._parseBindings(e.textContent,t);i&&(e.textContent=literalFromParts(i)||" ",addBinding(this,t,s,"text","textContent",i),r=!0)}return r}static _parseTemplateNodeAttribute(e,t,s,r,i){let n=this._parseBindings(i,t);if(n){let i=r,a="property";capitalAttributeRegex.test(r)?a="attribute":"$"==r[r.length-1]&&(r=r.slice(0,-1),a="attribute");let o=literalFromParts(n);return o&&"attribute"==a&&e.setAttribute(r,o),"input"===e.localName&&"value"===i&&e.setAttribute(i,""),e.removeAttribute(i),"property"===a&&(r=dashToCamelCase(r)),addBinding(this,t,s,a,r,n,o),!0}return super._parseTemplateNodeAttribute(e,t,s,r,i)}static _parseTemplateNestedTemplate(e,t,s){let r=super._parseTemplateNestedTemplate(e,t,s),i=s.templateInfo.hostProps;for(let e in i){addBinding(this,t,s,"property","_host_"+e,[{mode:"{",source:e,dependencies:[e]}])}return r}static _parseBindings(e,t){let s,r=[],i=0;for(;null!==(s=bindingRegex.exec(e));){s.index>i&&r.push({literal:e.slice(i,s.index)});let n=s[1][0],a=Boolean(s[2]),o=s[3].trim(),l=!1,p="",d=-1;"{"==n&&(d=o.indexOf("::"))>0&&(p=o.substring(d+2),o=o.substring(0,d),l=!0);let c=parseMethod(o),h=[];if(c){let{args:e,methodName:s}=c;for(let t=0;t<e.length;t++){let s=e[t];s.literal||h.push(s)}let r=t.dynamicFns;(r&&r[s]||c.static)&&(h.push(s),c.dynamicFn=!0)}else h.push(o);r.push({source:o,mode:n,negate:a,customEvent:l,signature:c,dependencies:h,event:p}),i=bindingRegex.lastIndex}if(i&&i<e.length){let t=e.substring(i);t&&r.push({literal:t})}return r.length?r:null}static _evaluateBinding(e,t,s,r,i,n){let a;return a=t.signature?runMethodEffect(e,s,r,i,t.signature):s!=t.source?get(e,t.source):n&&isPath(s)?get(e,s):e.__data[s],t.negate&&(a=!a),a}}return PropertyEffectsType=s,s});class HostStack{constructor(){this.stack=[]}registerHost(e){if(this.stack.length){this.stack[this.stack.length-1]._enqueueClient(e)}}beginHosting(e){this.stack.push(e)}endHosting(e){let t=this.stack.length;t&&this.stack[t-1]==e&&this.stack.pop()}}const hostStack=new HostStack;var propertyEffects={PropertyEffects:PropertyEffects};function normalizeProperties(e){const t={};for(let s in e){const r=e[s];t[s]="function"==typeof r?{type:r}:r}return t}const PropertiesMixin=dedupingMixin(e=>{const t=PropertiesChanged(e);function s(e){const t=Object.getPrototypeOf(e);return t.prototype instanceof i?t:null}function r(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",e))){let t=null;e.hasOwnProperty(JSCompiler_renameProperty("properties",e))&&e.properties&&(t=normalizeProperties(e.properties)),e.__ownProperties=t}return e.__ownProperties}class i extends t{static get observedAttributes(){const e=this._properties;return e?Object.keys(e).map(e=>this.attributeNameForProperty(e)):[]}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const e=s(this);e&&e.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const e=r(this);e&&this.createProperties(e)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const e=s(this);this.__properties=Object.assign({},e&&e._properties,r(this))}return this.__properties}static typeForProperty(e){const t=this._properties[e];return t&&t.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return i});var propertiesMixin={PropertiesMixin:PropertiesMixin};const bundledImportMeta={...import.meta,url:new URL("../node_modules/%40polymer/polymer/lib/mixins/element-mixin.js",import.meta.url).href},ElementMixin=dedupingMixin(e=>{const t=PropertiesMixin(PropertyEffects(e));return class extends t{static _finalizeClass(){super._finalizeClass(),this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&this.is&&register(this.prototype);const e=((t=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",t))||(t.__ownObservers=t.hasOwnProperty(JSCompiler_renameProperty("observers",t))?t.observers:null),t.__ownObservers);var t;e&&this.createObservers(e,this._properties);let s=this.template;s&&("string"==typeof s?(console.error("template getter must return HTMLTemplateElement"),s=null):s=s.cloneNode(!0)),this.prototype._template=s}static createProperties(e){for(let n in e)t=this.prototype,s=n,r=e[n],i=e,r.computed&&(r.readOnly=!0),r.computed&&!t._hasReadOnlyEffect(s)&&t._createComputedProperty(s,r.computed,i),r.readOnly&&!t._hasReadOnlyEffect(s)&&t._createReadOnlyProperty(s,!r.computed),r.reflectToAttribute&&!t._hasReflectEffect(s)&&t._createReflectedProperty(s),r.notify&&!t._hasNotifyEffect(s)&&t._createNotifyingProperty(s),r.observer&&t._createPropertyObserver(s,r.observer,i[r.observer]),t._addPropertyToAttributeMap(s);var t,s,r,i}static createObservers(e,t){const s=this.prototype;for(let r=0;r<e.length;r++)s._createMethodObserver(e[r],t)}static get template(){return this.hasOwnProperty(JSCompiler_renameProperty("_template",this))||(this._template=DomModule&&DomModule.import(this.is,"template")||Object.getPrototypeOf(this.prototype).constructor.template),this._template}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const e=this.importMeta;if(e)this._importPath=pathFromUrl(e.url);else{const e=DomModule&&DomModule.import(this.is);this._importPath=e&&e.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){instanceCount++,this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=rootPath,this.importPath=this.constructor.importPath;let e=function(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",e))){e.__propertyDefaults=null;let t=e._properties;for(let s in t){let r=t[s];"value"in r&&(e.__propertyDefaults=e.__propertyDefaults||{},e.__propertyDefaults[s]=r)}}return e.__propertyDefaults}(this.constructor);if(e)for(let t in e){let s=e[t];if(!this.hasOwnProperty(t)){let e="function"==typeof s.value?s.value.call(this):s.value;this._hasAccessor(t)?this._setPendingProperty(t,e,!0):this[t]=e}}}static _processStyleText(e,t){return resolveCss(e,t)}static _finalizeTemplate(e){const t=this.prototype._template;if(t&&!t.__polymerFinalized){t.__polymerFinalized=!0;const s=this.importPath;!function(e,t,s,r){const i=t.content.querySelectorAll("style"),n=stylesFromTemplate(t),a=stylesFromModuleImports(s),o=t.content.firstElementChild;for(let s=0;s<a.length;s++){let i=a[s];i.textContent=e._processStyleText(i.textContent,r),t.content.insertBefore(i,o)}let l=0;for(let t=0;t<n.length;t++){let s=n[t],a=i[l];a!==s?(s=s.cloneNode(!0),a.parentNode.insertBefore(s,a)):l++,s.textContent=e._processStyleText(s.textContent,r)}window.ShadyCSS&&window.ShadyCSS.prepareTemplate(t,s)}(this,t,e,s?resolveUrl(s):""),this.prototype._bindTemplate(t)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(e){if(this.attachShadow)return e?(this.shadowRoot||this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e),this.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(e){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,e)}resolveUrl(e,t){return!t&&this.importPath&&(t=resolveUrl(this.importPath)),resolveUrl(e,t)}static _parseTemplateContent(e,t,s){return t.dynamicFns=t.dynamicFns||this._properties,super._parseTemplateContent(e,t,s)}}});let instanceCount=0;const registrations=[];function _regLog(e){console.log("["+e.is+"]: registered")}function register(e){registrations.push(e)}function dumpRegistrations(){registrations.forEach(_regLog)}const updateStyles=function(e){window.ShadyCSS&&window.ShadyCSS.styleDocument(e)};var elementMixin={ElementMixin:ElementMixin,get instanceCount(){return instanceCount},registrations:registrations,register:register,dumpRegistrations:dumpRegistrations,updateStyles:updateStyles};class LiteralString{constructor(e){this.value=e.toString()}toString(){return this.value}}function literalValue(e){if(e instanceof LiteralString)return e.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${e}`)}function htmlValue(e){if(e instanceof HTMLTemplateElement)return e.innerHTML;if(e instanceof LiteralString)return literalValue(e);throw new Error(`non-template value passed to Polymer's html function: ${e}`)}const html=function(e,...t){const s=document.createElement("template");return s.innerHTML=t.reduce((t,s,r)=>t+htmlValue(s)+e[r+1],e[0]),s},htmlLiteral=function(e,...t){return new LiteralString(t.reduce((t,s,r)=>t+literalValue(s)+e[r+1],e[0]))};var htmlTag={html:html,htmlLiteral:htmlLiteral};const PolymerElement=ElementMixin(HTMLElement);var polymerElement={PolymerElement:PolymerElement,html:html};class Answer extends PolymerElement{static get template(){return html`
            <style>
                :host {
                    display: inline-block;
                }
                .answer-caption {
                    display: inline-block;
                    vertical-align: middle;
                }
                @media (min-width: 600px) {
                    :host {
                        width: 49%;
                    }
                    .answer-wrapper {
                        display: block;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .question-preview .answer-wrapper,
                    .q-footer {
                        padding: 0 3rem;
                    }
                    .test-btn-wrap .answer-wrapper {
                        padding: 0;
                    }
                    .answer-wrapper .question-answer {
                        display: block;
                        width: 100%;
                        min-height: 1px;
                        align-items: center;
                        position: relative;
                    }
                }
                @media (max-width: 575.98px) {
                    :host {
                        width: 100%;
                    }
                    .answer-wrapper .question-answer {
                        width: 100%;
                    }
                    .question-preview {
                        margin-top: 0;
                    }
                    .question-preview .question-question p {
                        line-height: 1.2;
                    }
                    .test-btn-wrap {
                        width: 100%;
                        margin-left: 0;
                    }
                    .test-btn button {
                        width: 80%;
                        margin: 10px 10%;
                    }
                    .question-preview {
                        padding: 1rem 1rem;
                        border-radius: 0;
                        border-left: none;
                        border-right: none;
                    }
                    .text-answer input {
                        width: 100%;
                        margin-left: 0;
                    }
                }
                .answer-wrapper {
                    justify-content: space-between;
                }
                .answer-wrapper .question-answer {
                    display: block;
                    align-items: center;
                    position: relative;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 0.25rem;
                    background-color: white;
                    padding: 0 5px;
                    margin-bottom: 5px;
                }
                .question-answer:focus,
                .question-answer:hover {
                    outline: none;
                    border-radius: 4px;
                    border: 1px solid #cce4e2;
                }
                .question-answer:before {
                    content: "";
                    display: block;
                    opacity: 0;
                    position: absolute;
                    transition-duration: 0.15s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background: #20a499;
                    border-radius: 4px;
                    transform: scale(0);
                    transition-property: transform, opacity;
                }
                .question-answer:hover:before,
                .question-answer:focus:before {
                    transform: scale(1);
                    opacity: 0.12;
                }
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .correct-ans {
                    color: green;
                    text-align: center;
                    margin-top: 25px;
                }
                .wrong-ans {
                    color: red;
                    text-align: center;
                    margin-top: 25px;
                }
                .question-answer input[type="radio"],
                .question-answer input[type="checkbox"] {
                    margin: 20px 10px;
                    position: relative;
                    display: inline-block;
                    vertical-align: middle;
                }
                .question-answer input[type="radio"],
                .question-answer input[type="checkbox"] {
                    background: #f3f3f3;
                    width: 30px;
                    height: 30px;
                    border: 2px solid #366fb5;
                    transition: all 0.3s linear;
                    cursor: pointer;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .question-answer input[type="radio"] {
                    border-radius: 50%;
                }
                .question-answer input[type="checkbox"] {
                    border-radius: 2px;
                }
                .question-answer input[type="radio"]:checked,
                .question-answer input[type="checkbox"]:checked {
                    background-color: #366fb5;
                }
                .question-answer input[type="radio"]:focus,
                .question-answer input[type="checkbox"]:focus {
                    outline: 0 none;
                    box-shadow: none;
                }
                .question-para {
                    position: relative;
                    width: 100%;
                    min-height: 42px;
                }
                .question-para {
                    padding-top: 7px;
                }
                .question-para i,
                .question-para b,
                .question-para em,
                .question-para sup,
                .question-para sub {
                    display: inline;
                }
            </style>
            <div class="answer-wrapper">
                <label
                    for="[[id]]"
                    tabIndex="-1"
                    style="cursor: pointer"
                    class$="[[config.rootClassName]]"
                >
                    <div class$="[[config.className]]">
                        <input
                            type="[[type]]"
                            name="[[id]]"
                            id="[[id]]"
                            checked="{{config.checked}}"
                            value="[[config.value]]"
                            on-change="handleChange"
                        />
                        <div class="answer-caption">
                            <div class="question-para">
                                <slot></slot>
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        `}static get observers(){return["computeConfig(value, expect, showCorrect, review)"]}static get properties(){return{id:{type:String,value:"default"},config:{type:Object,value:()=>({}),notify:!0,readOnly:!1},value:{type:Object,value:()=>({}),notify:!0,readOnly:!1},expect:{type:String,value:"",readOnly:!1},type:String,answered:{type:Boolean,value:!1,notify:!0,readOnly:!1},showCorrect:{type:Boolean,value:!1,notify:!0,readOnly:!1},review:{type:Boolean,value:!1,notify:!0,readOnly:!1}}}handleChange(e){e.stopPropagation();const t=new CustomEvent("selfstudyanswer",{bubbles:!0,composed:!0}),s=e.target[this.config.property];t.value={[this.id]:s},this.dispatchEvent(t)}computeConfig(e,t,s,r){e=e||{};const i=this.config||{},n=Object.assign({},i);switch(this.type){case"text":n.className="text-answer",n.path="value",n.value=e[this.id]||"",n.property="value",n.isCorrect=n.value===this.expect;break;case"checkbox":n.value=this.id+1,n.path=`${this.id+1}`,n.className="checkbox",n.checked=e[this.id]||!1,n.property="checked",n.isCorrect=n.checked===("true"===t),n.checked&&!n.isCorrect&&(n.wronglySelected=!0);break;case"radio":n.value=this.id+1,n.path=`${this.id+1}`,n.className="radio",n.checked=e[this.id]||!1,n.property="checked",n.isCorrect=n.checked===("true"===t),n.checked&&!n.isCorrect&&(n.wronglySelected=!0)}const a=["question-answer"];(s||r)&&n.isCorrect&&n.checked&&a.push("correct-answer"),(s||r)&&n.wronglySelected&&a.push("wrong-answer"),n.rootClassName=a.join(" "),n.rootClassName===i.rootClassName&&n.className===i.className||this.updateStyles(),this.config=n}}window.customElements.define("selfstudy-answer",Answer);class MyPolymerElement extends PolymerElement{static get template(){return html`
            <style>
                :host {
                display: block;
                }
            </style>
            <h2>Hello [[prop1]]!</h2>
            <slot></slot>
        `}static get properties(){return{prop1:{type:String,value:"polymer-element"}}}}window.customElements.define("polymer-element",MyPolymerElement);class Question extends PolymerElement{constructor(){super(),this._listener=this._selfstudyAnswer.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("selfstudyanswer",this._listener)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("selfstudyanswer",this._listener)}static get template(){return html`
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .question-para {
                    position: relative;
                    width: 100%;
                    min-height: 42px;
                }
                .question-para {
                    padding-top: 7px;
                }
                .question-para i,
                .question-para b,
                .question-para em,
                .question-para sup,
                .question-para sub {
                    display: inline;
                }
                .question-number {
                    float: left;
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    margin: 0 10px 10px 0;
                    border-radius: 50%;
                    background-color: #20a499;
                    color: white;
                    font-weight: 600;
                    text-align: center;
                    font-size: 18px;
                    display: inline-block;
                }
                .question-question {
                    width: calc(100% - 52px);
                    display: inline-block;
                    margin-bottom: 10px;
                    font-weight: normal;
                    font-size: 1.2rem;
                    min-height: 42px;
                }
                .test-btn-wrap {
                    width: 100%;
                    text-align: center;
                }
                .test-btn {
                    margin-top: 15px;
                    display: block;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .test-btn button {
                    background: #366fb5;
                    color: white;
                    width: 6.5em;
                    font-size: 100%;
                }
                .test-btn button:hover {
                    box-shadow: 0 3px 3px 1px rgba(0, 0, 0, 0.14),
                        0 3px 3px 1px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
                }
                .main-question {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
            </style>
            <div class="main-question" hidden$="{{!show}}">
                <div class="question-wrapper">
                    <div hidden$="{{!index}}" class="question-number">[[index]]</div>
                    <div class="question-question question-para">
                        <slot name="stem"></slot>
                    </div>
                </div>
                <slot name="answers"></slot>
                <div hidden$="{{!showConfidence}}">
                    <div class="test-btn-wrap">
                        <div class="test-btn">
                            <button
                                class="btn"
                                disabled$="{{hasConfidence}}"
                                name="sure"
                                on-click="_handleConfidence">
                                I am Sure
                            </button>
                            <button
                                class="btn"
                                style="opacity: 0.8;"
                                disabled$="{{hasConfidence}}"
                                name="unsure"
                                on-click="_handleConfidence">
                                I Think So
                            </button>
                            <button
                                class="btn"
                                style="opacity: 0.6;"
                                disabled$="{{hasConfidence}}"
                                name="guess"
                                on-click="_handleConfidence">
                                Best Guess
                            </button>
                        </div>
                    </div>
                </div>
                <div hidden$="{{!hasConfidence}}" class="question-wrapper">
                    <slot name="explanation"></slot>
                </div>
            </div>
        `}static get properties(){return{index:{type:String,value:""},answered:{type:String,notify:!0,readOnly:!1,value:""},confidence:{type:Boolean,notify:!0,value:!1},answer:{type:Object,notify:!0,readOnly:!1,value:()=>({})},showConfidence:{type:Boolean,value:!1,notify:!0},hasConfidence:{type:Boolean,value:!1,notify:!0},show:{type:Boolean,value:!0,nofify:!0}}}static get observers(){return["_checkConfidence(confidence, answer)"]}_checkConfidence(e,t){t=t||{},e?Object.keys(t.choice||{}).length>0?t.confidence?(this.set("hasConfidence",!0),this.set("showConfidence",!1)):(this.set("hasConfidence",!1),this.set("showConfidence",!0)):this.set("hasConfidence",!1):Object.keys(t.choice||{}).length>0?this.set("hasConfidence",!0):this.set("hasConfidence",!1)}_handleConfidence(e){const t=e.target.name,s=Object.assign({},this.answer||{});s.confidence=t,this.set("answer",s),this._checkConfidence(this.confidence,this.answer)}_selfstudyAnswer(e){e.stopPropagation();const t=Object.assign(this.answer||{});delete t.confidence;const s=Object.assign(t.choice||{},e.value);Object.keys(s).forEach(e=>{s[e]||delete s[e]}),t.choice=s,this.set("answered",Object.keys(s).join(", ")),this.set("answer",t),this._checkConfidence(this.confidence,this.answer)}}window.customElements.define("selfstudy-question",Question);export{domModule as $domModule,elementMixin as $elementMixin,propertiesChanged as $propertiesChanged,propertiesMixin as $propertiesMixin,propertyAccessors as $propertyAccessors,propertyEffects as $propertyEffects,templateStamp as $templateStamp,async as $async,caseMap$1 as $caseMap,htmlTag as $htmlTag,mixin as $mixin,path as $path,resolveUrl$1 as $resolveUrl,settings as $settings,styleGather as $styleGather,polymerElement as $polymerElement$1,DomModule,ElementMixin,instanceCount,registrations,register,dumpRegistrations,updateStyles,PropertiesChanged,PropertiesMixin,PropertyAccessors,PropertyEffects,TemplateStamp,timeOut,animationFrame,idlePeriod,microTask,dashToCamelCase,camelToDashCase,html,htmlLiteral,dedupingMixin,isPath,root,isAncestor,isDescendant,translate,matches,normalize,split,get,set,isDeep,resolveUrl,resolveCss,pathFromUrl,useShadow,useNativeCSSProperties,useNativeCustomElements,rootPath,setRootPath,sanitizeDOMValue,setSanitizeDOMValue,passiveTouchGestures,setPassiveTouchGestures,stylesFromModules,stylesFromModule,stylesFromTemplate,stylesFromModuleImports,cssFromModules,cssFromModule,cssFromTemplate,cssFromModuleImports,html as html$1,PolymerElement};
//# sourceMappingURL=index.js.map
