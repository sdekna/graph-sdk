var wt = Object.defineProperty;
var bt = (e, t, n) => t in e ? wt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var G = (e, t, n) => bt(e, typeof t != "symbol" ? t + "" : t, n);
const J = Symbol();
var mt = Array.isArray, gt = Object.isFrozen, Et = Object.defineProperty, De = Object.getOwnPropertyDescriptor, jt = Object.prototype, Ot = Array.prototype, St = Object.getPrototypeOf;
const ue = 2, $t = 4, Tt = 8, Nt = 16, L = 32, kt = 64, F = 128, re = 256, x = 512, M = 1024, V = 2048, Ue = 4096, z = 8192, qt = 1 << 18, T = Symbol("$state"), At = Symbol("$state.frozen");
function xt(e) {
  return e === this.v;
}
function Pt(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Dt(e) {
  return !Pt(e, this.v);
}
function It() {
  throw new Error("effect_update_depth_exceeded");
}
function Rt() {
  throw new Error("state_unsafe_mutation");
}
// @__NO_SIDE_EFFECTS__
function Y(e) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: xt,
    version: 0
  };
}
// @__NO_SIDE_EFFECTS__
function Ie(e) {
  var n;
  const t = /* @__PURE__ */ Y(e);
  return t.equals = Dt, C !== null && C.l !== null && ((n = C.l).s ?? (n.s = [])).push(t), t;
}
function P(e, t) {
  var n = e.v !== J;
  return n && N !== null && we() && N.f & ue && Rt(), e.equals(t) || (e.v = t, e.version = et(), Se(e, M, !0), we() && n && O !== null && O.f & x && !(O.f & L) && (E !== null && E.includes(e) ? (q(O, M), Oe(O)) : R === null ? Bt([e]) : R.push(e))), t;
}
function Ke(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = N;
    Re(null);
    try {
      t.call(null);
    } finally {
      Re(n);
    }
  }
}
function Ct(e, t = !0) {
  var n = !1;
  if ((t || e.f & qt) && e.nodes !== null) {
    for (var r = e.nodes.start, o = e.nodes.end; r !== null; ) {
      var i = r === o ? null : (
        /** @type {import('#client').TemplateNode} */
        r.nextSibling
      );
      r.remove(), r = i;
    }
    n = !0;
  }
  if (je(e, t && !n), le(e, 0), q(e, z), e.transitions)
    for (const a of e.transitions)
      a.stop();
  Ke(e);
  var s = e.parent;
  s !== null && e.f & L && s.first !== null && We(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.parent = e.fn = e.nodes = null;
}
function We(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ze(e) {
  je(e);
  var t = e.deriveds;
  if (t !== null) {
    e.deriveds = null;
    for (var n = 0; n < t.length; n += 1)
      Mt(t[n]);
  }
}
function Xe(e) {
  Ze(e);
  var t = tt(e), n = (Q || e.f & F) && e.deps !== null ? V : x;
  q(e, n), e.equals(t) || (e.v = t, e.version = et(), Se(e, M, !1));
}
function Mt(e) {
  Ze(e), le(e, 0), q(e, z), e.first = e.last = e.deps = e.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  e.fn = null;
}
let oe = !1, ee = !1, he = [], H = 0, N = null;
function Re(e) {
  N = e;
}
let O = null, E = null, j = 0, R = null;
function Bt(e) {
  R = e;
}
let Vt = 0, Q = !1, C = null;
function et() {
  return Vt++;
}
function we() {
  return C !== null && C.l === null;
}
function ce(e) {
  var c;
  var t = e.f, n = (t & M) !== 0;
  if (n)
    return !0;
  var r = (t & F) !== 0, o = (t & re) !== 0;
  if (t & V) {
    var i = e.deps;
    if (i !== null)
      for (var s = i.length, a, u = 0; u < s; u++) {
        var l = i[u];
        !n && ce(
          /** @type {import('#client').Derived} */
          l
        ) && Xe(
          /** @type {import('#client').Derived} **/
          l
        );
        var p = l.version;
        if (r) {
          if (p > /** @type {import('#client').Derived} */
          e.version)
            return !0;
          !Q && !((c = l == null ? void 0 : l.reactions) != null && c.includes(e)) && (l.reactions ?? (l.reactions = [])).push(e);
        } else {
          if (e.f & M)
            return !0;
          o && (p > /** @type {import('#client').Derived} */
          e.version && (n = !0), a = l.reactions, a === null ? l.reactions = [e] : a.includes(e) || a.push(e));
        }
      }
    r || q(e, x), o && (e.f ^= re);
  }
  return n;
}
function Lt(e, t, n) {
  throw e;
}
function tt(e) {
  const t = E, n = j, r = R, o = N, i = Q;
  E = /** @type {null | import('#client').Value[]} */
  null, j = 0, R = null, N = e.f & (L | kt) ? null : e, Q = !ee && (e.f & F) !== 0;
  try {
    let s = (
      /** @type {Function} */
      (0, e.fn)()
    ), a = (
      /** @type {import('#client').Value<unknown>[]} **/
      e.deps
    );
    if (E !== null) {
      let u;
      if (a !== null) {
        const l = a.length, p = j === 0 ? E : a.slice(0, j).concat(E), v = p.length > 16 && l - j > 1 ? new Set(p) : null;
        for (u = j; u < l; u++) {
          const _ = a[u];
          (v !== null ? !v.has(_) : !p.includes(_)) && nt(e, _);
        }
      }
      if (a !== null && j > 0)
        for (a.length = j + E.length, u = 0; u < E.length; u++)
          a[j + u] = E[u];
      else
        e.deps = /** @type {import('#client').Value<V>[]} **/
        a = E;
      if (!Q)
        for (u = j; u < a.length; u++) {
          const l = a[u], p = l.reactions;
          p === null ? l.reactions = [e] : p[p.length - 1] !== e && !p.includes(e) && p.push(e);
        }
    } else a !== null && j < a.length && (le(e, j), a.length = j);
    return s;
  } finally {
    E = t, j = n, R = r, N = o, Q = i;
  }
}
function nt(e, t) {
  const n = t.reactions;
  let r = 0;
  if (n !== null) {
    r = n.length - 1;
    const o = n.indexOf(e);
    o !== -1 && (r === 0 ? t.reactions = null : (n[o] = n[r], n.pop()));
  }
  r === 0 && t.f & ue && (q(t, V), t.f & (F | re) || (t.f ^= re), le(
    /** @type {import('#client').Derived} **/
    t,
    0
  ));
}
function le(e, t) {
  const n = e.deps;
  if (n !== null) {
    const r = t === 0 ? null : n.slice(0, t);
    let o;
    for (o = t; o < n.length; o++) {
      const i = n[o];
      (r === null || !r.includes(i)) && nt(e, i);
    }
  }
}
function je(e, t = !0) {
  let n = e.first;
  e.first = null, e.last = null;
  for (var r; n !== null; )
    r = n.next, Ct(n, t), n = r;
}
function rt(e) {
  var t = e.f;
  if (!(t & z)) {
    q(e, x);
    var n = e.ctx, r = O, o = C;
    O = e, C = n;
    try {
      t & Nt || je(e), Ke(e);
      var i = tt(e);
      e.teardown = typeof i == "function" ? i : null;
    } catch (s) {
      Lt(
        /** @type {Error} */
        s
      );
    } finally {
      O = r, C = o;
    }
  }
}
function Jt() {
  H > 1e3 && (H = 0, It()), H++;
}
function Qt(e) {
  var t = e.length;
  if (t !== 0) {
    Jt();
    var n = ee;
    ee = !0;
    try {
      for (var r = 0; r < t; r++) {
        var o = e[r];
        if (o.first === null && !(o.f & L))
          Ce([o]);
        else {
          var i = [];
          ot(o, i), Ce(i);
        }
      }
    } finally {
      ee = n;
    }
  }
}
function Ce(e) {
  var t = e.length;
  if (t !== 0)
    for (var n = 0; n < t; n++) {
      var r = e[n];
      !(r.f & (z | Ue)) && ce(r) && (rt(r), r.deps === null && r.first === null && r.nodes === null && (r.teardown === null ? We(r) : r.fn = null));
    }
}
function Ft() {
  if (oe = !1, H > 1001)
    return;
  const e = he;
  he = [], Qt(e), oe || (H = 0);
}
function Oe(e) {
  oe || (oe = !0, queueMicrotask(Ft));
  for (var t = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (n & L) {
      if (!(n & x)) return;
      q(t, V);
    }
  }
  he.push(t);
}
function ot(e, t) {
  var n = e.first, r = [];
  e: for (; n !== null; ) {
    var o = n.f, i = (o & (z | Ue)) === 0, s = o & L, a = (o & x) !== 0, u = n.first;
    if (i && (!s || !a)) {
      if (s && q(n, x), o & Tt) {
        if (!s && ce(n) && (rt(n), u = n.first), u !== null) {
          n = u;
          continue;
        }
      } else if (o & $t)
        if (s || a) {
          if (u !== null) {
            n = u;
            continue;
          }
        } else
          r.push(n);
    }
    var l = n.next;
    if (l === null) {
      let v = n.parent;
      for (; v !== null; ) {
        if (e === v)
          break e;
        var p = v.next;
        if (p !== null) {
          n = p;
          continue e;
        }
        v = v.parent;
      }
    }
    n = l;
  }
  for (var c = 0; c < r.length; c++)
    u = r[c], t.push(u), ot(u, t);
}
function I(e) {
  const t = e.f;
  if (t & z)
    return e.v;
  if (N !== null) {
    const n = (N.f & F) !== 0, r = N.deps;
    E === null && r !== null && r[j] === e && !(n && O !== null) ? j++ : (r === null || j === 0 || r[j - 1] !== e) && (E === null ? E = [e] : E[E.length - 1] !== e && !E.includes(e) && E.push(e)), R !== null && O !== null && O.f & x && !(O.f & L) && R.includes(e) && (q(O, M), Oe(O));
  }
  return t & ue && ce(
    /** @type {import('#client').Derived} */
    e
  ) && Xe(
    /** @type {import('#client').Derived} **/
    e
  ), e.v;
}
function Se(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var o = we(), i = r.length, s = 0; s < i; s++) {
      var a = r[s], u = a.f;
      if (!(u & M || (!n || !o) && a === O)) {
        q(a, t);
        var l = (u & V) !== 0, p = (u & F) !== 0;
        (u & x || l && p) && (a.f & ue ? Se(
          /** @type {import('#client').Derived} */
          a,
          V,
          n
        ) : Oe(
          /** @type {import('#client').Effect} */
          a
        ));
      }
    }
}
function zt(e) {
  const t = N;
  try {
    return N = null, e();
  } finally {
    N = t;
  }
}
const Gt = ~(M | V | x);
function q(e, t) {
  e.f = e.f & Gt | t;
}
function B(e, t = !0, n = null, r) {
  if (typeof e == "object" && e != null && !gt(e) && !(At in e)) {
    if (T in e) {
      const i = (
        /** @type {import('#client').ProxyMetadata<T>} */
        e[T]
      );
      if (i.t === e || i.p === e)
        return i.p;
    }
    const o = St(e);
    if (o === jt || o === Ot) {
      const i = new Proxy(e, Ht);
      return Et(e, T, {
        value: (
          /** @type {import('#client').ProxyMetadata} */
          {
            s: /* @__PURE__ */ new Map(),
            v: /* @__PURE__ */ Y(0),
            a: mt(e),
            i: t,
            p: i,
            t: e
          }
        ),
        writable: !0,
        enumerable: !1
      }), i;
    }
  }
  return e;
}
function Me(e, t = 1) {
  P(e, e.v + t);
}
const Ht = {
  defineProperty(e, t, n) {
    if (n.value) {
      const r = e[T], o = r.s.get(t);
      o !== void 0 && P(o, B(n.value, r.i, r));
    }
    return Reflect.defineProperty(e, t, n);
  },
  deleteProperty(e, t) {
    const n = e[T], r = n.s.get(t), o = n.a, i = delete e[t];
    if (o && i) {
      const s = n.s.get("length"), a = e.length - 1;
      s !== void 0 && s.v !== a && P(s, a);
    }
    return r !== void 0 && P(r, J), i && Me(n.v), i;
  },
  get(e, t, n) {
    var i;
    if (t === T)
      return Reflect.get(e, T);
    const r = e[T];
    let o = r.s.get(t);
    if (o === void 0 && (!(t in e) || (i = De(e, t)) != null && i.writable) && (o = (r.i ? Y : Ie)(B(e[t], r.i, r)), r.s.set(t, o)), o !== void 0) {
      const s = I(o);
      return s === J ? void 0 : s;
    }
    return Reflect.get(e, t, n);
  },
  getOwnPropertyDescriptor(e, t) {
    const n = Reflect.getOwnPropertyDescriptor(e, t);
    if (n && "value" in n) {
      const o = e[T].s.get(t);
      o && (n.value = I(o));
    }
    return n;
  },
  has(e, t) {
    var i;
    if (t === T)
      return !0;
    const n = e[T], r = Reflect.has(e, t);
    let o = n.s.get(t);
    return (o !== void 0 || O !== null && (!r || (i = De(e, t)) != null && i.writable)) && (o === void 0 && (o = (n.i ? Y : Ie)(
      r ? B(e[t], n.i, n) : J
    ), n.s.set(t, o)), I(o) === J) ? !1 : r;
  },
  set(e, t, n, r) {
    const o = e[T];
    let i = o.s.get(t);
    i === void 0 && (zt(() => r[t]), i = o.s.get(t)), i !== void 0 && P(i, B(n, o.i, o));
    const s = o.a, a = !(t in e);
    if (s && t === "length")
      for (let u = n; u < e.length; u += 1) {
        const l = o.s.get(u + "");
        l !== void 0 && P(l, J);
      }
    if (e[t] = n, a) {
      if (s) {
        const u = o.s.get("length"), l = e.length;
        u !== void 0 && u.v !== l && P(u, l);
      }
      Me(o.v);
    }
    return !0;
  },
  ownKeys(e) {
    const t = e[T];
    return I(t.v), Reflect.ownKeys(e);
  }
};
class Yt {
  constructor(t, n) {
    G(this, "dbName");
    G(this, "storeName");
    G(this, "db");
    G(this, "initPromise");
    this.dbName = t, this.storeName = n;
  }
  init() {
    return this.initPromise || (this.initPromise = new Promise((t, n) => {
      const r = indexedDB.open(this.dbName);
      r.onupgradeneeded = (o) => {
        this.db = o.target.result, this.db.createObjectStore(this.storeName, { keyPath: "id" });
      }, r.onsuccess = (o) => {
        this.db = o.target.result, t();
      }, r.onerror = (o) => {
        console.log(`Database error: ${o.target.error}`), n(o.target.error);
      };
    })), this.initPromise;
  }
  async get(t) {
    return new Promise((n, r) => {
      var a;
      const o = (a = this.db) == null ? void 0 : a.transaction([this.storeName]), i = o == null ? void 0 : o.objectStore(this.storeName), s = i == null ? void 0 : i.get(t);
      s == null || s.addEventListener("success", (u) => {
        n(u.target.result);
      }), s == null || s.addEventListener("error", (u) => {
        r(u.target.error);
      });
    });
  }
  async set(t) {
    return new Promise((n, r) => {
      var a;
      const o = (a = this.db) == null ? void 0 : a.transaction([this.storeName], "readwrite"), i = o == null ? void 0 : o.objectStore(this.storeName), s = i == null ? void 0 : i.put(t);
      s == null || s.addEventListener("success", () => {
        n();
      }), s == null || s.addEventListener("error", (u) => {
        r(u.target.error);
      });
    });
  }
}
let be = !1;
const fe = new Yt("persistance-database", "main-store"), Ut = !(typeof window > "u");
let K = !1, ie = typeof window > "u" || !(window != null && window.indexedDB) ? "localStorage" : "indexedDB", $e = {
  get: async (e) => ({ value: null }),
  set: async (e) => {
  }
};
async function Kt(e) {
  try {
    switch (e) {
      case "capacitor": {
        const [
          { Capacitor: t },
          { Preferences: n }
        ] = await Promise.all[import("./index-B1OnzyPH.js"), import("./index-BoadrNXu.js")];
        $e = n, K = t.isNativePlatform(), ie = "capacitor";
        break;
      }
      default:
        ie = e;
    }
  } catch (t) {
    console.error("init_states_storage error: ", t);
  }
}
function Te({
  state_name: e = "",
  initial_value: t,
  persist: n = !1,
  mutate_value_fn: r,
  populate_fn: o,
  populate_callback: i,
  on_change: s
}) {
  let a = /* @__PURE__ */ Y(B(t));
  if (typeof window > "u") return {
    value: I(a),
    get_stored_value: async () => null,
    populate_fn: async () => {
    }
  };
  async function u() {
    try {
      if (!e || !n) return null;
      let d = null;
      return K ? d = await nn(e) : ie === "indexedDB" ? (be || await fe.init(), d = await Zt(e)) : d = en(e), d || null;
    } catch (d) {
      return console.error(`Error at get_value function, state: ${e}.`, { error: d }), null;
    }
  }
  n && u().then((d) => {
    d && P(a, B(d));
  }).catch((d) => console.error("error at get_stored_value .catch", { error: d }));
  async function l() {
    if (!o) return null;
    const d = await o();
    return d ? (c(d), d) : null;
  }
  function p(d) {
    const f = d(I(a));
    f && c(f);
  }
  function c(d) {
    const f = r ? r(d, I(a)) : d;
    P(a, B(f)), s && s(f), n && Wt(e, f, ie);
  }
  o && Ut && (i ? i(l) : l());
  const { on_change: v, on_change_handler: _ } = on();
  return {
    get value() {
      return I(a);
    },
    set value(d) {
      c(d), _(d);
    },
    reset: () => c(t),
    get_stored_value: u,
    init: () => {
    },
    on_change: v,
    populate_fn: l,
    update_state: p
  };
}
async function Wt(e, t, n) {
  typeof window > "u" || t === void 0 || (n === "indexedDB" && !be && (await fe.init(), be = !0), K ? await rn({ key: e, value: t }) : n === "indexedDB" ? await Xt({ key: e, value: t }) : tn({ key: e, value: t }));
}
async function Zt(e) {
  const t = await fe.get(e);
  if (!t) return null;
  const { value: n } = t;
  return n;
}
async function Xt({ key: e, value: t }) {
  const n = {
    id: e,
    value: JSON.parse(JSON.stringify(t ?? null))
  };
  return console.log({ type: "set", store: e, insert_document: n }), fe.set(n);
}
function en(e) {
  try {
    if (typeof window > "u") return null;
    const t = localStorage.getItem(e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function tn({ key: e, value: t }) {
  try {
    if (typeof window > "u") return;
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
async function nn(e) {
  try {
    if (typeof window > "u" || !K) return null;
    const n = (await $e.get({ key: e })).value;
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
async function rn({ key: e, value: t }) {
  try {
    if (typeof window > "u" || !K) return;
    await $e.set({ key: e, value: JSON.stringify(t) });
  } catch {
  }
}
function on() {
  const e = /* @__PURE__ */ new Map();
  return {
    on_change: (t, n) => {
      const r = an();
      e.set(r, t);
      const o = () => e.delete(r);
      return n && setTimeout(o, n), () => {
        o();
      };
    },
    on_change_handler: (t) => {
      e.forEach((n, r) => n == null ? void 0 : n(t, () => e.delete(r)));
    }
  };
}
const Be = "abcdefghijklmnopqrstuvwxyz";
function an(e = 10) {
  let t = "";
  const n = Be.length;
  for (let r = 0; r < e; r++)
    t += Be.charAt(Math.floor(Math.random() * n));
  return t;
}
function me(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var r = n.call(e), o, i = [], s;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = r.next()).done; ) i.push(o.value);
  } catch (a) {
    s = { error: a };
  } finally {
    try {
      o && !o.done && (n = r.return) && n.call(r);
    } finally {
      if (s) throw s.error;
    }
  }
  return i;
}
function ge(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, i; r < o; r++)
    (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var Z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function sn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ee = 1 / 0, un = 17976931348623157e292, Ve = NaN, cn = "[object Symbol]", ln = /^\s+|\s+$/g, fn = /^[-+]0x[0-9a-f]+$/i, _n = /^0b[01]+$/i, dn = /^0o[0-7]+$/i, pn = parseInt, vn = typeof Z == "object" && Z && Z.Object === Object && Z, yn = typeof self == "object" && self && self.Object === Object && self, hn = vn || yn || Function("return this")(), wn = Object.prototype, bn = wn.toString, Le = hn.Symbol, Je = Le ? Le.prototype : void 0, Qe = Je ? Je.toString : void 0;
function mn(e, t, n) {
  return e === e && (n !== void 0 && (e = e <= n ? e : n), e = e >= t ? e : t), e;
}
function it(e) {
  if (typeof e == "string")
    return e;
  if (at(e))
    return Qe ? Qe.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Ee ? "-0" : t;
}
function Fe(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function gn(e) {
  return !!e && typeof e == "object";
}
function at(e) {
  return typeof e == "symbol" || gn(e) && bn.call(e) == cn;
}
function En(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = On(e), e === Ee || e === -Ee) {
    var t = e < 0 ? -1 : 1;
    return t * un;
  }
  return e === e ? e : 0;
}
function jn(e) {
  var t = En(e), n = t % 1;
  return t === t ? n ? t - n : t : 0;
}
function On(e) {
  if (typeof e == "number")
    return e;
  if (at(e))
    return Ve;
  if (Fe(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = Fe(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = e.replace(ln, "");
  var n = _n.test(e);
  return n || dn.test(e) ? pn(e.slice(2), n ? 2 : 8) : fn.test(e) ? Ve : +e;
}
function Sn(e) {
  return e == null ? "" : it(e);
}
function $n(e, t, n) {
  return e = Sn(e), n = mn(jn(n), 0, e.length), t = it(t), e.slice(n, n + t.length) == t;
}
var Tn = $n;
const Nn = /* @__PURE__ */ sn(Tn);
function ze(e, t) {
  var n;
  if (!e)
    throw new Error("root type is not provided");
  if (t.length === 0)
    throw new Error("path is empty");
  return t.forEach(function(r) {
    var o = n ? n.type : e;
    if (!o.fields)
      throw new Error("type `".concat(o.name, "` does not have fields"));
    var i = Object.keys(o.fields).filter(function(a) {
      return Nn(a, "on_");
    }).reduce(function(a, u) {
      var l = o.fields && o.fields[u];
      return l && a.push(l.type), a;
    }, [o]), s = null;
    if (i.forEach(function(a) {
      var u = a.fields && a.fields[r];
      u && (s = u);
    }), !s)
      throw new Error("type `".concat(o.name, "` does not have a field `").concat(r, "`"));
    n = s;
  }), n;
}
function te(e, t, n) {
  if (Array.isArray(e)) {
    var r = me(e, 2), o = r[0], i = r[1], s = Object.keys(o);
    if (s.length === 0)
      return te(i, t, n);
    var a = ze(t.root, n);
    return "(".concat(s.map(function(f) {
      t.varCounter++;
      var w = "v".concat(t.varCounter), m = a.args && a.args[f];
      if (!m)
        throw new Error("no typing defined for argument `".concat(f, "` in path `").concat(n.join("."), "`"));
      return t.variables[w] = {
        value: o[f],
        typing: m
      }, "".concat(f, ":$").concat(w);
    }), ")").concat(te(i, t, n));
  } else if (typeof e == "object") {
    var u = e, l = Object.keys(u).filter(function(f) {
      return !!u[f];
    });
    if (l.length === 0)
      throw new Error("field selection should not be empty");
    var p = n.length > 0 ? ze(t.root, n).type : t.root, c = p.scalar, v = void 0;
    if (l.includes("__scalar")) {
      var _ = new Set(Object.keys(u).filter(function(f) {
        return !u[f];
      }));
      c != null && c.length && (t.fragmentCounter++, v = "f".concat(t.fragmentCounter), t.fragments.push("fragment ".concat(v, " on ").concat(p.name, "{").concat(c.filter(function(f) {
        return !_.has(f);
      }).join(","), "}")));
    }
    var d = l.filter(function(f) {
      return !["__scalar", "__name"].includes(f);
    }).map(function(f) {
      var w = te(u[f], t, ge(ge([], me(n), !1), [f], !1));
      if (f.startsWith("on_")) {
        t.fragmentCounter++;
        var m = "f".concat(t.fragmentCounter), S = f.match(/^on_(.+)/);
        if (!S || !S[1])
          throw new Error("match failed");
        return t.fragments.push("fragment ".concat(m, " on ").concat(S[1]).concat(w)), "...".concat(m);
      } else
        return "".concat(f).concat(w);
    }).concat(v ? ["...".concat(v)] : []).join(",");
    return "{".concat(d, "}");
  } else
    return "";
}
function _e(e, t, n) {
  var r = {
    root: t,
    varCounter: 0,
    variables: {},
    fragmentCounter: 0,
    fragments: []
  }, o = te(n, r, []), i = Object.keys(r.variables), s = i.length > 0 ? "(".concat(i.map(function(u) {
    var l = r.variables[u].typing[1];
    return "$".concat(u, ":").concat(l);
  }), ")") : "", a = (n == null ? void 0 : n.__name) || "";
  return {
    query: ge(["".concat(e, " ").concat(a).concat(s).concat(o)], me(r.fragments), !1).join(","),
    variables: Object.keys(r.variables).reduce(function(u, l) {
      return u[l] = r.variables[l].value, u;
    }, {})
  };
}
var st = function() {
  return typeof Symbol == "function";
}, kn = function(e) {
  return st() && !!Symbol[e];
};
st() && !kn("observable") && (Symbol.observable = Symbol("observable"));
function ut(e) {
  try {
    if (typeof require > "u")
      return;
    var t = require("../package.json").version;
    e && e.trim() != t.trim() && console.warn("[WARNING]: gqlts client library has been generated with a different version of '@gqlts/runtime', update both packages to have the same version - package.json: ".concat(t, " - generated with: ").concat(e));
  } catch {
  }
}
var ct = linkTypeMap(types), qn = "3.2.20-beta.228";
ut(qn);
var Ne = function(e) {
  return _e("query", ct.Query, e);
}, ke = function(e) {
  return _e("mutation", ct.Mutation, e);
};
const Ge = "abcdefghijklmnopqrstuvwxyz";
function An(e = 10) {
  let t = "";
  const n = Ge.length;
  for (let r = 0; r < e; r++)
    t += Ge.charAt(Math.floor(Math.random() * n));
  return t;
}
function xn(e) {
  return !(!e || !Array.isArray(e) || !e.length || !(e != null && e[0]));
}
function lt(e, t) {
  return void Object.keys(t).forEach((n) => {
    e[n] instanceof Object && t[n] instanceof Object ? e[n] instanceof Array && t[n] instanceof Array ? e[n] = Array.from(new Set(e[n].concat(t[n]))) : !(e[n] instanceof Array) && !(t[n] instanceof Array) ? lt(e[n], t[n]) : e[n] = t[n] : e[n] = t[n];
  }) || e;
}
function Pn({ rune: e, object: t }) {
  var r;
  const n = e.value.length;
  for (let o = 0; o < n; o++)
    if (((r = e.value[o]) == null ? void 0 : r.id) === (t == null ? void 0 : t.id)) {
      e.value[o] = t;
      return;
    }
  console.log("NOT FOUND... PUSHING"), e.value.push(t);
}
function Dn(e) {
  const t = {};
  for (const n in e)
    e[n] !== void 0 && (t[n] = e[n]);
  return t;
}
const k = {
  random_string: An,
  is_array_valid: xn,
  deep_merge: lt,
  update_array_or_append_rune_using_id: Pn,
  clean_object: Dn
}, ft = /* @__PURE__ */ new Set(), _t = /* @__PURE__ */ new Set(), ve = !(typeof window > "u"), X = k.clean_object, ne = {
  get_jwt_expiration_timestamp: (e) => {
    const t = atob(e.split(".")[1]), n = JSON.parse(t);
    return typeof n.exp == "number" ? n.exp * 1e3 : 0;
  },
  validate_token: (e) => e ? Date.now() < ne.get_jwt_expiration_timestamp(e) : !1
};
function In() {
  let e = null, t = null, n = !1, r, o = "", i;
  const s = Mn({
    initial_value: { user_id: "", access_token: "", refresh_token: "" },
    store_name: "postsdk_tokens"
  });
  function a() {
    const c = s.value;
    if (!c || !c.user_id)
      return s.reset();
    const { access_token: v, refresh_token: _ } = c;
    if (!v || !_)
      return null;
    const d = Date.now(), f = ne.get_jwt_expiration_timestamp(v);
    if (e && clearTimeout(e), d > f) {
      console.log("token expired refreshing now"), e = setTimeout(() => l(), 1);
      return;
    }
    e = setTimeout(() => l(), f - d - 6e4), p(!0), console.log(`token is ok, trying refresh in: ${((f - d - 6e4) / 1e3 / 60).toFixed(2)} minutes`);
  }
  const u = {
    init: (c) => {
      c != null && c.fetch_function && (i = c.fetch_function), c != null && c.auth_endpoint && (o = c.auth_endpoint), o && a();
    },
    sign_in: async (c, v) => {
      try {
        if (!c || !v)
          throw new Error("insufficient function arguments");
        console.log({ AUTH_ENDPOINT: o });
        const _ = `${o}/login`, f = await i({ body: { username: c, password: v }, url: _, clean_object: X });
        if (!f)
          throw new Error("fetch_failed");
        console.log({ fetch_data: f });
        const { data: w, error: m } = f;
        if (m || !w)
          throw new Error("login_credintials_wrong");
        if (console.log({ sign_in_auth_data: w }), s.value = w, t && !await t())
          throw new Error("post_flow_failed");
        return p(!0), { success: !0, error: null };
      } catch (_) {
        return console.error({ error: _ }), p(!1), { success: !1, error: _ };
      }
    },
    sign_up: async (c, v, _) => {
      try {
        if (!c || !v)
          throw new Error("insufficient function arguments");
        const d = `${o}/register`, w = await i({ body: { username: c, password: v, name: _ ?? null }, url: d, clean_object: X });
        if (!w)
          throw new Error("fetch_failed");
        const { data: m, error: S } = w;
        if (S || !m)
          throw new Error(S);
        if (s.value = m, t && !await t())
          throw new Error("post_flow_failed");
        return p(!0), { success: !0, error: null };
      } catch (d) {
        return console.error("error at sign_up: ", { error: d }), p(!1), { success: !1, error: d };
      }
    },
    sign_out: async () => {
      try {
        const c = await u.get_access_token();
        if (!c)
          throw new Error("no access token");
        const v = `${o}/logout`, _ = await i({ access_token: c, url: v, clean_object: X });
        if (!_)
          throw new Error("fetch_failed");
        const { success: d } = _;
        if (!d)
          throw new Error("logout_fail");
        return { success: !0, error: null };
      } catch (c) {
        return console.error(`error in sign_out_handler: ${c}`), { success: !1, error: c };
      } finally {
        s.reset(), p(!1);
      }
    },
    get_user_id: () => s.value.user_id,
    get_access_token: async () => {
      const c = s.value.access_token;
      if (ne.validate_token(c))
        return c;
      const { access_token: v } = await l();
      return v ?? "";
    },
    on_auth: (c) => {
      if (n)
        return c();
      ft.add(c);
    },
    on_change: (c) => {
      _t.add(c);
    }
  };
  async function l() {
    let c = !1;
    try {
      const v = s.value;
      if (!v || !v.user_id)
        throw c = !0, new Error("no_stored_tokens");
      const { access_token: _, refresh_token: d } = v;
      if (!_ || !d)
        throw c = !0, new Error("no_stored_tokens");
      const f = `${o}/refresh`, w = await i({
        url: f,
        access_token: _,
        body: { refresh_token: d },
        clean_object: X
      });
      if (!(w != null && w.data))
        throw new Error("fetch_failed");
      const { data: m, error: S } = w;
      if (S || !(m != null && m.access_token))
        throw new Error(S);
      const A = m.access_token;
      console.log({ perform_refresh_token: m }), s.value.access_token = A, p(!0);
      const h = Date.now(), y = ne.get_jwt_expiration_timestamp(A);
      return e && clearTimeout(e), e = setTimeout(() => l(), y - h - 6e4), { success: !0, error: null, access_token: A };
    } catch (v) {
      return p(!1), e && clearTimeout(e), c || (e = setTimeout(() => l(), 5e3)), { success: !1, error: v, access_token: null };
    }
  }
  async function p(c) {
    const v = JSON.parse(JSON.stringify(n));
    n = c, r && (r.value = c), Cn(c), v === !1 && c === !0 && Rn();
  }
  return {
    ...u,
    tokens_store: s,
    change_auth_state: p,
    auth_state_value: n,
    set post_sign_in_flow(c) {
      t = c;
    },
    get post_sign_in_flow() {
      return t;
    },
    set auth_state_variable(c) {
      r = c;
    },
    get auth_state_variable() {
      return r;
    }
  };
}
function Rn() {
  ft.forEach((e) => e());
}
function Cn(e) {
  _t.forEach((t) => t(e));
}
function Mn({ initial_value: e, store_name: t }) {
  const n = ve ? localStorage.getItem(t) : "";
  let r = n ? JSON.parse(n) : e;
  return {
    get value() {
      return r;
    },
    set value(o) {
      r = o, ve && localStorage.setItem(t, JSON.stringify(r));
    },
    reset: () => {
      r = e, ve && localStorage.setItem(t, JSON.stringify(r));
    }
  };
}
const U = In(), Bn = [], Vn = [], Ln = 200, dt = k.clean_object;
let ae, se, qe = "", Ae;
function Jn(e, t) {
  qe = e, t && (Ae = t);
}
async function xe({ query: e, variables: t = null }) {
  var n;
  try {
    if (!e || typeof e != "string")
      return null;
    const r = Object.assign({}, t !== null ? { query: e, variables: t } : { query: e }), o = await U.get_access_token(), i = await Ae({ url: qe, access_token: o, clean_object: dt, body: r });
    console.log({ call_object: r });
    const s = i == null ? void 0 : i.data;
    if (!s)
      throw console.error((n = i == null ? void 0 : i.data.errors) == null ? void 0 : n[0]), new Error("no_data_returned");
    return console.log(s), s;
  } catch (r) {
    return console.error("error at graphql_call function ", { error: r, query: e }), null;
  }
}
async function Qn({ query: e, variables: t = null }) {
  var n;
  try {
    if (!e || typeof e != "string")
      return null;
    const r = Object.assign({}, t !== null ? { query: e, variables: t } : { query: e }), o = await Ae({ url: qe, clean_object: dt, body: r }), i = o == null ? void 0 : o.data;
    if (!i)
      throw console.error((n = o == null ? void 0 : o.data.errors) == null ? void 0 : n[0]), new Error("no_data_returned");
    return console.log(i), i;
  } catch (r) {
    return console.error("error at graphql_call function ", { error: r, query: e }), null;
  }
}
async function de({ query: e, variables: t = null, is_mutation: n = !1, alias: r }) {
  return new Promise((o, i) => {
    const s = n ? Vn : Bn, a = n ? se : ae, u = n ? vt : pt;
    for (const v of s)
      if (v.options.query === e && JSON.stringify(v.options.variables) === JSON.stringify(t))
        return v.promise.then((_) => {
          o({ [r]: _[v.options.alias] });
        }).catch(i);
    const { promise: l, resolve: p, reject: c } = Promise.withResolvers();
    s.push({ resolve: p, reject: c, options: { query: e, variables: t, is_mutation: n, alias: r }, promise: l }), l.then(o).catch(i), s.length === 1 && (n ? se = He(s, u, a, "mutation") : ae = He(s, u, a, "query"));
  });
}
function Fn(e, t) {
  const n = [...e];
  e.length = 0;
  const r = n.map((i) => ({
    query: i.options.query,
    variables: i.options.variables,
    type: i.options.is_mutation ? "mutation" : "query",
    alias: i.options.alias
  })), o = t(r);
  xe({ query: o.query, variables: o.variables }).then((i) => {
    if (!i)
      return n.forEach((a) => a.reject());
    const s = Object.values(i);
    n.forEach((a, u) => {
      a.options.query;
      const l = { [a.options.alias]: s[u] };
      a.resolve(l);
    });
  }).catch((i) => {
    n.forEach((s) => s.reject(i));
  });
}
function He(e, t, n, r) {
  if (!n)
    return setTimeout(() => {
      console.log("executing timeout"), Fn(e, t), r === "mutation" ? (clearTimeout(se), se = void 0) : (clearTimeout(ae), ae = void 0);
    }, Ln);
}
function pt(e) {
  let t = [], n = {}, r = 1, o = {};
  for (const u of e) {
    if (!u)
      continue;
    const l = u.variables;
    let p = u.query;
    const c = [...p.matchAll(/\$(\w+):\s*([\w!\[\]]+)/g)];
    let v = {};
    for (const f of c)
      v[f[1]] = f[2];
    let _ = {};
    for (const f in l) {
      const w = `var${r}`;
      n[w] = l[f], _[f] = w, o[w] = v[f], r += 1;
    }
    for (const f in _) {
      const w = _[f];
      p = p.replace(new RegExp(`\\$${f}`, "g"), `$${w}`), p = p.replace(new RegExp(`${f}:`, "g"), `${w}:`);
    }
    const d = u.alias ?? k.random_string();
    t.push(p.replace(/query\s*\(\$.*?\)\s*{/, `${d}: `).replace(/query\s*{/, `${d}: `).replace(/}$/, "") + " ");
  }
  const i = Object.keys(n), s = i.map((u) => `$${u}: ${o[u]}`).join(", ");
  return { query: `query ${i.length > 0 ? `(${s})` : ""} {
  ${t.join(`
  `)}
}`, variables: n };
}
function vt(e) {
  let t = [], n = {}, r = 1, o = {};
  for (const a of e) {
    if (!a)
      continue;
    const u = a.variables;
    let l = a.query;
    const p = [...l.matchAll(/\$(\w+):\s*([\w!\[\]]+)/g)];
    let c = {};
    for (const d of p)
      c[d[1]] = d[2];
    let v = {};
    for (const d in u) {
      const f = `var${r}`;
      n[f] = u[d], v[d] = f, o[f] = c[d], r += 1;
    }
    for (const d in v) {
      const f = v[d];
      l = l.replace(new RegExp(`\\$${d}`, "g"), `$${f}`), l = l.replace(new RegExp(`${d}:`, "g"), `${f}:`);
    }
    const _ = a.alias;
    t.push(l.replace(/^mutation\s*\(.*?\)\s*{/, `${_}: `).replace(/}$/, "").trim());
  }
  return { query: `mutation (${Object.keys(n).map((a) => `$${a}: ${o[a]}`).join(", ")}) {
  ${t.join(`
  `)}
}`, variables: n };
}
async function zn(e) {
  if (!k.is_array_valid(e))
    return null;
  const { query: t, variables: n } = pt(e), r = await xe({ query: t, variables: n }), o = Object.values(r);
  if (!k.is_array_valid(o))
    return null;
  const i = o.reduce((s, a, u) => {
    var p;
    return ((p = e[u]) == null ? void 0 : p.type) !== void 0 && (s[u] = a), s;
  }, {});
  return Object.values(i);
}
async function Gn(e) {
  if (!k.is_array_valid(e))
    return null;
  const { query: t, variables: n } = vt(e), r = await xe({ query: t, variables: n }), o = Object.values(r);
  if (!k.is_array_valid(o))
    return null;
  const i = o.reduce((s, a, u) => {
    var p;
    return ((p = e[u]) == null ? void 0 : p.type) !== void 0 && (s[u] = a), s;
  }, {});
  return Object.values(i);
}
var yt = linkTypeMap(types), Hn = "3.2.20-beta.228";
ut(Hn);
var Pe = function(e) {
  return _e("query", yt.Query, e);
}, ht = function(e) {
  return _e("mutation", yt.Mutation, e);
};
function Yn(e, t) {
  const { input: n, return_fields: r } = t, { query: o, variables: i } = ht({
    [e]: [n, r]
  });
  return { query: o, variables: i, type: {} };
}
function Un(e, t) {
  const { query: n, variables: r } = ht({
    [e]: [{ id: t }, { id: !0 }]
  });
  return { query: n, variables: r, type: {} };
}
function Kn(e, t) {
  const { id: n, return_fields: r } = t, { query: o, variables: i } = Pe({
    [e]: [
      { id: n },
      r
    ]
  });
  return { query: o, variables: i, type: {} };
}
function Wn(e, { return_fields: t, options: n }) {
  const { query: r, variables: o } = Pe({
    [e]: n ? [{ ...n }, { ...t }] : t
  });
  return { query: r, variables: o, type: {} };
}
function Zn(e, t) {
  const { query: n, variables: r } = Pe({
    [e]: t
  });
  return { query: n, variables: r, type: {} };
}
const Xn = {
  read: Zn,
  mutate: Yn,
  read_one: Kn,
  read_many: Wn,
  delete_one: Un
};
console.log({ generateQueryOp: Ne, generateMutationOp: ke });
async function er(e, t) {
  const { input: n, return_fields: r } = t, { query: o, variables: i } = ke({
    [e]: [n, r]
  }), s = pe(), a = await de({ query: o, variables: i, alias: s, is_mutation: !0 });
  if (!a)
    return null;
  const u = a == null ? void 0 : a[s];
  return u || null;
}
async function tr(e, t) {
  var a;
  const { query: n, variables: r } = ke({
    [e]: [{ id: t }, { id: !0 }]
  }), o = pe(), i = await de({ query: n, variables: r, alias: o, is_mutation: !0 });
  if (!i)
    return null;
  const s = (a = i == null ? void 0 : i[o]) == null ? void 0 : a.id;
  return s || null;
}
async function nr(e, t) {
  const { id: n, return_fields: r } = t, { query: o, variables: i } = Ne({
    [e]: [
      { id: n },
      r
    ]
  }), s = pe(), a = await de({ query: o, variables: i, alias: s, is_mutation: !1 });
  if (!a)
    return null;
  const u = a == null ? void 0 : a[s];
  return u || null;
}
async function rr(e, { return_fields: t, options: n }) {
  const { query: r, variables: o } = Ne({
    [e]: n ? [{ ...n }, { ...t }] : t
  }), i = pe(), s = await de({ query: r, variables: o, alias: i, is_mutation: !1 });
  if (!s)
    return null;
  const a = s == null ? void 0 : s[i];
  return a || null;
}
const Ye = "abcdefghijklmnopqrstuvwxyz";
function pe(e = 10) {
  let t = "";
  const n = Ye.length;
  for (let r = 0; r < e; r++)
    t += Ye.charAt(Math.floor(Math.random() * n));
  return t;
}
const $ = {
  operations: {
    mutate: er,
    read_one: nr,
    read_many: rr,
    delete_one: tr
  },
  build: Xn,
  batch: {
    queries: zn,
    mutations: Gn
  }
};
function or({ state_name: e, many_q: t, single_q: n, create_q: r, update_q: o, delete_q: i, mutate_value_fn: s, return_fields: a, options: u, options_fn: l, auto_populate: p, persist: c = !1 }) {
  const _ = Te({
    persist: c,
    state_name: e,
    mutate_value_fn: s,
    initial_value: void 0
  });
  async function d(h, y) {
    if (!h)
      return null;
    const b = await $.operations.read_one(n, { id: h, return_fields: y ?? a });
    return b ? (!_.value || !y ? _.value = b : _.value = k.deep_merge(_.value, b), b) : null;
  }
  async function f(h) {
    const y = h != null && h.options ? h == null ? void 0 : h.options : l ? l(_.value) : u;
    if (h && !y)
      return null;
    const b = await $.operations.read_many(t, {
      return_fields: (h == null ? void 0 : h.new_return_fields) ?? a,
      options: y ?? void 0
    });
    return b || null;
  }
  async function w(h) {
    var D, W;
    const y = ((D = _.value) == null ? void 0 : D.id) ?? ((W = await A()) == null ? void 0 : W.id);
    if (!y)
      return null;
    const b = {
      ...h.input,
      pk_columns: { id: y }
    }, g = await $.operations.mutate(o, { input: b, return_fields: h.new_return_fields ?? a });
    return g ? (!_.value || !h.new_return_fields ? _.value = g : _.value = k.deep_merge(_.value, g), g) : null;
  }
  async function m(h) {
    const y = await $.operations.mutate(r, h);
    return y || null;
  }
  async function S(h) {
    return !!await $.operations.delete_one(i, h);
  }
  async function A() {
    const h = await f();
    if (h)
      return h[0] ? (_.value = h[0], h[0]) : null;
  }
  return p && !(typeof window > "u") && U.on_auth(A), {
    ..._,
    populate: A,
    read_one: d,
    update_one: w,
    create_one: m,
    delete_one: S,
    read_many: f,
    get value() {
      return _.value;
    },
    set value(h) {
      _.value = h;
    }
  };
}
function ir({ state_name: e, many_q: t, single_q: n, create_q: r, update_q: o, delete_q: i, mutate_value_fn: s, return_fields: a, options: u, options_fn: l, auto_populate: p, persist: c = !1 }) {
  const _ = Te({ state_name: e, mutate_value_fn: s, initial_value: [], persist: c });
  async function d(y, b) {
    const g = await $.operations.read_one(n, { id: y, return_fields: b ?? a });
    return g ? (Array.isArray(_.value) && k.update_array_or_append_rune_using_id({ rune: _, object: g }), g) : null;
  }
  async function f(y) {
    const b = y != null && y.options ? y == null ? void 0 : y.options : l ? l(_.value) : u;
    if (!b)
      return null;
    const g = await $.operations.read_many(t, {
      return_fields: (y == null ? void 0 : y.new_return_fields) ?? a,
      options: b
    });
    return g || null;
  }
  async function w(y) {
    const b = await $.operations.mutate(o, { input: y.input, return_fields: y.new_return_fields ?? a });
    return b ? (Array.isArray(_.value) && k.update_array_or_append_rune_using_id({ rune: _, object: b }), b) : null;
  }
  async function m(y) {
    const b = await $.operations.mutate(r, { input: y.input, return_fields: y.new_return_fields ?? a });
    return b ? (Array.isArray(_.value) && k.update_array_or_append_rune_using_id({ rune: _, object: b }), b) : null;
  }
  async function S(y) {
    const b = await $.operations.delete_one(i, y);
    return b ? (_.update_state((g) => Array.isArray(g) ? g.filter((D) => D.id !== b) : g), !0) : !1;
  }
  async function A(y) {
    const b = {
      pk_columns: { id: y },
      _set: { is_deleted: !0 }
    }, g = await $.operations.mutate(o, {
      input: b,
      return_fields: { id: !0 }
    });
    return g != null && g.id ? (_.update_state((D) => Array.isArray(D) ? D.filter((W) => W.id !== g.id) : D), !0) : !1;
  }
  async function h() {
    const y = await f();
    return y ? (_.value = y, y) : null;
  }
  return p && !(typeof window > "u") && U.on_auth(h), {
    ..._,
    populate: h,
    read_one: d,
    update_one: w,
    create_one: m,
    delete_one: S,
    read_many: f,
    soft_delete_one: A,
    get value() {
      return _.value;
    },
    set value(y) {
      _.value = y;
    }
  };
}
let ye = async ({ access_token: e, url: t, body: n, clean_object: r }) => {
  let o = r({
    headers: {
      "Content-Type": "application/json",
      Authorization: e ? `Bearer ${e}` : void 0
    },
    body: n ? JSON.stringify(n) : void 0,
    method: n ? "POST" : "GET"
  });
  const i = await fetch(t, o);
  return i.ok ? i.json() : null;
};
function sr({ fetch_function: e, graph_endpoint: t, auth_endpoint: n, storage: r = "indexedDB" }) {
  return e && (ye = e), Kt(r), U.init({ auth_endpoint: n, fetch_function: ye }), Jn(t, ye), {
    unauthorized_call: Qn,
    operations: $.operations,
    build: $.build,
    batch: $.batch,
    auth: U,
    states: {
      create_state: Te,
      create_db_array_state: ir,
      create_db_object_state: or
    }
  };
}
export {
  sr as create_graphdb_client
};
//# sourceMappingURL=graph-sdk.es.js.map
