/*! Capacitor: https://capacitorjs.com/ - MIT License */
const Z = (r) => {
  const e = /* @__PURE__ */ new Map();
  e.set("web", { name: "web" });
  const t = r.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: e
  }, n = (s, a) => {
    t.platforms.set(s, a);
  }, o = (s) => {
    t.platforms.has(s) && (t.currentPlatform = t.platforms.get(s));
  };
  return t.addPlatform = n, t.setPlatform = o, t;
}, N = (r) => r.CapacitorPlatforms = Z(r), D = /* @__PURE__ */ N(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), de = D.addPlatform, ue = D.setPlatform, ee = (r, e) => {
  var t;
  const n = e.config, o = r.Plugins;
  if (!(n != null && n.name))
    throw new Error('Capacitor WebPlugin is using the deprecated "registerWebPlugin()" function, but without the config. Please use "registerPlugin()" instead to register this web plugin."');
  console.warn(`Capacitor plugin "${n.name}" is using the deprecated "registerWebPlugin()" function`), (!o[n.name] || !((t = n == null ? void 0 : n.platforms) === null || t === void 0) && t.includes(r.getPlatform())) && (o[n.name] = e);
};
var L;
(function(r) {
  r.Unimplemented = "UNIMPLEMENTED", r.Unavailable = "UNAVAILABLE";
})(L || (L = {}));
class W extends Error {
  constructor(e, t, n) {
    super(e), this.message = e, this.code = t, this.data = n;
  }
}
const te = (r) => {
  var e, t;
  return r != null && r.androidBridge ? "android" : !((t = (e = r == null ? void 0 : r.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, re = (r) => {
  var e, t, n, o, s;
  const a = r.CapacitorCustomPlatform || null, i = r.Capacitor || {}, f = i.Plugins = i.Plugins || {}, l = r.CapacitorPlatforms, k = () => a !== null ? a.name : te(r), b = ((e = l == null ? void 0 : l.currentPlatform) === null || e === void 0 ? void 0 : e.getPlatform) || k, x = () => b() !== "web", I = ((t = l == null ? void 0 : l.currentPlatform) === null || t === void 0 ? void 0 : t.isNativePlatform) || x, q = (c) => {
    const d = A.get(c);
    return !!(d != null && d.platforms.has(b()) || H(c));
  }, B = ((n = l == null ? void 0 : l.currentPlatform) === null || n === void 0 ? void 0 : n.isPluginAvailable) || q, G = (c) => {
    var d;
    return (d = i.PluginHeaders) === null || d === void 0 ? void 0 : d.find((y) => y.name === c);
  }, H = ((o = l == null ? void 0 : l.currentPlatform) === null || o === void 0 ? void 0 : o.getPluginHeader) || G, K = (c) => r.console.error(c), V = (c, d, y) => Promise.reject(`${y} does not have an implementation of "${d}".`), A = /* @__PURE__ */ new Map(), z = (c, d = {}) => {
    const y = A.get(c);
    if (y)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), y.proxy;
    const w = b(), C = H(c);
    let P;
    const Q = async () => (!P && w in d ? P = typeof d[w] == "function" ? P = await d[w]() : P = d[w] : a !== null && !P && "web" in d && (P = typeof d.web == "function" ? P = await d.web() : P = d.web), P), X = (u, g) => {
      var h, p;
      if (C) {
        const v = C == null ? void 0 : C.methods.find((m) => g === m.name);
        if (v)
          return v.rtype === "promise" ? (m) => i.nativePromise(c, g.toString(), m) : (m, $) => i.nativeCallback(c, g.toString(), m, $);
        if (u)
          return (h = u[g]) === null || h === void 0 ? void 0 : h.bind(u);
      } else {
        if (u)
          return (p = u[g]) === null || p === void 0 ? void 0 : p.bind(u);
        throw new W(`"${c}" plugin is not implemented on ${w}`, L.Unimplemented);
      }
    }, j = (u) => {
      let g;
      const h = (...p) => {
        const v = Q().then((m) => {
          const $ = X(m, u);
          if ($) {
            const O = $(...p);
            return g = O == null ? void 0 : O.remove, O;
          } else
            throw new W(`"${c}.${u}()" is not implemented on ${w}`, L.Unimplemented);
        });
        return u === "addListener" && (v.remove = async () => g()), v;
      };
      return h.toString = () => `${u.toString()}() { [capacitor code] }`, Object.defineProperty(h, "name", {
        value: u,
        writable: !1,
        configurable: !1
      }), h;
    }, S = j("addListener"), T = j("removeListener"), Y = (u, g) => {
      const h = S({ eventName: u }, g), p = async () => {
        const m = await h;
        T({
          eventName: u,
          callbackId: m
        }, g);
      }, v = new Promise((m) => h.then(() => m({ remove: p })));
      return v.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await p();
      }, v;
    }, U = new Proxy({}, {
      get(u, g) {
        switch (g) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return C ? Y : S;
          case "removeListener":
            return T;
          default:
            return j(g);
        }
      }
    });
    return f[c] = U, A.set(c, {
      name: c,
      proxy: U,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(d),
        ...C ? [w] : []
      ])
    }), U;
  }, J = ((s = l == null ? void 0 : l.currentPlatform) === null || s === void 0 ? void 0 : s.registerPlugin) || z;
  return i.convertFileSrc || (i.convertFileSrc = (c) => c), i.getPlatform = b, i.handleError = K, i.isNativePlatform = I, i.isPluginAvailable = B, i.pluginMethodNoop = V, i.registerPlugin = J, i.Exception = W, i.DEBUG = !!i.DEBUG, i.isLoggingEnabled = !!i.isLoggingEnabled, i.platform = i.getPlatform(), i.isNative = i.isNativePlatform(), i;
}, ne = (r) => r.Capacitor = re(r), E = /* @__PURE__ */ ne(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), _ = E.registerPlugin, fe = E.Plugins, ge = (r) => ee(E, r);
class F {
  constructor(e) {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {}, e && (console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`), this.config = e);
  }
  addListener(e, t) {
    let n = !1;
    this.listeners[e] || (this.listeners[e] = [], n = !0), this.listeners[e].push(t);
    const s = this.windowListeners[e];
    s && !s.registered && this.addWindowListener(s), n && this.sendRetainedArgumentsForEvent(e);
    const a = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: a });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, t, n) {
    const o = this.listeners[e];
    if (!o) {
      if (n) {
        let s = this.retainedEventArguments[e];
        s || (s = []), s.push(t), this.retainedEventArguments[e] = s;
      }
      return;
    }
    o.forEach((s) => s(t));
  }
  hasListeners(e) {
    return !!this.listeners[e].length;
  }
  registerWindowListener(e, t) {
    this.windowListeners[t] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: t,
      handler: (n) => {
        this.notifyListeners(t, n);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new E.Exception(e, L.Unimplemented);
  }
  unavailable(e = "not available") {
    return new E.Exception(e, L.Unavailable);
  }
  async removeListener(e, t) {
    const n = this.listeners[e];
    if (!n)
      return;
    const o = n.indexOf(t);
    this.listeners[e].splice(o, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
  }
  addWindowListener(e) {
    window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
  }
  sendRetainedArgumentsForEvent(e) {
    const t = this.retainedEventArguments[e];
    t && (delete this.retainedEventArguments[e], t.forEach((n) => {
      this.notifyListeners(e, n);
    }));
  }
}
const me = /* @__PURE__ */ _("WebView"), R = (r) => encodeURIComponent(r).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), M = (r) => r.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class se extends F {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((n) => {
      if (n.length <= 0)
        return;
      let [o, s] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      o = M(o).trim(), s = M(s).trim(), t[o] = s;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = R(e.key), n = R(e.value), o = `; expires=${(e.expires || "").replace("expires=", "")}`, s = (e.path || "/").replace("path=", ""), a = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${n || ""}${o}; path=${s}; ${a};`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(";") || [];
      for (const t of e)
        document.cookie = t.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
const he = _("CapacitorCookies", {
  web: () => new se()
}), oe = async (r) => new Promise((e, t) => {
  const n = new FileReader();
  n.onload = () => {
    const o = n.result;
    e(o.indexOf(",") >= 0 ? o.split(",")[1] : o);
  }, n.onerror = (o) => t(o), n.readAsDataURL(r);
}), ie = (r = {}) => {
  const e = Object.keys(r);
  return Object.keys(r).map((o) => o.toLocaleLowerCase()).reduce((o, s, a) => (o[s] = r[e[a]], o), {});
}, ae = (r, e = !0) => r ? Object.entries(r).reduce((n, o) => {
  const [s, a] = o;
  let i, f;
  return Array.isArray(a) ? (f = "", a.forEach((l) => {
    i = e ? encodeURIComponent(l) : l, f += `${s}=${i}&`;
  }), f.slice(0, -1)) : (i = e ? encodeURIComponent(a) : a, f = `${s}=${i}`), `${n}&${f}`;
}, "").substr(1) : null, le = (r, e = {}) => {
  const t = Object.assign({ method: r.method || "GET", headers: r.headers }, e), o = ie(r.headers)["content-type"] || "";
  if (typeof r.data == "string")
    t.body = r.data;
  else if (o.includes("application/x-www-form-urlencoded")) {
    const s = new URLSearchParams();
    for (const [a, i] of Object.entries(r.data || {}))
      s.set(a, i);
    t.body = s.toString();
  } else if (o.includes("multipart/form-data") || r.data instanceof FormData) {
    const s = new FormData();
    if (r.data instanceof FormData)
      r.data.forEach((i, f) => {
        s.append(f, i);
      });
    else
      for (const i of Object.keys(r.data))
        s.append(i, r.data[i]);
    t.body = s;
    const a = new Headers(t.headers);
    a.delete("content-type"), t.headers = a;
  } else (o.includes("application/json") || typeof r.data == "object") && (t.body = JSON.stringify(r.data));
  return t;
};
class ce extends F {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = le(e, e.webFetchExtra), n = ae(e.params, e.shouldEncodeUrlParams), o = n ? `${e.url}?${n}` : e.url, s = await fetch(o, t), a = s.headers.get("content-type") || "";
    let { responseType: i = "text" } = s.ok ? e : {};
    a.includes("application/json") && (i = "json");
    let f, l;
    switch (i) {
      case "arraybuffer":
      case "blob":
        l = await s.blob(), f = await oe(l);
        break;
      case "json":
        f = await s.json();
        break;
      case "document":
      case "text":
      default:
        f = await s.text();
    }
    const k = {};
    return s.headers.forEach((b, x) => {
      k[x] = b;
    }), {
      data: f,
      headers: k,
      status: s.status,
      url: s.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "GET" }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "POST" }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PUT" }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PATCH" }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "DELETE" }));
  }
}
const Pe = _("CapacitorHttp", {
  web: () => new ce()
});
export {
  E as Capacitor,
  he as CapacitorCookies,
  W as CapacitorException,
  Pe as CapacitorHttp,
  D as CapacitorPlatforms,
  L as ExceptionCode,
  fe as Plugins,
  F as WebPlugin,
  me as WebView,
  de as addPlatform,
  le as buildRequestInit,
  _ as registerPlugin,
  ge as registerWebPlugin,
  ue as setPlatform
};
//# sourceMappingURL=index-B1OnzyPH.js.map
