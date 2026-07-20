const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,_=globalThis,u=_.trustedTypes,m=u?u.emptyScript:"",f=_.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},g=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const r=this.constructor;if(!1===i&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??g)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[y("elementProperties")]=new Map,v[y("finalized")]=new Map,f?.({ReactiveElement:v}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,k=x.trustedTypes,w=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,P=`<${C}>`,M=document,O=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,T="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,F=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),q=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,V=M.createTreeWalker(M,129);function Z(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=z;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(o.lastIndex=h,c=o.exec(s),null!==c);)h=o.lastIndex,o===z?"!--"===c[1]?o=N:void 0!==c[1]?o=R:void 0!==c[2]?(L.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=F):void 0!==c[3]&&(o=F):o===F?">"===c[0]?(o=n??z,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?F:'"'===c[3]?D:j):o===D||o===j?o=F:o===N||o===R?o=z:(o=F,n=void 0);const d=o===F&&t[e+1].startsWith("/>")?" ":"";r+=o===z?s+P:l>=0?(i.push(a),s.slice(0,l)+E+s.slice(l)+S+d):s+S+(-2===l?e:d)}return[Z(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=K.createElement(c,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[r++],s=i.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),V.nextNode(),a.push({type:2,index:++n});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===q)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=U(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=G(t,n._$AS(t,e.values),n,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=V.nextNode(),r++)}return V.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new K(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new X(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=G(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=G(this,i[s+o],e,o),a===q&&(a=this._$AH[o]),r||=!U(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends Y{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??B)===q)return;const s=this._$AH,i=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==B&&(s===B||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(K,X),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class ot extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new X(e.insertBefore(O(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const ct=r`
  ha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
  }

  /* header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .dot.online {
    background: var(--success-color, #43a047);
  }
  .dot.offline {
    background: var(--error-color, #db4437);
  }

  /* tile grids */
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tile.unavailable .value {
    color: var(--secondary-text-color);
  }
  .label {
    font-size: 11px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .value {
    font-size: 26px;
    font-weight: 500;
    line-height: 1.1;
    color: var(--primary-text-color);
  }
  .value.small {
    font-size: 15px;
    line-height: 1.2;
  }
  .unit {
    font-size: 14px;
    font-weight: 400;
    color: var(--secondary-text-color);
    margin-left: 2px;
  }

  .divider {
    border-top: 1px solid var(--divider-color);
  }

  /* clickable areas: hover feedback without shifting the layout */
  .clickable {
    cursor: pointer;
    border-radius: 8px;
    margin: -6px;
    padding: 6px;
    transition: background 120ms ease;
  }
  .clickable:hover,
  .clickable:focus-visible {
    background: var(--secondary-background-color);
    outline: none;
  }
`,lt=t=>t&&"unavailable"!==t.state&&"unknown"!==t.state;function ht(t,e){e&&t.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}function dt(t,e){t.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}function pt(t){const e={...t};for(const t of Object.keys(e))""!==e[t]&&void 0!==e[t]||delete e[t];return e}const _t=["zone1_entity","zone2_entity","intake_entity","fan1_entity","fan1_rpm_entity","fan2_entity","fan2_rpm_entity","mode_entity"];class ut extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){if(!t.zone1_entity||!t.zone2_entity||!t.intake_entity)throw new Error("rack-monitor-card: zone1_entity, zone2_entity and intake_entity are required");this._config=t}static getConfigElement(){return document.createElement("rack-monitor-card-editor")}static getStubConfig(t){const e=t?Object.keys(t.states):[],s=t=>e.find(e=>t.test(e))||"";return{title:"Rack Monitor",zone1_entity:s(/^sensor\..*zone_?1.*temp|^sensor\..*temp.*zone_?1/),zone2_entity:s(/^sensor\..*zone_?2.*temp|^sensor\..*temp.*zone_?2/),intake_entity:s(/^sensor\..*intake/),fan1_entity:s(/^fan\..*fan_?1/),fan1_rpm_entity:s(/^sensor\..*fan_?1.*rpm/),fan2_entity:s(/^fan\..*fan_?2/),fan2_rpm_entity:s(/^sensor\..*fan_?2.*rpm/),mode_entity:s(/^select\..*(mode|modus)/)}}getCardSize(){return 4}_stateObj(t){const e=this._config?.[t];return e?this.hass?.states[e]:void 0}_temp(t){const e=parseFloat(t?.state);return Number.isFinite(e)?e.toFixed(1):"–"}_unit(t){return t?.attributes?.unit_of_measurement??"°C"}_rpm(t){const e=parseFloat(t?.state);return Number.isFinite(e)?Math.round(e).toString():"–"}_pwm(t){if(!lt(t))return"–";if("off"===t.state)return"0";const e=t.attributes?.percentage;return Number.isFinite(e)?Math.round(e).toString():"–"}_online(){const t=this._stateObj("status_entity");return t?"on"===t.state:["zone1_entity","zone2_entity","intake_entity"].every(t=>lt(this._stateObj(t)))}_lastUpdated(){let t;for(const e of _t){const s=this._stateObj(e);if(s?.last_updated){const e=new Date(s.last_updated);(!t||e>t)&&(t=e)}}return t}_setMode(t){const e=this._stateObj("mode_entity");e&&e.state!==t&&this.hass.callService("select","select_option",{entity_id:this._config.mode_entity,option:t})}_label(t,e){return this._config?.[`${t.replace("_entity","")}_name`]??e}render(){if(!this.hass||!this._config)return B;const t=this._online(),e=this._lastUpdated(),s=this._stateObj("mode_entity");return I`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title??"Rack Monitor"}</span>
          <span
            class="status ${this._config.status_entity?"clickable":""}"
            @click=${()=>ht(this,this._config.status_entity)}
          >
            <span class="dot ${t?"online":"offline"}"></span>
            ${!t&&e?I`<ha-relative-time
                  .hass=${this.hass}
                  .datetime=${e}
                ></ha-relative-time>`:B}
          </span>
        </div>

        <div class="grid-3">
          ${this._renderTemp("zone1_entity","Zone 1")}
          ${this._renderTemp("zone2_entity","Zone 2")}
          ${this._renderTemp("intake_entity","Intake")}
        </div>

        ${this._hasFans()?I`<div class="divider"></div>`:B}
        ${this._hasFans()?I`<div class="grid-2">
              ${this._renderFan("fan1_entity","fan1_rpm_entity","Fan 1")}
              ${this._renderFan("fan2_entity","fan2_rpm_entity","Fan 2")}
            </div>`:B}

        ${s?this._renderModes(s,t):B}
      </ha-card>
    `}_hasFans(){return this._config.fan1_entity||this._config.fan2_entity}_renderTemp(t,e){const s=this._stateObj(t);return I`
      <div
        class="tile clickable ${lt(s)?"":"unavailable"}"
        role="button"
        tabindex="0"
        @click=${()=>ht(this,this._config[t])}
        @keydown=${e=>"Enter"===e.key&&ht(this,this._config[t])}
      >
        <span class="label">${this._label(t,e)}</span>
        <span class="value">
          ${this._temp(s)}<span class="unit">${this._unit(s)}</span>
        </span>
      </div>
    `}_renderFan(t,e,s){if(!this._config[t]&&!this._config[e])return B;const i=this._stateObj(t),n=this._stateObj(e),r=this._config[e]||this._config[t];return I`
      <div
        class="tile clickable"
        role="button"
        tabindex="0"
        @click=${()=>ht(this,r)}
        @keydown=${t=>"Enter"===t.key&&ht(this,r)}
      >
        <span class="label">${this._label(t,s)}</span>
        <span class="value small">
          ${this._rpm(n)} RPM
          ${i?I`<span
                class="fan-pwm"
                @click=${e=>{e.stopPropagation(),ht(this,this._config[t])}}
                >· ${this._pwm(i)} %</span
              >`:B}
        </span>
      </div>
    `}_renderModes(t,e){const s=t.attributes?.options??[];return s.length?I`
      <div class="modes ${e?"":"disabled"}">
        ${s.map(s=>I`
            <button
              class="mode ${t.state===s?"active":""}"
              .disabled=${!e}
              @click=${()=>this._setMode(s)}
            >
              ${s}
            </button>
          `)}
      </div>
    `:B}static styles=[ct,r`
      .fan-pwm {
        font-size: 12px;
        font-weight: 400;
        color: var(--secondary-text-color);
      }
      .fan-pwm:hover {
        color: var(--primary-text-color);
      }

      /* mode segmented control */
      .modes {
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 3px;
        border-radius: 18px;
        background: var(--secondary-background-color);
      }
      .modes.disabled {
        opacity: 0.5;
      }
      .mode {
        flex: 1 1 0;
        min-width: 56px;
        padding: 6px 0;
        border: none;
        border-radius: 14px;
        background: transparent;
        font-family: inherit;
        font-size: 12px;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: background 120ms ease, color 120ms ease;
      }
      .mode:hover:not(.active):not(:disabled) {
        color: var(--primary-text-color);
      }
      .mode.active {
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-weight: 600;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      }
      .mode:disabled {
        cursor: default;
      }
    `]}customElements.define("rack-monitor-card",ut);const mt=[{name:"title",selector:{text:{}}},{name:"temperatures",type:"expandable",flatten:!0,expanded:!0,schema:[{name:"zone1_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"zone2_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"intake_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}}]},{name:"fans",type:"expandable",flatten:!0,expanded:!0,schema:[{name:"",type:"grid",schema:[{name:"fan1_entity",selector:{entity:{domain:"fan"}}},{name:"fan1_rpm_entity",selector:{entity:{domain:"sensor"}}},{name:"fan2_entity",selector:{entity:{domain:"fan"}}},{name:"fan2_rpm_entity",selector:{entity:{domain:"sensor"}}}]}]},{name:"control",type:"expandable",flatten:!0,schema:[{name:"mode_entity",selector:{entity:{domain:"select"}}},{name:"status_entity",selector:{entity:{domain:"binary_sensor",device_class:"connectivity"}}}]}],ft={title:"Title",temperatures:"Temperatures",fans:"Fans",control:"Control & status",zone1_entity:"Zone 1 temperature",zone2_entity:"Zone 2 temperature",intake_entity:"Intake temperature",fan1_entity:"Fan 1",fan1_rpm_entity:"Fan 1 RPM sensor",fan2_entity:"Fan 2",fan2_rpm_entity:"Fan 2 RPM sensor",mode_entity:"Mode select",status_entity:"Status (connectivity)"},yt={fan1_entity:"Fan entity, used for the PWM duty (%)",fan2_entity:"Fan entity, used for the PWM duty (%)",mode_entity:"Optional. Shows the mode bar (Off / On / Auto / …)",status_entity:"Optional. Falls back to sensor availability if empty"};class $t extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){this._config=t}_computeLabel=t=>ft[t.name]??t.name;_computeHelper=t=>yt[t.name]??"";_valueChanged(t){t.stopPropagation(),dt(this,pt(t.detail.value))}render(){return this.hass&&this._config?I`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${mt}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:B}static styles=r`
    ha-form {
      display: block;
    }
  `}customElements.define("rack-monitor-card-editor",$t);const gt=["cpu_entity","ram_entity","temp_entity","disk_entity","uptime_entity"],bt={warn_threshold:75,crit_threshold:90,temp_min:30,temp_max:90,temp_warn:70,temp_crit:80};class vt extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){if(!t.cpu_entity||!t.ram_entity)throw new Error("host-monitor-card: cpu_entity and ram_entity are required");this._config={...bt,...t}}static getConfigElement(){return document.createElement("host-monitor-card-editor")}static getStubConfig(t){const e=t?Object.keys(t.states):[],s=t=>e.find(e=>t.test(e))||"";return{title:"Host Monitor",cpu_entity:s(/^sensor\..*cpu.*(used|usage|load|percent)/),ram_entity:s(/^sensor\..*(memory|ram).*(used|usage|percent)/),temp_entity:s(/^sensor\..*(cpu|package|core|host).*temp/),disk_entity:s(/^sensor\..*disk.*(used|usage|percent)/),uptime_entity:s(/^sensor\..*uptime/),status_entity:s(/^binary_sensor\..*(node|host).*status/)}}getCardSize(){return 3}_stateObj(t){const e=this._config?.[t];return e?this.hass?.states[e]:void 0}_num(t,e=0){const s=parseFloat(t?.state);return Number.isFinite(s)?s.toFixed(e):"–"}_online(){const t=this._stateObj("status_entity");return t?"on"===t.state:["cpu_entity","ram_entity"].every(t=>lt(this._stateObj(t)))}_lastUpdated(){let t;for(const e of gt){const s=this._stateObj(e);if(s?.last_updated){const e=new Date(s.last_updated);(!t||e>t)&&(t=e)}}return t}_pctSeverity(t){return Number.isFinite(t)?t>=this._config.crit_threshold?"crit":t>=this._config.warn_threshold?"warn":"ok":"ok"}_tempSeverity(t){return Number.isFinite(t)?t>=this._config.temp_crit?"crit":t>=this._config.temp_warn?"warn":"ok":"ok"}_uptime(t){if(!lt(t))return"–";let e;if(/^\d+(\.\d+)?$/.test(t.state))e=parseFloat(t.state);else{const s=new Date(t.state);if(isNaN(s))return t.state;e=(Date.now()-s.getTime())/1e3}if(!Number.isFinite(e)||e<0)return"–";const s=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60);return s>0?`${s} d ${i} h`:i>0?`${i} h ${n} min`:`${n} min`}render(){if(!this.hass||!this._config)return B;const t=this._online(),e=this._lastUpdated(),s=this._config.uptime_entity||this._config.disk_entity;return I`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title??"Host Monitor"}</span>
          <span
            class="status ${this._config.status_entity?"clickable":""}"
            @click=${()=>ht(this,this._config.status_entity)}
          >
            <span class="dot ${t?"online":"offline"}"></span>
            ${!t&&e?I`<ha-relative-time
                  .hass=${this.hass}
                  .datetime=${e}
                ></ha-relative-time>`:B}
          </span>
        </div>

        <div class="grid-3">
          ${this._renderPct("cpu_entity","CPU")}
          ${this._renderPct("ram_entity","RAM")}
          ${this._renderTemp()}
        </div>

        ${s?I`<div class="divider"></div>`:B}
        ${s?I`<div class="grid-2">
              ${this._renderUptime()} ${this._renderDisk()}
            </div>`:B}
      </ha-card>
    `}_tile({key:t,label:e,valueHtml:s,bar:i}){const n=this._stateObj(t);return I`
      <div
        class="tile clickable ${lt(n)?"":"unavailable"}"
        role="button"
        tabindex="0"
        @click=${()=>ht(this,this._config[t])}
        @keydown=${e=>"Enter"===e.key&&ht(this,this._config[t])}
      >
        <span class="label">${e}</span>
        ${s}
        ${i?I`<div class="bar">
              <div
                class="bar-fill ${i.severity}"
                style="width: ${Math.max(0,Math.min(100,100*i.fraction))}%"
              ></div>
            </div>`:B}
      </div>
    `}_renderPct(t,e,s=!1){const i=this._stateObj(t),n=parseFloat(i?.state);return this._tile({key:t,label:this._config[`${t.replace("_entity","")}_name`]??e,valueHtml:I`<span class="value ${s?"small":""}">
        ${this._num(i)}<span class="unit">%</span>
      </span>`,bar:{fraction:Number.isFinite(n)?n/100:0,severity:this._pctSeverity(n)}})}_renderTemp(){if(!this._config.temp_entity)return B;const t=this._stateObj("temp_entity"),e=parseFloat(t?.state),{temp_min:s,temp_max:i}=this._config;return this._tile({key:"temp_entity",label:this._config.temp_name??"Temp",valueHtml:I`<span class="value">
        ${this._num(t,1)}<span class="unit"
          >${t?.attributes?.unit_of_measurement??"°C"}</span
        >
      </span>`,bar:{fraction:Number.isFinite(e)?(e-s)/(i-s):0,severity:this._tempSeverity(e)}})}_renderUptime(){if(!this._config.uptime_entity)return B;const t=this._stateObj("uptime_entity");return this._tile({key:"uptime_entity",label:this._config.uptime_name??"Uptime",valueHtml:I`<span class="value small">${this._uptime(t)}</span>`})}_renderDisk(){if(!this._config.disk_entity)return B;const t=this._stateObj("disk_entity"),e=parseFloat(t?.state);return this._tile({key:"disk_entity",label:this._config.disk_name??"Disk",valueHtml:I`<span class="value small">
        ${this._num(t)}<span class="unit">%</span>
      </span>`,bar:{fraction:Number.isFinite(e)?e/100:0,severity:this._pctSeverity(e)}})}static styles=[ct,r`
      .bar {
        margin-top: 4px;
        height: 3px;
        border-radius: 1.5px;
        background: var(--secondary-background-color);
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        border-radius: 1.5px;
        transition: width 300ms ease, background 300ms ease;
      }
      .bar-fill.ok {
        background: var(--primary-color);
      }
      .bar-fill.warn {
        background: var(--warning-color, #e5a33b);
      }
      .bar-fill.crit {
        background: var(--error-color, #db4437);
      }
    `]}customElements.define("host-monitor-card",vt);const xt=[{name:"title",selector:{text:{}}},{name:"metrics",type:"expandable",flatten:!0,expanded:!0,schema:[{name:"cpu_entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"ram_entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temp_entity",selector:{entity:{domain:"sensor",device_class:"temperature"}}}]},{name:"secondary",type:"expandable",flatten:!0,schema:[{name:"uptime_entity",selector:{entity:{domain:"sensor"}}},{name:"disk_entity",selector:{entity:{domain:"sensor"}}},{name:"status_entity",selector:{entity:{domain:"binary_sensor"}}}]},{name:"thresholds",type:"expandable",flatten:!0,schema:[{name:"",type:"grid",schema:[{name:"warn_threshold",selector:{number:{min:0,max:100,mode:"box",unit_of_measurement:"%"}}},{name:"crit_threshold",selector:{number:{min:0,max:100,mode:"box",unit_of_measurement:"%"}}},{name:"temp_warn",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_crit",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_min",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_max",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"°C"}}}]}]}],At={title:"Title",metrics:"Metrics",secondary:"Uptime, disk & status",thresholds:"Thresholds",cpu_entity:"CPU usage",ram_entity:"RAM usage",temp_entity:"Host temperature",uptime_entity:"Uptime",disk_entity:"Disk usage",status_entity:"Status (connectivity)",warn_threshold:"Warn at (CPU/RAM/Disk)",crit_threshold:"Critical at (CPU/RAM/Disk)",temp_warn:"Temp warn",temp_crit:"Temp critical",temp_min:"Temp bar scale min",temp_max:"Temp bar scale max"},kt={cpu_entity:"Percentage sensor, e.g. from the Proxmox integration",ram_entity:"Percentage sensor",temp_entity:"Optional, e.g. from Glances or lm-sensors",uptime_entity:"Optional. Timestamp or seconds sensor",status_entity:"Optional. Falls back to sensor availability if empty"};class wt extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){this._config=t}_computeLabel=t=>At[t.name]??t.name;_computeHelper=t=>kt[t.name]??"";_valueChanged(t){t.stopPropagation(),dt(this,pt(t.detail.value))}render(){return this.hass&&this._config?I`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${xt}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:B}static styles=r`
    ha-form {
      display: block;
    }
  `}customElements.define("host-monitor-card-editor",wt);window.customCards=window.customCards||[],window.customCards.push({type:"rack-monitor-card",name:"Rack Monitor Card",description:"Minimalist rack temperature and fan monitoring with mode control",preview:!0,documentationURL:"https://github.com/dan1elw/ha-rack-monitor"},{type:"host-monitor-card",name:"Host Monitor Card",description:"Minimalist host monitoring: CPU, RAM, temperature, uptime and disk",preview:!0,documentationURL:"https://github.com/dan1elw/ha-rack-monitor"}),console.info("%c Rack Monitor Cards %c v2.0.0 ","background: #1e2226; color: #e8eaed; font-weight: 600; border-radius: 4px 0 0 4px; padding: 2px 6px;","background: #5b8fc7; color: #ffffff; border-radius: 0 4px 4px 0; padding: 2px 6px;");
