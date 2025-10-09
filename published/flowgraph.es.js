var _t = Object.defineProperty;
var Dt = (l, t, e) => t in l ? _t(l, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[t] = e;
var g = (l, t, e) => Dt(l, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, lt = Y.ShadowRoot && (Y.ShadyCSS === void 0 || Y.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), ut = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (lt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ut.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ut.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const It = (l) => new Et(typeof l == "string" ? l : l + "", void 0, ct), b = (l, ...t) => {
  const e = l.length === 1 ? l[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + l[o + 1], l[0]);
  return new Et(e, l, ct);
}, Lt = (l, t) => {
  if (lt) l.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = Y.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, l.appendChild(s);
  }
}, pt = lt ? (l) => l : (l) => l instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return It(e);
})(l) : l;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zt, defineProperty: Rt, getOwnPropertyDescriptor: Ot, getOwnPropertyNames: qt, getOwnPropertySymbols: Ut, getPrototypeOf: Ht } = Object, k = globalThis, ft = k.trustedTypes, Bt = ft ? ft.emptyScript : "", j = k.reactiveElementPolyfillSupport, D = (l, t) => l, tt = { toAttribute(l, t) {
  switch (t) {
    case Boolean:
      l = l ? Bt : null;
      break;
    case Object:
    case Array:
      l = l == null ? l : JSON.stringify(l);
  }
  return l;
}, fromAttribute(l, t) {
  let e = l;
  switch (t) {
    case Boolean:
      e = l !== null;
      break;
    case Number:
      e = l === null ? null : Number(l);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(l);
      } catch {
        e = null;
      }
  }
  return e;
} }, kt = (l, t) => !zt(l, t), mt = { attribute: !0, type: String, converter: tt, reflect: !1, useDefault: !1, hasChanged: kt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), k.litPropertyMetadata ?? (k.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = mt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Rt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = Ot(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const r = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, r, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? mt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Ht(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, s = [...qt(e), ...Ut(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(pt(i));
    } else t !== void 0 && e.push(pt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Lt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : tt).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((o = r.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? r.converter : tt;
      this._$Em = i;
      const c = a.fromAttribute(e, r.type);
      this[i] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor, n = this[t];
      if (s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? kt)(n, e) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: r } = n, a = this[o];
        r !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[D("elementProperties")] = /* @__PURE__ */ new Map(), M[D("finalized")] = /* @__PURE__ */ new Map(), j == null || j({ ReactiveElement: M }), (k.reactiveElementVersions ?? (k.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, X = I.trustedTypes, gt = X ? X.createPolicy("lit-html", { createHTML: (l) => l }) : void 0, Ct = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + E, Ft = `<${At}>`, G = document, L = () => G.createComment(""), z = (l) => l === null || typeof l != "object" && typeof l != "function", ht = Array.isArray, Yt = (l) => ht(l) || typeof (l == null ? void 0 : l[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, _ = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, wt = /-->/g, yt = />/g, C = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, St = /"/g, $t = /^(?:script|style|textarea|title)$/i, Xt = (l) => (t, ...e) => ({ _$litType$: l, strings: t, values: e }), y = Xt(1), T = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), bt = /* @__PURE__ */ new WeakMap(), A = G.createTreeWalker(G, 129);
function Gt(l, t) {
  if (!ht(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(t) : t;
}
const Kt = (l, t) => {
  const e = l.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = _;
  for (let r = 0; r < e; r++) {
    const a = l[r];
    let c, h, d = -1, p = 0;
    for (; p < a.length && (n.lastIndex = p, h = n.exec(a), h !== null); ) p = n.lastIndex, n === _ ? h[1] === "!--" ? n = wt : h[1] !== void 0 ? n = yt : h[2] !== void 0 ? ($t.test(h[2]) && (i = RegExp("</" + h[2], "g")), n = C) : h[3] !== void 0 && (n = C) : n === C ? h[0] === ">" ? (n = i ?? _, d = -1) : h[1] === void 0 ? d = -2 : (d = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? C : h[3] === '"' ? St : vt) : n === St || n === vt ? n = C : n === wt || n === yt ? n = _ : (n = C, i = void 0);
    const f = n === C && l[r + 1].startsWith("/>") ? " " : "";
    o += n === _ ? a + Ft : d >= 0 ? (s.push(c), a.slice(0, d) + Ct + a.slice(d) + E + f) : a + E + (d === -2 ? r : f);
  }
  return [Gt(l, o + (l[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const r = t.length - 1, a = this.parts, [c, h] = Kt(t, e);
    if (this.el = R.createElement(c, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Ct)) {
          const p = h[n++], f = i.getAttribute(d).split(E), u = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: u[2], strings: f, ctor: u[1] === "." ? jt : u[1] === "?" ? Wt : u[1] === "@" ? Zt : K }), i.removeAttribute(d);
        } else d.startsWith(E) && (a.push({ type: 6, index: o }), i.removeAttribute(d));
        if ($t.test(i.tagName)) {
          const d = i.textContent.split(E), p = d.length - 1;
          if (p > 0) {
            i.textContent = X ? X.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(d[f], L()), A.nextNode(), a.push({ type: 2, index: ++o });
            i.append(d[p], L());
          }
        }
      } else if (i.nodeType === 8) if (i.data === At) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(E, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += E.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = G.createElement("template");
    return s.innerHTML = t, s;
  }
}
function P(l, t, e = l, s) {
  var n, r;
  if (t === T) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = z(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((r = i == null ? void 0 : i._$AO) == null || r.call(i, !1), o === void 0 ? i = void 0 : (i = new o(l), i._$AT(l, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = P(l, i._$AS(l, t.values), i, s)), t;
}
class Vt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? G).importNode(e, !0);
    A.currentNode = i;
    let o = A.nextNode(), n = 0, r = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new O(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new Jt(o, this, t)), this._$AV.push(c), a = s[++r];
      }
      n !== (a == null ? void 0 : a.index) && (o = A.nextNode(), n++);
    }
    return A.currentNode = G, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class O {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = P(this, t, e), z(t) ? t === w || t == null || t === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Yt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== w && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(G.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(Gt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new Vt(i, this), r = n.u(this.options);
      n.p(e), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = bt.get(t.strings);
    return e === void 0 && bt.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new O(this.O(L()), this.O(L()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = w, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = w;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = P(this, t, e, 0), n = !z(t) || t !== this._$AH && t !== T, n && (this._$AH = t);
    else {
      const r = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = P(this, r[s + a], e, a), c === T && (c = this._$AH[a]), n || (n = !z(c) || c !== this._$AH[a]), c === w ? t = w : t !== w && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class jt extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === w ? void 0 : t;
  }
}
class Wt extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== w);
  }
}
class Zt extends K {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = P(this, t, e, 0) ?? w) === T) return;
    const s = this._$AH, i = t === w && s !== w || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== w && (s === w || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Jt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const Z = I.litHtmlPolyfillSupport;
Z == null || Z(R, O), (I.litHtmlVersions ?? (I.litHtmlVersions = [])).push("3.3.1");
const Qt = (l, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new O(t.insertBefore(L(), o), o, void 0, e ?? {});
  }
  return i._$AI(l), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $ = globalThis;
class S extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Qt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return T;
  }
}
var xt;
S._$litElement$ = !0, S.finalized = !0, (xt = $.litElementHydrateSupport) == null || xt.call($, { LitElement: S });
const J = $.litElementPolyfillSupport;
J == null || J({ LitElement: S });
($.litElementVersions ?? ($.litElementVersions = [])).push("4.2.1");
class Q {
  /**
   * Creates a new Socket instance.
   * 
   * @param {Node} node - The parent node this socket belongs to
   * @param {Object} [config={}] - Configuration object for the socket
   * @param {string} config.id - Unique identifier for this socket
   * @param {string} config.type - Socket type: 'input' or 'output'
   * @param {string} [config.dataType='any'] - Data type this socket accepts/provides
   * @param {string} [config.label] - Display label for the socket
   * @param {number} [config.maxConnections] - Maximum number of connections allowed
   */
  constructor(t, e = {}) {
    this.node = t, this.nodeId = t.id, this.id = e.id, this.type = e.type, this.dataType = e.dataType || "any", this.label = e.label || this.id, this.element = null, this.connections = /* @__PURE__ */ new Set(), this.maxConnections = e.maxConnections || (this.type === "output" ? 1 / 0 : 1), this.originalColors = null;
  }
  /**
   * Check if this socket can connect to another socket.
   * Validates type compatibility, connection limits, and prevents duplicate connections.
   * 
   * @param {Socket} otherSocket - The socket to check connection compatibility with
   * @returns {boolean} True if the sockets can be connected
   * 
   * @example
   * ```javascript
   * if (inputSocket.canConnect(outputSocket)) {
   *   // Create connection
   * }
   * ```
   */
  canConnect(t) {
    if (!t || t === this || t.node === this.node || t.type === this.type || this.connections.size >= this.maxConnections || t.connections.size >= t.maxConnections) return !1;
    for (const e of this.connections)
      if (e.fromSocket === t || e.toSocket === t)
        return !1;
    return !0;
  }
  /**
   * Add an edge connection to this socket.
   * 
   * @param {Edge} edge - The edge to add to this socket's connections
   */
  addConnection(t) {
    this.connections.add(t), this.type === "input" && this.updateColorFromEdge(t);
  }
  /**
   * Remove an edge connection from this socket.
   * 
   * @param {Edge} edge - The edge to remove from this socket's connections
   */
  removeConnection(t) {
    this.connections.delete(t), this.type === "input" && this.resetToDefaultColor();
  }
  /**
   * Get the screen position of this socket.
   * Returns coordinates relative to the flow graph surface.
   * 
   * @returns {Object} Object with x and y coordinates
   * @returns {number} returns.x - X coordinate
   * @returns {number} returns.y - Y coordinate
   * 
   * @example
   * ```javascript
   * const pos = socket.getPosition();
   * console.log(`Socket at ${pos.x}, ${pos.y}`);
   * ```
   */
  getPosition() {
    if (!this.element) return { x: 0, y: 0 };
    const t = this.element.getBoundingClientRect(), e = this.node.flowGraph.surface.getBoundingClientRect();
    let s = t.width / 2;
    this.type === "output" ? s = t.width / 2 : this.type === "input" && (s = -t.width / 2);
    const i = (t.left + t.width / 2 + s - e.left - this.node.flowGraph.viewport.x) / this.node.flowGraph.viewport.scale, o = (t.top + t.height / 2 - e.top - this.node.flowGraph.viewport.y) / this.node.flowGraph.viewport.scale;
    return { x: i, y: o };
  }
  setupContextMenu() {
    this.element && this.element.addEventListener("contextmenu", (t) => {
      t.preventDefault(), t.stopPropagation(), this.connections.size !== 0 && this.showContextMenu(t.clientX, t.clientY);
    });
  }
  showContextMenu(t, e) {
    this.hideContextMenu();
    const s = document.createElement("div");
    if (s.className = "socket-context-menu", s.style.cssText = `
      position: fixed;
      left: ${t}px;
      top: ${e}px;
      background: var(--fg-panel);
      border: 1px solid var(--fg-muted);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      min-width: 120px;
      padding: 4px 0;
    `, this.connections.forEach((o) => {
      var c, h, d;
      const n = document.createElement("div");
      n.className = "context-menu-item", n.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-text);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      const r = ((c = o.fromSocket) == null ? void 0 : c.node) === this.node ? (h = o.toSocket) == null ? void 0 : h.node : (d = o.fromSocket) == null ? void 0 : d.node, a = (r == null ? void 0 : r.label) || (r == null ? void 0 : r.type) || "node";
      n.innerHTML = `
        <span style="color: var(--fg-error);">🗑️</span>
        <span>Delete connection to ${a}</span>
      `, n.addEventListener("click", () => {
        this.node.flowGraph.removeEdge(o.id), this.hideContextMenu();
      }), n.addEventListener("mouseenter", () => {
        n.style.background = "var(--fg-accent)", n.style.color = "white";
      }), n.addEventListener("mouseleave", () => {
        n.style.background = "transparent", n.style.color = "var(--fg-text)";
      }), s.appendChild(n);
    }), this.connections.size > 1) {
      const o = document.createElement("div");
      o.style.cssText = `
        height: 1px;
        background: var(--fg-muted);
        margin: 4px 0;
      `, s.appendChild(o);
      const n = document.createElement("div");
      n.className = "context-menu-item", n.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-error);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
      `, n.innerHTML = `
        <span>🗑️</span>
        <span>Delete all connections</span>
      `, n.addEventListener("click", () => {
        Array.from(this.connections).forEach((a) => {
          this.node.flowGraph.removeEdge(a.id);
        }), this.hideContextMenu();
      }), n.addEventListener("mouseenter", () => {
        n.style.background = "var(--fg-error)", n.style.color = "white";
      }), n.addEventListener("mouseleave", () => {
        n.style.background = "transparent", n.style.color = "var(--fg-error)";
      }), s.appendChild(n);
    }
    document.body.appendChild(s), this.contextMenu = s;
    const i = (o) => {
      s.contains(o.target) || (this.hideContextMenu(), document.removeEventListener("click", i));
    };
    setTimeout(() => {
      document.addEventListener("click", i);
    }, 0);
  }
  hideContextMenu() {
    this.contextMenu && (this.contextMenu.remove(), this.contextMenu = null);
  }
  /**
   * Store the original colors of the socket before any modifications.
   * 
   * @private
   */
  storeOriginalColors() {
    if (!this.element || this.originalColors) return;
    let t = this.element.querySelector(".socket");
    t || (t = this.element.querySelector("span")), t && (this.originalColors = {
      borderColor: t.style.borderColor || getComputedStyle(t).borderColor,
      background: t.style.background || getComputedStyle(t).background
    });
  }
  /**
   * Update the socket color to match the connected edge.
   * 
   * @param {Edge} edge - The edge to get the color from
   * @private
   */
  updateColorFromEdge(t) {
    if (!this.element) return;
    const e = t.color;
    if (!e) return;
    this.storeOriginalColors();
    let s = this.element.querySelector(".socket");
    s || (s = this.element.querySelector("span")), s && (s.style.borderColor = e, s.style.background = e);
  }
  /**
   * Reset the socket to its original color.
   * 
   * @private
   */
  resetToDefaultColor() {
    if (!this.element) return;
    let t = this.element.querySelector(".socket");
    if (t || (t = this.element.querySelector("span")), !!t) {
      if (this.originalColors)
        t.style.borderColor = this.originalColors.borderColor, t.style.background = this.originalColors.background;
      else {
        const e = "#10b981";
        t.style.borderColor = e, t.style.background = e;
      }
      this.node.flowGraph.connections.connectionState.active && this.node.flowGraph.connections.connectionState.fromSocket === this && this.node.flowGraph.connections.updateTempPathColor(this);
    }
  }
  /**
   * Convert a color to rgba format with specified alpha.
   * 
   * @param {string} color - The color to convert
   * @param {number} alpha - The alpha value (0-1)
   * @returns {string} The rgba color string
   * @private
   */
  colorToRgba(t, e) {
    if (t.startsWith("#")) {
      const s = t.slice(1), i = parseInt(s.slice(0, 2), 16), o = parseInt(s.slice(2, 4), 16), n = parseInt(s.slice(4, 6), 16);
      return `rgba(${i}, ${o}, ${n}, ${e})`;
    }
    if (t.startsWith("rgb")) {
      const s = t.match(/\d+/g);
      if (s && s.length >= 3)
        return `rgba(${s[0]}, ${s[1]}, ${s[2]}, ${e})`;
    }
    return `rgba(16, 185, 129, ${e})`;
  }
  destroy() {
    this.hideContextMenu(), this.element && this.element.removeEventListener("contextmenu", this.showContextMenu);
  }
}
class te {
  /**
   * Creates a new Node instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   * @param {Object} [config={}] - Configuration object for the node
   * @param {string} [config.id] - Custom ID for the node (auto-generated if not provided)
   * @param {string} config.type - The node type identifier
   * @param {string} [config.label] - Display label for the node
   * @param {number} [config.x=0] - X position of the node
   * @param {number} [config.y=0] - Y position of the node
   * @param {number} [config.width=160] - Width of the node
   * @param {number} [config.height=100] - Height of the node
   * @param {boolean} [config.selected=false] - Whether the node is initially selected
   * @param {Object} config.template - Node template defining sockets and HTML
   * @param {Object} [config.initialData] - Initial data values for data-bound elements
   */
  constructor(t, e = {}) {
    this.flowGraph = t, this.id = e.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, this.type = e.type, this.label = e.label || e.type, this.x = e.x || 0, this.y = e.y || 0, this.width = e.width || 160, this.height = e.height || 100, this.selected = e.selected || !1, this.template = e.template, this.inputs = /* @__PURE__ */ new Map(), this.outputs = /* @__PURE__ */ new Map(), this.element = null, this.dataKeyMap = /* @__PURE__ */ new Map(), this.init(), e.initialData && this.setDataObject(e.initialData);
  }
  /**
   * Initialize the node after construction.
   * Creates DOM elements, sockets, and sets up event handlers.
   * 
   * @private
   */
  init() {
    this.createElement(), this.createSockets(), this.setupDragging(), this.createDataKeyMap();
  }
  /**
   * Create the DOM element for this node.
   * Applies styling, template HTML, and adds it to the flow graph.
   * 
   * @private
   */
  createElement() {
    this.element = document.createElement("div");
    const t = ["node", `type-${this.type}`];
    this.template && this.template.customClass ? t.push(this.template.customClass) : this.template && this.template.html && this.template.html.includes("<node-body class=") || t.push("node-default"), this.element.className = t.join(" "), this.element.style.left = this.x + "px", this.element.style.top = this.y + "px", this.element.dataset.id = this.id, this.template && this.template.category && (this.element.dataset.category = this.template.category.toLowerCase()), this.template && this.template.colorPatch && (this.element.dataset.colorPatch = "true", this.template.colorPatch.background && this.element.style.setProperty("--node-color-bg", this.template.colorPatch.background), this.template.colorPatch.color && this.element.style.setProperty("--node-color-text", this.template.colorPatch.color)), this.selected && this.element.classList.add("selected"), this.template && this.template.html ? this.element.innerHTML = this.template.html : console.warn(`No HTML template found for node ${this.id}`), this.flowGraph.nodesRoot.appendChild(this.element);
  }
  /**
   * Create a mapping of data keys to DOM elements for data binding.
   * Scans the node's HTML for elements with data-key attributes.
   * OPTIMIZED: Cache query results and use WeakMap for automatic cleanup.
   * 
   * @private
   */
  createDataKeyMap() {
    this.element.querySelectorAll("[data-key]").forEach((e) => {
      const s = e.getAttribute("data-key"), i = this.parseDataKey(s);
      this.dataKeyMap.set(
        i.key,
        {
          el: e,
          property: i.property
        }
      );
    });
  }
  /**
   * Disable all form controls in the node for readonly mode.
   * OPTIMIZED: Batch DOM updates for better performance.
   * 
   * @private
   */
  disableFormControls() {
    const t = [];
    this.dataKeyMap.forEach(({ el: e }) => {
      t.push(() => {
        "disabled" in e && (e.disabled = !0), e.style.opacity = "0.6", e.style.cursor = "not-allowed";
      });
    }), this.flowGraph && this.flowGraph.domBatcher ? this.flowGraph.domBatcher.schedule("update", () => {
      t.forEach((e) => e());
    }) : t.forEach((e) => e());
  }
  /**
   * Enable all form controls in the node for edit mode.
   * OPTIMIZED: Batch DOM updates for better performance.
   * 
   * @private
   */
  enableFormControls() {
    const t = [];
    this.dataKeyMap.forEach(({ el: e }) => {
      t.push(() => {
        "disabled" in e && (e.disabled = !1), e.style.opacity = "1", e.style.cursor = "";
      });
    }), this.flowGraph && this.flowGraph.domBatcher ? this.flowGraph.domBatcher.schedule("update", () => {
      t.forEach((e) => e());
    }) : t.forEach((e) => e());
  }
  /**
   * Create input and output sockets based on the node template.
   * Sockets are created and linked to their corresponding DOM elements.
   * 
   * @private
   */
  createSockets() {
    this.template && (this.template.inputs.forEach((t) => {
      const e = new Q(this, {
        id: t.id,
        type: "input",
        dataType: t.type,
        label: t.label
      });
      this.inputs.set(t.id, e);
    }), this.template.outputs.forEach((t) => {
      const e = new Q(this, {
        id: t.id,
        type: "output",
        dataType: t.type,
        label: t.label
      });
      this.outputs.set(t.id, e);
    }), requestAnimationFrame(() => {
      this.linkSocketElements();
    }));
  }
  linkSocketElements() {
    this.inputs.forEach((t) => {
      var s;
      const e = this.element.querySelector(`flow-socket[name="${t.id}"]`);
      if (e) {
        const i = e.getAttribute("max-connection");
        if (i !== null) {
          const n = parseInt(i, 10);
          !isNaN(n) && n > 0 && (t.maxConnections = n);
        }
        let o = (s = e.shadowRoot) == null ? void 0 : s.querySelector("flow-socket-anchor");
        o || (o = e.querySelector("flow-socket-anchor")), o ? (t.element = o, o._socket = t, t.setupContextMenu(), this.flowGraph && this.flowGraph.connections && this.flowGraph.connections.registerSocket(t)) : console.warn(`Socket element not found for socket ${t.id} - flow-socket found but no flow-socket-anchor`);
      } else
        console.warn(`Flow-socket not found for socket ${t.id}`);
    }), this.outputs.forEach((t) => {
      var s;
      const e = this.element.querySelector(`flow-socket[name="${t.id}"]`);
      if (e) {
        const i = e.getAttribute("max-connection");
        if (i !== null) {
          const n = parseInt(i, 10);
          !isNaN(n) && n > 0 && (t.maxConnections = n);
        }
        let o = (s = e.shadowRoot) == null ? void 0 : s.querySelector("flow-socket-anchor");
        o || (o = e.querySelector("flow-socket-anchor")), o ? (t.element = o, o._socket = t, t.setupContextMenu(), this.flowGraph && this.flowGraph.connections && this.flowGraph.connections.registerSocket(t)) : console.warn(`Socket element not found for socket ${t.id} - flow-socket found but no flow-socket-anchor`);
      } else
        console.warn(`Flow-socket not found for socket ${t.id}`);
    });
  }
  /**
   * Add a new socket to the node dynamically.
   * 
   * @param {Object} socketConfig - Configuration for the new socket
   * @param {string} socketConfig.id - Unique identifier for the socket
   * @param {string} socketConfig.type - Socket type: 'input' or 'output'
   * @param {string} [socketConfig.dataType='any'] - Data type this socket accepts/provides
   * @param {string} [socketConfig.label] - Display label for the socket
   * @param {number} [socketConfig.maxConnections] - Maximum number of connections allowed
   * @param {string} [socketConfig.color] - Socket color
   * @param {string} [socketConfig.size] - Socket size
   * @returns {Socket} The created socket instance
   * @throws {Error} If socket ID already exists
   * 
   * @example
   * ```javascript
   * const newSocket = node.addSocket({
   *   id: 'newOutput',
   *   type: 'output',
   *   dataType: 'number',
   *   label: 'New Output'
   * });
   * ```
   */
  addSocket(t) {
    const { id: e, type: s, dataType: i = "any", label: o, maxConnections: n, color: r, size: a } = t;
    if (this.inputs.has(e) || this.outputs.has(e))
      throw new Error(`Socket with ID '${e}' already exists`);
    const c = new Q(this, {
      id: e,
      type: s,
      dataType: i,
      label: o || e,
      maxConnections: n
    });
    if (s === "input")
      this.inputs.set(e, c);
    else if (s === "output")
      this.outputs.set(e, c);
    else
      throw new Error(`Invalid socket type: ${s}. Must be 'input' or 'output'`);
    return this.createSocketElement(c, { color: r, size: a }), this.updateNodeHeight(), this.flowGraph.container.dispatchEvent(
      new CustomEvent("socket:add", {
        detail: { node: this, socket: c }
      })
    ), c;
  }
  /**
   * Add a new input socket to the node dynamically.
   * 
   * @param {string} id - Unique identifier for the socket
   * @param {Object} [config={}] - Additional socket configuration
   * @param {string} [config.dataType='any'] - Data type this socket accepts
   * @param {string} [config.label] - Display label for the socket
   * @param {number} [config.maxConnections] - Maximum number of connections allowed
   * @param {string} [config.color] - Socket color
   * @param {string} [config.size] - Socket size
   * @returns {Socket} The created input socket instance
   * 
   * @example
   * ```javascript
   * const inputSocket = node.addInputSocket('newInput', {
   *   dataType: 'string',
   *   label: 'Text Input'
   * });
   * ```
   */
  addInputSocket(t, e = {}) {
    return this.addSocket({
      id: t,
      type: "input",
      ...e
    });
  }
  /**
   * Add a new output socket to the node dynamically.
   * 
   * @param {string} id - Unique identifier for the socket
   * @param {Object} [config={}] - Additional socket configuration
   * @param {string} [config.dataType='any'] - Data type this socket provides
   * @param {string} [config.label] - Display label for the socket
   * @param {number} [config.maxConnections] - Maximum number of connections allowed
   * @param {string} [config.color] - Socket color
   * @param {string} [config.size] - Socket size
   * @returns {Socket} The created output socket instance
   * 
   * @example
   * ```javascript
   * const outputSocket = node.addOutputSocket('newOutput', {
   *   dataType: 'number',
   *   label: 'Result'
   * });
   * ```
   */
  addOutputSocket(t, e = {}) {
    return this.addSocket({
      id: t,
      type: "output",
      ...e
    });
  }
  /**
   * Remove a socket from the node dynamically.
   * 
   * @param {string} socketId - The ID of the socket to remove
   * @param {string} [type] - Socket type ('input' or 'output'). If not provided, will search both
   * @returns {boolean} True if the socket was found and removed, false otherwise
   * 
   * @example
   * ```javascript
   * const removed = node.removeSocket('oldOutput');
   * ```
   */
  removeSocket(t, e = null) {
    let s = null, i = null;
    return (e === "input" || e === null) && (s = this.inputs.get(t), s && (i = "input")), !s && (e === "output" || e === null) && (s = this.outputs.get(t), s && (i = "output")), s ? (Array.from(s.connections).forEach((n) => {
      this.flowGraph.removeEdge(n.id);
    }), this.flowGraph && this.flowGraph.connections && this.flowGraph.connections.unregisterSocket(s), this.removeSocketElement(s), i === "input" ? this.inputs.delete(t) : this.outputs.delete(t), this.updateNodeHeight(), this.flowGraph.container.dispatchEvent(
      new CustomEvent("socket:remove", {
        detail: { node: this, socketId: t, socketType: i }
      })
    ), !0) : !1;
  }
  /**
   * Create DOM element for a socket dynamically.
   * 
   * @param {Socket} socket - The socket instance
   * @param {Object} [options={}] - Additional options
   * @param {string} [options.color] - Socket color
   * @param {string} [options.size] - Socket size
   * @private
   */
  createSocketElement(t, e = {}) {
    var a;
    const { color: s, size: i } = e, o = document.createElement("flow-socket");
    o.setAttribute("type", t.type), o.setAttribute("name", t.id), o.setAttribute("label", t.label), o.setAttribute("data-type", t.dataType), t.maxConnections !== void 0 && o.setAttribute("max-connection", t.maxConnections.toString()), s && o.setAttribute("color", s), i && o.setAttribute("size", i);
    const n = this.element.querySelector(".body");
    if (!n) {
      console.warn("Could not find .body element to insert socket");
      return;
    }
    const r = (a = n.querySelector(".socket-control-btn")) == null ? void 0 : a.parentElement;
    t.type === "input" && r ? n.insertBefore(o, r) : n.appendChild(o), requestAnimationFrame(() => {
      this.linkSingleSocketElement(t, o);
    });
  }
  /**
   * Link a single socket element to its DOM representation.
   * 
   * @param {Socket} socket - The socket instance
   * @param {HTMLElement} flowSocket - The flow-socket DOM element
   * @private
   */
  linkSingleSocketElement(t, e) {
    var o;
    const s = e.getAttribute("max-connection");
    if (s !== null) {
      const n = parseInt(s, 10);
      !isNaN(n) && n > 0 && (t.maxConnections = n);
    }
    let i = (o = e.shadowRoot) == null ? void 0 : o.querySelector("flow-socket-anchor");
    i || (i = e.querySelector("flow-socket-anchor")), i ? (t.element = i, i._socket = t, t.setupContextMenu(), this.flowGraph && this.flowGraph.connections && this.flowGraph.connections.registerSocket(t)) : console.warn(`Socket element not found for socket ${t.id}`);
  }
  /**
   * Remove socket element from DOM.
   * 
   * @param {Socket} socket - The socket instance
   * @private
   */
  removeSocketElement(t) {
    const e = this.element.querySelector(`flow-socket[name="${t.id}"]`);
    e && e.remove();
  }
  /**
   * Update node height based on the number of sockets.
   * 
   * @private
   */
  updateNodeHeight() {
    const t = this.inputs.size + this.outputs.size, n = Math.max(80, Math.min(800, 100 + t * 28));
    Math.abs(n - this.height) > 5 && (this.height = n, this.element && (this.element.style.height = `${this.height}px`));
  }
  /**
   * Check if an element is interactive and should not trigger node dragging
   */
  isInteractiveElement(t) {
    if (t.dataset.draggable === "false") return !0;
    if (t.dataset.draggable === "true") return !1;
    if (t.classList.contains("socket") || t.closest("flow-socket-anchor") || t.tagName === "FLOW-SOCKET-ANCHOR") return !0;
    const e = t.closest("flow-socket");
    if (e && e !== t) {
      const s = e.shadowRoot;
      if (s && s.contains(t)) {
        const i = s.querySelector("flow-socket-anchor");
        if (i && (i.contains(t) || t === i) || t.classList.contains("socket"))
          return !0;
      }
    }
    return !!(t.tagName === "FLOW-SOCKET" || t.matches("input, textarea, select, button, a[href]") || t.isContentEditable);
  }
  setupDragging() {
    let t = !1, e = 0, s = null, i = {
      timer: null,
      startTime: 0,
      threshold: 500,
      // 500ms for long press
      moved: !1
    };
    const o = (u) => {
      if (this.isInteractiveElement(u.target)) return;
      if (u.pointerType === "touch") {
        e = Date.now();
        return;
      }
      const m = u.ctrlKey || u.metaKey;
      this.flowGraph.selectNode(this.id, m), this.flowGraph.selection.has(this.id) && (t = !0, this.element.classList.add("dragging"), this.flowGraph.startMultiDrag(u, this), this.flowGraph.container.addEventListener("mousemove", n), this.flowGraph.container.addEventListener("mouseup", r), u.preventDefault(), u.stopPropagation());
    }, n = (u) => {
      if (u.pointerType === "touch" && !t) {
        Date.now() - e > 50 && (this.flowGraph.selectNode(this.id, !1), this.flowGraph.selection.has(this.id) && (t = !0, this.element.classList.add("dragging"), this.flowGraph.startMultiDrag(u, this), this.flowGraph.container.addEventListener("mousemove", n), this.flowGraph.container.addEventListener("mouseup", r)));
        return;
      }
      t && (this.flowGraph.updateMultiDrag(u), u.preventDefault());
    }, r = (u) => {
      t && (t = !1, this.element.classList.remove("dragging"), this.flowGraph.container.removeEventListener("mousemove", n), this.flowGraph.container.removeEventListener("mouseup", r), this.flowGraph.endMultiDrag());
    }, a = (u, m, v) => {
      c(), i.target = u, i.startTime = Date.now(), i.moved = !1, i.timer = setTimeout(() => {
        i.moved || h(u, m, v);
      }, i.threshold);
    }, c = () => {
      i.timer && (clearTimeout(i.timer), i.timer = null), i.moved = !1;
    }, h = (u, m, v) => {
      this.element.classList.add("long-press-active");
      const N = this.flowGraph.container.querySelector("flow-graph");
      N && N.showNodeContextMenu(m, v, [
        {
          label: "Delete Node",
          icon: "🗑️",
          action: () => this.flowGraph.removeNode(this.id)
        }
      ]), setTimeout(() => {
        this.element.classList.remove("long-press-active");
      }, 500);
    }, d = (u) => {
      if (this.isInteractiveElement(u.target)) return;
      e = Date.now(), s = u.target;
      const m = u.touches[0];
      a(u.target, m.clientX, m.clientY);
    }, p = (u) => {
      if (i.target && (i.moved = !0, c()), !t) {
        if (this.flowGraph.connections.socketInteractionActive || s && this.isInteractiveElement(s))
          return;
        Date.now() - e > 50 && (this.flowGraph.selectNode(this.id, !1), this.flowGraph.selection.has(this.id) && (t = !0, this.element.classList.add("dragging"), this.flowGraph.startMultiDrag(u.touches[0], this), u.preventDefault()));
        return;
      }
      this.flowGraph.updateMultiDrag(u.touches[0]), u.preventDefault();
    }, f = (u) => {
      if (c(), !t) {
        s = null;
        return;
      }
      t = !1, this.element.classList.remove("dragging"), s = null, this.flowGraph.endMultiDrag();
    };
    this.eventHandlers = {
      mousedown: o,
      // Note: mousemove and mouseup are now attached to document dynamically during drag
      touchstart: d,
      touchmove: p,
      touchend: f,
      dblclick: (u) => {
        u.preventDefault(), u.stopPropagation(), this.execute();
      }
    }, this.containerMoveHandler = n, this.containerUpHandler = r, this.element.addEventListener("mousedown", this.eventHandlers.mousedown, { passive: !1 }), this.element.addEventListener("touchstart", this.eventHandlers.touchstart, { passive: !0 }), this.element.addEventListener("touchmove", this.eventHandlers.touchmove, { passive: !1 }), this.element.addEventListener("touchend", this.eventHandlers.touchend, { passive: !0 }), this.element.addEventListener("dblclick", this.eventHandlers.dblclick, { passive: !1 });
  }
  setPosition(t, e) {
    const s = { x: this.x, y: this.y };
    this.x = t, this.y = e, this.flowGraph && this.flowGraph.scheduleAnimationUpdate ? this.flowGraph.scheduleAnimationUpdate(this.element, {
      left: t + "px",
      top: e + "px"
    }) : (this.element.style.left = t + "px", this.element.style.top = e + "px"), this.flowGraph && this.flowGraph.connections && this.flowGraph.connections.updateNodeSocketsInGrid(this), this.flowGraph.container.dispatchEvent(new CustomEvent("node:move", {
      detail: {
        nodeId: this.id,
        node: this,
        oldPosition: s,
        newPosition: { x: t, y: e }
      }
    }));
  }
  getSocket(t) {
    return this.inputs.get(t) || this.outputs.get(t);
  }
  getAllSockets() {
    return [...this.inputs.values(), ...this.outputs.values()];
  }
  setSelected(t) {
    this.selected = t, this.flowGraph && this.flowGraph.domBatcher ? this.flowGraph.domBatcher.schedule("update", () => {
      t ? this.element.classList.add("selected") : this.element.classList.remove("selected");
    }) : t ? this.element.classList.add("selected") : this.element.classList.remove("selected");
  }
  /**
   * Execute the node's logic by calling its onExecute function.
   * The function is looked up in the global scope and called with a context object.
   * 
   * @async
   * @returns {Promise<any>} The result of the execution function
   * 
   * @example
   * ```javascript
   * // Define a global execution function
   * window.executeMathAdd = async (context) => {
   *   const a = context.getInput(0) || 0;
   *   const b = context.getInput(1) || 0;
   *   const result = a + b;
   *   context.setOutput(0, result);
   *   return result;
   * };
   * 
   * // Execute the node
   * await node.execute();
   * ```
   */
  async execute() {
    if (!this.template || !this.template.onExecute) {
      console.warn(`Node ${this.id} has no onExecute method defined`);
      return;
    }
    const t = window[this.template.onExecute];
    if (typeof t != "function") {
      console.error(`onExecute method '${this.template.onExecute}' not found for node ${this.id}`);
      return;
    }
    const e = {
      nodeId: this.id,
      nodeType: this.type,
      element: this.element,
      inputs: this.inputs,
      outputs: this.outputs,
      setOutput: (s, i) => this.setOutputValue(s, i),
      getInput: (s) => this.getInputValue(s),
      getData: (s) => this.getData(s),
      setData: (s, i) => this.setData(s, i)
    };
    try {
      const s = await t(e);
      this.flowGraph.container.dispatchEvent(new CustomEvent("node:execute", {
        detail: {
          nodeId: this.id,
          node: this,
          result: s,
          context: e
        }
      }));
    } catch (s) {
      console.error(`Error executing node ${this.id}:`, s), this.flowGraph.container.dispatchEvent(new CustomEvent("node:execute:error", {
        detail: {
          nodeId: this.id,
          node: this,
          error: s.message
        }
      }));
    }
  }
  /**
   * Set the value of an output socket by index.
   * Also propagates the value to connected input sockets.
   * 
   * @param {number} index - The index of the output socket
   * @param {any} value - The value to set
   * 
   * @example
   * ```javascript
   * node.setOutputValue(0, 42); // Set first output to 42
   * ```
   */
  setOutputValue(t, e) {
    const i = Array.from(this.outputs.values())[t];
    i ? (i.value = e, this.flowGraph.activateOutputSocket(this.id, t), i.connections.forEach((o) => {
      o.toSocket && (o.toSocket.value = e);
    })) : console.warn(`Output socket [${t}] not found for node ${this.id}`);
  }
  /**
   * Get the value of an input socket by index.
   * 
   * @param {number} index - The index of the input socket
   * @returns {any} The value of the input socket, or undefined if not found
   * 
   * @example
   * ```javascript
   * const value = node.getInputValue(0); // Get first input value
   * ```
   */
  getInputValue(t) {
    const s = Array.from(this.inputs.values())[t];
    return s == null ? void 0 : s.value;
  }
  // Data binding methods for DOM elements with data-key attributes
  /**
   * Parse a data key string to extract key and property.
   * Format: "key" or "key:property"
   * 
   * @param {string} dataKey - The data key string to parse
   * @returns {Object} Object with key and property
   * @returns {string} returns.key - The data key
   * @returns {string} returns.property - The property name (defaults to 'value')
   * 
   * @private
   */
  parseDataKey(t) {
    const e = t.split(":");
    return {
      key: e[0],
      property: e[1] || "value"
    };
  }
  /**
   * Get data from a DOM element by its data-key attribute.
   * 
   * @param {string} key - The data key to retrieve
   * @returns {any} The value from the DOM element, or undefined if not found
   * 
   * @example
   * ```javascript
   * const value = node.getData('myInput'); // Get value from element with data-key="myInput"
   * ```
   */
  getData(t) {
    const e = this.dataKeyMap.get(t).el;
    if (!e) return;
    const { property: s } = this.parseDataKey(t);
    return e[s];
  }
  /**
   * Set data on a DOM element by its data-key attribute.
   * 
   * @param {string} key - The data key to set
   * @param {any} value - The value to set
   * @returns {boolean} True if the element was found and updated, false otherwise
   * 
   * @example
   * ```javascript
   * node.setData('myInput', 'Hello World'); // Set value on element with data-key="myInput"
   * ```
   */
  setData(t, e) {
    const s = this.dataKeyMap.get(t).el;
    if (!s) return !1;
    const { property: i } = this.parseDataKey(t);
    return s[i] = e, !0;
  }
  /**
   * Get all data values from all data-bound elements as an object.
   * 
   * @returns {Object} Object with all data key-value pairs
   * 
   * @example
   * ```javascript
   * const allData = node.getDataObject();
   * console.log(allData); // { myInput: 'Hello', myNumber: 42 }
   * ```
   */
  getDataObject() {
    const t = {};
    for (const [e, s] of this.dataKeyMap)
      t[e] = s.el[s.property];
    return t;
  }
  /**
   * Set multiple data values from an object.
   * 
   * @param {Object} dataObj - Object with key-value pairs to set
   * 
   * @example
   * ```javascript
   * node.setDataObject({ myInput: 'Hello', myNumber: 42 });
   * ```
   */
  setDataObject(t) {
    Object.entries(t).forEach(([e, s]) => {
      this.setData(e, s);
    });
  }
  serialize() {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      selected: this.selected,
      data: this.getDataObject()
      // Include data binding values
    };
  }
  /**
   * Update the node size and recalculate connected edges.
   * Call this when the node's dimensions change.
   */
  updateSize(t, e) {
    t !== void 0 && (this.width = t, this.element && (this.element.style.width = `${t}px`)), e !== void 0 && (this.height = e, this.element && (this.element.style.height = `${e}px`)), this.flowGraph && this.flowGraph.updateEdgesForNode(this);
  }
  destroy() {
    this.element && this.eventHandlers && (this.element.removeEventListener("mousedown", this.eventHandlers.mousedown), this.element.removeEventListener("touchstart", this.eventHandlers.touchstart), this.element.removeEventListener("touchmove", this.eventHandlers.touchmove), this.element.removeEventListener("touchend", this.eventHandlers.touchend), this.element.removeEventListener("dblclick", this.eventHandlers.dblclick)), this.containerMoveHandler && this.flowGraph && this.flowGraph.container && this.flowGraph.container.removeEventListener("mousemove", this.containerMoveHandler), this.containerUpHandler && this.flowGraph && this.flowGraph.container && this.flowGraph.container.removeEventListener("mouseup", this.containerUpHandler), this.element && (this.flowGraph && this.flowGraph.domBatcher ? this.flowGraph.domBatcher.scheduleNodeDelete(this.element) : this.element.remove()), this.inputs.clear(), this.outputs.clear(), this.dataKeyMap.clear(), this.eventHandlers = null, this.flowGraph = null, this.element = null, this.template = null;
  }
}
function ee(l) {
  if (!l) return "#10b981";
  let t = l.querySelector(".socket") || l.querySelector('span[style*="border-color"]') || l;
  const e = t.getAttribute("style");
  if (e) {
    const o = e.match(/border-color:\s*([^;]+)/);
    if (o)
      return o[1].trim();
  }
  const i = window.getComputedStyle(t).borderColor;
  return i && i !== "rgba(0, 0, 0, 0)" ? i : "#10b981";
}
class se {
  /**
   * Creates a new Edge instance connecting two sockets.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   * @param {Socket} fromSocket - The source (output) socket
   * @param {Socket} toSocket - The target (input) socket
   * @param {string} [edgeColor] - Optional color for the edge (extracted from output socket if not provided)
   */
  constructor(t, e, s) {
    this.flowGraph = t, this.fromSocket = e, this.toSocket = s, this.id = `edge_${e.node.id}_${e.id}_${s.node.id}_${s.id}`, this.element = null, this.color = ee(e.element), this.updateRafId = null, this.init();
  }
  /**
   * Initialize the edge after construction.
   * Creates the SVG element and registers with both sockets.
   * 
   * @private
   */
  init() {
    this.createElement(), this.updatePath(), this.fromSocket.addConnection(this), this.toSocket.addConnection(this);
  }
  /**
   * Create the SVG path element for this edge.
   * Sets up styling and event handlers.
   * 
   * @private
   */
  createElement() {
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this.element.setAttribute("stroke", this.color), this.element.setAttribute("stroke-width", "2.5"), this.element.setAttribute("fill", "none"), this.element.setAttribute("stroke-linecap", "round"), this.element.classList.add("connection", "edge"), this.element.style.pointerEvents = "stroke", this.element.style.cursor = "pointer", this.element.addEventListener("click", (t) => {
      t.preventDefault(), t.stopPropagation();
    }), this.flowGraph.edgeSvg.appendChild(this.element);
  }
  /**
   * Update the visual path of this edge.
   * OPTIMIZED: Smooth updates for high refresh rate displays.
   * 
   * @private
   */
  updatePath() {
    if (!this.fromSocket.element || !this.toSocket.element || !this.element) return;
    const t = this.fromSocket.getPosition(), e = this.toSocket.getPosition(), s = this.flowGraph.createCubicPath(t, e, this.fromSocket, this.toSocket);
    this.updateRafId && cancelAnimationFrame(this.updateRafId), this.updateRafId = requestAnimationFrame(() => {
      this.element.setAttribute("d", s), this.updateRafId = null;
    });
  }
  /**
   * Set the animation type and speed for this edge.
   * 
   * @param {string|null} animationType - Type of animation: 'flowing', 'pulsing', 'data-flow', or null
   * @param {string} [speed='normal'] - Speed for flowing animation: 'slow', 'normal', 'fast'
   * 
   * @example
   * ```javascript
   * edge.setAnimation('flowing', 'fast');
   * edge.setAnimation('pulsing');
   * edge.setAnimation(null); // Stop animation
   * ```
   */
  setAnimation(t, e = "normal") {
    this.element.classList.remove("flowing", "flowing-fast", "flowing-slow", "pulsing", "data-flow"), t && (this.element.classList.add(t), t === "flowing" && e !== "normal" && this.element.classList.add(`flowing-${e}`));
  }
  /**
   * Start flowing animation on this edge.
   * 
   * @param {string} [speed='normal'] - Animation speed: 'slow', 'normal', 'fast'
   * 
   * @example
   * ```javascript
   * edge.startFlow('fast'); // Start fast flowing animation
   * ```
   */
  startFlow(t = "normal") {
    this.setAnimation("flowing", t);
  }
  /**
   * Start pulsing animation on this edge.
   * 
   * @example
   * ```javascript
   * edge.startPulse(); // Start pulsing animation
   * ```
   */
  startPulse() {
    this.setAnimation("pulsing");
  }
  /**
   * Start data flow animation on this edge.
   * 
   * @example
   * ```javascript
   * edge.startDataFlow(); // Start data flow animation
   * ```
   */
  startDataFlow() {
    this.setAnimation("data-flow");
  }
  /**
   * Stop all animations on this edge.
   * 
   * @example
   * ```javascript
   * edge.stopAnimation(); // Stop all animations
   * ```
   */
  stopAnimation() {
    this.setAnimation(null);
  }
  serialize() {
    return {
      id: this.id,
      fromNodeId: this.fromSocket.node.id,
      fromSocketId: this.fromSocket.id,
      toNodeId: this.toSocket.node.id,
      toSocketId: this.toSocket.id
    };
  }
  destroy() {
    this.updateRafId && (cancelAnimationFrame(this.updateRafId), this.updateRafId = null), delete this.fromSocket._cachedOffset, delete this.toSocket._cachedOffset, this.fromSocket.removeConnection(this), this.toSocket.removeConnection(this), this.element && this.element.remove();
  }
}
class ie {
  /**
   * Creates a new Viewport instance.
   * 
   * @param {HTMLElement} surface - The surface element for event handling
   * @param {HTMLElement} contentContainer - The container element to transform
   * @param {FlowGraph} [flowGraph=null] - The parent FlowGraph instance
   */
  constructor(t, e, s = null) {
    this.surface = t, this.contentContainer = e, this.flowGraph = s, this.x = 0, this.y = 0, this.scale = 1, this.minScale = 0.1, this.maxScale = 3, this.gridCache = {
      gridSize: 50,
      minorGridSize: 10,
      initialized: !1
    }, this.panState = {
      isPanning: !1,
      startX: 0,
      startY: 0,
      startViewportX: 0,
      startViewportY: 0
    }, this.touchState = {
      isPinching: !1,
      initialDistance: 0,
      initialScale: 1,
      initialCenterX: 0,
      initialCenterY: 0,
      initialViewportX: 0,
      initialViewportY: 0,
      lastTouches: [],
      lastTapTime: 0,
      lastTapX: 0,
      lastTapY: 0
    }, this.init();
  }
  init() {
    this.setupEventListeners();
  }
  setupEventListeners() {
    this.surface.addEventListener("mousedown", (t) => {
      const e = t.target.closest(".node"), s = t.target.classList.contains("socket");
      t.button !== 2 && !e && !s && this.startPan(t);
    }), this.surface.addEventListener("wheel", this.handleWheel.bind(this), { passive: !1 }), this.surface.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: !0 }), this.surface.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: !1 }), this.surface.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: !0 }), document.addEventListener("keydown", this.handleKeyDown.bind(this)), document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }
  /**
   * Start panning operation - based on original lib.js implementation
   */
  startPan(t) {
    this.panState.isPanning = !0, this.panState.startX = t.clientX, this.panState.startY = t.clientY, this.panState.startViewportX = this.x, this.panState.startViewportY = this.y, this.surface.style.cursor = "grabbing";
    const e = (i) => {
      if (this.panState.isPanning) {
        const o = i.clientX - this.panState.startX, n = i.clientY - this.panState.startY, r = this.panState.startViewportX + o, a = this.panState.startViewportY + n;
        this.panBy(r - this.x, a - this.y);
      }
    }, s = (i) => {
      this.panState.isPanning = !1, this.surface.style.cursor = "", this.surface.removeEventListener("mousemove", e), this.surface.removeEventListener("mouseup", s), this.flowGraph && this.flowGraph.container.dispatchEvent(new CustomEvent("viewport:pan", {
        detail: { x: this.x, y: this.y, scale: this.scale }
      }));
    };
    this.surface.addEventListener("mousemove", e), this.surface.addEventListener("mouseup", s);
  }
  handleWheel(t) {
    t.preventDefault();
    const e = this.surface.getBoundingClientRect(), s = t.clientX - e.left, i = t.clientY - e.top, o = t.deltaY > 0 ? 0.9 : 1.1;
    this.zoomAt(s, i, o);
  }
  /**
   * Handle touch start for panning and gestures
   */
  handleTouchStart(t) {
    if (this.touchState.lastTouches = Array.from(t.touches), t.touches.length === 1) {
      const e = t.touches[0], s = e.target.closest(".node"), i = e.target.classList.contains("socket");
      if (!s && !i) {
        const o = Date.now(), n = o - this.touchState.lastTapTime, r = Math.sqrt(
          Math.pow(e.clientX - this.touchState.lastTapX, 2) + Math.pow(e.clientY - this.touchState.lastTapY, 2)
        );
        n < 300 && r < 50 ? this.handleDoubleTap(e) : this.startPan(e), this.touchState.lastTapTime = o, this.touchState.lastTapX = e.clientX, this.touchState.lastTapY = e.clientY;
      }
    } else t.touches.length === 2 && this.startPinchZoom(t);
  }
  /**
   * Handle touch move for panning and gestures
   */
  handleTouchMove(t) {
    if (this.touchState.lastTouches = Array.from(t.touches), t.touches.length === 1 && this.panState.isPanning) {
      const e = t.touches[0], s = e.clientX - this.panState.startX, i = e.clientY - this.panState.startY, o = this.panState.startViewportX + s, n = this.panState.startViewportY + i;
      this.panBy(o - this.x, n - this.y), t.preventDefault();
    } else t.touches.length === 2 && this.touchState.isPinching && (this.updatePinchZoom(t), t.preventDefault());
  }
  /**
   * Handle touch end for panning and gestures
   */
  handleTouchEnd(t) {
    if (t.touches.length === 0)
      this.panState.isPanning && (this.panState.isPanning = !1, this.surface.style.cursor = "", this.flowGraph && this.flowGraph.container.dispatchEvent(new CustomEvent("viewport:pan", {
        detail: { x: this.x, y: this.y, scale: this.scale }
      }))), this.touchState.isPinching && (this.touchState.isPinching = !1, this.flowGraph && this.flowGraph.container.dispatchEvent(new CustomEvent("viewport:zoom", {
        detail: { x: this.x, y: this.y, scale: this.scale }
      })));
    else if (t.touches.length === 1 && this.touchState.isPinching) {
      this.touchState.isPinching = !1;
      const e = t.touches[0], s = e.target.closest(".node"), i = e.target.classList.contains("socket");
      !s && !i && this.startPan(e);
    }
  }
  /**
   * Handle double tap gesture
   */
  handleDoubleTap(t) {
    const e = this.surface.getBoundingClientRect(), s = t.clientX - e.left, i = t.clientY - e.top;
    this.scale > 1.5 ? this.zoomTo(1, s, i) : this.zoomTo(2, s, i);
  }
  /**
   * Start pinch zoom gesture
   */
  startPinchZoom(t) {
    if (t.touches.length !== 2) return;
    const e = t.touches[0], s = t.touches[1], i = Math.sqrt(
      Math.pow(s.clientX - e.clientX, 2) + Math.pow(s.clientY - e.clientY, 2)
    ), o = (e.clientX + s.clientX) / 2, n = (e.clientY + s.clientY) / 2;
    this.touchState.isPinching = !0, this.touchState.initialDistance = i, this.touchState.initialScale = this.scale, this.touchState.initialCenterX = o, this.touchState.initialCenterY = n, this.touchState.initialViewportX = this.x, this.touchState.initialViewportY = this.y, this.panState.isPanning = !1;
  }
  /**
   * Update pinch zoom gesture
   */
  updatePinchZoom(t) {
    if (t.touches.length !== 2 || !this.touchState.isPinching) return;
    const e = t.touches[0], s = t.touches[1], o = Math.sqrt(
      Math.pow(s.clientX - e.clientX, 2) + Math.pow(s.clientY - e.clientY, 2)
    ) / this.touchState.initialDistance, n = this.touchState.initialScale * o, r = Math.max(this.minScale, Math.min(this.maxScale, n)), a = (e.clientX + s.clientX) / 2, c = (e.clientY + s.clientY) / 2, h = this.surface.getBoundingClientRect(), d = (a - h.left - this.touchState.initialViewportX) / this.touchState.initialScale, p = (c - h.top - this.touchState.initialViewportY) / this.touchState.initialScale;
    a - h.left - d * r, c - h.top - p * r, this.zoomTo(r, a - h.left, c - h.top);
  }
  /**
   * Calculate distance between two touch points
   */
  getTouchDistance(t, e) {
    return Math.sqrt(
      Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2)
    );
  }
  /**
   * Calculate center point between two touches
   */
  getTouchCenter(t, e) {
    return {
      x: (t.clientX + e.clientX) / 2,
      y: (t.clientY + e.clientY) / 2
    };
  }
  handleKeyDown(t) {
    if (t.code === "Space" && (this.spacePressed = !0, t.preventDefault()), !!this.flowGraph) {
      if (t.ctrlKey || t.metaKey)
        switch (t.key) {
          case "a":
            t.preventDefault(), this.flowGraph.selectAllNodes();
            break;
          case "c":
            t.preventDefault(), this.flowGraph.copySelectedNodes();
            break;
          case "v":
            t.preventDefault(), this.flowGraph.pasteNodes();
            break;
        }
      switch (t.key) {
        case "Delete":
          t.preventDefault(), this.flowGraph.deleteSelectedNodes();
          break;
        case "Escape":
          t.preventDefault(), this.flowGraph.clearSelection(), this.flowGraph.connections && this.flowGraph.connections.cancelConnection();
          break;
      }
    }
  }
  handleKeyUp(t) {
    t.code === "Space" && (this.spacePressed = !1);
  }
  panBy(t, e) {
    this.x += t, this.y += e, this.updateTransform();
  }
  zoomAt(t, e, s) {
    const i = Math.max(this.minScale, Math.min(this.maxScale, this.scale * s));
    if (i !== this.scale) {
      const o = i / this.scale;
      this.x = t - (t - this.x) * o, this.y = e - (e - this.y) * o, this.scale = i, this.updateTransform(), this.flowGraph && this.flowGraph.container.dispatchEvent(new CustomEvent("viewport:zoom", {
        detail: { scale: this.scale, x: this.x, y: this.y }
      }));
    }
  }
  /**
   * Zoom to a specific scale at a given center point
   * @param {number} targetScale - The target zoom scale
   * @param {number} centerX - X coordinate of the zoom center
   * @param {number} centerY - Y coordinate of the zoom center
   */
  zoomTo(t, e, s) {
    const o = Math.max(this.minScale, Math.min(this.maxScale, t)) / this.scale;
    this.zoomAt(e, s, o);
  }
  updateTransform() {
    const t = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    if (this.contentContainer.style.transform = t, this.flowGraph) {
      const e = this.flowGraph.container;
      if (!this.gridCache.initialized || this.gridCache.checkCounter === void 0 || ++this.gridCache.checkCounter > 100) {
        const o = getComputedStyle(e), n = parseInt(o.getPropertyValue("--fg-grid-main-size")) || 50, r = parseInt(o.getPropertyValue("--fg-grid-minor-size")) || 10;
        (!this.gridCache.initialized || this.gridCache.gridSize !== n || this.gridCache.minorGridSize !== r) && (this.gridCache.gridSize = n, this.gridCache.minorGridSize = r, this.gridCache.initialized = !0), this.gridCache.checkCounter = 0;
      }
      const s = this.gridCache.gridSize, i = this.gridCache.minorGridSize;
      e.style.backgroundPosition = `${this.x % s}px ${this.y % s}px, ${this.x % s}px ${this.y % s}px, ${this.x % i}px ${this.y % i}px, ${this.x % i}px ${this.y % i}px`, this.flowGraph.container.dispatchEvent(new CustomEvent("viewport:change", {
        detail: {
          x: this.x,
          y: this.y,
          scale: this.scale
        }
      }));
    }
  }
  screenToWorld(t, e) {
    return {
      x: (t - this.x) / this.scale,
      y: (e - this.y) / this.scale
    };
  }
  worldToScreen(t, e) {
    return {
      x: t * this.scale + this.x,
      y: e * this.scale + this.y
    };
  }
  fitToContent() {
  }
  resetZoom() {
    this.x = 0, this.y = 0, this.scale = 1, this.updateTransform();
  }
  /**
   * Clear the grid size cache and force immediate re-read.
   * Normally not needed as grid sizes are auto-detected, but can be used
   * to force immediate update instead of waiting for the next periodic check.
   * 
   * @example
   * ```javascript
   * // Change grid size
   * flowGraph.container.style.setProperty('--fg-grid-main-size', '100px');
   * 
   * // Optional: Force immediate update (auto-detects within ~100 transforms anyway)
   * flowGraph.viewport.clearGridCache();
   * ```
   */
  clearGridCache() {
    this.gridCache.checkCounter = 101;
  }
  serialize() {
    return {
      x: this.x,
      y: this.y,
      scale: this.scale
    };
  }
  deserialize(t) {
    this.x = t.x || 0, this.y = t.y || 0, this.scale = t.scale || 1, this.updateTransform();
  }
}
class oe {
  /**
   * Creates a new FlowGraphAnimations instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(t) {
    this.flowGraph = t, this.animationConfig = {
      enabled: !0,
      style: "flowing",
      // 'flowing', 'pulsing', 'data-flow'
      speed: "normal",
      // 'slow', 'normal', 'fast'
      duration: 1e3
      // Base duration for animations
    };
  }
  /**
   * Configure edge animations during execution.
   * 
   * @param {Object} config - Animation configuration object
   * @param {boolean} [config.enabled] - Whether animations are enabled
   * @param {string} [config.style] - Animation style: 'flowing', 'pulsing', 'data-flow'
   * @param {string} [config.speed] - Animation speed: 'slow', 'normal', 'fast'
   * @param {number} [config.duration] - Base duration for animations in milliseconds
   * 
   * @example
   * ```javascript
   * animations.setAnimationConfig({
   *   style: 'flowing',
   *   speed: 'fast',
   *   duration: 2000
   * });
   * ```
   */
  setAnimationConfig(t) {
    this.animationConfig = { ...this.animationConfig, ...t };
  }
  /**
   * Set the trail duration for animations.
   * 
   * @param {number} duration - Duration in milliseconds
   * 
   * @example
   * ```javascript
   * animations.setTrailDuration(1500); // 1.5 seconds
   * ```
   */
  setTrailDuration(t) {
    this.animationConfig.duration = t;
  }
  /**
   * Get the current trail duration for animations.
   * 
   * @returns {number} Duration in milliseconds
   * 
   * @example
   * ```javascript
   * const duration = animations.getTrailDuration();
   * console.log(`Animation duration: ${duration}ms`);
   * ```
   */
  getTrailDuration() {
    return this.animationConfig.duration;
  }
  /**
   * Highlight or unhighlight a node during execution.
   * 
   * @param {Node} node - The node to highlight/unhighlight
   * @param {boolean} isExecuting - Whether the node is currently executing
   * 
   * @example
   * ```javascript
   * // Highlight node during execution
   * animations.highlightExecutingNode(node, true);
   * 
   * // Remove highlight after execution
   * animations.highlightExecutingNode(node, false);
   * ```
   */
  highlightExecutingNode(t, e) {
    if (t.element)
      if (e) {
        t.element.classList.add("executing");
        const { style: s } = this.animationConfig;
        s && t.element.classList.add(s);
      } else
        t.element.classList.remove("executing", "flowing", "pulsing", "data-flow");
  }
  /**
   * Clear all node highlighting
   */
  clearAllNodeHighlighting() {
    this.flowGraph.nodes.forEach((t) => {
      t.element && t.element.classList.remove("executing", "flowing", "pulsing", "data-flow");
    });
  }
  /**
   * Add edge to execution trail
   */
  addToExecutionTrail(t) {
    if (!t.element) return;
    const { style: e } = this.animationConfig;
    t.element.classList.remove("flowing", "flowing-fast", "flowing-slow", "pulsing", "data-flow"), t.element.classList.add("trail"), e && t.element.classList.add(e);
  }
  /**
   * Clear execution trail
   */
  clearExecutionTrail() {
    this.flowGraph.edges.forEach((t) => {
      t.element && t.element.classList.remove("trail", "flowing", "flowing-fast", "flowing-slow", "pulsing", "data-flow");
    });
  }
  /**
   * Reset all edge colors to their original colors
   */
  resetAllEdgeColors() {
    this.flowGraph.edges.forEach((t) => {
      t.element && (t.element.classList.remove("trail", "flowing", "flowing-fast", "flowing-slow", "pulsing", "data-flow"), t.element.setAttribute("stroke", t.color || "#10b981"), t.element.setAttribute("stroke-width", "2.5"), t.element.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))", t.element.style.opacity = "1");
    });
  }
  /**
   * Start animations for edges connected to a node's inputs
   * Output edges are animated separately based on execution results
   */
  startNodeAnimations(t, e) {
    t.inputs.forEach((s) => {
      s.connections.forEach((i) => {
        e.has(i.id) || (this.startEdgeAnimation(i), e.add(i.id));
      });
    });
  }
  /**
   * Stop animations for edges connected to a node's inputs
   */
  stopNodeAnimations(t, e) {
    t.inputs.forEach((s) => {
      s.connections.forEach((i) => {
        e.has(i.id) && (this.stopEdgeAnimation(i), this.addToExecutionTrail(i), e.delete(i.id));
      });
    });
  }
  /**
   * Start animation for a specific edge
   */
  startEdgeAnimation(t) {
    const { style: e, speed: s } = this.animationConfig;
    switch (e) {
      case "flowing":
        t.startFlow(s);
        break;
      case "pulsing":
        t.startPulse();
        break;
      case "data-flow":
        t.startDataFlow();
        break;
      default:
        t.startFlow(s);
    }
  }
  /**
   * Stop animation for a specific edge
   */
  stopEdgeAnimation(t) {
    t.stopAnimation();
  }
  /**
   * Stop all active animations
   */
  stopAllAnimations(t) {
    t.forEach((e) => {
      const s = this.flowGraph.edges.get(e);
      s && s.stopAnimation();
    }), t.clear();
  }
  /**
   * Animate specific output edges based on execution results
   * This is used for conditional nodes where only certain branches should be animated
   */
  animateOutputEdges(t, e, s) {
    !e || e.length === 0 || e.forEach((i) => {
      const o = t.outputs.get(i);
      o && o.connections.forEach((n) => {
        s.has(n.id) || (this.startEdgeAnimation(n), s.add(n.id));
      });
    });
  }
}
class ne {
  /**
   * Creates a new FlowGraphExecution instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(t) {
    this.flowGraph = t, this.activeOutputs = /* @__PURE__ */ new Map(), this.activeInputs = /* @__PURE__ */ new Map();
  }
  /**
   * Execute all nodes in the graph in dependency order.
   * 
   * @async
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await execution.execute();
   * ```
   */
  async execute() {
    this.flowGraph.container.dispatchEvent(new CustomEvent("graph:execute:start", {
      detail: { timestamp: Date.now() }
    })), this.flowGraph.animations.clearExecutionTrail(), this.clearBranchTracking();
    const t = this.getExecutionOrder();
    if (t.length === 0) {
      this.flowGraph.container.dispatchEvent(new CustomEvent("graph:execute:complete", {
        detail: { executedNodes: 0, timestamp: Date.now() }
      }));
      return;
    }
    let e = 0;
    const s = /* @__PURE__ */ new Set();
    let i = null;
    for (const n of t) {
      const r = this.flowGraph.nodes.get(n);
      if (r && r.template && r.template.onExecute) {
        if (!this.shouldNodeExecute(n))
          continue;
        try {
          this.flowGraph.animations.highlightExecutingNode(r, !0), this.flowGraph.animations.animationConfig.enabled && this.flowGraph.animations.startNodeAnimations(r, s), await r.execute(), e++, this.flowGraph.animations.animationConfig.enabled && this.flowGraph.animations.stopNodeAnimations(r, s), this.flowGraph.animations.highlightExecutingNode(r, !1);
        } catch (c) {
          console.error(`Error executing node ${n}:`, c), i = c, this.flowGraph.animations.highlightExecutingNode(r, !1), this.flowGraph.animations.animationConfig.enabled && this.flowGraph.animations.stopAllAnimations(s);
          break;
        }
      }
    }
    this.flowGraph.animations.animationConfig.enabled && this.flowGraph.animations.stopAllAnimations(s), this.flowGraph.animations.clearAllNodeHighlighting();
    const o = this.flowGraph.animations.getTrailDuration();
    if (o > 0 && setTimeout(() => {
      this.flowGraph.animations.resetAllEdgeColors();
    }, o), this.flowGraph.container.dispatchEvent(new CustomEvent("graph:execute:complete", {
      detail: {
        executedNodes: e,
        totalNodes: t.length,
        error: i,
        timestamp: Date.now()
      }
    })), i)
      throw i;
  }
  /**
   * Get execution order using topological sort
   */
  getExecutionOrder() {
    const t = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set(), s = [], i = /* @__PURE__ */ new Map();
    this.flowGraph.nodes.forEach((n, r) => {
      i.set(r, /* @__PURE__ */ new Set());
    }), this.flowGraph.edges.forEach((n) => {
      const r = n.fromSocket.node.id, a = n.toSocket.node.id;
      i.get(a).add(r);
    });
    const o = (n) => {
      if (e.has(n)) {
        console.warn(`Circular dependency detected involving node ${n}`);
        return;
      }
      if (t.has(n))
        return;
      e.add(n);
      const r = i.get(n) || /* @__PURE__ */ new Set();
      for (const c of r)
        o(c);
      e.delete(n), t.add(n);
      const a = this.flowGraph.nodes.get(n);
      a && a.template && a.template.onExecute && s.push(n);
    };
    return this.flowGraph.nodes.forEach((n, r) => {
      t.has(r) || o(r);
    }), s;
  }
  /**
   * Execute all selected nodes
   */
  async executeSelectedNodes() {
    if (this.flowGraph.selection.getSelection().length === 0)
      return;
    const e = this.flowGraph.selection.getSelection().map((s) => {
      const i = this.flowGraph.nodes.get(s);
      return i ? i.execute() : Promise.resolve();
    });
    try {
      await Promise.all(e);
    } catch (s) {
      console.error("Error executing selected nodes:", s);
    }
  }
  /**
   * Activate an output socket (called when setOutput is used)
   */
  activateOutputSocket(t, e) {
    this.activeOutputs.has(t) || this.activeOutputs.set(t, /* @__PURE__ */ new Set()), this.activeOutputs.get(t).add(e), this.markConnectedInputsAsActive(t, e);
  }
  /**
   * Mark input sockets connected to an active output as active
   */
  markConnectedInputsAsActive(t, e) {
    const s = this.flowGraph.nodes.get(t);
    if (!s) return;
    const o = Array.from(s.outputs.values())[e];
    o && o.connections.forEach((n) => {
      if (n.toSocket) {
        const r = n.toSocket.node.id, a = this.getInputSocketIndex(n.toSocket);
        this.activeInputs.has(r) || this.activeInputs.set(r, /* @__PURE__ */ new Set()), this.activeInputs.get(r).add(a);
      }
    });
  }
  /**
   * Get the index of an input socket within its node
   */
  getInputSocketIndex(t) {
    return Array.from(t.node.inputs.values()).indexOf(t);
  }
  /**
   * Get the index of an output socket within its node
   */
  getOutputSocketIndex(t) {
    return Array.from(t.node.outputs.values()).indexOf(t);
  }
  /**
   * Check if a node should execute based on active branches
   * By default, all nodes execute unless explicitly disabled
   */
  shouldNodeExecute(t) {
    const e = this.flowGraph.nodes.get(t);
    return e ? e.inputs.size === 0 ? !0 : this.activeInputs.size > 0 ? (this.activeInputs.get(t) || /* @__PURE__ */ new Set()).size > 0 : !0 : !1;
  }
  /**
   * Clear all branch tracking (called at start of execution)
   */
  clearBranchTracking() {
    this.activeOutputs.clear(), this.activeInputs.clear();
  }
  /**
   * Check if a node has received any input values (legacy method - keeping for compatibility)
   */
  nodeHasInputValues(t) {
    return this.shouldNodeExecute(t.id);
  }
}
class re {
  /**
   * Creates a new FlowGraphSelection instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(t) {
    this.flowGraph = t, this.selection = /* @__PURE__ */ new Set(), this.clipboard = null;
  }
  /**
   * Select a node, optionally adding to existing selection.
   * 
   * @param {string} nodeId - The ID of the node to select
   * @param {boolean} [addToSelection=false] - Whether to add to existing selection
   * 
   * @example
   * ```javascript
   * // Select single node
   * selection.selectNode('node1');
   * 
   * // Add to existing selection
   * selection.selectNode('node2', true);
   * ```
   */
  selectNode(t, e = !1) {
    const s = this.flowGraph.nodes.get(t);
    s && (e || this.clearSelection(), this.selection.add(t), s.setSelected(!0), this.flowGraph.container.dispatchEvent(new CustomEvent("node:select", {
      detail: { nodeId: t, node: s, selection: Array.from(this.selection) }
    })));
  }
  /**
   * Deselect a node from the current selection.
   * 
   * @param {string} nodeId - The ID of the node to deselect
   * 
   * @example
   * ```javascript
   * selection.deselectNode('node1');
   * ```
   */
  deselectNode(t) {
    const e = this.flowGraph.nodes.get(t);
    e && (this.selection.delete(t), e.setSelected(!1), this.flowGraph.container.dispatchEvent(new CustomEvent("node:deselect", {
      detail: { nodeId: t, node: e, selection: Array.from(this.selection) }
    })));
  }
  /**
   * Clear all current selections.
   * 
   * @example
   * ```javascript
   * selection.clearSelection();
   * ```
   */
  clearSelection() {
    const t = Array.from(this.selection);
    this.selection.forEach((e) => {
      const s = this.flowGraph.nodes.get(e);
      s && s.setSelected(!1);
    }), this.selection.clear(), this.flowGraph.container.dispatchEvent(new CustomEvent("selection:clear", {
      detail: { previousSelection: t }
    }));
  }
  /**
   * Get current selection
   */
  getSelection() {
    return Array.from(this.selection);
  }
  /**
   * Check if a node is selected
   */
  has(t) {
    return this.selection.has(t);
  }
  /**
   * Select all nodes
   */
  selectAllNodes() {
    this.clearSelection(), this.flowGraph.nodes.forEach((t, e) => {
      this.selection.add(e), t.setSelected(!0);
    }), this.flowGraph.container.dispatchEvent(new CustomEvent("selection:change", {
      detail: { selectedNodes: Array.from(this.selection) }
    }));
  }
  /**
   * Delete selected nodes
   */
  deleteSelectedNodes() {
    if (this.selection.size === 0 || this.flowGraph.readonly)
      return;
    const t = Array.from(this.selection), e = [];
    this.flowGraph.edges.forEach((s, i) => {
      (t.includes(s.fromNodeId) || t.includes(s.toNodeId)) && e.push(i);
    }), e.forEach((s) => {
      this.flowGraph.removeEdge(s);
    }), t.forEach((s) => {
      this.flowGraph.removeNode(s);
    }), this.clearSelection(), this.flowGraph.container.dispatchEvent(new CustomEvent("nodes:delete", {
      detail: { deletedNodes: t, deletedEdges: e }
    }));
  }
  /**
   * Copy selected nodes
   */
  copySelectedNodes() {
    if (this.selection.size === 0) return;
    const t = Array.from(this.selection), e = {
      nodes: [],
      edges: [],
      timestamp: Date.now()
    };
    t.forEach((s) => {
      const i = this.flowGraph.nodes.get(s);
      i && e.nodes.push({
        id: i.id,
        type: i.type,
        x: i.x,
        y: i.y
      });
    }), this.flowGraph.edges.forEach((s, i) => {
      t.includes(s.fromNodeId) && t.includes(s.toNodeId) && e.edges.push({
        id: i,
        fromNodeId: s.fromNodeId,
        fromSocketId: s.fromSocketId,
        toNodeId: s.toNodeId,
        toSocketId: s.toSocketId
      });
    }), this.clipboard = e, this.flowGraph.container.dispatchEvent(new CustomEvent("nodes:copy", {
      detail: { copiedNodes: t, copyData: e }
    }));
  }
  /**
   * Paste nodes
   */
  pasteNodes() {
    if (!this.clipboard || !this.clipboard.nodes.length || this.flowGraph.readonly)
      return;
    const t = { x: 20, y: 20 }, e = [], s = /* @__PURE__ */ new Map();
    this.clearSelection(), this.clipboard.nodes.forEach((i) => {
      const o = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      s.set(i.id, o);
      try {
        const n = this.flowGraph.addNode(i.type, {
          id: o,
          x: i.x + t.x,
          y: i.y + t.y
        });
        n && (e.push(n), this.selection.add(o), n.setSelected(!0));
      } catch (n) {
        console.warn(`Could not paste node of type ${i.type}:`, n.message);
      }
    }), this.clipboard.edges.forEach((i) => {
      const o = s.get(i.fromNodeId), n = s.get(i.toNodeId);
      if (o && n) {
        const r = this.flowGraph.nodes.get(o), a = this.flowGraph.nodes.get(n);
        if (r && a) {
          const c = r.outputs.get(i.fromSocketId), h = a.inputs.get(i.toSocketId);
          c && h && c.canConnect(h) && this.flowGraph.createEdge({
            fromNodeId: o,
            fromSocketId: i.fromSocketId,
            toNodeId: n,
            toSocketId: i.toSocketId
          });
        }
      }
    }), this.flowGraph.container.dispatchEvent(new CustomEvent("nodes:paste", {
      detail: { pastedNodes: e.map((i) => i.id), nodeIdMap: Object.fromEntries(s) }
    }));
  }
}
class ae {
  /**
   * Creates a new SpatialGrid instance.
   * 
   * @param {number} [cellSize=50] - Size of each grid cell in pixels
   */
  constructor(t = 50) {
    this.cellSize = t, this.grid = /* @__PURE__ */ new Map(), this.socketPositions = /* @__PURE__ */ new Map(), this.socketCount = 0;
  }
  /**
   * Get grid cell key for a position.
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {string} Grid cell key
   * @private
   */
  getCellKey(t, e) {
    const s = Math.floor(t / this.cellSize), i = Math.floor(e / this.cellSize);
    return `${s},${i}`;
  }
  /**
   * Get all cell keys that overlap with a circle (for tolerance radius).
   * 
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} radius - Search radius
   * @returns {string[]} Array of cell keys to check
   * @private
   */
  getCellKeysInRadius(t, e, s) {
    const i = Math.floor((t - s) / this.cellSize), o = Math.floor((t + s) / this.cellSize), n = Math.floor((e - s) / this.cellSize), r = Math.floor((e + s) / this.cellSize), a = [];
    for (let c = i; c <= o; c++)
      for (let h = n; h <= r; h++)
        a.push(`${c},${h}`);
    return a;
  }
  /**
   * Insert a socket into the grid.
   * 
   * @param {Object} socket - Socket object with position data
   * @param {number} x - X coordinate in world space
   * @param {number} y - Y coordinate in world space
   * @public
   */
  insert(t, e, s) {
    this.socketPositions.has(t) && this.remove(t);
    const i = this.getCellKey(e, s);
    this.grid.has(i) || this.grid.set(i, /* @__PURE__ */ new Set()), this.grid.get(i).add(t), this.socketPositions.set(t, { x: e, y: s, cellKey: i }), this.socketCount++;
  }
  /**
   * Update socket position in the grid.
   * More efficient than remove + insert if socket stays in same cell.
   * 
   * @param {Object} socket - Socket object
   * @param {number} newX - New X coordinate
   * @param {number} newY - New Y coordinate
   * @public
   */
  update(t, e, s) {
    const i = this.socketPositions.get(t);
    if (!i) {
      this.insert(t, e, s);
      return;
    }
    const o = this.getCellKey(e, s);
    if (i.cellKey === o) {
      i.x = e, i.y = s;
      return;
    }
    const n = this.grid.get(i.cellKey);
    n && (n.delete(t), n.size === 0 && this.grid.delete(i.cellKey)), this.grid.has(o) || this.grid.set(o, /* @__PURE__ */ new Set()), this.grid.get(o).add(t), i.x = e, i.y = s, i.cellKey = o;
  }
  /**
   * Remove socket from the grid.
   * 
   * @param {Object} socket - Socket object to remove
   * @returns {boolean} True if socket was found and removed
   * @public
   */
  remove(t) {
    const e = this.socketPositions.get(t);
    if (!e)
      return !1;
    const s = this.grid.get(e.cellKey);
    return s && (s.delete(t), s.size === 0 && this.grid.delete(e.cellKey)), this.socketPositions.delete(t), this.socketCount--, !0;
  }
  /**
   * Find the closest socket at a position within tolerance.
   * ULTRA-FAST: O(1) lookup using spatial hash.
   * 
   * @param {number} x - X coordinate in world space
   * @param {number} y - Y coordinate in world space
   * @param {number} [tolerance=20] - Maximum distance for detection
   * @returns {Object|null} Closest socket within tolerance, or null
   * @public
   */
  findAt(t, e, s = 20) {
    const i = this.getCellKeysInRadius(t, e, s);
    let o = null, n = s;
    for (const r of i) {
      const a = this.grid.get(r);
      if (a)
        for (const c of a) {
          const h = this.socketPositions.get(c);
          if (!h) continue;
          const d = h.x - t, p = h.y - e, f = Math.sqrt(d * d + p * p);
          f < n && (n = f, o = c);
        }
    }
    return o;
  }
  /**
   * Find all sockets within a rectangular area.
   * 
   * @param {number} minX - Minimum X coordinate
   * @param {number} minY - Minimum Y coordinate
   * @param {number} maxX - Maximum X coordinate
   * @param {number} maxY - Maximum Y coordinate
   * @returns {Object[]} Array of sockets in the area
   * @public
   */
  findInRect(t, e, s, i) {
    const o = Math.floor(t / this.cellSize), n = Math.floor(s / this.cellSize), r = Math.floor(e / this.cellSize), a = Math.floor(i / this.cellSize), c = /* @__PURE__ */ new Set();
    for (let h = o; h <= n; h++)
      for (let d = r; d <= a; d++) {
        const p = `${h},${d}`, f = this.grid.get(p);
        if (f)
          for (const u of f) {
            const m = this.socketPositions.get(u);
            m && m.x >= t && m.x <= s && m.y >= e && m.y <= i && c.add(u);
          }
      }
    return Array.from(c);
  }
  /**
   * Clear all sockets from the grid.
   * 
   * @public
   */
  clear() {
    this.grid.clear(), this.socketPositions.clear(), this.socketCount = 0;
  }
  /**
   * Rebuild the entire grid from scratch.
   * Call this after major viewport changes or bulk node operations.
   * 
   * @param {Object[]} sockets - Array of socket objects with positions
   * @param {Function} getPositionFn - Function to get position: (socket) => {x, y}
   * @public
   */
  rebuild(t, e) {
    this.clear();
    for (const s of t) {
      const i = e(s);
      i && this.insert(s, i.x, i.y);
    }
  }
  /**
   * Get statistics about the grid (for debugging/optimization).
   * 
   * @returns {Object} Statistics object
   * @public
   */
  getStats() {
    const t = this.grid.size;
    let e = 1 / 0, s = 0, i = 0;
    for (const n of this.grid.values()) {
      const r = n.size;
      i += r, e = Math.min(e, r), s = Math.max(s, r);
    }
    const o = t > 0 ? i / t : 0;
    return {
      cellSize: this.cellSize,
      cellsUsed: t,
      totalSockets: this.socketCount,
      socketsIndexed: i,
      avgSocketsPerCell: o.toFixed(2),
      minSocketsPerCell: e === 1 / 0 ? 0 : e,
      maxSocketsPerCell: s,
      memoryEstimate: `~${((t * 50 + i * 40) / 1024).toFixed(1)} KB`
    };
  }
  /**
   * Visualize grid for debugging (adds overlay to DOM).
   * 
   * @param {HTMLElement} container - Container element to add visualization to
   * @public
   */
  visualize(t) {
    const e = t.querySelector(".spatial-grid-debug");
    e && e.remove();
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.classList.add("spatial-grid-debug"), s.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.3;
    `;
    for (const [i, o] of this.grid) {
      const [n, r] = i.split(",").map(Number), a = n * this.cellSize, c = r * this.cellSize, h = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      h.setAttribute("x", a), h.setAttribute("y", c), h.setAttribute("width", this.cellSize), h.setAttribute("height", this.cellSize), h.setAttribute("fill", "rgba(0, 255, 0, 0.1)"), h.setAttribute("stroke", "rgba(0, 255, 0, 0.5)"), h.setAttribute("stroke-width", "1"), s.appendChild(h);
      const d = document.createElementNS("http://www.w3.org/2000/svg", "text");
      d.setAttribute("x", a + this.cellSize / 2), d.setAttribute("y", c + this.cellSize / 2), d.setAttribute("text-anchor", "middle"), d.setAttribute("dominant-baseline", "middle"), d.setAttribute("fill", "lime"), d.setAttribute("font-size", "12"), d.textContent = o.size, s.appendChild(d);
    }
    t.appendChild(s);
  }
}
class le {
  /**
   * Creates a new FlowGraphConnections instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(t) {
    this.flowGraph = t, this.connectionState = {
      active: !1,
      fromSocket: null,
      toSocket: null
    }, this.socketInteractionActive = !1, this.longPressState = {
      timer: null,
      target: null,
      startTime: 0,
      threshold: 500,
      // 500ms for long press
      moved: !1,
      connectionDelayed: !1
    }, this.spatialGrid = new ae(50), this.gridNeedsRebuild = !1;
  }
  /**
   * Setup event listeners for connection operations using event delegation.
   * OPTIMIZED: Uses single delegated listeners instead of individual listeners.
   * Implements optimization from report: Event delegation.
   * 
   * @private
   */
  setupEventListeners() {
    this.flowGraph.container.addEventListener("mousedown", this.handleDelegatedMouseEvent.bind(this)), this.flowGraph.container.addEventListener("mousemove", this.handleDelegatedMouseEvent.bind(this)), this.flowGraph.container.addEventListener("mouseup", this.handleDelegatedMouseEvent.bind(this)), document.addEventListener("mousemove", this.handleGlobalMouseMove.bind(this)), document.addEventListener("mouseup", this.handleGlobalMouseUp.bind(this)), this.flowGraph.container.addEventListener("touchstart", this.handleDelegatedTouchEvent.bind(this), { passive: !1 }), this.flowGraph.container.addEventListener("touchmove", this.handleDelegatedTouchEvent.bind(this), { passive: !1 }), this.flowGraph.container.addEventListener("touchend", this.handleDelegatedTouchEvent.bind(this), { passive: !1 });
  }
  /**
   * Handle delegated mouse events for all socket interactions.
   * OPTIMIZED: Single event handler for all mouse events.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleDelegatedMouseEvent(t) {
    if (t.type === "mousedown") {
      if (!this.isSocketTarget(t.target)) return;
      this.handleSocketMouseDown(t);
      return;
    }
    if (t.type === "mousemove" || t.type === "mouseup") {
      if (this.connectionState.active) {
        t.type === "mousemove" ? this.handleSocketMouseMove(t) : this.handleSocketMouseUp(t);
        return;
      }
      if (!this.isSocketTarget(t.target)) return;
      t.type === "mousemove" ? this.handleSocketMouseMove(t) : this.handleSocketMouseUp(t);
    }
  }
  /**
   * Check if the target element is a valid socket target for connections.
   * Only allows connections when clicking on the actual socket anchor or socket span.
   * 
   * @param {HTMLElement} target - The target element
   * @returns {boolean} True if the target is a valid socket target
   * @private
   */
  isSocketTarget(t) {
    if (t.classList.contains("socket-label") || t.closest(".socket-label"))
      return !1;
    if (t.tagName === "FLOW-SOCKET-ANCHOR" || t.closest("flow-socket-anchor") || t.classList.contains("socket"))
      return !0;
    const s = t.closest("flow-socket");
    if (s) {
      if (t === s)
        return !0;
      const i = s.shadowRoot;
      if (i) {
        const o = i.querySelector("flow-socket-anchor");
        if (o && o.contains(t))
          return !0;
      }
    }
    return !1;
  }
  /**
   * Handle global mouse move events during connection operations.
   * OPTIMIZED: Ensures mouse tracking works even when mouse leaves container.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleGlobalMouseMove(t) {
    this.connectionState.active && this.handleSocketMouseMove(t);
  }
  /**
   * Handle global mouse up events during connection operations.
   * OPTIMIZED: Ensures mouse up is captured even when mouse leaves container.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleGlobalMouseUp(t) {
    this.connectionState.active && this.handleSocketMouseUp(t);
  }
  /**
   * Handle delegated touch events for all socket interactions.
   * OPTIMIZED: Single event handler for all touch events.
   * 
   * @param {TouchEvent} e - Touch event
   * @private
   */
  handleDelegatedTouchEvent(t) {
    if (t.type === "touchstart") {
      if (!this.isSocketTarget(t.target)) return;
      this.handleSocketTouchStart(t);
      return;
    }
    if (t.type === "touchmove" || t.type === "touchend") {
      if (this.connectionState.active) {
        t.type === "touchmove" ? this.handleSocketTouchMove(t) : this.handleSocketTouchEnd(t);
        return;
      }
      if (!this.isSocketTarget(t.target)) return;
      t.type === "touchmove" ? this.handleSocketTouchMove(t) : this.handleSocketTouchEnd(t);
    }
  }
  /**
   * Handle socket mouse down
   */
  handleSocketMouseDown(t) {
    var c, h;
    const e = t.target.closest("flow-socket");
    if (!e) return;
    if (this.flowGraph.readonly) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    t.preventDefault(), t.stopPropagation();
    const s = e.closest(".node"), i = s == null ? void 0 : s.dataset.id, o = e.getAttribute("name");
    if ((c = e.shadowRoot) == null || c.querySelector("flow-socket-anchor"), !i || !o) return;
    const n = this.flowGraph.nodes.get(i), r = n == null ? void 0 : n.getSocket(o);
    if (!r) return;
    this.connectionState.active = !0, this.connectionState.fromSocket = r;
    const a = (h = e.shadowRoot) == null ? void 0 : h.querySelector(".socket");
    a && a.classList.add("socket-active"), this.updateTempPathColor(r), this.flowGraph.tempPath.style.display = "block", this.updateTempPath(t.clientX, t.clientY);
  }
  /**
   * Handle socket mouse move
   * OPTIMIZED: Uses spatial grid for O(1) socket detection instead of elementFromPoint
   */
  handleSocketMouseMove(t) {
    if (!this.connectionState.active) return;
    this.updateTempPath(t.clientX, t.clientY);
    const e = this.flowGraph.surface.getBoundingClientRect(), s = (t.clientX - e.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale, i = (t.clientY - e.top - this.flowGraph.viewport.y) / this.flowGraph.viewport.scale, o = this.spatialGrid.findAt(s, i, 25 / this.flowGraph.viewport.scale);
    if (o)
      if (this.canConnect(this.connectionState.fromSocket, o)) {
        const n = o.node;
        if (n && n.element) {
          const a = n.element.querySelector(`flow-socket[name="${o.id}"]`);
          a && this.updateSocketHover(a);
        }
        this.connectionState.toSocket = o;
        const r = this.connectionState.fromSocket.type === "output" ? this.connectionState.fromSocket : o;
        this.updateTempPathColor(r);
      } else
        o.connections.size >= o.maxConnections && this.showMaxConnectionsFeedback(o);
    else
      this.clearAllSocketHover(), this.connectionState.toSocket = null;
  }
  /**
   * Handle socket mouse up
   */
  handleSocketMouseUp(t) {
    if (this.connectionState.active) {
      if (this.connectionState.fromSocket && this.connectionState.toSocket) {
        let e, s;
        if (this.connectionState.fromSocket.type === "output" && this.connectionState.toSocket.type === "input")
          e = this.connectionState.fromSocket, s = this.connectionState.toSocket;
        else if (this.connectionState.fromSocket.type === "input" && this.connectionState.toSocket.type === "output")
          e = this.connectionState.toSocket, s = this.connectionState.fromSocket;
        else {
          this.fireConnectionFailed(this.connectionState.fromSocket, this.connectionState.toSocket, "Invalid socket type combination - both sockets are the same type"), this.cleanupConnection();
          return;
        }
        this.canConnect(e, s) && this.flowGraph.createEdge(e, s);
      }
      this.clearSocketCache(), setTimeout(() => {
        this.cleanupSocketStates();
      }, 0), this.flowGraph.tempPath.style.display = "none", this.connectionState.active = !1, this.connectionState.fromSocket = null, this.connectionState.toSocket = null;
    }
  }
  /**
   * Clean up connection state and visual feedback
   * @private
   */
  cleanupConnection() {
    setTimeout(() => {
      this.cleanupSocketStates();
    }, 0), this.flowGraph.tempPath.style.display = "none", this.connectionState.active = !1, this.connectionState.fromSocket = null, this.connectionState.toSocket = null;
  }
  /**
   * Handle socket touch start
   */
  handleSocketTouchStart(t) {
    if (t.touches.length === 1) {
      const e = t.touches[0];
      e.target.closest("flow-socket") && (this.socketInteractionActive = !0, t.preventDefault(), t.stopPropagation(), this.startLongPressDetection(e.target, e.clientX, e.clientY), setTimeout(() => {
        if (!this.longPressState.connectionDelayed) {
          const i = {
            target: e.target,
            clientX: e.clientX,
            clientY: e.clientY,
            preventDefault: () => t.preventDefault(),
            stopPropagation: () => t.stopPropagation()
          };
          this.handleSocketMouseDown(i);
        }
      }, 100));
    }
  }
  /**
   * Handle socket touch move
   */
  handleSocketTouchMove(t) {
    if (t.touches.length === 1) {
      const e = t.touches[0];
      if (this.longPressState.target && (this.longPressState.moved = !0, this.cancelLongPress()), this.connectionState.active) {
        t.preventDefault();
        const s = {
          target: e.target,
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: () => t.preventDefault(),
          stopPropagation: () => t.stopPropagation()
        };
        this.handleSocketMouseMove(s);
      }
    }
  }
  /**
   * Handle socket touch end
   */
  handleSocketTouchEnd(t) {
    if (this.socketInteractionActive = !1, this.cancelLongPress(), t.changedTouches.length === 1 && this.connectionState.active) {
      const e = t.changedTouches[0];
      t.preventDefault();
      const s = {
        target: e.target,
        clientX: e.clientX,
        clientY: e.clientY,
        preventDefault: () => t.preventDefault(),
        stopPropagation: () => t.stopPropagation()
      };
      this.handleSocketMouseUp(s);
    }
  }
  /**
   * Update temporary path during connection
   */
  updateTempPath(t, e) {
    if (!this.connectionState.fromSocket) return;
    const s = this.connectionState.fromSocket, i = this.getSocketPosition(s), o = this.flowGraph.surface.getBoundingClientRect(), n = (t - o.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale, r = (e - o.top - this.flowGraph.viewport.y) / this.flowGraph.viewport.scale, a = this.createCubicPath(i, { x: n, y: r }, s);
    this.flowGraph.tempPath.setAttribute("d", a);
  }
  /**
   * Update socket hover state efficiently.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @param {HTMLElement} flowSocket - The flow-socket element to hover
   * @private
   */
  updateSocketHover(t) {
    var s;
    this.clearAllSocketHover();
    const e = (s = t.shadowRoot) == null ? void 0 : s.querySelector(".socket");
    e && e.classList.add("socket-hover");
  }
  /**
   * Show visual feedback when socket has reached maximum connections
   * 
   * @param {Socket} socket - The socket that has reached max connections
   * @private
   */
  showMaxConnectionsFeedback(t) {
    t.element && (t.element.classList.add("socket-max-connections"), setTimeout(() => {
      t.element && t.element.classList.remove("socket-max-connections");
    }, 1e3));
  }
  /**
   * Clear all socket hover states efficiently.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @private
   */
  clearAllSocketHover() {
    const t = this.flowGraph.getCachedElements ? this.flowGraph.getCachedElements("sockets") : this.flowGraph.container.querySelectorAll("flow-socket"), e = [];
    t.forEach((s) => {
      e.push(() => {
        var o;
        const i = (o = s.shadowRoot) == null ? void 0 : o.querySelector(".socket");
        i && i.classList.remove("socket-hover");
      });
    }), e.forEach((s) => s());
  }
  /**
   * Clean up all socket visual states using optimized DOM queries.
   * OPTIMIZED: Uses cached elements and batch DOM updates.
   */
  cleanupSocketStates() {
    this.flowGraph.domBatcher ? this.flowGraph.domBatcher.schedule("update", () => {
      this.performSocketCleanup();
    }) : this.performSocketCleanup();
  }
  /**
   * Perform the actual socket cleanup operations.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @private
   */
  performSocketCleanup() {
    const t = this.flowGraph.getCachedElements ? this.flowGraph.getCachedElements("sockets") : this.flowGraph.container.querySelectorAll("flow-socket"), e = [];
    t.forEach((s) => {
      e.push(() => {
        var n, r;
        const i = (n = s.shadowRoot) == null ? void 0 : n.querySelector(".socket");
        i && i.classList.remove("socket-active", "socket-hover");
        const o = (r = s.shadowRoot) == null ? void 0 : r.querySelectorAll('span[style*="border-color"]');
        o && o.forEach((a) => {
          a.classList.remove("socket-active", "socket-hover");
        });
      });
    }), e.forEach((s) => s());
  }
  /**
   * Clear cached socket positions
   * @private
   */
  clearSocketCache() {
    this.flowGraph.nodes.forEach((t) => {
      t.getAllSockets().forEach((e) => {
        delete e._cachedOffset;
      });
    });
  }
  /**
   * Cancel current connection and clean up states
   */
  cancelConnection() {
    this.connectionState.active && (this.clearSocketCache(), this.cleanupSocketStates(), this.flowGraph.tempPath.style.display = "none", this.connectionState.active = !1, this.connectionState.fromSocket = null, this.connectionState.toSocket = null);
  }
  /**
   * Update temporary path color based on socket color
   */
  updateTempPathColor(t) {
    const e = this.extractSocketColor(t.element);
    this.flowGraph.tempPath.setAttribute("stroke", e);
  }
  /**
   * Extract color from a socket element
   */
  extractSocketColor(t) {
    if (!t) return "#10b981";
    let e = t.querySelector(".socket") || t.querySelector('span[style*="border-color"]') || t.querySelector('span[style*="background"]');
    if (e || (e = t.querySelector("span")), !e || e === t) return "#10b981";
    const s = e.getAttribute("style");
    if (s) {
      const r = s.match(/border-color:\s*([^;]+)/);
      if (r) {
        const c = r[1].trim();
        if (c && c !== "transparent" && c !== "rgba(0, 0, 0, 0)")
          return c;
      }
      const a = s.match(/background:\s*([^;]+)/);
      if (a) {
        const c = a[1].trim();
        if (c && !c.includes("gradient") && !c.includes("url") && c !== "transparent" && c !== "rgba(0, 0, 0, 0)")
          return c;
      }
    }
    const i = window.getComputedStyle(e), o = i.borderColor;
    if (o && o !== "rgba(0, 0, 0, 0)" && o !== "transparent")
      return o;
    const n = i.backgroundColor;
    return n && n !== "rgba(0, 0, 0, 0)" && n !== "transparent" ? n : "#10b981";
  }
  /**
   * Get socket position in world coordinates
   * OPTIMIZED: Uses cached node positions + socket offsets during drag operations
   */
  getSocketPosition(t) {
    var d;
    let e = t.element;
    if (!e) {
      const p = this.flowGraph.nodes.get(t.nodeId);
      if (p) {
        const f = p.element.querySelector(`flow-socket[name="${t.id}"]`);
        f && (e = (d = f.shadowRoot) == null ? void 0 : d.querySelector("flow-socket-anchor"), e && (t.element = e));
      }
    }
    if (!e)
      return console.warn(`Socket element not found for socket ${t.id}`), { x: 0, y: 0 };
    if (this.connectionState.active && t.node) {
      if (!t._cachedOffset) {
        this.flowGraph.surface.getBoundingClientRect();
        const u = t.node.element.getBoundingClientRect();
        let m = e.querySelector('span[style*="clip-path"]') || e.querySelector('span[style*="border-color"]') || e.querySelector(".socket") || e.querySelector("span");
        const v = m && m !== e ? m.getBoundingClientRect() : e.getBoundingClientRect(), N = v.left + v.width / 2, q = v.top + v.height / 2, U = u.left, V = u.top, x = this.flowGraph.viewport.scale, H = (N - U) / x, B = (q - V) / x, F = v.width / x;
        t._cachedOffset = {
          x: H,
          y: B,
          width: F
        };
      }
      const p = t.node;
      let f = 0;
      return t.type === "output" ? f = t._cachedOffset.width / 2 : t.type === "input" && (f = -t._cachedOffset.width / 2), {
        x: p.x + t._cachedOffset.x + f,
        y: p.y + t._cachedOffset.y
      };
    }
    const s = this.flowGraph.surface.getBoundingClientRect();
    let i = e.querySelector('span[style*="clip-path"]') || e.querySelector('span[style*="border-color"]') || e.querySelector(".socket") || e.querySelector("span");
    const o = i && i !== e ? i.getBoundingClientRect() : e.getBoundingClientRect(), n = o.left + o.width / 2, r = o.top + o.height / 2;
    let a = 0;
    t.type === "output" ? a = o.width / 2 : t.type === "input" && (a = -o.width / 2);
    const c = (n + a - s.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale, h = (r - s.top - this.flowGraph.viewport.y) / this.flowGraph.viewport.scale;
    return { x: c, y: h };
  }
  /**
   * Create cubic bezier path between two points
   */
  createCubicPath(t, e, s = null, i = null) {
    const o = e.x - t.x, n = e.y - t.y, r = Math.hypot(o, n), a = Math.min(200, r * 0.5);
    let c, h;
    return s ? s.type === "output" ? (c = { x: t.x + a, y: t.y }, h = { x: e.x - a, y: e.y }) : (c = { x: t.x - a, y: t.y }, h = { x: e.x + a, y: e.y }) : (c = { x: t.x + a, y: t.y }, h = { x: e.x - a, y: e.y }), `M ${t.x} ${t.y} C ${c.x} ${c.y}, ${h.x} ${h.y}, ${e.x} ${e.y}`;
  }
  /**
   * Check if two sockets can be connected
   */
  canConnect(t, e) {
    if (!t || !e)
      return this.fireConnectionFailed(t, e, "Invalid sockets provided"), !1;
    if (t === e)
      return this.fireConnectionFailed(t, e, "Cannot connect socket to itself"), !1;
    if (t.node === e.node)
      return this.fireConnectionFailed(t, e, "Cannot connect sockets from the same node"), !1;
    if (t.type === e.type)
      return this.fireConnectionFailed(t, e, `Cannot connect two ${t.type} sockets`), !1;
    if (!this.isDataTypeCompatible(t.dataType, e.dataType))
      return this.fireConnectionFailed(t, e, `Data type mismatch: ${t.dataType} cannot connect to ${e.dataType}`), !1;
    if (t.connections.size >= t.maxConnections)
      return this.fireConnectionFailed(t, e, `Source socket has reached maximum connections (${t.maxConnections})`), !1;
    if (e.connections.size >= e.maxConnections)
      return this.fireConnectionFailed(t, e, `Target socket has reached maximum connections (${e.maxConnections})`), !1;
    for (const s of this.flowGraph.edges.values())
      if (s.fromSocket === t && s.toSocket === e || s.fromSocket === e && s.toSocket === t)
        return this.fireConnectionFailed(t, e, "Connection already exists between these sockets"), !1;
    return !0;
  }
  /**
   * Fire connection failed event
   * @private
   */
  fireConnectionFailed(t, e, s) {
    this.flowGraph.container.dispatchEvent(new CustomEvent("edge:connection:failed", {
      detail: { fromSocket: t, toSocket: e, reason: s }
    }));
  }
  /**
   * Check if two data types are compatible for connection
   * @param {string} fromDataType - Source socket data type
   * @param {string} toDataType - Target socket data type
   * @returns {boolean} True if types are compatible
   */
  isDataTypeCompatible(t, e) {
    return e === "any" || e === "object" || t === "any" || t === "object" ? !0 : t === e;
  }
  /**
   * Start long press detection for mobile context menu
   * @param {HTMLElement} target - The target element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  startLongPressDetection(t, e, s) {
    this.cancelLongPress(), this.longPressState.target = t, this.longPressState.startTime = Date.now(), this.longPressState.moved = !1, this.longPressState.timer = setTimeout(() => {
      this.longPressState.moved || this.handleLongPress(t, e, s);
    }, this.longPressState.threshold);
  }
  /**
   * Cancel long press detection
   */
  cancelLongPress() {
    var t;
    if (this.longPressState.timer && (clearTimeout(this.longPressState.timer), this.longPressState.timer = null), this.longPressState.connectionDelayed && this.longPressState.target) {
      const e = this.longPressState.target.closest("flow-socket");
      if (e) {
        const s = (t = e.shadowRoot) == null ? void 0 : t.querySelector(".socket");
        s && s.classList.remove("socket-active");
      }
    }
    this.longPressState.target = null, this.longPressState.moved = !1, this.longPressState.connectionDelayed = !1;
  }
  /**
   * Handle long press - show context menu
   * @param {HTMLElement} target - The target element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  handleLongPress(t, e, s) {
    var a, c;
    this.longPressState.connectionDelayed = !0;
    let i = t.closest("flow-socket-anchor");
    if (i || t.tagName === "FLOW-SOCKET" && (i = (a = t.shadowRoot) == null ? void 0 : a.querySelector("flow-socket-anchor")), !i) return;
    let o = i._socket;
    if (!o) {
      const h = t.closest(".node");
      if (h) {
        const d = h.dataset.id, p = t.closest("flow-socket"), f = p == null ? void 0 : p.getAttribute("name");
        if (d && f) {
          const u = this.flowGraph.nodes.get(d);
          u && (o = u.getSocket(f));
        }
      }
      if (!o) return;
    }
    if (o.connections.size === 0) return;
    const n = i.querySelector(".socket");
    n && (n.classList.add("long-press-active"), setTimeout(() => {
      n.classList.remove("long-press-active");
    }, 500)), this.connectionState.active = !1, this.connectionState.fromSocket = null, this.connectionState.toSocket = null, this.flowGraph.tempPath.style.display = "none";
    const r = t.closest("flow-socket");
    if (r) {
      const h = (c = r.shadowRoot) == null ? void 0 : c.querySelector(".socket");
      h && h.classList.remove("socket-active");
    }
    o.showContextMenu(e, s);
  }
  /**
   * Register a socket with the spatial grid for fast lookups.
   * Call this when a new socket is created.
   * 
   * @param {Socket} socket - The socket to register
   * @public
   */
  registerSocket(t) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const e = this.getSocketPosition(t);
        e && this.spatialGrid.insert(t, e.x, e.y);
      });
    });
  }
  /**
   * Unregister a socket from the spatial grid.
   * Call this when a socket is removed.
   * 
   * @param {Socket} socket - The socket to unregister
   * @public
   */
  unregisterSocket(t) {
    this.spatialGrid.remove(t);
  }
  /**
   * Update socket position in the spatial grid.
   * Call this when a node moves to keep the grid in sync.
   * 
   * @param {Socket} socket - The socket to update
   * @public
   */
  updateSocketInGrid(t) {
    const e = this.getSocketPosition(t);
    e && this.spatialGrid.update(t, e.x, e.y);
  }
  /**
   * Update all sockets for a node in the spatial grid.
   * More efficient than individual updates.
   * 
   * @param {Node} node - The node whose sockets need updating
   * @public
   */
  updateNodeSocketsInGrid(t) {
    t.getAllSockets().forEach((e) => {
      this.updateSocketInGrid(e);
    });
  }
  /**
   * Rebuild the entire spatial grid.
   * Call this after major operations (bulk node add/remove, zoom change, etc.)
   * 
   * @public
   */
  rebuildSpatialGrid() {
    const t = [];
    this.flowGraph.nodes.forEach((e) => {
      t.push(...e.getAllSockets());
    }), this.spatialGrid.rebuild(t, (e) => this.getSocketPosition(e)), this.gridNeedsRebuild = !1;
  }
  /**
   * Get spatial grid statistics (for debugging/optimization).
   * 
   * @returns {Object} Grid statistics
   * @public
   */
  getSpatialGridStats() {
    return this.spatialGrid.getStats();
  }
  /**
   * Visualize the spatial grid for debugging.
   * 
   * @public
   */
  visualizeSpatialGrid() {
    this.spatialGrid.visualize(this.flowGraph.surface);
  }
  /**
   * Clean up event listeners and resources.
   * 
   * @public
   */
  destroy() {
    document.removeEventListener("mousemove", this.handleGlobalMouseMove.bind(this)), document.removeEventListener("mouseup", this.handleGlobalMouseUp.bind(this)), this.cancelConnection(), this.spatialGrid && this.spatialGrid.clear();
  }
}
class ce {
  /**
   * Creates a new FlowGraphDrag instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(t) {
    this.flowGraph = t, this.multiDragState = null;
  }
  /**
   * Start a multi-drag operation for selected nodes.
   * 
   * @param {PointerEvent} e - The pointer event that initiated the drag
   * @param {Node} draggedNode - The node that was initially dragged
   * 
   * @example
   * ```javascript
   * drag.startMultiDrag(event, node);
   * ```
   */
  startMultiDrag(t, e) {
    if (!this.flowGraph.readonly) {
      this.multiDragState = {
        active: !0,
        draggedNode: e,
        startX: t.clientX,
        startY: t.clientY,
        initialPositions: /* @__PURE__ */ new Map(),
        updateRafId: null,
        latestEvent: null
      };
      for (const s of this.flowGraph.selection.getSelection()) {
        const i = this.flowGraph.nodes.get(s);
        i && (this.multiDragState.initialPositions.set(s, {
          x: i.x,
          y: i.y
        }), i.element.classList.add("dragging"));
      }
    }
  }
  /**
   * Update multi-drag operation
   * OPTIMIZED: Aggressive throttling and batching for smooth high-refresh-rate performance
   */
  updateMultiDrag(t) {
    !this.multiDragState || !this.multiDragState.active || (this.multiDragState.updateRafId && cancelAnimationFrame(this.multiDragState.updateRafId), this.multiDragState.latestEvent = t, this.multiDragState.updateRafId = requestAnimationFrame(() => {
      this.performMultiDragUpdate(this.multiDragState.latestEvent), this.multiDragState.updateRafId = null;
    }));
  }
  /**
   * Perform the actual multi-drag update
   * OPTIMIZED: Batched DOM updates with transform instead of left/top
   * @private
   */
  performMultiDragUpdate(t) {
    if (!this.multiDragState || !this.multiDragState.active) return;
    const e = t.clientX - this.multiDragState.startX, s = t.clientY - this.multiDragState.startY, i = e / this.flowGraph.viewport.scale, o = s / this.flowGraph.viewport.scale, n = /* @__PURE__ */ new Set(), r = [];
    for (const a of this.flowGraph.selection.getSelection()) {
      const c = this.flowGraph.nodes.get(a);
      if (c) {
        const h = this.multiDragState.initialPositions.get(a), d = h.x + i, p = h.y + o;
        c.x = d, c.y = p, r.push(() => {
          c.element.style.transform = `translate(${d}px, ${p}px)`, c.element.dataset.usingTransform || (c.element.style.left = "0", c.element.style.top = "0", c.element.dataset.usingTransform = "true");
        }), n.add(c);
      }
    }
    r.forEach((a) => a()), n.size > 0 && this.flowGraph.throttledUpdates.edgeUpdate(n);
  }
  /**
   * End multi-drag operation
   */
  endMultiDrag() {
    if (!(!this.multiDragState || !this.multiDragState.active)) {
      this.multiDragState.updateRafId && (cancelAnimationFrame(this.multiDragState.updateRafId), this.multiDragState.updateRafId = null);
      for (const t of this.flowGraph.selection.getSelection()) {
        const e = this.flowGraph.nodes.get(t);
        if (e) {
          const s = this.multiDragState.initialPositions.get(t);
          e.element.dataset.usingTransform && (e.element.style.left = e.x + "px", e.element.style.top = e.y + "px", e.element.style.transform = "", delete e.element.dataset.usingTransform), this.flowGraph.connections && this.flowGraph.connections.updateNodeSocketsInGrid(e), this.flowGraph.container.dispatchEvent(new CustomEvent("node:move", {
            detail: {
              nodeId: e.id,
              node: e,
              oldPosition: s,
              newPosition: { x: e.x, y: e.y }
            }
          })), e.element.classList.remove("dragging");
        }
      }
      this.multiDragState = null;
    }
  }
}
class he {
  /**
   * Creates a new DOMBatcher instance.
   */
  constructor() {
    this.operations = /* @__PURE__ */ new Map(), this.pendingDeletions = /* @__PURE__ */ new Set(), this.flushScheduled = !1, this.rafId = null;
  }
  /**
   * Schedule a DOM operation for batching.
   * 
   * @param {string} type - The type of operation (e.g., 'update', 'delete')
   * @param {Function} operation - The DOM operation to perform
   */
  schedule(t, e) {
    this.operations.has(t) || this.operations.set(t, []), this.operations.get(t).push(e), this.flushScheduled || this.scheduleFlush();
  }
  /**
   * Schedule a node for deletion.
   * 
   * @param {HTMLElement} element - The element to delete
   */
  scheduleNodeDelete(t) {
    t && t.parentNode && (this.pendingDeletions.add(t), this.flushScheduled || this.scheduleFlush());
  }
  /**
   * Schedule a flush operation using requestAnimationFrame.
   * 
   * @private
   */
  scheduleFlush() {
    this.flushScheduled || (this.flushScheduled = !0, this.rafId = requestAnimationFrame(() => {
      this.flush();
    }));
  }
  /**
   * Execute all pending DOM operations in batches.
   * 
   * @public
   */
  flush() {
    this.flushScheduled = !1, this.rafId = null, ["update", "delete", "create", "modify"].forEach((e) => {
      const s = this.operations.get(e);
      s && s.length > 0 && (s.forEach((i) => {
        try {
          i();
        } catch (o) {
          console.warn("Error in DOM operation:", o);
        }
      }), s.length = 0);
    }), this.pendingDeletions.size > 0 && (this.pendingDeletions.forEach((e) => {
      try {
        e && e.parentNode && e.remove();
      } catch (s) {
        console.warn("Error removing element:", s);
      }
    }), this.pendingDeletions.clear());
  }
  /**
   * Cancel any pending flush operations.
   * 
   * @public
   */
  cancel() {
    this.rafId && (cancelAnimationFrame(this.rafId), this.rafId = null), this.flushScheduled = !1;
  }
  /**
   * Clear all pending operations without executing them.
   * 
   * @public
   */
  clear() {
    this.cancel(), this.operations.forEach((t) => {
      t.length = 0;
    }), this.operations.clear(), this.pendingDeletions.clear();
  }
  /**
   * Get the number of pending operations.
   * 
   * @returns {number} Total number of pending operations
   * @public
   */
  getPendingCount() {
    let t = 0;
    return this.operations.forEach((e) => {
      t += e.length;
    }), t += this.pendingDeletions.size, t;
  }
  /**
   * Check if there are any pending operations.
   * 
   * @returns {boolean} True if there are pending operations
   * @public
   */
  hasPending() {
    return this.getPendingCount() > 0;
  }
  /**
   * Destroy the DOMBatcher and clean up resources.
   * 
   * @public
   */
  destroy() {
    this.cancel(), this.clear();
  }
}
class de extends EventTarget {
  /**
   * Creates a new FlowGraph instance.
   *
   * @param {HTMLElement} container - The DOM element that will contain the flow graph interface
   *
   * @example
   * ```javascript
   * const container = document.getElementById('my-flow-graph');
   * const flowGraph = new FlowGraph(container);
   * ```
   */
  constructor(t) {
    super(), this.container = t, this.nodes = /* @__PURE__ */ new Map(), this.edges = /* @__PURE__ */ new Map(), this.templates = /* @__PURE__ */ new Map(), this.readonly = !1, this.surface = document.createElement("div"), this.surface.className = "surface", this.surface.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      transform-origin: 0px 0px;
    `, this.edgeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    ), this.edgeSvg.id = "edge-svg", this.edgeSvg.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      width: 100%;
      height: 100%;
      overflow: visible;
      z-index: 1;
    `, this.nodesRoot = document.createElement("div"), this.nodesRoot.id = "nodes-root", this.nodesRoot.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
    `, this.tempPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    ), this.tempPath.setAttribute("stroke", "#10b981"), this.tempPath.setAttribute("stroke-width", "2.5"), this.tempPath.setAttribute("fill", "none"), this.tempPath.setAttribute("stroke-linecap", "round"), this.tempPath.style.pointerEvents = "none", this.tempPath.style.display = "none", this.edgeSvg.appendChild(this.tempPath), this.contentContainer = document.createElement("div"), this.contentContainer.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      transform-origin: 0px 0px;
    `, this.contentContainer.appendChild(this.nodesRoot), this.contentContainer.appendChild(this.edgeSvg), this.surface.appendChild(this.contentContainer), this.container.appendChild(this.surface), this.viewport = new ie(this.surface, this.contentContainer, this), this.animations = new oe(this), this.execution = new ne(this), this.selection = new re(this), this.connections = new le(this), this.drag = new ce(this), this.resizeObserver = null, this.elementToNodeMap = /* @__PURE__ */ new Map(), this.domBatcher = new he(), this.domCache = /* @__PURE__ */ new Map(), this.nodeEdgeIndex = /* @__PURE__ */ new Map(), this.elementNodeWeakMap = /* @__PURE__ */ new WeakMap(), this.functionPool = /* @__PURE__ */ new Set(), this.animationBatcher = {
      pendingUpdates: /* @__PURE__ */ new Set(),
      rafId: null,
      isScheduled: !1
    }, this.edgeUpdateRafId = null, this.throttledUpdates = {
      edgeUpdate: this.createAdaptiveThrottledFunction(this.batchUpdateEdges.bind(this)),
      nodeUpdate: this.createAdaptiveThrottledFunction(this.batchUpdateNodes.bind(this))
    }, this.displayRefreshRate = this.detectDisplayRefreshRate(), this.init();
  }
  /**
   * Initialize the FlowGraph after construction.
   * Sets up event listeners and prepares the interface for interaction.
   *
   * @private
   */
  init() {
    this.setupDOMCache(), this.setupEventListeners(), this.setupResizeObserver();
  }
  /**
   * Set up all event listeners for the FlowGraph interface.
   * Delegates to modular components and handles global interactions.
   *
   * @private
   */
  setupEventListeners() {
    this.connections.setupEventListeners(), this.surface.addEventListener("click", (t) => {
      (t.target === this.surface || !t.target.closest(".node")) && (this.selection.clearSelection(), this.connections.cancelConnection());
    }), this.container.addEventListener("contextmenu", (t) => t.preventDefault());
  }
  /**
   * Set up a graph-level ResizeObserver to monitor all nodes for size changes.
   * This is more efficient than having individual ResizeObservers on each node.
   * 
   * @private
   */
  setupResizeObserver() {
    window.ResizeObserver && (this.resizeObserver = new ResizeObserver((t) => {
      const e = /* @__PURE__ */ new Set();
      for (const s of t) {
        const i = this.elementToNodeMap.get(s.target);
        i ? e.add(i) : console.warn("No node found for resized element:", s.target);
      }
      for (const s of e)
        this.updateEdgesForNode(s);
    }));
  }
  // ===== DOM OPTIMIZATION METHODS =====
  /**
   * Set up DOM cache for frequently accessed elements.
   * Implements optimization from report: DOM query caching.
   * 
   * @private
   */
  setupDOMCache() {
    this.domCache.set("nodes", () => this.nodesRoot.querySelectorAll(".node")), this.domCache.set("sockets", () => this.nodesRoot.querySelectorAll("flow-socket")), this.domCache.set("edges", () => this.edgeSvg.querySelectorAll("path[data-edge-id]")), this.domCache.set("selectedNodes", () => this.nodesRoot.querySelectorAll(".node.selected")), this.domCache.set("selectedEdges", () => this.edgeSvg.querySelectorAll("path.selected")), this.domCache.set("surface", this.surface), this.domCache.set("nodesRoot", this.nodesRoot), this.domCache.set("edgeSvg", this.edgeSvg), this.domCache.set("contentContainer", this.contentContainer);
  }
  /**
   * Get cached DOM elements with automatic refresh.
   * 
   * @param {string} key - Cache key
   * @returns {HTMLElement|NodeList} Cached element(s)
   * @private
   */
  getCachedElements(t) {
    const e = this.domCache.get(t);
    return typeof e == "function" ? e() : e;
  }
  /**
   * Detect display refresh rate for optimal performance.
   * OPTIMIZED: Adaptive throttling based on display capabilities.
   * 
   * @returns {number} Detected refresh rate in Hz
   * @private
   */
  detectDisplayRefreshRate() {
    let t = 60;
    try {
      let e = performance.now(), s = 0, i = e;
      const o = (n) => {
        s++;
        const r = n - e;
        if (n - i >= 1e3) {
          t = Math.round(s * 1e3 / (n - i));
          return;
        }
        e = n, requestAnimationFrame(o);
      };
      requestAnimationFrame(o);
    } catch (e) {
      console.warn("Could not detect display refresh rate, using 60Hz:", e);
    }
    return Math.min(Math.max(t, 60), 240);
  }
  /**
   * Create adaptive throttled function for high refresh rate displays.
   * OPTIMIZED: Automatically adjusts to display refresh rate.
   * 
   * @param {Function} func - Function to throttle
   * @returns {Function} Adaptive throttled function
   * @private
   */
  createAdaptiveThrottledFunction(t) {
    let e = 0, s = null, i = null, o = null;
    return function(...n) {
      const r = performance.now(), a = r - e, c = 1e3 / this.displayRefreshRate;
      if (a >= c) {
        e = r, t.apply(this, n);
        return;
      }
      s && cancelAnimationFrame(s), t === this.batchUpdateEdges && n.length > 0 && n[0] instanceof Set ? (o || (o = /* @__PURE__ */ new Set()), n[0].forEach((h) => o.add(h)), i = [o]) : i = n, s = requestAnimationFrame((h) => {
        e = h, t.apply(this, i), s = null, i = null, o = null;
      });
    };
  }
  /**
   * Create throttled function for performance optimization.
   * Implements optimization from report: Throttled updates.
   * 
   * @param {Function} func - Function to throttle
   * @param {number} limit - Throttle limit in ms
   * @returns {Function} Throttled function
   * @private
   */
  createThrottledFunction(t, e) {
    let s;
    return function(...i) {
      s || (t.apply(this, i), s = !0, setTimeout(() => s = !1, e));
    };
  }
  /**
   * Batch update edges for better performance.
   * OPTIMIZED: Uses requestAnimationFrame for smooth high refresh rate updates.
   * 
   * @param {Set<Node>} nodes - Nodes whose edges need updating
   * @private
   */
  batchUpdateEdges(t = /* @__PURE__ */ new Set()) {
    this.edgeUpdateRafId && cancelAnimationFrame(this.edgeUpdateRafId), this.edgeUpdateRafId = requestAnimationFrame(() => {
      this.performEdgeUpdates(t), this.edgeUpdateRafId = null;
    });
  }
  /**
   * Perform the actual edge updates.
   * OPTIMIZED: Batches DOM operations for better performance.
   * 
   * @param {Set<Node>} nodes - Nodes whose edges need updating
   * @private
   */
  performEdgeUpdates(t = /* @__PURE__ */ new Set()) {
    if (t.size === 0) {
      for (const s of this.edges.values())
        s.updatePath();
      return;
    }
    const e = /* @__PURE__ */ new Set();
    for (const s of t) {
      const i = this.nodeEdgeIndex.get(s);
      i && i.forEach((o) => e.add(o));
    }
    if (this.domBatcher && e.size > 0)
      this.domBatcher.schedule("update", () => {
        for (const s of e)
          s.updatePath();
      });
    else
      for (const s of e)
        s.updatePath();
  }
  /**
   * Batch update nodes for better performance.
   * 
   * @param {Set<Node>} nodes - Nodes to update
   * @private
   */
  batchUpdateNodes(t) {
    if (t.size === 0) return;
    document.createDocumentFragment();
    const e = [];
    for (const s of t)
      s.element && s.element.parentNode && e.push(() => {
        s.element.style.transform = `translate(${s.x}px, ${s.y}px)`;
      });
    this.domBatcher.schedule("update", () => {
      e.forEach((s) => s());
    });
  }
  /**
   * Schedule animation update with batching.
   * Implements optimization from report: Animation batching.
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {Object} animation - Animation properties
   * @private
   */
  scheduleAnimationUpdate(t, e) {
    this.animationBatcher.pendingUpdates.add({ element: t, animation: e }), this.animationBatcher.isScheduled || (this.animationBatcher.isScheduled = !0, this.animationBatcher.rafId = requestAnimationFrame(() => {
      this.processAnimationUpdates(), this.animationBatcher.isScheduled = !1, this.animationBatcher.rafId = null;
    }));
  }
  /**
   * Process batched animation updates.
   * 
   * @private
   */
  processAnimationUpdates() {
    this.animationBatcher.pendingUpdates.forEach(({ element: t, animation: e }) => {
      try {
        Object.assign(t.style, e);
      } catch (s) {
        console.warn("Error applying animation:", s);
      }
    }), this.animationBatcher.pendingUpdates.clear();
  }
  /**
   * Find a node by its DOM element using optimized lookup.
   * OPTIMIZED: Uses WeakMap for automatic memory management and O(1) performance.
   * 
   * @param {HTMLElement} element - The DOM element to search for
   * @returns {Node|null} The node that owns this element, or null if not found
   * @private
   */
  findNodeByElement(t) {
    const e = t.closest(".node");
    if (!e) return null;
    let s = this.elementNodeWeakMap.get(e);
    return s || (s = this.elementToNodeMap.get(e), s && this.elementNodeWeakMap.set(e, s), s || null);
  }
  // ===== DELEGATION METHODS =====
  // Connection methods
  /**
   * Check if two sockets can be connected.
   *
   * @param {Socket} fromSocket - The source socket
   * @param {Socket} toSocket - The target socket
   * @returns {boolean} True if the sockets can be connected
   */
  canConnect(t, e) {
    return this.connections.canConnect(t, e);
  }
  /**
   * Get the screen position of a socket.
   *
   * @param {Socket} socket - The socket to get position for
   * @returns {Object} Object with x and y coordinates
   */
  getSocketPosition(t) {
    return this.connections.getSocketPosition(t);
  }
  /**
   * Create a cubic bezier path between two points.
   *
   * @param {Object} from - Starting position {x, y}
   * @param {Object} to - Ending position {x, y}
   * @param {Socket} fromSocket - Source socket
   * @param {Socket} toSocket - Target socket
   * @returns {string} SVG path string
   */
  createCubicPath(t, e, s, i) {
    return this.connections.createCubicPath(t, e, s, i);
  }
  /**
   * Add a node template that defines how nodes of a specific type should be created.
   *
   * @param {string} name - The type name for the node template
   * @param {Object} template - Template configuration object
   * @param {Array} template.inputs - Array of input socket configurations
   * @param {Array} template.outputs - Array of output socket configurations
   * @param {string} template.html - HTML template for the node's visual representation
   * @param {string} [template.category] - Optional category for styling
   * @param {Object} [template.colorPatch] - Optional color theming
   * @param {string} [template.onExecute] - Optional function name to call on execution
   *
   * @example
   * ```javascript
   * flowGraph.addNodeTemplate('math-add', {
   *   inputs: [
   *     { id: 'a', type: 'number', label: 'A' },
   *     { id: 'b', type: 'number', label: 'B' }
   *   ],
   *   outputs: [
   *     { id: 'result', type: 'number', label: 'Result' }
   *   ],
   *   html: '<div>Add: <input data-key="a" type="number"> + <input data-key="b" type="number"></div>',
   *   category: 'math',
   *   onExecute: 'executeMathAdd',
   *   customClass: 'my-custom-node' // Optional: custom CSS class for styling
   * });
   * ```
   */
  addNodeTemplate(t, e) {
    this.templates.set(t, e), this.dispatchEvent(new CustomEvent("template:added", {
      detail: { name: t, template: e }
    }));
  }
  /**
   * Create a new node instance and add it to the flow graph.
   *
   * @param {string} type - The node type (must have a registered template)
   * @param {Object} [config={}] - Configuration object for the node
   * @param {string} [config.id] - Custom ID for the node (auto-generated if not provided)
   * @param {number} [config.x=0] - X position of the node
   * @param {number} [config.y=0] - Y position of the node
   * @param {number} [config.width=160] - Width of the node
   * @param {number} [config.height=100] - Height of the node
   * @param {string} [config.label] - Display label for the node
   * @param {boolean} [config.selected=false] - Whether the node is initially selected
   * @param {Object} [config.data] - Initial data values for data-bound elements
   * @returns {Node} The created node instance
   * @throws {Error} If the node type is not recognized
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * const node = flowGraph.addNode('math-add', {
   *   x: 100,
   *   y: 100,
   *   data: { a: 5, b: 10 }
   * });
   * ```
   */
  addNode(t, e = {}) {
    if (this.readonly)
      throw new Error("Cannot add nodes in readonly mode");
    const s = this.templates.get(t);
    if (!s)
      throw new Error(`Unknown node type: ${t}`);
    const i = new te(this, {
      ...e,
      type: t,
      template: s,
      initialData: e.data || {}
      // Pass initial data
    });
    return this.nodes.set(i.id, i), i.element ? (this.elementToNodeMap.set(i.element, i), this.elementNodeWeakMap.set(i.element, i), this.nodeEdgeIndex.set(i, /* @__PURE__ */ new Set()), this.resizeObserver && this.resizeObserver.observe(i.element)) : console.warn("Node element not ready when adding node:", i.id), this.readonly && i.disableFormControls(), this.container.dispatchEvent(
      new CustomEvent("node:create", {
        detail: { node: i }
      })
    ), i;
  }
  /**
   * Remove a node from the flow graph.
   * Also removes all edges connected to the node.
   *
   * @param {string} nodeId - The ID of the node to remove
   * @returns {boolean} True if the node was found and removed, false otherwise
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.removeNode('node_123');
   * ```
   */
  removeNode(t) {
    if (this.readonly)
      throw new Error("Cannot remove nodes in readonly mode");
    const e = this.nodes.get(t);
    if (!e) return;
    const s = this.nodeEdgeIndex.get(e);
    s && Array.from(s).map((o) => o.id).forEach((o) => this.removeEdge(o)), e.element && (this.elementToNodeMap.delete(e.element), this.resizeObserver && this.resizeObserver.unobserve(e.element)), this.nodeEdgeIndex.delete(e), this.domBatcher.scheduleNodeDelete(e.element), e.destroy(), this.nodes.delete(t), this.container.dispatchEvent(
      new CustomEvent("node:remove", {
        detail: { nodeId: t }
      })
    );
  }
  /**
   * Create a new edge connecting two sockets.
   *
   * @param {Socket} fromSocket - The source socket
   * @param {Socket} toSocket - The target socket
   * @returns {Edge|null} The created edge instance, or null if connection is not allowed
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * const edge = flowGraph.createEdge(node1.getSocket('output'), node2.getSocket('input'));
   * if (edge) {
   *   console.log('Edge created successfully');
   * }
   * ```
   */
  createEdge(t, e) {
    if (this.readonly)
      throw new Error("Cannot create edges in readonly mode");
    if (!this.canConnect(t, e)) return null;
    const s = new se(this, t, e);
    this.edges.set(s.id, s);
    const i = t.node, o = e.node;
    return this.nodeEdgeIndex.has(i) || this.nodeEdgeIndex.set(i, /* @__PURE__ */ new Set()), this.nodeEdgeIndex.has(o) || this.nodeEdgeIndex.set(o, /* @__PURE__ */ new Set()), this.nodeEdgeIndex.get(i).add(s), this.nodeEdgeIndex.get(o).add(s), this.container.dispatchEvent(
      new CustomEvent("edge:create", {
        detail: { edge: s }
      })
    ), s;
  }
  /**
   * Get an edge by its ID.
   *
   * @param {string} edgeId - The ID of the edge to retrieve
   * @returns {Edge|undefined} The edge instance, or undefined if not found
   */
  getEdge(t) {
    return this.edges.get(t);
  }
  /**
   * Remove an edge from the flow graph.
   *
   * @param {string} edgeId - The ID of the edge to remove
   * @returns {boolean} True if the edge was found and removed, false otherwise
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.removeEdge('edge_123');
   * ```
   */
  removeEdge(t) {
    if (this.readonly)
      throw new Error("Cannot remove edges in readonly mode");
    const e = this.edges.get(t);
    if (!e) return;
    const s = e.fromSocket.node, i = e.toSocket.node;
    this.nodeEdgeIndex.has(s) && this.nodeEdgeIndex.get(s).delete(e), this.nodeEdgeIndex.has(i) && this.nodeEdgeIndex.get(i).delete(e), e.destroy(), this.edges.delete(t), this.container.dispatchEvent(
      new CustomEvent("edge:remove", {
        detail: { edgeId: t }
      })
    );
  }
  /**
   * Update the visual path of all edges connected to a specific node.
   * Called when a node is moved or resized.
   * OPTIMIZED: Uses spatial index for O(log n) instead of O(n) performance.
   *
   * @param {Node} node - The node whose connected edges should be updated
   * @private
   */
  updateEdgesForNode(t) {
    this.nodeEdgeIndex.get(t) && this.throttledUpdates.edgeUpdate(/* @__PURE__ */ new Set([t]));
  }
  /**
   * Update the visual path of all edges in the graph.
   * Useful for refreshing edge positions after initial load.
   * OPTIMIZED: Uses throttled batching for better performance.
   *
   * @public
   */
  updateAllEdges() {
    this.throttledUpdates.edgeUpdate(/* @__PURE__ */ new Set());
  }
  /**
   * Clear all nodes and edges from the flow graph.
   * This removes all visual elements and resets the graph to an empty state.
   *
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.clear(); // Remove all nodes and edges
   * ```
   */
  clear() {
    if (this.readonly)
      throw new Error("Cannot clear graph in readonly mode");
    Array.from(this.edges.keys()).forEach((s) => this.removeEdge(s)), Array.from(this.nodes.keys()).forEach((s) => this.removeNode(s)), this.elementToNodeMap.clear(), this.nodeEdgeIndex.clear(), this.animationBatcher.rafId && (cancelAnimationFrame(this.animationBatcher.rafId), this.animationBatcher.rafId = null), this.animationBatcher.pendingUpdates.clear(), this.animationBatcher.isScheduled = !1, this.domBatcher.flush();
  }
  /**
   * Serialize the current state of the flow graph to a JSON object.
   * This includes all nodes, edges, viewport state, and readonly mode for saving/loading.
   *
   * @returns {Object} Serialized flow graph data
   * @returns {Array} returns.nodes - Array of serialized node data
   * @returns {Array} returns.edges - Array of serialized edge data
   * @returns {Object} returns.viewport - Serialized viewport state
   * @returns {boolean} returns.readonly - Current readonly state
   *
   * @example
   * ```javascript
   * const data = flowGraph.serialize();
   * localStorage.setItem('myFlowGraph', JSON.stringify(data));
   * ```
   */
  serialize() {
    const t = Array.from(this.nodes.values()).map(
      (s) => s.serialize()
    ), e = Array.from(this.edges.values()).map(
      (s) => s.serialize()
    );
    return {
      nodes: t,
      edges: e,
      viewport: this.viewport.serialize(),
      readonly: this.readonly
    };
  }
  /**
   * Deserialize flow graph data and restore the graph state.
   * This recreates all nodes, edges, viewport, and readonly mode from saved data.
   *
   * @param {Object} data - Serialized flow graph data
   * @param {Array} data.nodes - Array of node data to restore
   * @param {Array} data.edges - Array of edge data to restore
   * @param {Object} [data.viewport] - Viewport state to restore
   * @param {boolean} [data.readonly] - Readonly state to restore
   *
   * @example
   * ```javascript
   * const data = JSON.parse(localStorage.getItem('myFlowGraph'));
   * flowGraph.deserialize(data);
   * ```
   */
  deserialize(t) {
    this.clear(), t.nodes && t.nodes.forEach((e) => {
      const { data: s, ...i } = e;
      this.addNode(e.type, {
        ...i,
        data: s
        // Pass data for DOM population
      });
    }), t.viewport && this.viewport.deserialize(t.viewport), setTimeout(() => {
      t.edges && t.edges.forEach((e) => {
        const s = this.nodes.get(e.fromNodeId), i = this.nodes.get(e.toNodeId);
        if (s && i) {
          const o = s.getSocket(e.fromSocketId), n = i.getSocket(e.toSocketId);
          o && n && this.createEdge(o, n);
        }
      });
    }, 0), t.readonly !== void 0 && this.setReadonly(t.readonly), this.container.dispatchEvent(
      new CustomEvent("graph:deserialize", {
        detail: { data: t }
      })
    );
  }
  /**
   * Move a node and fire event
   *
   * @throws {Error} If the flow graph is in readonly mode
   */
  moveNode(t, e, s) {
    if (this.readonly)
      throw new Error("Cannot move nodes in readonly mode");
    const i = this.nodes.get(t);
    if (!i) return;
    const o = { x: i.x, y: i.y };
    i.setPosition(e, s), this.container.dispatchEvent(
      new CustomEvent("node:move", {
        detail: { nodeId: t, node: i, oldPosition: o, newPosition: { x: e, y: s } }
      })
    ), this.updateEdgesForNode(i);
  }
  /**
   * Select an edge
   */
  selectEdge(t) {
    const e = this.edges.get(t);
    e && (e.element.classList.add("selected"), this.container.dispatchEvent(
      new CustomEvent("edge:select", {
        detail: { edgeId: t, edge: e }
      })
    ));
  }
  /**
   * Deselect an edge
   */
  deselectEdge(t) {
    const e = this.edges.get(t);
    e && (e.element.classList.remove("selected"), this.container.dispatchEvent(
      new CustomEvent("edge:deselect", {
        detail: { edgeId: t, edge: e }
      })
    ));
  }
  /**
   * Handle viewport changes
   */
  onViewportChange() {
    this.container.dispatchEvent(
      new CustomEvent("viewport:change", {
        detail: {
          x: this.viewport.x,
          y: this.viewport.y,
          scale: this.viewport.scale
        }
      })
    );
  }
  /**
   * Handle viewport zoom
   */
  onViewportZoom(t) {
    this.container.dispatchEvent(
      new CustomEvent("viewport:zoom", {
        detail: { scale: t, x: this.viewport.x, y: this.viewport.y }
      })
    );
  }
  /**
   * Handle viewport pan
   */
  onViewportPan(t, e) {
    this.container.dispatchEvent(
      new CustomEvent("viewport:pan", {
        detail: { x: t, y: e, scale: this.viewport.scale }
      })
    );
  }
  // Execution methods
  async execute() {
    return this.execution.execute();
  }
  async executeSelectedNodes() {
    return this.execution.executeSelectedNodes();
  }
  activateOutputSocket(t, e) {
    return this.execution.activateOutputSocket(t, e);
  }
  shouldNodeExecute(t) {
    return this.execution.shouldNodeExecute(t);
  }
  clearBranchTracking() {
    return this.execution.clearBranchTracking();
  }
  nodeHasInputValues(t) {
    return this.execution.nodeHasInputValues(t);
  }
  // Animation methods
  setAnimationConfig(t) {
    return this.animations.setAnimationConfig(t);
  }
  highlightExecutingNode(t, e) {
    return this.animations.highlightExecutingNode(t, e);
  }
  clearAllNodeHighlighting() {
    return this.animations.clearAllNodeHighlighting();
  }
  addToExecutionTrail(t) {
    return this.animations.addToExecutionTrail(t);
  }
  clearExecutionTrail() {
    return this.animations.clearExecutionTrail();
  }
  resetAllEdgeColors() {
    return this.animations.resetAllEdgeColors();
  }
  animateOutputEdges(t, e, s) {
    return this.animations.animateOutputEdges(
      t,
      e,
      s
    );
  }
  setTrailDuration(t) {
    return this.animations.setTrailDuration(t);
  }
  getTrailDuration() {
    return this.animations.getTrailDuration();
  }
  // Selection methods
  selectNode(t, e = !1) {
    return this.selection.selectNode(t, e);
  }
  deselectNode(t) {
    return this.selection.deselectNode(t);
  }
  clearSelection() {
    return this.selection.clearSelection();
  }
  getSelection() {
    return this.selection.getSelection();
  }
  selectAllNodes() {
    return this.selection.selectAllNodes();
  }
  deleteSelectedNodes() {
    return this.selection.deleteSelectedNodes();
  }
  copySelectedNodes() {
    return this.selection.copySelectedNodes();
  }
  pasteNodes() {
    return this.selection.pasteNodes();
  }
  // Drag methods
  startMultiDrag(t, e) {
    return this.drag.startMultiDrag(t, e);
  }
  updateMultiDrag(t) {
    return this.drag.updateMultiDrag(t);
  }
  endMultiDrag() {
    return this.drag.endMultiDrag();
  }
  // ===== READONLY MODE METHODS =====
  /**
   * Set the readonly mode of the flow graph.
   *
   * @param {boolean} readonly - Whether to enable readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.setReadonly(true);  // Enable readonly mode
   * flowGraph.setReadonly(false); // Disable readonly mode
   * ```
   */
  setReadonly(t) {
    this.readonly = t, t ? (this.surface.classList.add("readonly"), this.nodes.forEach((e) => {
      e.disableFormControls();
    })) : (this.surface.classList.remove("readonly"), this.nodes.forEach((e) => {
      e.enableFormControls();
    })), this.container.dispatchEvent(
      new CustomEvent("readonly:change", {
        detail: { readonly: t }
      })
    );
  }
  /**
   * Get the current readonly state of the flow graph.
   *
   * @returns {boolean} True if in readonly mode, false otherwise
   *
   * @example
   * ```javascript
   * const isReadonly = flowGraph.isReadonly();
   * console.log('Readonly mode:', isReadonly);
   * ```
   */
  isReadonly() {
    return this.readonly;
  }
  /**
   * Toggle readonly mode on/off.
   *
   * @returns {boolean} The new readonly state
   *
   * @example
   * ```javascript
   * const newState = flowGraph.toggleReadonly();
   * console.log('Readonly mode is now:', newState);
   * ```
   */
  toggleReadonly() {
    return this.setReadonly(!this.readonly), this.readonly;
  }
  destroy() {
    this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), this.domBatcher.destroy(), this.domCache.clear(), this.nodeEdgeIndex.clear(), this.functionPool.clear(), this.connections.destroy(), this.animationBatcher.rafId && cancelAnimationFrame(this.animationBatcher.rafId), this.edgeUpdateRafId && cancelAnimationFrame(this.edgeUpdateRafId), this.clear(), this.surface.remove();
  }
}
class et extends S {
  constructor() {
    super(), this.visible = !1, this.x = 0, this.y = 0, this.nodeDefinitions = [], this.onNodeAdd = null, this.searchTerm = "", this.minWidth = 200, this.maxWidth = 300;
  }
  show(t, e, s, i, o = 200, n = 300) {
    this.x = t, this.y = e, this.nodeDefinitions = s, this.onNodeAdd = i, this.minWidth = o, this.maxWidth = n, this.visible = !0, this.searchTerm = "", this.style.setProperty("--context-menu-min-width", `${o}px`), this.style.setProperty("--context-menu-max-width", `${n}px`), this.setAttribute("visible", ""), this.requestUpdate(), this.updatePosition(), setTimeout(() => {
      document.addEventListener("click", this.handleOutsideClick.bind(this));
    }, 0);
  }
  hide() {
    this.visible = !1, this.removeAttribute("visible"), this.requestUpdate(), document.removeEventListener("click", this.handleOutsideClick.bind(this));
  }
  updatePosition() {
    const t = this.getBoundingClientRect(), e = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    let s = this.x, i = this.y;
    s + t.width > e.width && (s = e.width - t.width - 10), i + t.height > e.height && (i = e.height - t.height - 10), this.style.left = `${Math.max(10, s)}px`, this.style.top = `${Math.max(10, i)}px`;
  }
  handleOutsideClick(t) {
    !this.contains(t.target) && !t.target.closest("flow-context-menu") && this.hide();
  }
  handleNodeClick(t) {
    this.onNodeAdd && this.onNodeAdd(t), this.hide();
  }
  groupNodesByCategory() {
    const t = {};
    return this.nodeDefinitions.filter((s) => {
      var o, n, r, a;
      if (!this.searchTerm) return !0;
      const i = this.searchTerm.toLowerCase();
      return ((o = s.label) == null ? void 0 : o.toLowerCase().includes(i)) || ((n = s.name) == null ? void 0 : n.toLowerCase().includes(i)) || ((r = s.description) == null ? void 0 : r.toLowerCase().includes(i)) || ((a = s.category) == null ? void 0 : a.toLowerCase().includes(i));
    }).forEach((s) => {
      const i = s.category || "General";
      t[i] || (t[i] = []), t[i].push(s);
    }), t;
  }
  handleSearchInput(t) {
    this.searchTerm = t.target.value, this.requestUpdate();
  }
  handleSearchKeydown(t) {
    t.stopPropagation();
  }
  handleSearchClick(t) {
    t.stopPropagation();
  }
  getNodeIcon(t) {
    return t.icon || "⚙️";
  }
  render() {
    if (!this.visible || !this.nodeDefinitions.length)
      return y``;
    const t = this.groupNodesByCategory();
    return y`
      <div class="context-menu">
        <div class="context-menu-header">
          Add Node
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search nodes..."
            .value="${this.searchTerm || ""}"
            @input="${this.handleSearchInput}"
            @keydown="${this.handleSearchKeydown}"
            @click="${this.handleSearchClick}"
          />
        </div>
        
        ${Object.entries(t).map(([e, s]) => y`
          <div class="node-category">
            <div class="category-header">
              ${e}
            </div>
            ${s.map((i) => y`
              <div 
                class="node-item"
                @click=${() => this.handleNodeClick(i)}
                title="${i.description || ""}"
              >
                <div class="node-icon">
                  ${i.icon || this.getNodeIcon(i)}
                </div>
                <div class="node-info">
                  <div class="node-name">${i.label || i.name}</div>
                  ${i.description ? y`
                    <div class="node-description">${i.description}</div>
                  ` : ""}
                </div>
                <div class="node-type">${i.name}</div>
              </div>
            `)}
          </div>
        `)}
      </div>
    `;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(et, "properties", {
  /** @type {Boolean} Whether the context menu is visible */
  visible: { type: Boolean },
  /** @type {Number} X position of the context menu */
  x: { type: Number },
  /** @type {Number} Y position of the context menu */
  y: { type: Number },
  /** @type {Array} Array of available node definitions */
  nodeDefinitions: { type: Array },
  /** @type {Function} Callback function when a node is added */
  onNodeAdd: { type: Function },
  /** @type {String} Search term for filtering node definitions */
  searchTerm: { type: String },
  /** @type {Number} Minimum width of the context menu */
  minWidth: { type: Number },
  /** @type {Number} Maximum width of the context menu */
  maxWidth: { type: Number }
}), g(et, "styles", b`
    :host {
      position: fixed;
      z-index: 10000;
      display: none;
    }

    :host([visible]) {
      display: block;
    }

    .context-menu {
      background: var(--fg-panel, #0b1220);
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      min-width: var(--context-menu-min-width, 200px);
      max-width: var(--context-menu-max-width, 300px);
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 0;
      font-family: inherit;
      user-select: none;
    }

    .context-menu-header {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: bold;
      color: var(--fg-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--fg-muted, #94a3b8);
      margin-bottom: 4px;
    }

    .search-container {
      padding: 8px 12px;
      border-bottom: 1px solid var(--fg-muted, #94a3b8);
    }

    .search-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 4px;
      background: var(--fg-panel, #0b1220);
      color: var(--fg-text, #ffffff);
      font-size: 12px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--fg-accent, #7c3aed);
    }

    .search-input::placeholder {
      color: var(--fg-muted, #94a3b8);
    }

    .node-category {
      margin-bottom: 8px;
    }

    .category-header {
      padding: 6px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--fg-accent, #7c3aed);
      background: rgba(124, 58, 237, 0.1);
      border-left: 3px solid var(--fg-accent, #7c3aed);
    }

    .node-item {
      padding: 10px 16px;
      cursor: pointer;
      color: var(--fg-text, #ffffff);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .node-item:hover {
      background: var(--fg-accent, #7c3aed);
      color: white;
      border-left-color: white;
    }

    .node-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .node-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .node-name {
      font-weight: 500;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-description {
      font-size: 11px;
      color: var(--fg-muted, #94a3b8);
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-item:hover .node-description {
      color: rgba(255, 255, 255, 0.8);
    }

    .node-type {
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      color: var(--fg-muted, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
    }

    .node-item:hover .node-type {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .no-nodes {
      padding: 20px 16px;
      text-align: center;
      color: var(--fg-muted, #94a3b8);
      font-size: 12px;
    }

    /* Scrollbar styling */
    .context-menu::-webkit-scrollbar {
      width: 6px;
    }

    .context-menu::-webkit-scrollbar-track {
      background: transparent;
    }

    .context-menu::-webkit-scrollbar-thumb {
      background: var(--fg-muted, #94a3b8);
      border-radius: 3px;
    }

    .context-menu::-webkit-scrollbar-thumb:hover {
      background: var(--fg-accent, #7c3aed);
    }
  `);
customElements.define("flow-context-menu", et);
class st extends S {
  /**
   * Creates a new FlowGraphElement instance.
   * Initializes default property values and sets up the component.
   */
  constructor() {
    super(), this.theme = "dark", this.snapToGrid = !1, this.gridSize = 20, this.zoomMin = 0.1, this.zoomMax = 3, this.defaultZoom = 1, this.readonly = !1, this.flowGraph = null;
  }
  /**
   * Called after the component's DOM has been updated for the first time.
   * Initializes the FlowGraph instance and sets up event forwarding.
   *
   * @override
   */
  firstUpdated() {
    this.flowGraph = new de(this), this.processChildren(), this.flowGraph.addEventListener("node:create", (t) => {
      this.dispatchEvent(new CustomEvent("node:create", { detail: t.detail }));
    }), this.flowGraph.addEventListener("edge:create", (t) => {
      this.dispatchEvent(new CustomEvent("edge:create", { detail: t.detail }));
    }), this.flowGraph.addEventListener("edge:connection:failed", (t) => {
      this.dispatchEvent(new CustomEvent("edge:connection:failed", { detail: t.detail }));
    }), this.addEventListener(
      "contextmenu",
      this.handleViewportRightClick.bind(this)
    ), setTimeout(() => {
      this.flowGraph && this.flowGraph.viewport && this.flowGraph.viewport.surface && this.flowGraph.viewport.surface.addEventListener(
        "contextmenu",
        this.handleViewportRightClick.bind(this)
      ), this.readonly && this.flowGraph.setReadonly(!0);
    }, 200);
  }
  processChildren() {
    const t = this.querySelector("flow-definitions");
    t && this.processDefinitions(t);
    const e = this.querySelector("flow-nodes");
    e && this.processNodes(e);
    const s = this.querySelector("flow-edges");
    s && setTimeout(() => this.processEdges(s), 10);
  }
  processDefinitions(t) {
    t.querySelectorAll("flow-node-def").forEach((s) => {
      const i = s.getAttribute("name"), o = s.getAttribute("label") || i, n = parseInt(s.getAttribute("width")) || 160, r = parseInt(s.getAttribute("height")) || 100, a = s.getAttribute("category") || "General", c = s.getAttribute("description") || "", h = s.getAttribute("icon") || "", d = s.getAttribute("onExecute"), p = s.getAttribute("custom-class"), f = {}, u = s.getAttribute("color-bg"), m = s.getAttribute("color-text");
      u && (f.background = u), m && (f.color = m);
      const v = s.querySelector("node-body"), N = s.querySelectorAll("flow-socket"), q = [], U = [];
      Array.from(N).forEach((x) => {
        const H = x.getAttribute("name"), B = x.getAttribute("type"), F = x.getAttribute("label"), dt = x.getAttribute("data-type") || "any";
        B === "input" ? q.push({
          id: H,
          label: F,
          type: dt
        }) : B === "output" && U.push({
          id: H,
          label: F,
          type: dt
        });
      });
      const V = {
        name: i,
        label: o,
        width: n,
        height: r,
        category: a,
        description: c,
        icon: h,
        onExecute: d,
        customClass: p,
        colorPatch: Object.keys(f).length > 0 ? f : null,
        html: v ? v.innerHTML : null,
        inputs: q,
        outputs: U
      };
      this.flowGraph.addNodeTemplate(i, V);
    });
  }
  processNodes(t) {
    t.querySelectorAll("flow-node").forEach((s) => {
      const i = s.getAttribute("type"), o = s.getAttribute("id"), n = parseFloat(s.getAttribute("x")) || 0, r = parseFloat(s.getAttribute("y")) || 0, a = s.hasAttribute("selected");
      this.flowGraph.nodes.has(o) || this.flowGraph.addNode(i, { id: o, x: n, y: r, selected: a });
    });
  }
  processEdges(t) {
    this.flowGraph.edges.forEach((s) => {
      this.flowGraph.removeEdge(s.id);
    }), t.querySelectorAll("flow-edge").forEach((s) => {
      const i = s.getAttribute("from"), o = s.getAttribute("to");
      if (i && o) {
        const [n, r] = i.split(":"), [a, c] = o.split(":"), h = this.flowGraph.nodes.get(n), d = this.flowGraph.nodes.get(a);
        if (h && d) {
          const p = h.getSocket(r), f = d.getSocket(c);
          p && f && this.flowGraph.createEdge(p, f);
        }
      }
    });
  }
  // Public API methods
  addNode(t, e) {
    return this.flowGraph.addNode(t, e);
  }
  removeNode(t) {
    return this.flowGraph.removeNode(t);
  }
  addEdge(t, e, s) {
    const [i, o] = t.split(":"), [n, r] = e.split(":"), a = this.flowGraph.nodes.get(i), c = this.flowGraph.nodes.get(n);
    if (a && c) {
      const h = a.getSocket(o), d = c.getSocket(r);
      if (h && d)
        return this.flowGraph.createEdge(h, d);
    }
    return null;
  }
  removeEdge(t) {
    return this.flowGraph.removeEdge(t);
  }
  clear() {
    return this.flowGraph.clear();
  }
  serialize() {
    return this.flowGraph.serialize();
  }
  deserialize(t) {
    return this.flowGraph.deserialize(t);
  }
  handleViewportRightClick(t) {
    if (this.readonly) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    if (t.target.classList.contains("node") || t.target.closest(".node")) {
      this.handleNodeRightClick(t);
      return;
    }
    if (t.target.classList.contains("socket"))
      return;
    t.preventDefault(), t.stopPropagation();
    const e = Array.from(this.flowGraph.templates.values()).map(
      (i) => ({
        name: i.name,
        label: i.label,
        category: i.category || "General",
        description: i.description,
        icon: i.icon,
        inputs: i.inputs,
        outputs: i.outputs
      })
    ), s = this.shadowRoot.getElementById("context-menu");
    s && s.show(
      t.clientX,
      t.clientY,
      e,
      this.addNodeFromContextMenu.bind(this)
    );
  }
  handleNodeRightClick(t) {
    if (t.preventDefault(), t.stopPropagation(), this.readonly)
      return;
    const e = t.target.classList.contains("node") ? t.target : t.target.closest(".node");
    if (!e) return;
    const s = e.getAttribute("data-id");
    if (!s) return;
    const i = [
      {
        label: "Delete Node",
        icon: "🗑️",
        action: () => this.deleteNode(s)
      }
    ];
    this.showNodeContextMenu(t.clientX, t.clientY, i);
  }
  showNodeContextMenu(t, e, s) {
    const i = document.querySelector(".node-context-menu");
    i && i.remove();
    const o = document.createElement("div");
    o.className = "node-context-menu", o.style.cssText = `
      position: fixed;
      left: ${t}px;
      top: ${e}px;
      background: var(--fg-panel, #0b1220);
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      min-width: 150px;
      font-family: inherit;
      user-select: none;
      overflow-x: hidden;
    `, s.forEach((r) => {
      const a = document.createElement("div");
      a.className = "context-menu-item", a.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-text, #ffffff);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      `, a.innerHTML = `
        <span>${r.icon}</span>
        <span>${r.label}</span>
      `, a.addEventListener("click", () => {
        r.action(), o.remove();
      }), a.addEventListener("mouseenter", () => {
        a.style.background = "var(--fg-accent, #7c3aed)", a.style.color = "white";
      }), a.addEventListener("mouseleave", () => {
        a.style.background = "transparent", a.style.color = "var(--fg-text, #ffffff)";
      }), o.appendChild(a);
    }), document.body.appendChild(o);
    const n = (r) => {
      o.contains(r.target) || (o.remove(), document.removeEventListener("click", n));
    };
    setTimeout(() => {
      document.addEventListener("click", n);
    }, 0);
  }
  deleteNode(t) {
    this.removeNode(t), this.dispatchEvent(
      new CustomEvent("node:remove", {
        detail: { nodeId: t }
      })
    );
  }
  addNodeFromContextMenu(t) {
    const e = this.shadowRoot.getElementById("context-menu");
    if (!e) return;
    const s = this.getBoundingClientRect(), i = this.flowGraph.viewport, o = e.x - s.left, n = e.y - s.top, r = (o - i.x) / i.scale, a = (n - i.y) / i.scale;
    this.addNode(t.name, { x: r, y: a });
  }
  setTrailDuration(t) {
    this.flowGraph && this.flowGraph.setTrailDuration(t);
  }
  // Property change handler
  updated(t) {
    super.updated(t), t.has("readonly") && this.flowGraph && setTimeout(() => {
      this.flowGraph && this.flowGraph.setReadonly(this.readonly);
    }, 50);
  }
  // Readonly control methods
  setReadonly(t) {
    this.readonly = t, this.flowGraph && setTimeout(() => {
      this.flowGraph && this.flowGraph.setReadonly(t);
    }, 50);
  }
  isReadonly() {
    return this.readonly;
  }
  toggleReadonly() {
    return this.setReadonly(!this.readonly), this.readonly;
  }
  render() {
    return y`
      <slot></slot>
      <flow-context-menu id="context-menu"></flow-context-menu>
    `;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(st, "properties", {
  /** @type {String} Visual theme for the flow graph */
  theme: { type: String },
  /** @type {Boolean} Whether to snap nodes to a grid */
  snapToGrid: { type: Boolean, attribute: "snap-to-grid" },
  /** @type {Number} Size of the grid for snapping */
  gridSize: { type: Number, attribute: "grid-size" },
  /** @type {Number} Minimum zoom level */
  zoomMin: { type: Number, attribute: "zoom-min" },
  /** @type {Number} Maximum zoom level */
  zoomMax: { type: Number, attribute: "zoom-max" },
  /** @type {Number} Default zoom level */
  defaultZoom: { type: Number, attribute: "default-zoom" },
  /** @type {Boolean} Whether the flow graph is in readonly mode */
  readonly: { type: Boolean }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(st, "styles", b`
    :host {
      background-color: #f8f9fa;
      background-image: 
        /* Main grid lines */ linear-gradient(
          rgba(0, 0, 0, 0.4) 1px,
          transparent 1px
        ),
        linear-gradient(90deg, rgba(0, 0, 0, 0.4) 1px, transparent 1px),
        /* Minor grid lines */
          linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px);
      background-size: 50px 50px, /* Main grid */ 50px 50px,
        /* Main grid */ 10px 10px, /* Minor grid */ 10px 10px; /* Minor grid */
      background-position: 0 0, /* Main grid */ 0 0, /* Main grid */ 0 0,
        /* Minor grid */ 0 0; /* Minor grid */
    }
  `);
customElements.define("flow-graph", st);
class it extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(it, "properties", {
  /** @type {String} The name/type identifier for this node definition */
  name: { type: String },
  /** @type {String} Display label for the node */
  label: { type: String },
  /** @type {Number} Default width of nodes created from this definition */
  width: { type: Number },
  /** @type {Number} Default height of nodes created from this definition */
  height: { type: Number }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(it, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-node-def", it);
class ot extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(ot, "properties", {
  /** @type {String} The type identifier for this node */
  type: { type: String },
  /** @type {String} Unique identifier for this node */
  id: { type: String },
  /** @type {Number} X position of the node */
  x: { type: Number },
  /** @type {Number} Y position of the node */
  y: { type: Number },
  /** @type {Boolean} Whether the node is currently selected */
  selected: { type: Boolean }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(ot, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-node", ot);
class nt extends S {
  constructor() {
    super(), this.type = "output", this.name = "", this.label = "", this.color = "", this.size = "", this.customClass = "", this.dataType = "any";
  }
  connectedCallback() {
    super.connectedCallback(), this.ensureSocketStructure();
  }
  /**
   * Ensure the socket has the proper structure with anchor and label elements.
   * Generates them if they don't exist.
   * 
   * @private
   */
  ensureSocketStructure() {
    requestAnimationFrame(() => {
      var i, o;
      if (this.innerHTML.trim().length > 0)
        return;
      const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("flow-socket-anchor"), s = (o = this.shadowRoot) == null ? void 0 : o.querySelector(".socket-label");
      (!e || !s) && this.generateSocketStructure();
    });
  }
  /**
   * Generate the complete socket structure with anchor and label.
   * 
   * @private
   */
  generateSocketStructure() {
    const t = `socket ${this.type} ${this.customClass || ""}`.trim(), e = this.getSocketStyle(), s = this.getLabelStyle(), i = `
      <flow-socket-anchor class="${this.customClass || ""}">
        <span 
          class="${t}" 
          style="${e}">
        </span>
      </flow-socket-anchor>
      <span class="socket-label" style="${s}">${this.label}</span>
    `;
    this.shadowRoot.innerHTML = i;
  }
  /**
   * Renders the component template.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    if (this.innerHTML.trim().length > 0)
      return y`<slot></slot>`;
    {
      const e = `socket ${this.type} ${this.customClass || ""}`.trim(), s = this.getSocketStyle(), i = this.getLabelStyle();
      return y`
        <flow-socket-anchor class="${this.customClass || ""}">
          <span 
            class="${e}" 
            style="${s}">
          </span>
        </flow-socket-anchor>
        <span class="socket-label" style="${i}">${this.label}</span>
      `;
    }
  }
  /**
   * Generate CSS styles for the socket element.
   * 
   * @returns {string} CSS style string
   * @private
   */
  getSocketStyle() {
    const t = this.type === "input" ? "#10b981" : "#ef4444", e = this.color || t, s = this.size || "10px";
    return `
      border-color: ${e};
      background: ${e};
      width: ${s};
      height: ${s};
      border-radius: 50%;
    `;
  }
  /**
   * Generate CSS styles for the label element.
   * 
   * @returns {string} CSS style string
   * @private
   */
  getLabelStyle() {
    return this.color ? `color: ${this.color}; font-weight: bold;` : "";
  }
  /**
   * Convert hex color to rgba with opacity.
   * 
   * @param {string} hex - Hex color string
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} RGBA color string
   * @private
   */
  hexToRgba(t, e) {
    const s = parseInt(t.slice(1, 3), 16), i = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
    return `rgba(${s}, ${i}, ${o}, ${e})`;
  }
  /**
   * Convert CSS color name to hex value.
   * 
   * @param {string} color - CSS color name
   * @returns {string|false} Hex color string or false if not found
   * @private
   */
  colourNameToHex(t) {
    const e = {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      gold: "#ffd700",
      goldenrod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      indianred: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavender: "#e6e6fa",
      lavenderblush: "#fff0f5",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgrey: "#d3d3d3",
      lightgreen: "#90ee90",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370d8",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#d87093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      steelblue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    };
    return typeof e[t.toLowerCase()] < "u" ? e[t.toLowerCase()] : !1;
  }
  /**
   * Convert any CSS color to rgba with opacity.
   * Handles both hex colors and named CSS colors.
   * 
   * @param {string} color - CSS color string (hex, named, rgb, etc.)
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} RGBA color string
   * @private
   */
  colorToRgba(t, e) {
    if (t.startsWith("#"))
      return this.hexToRgba(t, e);
    const s = this.colourNameToHex(t);
    if (s)
      return this.hexToRgba(s, e);
    const i = t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (i) {
      const o = parseInt(i[1]), n = parseInt(i[2]), r = parseInt(i[3]);
      return `rgba(${o}, ${n}, ${r}, ${e})`;
    }
    return t;
  }
  /**
   * Get the socket anchor element for edge connections.
   * 
   * @returns {HTMLElement|null} The socket anchor element
   */
  getSocketAnchor() {
    var t;
    return (t = this.shadowRoot) == null ? void 0 : t.querySelector("flow-socket-anchor");
  }
  /**
   * Get the socket span element.
   * 
   * @returns {HTMLElement|null} The socket span element
   */
  getSocketElement() {
    var t;
    return (t = this.shadowRoot) == null ? void 0 : t.querySelector(".socket");
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(nt, "properties", {
  /** @type {String} Socket type: 'input' or 'output' */
  type: { type: String },
  /** @type {String} Socket name/identifier */
  name: { type: String },
  /** @type {String} Display label for the socket */
  label: { type: String },
  /** @type {String} Custom color for the socket */
  color: { type: String },
  /** @type {String} Custom size for the socket */
  size: { type: String },
  /** @type {String} Custom CSS class for additional styling */
  customClass: { type: String, attribute: "custom-class" },
  /** @type {String} Data type this socket accepts/provides */
  dataType: { type: String, attribute: "data-type" }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(nt, "styles", b`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--fg-text, #e2e8f0);
      position: relative;
    }
    
    :host([type="input"]) {
      flex-direction: row;
    }
    
    :host([type="output"]) {
      flex-direction: row-reverse;
    }
    
    flow-socket-anchor {
      flex-shrink: 0;
    }
    
    .socket-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    :host([type="input"]) .socket-label {
      text-align: left;
    }
    
    :host([type="output"]) .socket-label {
      text-align: right;
    }
    
  `);
customElements.define("flow-socket", nt);
class Nt extends S {
  /**
   * Renders the component template.
   * This component acts as a slot container for socket elements.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
  /**
   * Get the socket element within this anchor.
   * 
   * @returns {HTMLElement|null} The socket element
   */
  getSocketElement() {
    return this.querySelector(".socket");
  }
  /**
   * Get the socket ID from the parent flow-socket name attribute.
   * 
   * @returns {string|null} The socket ID
   */
  getSocketId() {
    const t = this.closest("flow-socket");
    return (t == null ? void 0 : t.getAttribute("name")) || null;
  }
  /**
   * Get the socket type (input/output) from the class list.
   * 
   * @returns {string|null} The socket type
   */
  getSocketType() {
    const t = this.getSocketElement();
    return t ? t.classList.contains("in") ? "input" : t.classList.contains("out") ? "output" : null : null;
  }
}
/**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(Nt, "styles", b`
    :host {
      display: inline-block;
      position: relative;
      cursor: crosshair;
    }
    
    ::slotted(.socket) {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid;
      cursor: crosshair;
      transition: all 0.2s ease;
      position: relative;
      z-index: 10;
    }
    
    ::slotted(.socket:hover) {
      transform: scale(1.2);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
    }
    
    ::slotted(.socket.socket-active) {
      transform: scale(1.3);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
    }
    
    ::slotted(.socket.socket-hover) {
      transform: scale(1.1);
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
    }
    
    /* Input socket specific styles */
    ::slotted(.socket.in) {
      border-color: var(--fg-socket-input-border, rgba(59, 130, 246, 0.8));
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.3));
    }
    
    /* Output socket specific styles */
    ::slotted(.socket.out) {
      border-color: var(--fg-socket-output-border, rgba(147, 51, 234, 0.8));
      background: linear-gradient(180deg, rgba(147, 51, 234, 0.6), rgba(147, 51, 234, 0.3));
    }
  `);
customElements.define("flow-socket-anchor", Nt);
class rt extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(rt, "properties", {
  /** @type {String} Source socket identifier (format: nodeId:socketId) */
  from: { type: String },
  /** @type {String} Target socket identifier (format: nodeId:socketId) */
  to: { type: String },
  /** @type {String} Color of the edge */
  color: { type: String },
  /** @type {Number} Width/thickness of the edge */
  width: { type: Number },
  /** @type {String} Animation type for the edge */
  animated: { type: String }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(rt, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-edge", rt);
class Mt extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(Mt, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-definitions", Mt);
class Tt extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(Tt, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-nodes", Tt);
class Pt extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(Pt, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-edges", Pt);
class at extends S {
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return y`<slot></slot>`;
  }
}
/**
 * Lit properties configuration for the component.
 * @static
 * @type {Object}
 */
g(at, "properties", {
  /** @type {String} Type of background: 'grid', 'solid', 'pattern' */
  type: { type: String },
  /** @type {String} Background color */
  color: { type: String }
}), /**
 * CSS styles for the component.
 * @static
 * @type {CSSResult}
 */
g(at, "styles", b`
    :host {
      display: none !important;
    }
  `);
customElements.define("flow-background", at);
export {
  se as Edge,
  at as FlowBackgroundElement,
  et as FlowContextMenu,
  Mt as FlowDefinitionsElement,
  rt as FlowEdgeElement,
  Pt as FlowEdgesElement,
  de as FlowGraph,
  st as FlowGraphElement,
  it as FlowNodeDefElement,
  ot as FlowNodeElement,
  Tt as FlowNodesElement,
  Nt as FlowSocketAnchorElement,
  nt as FlowSocketElement,
  te as Node,
  Q as Socket,
  ae as SpatialGrid,
  ie as Viewport
};
//# sourceMappingURL=flowgraph.es.js.map
