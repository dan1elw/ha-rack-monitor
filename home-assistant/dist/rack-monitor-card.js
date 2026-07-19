const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,_=globalThis,u=_.trustedTypes,f=u?u.emptyScript:"",m=_.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},g=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??g)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[$("elementProperties")]=new Map,b[$("finalized")]=new Map,m?.({ReactiveElement:b}),(_.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,x=t=>t,E=A.trustedTypes,w=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,P=`<${C}>`,O=document,M=()=>O.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,V=O.createTreeWalker(O,129);function Z(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(r.lastIndex=h,c=r.exec(s),null!==c);)h=r.lastIndex,r===H?"!--"===c[1]?r=R:void 0!==c[1]?r=N:void 0!==c[2]?(L.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=j):void 0!==c[3]&&(r=j):r===j?">"===c[0]?(r=n??H,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?j:'"'===c[3]?I:F):r===I||r===F?r=j:r===R||r===N?r=H:(r=j,n=void 0);const d=r===j&&t[e+1].startsWith("/>")?" ":"";o+=r===H?s+P:l>=0?(i.push(a),s.slice(0,l)+S+s.slice(l)+k+d):s+k+(-2===l?e:d)}return[Z(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=K.createElement(c,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=l[o++],s=i.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],M()),V.nextNode(),a.push({type:2,index:++n});i.append(t[e],M())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===B)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=G(t,n._$AS(t,e.values),n,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),o=0,r=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++r]}o!==a?.index&&(n=V.nextNode(),o++)}return V.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new K(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new X(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=G(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=G(this,i[s+r],e,r),a===B&&(a=this._$AH[r]),o||=!U(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class st extends Y{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??q)===B)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=A.litHtmlPolyfillSupport;nt?.(K,X),(A.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;class rt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new X(e.insertBefore(M(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}rt._$litElement$=!0,rt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:rt});const at=ot.litElementPolyfillSupport;at?.({LitElement:rt}),(ot.litElementVersions??=[]).push("4.2.2");const ct="rack-monitor-card",lt="Rack Monitor Card",ht=["zone1_entity","zone2_entity","intake_entity","fan1_entity","fan1_rpm_entity","fan2_entity","fan2_rpm_entity","mode_entity"];class dt extends rt{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){if(!t.zone1_entity||!t.zone2_entity||!t.intake_entity)throw new Error("rack-monitor-card: zone1_entity, zone2_entity and intake_entity are required");this._config=t}static getConfigElement(){return document.createElement("rack-monitor-card-editor")}static getStubConfig(t){const e=t?Object.keys(t.states):[],s=t=>e.find(e=>t.test(e))||"";return{title:"Rack Monitor",zone1_entity:s(/^sensor\..*zone_?1.*temp|^sensor\..*temp.*zone_?1/),zone2_entity:s(/^sensor\..*zone_?2.*temp|^sensor\..*temp.*zone_?2/),intake_entity:s(/^sensor\..*intake/),fan1_entity:s(/^fan\..*fan_?1/),fan1_rpm_entity:s(/^sensor\..*fan_?1.*rpm/),fan2_entity:s(/^fan\..*fan_?2/),fan2_rpm_entity:s(/^sensor\..*fan_?2.*rpm/),mode_entity:s(/^select\..*(mode|modus)/)}}getCardSize(){return 4}_stateObj(t){const e=this._config?.[t];return e?this.hass?.states[e]:void 0}_available(t){return t&&"unavailable"!==t.state&&"unknown"!==t.state}_temp(t){const e=parseFloat(t?.state);return Number.isFinite(e)?e.toFixed(1):"–"}_unit(t){return t?.attributes?.unit_of_measurement??"°C"}_rpm(t){const e=parseFloat(t?.state);return Number.isFinite(e)?Math.round(e).toString():"–"}_pwm(t){if(!this._available(t))return"–";if("off"===t.state)return"0";const e=t.attributes?.percentage;return Number.isFinite(e)?Math.round(e).toString():"–"}_online(){const t=this._stateObj("status_entity");return t?"on"===t.state:["zone1_entity","zone2_entity","intake_entity"].every(t=>this._available(this._stateObj(t)))}_lastUpdated(){let t;for(const e of ht){const s=this._stateObj(e);if(s?.last_updated){const e=new Date(s.last_updated);(!t||e>t)&&(t=e)}}return t}_setMode(t){const e=this._stateObj("mode_entity");e&&e.state!==t&&this.hass.callService("select","select_option",{entity_id:this._config.mode_entity,option:t})}_moreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_label(t,e){const s=this._config?.[`${t.replace("_entity","")}_name`];return s||e}render(){if(!this.hass||!this._config)return q;const t=this._online(),e=this._lastUpdated(),s=this._stateObj("mode_entity");return D`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title??"Rack Monitor"}</span>
          <span
            class="status ${this._config.status_entity?"clickable":""}"
            @click=${()=>this._moreInfo(this._config.status_entity)}
          >
            <span class="dot ${t?"online":"offline"}"></span>
            ${!t&&e?D`<ha-relative-time
                  .hass=${this.hass}
                  .datetime=${e}
                ></ha-relative-time>`:q}
          </span>
        </div>

        <div class="temps">
          ${this._renderTemp("zone1_entity","Zone 1")}
          ${this._renderTemp("zone2_entity","Zone 2")}
          ${this._renderTemp("intake_entity","Intake")}
        </div>

        ${this._hasFans()?D`<div class="divider"></div>`:q}
        ${this._hasFans()?D`<div class="fans">
              ${this._renderFan("fan1_entity","fan1_rpm_entity","Fan 1")}
              ${this._renderFan("fan2_entity","fan2_rpm_entity","Fan 2")}
            </div>`:q}

        ${s?this._renderModes(s,t):q}
      </ha-card>
    `}_hasFans(){return this._config.fan1_entity||this._config.fan2_entity}_renderTemp(t,e){const s=this._stateObj(t);return D`
      <div
        class="temp clickable ${this._available(s)?"":"unavailable"}"
        role="button"
        tabindex="0"
        @click=${()=>this._moreInfo(this._config[t])}
        @keydown=${e=>"Enter"===e.key&&this._moreInfo(this._config[t])}
      >
        <span class="label">${this._label(t,e)}</span>
        <span class="value">
          ${this._temp(s)}<span class="unit">${this._unit(s)}</span>
        </span>
      </div>
    `}_renderFan(t,e,s){if(!this._config[t]&&!this._config[e])return q;const i=this._stateObj(t),n=this._stateObj(e),o=this._config[e]||this._config[t];return D`
      <div
        class="fan clickable"
        role="button"
        tabindex="0"
        @click=${()=>this._moreInfo(o)}
        @keydown=${t=>"Enter"===t.key&&this._moreInfo(o)}
      >
        <span class="label">${this._label(t,s)}</span>
        <span class="fan-value">
          ${this._rpm(n)} RPM
          ${i?D`<span
                class="fan-pwm"
                @click=${e=>{e.stopPropagation(),this._moreInfo(this._config[t])}}
                >· ${this._pwm(i)} %</span
              >`:q}
        </span>
      </div>
    `}_renderModes(t,e){const s=t.attributes?.options??[];return s.length?D`
      <div class="modes ${e?"":"disabled"}">
        ${s.map(s=>D`
            <button
              class="mode ${t.state===s?"active":""}"
              .disabled=${!e}
              @click=${()=>this._setMode(s)}
            >
              ${s}
            </button>
          `)}
      </div>
    `:q}static styles=o`
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

    /* temperatures */
    .temps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .temp {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .temp.unavailable .value {
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
    .fan-pwm:hover {
      color: var(--primary-text-color);
    }

    /* fans: two tiles side by side, mirroring the temperature grid */
    .fans {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .fan {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .fan-value {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--primary-text-color);
    }
    .fan-pwm {
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color);
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
  `}customElements.define(ct,dt);const pt=[{name:"title",selector:{text:{}}},{name:"temperatures",type:"expandable",flatten:!0,expanded:!0,schema:[{name:"zone1_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"zone2_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"intake_entity",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}}]},{name:"fans",type:"expandable",flatten:!0,expanded:!0,schema:[{name:"",type:"grid",schema:[{name:"fan1_entity",selector:{entity:{domain:"fan"}}},{name:"fan1_rpm_entity",selector:{entity:{domain:"sensor"}}},{name:"fan2_entity",selector:{entity:{domain:"fan"}}},{name:"fan2_rpm_entity",selector:{entity:{domain:"sensor"}}}]}]},{name:"control",type:"expandable",flatten:!0,schema:[{name:"mode_entity",selector:{entity:{domain:"select"}}},{name:"status_entity",selector:{entity:{domain:"binary_sensor",device_class:"connectivity"}}}]}],_t={title:"Title",temperatures:"Temperatures",fans:"Fans",control:"Control & status",zone1_entity:"Zone 1 temperature",zone2_entity:"Zone 2 temperature",intake_entity:"Intake temperature",fan1_entity:"Fan 1",fan1_rpm_entity:"Fan 1 RPM sensor",fan2_entity:"Fan 2",fan2_rpm_entity:"Fan 2 RPM sensor",mode_entity:"Mode select",status_entity:"Status (connectivity)"},ut={fan1_entity:"Fan entity, used for the PWM duty (%)",fan2_entity:"Fan entity, used for the PWM duty (%)",mode_entity:"Optional. Shows the mode bar (Off / On / Auto / …)",status_entity:"Optional. Falls back to sensor availability if empty"};class ft extends rt{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){this._config=t}_computeLabel=t=>_t[t.name]??t.name;_computeHelper=t=>ut[t.name]??"";_valueChanged(t){t.stopPropagation();const e={...t.detail.value};for(const t of Object.keys(e))""!==e[t]&&void 0!==e[t]||delete e[t];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return this.hass&&this._config?D`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${pt}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:q}static styles=o`
    ha-form {
      display: block;
    }
  `}customElements.define("rack-monitor-card-editor",ft),window.customCards=window.customCards||[],window.customCards.push({type:ct,name:lt,description:"Minimalist rack temperature and fan monitoring with mode control",preview:!0,documentationURL:"https://github.com/dan1elw/ha-rack-monitor"}),console.info(`%c ${lt} %c v1.4.0 `,"background: #1e2226; color: #e8eaed; font-weight: 600; border-radius: 4px 0 0 4px; padding: 2px 6px;","background: #5b8fc7; color: #ffffff; border-radius: 0 4px 4px 0; padding: 2px 6px;");
