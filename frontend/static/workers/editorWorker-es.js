class Vn {
  constructor() {
    this.listeners = [], this.unexpectedErrorHandler = function(t) {
      setTimeout(() => {
        throw t.stack ? he.isErrorNoTelemetry(t) ? new he(t.message + `

` + t.stack) : new Error(t.message + `

` + t.stack) : t;
      }, 0);
    };
  }
  emit(t) {
    this.listeners.forEach((r) => {
      r(t);
    });
  }
  onUnexpectedError(t) {
    this.unexpectedErrorHandler(t), this.emit(t);
  }
  // For external errors, we don't want the listeners to be called
  onUnexpectedExternalError(t) {
    this.unexpectedErrorHandler(t);
  }
}
const Tn = new Vn();
function Bn(e) {
  Un(e) || Tn.onUnexpectedError(e);
}
function ct(e) {
  if (e instanceof Error) {
    const { name: t, message: r } = e, s = e.stacktrace || e.stack;
    return {
      $isError: !0,
      name: t,
      message: r,
      stack: s,
      noTelemetry: he.isErrorNoTelemetry(e)
    };
  }
  return e;
}
const Be = "Canceled";
function Un(e) {
  return e instanceof In ? !0 : e instanceof Error && e.name === Be && e.message === Be;
}
class In extends Error {
  constructor() {
    super(Be), this.name = this.message;
  }
}
class he extends Error {
  constructor(t) {
    super(t), this.name = "ErrorNoTelemetry";
  }
  static fromError(t) {
    if (t instanceof he)
      return t;
    const r = new he();
    return r.message = t.message, r.stack = t.stack, r;
  }
  static isErrorNoTelemetry(t) {
    return t.name === "ErrorNoTelemetry";
  }
}
function qn(e) {
  const t = this;
  let r = !1, s;
  return function() {
    return r || (r = !0, s = e.apply(t, arguments)), s;
  };
}
var Se;
(function(e) {
  function t(p) {
    return p && typeof p == "object" && typeof p[Symbol.iterator] == "function";
  }
  e.is = t;
  const r = Object.freeze([]);
  function s() {
    return r;
  }
  e.empty = s;
  function* i(p) {
    yield p;
  }
  e.single = i;
  function a(p) {
    return p || r;
  }
  e.from = a;
  function o(p) {
    return !p || p[Symbol.iterator]().next().done === !0;
  }
  e.isEmpty = o;
  function l(p) {
    return p[Symbol.iterator]().next().value;
  }
  e.first = l;
  function u(p, S) {
    for (const b of p)
      if (S(b))
        return !0;
    return !1;
  }
  e.some = u;
  function c(p, S) {
    for (const b of p)
      if (S(b))
        return b;
  }
  e.find = c;
  function* f(p, S) {
    for (const b of p)
      S(b) && (yield b);
  }
  e.filter = f;
  function* h(p, S) {
    let b = 0;
    for (const g of p)
      yield S(g, b++);
  }
  e.map = h;
  function* d(...p) {
    for (const S of p)
      for (const b of S)
        yield b;
  }
  e.concat = d;
  function* C(p) {
    for (const S of p)
      for (const b of S)
        yield b;
  }
  e.concatNested = C;
  function v(p, S, b) {
    let g = b;
    for (const m of p)
      g = S(g, m);
    return g;
  }
  e.reduce = v;
  function A(p, S) {
    let b = 0;
    for (const g of p)
      S(g, b++);
  }
  e.forEach = A;
  function* k(p, S, b = p.length) {
    for (S < 0 && (S += p.length), b < 0 ? b += p.length : b > p.length && (b = p.length); S < b; S++)
      yield p[S];
  }
  e.slice = k;
  function R(p, S = Number.POSITIVE_INFINITY) {
    const b = [];
    if (S === 0)
      return [b, p];
    const g = p[Symbol.iterator]();
    for (let m = 0; m < S; m++) {
      const w = g.next();
      if (w.done)
        return [b, e.empty()];
      b.push(w.value);
    }
    return [b, { [Symbol.iterator]() {
      return g;
    } }];
  }
  e.consume = R;
  function P(p) {
    return R(p)[0];
  }
  e.collect = P;
  function y(p, S, b = (g, m) => g === m) {
    const g = p[Symbol.iterator](), m = S[Symbol.iterator]();
    for (; ; ) {
      const w = g.next(), N = m.next();
      if (w.done !== N.done)
        return !1;
      if (w.done)
        return !0;
      if (!b(w.value, N.value))
        return !1;
    }
  }
  e.equals = y;
})(Se || (Se = {}));
class Hn extends Error {
  constructor(t) {
    super(`Encountered errors while disposing of store. Errors: [${t.join(", ")}]`), this.errors = t;
  }
}
function bn(e) {
  if (Se.is(e)) {
    const t = [];
    for (const r of e)
      if (r)
        try {
          r.dispose();
        } catch (s) {
          t.push(s);
        }
    if (t.length === 1)
      throw t[0];
    if (t.length > 1)
      throw new Hn(t);
    return Array.isArray(e) ? [] : e;
  } else if (e)
    return e.dispose(), e;
}
function Wn(...e) {
  return Ae(() => bn(e));
}
function Ae(e) {
  return {
    dispose: qn(() => {
      e();
    })
  };
}
class se {
  constructor() {
    this._toDispose = /* @__PURE__ */ new Set(), this._isDisposed = !1;
  }
  /**
   * Dispose of all registered disposables and mark this object as disposed.
   *
   * Any future disposables added to this object will be disposed of on `add`.
   */
  dispose() {
    this._isDisposed || (this._isDisposed = !0, this.clear());
  }
  /**
   * Returns `true` if this object has been disposed
   */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Dispose of all registered disposables but do not mark this object as disposed.
   */
  clear() {
    try {
      bn(this._toDispose.values());
    } finally {
      this._toDispose.clear();
    }
  }
  add(t) {
    if (!t)
      return t;
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._isDisposed ? se.DISABLE_DISPOSED_WARNING || console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack) : this._toDispose.add(t), t;
  }
}
se.DISABLE_DISPOSED_WARNING = !1;
class st {
  constructor() {
    this._store = new se(), this._store;
  }
  dispose() {
    this._store.dispose();
  }
  _register(t) {
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._store.add(t);
  }
}
st.None = Object.freeze({ dispose() {
} });
class $n {
  constructor() {
    this.dispose = () => {
    }, this.unset = () => {
    }, this.isset = () => !1;
  }
  set(t) {
    let r = t;
    return this.unset = () => r = void 0, this.isset = () => r !== void 0, this.dispose = () => {
      r && (r(), r = void 0);
    }, this;
  }
}
class D {
  constructor(t) {
    this.element = t, this.next = D.Undefined, this.prev = D.Undefined;
  }
}
D.Undefined = new D(void 0);
class ye {
  constructor() {
    this._first = D.Undefined, this._last = D.Undefined, this._size = 0;
  }
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._first === D.Undefined;
  }
  clear() {
    let t = this._first;
    for (; t !== D.Undefined; ) {
      const r = t.next;
      t.prev = D.Undefined, t.next = D.Undefined, t = r;
    }
    this._first = D.Undefined, this._last = D.Undefined, this._size = 0;
  }
  unshift(t) {
    return this._insert(t, !1);
  }
  push(t) {
    return this._insert(t, !0);
  }
  _insert(t, r) {
    const s = new D(t);
    if (this._first === D.Undefined)
      this._first = s, this._last = s;
    else if (r) {
      const a = this._last;
      this._last = s, s.prev = a, a.next = s;
    } else {
      const a = this._first;
      this._first = s, s.next = a, a.prev = s;
    }
    this._size += 1;
    let i = !1;
    return () => {
      i || (i = !0, this._remove(s));
    };
  }
  shift() {
    if (this._first !== D.Undefined) {
      const t = this._first.element;
      return this._remove(this._first), t;
    }
  }
  pop() {
    if (this._last !== D.Undefined) {
      const t = this._last.element;
      return this._remove(this._last), t;
    }
  }
  _remove(t) {
    if (t.prev !== D.Undefined && t.next !== D.Undefined) {
      const r = t.prev;
      r.next = t.next, t.next.prev = r;
    } else
      t.prev === D.Undefined && t.next === D.Undefined ? (this._first = D.Undefined, this._last = D.Undefined) : t.next === D.Undefined ? (this._last = this._last.prev, this._last.next = D.Undefined) : t.prev === D.Undefined && (this._first = this._first.next, this._first.prev = D.Undefined);
    this._size -= 1;
  }
  *[Symbol.iterator]() {
    let t = this._first;
    for (; t !== D.Undefined; )
      yield t.element, t = t.next;
  }
}
globalThis && globalThis.__awaiter;
let zn = typeof document < "u" && document.location && document.location.hash.indexOf("pseudo=true") >= 0;
function Gn(e, t) {
  let r;
  return t.length === 0 ? r = e : r = e.replace(/\{(\d+)\}/g, (s, i) => {
    const a = i[0], o = t[a];
    let l = s;
    return typeof o == "string" ? l = o : (typeof o == "number" || typeof o == "boolean" || o === void 0 || o === null) && (l = String(o)), l;
  }), zn && (r = "［" + r.replace(/[aouei]/g, "$&$&") + "］"), r;
}
function On(e, t, ...r) {
  return Gn(t, r);
}
var xe;
const de = "en";
let Ue = !1, Ie = !1, Ee = !1, wn = !1, pe, Ve = de, jn, Y;
const U = typeof self == "object" ? self : typeof global == "object" ? global : {};
let B;
typeof U.vscode < "u" && typeof U.vscode.process < "u" ? B = U.vscode.process : typeof process < "u" && (B = process);
const Qn = typeof ((xe = B == null ? void 0 : B.versions) === null || xe === void 0 ? void 0 : xe.electron) == "string", Zn = Qn && (B == null ? void 0 : B.type) === "renderer";
if (typeof navigator == "object" && !Zn)
  Y = navigator.userAgent, Ue = Y.indexOf("Windows") >= 0, Ie = Y.indexOf("Macintosh") >= 0, (Y.indexOf("Macintosh") >= 0 || Y.indexOf("iPad") >= 0 || Y.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints > 0, Ee = Y.indexOf("Linux") >= 0, wn = !0, // This call _must_ be done in the file that calls `nls.getConfiguredDefaultLocale`
  // to ensure that the NLS AMD Loader plugin has been loaded and configured.
  // This is because the loader plugin decides what the default locale is based on
  // how it's able to resolve the strings.
  On({ key: "ensureLoaderPluginIsLoaded", comment: ["{Locked}"] }, "_"), pe = de, Ve = pe;
else if (typeof B == "object") {
  Ue = B.platform === "win32", Ie = B.platform === "darwin", Ee = B.platform === "linux", Ee && B.env.SNAP && B.env.SNAP_REVISION, B.env.CI || B.env.BUILD_ARTIFACTSTAGINGDIRECTORY, pe = de, Ve = de;
  const e = B.env.VSCODE_NLS_CONFIG;
  if (e)
    try {
      const t = JSON.parse(e), r = t.availableLanguages["*"];
      pe = t.locale, Ve = r || de, jn = t._translationsConfigFile;
    } catch {
    }
} else
  console.error("Unable to resolve platform.");
const ge = Ue, Yn = Ie;
wn && U.importScripts;
const j = Y, Xn = typeof U.postMessage == "function" && !U.importScripts;
(() => {
  if (Xn) {
    const e = [];
    U.addEventListener("message", (r) => {
      if (r.data && r.data.vscodeScheduleAsyncWork)
        for (let s = 0, i = e.length; s < i; s++) {
          const a = e[s];
          if (a.id === r.data.vscodeScheduleAsyncWork) {
            e.splice(s, 1), a.callback();
            return;
          }
        }
    });
    let t = 0;
    return (r) => {
      const s = ++t;
      e.push({
        id: s,
        callback: r
      }), U.postMessage({ vscodeScheduleAsyncWork: s }, "*");
    };
  }
  return (e) => setTimeout(e);
})();
const Jn = !!(j && j.indexOf("Chrome") >= 0);
j && j.indexOf("Firefox") >= 0;
!Jn && j && j.indexOf("Safari") >= 0;
j && j.indexOf("Edg/") >= 0;
j && j.indexOf("Android") >= 0;
const Kn = U.performance && typeof U.performance.now == "function";
class Pe {
  constructor(t) {
    this._highResolution = Kn && t, this._startTime = this._now(), this._stopTime = -1;
  }
  static create(t = !0) {
    return new Pe(t);
  }
  stop() {
    this._stopTime = this._now();
  }
  elapsed() {
    return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
  }
  _now() {
    return this._highResolution ? U.performance.now() : Date.now();
  }
}
var qe;
(function(e) {
  e.None = () => st.None;
  function t(b) {
    return (g, m = null, w) => {
      let N = !1, L;
      return L = b((_) => {
        if (!N)
          return L ? L.dispose() : N = !0, g.call(m, _);
      }, null, w), N && L.dispose(), L;
    };
  }
  e.once = t;
  function r(b, g, m) {
    return u((w, N = null, L) => b((_) => w.call(N, g(_)), null, L), m);
  }
  e.map = r;
  function s(b, g, m) {
    return u((w, N = null, L) => b((_) => {
      g(_), w.call(N, _);
    }, null, L), m);
  }
  e.forEach = s;
  function i(b, g, m) {
    return u((w, N = null, L) => b((_) => g(_) && w.call(N, _), null, L), m);
  }
  e.filter = i;
  function a(b) {
    return b;
  }
  e.signal = a;
  function o(...b) {
    return (g, m = null, w) => Wn(...b.map((N) => N((L) => g.call(m, L), null, w)));
  }
  e.any = o;
  function l(b, g, m, w) {
    let N = m;
    return r(b, (L) => (N = g(N, L), N), w);
  }
  e.reduce = l;
  function u(b, g) {
    let m;
    const w = {
      onFirstListenerAdd() {
        m = b(N.fire, N);
      },
      onLastListenerRemove() {
        m == null || m.dispose();
      }
    }, N = new O(w);
    return g == null || g.add(N), N.event;
  }
  function c(b, g, m = 100, w = !1, N, L) {
    let _, E, Ce, Fe = 0;
    const Fn = {
      leakWarningThreshold: N,
      onFirstListenerAdd() {
        _ = b((xn) => {
          Fe++, E = g(E, xn), w && !Ce && (_e.fire(E), E = void 0), clearTimeout(Ce), Ce = setTimeout(() => {
            const En = E;
            E = void 0, Ce = void 0, (!w || Fe > 1) && _e.fire(En), Fe = 0;
          }, m);
        });
      },
      onLastListenerRemove() {
        _.dispose();
      }
    }, _e = new O(Fn);
    return L == null || L.add(_e), _e.event;
  }
  e.debounce = c;
  function f(b, g = (w, N) => w === N, m) {
    let w = !0, N;
    return i(b, (L) => {
      const _ = w || !g(L, N);
      return w = !1, N = L, _;
    }, m);
  }
  e.latch = f;
  function h(b, g, m) {
    return [
      e.filter(b, g, m),
      e.filter(b, (w) => !g(w), m)
    ];
  }
  e.split = h;
  function d(b, g = !1, m = []) {
    let w = m.slice(), N = b((E) => {
      w ? w.push(E) : _.fire(E);
    });
    const L = () => {
      w == null || w.forEach((E) => _.fire(E)), w = null;
    }, _ = new O({
      onFirstListenerAdd() {
        N || (N = b((E) => _.fire(E)));
      },
      onFirstListenerDidAdd() {
        w && (g ? setTimeout(L) : L());
      },
      onLastListenerRemove() {
        N && N.dispose(), N = null;
      }
    });
    return _.event;
  }
  e.buffer = d;
  class C {
    constructor(g) {
      this.event = g, this.disposables = new se();
    }
    map(g) {
      return new C(r(this.event, g, this.disposables));
    }
    forEach(g) {
      return new C(s(this.event, g, this.disposables));
    }
    filter(g) {
      return new C(i(this.event, g, this.disposables));
    }
    reduce(g, m) {
      return new C(l(this.event, g, m, this.disposables));
    }
    latch() {
      return new C(f(this.event, void 0, this.disposables));
    }
    debounce(g, m = 100, w = !1, N) {
      return new C(c(this.event, g, m, w, N, this.disposables));
    }
    on(g, m, w) {
      return this.event(g, m, w);
    }
    once(g, m, w) {
      return t(this.event)(g, m, w);
    }
    dispose() {
      this.disposables.dispose();
    }
  }
  function v(b) {
    return new C(b);
  }
  e.chain = v;
  function A(b, g, m = (w) => w) {
    const w = (...E) => _.fire(m(...E)), N = () => b.on(g, w), L = () => b.removeListener(g, w), _ = new O({ onFirstListenerAdd: N, onLastListenerRemove: L });
    return _.event;
  }
  e.fromNodeEventEmitter = A;
  function k(b, g, m = (w) => w) {
    const w = (...E) => _.fire(m(...E)), N = () => b.addEventListener(g, w), L = () => b.removeEventListener(g, w), _ = new O({ onFirstListenerAdd: N, onLastListenerRemove: L });
    return _.event;
  }
  e.fromDOMEventEmitter = k;
  function R(b) {
    return new Promise((g) => t(b)(g));
  }
  e.toPromise = R;
  function P(b, g) {
    return g(void 0), b((m) => g(m));
  }
  e.runAndSubscribe = P;
  function y(b, g) {
    let m = null;
    function w(L) {
      m == null || m.dispose(), m = new se(), g(L, m);
    }
    w(void 0);
    const N = b((L) => w(L));
    return Ae(() => {
      N.dispose(), m == null || m.dispose();
    });
  }
  e.runAndSubscribeWithStore = y;
  class p {
    constructor(g, m) {
      this.obs = g, this._counter = 0, this._hasChanged = !1;
      const w = {
        onFirstListenerAdd: () => {
          g.addObserver(this);
        },
        onLastListenerRemove: () => {
          g.removeObserver(this);
        }
      };
      this.emitter = new O(w), m && m.add(this.emitter);
    }
    beginUpdate(g) {
      this._counter++;
    }
    handleChange(g, m) {
      this._hasChanged = !0;
    }
    endUpdate(g) {
      --this._counter === 0 && this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this.obs.get()));
    }
  }
  function S(b, g) {
    return new p(b, g).emitter.event;
  }
  e.fromObservable = S;
})(qe || (qe = {}));
class De {
  constructor(t) {
    this._listenerCount = 0, this._invocationCount = 0, this._elapsedOverall = 0, this._name = `${t}_${De._idPool++}`;
  }
  start(t) {
    this._stopWatch = new Pe(!0), this._listenerCount = t;
  }
  stop() {
    if (this._stopWatch) {
      const t = this._stopWatch.elapsed();
      this._elapsedOverall += t, this._invocationCount += 1, console.info(`did FIRE ${this._name}: elapsed_ms: ${t.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`), this._stopWatch = void 0;
    }
  }
}
De._idPool = 0;
class it {
  constructor(t) {
    this.value = t;
  }
  static create() {
    var t;
    return new it((t = new Error().stack) !== null && t !== void 0 ? t : "");
  }
  print() {
    console.warn(this.value.split(`
`).slice(2).join(`
`));
  }
}
class er {
  constructor(t, r, s) {
    this.callback = t, this.callbackThis = r, this.stack = s, this.subscription = new $n();
  }
  invoke(t) {
    this.callback.call(this.callbackThis, t);
  }
}
class O {
  constructor(t) {
    var r, s;
    this._disposed = !1, this._options = t, this._leakageMon = void 0, this._perfMon = !((r = this._options) === null || r === void 0) && r._profName ? new De(this._options._profName) : void 0, this._deliveryQueue = (s = this._options) === null || s === void 0 ? void 0 : s.deliveryQueue;
  }
  dispose() {
    var t, r, s, i;
    this._disposed || (this._disposed = !0, this._listeners && this._listeners.clear(), (t = this._deliveryQueue) === null || t === void 0 || t.clear(this), (s = (r = this._options) === null || r === void 0 ? void 0 : r.onLastListenerRemove) === null || s === void 0 || s.call(r), (i = this._leakageMon) === null || i === void 0 || i.dispose());
  }
  /**
   * For the public to allow to subscribe
   * to events from this Emitter
   */
  get event() {
    return this._event || (this._event = (t, r, s) => {
      var i, a, o;
      this._listeners || (this._listeners = new ye());
      const l = this._listeners.isEmpty();
      l && (!((i = this._options) === null || i === void 0) && i.onFirstListenerAdd) && this._options.onFirstListenerAdd(this);
      let u, c;
      this._leakageMon && this._listeners.size >= 30 && (c = it.create(), u = this._leakageMon.check(c, this._listeners.size + 1));
      const f = new er(t, r, c), h = this._listeners.push(f);
      l && (!((a = this._options) === null || a === void 0) && a.onFirstListenerDidAdd) && this._options.onFirstListenerDidAdd(this), !((o = this._options) === null || o === void 0) && o.onListenerDidAdd && this._options.onListenerDidAdd(this, t, r);
      const d = f.subscription.set(() => {
        u == null || u(), this._disposed || (h(), this._options && this._options.onLastListenerRemove && (this._listeners && !this._listeners.isEmpty() || this._options.onLastListenerRemove(this)));
      });
      return s instanceof se ? s.add(d) : Array.isArray(s) && s.push(d), d;
    }), this._event;
  }
  /**
   * To be kept private to fire an event to
   * subscribers
   */
  fire(t) {
    var r, s;
    if (this._listeners) {
      this._deliveryQueue || (this._deliveryQueue = new nr());
      for (const i of this._listeners)
        this._deliveryQueue.push(this, i, t);
      (r = this._perfMon) === null || r === void 0 || r.start(this._deliveryQueue.size), this._deliveryQueue.deliver(), (s = this._perfMon) === null || s === void 0 || s.stop();
    }
  }
}
class tr {
  constructor() {
    this._queue = new ye();
  }
  get size() {
    return this._queue.size;
  }
  push(t, r, s) {
    this._queue.push(new rr(t, r, s));
  }
  clear(t) {
    const r = new ye();
    for (const s of this._queue)
      s.emitter !== t && r.push(s);
    this._queue = r;
  }
  deliver() {
    for (; this._queue.size > 0; ) {
      const t = this._queue.shift();
      try {
        t.listener.invoke(t.event);
      } catch (r) {
        Bn(r);
      }
    }
  }
}
class nr extends tr {
  clear(t) {
    this._queue.clear();
  }
}
class rr {
  constructor(t, r, s) {
    this.emitter = t, this.listener = r, this.event = s;
  }
}
function sr(e) {
  let t = [], r = Object.getPrototypeOf(e);
  for (; Object.prototype !== r; )
    t = t.concat(Object.getOwnPropertyNames(r)), r = Object.getPrototypeOf(r);
  return t;
}
function He(e) {
  const t = [];
  for (const r of sr(e))
    typeof e[r] == "function" && t.push(r);
  return t;
}
function ir(e, t) {
  const r = (i) => function() {
    const a = Array.prototype.slice.call(arguments, 0);
    return t(i, a);
  }, s = {};
  for (const i of e)
    s[i] = r(i);
  return s;
}
function ar(e, t = "Unreachable") {
  throw new Error(t);
}
class or {
  constructor(t) {
    this.fn = t, this.lastCache = void 0, this.lastArgKey = void 0;
  }
  get(t) {
    const r = JSON.stringify(t);
    return this.lastArgKey !== r && (this.lastArgKey = r, this.lastCache = this.fn(t)), this.lastCache;
  }
}
class Cn {
  constructor(t) {
    this.executor = t, this._didRun = !1;
  }
  /**
   * True if the lazy value has been resolved.
   */
  hasValue() {
    return this._didRun;
  }
  /**
   * Get the wrapped value.
   *
   * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
   * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
   */
  getValue() {
    if (!this._didRun)
      try {
        this._value = this.executor();
      } catch (t) {
        this._error = t;
      } finally {
        this._didRun = !0;
      }
    if (this._error)
      throw this._error;
    return this._value;
  }
  /**
   * Get the wrapped value without forcing evaluation.
   */
  get rawValue() {
    return this._value;
  }
}
var _n;
function lr(e) {
  return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
}
function cr(e) {
  return e.split(/\r\n|\r|\n/);
}
function ur(e) {
  for (let t = 0, r = e.length; t < r; t++) {
    const s = e.charCodeAt(t);
    if (s !== 32 && s !== 9)
      return t;
  }
  return -1;
}
function hr(e, t = e.length - 1) {
  for (let r = t; r >= 0; r--) {
    const s = e.charCodeAt(r);
    if (s !== 32 && s !== 9)
      return r;
  }
  return -1;
}
function pn(e) {
  return e >= 65 && e <= 90;
}
function We(e) {
  return 55296 <= e && e <= 56319;
}
function fr(e) {
  return 56320 <= e && e <= 57343;
}
function dr(e, t) {
  return (e - 55296 << 10) + (t - 56320) + 65536;
}
function mr(e, t, r) {
  const s = e.charCodeAt(r);
  if (We(s) && r + 1 < t) {
    const i = e.charCodeAt(r + 1);
    if (fr(i))
      return dr(s, i);
  }
  return s;
}
const gr = /^[\t\n\r\x20-\x7E]*$/;
function br(e) {
  return gr.test(e);
}
class z {
  constructor(t) {
    this.confusableDictionary = t;
  }
  static getInstance(t) {
    return z.cache.get(Array.from(t));
  }
  static getLocales() {
    return z._locales.getValue();
  }
  isAmbiguous(t) {
    return this.confusableDictionary.has(t);
  }
  /**
   * Returns the non basic ASCII code point that the given code point can be confused,
   * or undefined if such code point does note exist.
   */
  getPrimaryConfusable(t) {
    return this.confusableDictionary.get(t);
  }
  getConfusableCodePoints() {
    return new Set(this.confusableDictionary.keys());
  }
}
_n = z;
z.ambiguousCharacterData = new Cn(() => JSON.parse('{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}'));
z.cache = new or((e) => {
  function t(c) {
    const f = /* @__PURE__ */ new Map();
    for (let h = 0; h < c.length; h += 2)
      f.set(c[h], c[h + 1]);
    return f;
  }
  function r(c, f) {
    const h = new Map(c);
    for (const [d, C] of f)
      h.set(d, C);
    return h;
  }
  function s(c, f) {
    if (!c)
      return f;
    const h = /* @__PURE__ */ new Map();
    for (const [d, C] of c)
      f.has(d) && h.set(d, C);
    return h;
  }
  const i = _n.ambiguousCharacterData.getValue();
  let a = e.filter((c) => !c.startsWith("_") && c in i);
  a.length === 0 && (a = ["_default"]);
  let o;
  for (const c of a) {
    const f = t(i[c]);
    o = s(o, f);
  }
  const l = t(i._common), u = r(l, o);
  return new z(u);
});
z._locales = new Cn(() => Object.keys(z.ambiguousCharacterData.getValue()).filter((e) => !e.startsWith("_")));
class K {
  static getRawData() {
    return JSON.parse("[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]");
  }
  static getData() {
    return this._data || (this._data = new Set(K.getRawData())), this._data;
  }
  static isInvisibleCharacter(t) {
    return K.getData().has(t);
  }
  static get codePoints() {
    return K.getData();
  }
}
K._data = void 0;
const wr = "$initialize";
class Cr {
  constructor(t, r, s, i) {
    this.vsWorker = t, this.req = r, this.method = s, this.args = i, this.type = 0;
  }
}
class ut {
  constructor(t, r, s, i) {
    this.vsWorker = t, this.seq = r, this.res = s, this.err = i, this.type = 1;
  }
}
class _r {
  constructor(t, r, s, i) {
    this.vsWorker = t, this.req = r, this.eventName = s, this.arg = i, this.type = 2;
  }
}
class pr {
  constructor(t, r, s) {
    this.vsWorker = t, this.req = r, this.event = s, this.type = 3;
  }
}
class Lr {
  constructor(t, r) {
    this.vsWorker = t, this.req = r, this.type = 4;
  }
}
class Nr {
  constructor(t) {
    this._workerId = -1, this._handler = t, this._lastSentReq = 0, this._pendingReplies = /* @__PURE__ */ Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
  }
  setWorkerId(t) {
    this._workerId = t;
  }
  sendMessage(t, r) {
    const s = String(++this._lastSentReq);
    return new Promise((i, a) => {
      this._pendingReplies[s] = {
        resolve: i,
        reject: a
      }, this._send(new Cr(this._workerId, s, t, r));
    });
  }
  listen(t, r) {
    let s = null;
    const i = new O({
      onFirstListenerAdd: () => {
        s = String(++this._lastSentReq), this._pendingEmitters.set(s, i), this._send(new _r(this._workerId, s, t, r));
      },
      onLastListenerRemove: () => {
        this._pendingEmitters.delete(s), this._send(new Lr(this._workerId, s)), s = null;
      }
    });
    return i.event;
  }
  handleMessage(t) {
    !t || !t.vsWorker || this._workerId !== -1 && t.vsWorker !== this._workerId || this._handleMessage(t);
  }
  _handleMessage(t) {
    switch (t.type) {
      case 1:
        return this._handleReplyMessage(t);
      case 0:
        return this._handleRequestMessage(t);
      case 2:
        return this._handleSubscribeEventMessage(t);
      case 3:
        return this._handleEventMessage(t);
      case 4:
        return this._handleUnsubscribeEventMessage(t);
    }
  }
  _handleReplyMessage(t) {
    if (!this._pendingReplies[t.seq]) {
      console.warn("Got reply to unknown seq");
      return;
    }
    const r = this._pendingReplies[t.seq];
    if (delete this._pendingReplies[t.seq], t.err) {
      let s = t.err;
      t.err.$isError && (s = new Error(), s.name = t.err.name, s.message = t.err.message, s.stack = t.err.stack), r.reject(s);
      return;
    }
    r.resolve(t.res);
  }
  _handleRequestMessage(t) {
    const r = t.req;
    this._handler.handleMessage(t.method, t.args).then((i) => {
      this._send(new ut(this._workerId, r, i, void 0));
    }, (i) => {
      i.detail instanceof Error && (i.detail = ct(i.detail)), this._send(new ut(this._workerId, r, void 0, ct(i)));
    });
  }
  _handleSubscribeEventMessage(t) {
    const r = t.req, s = this._handler.handleEvent(t.eventName, t.arg)((i) => {
      this._send(new pr(this._workerId, r, i));
    });
    this._pendingEvents.set(r, s);
  }
  _handleEventMessage(t) {
    if (!this._pendingEmitters.has(t.req)) {
      console.warn("Got event for unknown req");
      return;
    }
    this._pendingEmitters.get(t.req).fire(t.event);
  }
  _handleUnsubscribeEventMessage(t) {
    if (!this._pendingEvents.has(t.req)) {
      console.warn("Got unsubscribe for unknown req");
      return;
    }
    this._pendingEvents.get(t.req).dispose(), this._pendingEvents.delete(t.req);
  }
  _send(t) {
    const r = [];
    if (t.type === 0)
      for (let s = 0; s < t.args.length; s++)
        t.args[s] instanceof ArrayBuffer && r.push(t.args[s]);
    else
      t.type === 1 && t.res instanceof ArrayBuffer && r.push(t.res);
    this._handler.sendMessage(t, r);
  }
}
function Ln(e) {
  return e[0] === "o" && e[1] === "n" && pn(e.charCodeAt(2));
}
function Nn(e) {
  return /^onDynamic/.test(e) && pn(e.charCodeAt(9));
}
function vr(e, t, r) {
  const s = (o) => function() {
    const l = Array.prototype.slice.call(arguments, 0);
    return t(o, l);
  }, i = (o) => function(l) {
    return r(o, l);
  }, a = {};
  for (const o of e) {
    if (Nn(o)) {
      a[o] = i(o);
      continue;
    }
    if (Ln(o)) {
      a[o] = r(o, void 0);
      continue;
    }
    a[o] = s(o);
  }
  return a;
}
class Sr {
  constructor(t, r) {
    this._requestHandlerFactory = r, this._requestHandler = null, this._protocol = new Nr({
      sendMessage: (s, i) => {
        t(s, i);
      },
      handleMessage: (s, i) => this._handleMessage(s, i),
      handleEvent: (s, i) => this._handleEvent(s, i)
    });
  }
  onmessage(t) {
    this._protocol.handleMessage(t);
  }
  _handleMessage(t, r) {
    if (t === wr)
      return this.initialize(r[0], r[1], r[2], r[3]);
    if (!this._requestHandler || typeof this._requestHandler[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._requestHandler[t].apply(this._requestHandler, r));
    } catch (s) {
      return Promise.reject(s);
    }
  }
  _handleEvent(t, r) {
    if (!this._requestHandler)
      throw new Error("Missing requestHandler");
    if (Nn(t)) {
      const s = this._requestHandler[t].call(this._requestHandler, r);
      if (typeof s != "function")
        throw new Error(`Missing dynamic event ${t} on request handler.`);
      return s;
    }
    if (Ln(t)) {
      const s = this._requestHandler[t];
      if (typeof s != "function")
        throw new Error(`Missing event ${t} on request handler.`);
      return s;
    }
    throw new Error(`Malformed event name ${t}`);
  }
  initialize(t, r, s, i) {
    this._protocol.setWorkerId(t);
    const l = vr(i, (u, c) => this._protocol.sendMessage(u, c), (u, c) => this._protocol.listen(u, c));
    return this._requestHandlerFactory ? (this._requestHandler = this._requestHandlerFactory(l), Promise.resolve(He(this._requestHandler))) : (r && (typeof r.baseUrl < "u" && delete r.baseUrl, typeof r.paths < "u" && typeof r.paths.vs < "u" && delete r.paths.vs, typeof r.trustedTypesPolicy !== void 0 && delete r.trustedTypesPolicy, r.catchError = !0, U.require.config(r)), new Promise((u, c) => {
      const f = U.require;
      f([s], (h) => {
        if (this._requestHandler = h.create(l), !this._requestHandler) {
          c(new Error("No RequestHandler!"));
          return;
        }
        u(He(this._requestHandler));
      }, c);
    }));
  }
}
class X {
  /**
   * Constructs a new DiffChange with the given sequence information
   * and content.
   */
  constructor(t, r, s, i) {
    this.originalStart = t, this.originalLength = r, this.modifiedStart = s, this.modifiedLength = i;
  }
  /**
   * The end point (exclusive) of the change in the original sequence.
   */
  getOriginalEnd() {
    return this.originalStart + this.originalLength;
  }
  /**
   * The end point (exclusive) of the change in the modified sequence.
   */
  getModifiedEnd() {
    return this.modifiedStart + this.modifiedLength;
  }
}
function ht(e, t) {
  return (t << 5) - t + e | 0;
}
function Ar(e, t) {
  t = ht(149417, t);
  for (let r = 0, s = e.length; r < s; r++)
    t = ht(e.charCodeAt(r), t);
  return t;
}
class ft {
  constructor(t) {
    this.source = t;
  }
  getElements() {
    const t = this.source, r = new Int32Array(t.length);
    for (let s = 0, i = t.length; s < i; s++)
      r[s] = t.charCodeAt(s);
    return r;
  }
}
function yr(e, t, r) {
  return new J(new ft(e), new ft(t)).ComputeDiff(r).changes;
}
class ae {
  static Assert(t, r) {
    if (!t)
      throw new Error(r);
  }
}
class oe {
  /**
   * Copies a range of elements from an Array starting at the specified source index and pastes
   * them to another Array starting at the specified destination index. The length and the indexes
   * are specified as 64-bit integers.
   * sourceArray:
   *		The Array that contains the data to copy.
   * sourceIndex:
   *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
   * destinationArray:
   *		The Array that receives the data.
   * destinationIndex:
   *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
   * length:
   *		A 64-bit integer that represents the number of elements to copy.
   */
  static Copy(t, r, s, i, a) {
    for (let o = 0; o < a; o++)
      s[i + o] = t[r + o];
  }
  static Copy2(t, r, s, i, a) {
    for (let o = 0; o < a; o++)
      s[i + o] = t[r + o];
  }
}
class dt {
  /**
   * Constructs a new DiffChangeHelper for the given DiffSequences.
   */
  constructor() {
    this.m_changes = [], this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824, this.m_originalCount = 0, this.m_modifiedCount = 0;
  }
  /**
   * Marks the beginning of the next change in the set of differences.
   */
  MarkNextChange() {
    (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new X(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
  }
  /**
   * Adds the original element at the given position to the elements
   * affected by the current change. The modified index gives context
   * to the change position with respect to the original sequence.
   * @param originalIndex The index of the original element to add.
   * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
   */
  AddOriginalElement(t, r) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, r), this.m_originalCount++;
  }
  /**
   * Adds the modified element at the given position to the elements
   * affected by the current change. The original index gives context
   * to the change position with respect to the modified sequence.
   * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
   * @param modifiedIndex The index of the modified element to add.
   */
  AddModifiedElement(t, r) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, r), this.m_modifiedCount++;
  }
  /**
   * Retrieves all of the changes marked by the class.
   */
  getChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes;
  }
  /**
   * Retrieves all of the changes marked by the class in the reverse order
   */
  getReverseChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes.reverse(), this.m_changes;
  }
}
class J {
  /**
   * Constructs the DiffFinder
   */
  constructor(t, r, s = null) {
    this.ContinueProcessingPredicate = s, this._originalSequence = t, this._modifiedSequence = r;
    const [i, a, o] = J._getElements(t), [l, u, c] = J._getElements(r);
    this._hasStrings = o && c, this._originalStringElements = i, this._originalElementsOrHash = a, this._modifiedStringElements = l, this._modifiedElementsOrHash = u, this.m_forwardHistory = [], this.m_reverseHistory = [];
  }
  static _isStringArray(t) {
    return t.length > 0 && typeof t[0] == "string";
  }
  static _getElements(t) {
    const r = t.getElements();
    if (J._isStringArray(r)) {
      const s = new Int32Array(r.length);
      for (let i = 0, a = r.length; i < a; i++)
        s[i] = Ar(r[i], 0);
      return [r, s, !0];
    }
    return r instanceof Int32Array ? [[], r, !1] : [[], new Int32Array(r), !1];
  }
  ElementsAreEqual(t, r) {
    return this._originalElementsOrHash[t] !== this._modifiedElementsOrHash[r] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._modifiedStringElements[r] : !0;
  }
  ElementsAreStrictEqual(t, r) {
    if (!this.ElementsAreEqual(t, r))
      return !1;
    const s = J._getStrictElement(this._originalSequence, t), i = J._getStrictElement(this._modifiedSequence, r);
    return s === i;
  }
  static _getStrictElement(t, r) {
    return typeof t.getStrictElement == "function" ? t.getStrictElement(r) : null;
  }
  OriginalElementsAreEqual(t, r) {
    return this._originalElementsOrHash[t] !== this._originalElementsOrHash[r] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._originalStringElements[r] : !0;
  }
  ModifiedElementsAreEqual(t, r) {
    return this._modifiedElementsOrHash[t] !== this._modifiedElementsOrHash[r] ? !1 : this._hasStrings ? this._modifiedStringElements[t] === this._modifiedStringElements[r] : !0;
  }
  ComputeDiff(t) {
    return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, t);
  }
  /**
   * Computes the differences between the original and modified input
   * sequences on the bounded range.
   * @returns An array of the differences between the two input sequences.
   */
  _ComputeDiff(t, r, s, i, a) {
    const o = [!1];
    let l = this.ComputeDiffRecursive(t, r, s, i, o);
    return a && (l = this.PrettifyChanges(l)), {
      quitEarly: o[0],
      changes: l
    };
  }
  /**
   * Private helper method which computes the differences on the bounded range
   * recursively.
   * @returns An array of the differences between the two input sequences.
   */
  ComputeDiffRecursive(t, r, s, i, a) {
    for (a[0] = !1; t <= r && s <= i && this.ElementsAreEqual(t, s); )
      t++, s++;
    for (; r >= t && i >= s && this.ElementsAreEqual(r, i); )
      r--, i--;
    if (t > r || s > i) {
      let h;
      return s <= i ? (ae.Assert(t === r + 1, "originalStart should only be one more than originalEnd"), h = [
        new X(t, 0, s, i - s + 1)
      ]) : t <= r ? (ae.Assert(s === i + 1, "modifiedStart should only be one more than modifiedEnd"), h = [
        new X(t, r - t + 1, s, 0)
      ]) : (ae.Assert(t === r + 1, "originalStart should only be one more than originalEnd"), ae.Assert(s === i + 1, "modifiedStart should only be one more than modifiedEnd"), h = []), h;
    }
    const o = [0], l = [0], u = this.ComputeRecursionPoint(t, r, s, i, o, l, a), c = o[0], f = l[0];
    if (u !== null)
      return u;
    if (!a[0]) {
      const h = this.ComputeDiffRecursive(t, c, s, f, a);
      let d = [];
      return a[0] ? d = [
        new X(c + 1, r - (c + 1) + 1, f + 1, i - (f + 1) + 1)
      ] : d = this.ComputeDiffRecursive(c + 1, r, f + 1, i, a), this.ConcatenateChanges(h, d);
    }
    return [
      new X(t, r - t + 1, s, i - s + 1)
    ];
  }
  WALKTRACE(t, r, s, i, a, o, l, u, c, f, h, d, C, v, A, k, R, P) {
    let y = null, p = null, S = new dt(), b = r, g = s, m = C[0] - k[0] - i, w = -1073741824, N = this.m_forwardHistory.length - 1;
    do {
      const L = m + t;
      L === b || L < g && c[L - 1] < c[L + 1] ? (h = c[L + 1], v = h - m - i, h < w && S.MarkNextChange(), w = h, S.AddModifiedElement(h + 1, v), m = L + 1 - t) : (h = c[L - 1] + 1, v = h - m - i, h < w && S.MarkNextChange(), w = h - 1, S.AddOriginalElement(h, v + 1), m = L - 1 - t), N >= 0 && (c = this.m_forwardHistory[N], t = c[0], b = 1, g = c.length - 1);
    } while (--N >= -1);
    if (y = S.getReverseChanges(), P[0]) {
      let L = C[0] + 1, _ = k[0] + 1;
      if (y !== null && y.length > 0) {
        const E = y[y.length - 1];
        L = Math.max(L, E.getOriginalEnd()), _ = Math.max(_, E.getModifiedEnd());
      }
      p = [
        new X(L, d - L + 1, _, A - _ + 1)
      ];
    } else {
      S = new dt(), b = o, g = l, m = C[0] - k[0] - u, w = 1073741824, N = R ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
      do {
        const L = m + a;
        L === b || L < g && f[L - 1] >= f[L + 1] ? (h = f[L + 1] - 1, v = h - m - u, h > w && S.MarkNextChange(), w = h + 1, S.AddOriginalElement(h + 1, v + 1), m = L + 1 - a) : (h = f[L - 1], v = h - m - u, h > w && S.MarkNextChange(), w = h, S.AddModifiedElement(h + 1, v + 1), m = L - 1 - a), N >= 0 && (f = this.m_reverseHistory[N], a = f[0], b = 1, g = f.length - 1);
      } while (--N >= -1);
      p = S.getChanges();
    }
    return this.ConcatenateChanges(y, p);
  }
  /**
   * Given the range to compute the diff on, this method finds the point:
   * (midOriginal, midModified)
   * that exists in the middle of the LCS of the two sequences and
   * is the point at which the LCS problem may be broken down recursively.
   * This method will try to keep the LCS trace in memory. If the LCS recursion
   * point is calculated and the full trace is available in memory, then this method
   * will return the change list.
   * @param originalStart The start bound of the original sequence range
   * @param originalEnd The end bound of the original sequence range
   * @param modifiedStart The start bound of the modified sequence range
   * @param modifiedEnd The end bound of the modified sequence range
   * @param midOriginal The middle point of the original sequence range
   * @param midModified The middle point of the modified sequence range
   * @returns The diff changes, if available, otherwise null
   */
  ComputeRecursionPoint(t, r, s, i, a, o, l) {
    let u = 0, c = 0, f = 0, h = 0, d = 0, C = 0;
    t--, s--, a[0] = 0, o[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
    const v = r - t + (i - s), A = v + 1, k = new Int32Array(A), R = new Int32Array(A), P = i - s, y = r - t, p = t - s, S = r - i, g = (y - P) % 2 === 0;
    k[P] = t, R[y] = r, l[0] = !1;
    for (let m = 1; m <= v / 2 + 1; m++) {
      let w = 0, N = 0;
      f = this.ClipDiagonalBound(P - m, m, P, A), h = this.ClipDiagonalBound(P + m, m, P, A);
      for (let _ = f; _ <= h; _ += 2) {
        _ === f || _ < h && k[_ - 1] < k[_ + 1] ? u = k[_ + 1] : u = k[_ - 1] + 1, c = u - (_ - P) - p;
        const E = u;
        for (; u < r && c < i && this.ElementsAreEqual(u + 1, c + 1); )
          u++, c++;
        if (k[_] = u, u + c > w + N && (w = u, N = c), !g && Math.abs(_ - y) <= m - 1 && u >= R[_])
          return a[0] = u, o[0] = c, E <= R[_] && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(P, f, h, p, y, d, C, S, k, R, u, r, a, c, i, o, g, l) : null;
      }
      const L = (w - t + (N - s) - m) / 2;
      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(w, L))
        return l[0] = !0, a[0] = w, o[0] = N, L > 0 && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(P, f, h, p, y, d, C, S, k, R, u, r, a, c, i, o, g, l) : (t++, s++, [
          new X(t, r - t + 1, s, i - s + 1)
        ]);
      d = this.ClipDiagonalBound(y - m, m, y, A), C = this.ClipDiagonalBound(y + m, m, y, A);
      for (let _ = d; _ <= C; _ += 2) {
        _ === d || _ < C && R[_ - 1] >= R[_ + 1] ? u = R[_ + 1] - 1 : u = R[_ - 1], c = u - (_ - y) - S;
        const E = u;
        for (; u > t && c > s && this.ElementsAreEqual(u, c); )
          u--, c--;
        if (R[_] = u, g && Math.abs(_ - P) <= m && u <= k[_])
          return a[0] = u, o[0] = c, E >= k[_] && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(P, f, h, p, y, d, C, S, k, R, u, r, a, c, i, o, g, l) : null;
      }
      if (m <= 1447) {
        let _ = new Int32Array(h - f + 2);
        _[0] = P - f + 1, oe.Copy2(k, f, _, 1, h - f + 1), this.m_forwardHistory.push(_), _ = new Int32Array(C - d + 2), _[0] = y - d + 1, oe.Copy2(R, d, _, 1, C - d + 1), this.m_reverseHistory.push(_);
      }
    }
    return this.WALKTRACE(P, f, h, p, y, d, C, S, k, R, u, r, a, c, i, o, g, l);
  }
  /**
   * Shifts the given changes to provide a more intuitive diff.
   * While the first element in a diff matches the first element after the diff,
   * we shift the diff down.
   *
   * @param changes The list of changes to shift
   * @returns The shifted changes
   */
  PrettifyChanges(t) {
    for (let r = 0; r < t.length; r++) {
      const s = t[r], i = r < t.length - 1 ? t[r + 1].originalStart : this._originalElementsOrHash.length, a = r < t.length - 1 ? t[r + 1].modifiedStart : this._modifiedElementsOrHash.length, o = s.originalLength > 0, l = s.modifiedLength > 0;
      for (; s.originalStart + s.originalLength < i && s.modifiedStart + s.modifiedLength < a && (!o || this.OriginalElementsAreEqual(s.originalStart, s.originalStart + s.originalLength)) && (!l || this.ModifiedElementsAreEqual(s.modifiedStart, s.modifiedStart + s.modifiedLength)); ) {
        const c = this.ElementsAreStrictEqual(s.originalStart, s.modifiedStart);
        if (this.ElementsAreStrictEqual(s.originalStart + s.originalLength, s.modifiedStart + s.modifiedLength) && !c)
          break;
        s.originalStart++, s.modifiedStart++;
      }
      const u = [null];
      if (r < t.length - 1 && this.ChangesOverlap(t[r], t[r + 1], u)) {
        t[r] = u[0], t.splice(r + 1, 1), r--;
        continue;
      }
    }
    for (let r = t.length - 1; r >= 0; r--) {
      const s = t[r];
      let i = 0, a = 0;
      if (r > 0) {
        const h = t[r - 1];
        i = h.originalStart + h.originalLength, a = h.modifiedStart + h.modifiedLength;
      }
      const o = s.originalLength > 0, l = s.modifiedLength > 0;
      let u = 0, c = this._boundaryScore(s.originalStart, s.originalLength, s.modifiedStart, s.modifiedLength);
      for (let h = 1; ; h++) {
        const d = s.originalStart - h, C = s.modifiedStart - h;
        if (d < i || C < a || o && !this.OriginalElementsAreEqual(d, d + s.originalLength) || l && !this.ModifiedElementsAreEqual(C, C + s.modifiedLength))
          break;
        const A = (d === i && C === a ? 5 : 0) + this._boundaryScore(d, s.originalLength, C, s.modifiedLength);
        A > c && (c = A, u = h);
      }
      s.originalStart -= u, s.modifiedStart -= u;
      const f = [null];
      if (r > 0 && this.ChangesOverlap(t[r - 1], t[r], f)) {
        t[r - 1] = f[0], t.splice(r, 1), r++;
        continue;
      }
    }
    if (this._hasStrings)
      for (let r = 1, s = t.length; r < s; r++) {
        const i = t[r - 1], a = t[r], o = a.originalStart - i.originalStart - i.originalLength, l = i.originalStart, u = a.originalStart + a.originalLength, c = u - l, f = i.modifiedStart, h = a.modifiedStart + a.modifiedLength, d = h - f;
        if (o < 5 && c < 20 && d < 20) {
          const C = this._findBetterContiguousSequence(l, c, f, d, o);
          if (C) {
            const [v, A] = C;
            (v !== i.originalStart + i.originalLength || A !== i.modifiedStart + i.modifiedLength) && (i.originalLength = v - i.originalStart, i.modifiedLength = A - i.modifiedStart, a.originalStart = v + o, a.modifiedStart = A + o, a.originalLength = u - a.originalStart, a.modifiedLength = h - a.modifiedStart);
          }
        }
      }
    return t;
  }
  _findBetterContiguousSequence(t, r, s, i, a) {
    if (r < a || i < a)
      return null;
    const o = t + r - a + 1, l = s + i - a + 1;
    let u = 0, c = 0, f = 0;
    for (let h = t; h < o; h++)
      for (let d = s; d < l; d++) {
        const C = this._contiguousSequenceScore(h, d, a);
        C > 0 && C > u && (u = C, c = h, f = d);
      }
    return u > 0 ? [c, f] : null;
  }
  _contiguousSequenceScore(t, r, s) {
    let i = 0;
    for (let a = 0; a < s; a++) {
      if (!this.ElementsAreEqual(t + a, r + a))
        return 0;
      i += this._originalStringElements[t + a].length;
    }
    return i;
  }
  _OriginalIsBoundary(t) {
    return t <= 0 || t >= this._originalElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._originalStringElements[t]);
  }
  _OriginalRegionIsBoundary(t, r) {
    if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1))
      return !0;
    if (r > 0) {
      const s = t + r;
      if (this._OriginalIsBoundary(s - 1) || this._OriginalIsBoundary(s))
        return !0;
    }
    return !1;
  }
  _ModifiedIsBoundary(t) {
    return t <= 0 || t >= this._modifiedElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[t]);
  }
  _ModifiedRegionIsBoundary(t, r) {
    if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1))
      return !0;
    if (r > 0) {
      const s = t + r;
      if (this._ModifiedIsBoundary(s - 1) || this._ModifiedIsBoundary(s))
        return !0;
    }
    return !1;
  }
  _boundaryScore(t, r, s, i) {
    const a = this._OriginalRegionIsBoundary(t, r) ? 1 : 0, o = this._ModifiedRegionIsBoundary(s, i) ? 1 : 0;
    return a + o;
  }
  /**
   * Concatenates the two input DiffChange lists and returns the resulting
   * list.
   * @param The left changes
   * @param The right changes
   * @returns The concatenated list
   */
  ConcatenateChanges(t, r) {
    const s = [];
    if (t.length === 0 || r.length === 0)
      return r.length > 0 ? r : t;
    if (this.ChangesOverlap(t[t.length - 1], r[0], s)) {
      const i = new Array(t.length + r.length - 1);
      return oe.Copy(t, 0, i, 0, t.length - 1), i[t.length - 1] = s[0], oe.Copy(r, 1, i, t.length, r.length - 1), i;
    } else {
      const i = new Array(t.length + r.length);
      return oe.Copy(t, 0, i, 0, t.length), oe.Copy(r, 0, i, t.length, r.length), i;
    }
  }
  /**
   * Returns true if the two changes overlap and can be merged into a single
   * change
   * @param left The left change
   * @param right The right change
   * @param mergedChange The merged change if the two overlap, null otherwise
   * @returns True if the two changes overlap
   */
  ChangesOverlap(t, r, s) {
    if (ae.Assert(t.originalStart <= r.originalStart, "Left change is not less than or equal to right change"), ae.Assert(t.modifiedStart <= r.modifiedStart, "Left change is not less than or equal to right change"), t.originalStart + t.originalLength >= r.originalStart || t.modifiedStart + t.modifiedLength >= r.modifiedStart) {
      const i = t.originalStart;
      let a = t.originalLength;
      const o = t.modifiedStart;
      let l = t.modifiedLength;
      return t.originalStart + t.originalLength >= r.originalStart && (a = r.originalStart + r.originalLength - t.originalStart), t.modifiedStart + t.modifiedLength >= r.modifiedStart && (l = r.modifiedStart + r.modifiedLength - t.modifiedStart), s[0] = new X(i, a, o, l), !0;
    } else
      return s[0] = null, !1;
  }
  /**
   * Helper method used to clip a diagonal index to the range of valid
   * diagonals. This also decides whether or not the diagonal index,
   * if it exceeds the boundary, should be clipped to the boundary or clipped
   * one inside the boundary depending on the Even/Odd status of the boundary
   * and numDifferences.
   * @param diagonal The index of the diagonal to clip.
   * @param numDifferences The current number of differences being iterated upon.
   * @param diagonalBaseIndex The base reference diagonal.
   * @param numDiagonals The total number of diagonals.
   * @returns The clipped diagonal index.
   */
  ClipDiagonalBound(t, r, s, i) {
    if (t >= 0 && t < i)
      return t;
    const a = s, o = i - s - 1, l = r % 2 === 0;
    if (t < 0) {
      const u = a % 2 === 0;
      return l === u ? 0 : 1;
    } else {
      const u = o % 2 === 0;
      return l === u ? i - 1 : i - 2;
    }
  }
}
let ue;
if (typeof U.vscode < "u" && typeof U.vscode.process < "u") {
  const e = U.vscode.process;
  ue = {
    get platform() {
      return e.platform;
    },
    get arch() {
      return e.arch;
    },
    get env() {
      return e.env;
    },
    cwd() {
      return e.cwd();
    }
  };
} else
  typeof process < "u" ? ue = {
    get platform() {
      return process.platform;
    },
    get arch() {
      return process.arch;
    },
    get env() {
      return process.env;
    },
    cwd() {
      return process.env.VSCODE_CWD || process.cwd();
    }
  } : ue = {
    // Supported
    get platform() {
      return ge ? "win32" : Yn ? "darwin" : "linux";
    },
    get arch() {
    },
    // Unsupported
    get env() {
      return {};
    },
    cwd() {
      return "/";
    }
  };
const $e = ue.cwd, kr = ue.env, ie = ue.platform, Mr = 65, Rr = 97, Pr = 90, Dr = 122, ee = 46, T = 47, q = 92, Q = 58, Fr = 63;
class vn extends Error {
  constructor(t, r, s) {
    let i;
    typeof r == "string" && r.indexOf("not ") === 0 ? (i = "must not be", r = r.replace(/^not /, "")) : i = "must be";
    const a = t.indexOf(".") !== -1 ? "property" : "argument";
    let o = `The "${t}" ${a} ${i} of type ${r}`;
    o += `. Received type ${typeof s}`, super(o), this.code = "ERR_INVALID_ARG_TYPE";
  }
}
function V(e, t) {
  if (typeof e != "string")
    throw new vn(t, "string", e);
}
function M(e) {
  return e === T || e === q;
}
function ze(e) {
  return e === T;
}
function Z(e) {
  return e >= Mr && e <= Pr || e >= Rr && e <= Dr;
}
function ke(e, t, r, s) {
  let i = "", a = 0, o = -1, l = 0, u = 0;
  for (let c = 0; c <= e.length; ++c) {
    if (c < e.length)
      u = e.charCodeAt(c);
    else {
      if (s(u))
        break;
      u = T;
    }
    if (s(u)) {
      if (!(o === c - 1 || l === 1))
        if (l === 2) {
          if (i.length < 2 || a !== 2 || i.charCodeAt(i.length - 1) !== ee || i.charCodeAt(i.length - 2) !== ee) {
            if (i.length > 2) {
              const f = i.lastIndexOf(r);
              f === -1 ? (i = "", a = 0) : (i = i.slice(0, f), a = i.length - 1 - i.lastIndexOf(r)), o = c, l = 0;
              continue;
            } else if (i.length !== 0) {
              i = "", a = 0, o = c, l = 0;
              continue;
            }
          }
          t && (i += i.length > 0 ? `${r}..` : "..", a = 2);
        } else
          i.length > 0 ? i += `${r}${e.slice(o + 1, c)}` : i = e.slice(o + 1, c), a = c - o - 1;
      o = c, l = 0;
    } else
      u === ee && l !== -1 ? ++l : l = -1;
  }
  return i;
}
function Sn(e, t) {
  if (t === null || typeof t != "object")
    throw new vn("pathObject", "Object", t);
  const r = t.dir || t.root, s = t.base || `${t.name || ""}${t.ext || ""}`;
  return r ? r === t.root ? `${r}${s}` : `${r}${e}${s}` : s;
}
const I = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", r = "", s = !1;
    for (let i = e.length - 1; i >= -1; i--) {
      let a;
      if (i >= 0) {
        if (a = e[i], V(a, "path"), a.length === 0)
          continue;
      } else
        t.length === 0 ? a = $e() : (a = kr[`=${t}`] || $e(), (a === void 0 || a.slice(0, 2).toLowerCase() !== t.toLowerCase() && a.charCodeAt(2) === q) && (a = `${t}\\`));
      const o = a.length;
      let l = 0, u = "", c = !1;
      const f = a.charCodeAt(0);
      if (o === 1)
        M(f) && (l = 1, c = !0);
      else if (M(f))
        if (c = !0, M(a.charCodeAt(1))) {
          let h = 2, d = h;
          for (; h < o && !M(a.charCodeAt(h)); )
            h++;
          if (h < o && h !== d) {
            const C = a.slice(d, h);
            for (d = h; h < o && M(a.charCodeAt(h)); )
              h++;
            if (h < o && h !== d) {
              for (d = h; h < o && !M(a.charCodeAt(h)); )
                h++;
              (h === o || h !== d) && (u = `\\\\${C}\\${a.slice(d, h)}`, l = h);
            }
          }
        } else
          l = 1;
      else
        Z(f) && a.charCodeAt(1) === Q && (u = a.slice(0, 2), l = 2, o > 2 && M(a.charCodeAt(2)) && (c = !0, l = 3));
      if (u.length > 0)
        if (t.length > 0) {
          if (u.toLowerCase() !== t.toLowerCase())
            continue;
        } else
          t = u;
      if (s) {
        if (t.length > 0)
          break;
      } else if (r = `${a.slice(l)}\\${r}`, s = c, c && t.length > 0)
        break;
    }
    return r = ke(r, !s, "\\", M), s ? `${t}\\${r}` : `${t}${r}` || ".";
  },
  normalize(e) {
    V(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let r = 0, s, i = !1;
    const a = e.charCodeAt(0);
    if (t === 1)
      return ze(a) ? "\\" : e;
    if (M(a))
      if (i = !0, M(e.charCodeAt(1))) {
        let l = 2, u = l;
        for (; l < t && !M(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== u) {
          const c = e.slice(u, l);
          for (u = l; l < t && M(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== u) {
            for (u = l; l < t && !M(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return `\\\\${c}\\${e.slice(u)}\\`;
            l !== u && (s = `\\\\${c}\\${e.slice(u, l)}`, r = l);
          }
        }
      } else
        r = 1;
    else
      Z(a) && e.charCodeAt(1) === Q && (s = e.slice(0, 2), r = 2, t > 2 && M(e.charCodeAt(2)) && (i = !0, r = 3));
    let o = r < t ? ke(e.slice(r), !i, "\\", M) : "";
    return o.length === 0 && !i && (o = "."), o.length > 0 && M(e.charCodeAt(t - 1)) && (o += "\\"), s === void 0 ? i ? `\\${o}` : o : i ? `${s}\\${o}` : `${s}${o}`;
  },
  isAbsolute(e) {
    V(e, "path");
    const t = e.length;
    if (t === 0)
      return !1;
    const r = e.charCodeAt(0);
    return M(r) || // Possible device root
    t > 2 && Z(r) && e.charCodeAt(1) === Q && M(e.charCodeAt(2));
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t, r;
    for (let a = 0; a < e.length; ++a) {
      const o = e[a];
      V(o, "path"), o.length > 0 && (t === void 0 ? t = r = o : t += `\\${o}`);
    }
    if (t === void 0)
      return ".";
    let s = !0, i = 0;
    if (typeof r == "string" && M(r.charCodeAt(0))) {
      ++i;
      const a = r.length;
      a > 1 && M(r.charCodeAt(1)) && (++i, a > 2 && (M(r.charCodeAt(2)) ? ++i : s = !1));
    }
    if (s) {
      for (; i < t.length && M(t.charCodeAt(i)); )
        i++;
      i >= 2 && (t = `\\${t.slice(i)}`);
    }
    return I.normalize(t);
  },
  // It will solve the relative path from `from` to `to`, for instance:
  //  from = 'C:\\orandea\\test\\aaa'
  //  to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  relative(e, t) {
    if (V(e, "from"), V(t, "to"), e === t)
      return "";
    const r = I.resolve(e), s = I.resolve(t);
    if (r === s || (e = r.toLowerCase(), t = s.toLowerCase(), e === t))
      return "";
    let i = 0;
    for (; i < e.length && e.charCodeAt(i) === q; )
      i++;
    let a = e.length;
    for (; a - 1 > i && e.charCodeAt(a - 1) === q; )
      a--;
    const o = a - i;
    let l = 0;
    for (; l < t.length && t.charCodeAt(l) === q; )
      l++;
    let u = t.length;
    for (; u - 1 > l && t.charCodeAt(u - 1) === q; )
      u--;
    const c = u - l, f = o < c ? o : c;
    let h = -1, d = 0;
    for (; d < f; d++) {
      const v = e.charCodeAt(i + d);
      if (v !== t.charCodeAt(l + d))
        break;
      v === q && (h = d);
    }
    if (d !== f) {
      if (h === -1)
        return s;
    } else {
      if (c > f) {
        if (t.charCodeAt(l + d) === q)
          return s.slice(l + d + 1);
        if (d === 2)
          return s.slice(l + d);
      }
      o > f && (e.charCodeAt(i + d) === q ? h = d : d === 2 && (h = 3)), h === -1 && (h = 0);
    }
    let C = "";
    for (d = i + h + 1; d <= a; ++d)
      (d === a || e.charCodeAt(d) === q) && (C += C.length === 0 ? ".." : "\\..");
    return l += h, C.length > 0 ? `${C}${s.slice(l, u)}` : (s.charCodeAt(l) === q && ++l, s.slice(l, u));
  },
  toNamespacedPath(e) {
    if (typeof e != "string")
      return e;
    if (e.length === 0)
      return "";
    const t = I.resolve(e);
    if (t.length <= 2)
      return e;
    if (t.charCodeAt(0) === q) {
      if (t.charCodeAt(1) === q) {
        const r = t.charCodeAt(2);
        if (r !== Fr && r !== ee)
          return `\\\\?\\UNC\\${t.slice(2)}`;
      }
    } else if (Z(t.charCodeAt(0)) && t.charCodeAt(1) === Q && t.charCodeAt(2) === q)
      return `\\\\?\\${t}`;
    return e;
  },
  dirname(e) {
    V(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let r = -1, s = 0;
    const i = e.charCodeAt(0);
    if (t === 1)
      return M(i) ? e : ".";
    if (M(i)) {
      if (r = s = 1, M(e.charCodeAt(1))) {
        let l = 2, u = l;
        for (; l < t && !M(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== u) {
          for (u = l; l < t && M(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== u) {
            for (u = l; l < t && !M(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return e;
            l !== u && (r = s = l + 1);
          }
        }
      }
    } else
      Z(i) && e.charCodeAt(1) === Q && (r = t > 2 && M(e.charCodeAt(2)) ? 3 : 2, s = r);
    let a = -1, o = !0;
    for (let l = t - 1; l >= s; --l)
      if (M(e.charCodeAt(l))) {
        if (!o) {
          a = l;
          break;
        }
      } else
        o = !1;
    if (a === -1) {
      if (r === -1)
        return ".";
      a = r;
    }
    return e.slice(0, a);
  },
  basename(e, t) {
    t !== void 0 && V(t, "ext"), V(e, "path");
    let r = 0, s = -1, i = !0, a;
    if (e.length >= 2 && Z(e.charCodeAt(0)) && e.charCodeAt(1) === Q && (r = 2), t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let o = t.length - 1, l = -1;
      for (a = e.length - 1; a >= r; --a) {
        const u = e.charCodeAt(a);
        if (M(u)) {
          if (!i) {
            r = a + 1;
            break;
          }
        } else
          l === -1 && (i = !1, l = a + 1), o >= 0 && (u === t.charCodeAt(o) ? --o === -1 && (s = a) : (o = -1, s = l));
      }
      return r === s ? s = l : s === -1 && (s = e.length), e.slice(r, s);
    }
    for (a = e.length - 1; a >= r; --a)
      if (M(e.charCodeAt(a))) {
        if (!i) {
          r = a + 1;
          break;
        }
      } else
        s === -1 && (i = !1, s = a + 1);
    return s === -1 ? "" : e.slice(r, s);
  },
  extname(e) {
    V(e, "path");
    let t = 0, r = -1, s = 0, i = -1, a = !0, o = 0;
    e.length >= 2 && e.charCodeAt(1) === Q && Z(e.charCodeAt(0)) && (t = s = 2);
    for (let l = e.length - 1; l >= t; --l) {
      const u = e.charCodeAt(l);
      if (M(u)) {
        if (!a) {
          s = l + 1;
          break;
        }
        continue;
      }
      i === -1 && (a = !1, i = l + 1), u === ee ? r === -1 ? r = l : o !== 1 && (o = 1) : r !== -1 && (o = -1);
    }
    return r === -1 || i === -1 || // We saw a non-dot character immediately before the dot
    o === 0 || // The (right-most) trimmed path component is exactly '..'
    o === 1 && r === i - 1 && r === s + 1 ? "" : e.slice(r, i);
  },
  format: Sn.bind(null, "\\"),
  parse(e) {
    V(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const r = e.length;
    let s = 0, i = e.charCodeAt(0);
    if (r === 1)
      return M(i) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
    if (M(i)) {
      if (s = 1, M(e.charCodeAt(1))) {
        let h = 2, d = h;
        for (; h < r && !M(e.charCodeAt(h)); )
          h++;
        if (h < r && h !== d) {
          for (d = h; h < r && M(e.charCodeAt(h)); )
            h++;
          if (h < r && h !== d) {
            for (d = h; h < r && !M(e.charCodeAt(h)); )
              h++;
            h === r ? s = h : h !== d && (s = h + 1);
          }
        }
      }
    } else if (Z(i) && e.charCodeAt(1) === Q) {
      if (r <= 2)
        return t.root = t.dir = e, t;
      if (s = 2, M(e.charCodeAt(2))) {
        if (r === 3)
          return t.root = t.dir = e, t;
        s = 3;
      }
    }
    s > 0 && (t.root = e.slice(0, s));
    let a = -1, o = s, l = -1, u = !0, c = e.length - 1, f = 0;
    for (; c >= s; --c) {
      if (i = e.charCodeAt(c), M(i)) {
        if (!u) {
          o = c + 1;
          break;
        }
        continue;
      }
      l === -1 && (u = !1, l = c + 1), i === ee ? a === -1 ? a = c : f !== 1 && (f = 1) : a !== -1 && (f = -1);
    }
    return l !== -1 && (a === -1 || // We saw a non-dot character immediately before the dot
    f === 0 || // The (right-most) trimmed path component is exactly '..'
    f === 1 && a === l - 1 && a === o + 1 ? t.base = t.name = e.slice(o, l) : (t.name = e.slice(o, a), t.base = e.slice(o, l), t.ext = e.slice(a, l))), o > 0 && o !== s ? t.dir = e.slice(0, o - 1) : t.dir = t.root, t;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
}, W = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", r = !1;
    for (let s = e.length - 1; s >= -1 && !r; s--) {
      const i = s >= 0 ? e[s] : $e();
      V(i, "path"), i.length !== 0 && (t = `${i}/${t}`, r = i.charCodeAt(0) === T);
    }
    return t = ke(t, !r, "/", ze), r ? `/${t}` : t.length > 0 ? t : ".";
  },
  normalize(e) {
    if (V(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === T, r = e.charCodeAt(e.length - 1) === T;
    return e = ke(e, !t, "/", ze), e.length === 0 ? t ? "/" : r ? "./" : "." : (r && (e += "/"), t ? `/${e}` : e);
  },
  isAbsolute(e) {
    return V(e, "path"), e.length > 0 && e.charCodeAt(0) === T;
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t;
    for (let r = 0; r < e.length; ++r) {
      const s = e[r];
      V(s, "path"), s.length > 0 && (t === void 0 ? t = s : t += `/${s}`);
    }
    return t === void 0 ? "." : W.normalize(t);
  },
  relative(e, t) {
    if (V(e, "from"), V(t, "to"), e === t || (e = W.resolve(e), t = W.resolve(t), e === t))
      return "";
    const r = 1, s = e.length, i = s - r, a = 1, o = t.length - a, l = i < o ? i : o;
    let u = -1, c = 0;
    for (; c < l; c++) {
      const h = e.charCodeAt(r + c);
      if (h !== t.charCodeAt(a + c))
        break;
      h === T && (u = c);
    }
    if (c === l)
      if (o > l) {
        if (t.charCodeAt(a + c) === T)
          return t.slice(a + c + 1);
        if (c === 0)
          return t.slice(a + c);
      } else
        i > l && (e.charCodeAt(r + c) === T ? u = c : c === 0 && (u = 0));
    let f = "";
    for (c = r + u + 1; c <= s; ++c)
      (c === s || e.charCodeAt(c) === T) && (f += f.length === 0 ? ".." : "/..");
    return `${f}${t.slice(a + u)}`;
  },
  toNamespacedPath(e) {
    return e;
  },
  dirname(e) {
    if (V(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === T;
    let r = -1, s = !0;
    for (let i = e.length - 1; i >= 1; --i)
      if (e.charCodeAt(i) === T) {
        if (!s) {
          r = i;
          break;
        }
      } else
        s = !1;
    return r === -1 ? t ? "/" : "." : t && r === 1 ? "//" : e.slice(0, r);
  },
  basename(e, t) {
    t !== void 0 && V(t, "ext"), V(e, "path");
    let r = 0, s = -1, i = !0, a;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let o = t.length - 1, l = -1;
      for (a = e.length - 1; a >= 0; --a) {
        const u = e.charCodeAt(a);
        if (u === T) {
          if (!i) {
            r = a + 1;
            break;
          }
        } else
          l === -1 && (i = !1, l = a + 1), o >= 0 && (u === t.charCodeAt(o) ? --o === -1 && (s = a) : (o = -1, s = l));
      }
      return r === s ? s = l : s === -1 && (s = e.length), e.slice(r, s);
    }
    for (a = e.length - 1; a >= 0; --a)
      if (e.charCodeAt(a) === T) {
        if (!i) {
          r = a + 1;
          break;
        }
      } else
        s === -1 && (i = !1, s = a + 1);
    return s === -1 ? "" : e.slice(r, s);
  },
  extname(e) {
    V(e, "path");
    let t = -1, r = 0, s = -1, i = !0, a = 0;
    for (let o = e.length - 1; o >= 0; --o) {
      const l = e.charCodeAt(o);
      if (l === T) {
        if (!i) {
          r = o + 1;
          break;
        }
        continue;
      }
      s === -1 && (i = !1, s = o + 1), l === ee ? t === -1 ? t = o : a !== 1 && (a = 1) : t !== -1 && (a = -1);
    }
    return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
    a === 0 || // The (right-most) trimmed path component is exactly '..'
    a === 1 && t === s - 1 && t === r + 1 ? "" : e.slice(t, s);
  },
  format: Sn.bind(null, "/"),
  parse(e) {
    V(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const r = e.charCodeAt(0) === T;
    let s;
    r ? (t.root = "/", s = 1) : s = 0;
    let i = -1, a = 0, o = -1, l = !0, u = e.length - 1, c = 0;
    for (; u >= s; --u) {
      const f = e.charCodeAt(u);
      if (f === T) {
        if (!l) {
          a = u + 1;
          break;
        }
        continue;
      }
      o === -1 && (l = !1, o = u + 1), f === ee ? i === -1 ? i = u : c !== 1 && (c = 1) : i !== -1 && (c = -1);
    }
    if (o !== -1) {
      const f = a === 0 && r ? 1 : a;
      i === -1 || // We saw a non-dot character immediately before the dot
      c === 0 || // The (right-most) trimmed path component is exactly '..'
      c === 1 && i === o - 1 && i === a + 1 ? t.base = t.name = e.slice(f, o) : (t.name = e.slice(f, i), t.base = e.slice(f, o), t.ext = e.slice(i, o));
    }
    return a > 0 ? t.dir = e.slice(0, a - 1) : r && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
W.win32 = I.win32 = I;
W.posix = I.posix = W;
ie === "win32" ? I.normalize : W.normalize;
ie === "win32" ? I.resolve : W.resolve;
ie === "win32" ? I.relative : W.relative;
ie === "win32" ? I.dirname : W.dirname;
ie === "win32" ? I.basename : W.basename;
ie === "win32" ? I.extname : W.extname;
ie === "win32" ? I.sep : W.sep;
const xr = /^\w[\w\d+.-]*$/, Er = /^\//, Vr = /^\/\//;
function mt(e, t) {
  if (!e.scheme && t)
    throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
  if (e.scheme && !xr.test(e.scheme))
    throw new Error("[UriError]: Scheme contains illegal characters.");
  if (e.path) {
    if (e.authority) {
      if (!Er.test(e.path))
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
    } else if (Vr.test(e.path))
      throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
  }
}
function Tr(e, t) {
  return !e && !t ? "file" : e;
}
function Br(e, t) {
  switch (e) {
    case "https":
    case "http":
    case "file":
      t ? t[0] !== G && (t = G + t) : t = G;
      break;
  }
  return t;
}
const F = "", G = "/", Ur = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
class ne {
  /**
   * @internal
   */
  constructor(t, r, s, i, a, o = !1) {
    typeof t == "object" ? (this.scheme = t.scheme || F, this.authority = t.authority || F, this.path = t.path || F, this.query = t.query || F, this.fragment = t.fragment || F) : (this.scheme = Tr(t, o), this.authority = r || F, this.path = Br(this.scheme, s || F), this.query = i || F, this.fragment = a || F, mt(this, o));
  }
  static isUri(t) {
    return t instanceof ne ? !0 : t ? typeof t.authority == "string" && typeof t.fragment == "string" && typeof t.path == "string" && typeof t.query == "string" && typeof t.scheme == "string" && typeof t.fsPath == "string" && typeof t.with == "function" && typeof t.toString == "function" : !1;
  }
  // ---- filesystem path -----------------------
  /**
   * Returns a string representing the corresponding file system path of this URI.
   * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
   * platform specific path separator.
   *
   * * Will *not* validate the path for invalid characters and semantics.
   * * Will *not* look at the scheme of this URI.
   * * The result shall *not* be used for display purposes but for accessing a file on disk.
   *
   *
   * The *difference* to `URI#path` is the use of the platform specific separator and the handling
   * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
   *
   * ```ts
      const u = URI.parse('file://server/c$/folder/file.txt')
      u.authority === 'server'
      u.path === '/shares/c$/file.txt'
      u.fsPath === '\\server\c$\folder\file.txt'
  ```
   *
   * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
   * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
   * with URIs that represent files on disk (`file` scheme).
   */
  get fsPath() {
    return Ge(this, !1);
  }
  // ---- modify to new -------------------------
  with(t) {
    if (!t)
      return this;
    let { scheme: r, authority: s, path: i, query: a, fragment: o } = t;
    return r === void 0 ? r = this.scheme : r === null && (r = F), s === void 0 ? s = this.authority : s === null && (s = F), i === void 0 ? i = this.path : i === null && (i = F), a === void 0 ? a = this.query : a === null && (a = F), o === void 0 ? o = this.fragment : o === null && (o = F), r === this.scheme && s === this.authority && i === this.path && a === this.query && o === this.fragment ? this : new le(r, s, i, a, o);
  }
  // ---- parse & validate ------------------------
  /**
   * Creates a new URI from a string, e.g. `http://www.example.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
  static parse(t, r = !1) {
    const s = Ur.exec(t);
    return s ? new le(s[2] || F, Le(s[4] || F), Le(s[5] || F), Le(s[7] || F), Le(s[9] || F), r) : new le(F, F, F, F, F);
  }
  /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
   * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
   * `URI.parse('file://' + path)` because the path might contain characters that are
   * interpreted (# and ?). See the following sample:
   * ```ts
  const good = URI.file('/coding/c#/project1');
  good.scheme === 'file';
  good.path === '/coding/c#/project1';
  good.fragment === '';
  const bad = URI.parse('file://' + '/coding/c#/project1');
  bad.scheme === 'file';
  bad.path === '/coding/c'; // path is now broken
  bad.fragment === '/project1';
  ```
   *
   * @param path A file system path (see `URI#fsPath`)
   */
  static file(t) {
    let r = F;
    if (ge && (t = t.replace(/\\/g, G)), t[0] === G && t[1] === G) {
      const s = t.indexOf(G, 2);
      s === -1 ? (r = t.substring(2), t = G) : (r = t.substring(2, s), t = t.substring(s) || G);
    }
    return new le("file", r, t, F, F);
  }
  static from(t) {
    const r = new le(t.scheme, t.authority, t.path, t.query, t.fragment);
    return mt(r, !0), r;
  }
  /**
   * Join a URI path with path fragments and normalizes the resulting path.
   *
   * @param uri The input URI.
   * @param pathFragment The path fragment to add to the URI path.
   * @returns The resulting URI.
   */
  static joinPath(t, ...r) {
    if (!t.path)
      throw new Error("[UriError]: cannot call joinPath on URI without path");
    let s;
    return ge && t.scheme === "file" ? s = ne.file(I.join(Ge(t, !0), ...r)).path : s = W.join(t.path, ...r), t.with({ path: s });
  }
  // ---- printing/externalize ---------------------------
  /**
   * Creates a string representation for this URI. It's guaranteed that calling
   * `URI.parse` with the result of this function creates an URI which is equal
   * to this URI.
   *
   * * The result shall *not* be used for display purposes but for externalization or transport.
   * * The result will be encoded using the percentage encoding and encoding happens mostly
   * ignore the scheme-specific encoding rules.
   *
   * @param skipEncoding Do not encode the result, default is `false`
   */
  toString(t = !1) {
    return Oe(this, t);
  }
  toJSON() {
    return this;
  }
  static revive(t) {
    if (t) {
      if (t instanceof ne)
        return t;
      {
        const r = new le(t);
        return r._formatted = t.external, r._fsPath = t._sep === An ? t.fsPath : null, r;
      }
    } else
      return t;
  }
}
const An = ge ? 1 : void 0;
class le extends ne {
  constructor() {
    super(...arguments), this._formatted = null, this._fsPath = null;
  }
  get fsPath() {
    return this._fsPath || (this._fsPath = Ge(this, !1)), this._fsPath;
  }
  toString(t = !1) {
    return t ? Oe(this, !0) : (this._formatted || (this._formatted = Oe(this, !1)), this._formatted);
  }
  toJSON() {
    const t = {
      $mid: 1
      /* MarshalledId.Uri */
    };
    return this._fsPath && (t.fsPath = this._fsPath, t._sep = An), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
  }
}
const yn = {
  [
    58
    /* CharCode.Colon */
  ]: "%3A",
  [
    47
    /* CharCode.Slash */
  ]: "%2F",
  [
    63
    /* CharCode.QuestionMark */
  ]: "%3F",
  [
    35
    /* CharCode.Hash */
  ]: "%23",
  [
    91
    /* CharCode.OpenSquareBracket */
  ]: "%5B",
  [
    93
    /* CharCode.CloseSquareBracket */
  ]: "%5D",
  [
    64
    /* CharCode.AtSign */
  ]: "%40",
  [
    33
    /* CharCode.ExclamationMark */
  ]: "%21",
  [
    36
    /* CharCode.DollarSign */
  ]: "%24",
  [
    38
    /* CharCode.Ampersand */
  ]: "%26",
  [
    39
    /* CharCode.SingleQuote */
  ]: "%27",
  [
    40
    /* CharCode.OpenParen */
  ]: "%28",
  [
    41
    /* CharCode.CloseParen */
  ]: "%29",
  [
    42
    /* CharCode.Asterisk */
  ]: "%2A",
  [
    43
    /* CharCode.Plus */
  ]: "%2B",
  [
    44
    /* CharCode.Comma */
  ]: "%2C",
  [
    59
    /* CharCode.Semicolon */
  ]: "%3B",
  [
    61
    /* CharCode.Equals */
  ]: "%3D",
  [
    32
    /* CharCode.Space */
  ]: "%20"
};
function gt(e, t) {
  let r, s = -1;
  for (let i = 0; i < e.length; i++) {
    const a = e.charCodeAt(i);
    if (a >= 97 && a <= 122 || a >= 65 && a <= 90 || a >= 48 && a <= 57 || a === 45 || a === 46 || a === 95 || a === 126 || t && a === 47)
      s !== -1 && (r += encodeURIComponent(e.substring(s, i)), s = -1), r !== void 0 && (r += e.charAt(i));
    else {
      r === void 0 && (r = e.substr(0, i));
      const o = yn[a];
      o !== void 0 ? (s !== -1 && (r += encodeURIComponent(e.substring(s, i)), s = -1), r += o) : s === -1 && (s = i);
    }
  }
  return s !== -1 && (r += encodeURIComponent(e.substring(s))), r !== void 0 ? r : e;
}
function Ir(e) {
  let t;
  for (let r = 0; r < e.length; r++) {
    const s = e.charCodeAt(r);
    s === 35 || s === 63 ? (t === void 0 && (t = e.substr(0, r)), t += yn[s]) : t !== void 0 && (t += e[r]);
  }
  return t !== void 0 ? t : e;
}
function Ge(e, t) {
  let r;
  return e.authority && e.path.length > 1 && e.scheme === "file" ? r = `//${e.authority}${e.path}` : e.path.charCodeAt(0) === 47 && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && e.path.charCodeAt(2) === 58 ? t ? r = e.path.substr(1) : r = e.path[1].toLowerCase() + e.path.substr(2) : r = e.path, ge && (r = r.replace(/\//g, "\\")), r;
}
function Oe(e, t) {
  const r = t ? Ir : gt;
  let s = "", { scheme: i, authority: a, path: o, query: l, fragment: u } = e;
  if (i && (s += i, s += ":"), (a || i === "file") && (s += G, s += G), a) {
    let c = a.indexOf("@");
    if (c !== -1) {
      const f = a.substr(0, c);
      a = a.substr(c + 1), c = f.indexOf(":"), c === -1 ? s += r(f, !1) : (s += r(f.substr(0, c), !1), s += ":", s += r(f.substr(c + 1), !1)), s += "@";
    }
    a = a.toLowerCase(), c = a.indexOf(":"), c === -1 ? s += r(a, !1) : (s += r(a.substr(0, c), !1), s += a.substr(c));
  }
  if (o) {
    if (o.length >= 3 && o.charCodeAt(0) === 47 && o.charCodeAt(2) === 58) {
      const c = o.charCodeAt(1);
      c >= 65 && c <= 90 && (o = `/${String.fromCharCode(c + 32)}:${o.substr(3)}`);
    } else if (o.length >= 2 && o.charCodeAt(1) === 58) {
      const c = o.charCodeAt(0);
      c >= 65 && c <= 90 && (o = `${String.fromCharCode(c + 32)}:${o.substr(2)}`);
    }
    s += r(o, !0);
  }
  return l && (s += "?", s += r(l, !1)), u && (s += "#", s += t ? u : gt(u, !1)), s;
}
function kn(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e.length > 3 ? e.substr(0, 3) + kn(e.substr(3)) : e;
  }
}
const bt = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function Le(e) {
  return e.match(bt) ? e.replace(bt, (t) => kn(t)) : e;
}
class H {
  constructor(t, r) {
    this.lineNumber = t, this.column = r;
  }
  /**
   * Create a new position from this position.
   *
   * @param newLineNumber new line number
   * @param newColumn new column
   */
  with(t = this.lineNumber, r = this.column) {
    return t === this.lineNumber && r === this.column ? this : new H(t, r);
  }
  /**
   * Derive a new position from this position.
   *
   * @param deltaLineNumber line number delta
   * @param deltaColumn column delta
   */
  delta(t = 0, r = 0) {
    return this.with(this.lineNumber + t, this.column + r);
  }
  /**
   * Test if this position equals other position
   */
  equals(t) {
    return H.equals(this, t);
  }
  /**
   * Test if position `a` equals position `b`
   */
  static equals(t, r) {
    return !t && !r ? !0 : !!t && !!r && t.lineNumber === r.lineNumber && t.column === r.column;
  }
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be false.
   */
  isBefore(t) {
    return H.isBefore(this, t);
  }
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be false.
   */
  static isBefore(t, r) {
    return t.lineNumber < r.lineNumber ? !0 : r.lineNumber < t.lineNumber ? !1 : t.column < r.column;
  }
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be true.
   */
  isBeforeOrEqual(t) {
    return H.isBeforeOrEqual(this, t);
  }
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be true.
   */
  static isBeforeOrEqual(t, r) {
    return t.lineNumber < r.lineNumber ? !0 : r.lineNumber < t.lineNumber ? !1 : t.column <= r.column;
  }
  /**
   * A function that compares positions, useful for sorting
   */
  static compare(t, r) {
    const s = t.lineNumber | 0, i = r.lineNumber | 0;
    if (s === i) {
      const a = t.column | 0, o = r.column | 0;
      return a - o;
    }
    return s - i;
  }
  /**
   * Clone this position.
   */
  clone() {
    return new H(this.lineNumber, this.column);
  }
  /**
   * Convert to a human-readable representation.
   */
  toString() {
    return "(" + this.lineNumber + "," + this.column + ")";
  }
  // ---
  /**
   * Create a `Position` from an `IPosition`.
   */
  static lift(t) {
    return new H(t.lineNumber, t.column);
  }
  /**
   * Test if `obj` is an `IPosition`.
   */
  static isIPosition(t) {
    return t && typeof t.lineNumber == "number" && typeof t.column == "number";
  }
}
class x {
  constructor(t, r, s, i) {
    t > s || t === s && r > i ? (this.startLineNumber = s, this.startColumn = i, this.endLineNumber = t, this.endColumn = r) : (this.startLineNumber = t, this.startColumn = r, this.endLineNumber = s, this.endColumn = i);
  }
  /**
   * Test if this range is empty.
   */
  isEmpty() {
    return x.isEmpty(this);
  }
  /**
   * Test if `range` is empty.
   */
  static isEmpty(t) {
    return t.startLineNumber === t.endLineNumber && t.startColumn === t.endColumn;
  }
  /**
   * Test if position is in this range. If the position is at the edges, will return true.
   */
  containsPosition(t) {
    return x.containsPosition(this, t);
  }
  /**
   * Test if `position` is in `range`. If the position is at the edges, will return true.
   */
  static containsPosition(t, r) {
    return !(r.lineNumber < t.startLineNumber || r.lineNumber > t.endLineNumber || r.lineNumber === t.startLineNumber && r.column < t.startColumn || r.lineNumber === t.endLineNumber && r.column > t.endColumn);
  }
  /**
   * Test if `position` is in `range`. If the position is at the edges, will return false.
   * @internal
   */
  static strictContainsPosition(t, r) {
    return !(r.lineNumber < t.startLineNumber || r.lineNumber > t.endLineNumber || r.lineNumber === t.startLineNumber && r.column <= t.startColumn || r.lineNumber === t.endLineNumber && r.column >= t.endColumn);
  }
  /**
   * Test if range is in this range. If the range is equal to this range, will return true.
   */
  containsRange(t) {
    return x.containsRange(this, t);
  }
  /**
   * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
   */
  static containsRange(t, r) {
    return !(r.startLineNumber < t.startLineNumber || r.endLineNumber < t.startLineNumber || r.startLineNumber > t.endLineNumber || r.endLineNumber > t.endLineNumber || r.startLineNumber === t.startLineNumber && r.startColumn < t.startColumn || r.endLineNumber === t.endLineNumber && r.endColumn > t.endColumn);
  }
  /**
   * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
   */
  strictContainsRange(t) {
    return x.strictContainsRange(this, t);
  }
  /**
   * Test if `otherRange` is strictly in `range` (must start after, and end before). If the ranges are equal, will return false.
   */
  static strictContainsRange(t, r) {
    return !(r.startLineNumber < t.startLineNumber || r.endLineNumber < t.startLineNumber || r.startLineNumber > t.endLineNumber || r.endLineNumber > t.endLineNumber || r.startLineNumber === t.startLineNumber && r.startColumn <= t.startColumn || r.endLineNumber === t.endLineNumber && r.endColumn >= t.endColumn);
  }
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */
  plusRange(t) {
    return x.plusRange(this, t);
  }
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */
  static plusRange(t, r) {
    let s, i, a, o;
    return r.startLineNumber < t.startLineNumber ? (s = r.startLineNumber, i = r.startColumn) : r.startLineNumber === t.startLineNumber ? (s = r.startLineNumber, i = Math.min(r.startColumn, t.startColumn)) : (s = t.startLineNumber, i = t.startColumn), r.endLineNumber > t.endLineNumber ? (a = r.endLineNumber, o = r.endColumn) : r.endLineNumber === t.endLineNumber ? (a = r.endLineNumber, o = Math.max(r.endColumn, t.endColumn)) : (a = t.endLineNumber, o = t.endColumn), new x(s, i, a, o);
  }
  /**
   * A intersection of the two ranges.
   */
  intersectRanges(t) {
    return x.intersectRanges(this, t);
  }
  /**
   * A intersection of the two ranges.
   */
  static intersectRanges(t, r) {
    let s = t.startLineNumber, i = t.startColumn, a = t.endLineNumber, o = t.endColumn;
    const l = r.startLineNumber, u = r.startColumn, c = r.endLineNumber, f = r.endColumn;
    return s < l ? (s = l, i = u) : s === l && (i = Math.max(i, u)), a > c ? (a = c, o = f) : a === c && (o = Math.min(o, f)), s > a || s === a && i > o ? null : new x(s, i, a, o);
  }
  /**
   * Test if this range equals other.
   */
  equalsRange(t) {
    return x.equalsRange(this, t);
  }
  /**
   * Test if range `a` equals `b`.
   */
  static equalsRange(t, r) {
    return !!t && !!r && t.startLineNumber === r.startLineNumber && t.startColumn === r.startColumn && t.endLineNumber === r.endLineNumber && t.endColumn === r.endColumn;
  }
  /**
   * Return the end position (which will be after or equal to the start position)
   */
  getEndPosition() {
    return x.getEndPosition(this);
  }
  /**
   * Return the end position (which will be after or equal to the start position)
   */
  static getEndPosition(t) {
    return new H(t.endLineNumber, t.endColumn);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  getStartPosition() {
    return x.getStartPosition(this);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  static getStartPosition(t) {
    return new H(t.startLineNumber, t.startColumn);
  }
  /**
   * Transform to a user presentable string representation.
   */
  toString() {
    return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
  }
  /**
   * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
   */
  setEndPosition(t, r) {
    return new x(this.startLineNumber, this.startColumn, t, r);
  }
  /**
   * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
   */
  setStartPosition(t, r) {
    return new x(t, r, this.endLineNumber, this.endColumn);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  collapseToStart() {
    return x.collapseToStart(this);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  static collapseToStart(t) {
    return new x(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
  }
  // ---
  static fromPositions(t, r = t) {
    return new x(t.lineNumber, t.column, r.lineNumber, r.column);
  }
  static lift(t) {
    return t ? new x(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
  }
  /**
   * Test if `obj` is an `IRange`.
   */
  static isIRange(t) {
    return t && typeof t.startLineNumber == "number" && typeof t.startColumn == "number" && typeof t.endLineNumber == "number" && typeof t.endColumn == "number";
  }
  /**
   * Test if the two ranges are touching in any way.
   */
  static areIntersectingOrTouching(t, r) {
    return !(t.endLineNumber < r.startLineNumber || t.endLineNumber === r.startLineNumber && t.endColumn < r.startColumn || r.endLineNumber < t.startLineNumber || r.endLineNumber === t.startLineNumber && r.endColumn < t.startColumn);
  }
  /**
   * Test if the two ranges are intersecting. If the ranges are touching it returns true.
   */
  static areIntersecting(t, r) {
    return !(t.endLineNumber < r.startLineNumber || t.endLineNumber === r.startLineNumber && t.endColumn <= r.startColumn || r.endLineNumber < t.startLineNumber || r.endLineNumber === t.startLineNumber && r.endColumn <= t.startColumn);
  }
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the startPosition and then on the endPosition
   */
  static compareRangesUsingStarts(t, r) {
    if (t && r) {
      const a = t.startLineNumber | 0, o = r.startLineNumber | 0;
      if (a === o) {
        const l = t.startColumn | 0, u = r.startColumn | 0;
        if (l === u) {
          const c = t.endLineNumber | 0, f = r.endLineNumber | 0;
          if (c === f) {
            const h = t.endColumn | 0, d = r.endColumn | 0;
            return h - d;
          }
          return c - f;
        }
        return l - u;
      }
      return a - o;
    }
    return (t ? 1 : 0) - (r ? 1 : 0);
  }
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the endPosition and then on the startPosition
   */
  static compareRangesUsingEnds(t, r) {
    return t.endLineNumber === r.endLineNumber ? t.endColumn === r.endColumn ? t.startLineNumber === r.startLineNumber ? t.startColumn - r.startColumn : t.startLineNumber - r.startLineNumber : t.endColumn - r.endColumn : t.endLineNumber - r.endLineNumber;
  }
  /**
   * Test if the range spans multiple lines.
   */
  static spansMultipleLines(t) {
    return t.endLineNumber > t.startLineNumber;
  }
  toJSON() {
    return this;
  }
}
const qr = 3;
function Mn(e, t, r, s) {
  return new J(e, t, r).ComputeDiff(s);
}
class wt {
  constructor(t) {
    const r = [], s = [];
    for (let i = 0, a = t.length; i < a; i++)
      r[i] = je(t[i], 1), s[i] = Qe(t[i], 1);
    this.lines = t, this._startColumns = r, this._endColumns = s;
  }
  getElements() {
    const t = [];
    for (let r = 0, s = this.lines.length; r < s; r++)
      t[r] = this.lines[r].substring(this._startColumns[r] - 1, this._endColumns[r] - 1);
    return t;
  }
  getStrictElement(t) {
    return this.lines[t];
  }
  getStartLineNumber(t) {
    return t + 1;
  }
  getEndLineNumber(t) {
    return t + 1;
  }
  createCharSequence(t, r, s) {
    const i = [], a = [], o = [];
    let l = 0;
    for (let u = r; u <= s; u++) {
      const c = this.lines[u], f = t ? this._startColumns[u] : 1, h = t ? this._endColumns[u] : c.length + 1;
      for (let d = f; d < h; d++)
        i[l] = c.charCodeAt(d - 1), a[l] = u + 1, o[l] = d, l++;
      !t && u < s && (i[l] = 10, a[l] = u + 1, o[l] = c.length + 1, l++);
    }
    return new Hr(i, a, o);
  }
}
class Hr {
  constructor(t, r, s) {
    this._charCodes = t, this._lineNumbers = r, this._columns = s;
  }
  toString() {
    return "[" + this._charCodes.map((t, r) => (t === 10 ? "\\n" : String.fromCharCode(t)) + `-(${this._lineNumbers[r]},${this._columns[r]})`).join(", ") + "]";
  }
  _assertIndex(t, r) {
    if (t < 0 || t >= r.length)
      throw new Error("Illegal index");
  }
  getElements() {
    return this._charCodes;
  }
  getStartLineNumber(t) {
    return t > 0 && t === this._lineNumbers.length ? this.getEndLineNumber(t - 1) : (this._assertIndex(t, this._lineNumbers), this._lineNumbers[t]);
  }
  getEndLineNumber(t) {
    return t === -1 ? this.getStartLineNumber(t + 1) : (this._assertIndex(t, this._lineNumbers), this._charCodes[t] === 10 ? this._lineNumbers[t] + 1 : this._lineNumbers[t]);
  }
  getStartColumn(t) {
    return t > 0 && t === this._columns.length ? this.getEndColumn(t - 1) : (this._assertIndex(t, this._columns), this._columns[t]);
  }
  getEndColumn(t) {
    return t === -1 ? this.getStartColumn(t + 1) : (this._assertIndex(t, this._columns), this._charCodes[t] === 10 ? 1 : this._columns[t] + 1);
  }
}
class be {
  constructor(t, r, s, i, a, o, l, u) {
    this.originalStartLineNumber = t, this.originalStartColumn = r, this.originalEndLineNumber = s, this.originalEndColumn = i, this.modifiedStartLineNumber = a, this.modifiedStartColumn = o, this.modifiedEndLineNumber = l, this.modifiedEndColumn = u;
  }
  static createFromDiffChange(t, r, s) {
    const i = r.getStartLineNumber(t.originalStart), a = r.getStartColumn(t.originalStart), o = r.getEndLineNumber(t.originalStart + t.originalLength - 1), l = r.getEndColumn(t.originalStart + t.originalLength - 1), u = s.getStartLineNumber(t.modifiedStart), c = s.getStartColumn(t.modifiedStart), f = s.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), h = s.getEndColumn(t.modifiedStart + t.modifiedLength - 1);
    return new be(i, a, o, l, u, c, f, h);
  }
}
function Wr(e) {
  if (e.length <= 1)
    return e;
  const t = [e[0]];
  let r = t[0];
  for (let s = 1, i = e.length; s < i; s++) {
    const a = e[s], o = a.originalStart - (r.originalStart + r.originalLength), l = a.modifiedStart - (r.modifiedStart + r.modifiedLength);
    Math.min(o, l) < qr ? (r.originalLength = a.originalStart + a.originalLength - r.originalStart, r.modifiedLength = a.modifiedStart + a.modifiedLength - r.modifiedStart) : (t.push(a), r = a);
  }
  return t;
}
class me {
  constructor(t, r, s, i, a) {
    this.originalStartLineNumber = t, this.originalEndLineNumber = r, this.modifiedStartLineNumber = s, this.modifiedEndLineNumber = i, this.charChanges = a;
  }
  static createFromDiffResult(t, r, s, i, a, o, l) {
    let u, c, f, h, d;
    if (r.originalLength === 0 ? (u = s.getStartLineNumber(r.originalStart) - 1, c = 0) : (u = s.getStartLineNumber(r.originalStart), c = s.getEndLineNumber(r.originalStart + r.originalLength - 1)), r.modifiedLength === 0 ? (f = i.getStartLineNumber(r.modifiedStart) - 1, h = 0) : (f = i.getStartLineNumber(r.modifiedStart), h = i.getEndLineNumber(r.modifiedStart + r.modifiedLength - 1)), o && r.originalLength > 0 && r.originalLength < 20 && r.modifiedLength > 0 && r.modifiedLength < 20 && a()) {
      const C = s.createCharSequence(t, r.originalStart, r.originalStart + r.originalLength - 1), v = i.createCharSequence(t, r.modifiedStart, r.modifiedStart + r.modifiedLength - 1);
      if (C.getElements().length > 0 && v.getElements().length > 0) {
        let A = Mn(C, v, a, !0).changes;
        l && (A = Wr(A)), d = [];
        for (let k = 0, R = A.length; k < R; k++)
          d.push(be.createFromDiffChange(A[k], C, v));
      }
    }
    return new me(u, c, f, h, d);
  }
}
class $r {
  constructor(t, r, s) {
    this.shouldComputeCharChanges = s.shouldComputeCharChanges, this.shouldPostProcessCharChanges = s.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = s.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = s.shouldMakePrettyDiff, this.originalLines = t, this.modifiedLines = r, this.original = new wt(t), this.modified = new wt(r), this.continueLineDiff = Ct(s.maxComputationTime), this.continueCharDiff = Ct(s.maxComputationTime === 0 ? 0 : Math.min(s.maxComputationTime, 5e3));
  }
  computeDiff() {
    if (this.original.lines.length === 1 && this.original.lines[0].length === 0)
      return this.modified.lines.length === 1 && this.modified.lines[0].length === 0 ? {
        quitEarly: !1,
        changes: []
      } : {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: 1,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: this.modified.lines.length,
          charChanges: [{
            modifiedEndColumn: 0,
            modifiedEndLineNumber: 0,
            modifiedStartColumn: 0,
            modifiedStartLineNumber: 0,
            originalEndColumn: 0,
            originalEndLineNumber: 0,
            originalStartColumn: 0,
            originalStartLineNumber: 0
          }]
        }]
      };
    if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0)
      return {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: this.original.lines.length,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: 1,
          charChanges: [{
            modifiedEndColumn: 0,
            modifiedEndLineNumber: 0,
            modifiedStartColumn: 0,
            modifiedStartLineNumber: 0,
            originalEndColumn: 0,
            originalEndLineNumber: 0,
            originalStartColumn: 0,
            originalStartLineNumber: 0
          }]
        }]
      };
    const t = Mn(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), r = t.changes, s = t.quitEarly;
    if (this.shouldIgnoreTrimWhitespace) {
      const l = [];
      for (let u = 0, c = r.length; u < c; u++)
        l.push(me.createFromDiffResult(this.shouldIgnoreTrimWhitespace, r[u], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      return {
        quitEarly: s,
        changes: l
      };
    }
    const i = [];
    let a = 0, o = 0;
    for (let l = -1, u = r.length; l < u; l++) {
      const c = l + 1 < u ? r[l + 1] : null, f = c ? c.originalStart : this.originalLines.length, h = c ? c.modifiedStart : this.modifiedLines.length;
      for (; a < f && o < h; ) {
        const d = this.originalLines[a], C = this.modifiedLines[o];
        if (d !== C) {
          {
            let v = je(d, 1), A = je(C, 1);
            for (; v > 1 && A > 1; ) {
              const k = d.charCodeAt(v - 2), R = C.charCodeAt(A - 2);
              if (k !== R)
                break;
              v--, A--;
            }
            (v > 1 || A > 1) && this._pushTrimWhitespaceCharChange(i, a + 1, 1, v, o + 1, 1, A);
          }
          {
            let v = Qe(d, 1), A = Qe(C, 1);
            const k = d.length + 1, R = C.length + 1;
            for (; v < k && A < R; ) {
              const P = d.charCodeAt(v - 1), y = d.charCodeAt(A - 1);
              if (P !== y)
                break;
              v++, A++;
            }
            (v < k || A < R) && this._pushTrimWhitespaceCharChange(i, a + 1, v, k, o + 1, A, R);
          }
        }
        a++, o++;
      }
      c && (i.push(me.createFromDiffResult(this.shouldIgnoreTrimWhitespace, c, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), a += c.originalLength, o += c.modifiedLength);
    }
    return {
      quitEarly: s,
      changes: i
    };
  }
  _pushTrimWhitespaceCharChange(t, r, s, i, a, o, l) {
    if (this._mergeTrimWhitespaceCharChange(t, r, s, i, a, o, l))
      return;
    let u;
    this.shouldComputeCharChanges && (u = [new be(r, s, r, i, a, o, a, l)]), t.push(new me(r, r, a, a, u));
  }
  _mergeTrimWhitespaceCharChange(t, r, s, i, a, o, l) {
    const u = t.length;
    if (u === 0)
      return !1;
    const c = t[u - 1];
    return c.originalEndLineNumber === 0 || c.modifiedEndLineNumber === 0 ? !1 : c.originalEndLineNumber + 1 === r && c.modifiedEndLineNumber + 1 === a ? (c.originalEndLineNumber = r, c.modifiedEndLineNumber = a, this.shouldComputeCharChanges && c.charChanges && c.charChanges.push(new be(r, s, r, i, a, o, a, l)), !0) : !1;
  }
}
function je(e, t) {
  const r = ur(e);
  return r === -1 ? t : r + 1;
}
function Qe(e, t) {
  const r = hr(e);
  return r === -1 ? t : r + 2;
}
function Ct(e) {
  if (e === 0)
    return () => !0;
  const t = Date.now();
  return () => Date.now() - t < e;
}
var _t;
(function(e) {
  function t(i) {
    return i < 0;
  }
  e.isLessThan = t;
  function r(i) {
    return i > 0;
  }
  e.isGreaterThan = r;
  function s(i) {
    return i === 0;
  }
  e.isNeitherLessOrGreaterThan = s, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
})(_t || (_t = {}));
function pt(e) {
  return e < 0 ? 0 : e > 255 ? 255 : e | 0;
}
function ce(e) {
  return e < 0 ? 0 : e > 4294967295 ? 4294967295 : e | 0;
}
class zr {
  constructor(t) {
    this.values = t, this.prefixSum = new Uint32Array(t.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
  }
  insertValues(t, r) {
    t = ce(t);
    const s = this.values, i = this.prefixSum, a = r.length;
    return a === 0 ? !1 : (this.values = new Uint32Array(s.length + a), this.values.set(s.subarray(0, t), 0), this.values.set(s.subarray(t), t + a), this.values.set(r, t), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  setValue(t, r) {
    return t = ce(t), r = ce(r), this.values[t] === r ? !1 : (this.values[t] = r, t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), !0);
  }
  removeValues(t, r) {
    t = ce(t), r = ce(r);
    const s = this.values, i = this.prefixSum;
    if (t >= s.length)
      return !1;
    const a = s.length - t;
    return r >= a && (r = a), r === 0 ? !1 : (this.values = new Uint32Array(s.length - r), this.values.set(s.subarray(0, t), 0), this.values.set(s.subarray(t + r), t), this.prefixSum = new Uint32Array(this.values.length), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  getTotalSum() {
    return this.values.length === 0 ? 0 : this._getPrefixSum(this.values.length - 1);
  }
  /**
   * Returns the sum of the first `index + 1` many items.
   * @returns `SUM(0 <= j <= index, values[j])`.
   */
  getPrefixSum(t) {
    return t < 0 ? 0 : (t = ce(t), this._getPrefixSum(t));
  }
  _getPrefixSum(t) {
    if (t <= this.prefixSumValidIndex[0])
      return this.prefixSum[t];
    let r = this.prefixSumValidIndex[0] + 1;
    r === 0 && (this.prefixSum[0] = this.values[0], r++), t >= this.values.length && (t = this.values.length - 1);
    for (let s = r; s <= t; s++)
      this.prefixSum[s] = this.prefixSum[s - 1] + this.values[s];
    return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], t), this.prefixSum[t];
  }
  getIndexOf(t) {
    t = Math.floor(t), this.getTotalSum();
    let r = 0, s = this.values.length - 1, i = 0, a = 0, o = 0;
    for (; r <= s; )
      if (i = r + (s - r) / 2 | 0, a = this.prefixSum[i], o = a - this.values[i], t < o)
        s = i - 1;
      else if (t >= a)
        r = i + 1;
      else
        break;
    return new Gr(i, t - o);
  }
}
class Gr {
  constructor(t, r) {
    this.index = t, this.remainder = r, this._prefixSumIndexOfResultBrand = void 0, this.index = t, this.remainder = r;
  }
}
class Or {
  constructor(t, r, s, i) {
    this._uri = t, this._lines = r, this._eol = s, this._versionId = i, this._lineStarts = null, this._cachedTextValue = null;
  }
  dispose() {
    this._lines.length = 0;
  }
  get version() {
    return this._versionId;
  }
  getText() {
    return this._cachedTextValue === null && (this._cachedTextValue = this._lines.join(this._eol)), this._cachedTextValue;
  }
  onEvents(t) {
    t.eol && t.eol !== this._eol && (this._eol = t.eol, this._lineStarts = null);
    const r = t.changes;
    for (const s of r)
      this._acceptDeleteRange(s.range), this._acceptInsertText(new H(s.range.startLineNumber, s.range.startColumn), s.text);
    this._versionId = t.versionId, this._cachedTextValue = null;
  }
  _ensureLineStarts() {
    if (!this._lineStarts) {
      const t = this._eol.length, r = this._lines.length, s = new Uint32Array(r);
      for (let i = 0; i < r; i++)
        s[i] = this._lines[i].length + t;
      this._lineStarts = new zr(s);
    }
  }
  /**
   * All changes to a line's text go through this method
   */
  _setLineText(t, r) {
    this._lines[t] = r, this._lineStarts && this._lineStarts.setValue(t, this._lines[t].length + this._eol.length);
  }
  _acceptDeleteRange(t) {
    if (t.startLineNumber === t.endLineNumber) {
      if (t.startColumn === t.endColumn)
        return;
      this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.startLineNumber - 1].substring(t.endColumn - 1));
      return;
    }
    this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.endLineNumber - 1].substring(t.endColumn - 1)), this._lines.splice(t.startLineNumber, t.endLineNumber - t.startLineNumber), this._lineStarts && this._lineStarts.removeValues(t.startLineNumber, t.endLineNumber - t.startLineNumber);
  }
  _acceptInsertText(t, r) {
    if (r.length === 0)
      return;
    const s = cr(r);
    if (s.length === 1) {
      this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + s[0] + this._lines[t.lineNumber - 1].substring(t.column - 1));
      return;
    }
    s[s.length - 1] += this._lines[t.lineNumber - 1].substring(t.column - 1), this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + s[0]);
    const i = new Uint32Array(s.length - 1);
    for (let a = 1; a < s.length; a++)
      this._lines.splice(t.lineNumber + a - 1, 0, s[a]), i[a - 1] = s[a].length + this._eol.length;
    this._lineStarts && this._lineStarts.insertValues(t.lineNumber, i);
  }
}
const jr = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
function Qr(e = "") {
  let t = "(-?\\d*\\.\\d\\w*)|([^";
  for (const r of jr)
    e.indexOf(r) >= 0 || (t += "\\" + r);
  return t += "\\s]+)", new RegExp(t, "g");
}
const Rn = Qr();
function Zr(e) {
  let t = Rn;
  if (e && e instanceof RegExp)
    if (e.global)
      t = e;
    else {
      let r = "g";
      e.ignoreCase && (r += "i"), e.multiline && (r += "m"), e.unicode && (r += "u"), t = new RegExp(e.source, r);
    }
  return t.lastIndex = 0, t;
}
const Pn = new ye();
Pn.unshift({
  maxLen: 1e3,
  windowSize: 15,
  timeBudget: 150
});
function at(e, t, r, s, i) {
  if (i || (i = Se.first(Pn)), r.length > i.maxLen) {
    let c = e - i.maxLen / 2;
    return c < 0 ? c = 0 : s += c, r = r.substring(c, e + i.maxLen / 2), at(e, t, r, s, i);
  }
  const a = Date.now(), o = e - 1 - s;
  let l = -1, u = null;
  for (let c = 1; !(Date.now() - a >= i.timeBudget); c++) {
    const f = o - i.windowSize * c;
    t.lastIndex = Math.max(0, f);
    const h = Yr(t, r, o, l);
    if (!h && u || (u = h, f <= 0))
      break;
    l = f;
  }
  if (u) {
    const c = {
      word: u[0],
      startColumn: s + 1 + u.index,
      endColumn: s + 1 + u.index + u[0].length
    };
    return t.lastIndex = 0, c;
  }
  return null;
}
function Yr(e, t, r, s) {
  let i;
  for (; i = e.exec(t); ) {
    const a = i.index || 0;
    if (a <= r && e.lastIndex >= r)
      return i;
    if (s > 0 && a > s)
      return null;
  }
  return null;
}
class ot {
  constructor(t) {
    const r = pt(t);
    this._defaultValue = r, this._asciiMap = ot._createAsciiMap(r), this._map = /* @__PURE__ */ new Map();
  }
  static _createAsciiMap(t) {
    const r = new Uint8Array(256);
    for (let s = 0; s < 256; s++)
      r[s] = t;
    return r;
  }
  set(t, r) {
    const s = pt(r);
    t >= 0 && t < 256 ? this._asciiMap[t] = s : this._map.set(t, s);
  }
  get(t) {
    return t >= 0 && t < 256 ? this._asciiMap[t] : this._map.get(t) || this._defaultValue;
  }
}
class Xr {
  constructor(t, r, s) {
    const i = new Uint8Array(t * r);
    for (let a = 0, o = t * r; a < o; a++)
      i[a] = s;
    this._data = i, this.rows = t, this.cols = r;
  }
  get(t, r) {
    return this._data[t * this.cols + r];
  }
  set(t, r, s) {
    this._data[t * this.cols + r] = s;
  }
}
class Jr {
  constructor(t) {
    let r = 0, s = 0;
    for (let a = 0, o = t.length; a < o; a++) {
      const [l, u, c] = t[a];
      u > r && (r = u), l > s && (s = l), c > s && (s = c);
    }
    r++, s++;
    const i = new Xr(
      s,
      r,
      0
      /* State.Invalid */
    );
    for (let a = 0, o = t.length; a < o; a++) {
      const [l, u, c] = t[a];
      i.set(l, u, c);
    }
    this._states = i, this._maxCharCode = r;
  }
  nextState(t, r) {
    return r < 0 || r >= this._maxCharCode ? 0 : this._states.get(t, r);
  }
}
let Te = null;
function Kr() {
  return Te === null && (Te = new Jr([
    [
      1,
      104,
      2
      /* State.H */
    ],
    [
      1,
      72,
      2
      /* State.H */
    ],
    [
      1,
      102,
      6
      /* State.F */
    ],
    [
      1,
      70,
      6
      /* State.F */
    ],
    [
      2,
      116,
      3
      /* State.HT */
    ],
    [
      2,
      84,
      3
      /* State.HT */
    ],
    [
      3,
      116,
      4
      /* State.HTT */
    ],
    [
      3,
      84,
      4
      /* State.HTT */
    ],
    [
      4,
      112,
      5
      /* State.HTTP */
    ],
    [
      4,
      80,
      5
      /* State.HTTP */
    ],
    [
      5,
      115,
      9
      /* State.BeforeColon */
    ],
    [
      5,
      83,
      9
      /* State.BeforeColon */
    ],
    [
      5,
      58,
      10
      /* State.AfterColon */
    ],
    [
      6,
      105,
      7
      /* State.FI */
    ],
    [
      6,
      73,
      7
      /* State.FI */
    ],
    [
      7,
      108,
      8
      /* State.FIL */
    ],
    [
      7,
      76,
      8
      /* State.FIL */
    ],
    [
      8,
      101,
      9
      /* State.BeforeColon */
    ],
    [
      8,
      69,
      9
      /* State.BeforeColon */
    ],
    [
      9,
      58,
      10
      /* State.AfterColon */
    ],
    [
      10,
      47,
      11
      /* State.AlmostThere */
    ],
    [
      11,
      47,
      12
      /* State.End */
    ]
  ])), Te;
}
let fe = null;
function e1() {
  if (fe === null) {
    fe = new ot(
      0
      /* CharacterClass.None */
    );
    const e = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…`;
    for (let r = 0; r < e.length; r++)
      fe.set(
        e.charCodeAt(r),
        1
        /* CharacterClass.ForceTermination */
      );
    const t = ".,;:";
    for (let r = 0; r < t.length; r++)
      fe.set(
        t.charCodeAt(r),
        2
        /* CharacterClass.CannotEndIn */
      );
  }
  return fe;
}
class Me {
  static _createLink(t, r, s, i, a) {
    let o = a - 1;
    do {
      const l = r.charCodeAt(o);
      if (t.get(l) !== 2)
        break;
      o--;
    } while (o > i);
    if (i > 0) {
      const l = r.charCodeAt(i - 1), u = r.charCodeAt(o);
      (l === 40 && u === 41 || l === 91 && u === 93 || l === 123 && u === 125) && o--;
    }
    return {
      range: {
        startLineNumber: s,
        startColumn: i + 1,
        endLineNumber: s,
        endColumn: o + 2
      },
      url: r.substring(i, o + 1)
    };
  }
  static computeLinks(t, r = Kr()) {
    const s = e1(), i = [];
    for (let a = 1, o = t.getLineCount(); a <= o; a++) {
      const l = t.getLineContent(a), u = l.length;
      let c = 0, f = 0, h = 0, d = 1, C = !1, v = !1, A = !1, k = !1;
      for (; c < u; ) {
        let R = !1;
        const P = l.charCodeAt(c);
        if (d === 13) {
          let y;
          switch (P) {
            case 40:
              C = !0, y = 0;
              break;
            case 41:
              y = C ? 0 : 1;
              break;
            case 91:
              A = !0, v = !0, y = 0;
              break;
            case 93:
              A = !1, y = v ? 0 : 1;
              break;
            case 123:
              k = !0, y = 0;
              break;
            case 125:
              y = k ? 0 : 1;
              break;
            case 39:
              y = h === 39 ? 1 : 0;
              break;
            case 34:
              y = h === 34 ? 1 : 0;
              break;
            case 96:
              y = h === 96 ? 1 : 0;
              break;
            case 42:
              y = h === 42 ? 1 : 0;
              break;
            case 124:
              y = h === 124 ? 1 : 0;
              break;
            case 32:
              y = A ? 0 : 1;
              break;
            default:
              y = s.get(P);
          }
          y === 1 && (i.push(Me._createLink(s, l, a, f, c)), R = !0);
        } else if (d === 12) {
          let y;
          P === 91 ? (v = !0, y = 0) : y = s.get(P), y === 1 ? R = !0 : d = 13;
        } else
          d = r.nextState(d, P), d === 0 && (R = !0);
        R && (d = 1, C = !1, v = !1, k = !1, f = c + 1, h = P), c++;
      }
      d === 13 && i.push(Me._createLink(s, l, a, f, u));
    }
    return i;
  }
}
function t1(e) {
  return !e || typeof e.getLineCount != "function" || typeof e.getLineContent != "function" ? [] : Me.computeLinks(e);
}
class Ze {
  constructor() {
    this._defaultValueSet = [
      ["true", "false"],
      ["True", "False"],
      ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
      ["public", "protected", "private"]
    ];
  }
  navigateValueSet(t, r, s, i, a) {
    if (t && r) {
      const o = this.doNavigateValueSet(r, a);
      if (o)
        return {
          range: t,
          value: o
        };
    }
    if (s && i) {
      const o = this.doNavigateValueSet(i, a);
      if (o)
        return {
          range: s,
          value: o
        };
    }
    return null;
  }
  doNavigateValueSet(t, r) {
    const s = this.numberReplace(t, r);
    return s !== null ? s : this.textReplace(t, r);
  }
  numberReplace(t, r) {
    const s = Math.pow(10, t.length - (t.lastIndexOf(".") + 1));
    let i = Number(t);
    const a = parseFloat(t);
    return !isNaN(i) && !isNaN(a) && i === a ? i === 0 && !r ? null : (i = Math.floor(i * s), i += r ? s : -s, String(i / s)) : null;
  }
  textReplace(t, r) {
    return this.valueSetsReplace(this._defaultValueSet, t, r);
  }
  valueSetsReplace(t, r, s) {
    let i = null;
    for (let a = 0, o = t.length; i === null && a < o; a++)
      i = this.valueSetReplace(t[a], r, s);
    return i;
  }
  valueSetReplace(t, r, s) {
    let i = t.indexOf(r);
    return i >= 0 ? (i += s ? 1 : -1, i < 0 ? i = t.length - 1 : i %= t.length, t[i]) : null;
  }
}
Ze.INSTANCE = new Ze();
const Dn = Object.freeze(function(e, t) {
  const r = setTimeout(e.bind(t), 0);
  return { dispose() {
    clearTimeout(r);
  } };
});
var Re;
(function(e) {
  function t(r) {
    return r === e.None || r === e.Cancelled || r instanceof Ne ? !0 : !r || typeof r != "object" ? !1 : typeof r.isCancellationRequested == "boolean" && typeof r.onCancellationRequested == "function";
  }
  e.isCancellationToken = t, e.None = Object.freeze({
    isCancellationRequested: !1,
    onCancellationRequested: qe.None
  }), e.Cancelled = Object.freeze({
    isCancellationRequested: !0,
    onCancellationRequested: Dn
  });
})(Re || (Re = {}));
class Ne {
  constructor() {
    this._isCancelled = !1, this._emitter = null;
  }
  cancel() {
    this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
  }
  get isCancellationRequested() {
    return this._isCancelled;
  }
  get onCancellationRequested() {
    return this._isCancelled ? Dn : (this._emitter || (this._emitter = new O()), this._emitter.event);
  }
  dispose() {
    this._emitter && (this._emitter.dispose(), this._emitter = null);
  }
}
class n1 {
  constructor(t) {
    this._token = void 0, this._parentListener = void 0, this._parentListener = t && t.onCancellationRequested(this.cancel, this);
  }
  get token() {
    return this._token || (this._token = new Ne()), this._token;
  }
  cancel() {
    this._token ? this._token instanceof Ne && this._token.cancel() : this._token = Re.Cancelled;
  }
  dispose(t = !1) {
    t && this.cancel(), this._parentListener && this._parentListener.dispose(), this._token ? this._token instanceof Ne && this._token.dispose() : this._token = Re.None;
  }
}
class lt {
  constructor() {
    this._keyCodeToStr = [], this._strToKeyCode = /* @__PURE__ */ Object.create(null);
  }
  define(t, r) {
    this._keyCodeToStr[t] = r, this._strToKeyCode[r.toLowerCase()] = t;
  }
  keyCodeToStr(t) {
    return this._keyCodeToStr[t];
  }
  strToKeyCode(t) {
    return this._strToKeyCode[t.toLowerCase()] || 0;
  }
}
const ve = new lt(), Ye = new lt(), Xe = new lt(), r1 = new Array(230), s1 = /* @__PURE__ */ Object.create(null), i1 = /* @__PURE__ */ Object.create(null);
(function() {
  const e = "", t = [
    // keyCodeOrd, immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel
    [0, 1, 0, "None", 0, "unknown", 0, "VK_UNKNOWN", e, e],
    [0, 1, 1, "Hyper", 0, e, 0, e, e, e],
    [0, 1, 2, "Super", 0, e, 0, e, e, e],
    [0, 1, 3, "Fn", 0, e, 0, e, e, e],
    [0, 1, 4, "FnLock", 0, e, 0, e, e, e],
    [0, 1, 5, "Suspend", 0, e, 0, e, e, e],
    [0, 1, 6, "Resume", 0, e, 0, e, e, e],
    [0, 1, 7, "Turbo", 0, e, 0, e, e, e],
    [0, 1, 8, "Sleep", 0, e, 0, "VK_SLEEP", e, e],
    [0, 1, 9, "WakeUp", 0, e, 0, e, e, e],
    [31, 0, 10, "KeyA", 31, "A", 65, "VK_A", e, e],
    [32, 0, 11, "KeyB", 32, "B", 66, "VK_B", e, e],
    [33, 0, 12, "KeyC", 33, "C", 67, "VK_C", e, e],
    [34, 0, 13, "KeyD", 34, "D", 68, "VK_D", e, e],
    [35, 0, 14, "KeyE", 35, "E", 69, "VK_E", e, e],
    [36, 0, 15, "KeyF", 36, "F", 70, "VK_F", e, e],
    [37, 0, 16, "KeyG", 37, "G", 71, "VK_G", e, e],
    [38, 0, 17, "KeyH", 38, "H", 72, "VK_H", e, e],
    [39, 0, 18, "KeyI", 39, "I", 73, "VK_I", e, e],
    [40, 0, 19, "KeyJ", 40, "J", 74, "VK_J", e, e],
    [41, 0, 20, "KeyK", 41, "K", 75, "VK_K", e, e],
    [42, 0, 21, "KeyL", 42, "L", 76, "VK_L", e, e],
    [43, 0, 22, "KeyM", 43, "M", 77, "VK_M", e, e],
    [44, 0, 23, "KeyN", 44, "N", 78, "VK_N", e, e],
    [45, 0, 24, "KeyO", 45, "O", 79, "VK_O", e, e],
    [46, 0, 25, "KeyP", 46, "P", 80, "VK_P", e, e],
    [47, 0, 26, "KeyQ", 47, "Q", 81, "VK_Q", e, e],
    [48, 0, 27, "KeyR", 48, "R", 82, "VK_R", e, e],
    [49, 0, 28, "KeyS", 49, "S", 83, "VK_S", e, e],
    [50, 0, 29, "KeyT", 50, "T", 84, "VK_T", e, e],
    [51, 0, 30, "KeyU", 51, "U", 85, "VK_U", e, e],
    [52, 0, 31, "KeyV", 52, "V", 86, "VK_V", e, e],
    [53, 0, 32, "KeyW", 53, "W", 87, "VK_W", e, e],
    [54, 0, 33, "KeyX", 54, "X", 88, "VK_X", e, e],
    [55, 0, 34, "KeyY", 55, "Y", 89, "VK_Y", e, e],
    [56, 0, 35, "KeyZ", 56, "Z", 90, "VK_Z", e, e],
    [22, 0, 36, "Digit1", 22, "1", 49, "VK_1", e, e],
    [23, 0, 37, "Digit2", 23, "2", 50, "VK_2", e, e],
    [24, 0, 38, "Digit3", 24, "3", 51, "VK_3", e, e],
    [25, 0, 39, "Digit4", 25, "4", 52, "VK_4", e, e],
    [26, 0, 40, "Digit5", 26, "5", 53, "VK_5", e, e],
    [27, 0, 41, "Digit6", 27, "6", 54, "VK_6", e, e],
    [28, 0, 42, "Digit7", 28, "7", 55, "VK_7", e, e],
    [29, 0, 43, "Digit8", 29, "8", 56, "VK_8", e, e],
    [30, 0, 44, "Digit9", 30, "9", 57, "VK_9", e, e],
    [21, 0, 45, "Digit0", 21, "0", 48, "VK_0", e, e],
    [3, 1, 46, "Enter", 3, "Enter", 13, "VK_RETURN", e, e],
    [9, 1, 47, "Escape", 9, "Escape", 27, "VK_ESCAPE", e, e],
    [1, 1, 48, "Backspace", 1, "Backspace", 8, "VK_BACK", e, e],
    [2, 1, 49, "Tab", 2, "Tab", 9, "VK_TAB", e, e],
    [10, 1, 50, "Space", 10, "Space", 32, "VK_SPACE", e, e],
    [83, 0, 51, "Minus", 83, "-", 189, "VK_OEM_MINUS", "-", "OEM_MINUS"],
    [81, 0, 52, "Equal", 81, "=", 187, "VK_OEM_PLUS", "=", "OEM_PLUS"],
    [87, 0, 53, "BracketLeft", 87, "[", 219, "VK_OEM_4", "[", "OEM_4"],
    [89, 0, 54, "BracketRight", 89, "]", 221, "VK_OEM_6", "]", "OEM_6"],
    [88, 0, 55, "Backslash", 88, "\\", 220, "VK_OEM_5", "\\", "OEM_5"],
    [0, 0, 56, "IntlHash", 0, e, 0, e, e, e],
    [80, 0, 57, "Semicolon", 80, ";", 186, "VK_OEM_1", ";", "OEM_1"],
    [90, 0, 58, "Quote", 90, "'", 222, "VK_OEM_7", "'", "OEM_7"],
    [86, 0, 59, "Backquote", 86, "`", 192, "VK_OEM_3", "`", "OEM_3"],
    [82, 0, 60, "Comma", 82, ",", 188, "VK_OEM_COMMA", ",", "OEM_COMMA"],
    [84, 0, 61, "Period", 84, ".", 190, "VK_OEM_PERIOD", ".", "OEM_PERIOD"],
    [85, 0, 62, "Slash", 85, "/", 191, "VK_OEM_2", "/", "OEM_2"],
    [8, 1, 63, "CapsLock", 8, "CapsLock", 20, "VK_CAPITAL", e, e],
    [59, 1, 64, "F1", 59, "F1", 112, "VK_F1", e, e],
    [60, 1, 65, "F2", 60, "F2", 113, "VK_F2", e, e],
    [61, 1, 66, "F3", 61, "F3", 114, "VK_F3", e, e],
    [62, 1, 67, "F4", 62, "F4", 115, "VK_F4", e, e],
    [63, 1, 68, "F5", 63, "F5", 116, "VK_F5", e, e],
    [64, 1, 69, "F6", 64, "F6", 117, "VK_F6", e, e],
    [65, 1, 70, "F7", 65, "F7", 118, "VK_F7", e, e],
    [66, 1, 71, "F8", 66, "F8", 119, "VK_F8", e, e],
    [67, 1, 72, "F9", 67, "F9", 120, "VK_F9", e, e],
    [68, 1, 73, "F10", 68, "F10", 121, "VK_F10", e, e],
    [69, 1, 74, "F11", 69, "F11", 122, "VK_F11", e, e],
    [70, 1, 75, "F12", 70, "F12", 123, "VK_F12", e, e],
    [0, 1, 76, "PrintScreen", 0, e, 0, e, e, e],
    [79, 1, 77, "ScrollLock", 79, "ScrollLock", 145, "VK_SCROLL", e, e],
    [7, 1, 78, "Pause", 7, "PauseBreak", 19, "VK_PAUSE", e, e],
    [19, 1, 79, "Insert", 19, "Insert", 45, "VK_INSERT", e, e],
    [14, 1, 80, "Home", 14, "Home", 36, "VK_HOME", e, e],
    [11, 1, 81, "PageUp", 11, "PageUp", 33, "VK_PRIOR", e, e],
    [20, 1, 82, "Delete", 20, "Delete", 46, "VK_DELETE", e, e],
    [13, 1, 83, "End", 13, "End", 35, "VK_END", e, e],
    [12, 1, 84, "PageDown", 12, "PageDown", 34, "VK_NEXT", e, e],
    [17, 1, 85, "ArrowRight", 17, "RightArrow", 39, "VK_RIGHT", "Right", e],
    [15, 1, 86, "ArrowLeft", 15, "LeftArrow", 37, "VK_LEFT", "Left", e],
    [18, 1, 87, "ArrowDown", 18, "DownArrow", 40, "VK_DOWN", "Down", e],
    [16, 1, 88, "ArrowUp", 16, "UpArrow", 38, "VK_UP", "Up", e],
    [78, 1, 89, "NumLock", 78, "NumLock", 144, "VK_NUMLOCK", e, e],
    [108, 1, 90, "NumpadDivide", 108, "NumPad_Divide", 111, "VK_DIVIDE", e, e],
    [103, 1, 91, "NumpadMultiply", 103, "NumPad_Multiply", 106, "VK_MULTIPLY", e, e],
    [106, 1, 92, "NumpadSubtract", 106, "NumPad_Subtract", 109, "VK_SUBTRACT", e, e],
    [104, 1, 93, "NumpadAdd", 104, "NumPad_Add", 107, "VK_ADD", e, e],
    [3, 1, 94, "NumpadEnter", 3, e, 0, e, e, e],
    [94, 1, 95, "Numpad1", 94, "NumPad1", 97, "VK_NUMPAD1", e, e],
    [95, 1, 96, "Numpad2", 95, "NumPad2", 98, "VK_NUMPAD2", e, e],
    [96, 1, 97, "Numpad3", 96, "NumPad3", 99, "VK_NUMPAD3", e, e],
    [97, 1, 98, "Numpad4", 97, "NumPad4", 100, "VK_NUMPAD4", e, e],
    [98, 1, 99, "Numpad5", 98, "NumPad5", 101, "VK_NUMPAD5", e, e],
    [99, 1, 100, "Numpad6", 99, "NumPad6", 102, "VK_NUMPAD6", e, e],
    [100, 1, 101, "Numpad7", 100, "NumPad7", 103, "VK_NUMPAD7", e, e],
    [101, 1, 102, "Numpad8", 101, "NumPad8", 104, "VK_NUMPAD8", e, e],
    [102, 1, 103, "Numpad9", 102, "NumPad9", 105, "VK_NUMPAD9", e, e],
    [93, 1, 104, "Numpad0", 93, "NumPad0", 96, "VK_NUMPAD0", e, e],
    [107, 1, 105, "NumpadDecimal", 107, "NumPad_Decimal", 110, "VK_DECIMAL", e, e],
    [92, 0, 106, "IntlBackslash", 92, "OEM_102", 226, "VK_OEM_102", e, e],
    [58, 1, 107, "ContextMenu", 58, "ContextMenu", 93, e, e, e],
    [0, 1, 108, "Power", 0, e, 0, e, e, e],
    [0, 1, 109, "NumpadEqual", 0, e, 0, e, e, e],
    [71, 1, 110, "F13", 71, "F13", 124, "VK_F13", e, e],
    [72, 1, 111, "F14", 72, "F14", 125, "VK_F14", e, e],
    [73, 1, 112, "F15", 73, "F15", 126, "VK_F15", e, e],
    [74, 1, 113, "F16", 74, "F16", 127, "VK_F16", e, e],
    [75, 1, 114, "F17", 75, "F17", 128, "VK_F17", e, e],
    [76, 1, 115, "F18", 76, "F18", 129, "VK_F18", e, e],
    [77, 1, 116, "F19", 77, "F19", 130, "VK_F19", e, e],
    [0, 1, 117, "F20", 0, e, 0, "VK_F20", e, e],
    [0, 1, 118, "F21", 0, e, 0, "VK_F21", e, e],
    [0, 1, 119, "F22", 0, e, 0, "VK_F22", e, e],
    [0, 1, 120, "F23", 0, e, 0, "VK_F23", e, e],
    [0, 1, 121, "F24", 0, e, 0, "VK_F24", e, e],
    [0, 1, 122, "Open", 0, e, 0, e, e, e],
    [0, 1, 123, "Help", 0, e, 0, e, e, e],
    [0, 1, 124, "Select", 0, e, 0, e, e, e],
    [0, 1, 125, "Again", 0, e, 0, e, e, e],
    [0, 1, 126, "Undo", 0, e, 0, e, e, e],
    [0, 1, 127, "Cut", 0, e, 0, e, e, e],
    [0, 1, 128, "Copy", 0, e, 0, e, e, e],
    [0, 1, 129, "Paste", 0, e, 0, e, e, e],
    [0, 1, 130, "Find", 0, e, 0, e, e, e],
    [0, 1, 131, "AudioVolumeMute", 112, "AudioVolumeMute", 173, "VK_VOLUME_MUTE", e, e],
    [0, 1, 132, "AudioVolumeUp", 113, "AudioVolumeUp", 175, "VK_VOLUME_UP", e, e],
    [0, 1, 133, "AudioVolumeDown", 114, "AudioVolumeDown", 174, "VK_VOLUME_DOWN", e, e],
    [105, 1, 134, "NumpadComma", 105, "NumPad_Separator", 108, "VK_SEPARATOR", e, e],
    [110, 0, 135, "IntlRo", 110, "ABNT_C1", 193, "VK_ABNT_C1", e, e],
    [0, 1, 136, "KanaMode", 0, e, 0, e, e, e],
    [0, 0, 137, "IntlYen", 0, e, 0, e, e, e],
    [0, 1, 138, "Convert", 0, e, 0, e, e, e],
    [0, 1, 139, "NonConvert", 0, e, 0, e, e, e],
    [0, 1, 140, "Lang1", 0, e, 0, e, e, e],
    [0, 1, 141, "Lang2", 0, e, 0, e, e, e],
    [0, 1, 142, "Lang3", 0, e, 0, e, e, e],
    [0, 1, 143, "Lang4", 0, e, 0, e, e, e],
    [0, 1, 144, "Lang5", 0, e, 0, e, e, e],
    [0, 1, 145, "Abort", 0, e, 0, e, e, e],
    [0, 1, 146, "Props", 0, e, 0, e, e, e],
    [0, 1, 147, "NumpadParenLeft", 0, e, 0, e, e, e],
    [0, 1, 148, "NumpadParenRight", 0, e, 0, e, e, e],
    [0, 1, 149, "NumpadBackspace", 0, e, 0, e, e, e],
    [0, 1, 150, "NumpadMemoryStore", 0, e, 0, e, e, e],
    [0, 1, 151, "NumpadMemoryRecall", 0, e, 0, e, e, e],
    [0, 1, 152, "NumpadMemoryClear", 0, e, 0, e, e, e],
    [0, 1, 153, "NumpadMemoryAdd", 0, e, 0, e, e, e],
    [0, 1, 154, "NumpadMemorySubtract", 0, e, 0, e, e, e],
    [0, 1, 155, "NumpadClear", 126, "Clear", 12, "VK_CLEAR", e, e],
    [0, 1, 156, "NumpadClearEntry", 0, e, 0, e, e, e],
    [5, 1, 0, e, 5, "Ctrl", 17, "VK_CONTROL", e, e],
    [4, 1, 0, e, 4, "Shift", 16, "VK_SHIFT", e, e],
    [6, 1, 0, e, 6, "Alt", 18, "VK_MENU", e, e],
    [57, 1, 0, e, 57, "Meta", 0, "VK_COMMAND", e, e],
    [5, 1, 157, "ControlLeft", 5, e, 0, "VK_LCONTROL", e, e],
    [4, 1, 158, "ShiftLeft", 4, e, 0, "VK_LSHIFT", e, e],
    [6, 1, 159, "AltLeft", 6, e, 0, "VK_LMENU", e, e],
    [57, 1, 160, "MetaLeft", 57, e, 0, "VK_LWIN", e, e],
    [5, 1, 161, "ControlRight", 5, e, 0, "VK_RCONTROL", e, e],
    [4, 1, 162, "ShiftRight", 4, e, 0, "VK_RSHIFT", e, e],
    [6, 1, 163, "AltRight", 6, e, 0, "VK_RMENU", e, e],
    [57, 1, 164, "MetaRight", 57, e, 0, "VK_RWIN", e, e],
    [0, 1, 165, "BrightnessUp", 0, e, 0, e, e, e],
    [0, 1, 166, "BrightnessDown", 0, e, 0, e, e, e],
    [0, 1, 167, "MediaPlay", 0, e, 0, e, e, e],
    [0, 1, 168, "MediaRecord", 0, e, 0, e, e, e],
    [0, 1, 169, "MediaFastForward", 0, e, 0, e, e, e],
    [0, 1, 170, "MediaRewind", 0, e, 0, e, e, e],
    [114, 1, 171, "MediaTrackNext", 119, "MediaTrackNext", 176, "VK_MEDIA_NEXT_TRACK", e, e],
    [115, 1, 172, "MediaTrackPrevious", 120, "MediaTrackPrevious", 177, "VK_MEDIA_PREV_TRACK", e, e],
    [116, 1, 173, "MediaStop", 121, "MediaStop", 178, "VK_MEDIA_STOP", e, e],
    [0, 1, 174, "Eject", 0, e, 0, e, e, e],
    [117, 1, 175, "MediaPlayPause", 122, "MediaPlayPause", 179, "VK_MEDIA_PLAY_PAUSE", e, e],
    [0, 1, 176, "MediaSelect", 123, "LaunchMediaPlayer", 181, "VK_MEDIA_LAUNCH_MEDIA_SELECT", e, e],
    [0, 1, 177, "LaunchMail", 124, "LaunchMail", 180, "VK_MEDIA_LAUNCH_MAIL", e, e],
    [0, 1, 178, "LaunchApp2", 125, "LaunchApp2", 183, "VK_MEDIA_LAUNCH_APP2", e, e],
    [0, 1, 179, "LaunchApp1", 0, e, 0, "VK_MEDIA_LAUNCH_APP1", e, e],
    [0, 1, 180, "SelectTask", 0, e, 0, e, e, e],
    [0, 1, 181, "LaunchScreenSaver", 0, e, 0, e, e, e],
    [0, 1, 182, "BrowserSearch", 115, "BrowserSearch", 170, "VK_BROWSER_SEARCH", e, e],
    [0, 1, 183, "BrowserHome", 116, "BrowserHome", 172, "VK_BROWSER_HOME", e, e],
    [112, 1, 184, "BrowserBack", 117, "BrowserBack", 166, "VK_BROWSER_BACK", e, e],
    [113, 1, 185, "BrowserForward", 118, "BrowserForward", 167, "VK_BROWSER_FORWARD", e, e],
    [0, 1, 186, "BrowserStop", 0, e, 0, "VK_BROWSER_STOP", e, e],
    [0, 1, 187, "BrowserRefresh", 0, e, 0, "VK_BROWSER_REFRESH", e, e],
    [0, 1, 188, "BrowserFavorites", 0, e, 0, "VK_BROWSER_FAVORITES", e, e],
    [0, 1, 189, "ZoomToggle", 0, e, 0, e, e, e],
    [0, 1, 190, "MailReply", 0, e, 0, e, e, e],
    [0, 1, 191, "MailForward", 0, e, 0, e, e, e],
    [0, 1, 192, "MailSend", 0, e, 0, e, e, e],
    // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
    // If an Input Method Editor is processing key input and the event is keydown, return 229.
    [109, 1, 0, e, 109, "KeyInComposition", 229, e, e, e],
    [111, 1, 0, e, 111, "ABNT_C2", 194, "VK_ABNT_C2", e, e],
    [91, 1, 0, e, 91, "OEM_8", 223, "VK_OEM_8", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_KANA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HANGUL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_JUNJA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_FINAL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HANJA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_KANJI", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_CONVERT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_NONCONVERT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ACCEPT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_MODECHANGE", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_SELECT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PRINT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EXECUTE", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_SNAPSHOT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HELP", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_APPS", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PROCESSKEY", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PACKET", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_DBE_SBCSCHAR", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_DBE_DBCSCHAR", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ATTN", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_CRSEL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EXSEL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EREOF", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PLAY", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ZOOM", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_NONAME", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PA1", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_OEM_CLEAR", e, e]
  ], r = [], s = [];
  for (const i of t) {
    const [a, o, l, u, c, f, h, d, C, v] = i;
    if (s[l] || (s[l] = !0, s1[u] = l, i1[u.toLowerCase()] = l), !r[c]) {
      if (r[c] = !0, !f)
        throw new Error(`String representation missing for key code ${c} around scan code ${u}`);
      ve.define(c, f), Ye.define(c, C || f), Xe.define(c, v || C || f);
    }
    h && (r1[h] = c);
  }
})();
var Lt;
(function(e) {
  function t(l) {
    return ve.keyCodeToStr(l);
  }
  e.toString = t;
  function r(l) {
    return ve.strToKeyCode(l);
  }
  e.fromString = r;
  function s(l) {
    return Ye.keyCodeToStr(l);
  }
  e.toUserSettingsUS = s;
  function i(l) {
    return Xe.keyCodeToStr(l);
  }
  e.toUserSettingsGeneral = i;
  function a(l) {
    return Ye.strToKeyCode(l) || Xe.strToKeyCode(l);
  }
  e.fromUserSettings = a;
  function o(l) {
    if (l >= 93 && l <= 108)
      return null;
    switch (l) {
      case 16:
        return "Up";
      case 18:
        return "Down";
      case 15:
        return "Left";
      case 17:
        return "Right";
    }
    return ve.keyCodeToStr(l);
  }
  e.toElectronAccelerator = o;
})(Lt || (Lt = {}));
function a1(e, t) {
  const r = (t & 65535) << 16 >>> 0;
  return (e | r) >>> 0;
}
class $ extends x {
  constructor(t, r, s, i) {
    super(t, r, s, i), this.selectionStartLineNumber = t, this.selectionStartColumn = r, this.positionLineNumber = s, this.positionColumn = i;
  }
  /**
   * Transform to a human-readable representation.
   */
  toString() {
    return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
  }
  /**
   * Test if equals other selection.
   */
  equalsSelection(t) {
    return $.selectionsEqual(this, t);
  }
  /**
   * Test if the two selections are equal.
   */
  static selectionsEqual(t, r) {
    return t.selectionStartLineNumber === r.selectionStartLineNumber && t.selectionStartColumn === r.selectionStartColumn && t.positionLineNumber === r.positionLineNumber && t.positionColumn === r.positionColumn;
  }
  /**
   * Get directions (LTR or RTL).
   */
  getDirection() {
    return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ? 0 : 1;
  }
  /**
   * Create a new selection with a different `positionLineNumber` and `positionColumn`.
   */
  setEndPosition(t, r) {
    return this.getDirection() === 0 ? new $(this.startLineNumber, this.startColumn, t, r) : new $(t, r, this.startLineNumber, this.startColumn);
  }
  /**
   * Get the position at `positionLineNumber` and `positionColumn`.
   */
  getPosition() {
    return new H(this.positionLineNumber, this.positionColumn);
  }
  /**
   * Get the position at the start of the selection.
  */
  getSelectionStart() {
    return new H(this.selectionStartLineNumber, this.selectionStartColumn);
  }
  /**
   * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
   */
  setStartPosition(t, r) {
    return this.getDirection() === 0 ? new $(t, r, this.endLineNumber, this.endColumn) : new $(this.endLineNumber, this.endColumn, t, r);
  }
  // ----
  /**
   * Create a `Selection` from one or two positions
   */
  static fromPositions(t, r = t) {
    return new $(t.lineNumber, t.column, r.lineNumber, r.column);
  }
  /**
   * Creates a `Selection` from a range, given a direction.
   */
  static fromRange(t, r) {
    return r === 0 ? new $(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new $(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
  }
  /**
   * Create a `Selection` from an `ISelection`.
   */
  static liftSelection(t) {
    return new $(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
  }
  /**
   * `a` equals `b`.
   */
  static selectionsArrEqual(t, r) {
    if (t && !r || !t && r)
      return !1;
    if (!t && !r)
      return !0;
    if (t.length !== r.length)
      return !1;
    for (let s = 0, i = t.length; s < i; s++)
      if (!this.selectionsEqual(t[s], r[s]))
        return !1;
    return !0;
  }
  /**
   * Test if `obj` is an `ISelection`.
   */
  static isISelection(t) {
    return t && typeof t.selectionStartLineNumber == "number" && typeof t.selectionStartColumn == "number" && typeof t.positionLineNumber == "number" && typeof t.positionColumn == "number";
  }
  /**
   * Create with a direction.
   */
  static createWithDirection(t, r, s, i, a) {
    return a === 0 ? new $(t, r, s, i) : new $(s, i, t, r);
  }
}
class n {
  constructor(t, r, s) {
    this.id = t, this.definition = r, this.description = s, n._allCodicons.push(this);
  }
  get classNames() {
    return "codicon codicon-" + this.id;
  }
  // classNamesArray is useful for migrating to ES6 classlist
  get classNamesArray() {
    return ["codicon", "codicon-" + this.id];
  }
  get cssSelector() {
    return ".codicon.codicon-" + this.id;
  }
  /**
   * @returns Returns all default icons covered by the codicon font. Only to be used by the icon registry in platform.
   */
  static getAll() {
    return n._allCodicons;
  }
}
n._allCodicons = [];
n.add = new n("add", { fontCharacter: "\\ea60" });
n.plus = new n("plus", n.add.definition);
n.gistNew = new n("gist-new", n.add.definition);
n.repoCreate = new n("repo-create", n.add.definition);
n.lightbulb = new n("lightbulb", { fontCharacter: "\\ea61" });
n.lightBulb = new n("light-bulb", { fontCharacter: "\\ea61" });
n.repo = new n("repo", { fontCharacter: "\\ea62" });
n.repoDelete = new n("repo-delete", { fontCharacter: "\\ea62" });
n.gistFork = new n("gist-fork", { fontCharacter: "\\ea63" });
n.repoForked = new n("repo-forked", { fontCharacter: "\\ea63" });
n.gitPullRequest = new n("git-pull-request", { fontCharacter: "\\ea64" });
n.gitPullRequestAbandoned = new n("git-pull-request-abandoned", { fontCharacter: "\\ea64" });
n.recordKeys = new n("record-keys", { fontCharacter: "\\ea65" });
n.keyboard = new n("keyboard", { fontCharacter: "\\ea65" });
n.tag = new n("tag", { fontCharacter: "\\ea66" });
n.tagAdd = new n("tag-add", { fontCharacter: "\\ea66" });
n.tagRemove = new n("tag-remove", { fontCharacter: "\\ea66" });
n.person = new n("person", { fontCharacter: "\\ea67" });
n.personFollow = new n("person-follow", { fontCharacter: "\\ea67" });
n.personOutline = new n("person-outline", { fontCharacter: "\\ea67" });
n.personFilled = new n("person-filled", { fontCharacter: "\\ea67" });
n.gitBranch = new n("git-branch", { fontCharacter: "\\ea68" });
n.gitBranchCreate = new n("git-branch-create", { fontCharacter: "\\ea68" });
n.gitBranchDelete = new n("git-branch-delete", { fontCharacter: "\\ea68" });
n.sourceControl = new n("source-control", { fontCharacter: "\\ea68" });
n.mirror = new n("mirror", { fontCharacter: "\\ea69" });
n.mirrorPublic = new n("mirror-public", { fontCharacter: "\\ea69" });
n.star = new n("star", { fontCharacter: "\\ea6a" });
n.starAdd = new n("star-add", { fontCharacter: "\\ea6a" });
n.starDelete = new n("star-delete", { fontCharacter: "\\ea6a" });
n.starEmpty = new n("star-empty", { fontCharacter: "\\ea6a" });
n.comment = new n("comment", { fontCharacter: "\\ea6b" });
n.commentAdd = new n("comment-add", { fontCharacter: "\\ea6b" });
n.alert = new n("alert", { fontCharacter: "\\ea6c" });
n.warning = new n("warning", { fontCharacter: "\\ea6c" });
n.search = new n("search", { fontCharacter: "\\ea6d" });
n.searchSave = new n("search-save", { fontCharacter: "\\ea6d" });
n.logOut = new n("log-out", { fontCharacter: "\\ea6e" });
n.signOut = new n("sign-out", { fontCharacter: "\\ea6e" });
n.logIn = new n("log-in", { fontCharacter: "\\ea6f" });
n.signIn = new n("sign-in", { fontCharacter: "\\ea6f" });
n.eye = new n("eye", { fontCharacter: "\\ea70" });
n.eyeUnwatch = new n("eye-unwatch", { fontCharacter: "\\ea70" });
n.eyeWatch = new n("eye-watch", { fontCharacter: "\\ea70" });
n.circleFilled = new n("circle-filled", { fontCharacter: "\\ea71" });
n.primitiveDot = new n("primitive-dot", { fontCharacter: "\\ea71" });
n.closeDirty = new n("close-dirty", { fontCharacter: "\\ea71" });
n.debugBreakpoint = new n("debug-breakpoint", { fontCharacter: "\\ea71" });
n.debugBreakpointDisabled = new n("debug-breakpoint-disabled", { fontCharacter: "\\ea71" });
n.debugHint = new n("debug-hint", { fontCharacter: "\\ea71" });
n.primitiveSquare = new n("primitive-square", { fontCharacter: "\\ea72" });
n.edit = new n("edit", { fontCharacter: "\\ea73" });
n.pencil = new n("pencil", { fontCharacter: "\\ea73" });
n.info = new n("info", { fontCharacter: "\\ea74" });
n.issueOpened = new n("issue-opened", { fontCharacter: "\\ea74" });
n.gistPrivate = new n("gist-private", { fontCharacter: "\\ea75" });
n.gitForkPrivate = new n("git-fork-private", { fontCharacter: "\\ea75" });
n.lock = new n("lock", { fontCharacter: "\\ea75" });
n.mirrorPrivate = new n("mirror-private", { fontCharacter: "\\ea75" });
n.close = new n("close", { fontCharacter: "\\ea76" });
n.removeClose = new n("remove-close", { fontCharacter: "\\ea76" });
n.x = new n("x", { fontCharacter: "\\ea76" });
n.repoSync = new n("repo-sync", { fontCharacter: "\\ea77" });
n.sync = new n("sync", { fontCharacter: "\\ea77" });
n.clone = new n("clone", { fontCharacter: "\\ea78" });
n.desktopDownload = new n("desktop-download", { fontCharacter: "\\ea78" });
n.beaker = new n("beaker", { fontCharacter: "\\ea79" });
n.microscope = new n("microscope", { fontCharacter: "\\ea79" });
n.vm = new n("vm", { fontCharacter: "\\ea7a" });
n.deviceDesktop = new n("device-desktop", { fontCharacter: "\\ea7a" });
n.file = new n("file", { fontCharacter: "\\ea7b" });
n.fileText = new n("file-text", { fontCharacter: "\\ea7b" });
n.more = new n("more", { fontCharacter: "\\ea7c" });
n.ellipsis = new n("ellipsis", { fontCharacter: "\\ea7c" });
n.kebabHorizontal = new n("kebab-horizontal", { fontCharacter: "\\ea7c" });
n.mailReply = new n("mail-reply", { fontCharacter: "\\ea7d" });
n.reply = new n("reply", { fontCharacter: "\\ea7d" });
n.organization = new n("organization", { fontCharacter: "\\ea7e" });
n.organizationFilled = new n("organization-filled", { fontCharacter: "\\ea7e" });
n.organizationOutline = new n("organization-outline", { fontCharacter: "\\ea7e" });
n.newFile = new n("new-file", { fontCharacter: "\\ea7f" });
n.fileAdd = new n("file-add", { fontCharacter: "\\ea7f" });
n.newFolder = new n("new-folder", { fontCharacter: "\\ea80" });
n.fileDirectoryCreate = new n("file-directory-create", { fontCharacter: "\\ea80" });
n.trash = new n("trash", { fontCharacter: "\\ea81" });
n.trashcan = new n("trashcan", { fontCharacter: "\\ea81" });
n.history = new n("history", { fontCharacter: "\\ea82" });
n.clock = new n("clock", { fontCharacter: "\\ea82" });
n.folder = new n("folder", { fontCharacter: "\\ea83" });
n.fileDirectory = new n("file-directory", { fontCharacter: "\\ea83" });
n.symbolFolder = new n("symbol-folder", { fontCharacter: "\\ea83" });
n.logoGithub = new n("logo-github", { fontCharacter: "\\ea84" });
n.markGithub = new n("mark-github", { fontCharacter: "\\ea84" });
n.github = new n("github", { fontCharacter: "\\ea84" });
n.terminal = new n("terminal", { fontCharacter: "\\ea85" });
n.console = new n("console", { fontCharacter: "\\ea85" });
n.repl = new n("repl", { fontCharacter: "\\ea85" });
n.zap = new n("zap", { fontCharacter: "\\ea86" });
n.symbolEvent = new n("symbol-event", { fontCharacter: "\\ea86" });
n.error = new n("error", { fontCharacter: "\\ea87" });
n.stop = new n("stop", { fontCharacter: "\\ea87" });
n.variable = new n("variable", { fontCharacter: "\\ea88" });
n.symbolVariable = new n("symbol-variable", { fontCharacter: "\\ea88" });
n.array = new n("array", { fontCharacter: "\\ea8a" });
n.symbolArray = new n("symbol-array", { fontCharacter: "\\ea8a" });
n.symbolModule = new n("symbol-module", { fontCharacter: "\\ea8b" });
n.symbolPackage = new n("symbol-package", { fontCharacter: "\\ea8b" });
n.symbolNamespace = new n("symbol-namespace", { fontCharacter: "\\ea8b" });
n.symbolObject = new n("symbol-object", { fontCharacter: "\\ea8b" });
n.symbolMethod = new n("symbol-method", { fontCharacter: "\\ea8c" });
n.symbolFunction = new n("symbol-function", { fontCharacter: "\\ea8c" });
n.symbolConstructor = new n("symbol-constructor", { fontCharacter: "\\ea8c" });
n.symbolBoolean = new n("symbol-boolean", { fontCharacter: "\\ea8f" });
n.symbolNull = new n("symbol-null", { fontCharacter: "\\ea8f" });
n.symbolNumeric = new n("symbol-numeric", { fontCharacter: "\\ea90" });
n.symbolNumber = new n("symbol-number", { fontCharacter: "\\ea90" });
n.symbolStructure = new n("symbol-structure", { fontCharacter: "\\ea91" });
n.symbolStruct = new n("symbol-struct", { fontCharacter: "\\ea91" });
n.symbolParameter = new n("symbol-parameter", { fontCharacter: "\\ea92" });
n.symbolTypeParameter = new n("symbol-type-parameter", { fontCharacter: "\\ea92" });
n.symbolKey = new n("symbol-key", { fontCharacter: "\\ea93" });
n.symbolText = new n("symbol-text", { fontCharacter: "\\ea93" });
n.symbolReference = new n("symbol-reference", { fontCharacter: "\\ea94" });
n.goToFile = new n("go-to-file", { fontCharacter: "\\ea94" });
n.symbolEnum = new n("symbol-enum", { fontCharacter: "\\ea95" });
n.symbolValue = new n("symbol-value", { fontCharacter: "\\ea95" });
n.symbolRuler = new n("symbol-ruler", { fontCharacter: "\\ea96" });
n.symbolUnit = new n("symbol-unit", { fontCharacter: "\\ea96" });
n.activateBreakpoints = new n("activate-breakpoints", { fontCharacter: "\\ea97" });
n.archive = new n("archive", { fontCharacter: "\\ea98" });
n.arrowBoth = new n("arrow-both", { fontCharacter: "\\ea99" });
n.arrowDown = new n("arrow-down", { fontCharacter: "\\ea9a" });
n.arrowLeft = new n("arrow-left", { fontCharacter: "\\ea9b" });
n.arrowRight = new n("arrow-right", { fontCharacter: "\\ea9c" });
n.arrowSmallDown = new n("arrow-small-down", { fontCharacter: "\\ea9d" });
n.arrowSmallLeft = new n("arrow-small-left", { fontCharacter: "\\ea9e" });
n.arrowSmallRight = new n("arrow-small-right", { fontCharacter: "\\ea9f" });
n.arrowSmallUp = new n("arrow-small-up", { fontCharacter: "\\eaa0" });
n.arrowUp = new n("arrow-up", { fontCharacter: "\\eaa1" });
n.bell = new n("bell", { fontCharacter: "\\eaa2" });
n.bold = new n("bold", { fontCharacter: "\\eaa3" });
n.book = new n("book", { fontCharacter: "\\eaa4" });
n.bookmark = new n("bookmark", { fontCharacter: "\\eaa5" });
n.debugBreakpointConditionalUnverified = new n("debug-breakpoint-conditional-unverified", { fontCharacter: "\\eaa6" });
n.debugBreakpointConditional = new n("debug-breakpoint-conditional", { fontCharacter: "\\eaa7" });
n.debugBreakpointConditionalDisabled = new n("debug-breakpoint-conditional-disabled", { fontCharacter: "\\eaa7" });
n.debugBreakpointDataUnverified = new n("debug-breakpoint-data-unverified", { fontCharacter: "\\eaa8" });
n.debugBreakpointData = new n("debug-breakpoint-data", { fontCharacter: "\\eaa9" });
n.debugBreakpointDataDisabled = new n("debug-breakpoint-data-disabled", { fontCharacter: "\\eaa9" });
n.debugBreakpointLogUnverified = new n("debug-breakpoint-log-unverified", { fontCharacter: "\\eaaa" });
n.debugBreakpointLog = new n("debug-breakpoint-log", { fontCharacter: "\\eaab" });
n.debugBreakpointLogDisabled = new n("debug-breakpoint-log-disabled", { fontCharacter: "\\eaab" });
n.briefcase = new n("briefcase", { fontCharacter: "\\eaac" });
n.broadcast = new n("broadcast", { fontCharacter: "\\eaad" });
n.browser = new n("browser", { fontCharacter: "\\eaae" });
n.bug = new n("bug", { fontCharacter: "\\eaaf" });
n.calendar = new n("calendar", { fontCharacter: "\\eab0" });
n.caseSensitive = new n("case-sensitive", { fontCharacter: "\\eab1" });
n.check = new n("check", { fontCharacter: "\\eab2" });
n.checklist = new n("checklist", { fontCharacter: "\\eab3" });
n.chevronDown = new n("chevron-down", { fontCharacter: "\\eab4" });
n.dropDownButton = new n("drop-down-button", n.chevronDown.definition);
n.chevronLeft = new n("chevron-left", { fontCharacter: "\\eab5" });
n.chevronRight = new n("chevron-right", { fontCharacter: "\\eab6" });
n.chevronUp = new n("chevron-up", { fontCharacter: "\\eab7" });
n.chromeClose = new n("chrome-close", { fontCharacter: "\\eab8" });
n.chromeMaximize = new n("chrome-maximize", { fontCharacter: "\\eab9" });
n.chromeMinimize = new n("chrome-minimize", { fontCharacter: "\\eaba" });
n.chromeRestore = new n("chrome-restore", { fontCharacter: "\\eabb" });
n.circleOutline = new n("circle-outline", { fontCharacter: "\\eabc" });
n.debugBreakpointUnverified = new n("debug-breakpoint-unverified", { fontCharacter: "\\eabc" });
n.circleSlash = new n("circle-slash", { fontCharacter: "\\eabd" });
n.circuitBoard = new n("circuit-board", { fontCharacter: "\\eabe" });
n.clearAll = new n("clear-all", { fontCharacter: "\\eabf" });
n.clippy = new n("clippy", { fontCharacter: "\\eac0" });
n.closeAll = new n("close-all", { fontCharacter: "\\eac1" });
n.cloudDownload = new n("cloud-download", { fontCharacter: "\\eac2" });
n.cloudUpload = new n("cloud-upload", { fontCharacter: "\\eac3" });
n.code = new n("code", { fontCharacter: "\\eac4" });
n.collapseAll = new n("collapse-all", { fontCharacter: "\\eac5" });
n.colorMode = new n("color-mode", { fontCharacter: "\\eac6" });
n.commentDiscussion = new n("comment-discussion", { fontCharacter: "\\eac7" });
n.compareChanges = new n("compare-changes", { fontCharacter: "\\eafd" });
n.creditCard = new n("credit-card", { fontCharacter: "\\eac9" });
n.dash = new n("dash", { fontCharacter: "\\eacc" });
n.dashboard = new n("dashboard", { fontCharacter: "\\eacd" });
n.database = new n("database", { fontCharacter: "\\eace" });
n.debugContinue = new n("debug-continue", { fontCharacter: "\\eacf" });
n.debugDisconnect = new n("debug-disconnect", { fontCharacter: "\\ead0" });
n.debugPause = new n("debug-pause", { fontCharacter: "\\ead1" });
n.debugRestart = new n("debug-restart", { fontCharacter: "\\ead2" });
n.debugStart = new n("debug-start", { fontCharacter: "\\ead3" });
n.debugStepInto = new n("debug-step-into", { fontCharacter: "\\ead4" });
n.debugStepOut = new n("debug-step-out", { fontCharacter: "\\ead5" });
n.debugStepOver = new n("debug-step-over", { fontCharacter: "\\ead6" });
n.debugStop = new n("debug-stop", { fontCharacter: "\\ead7" });
n.debug = new n("debug", { fontCharacter: "\\ead8" });
n.deviceCameraVideo = new n("device-camera-video", { fontCharacter: "\\ead9" });
n.deviceCamera = new n("device-camera", { fontCharacter: "\\eada" });
n.deviceMobile = new n("device-mobile", { fontCharacter: "\\eadb" });
n.diffAdded = new n("diff-added", { fontCharacter: "\\eadc" });
n.diffIgnored = new n("diff-ignored", { fontCharacter: "\\eadd" });
n.diffModified = new n("diff-modified", { fontCharacter: "\\eade" });
n.diffRemoved = new n("diff-removed", { fontCharacter: "\\eadf" });
n.diffRenamed = new n("diff-renamed", { fontCharacter: "\\eae0" });
n.diff = new n("diff", { fontCharacter: "\\eae1" });
n.discard = new n("discard", { fontCharacter: "\\eae2" });
n.editorLayout = new n("editor-layout", { fontCharacter: "\\eae3" });
n.emptyWindow = new n("empty-window", { fontCharacter: "\\eae4" });
n.exclude = new n("exclude", { fontCharacter: "\\eae5" });
n.extensions = new n("extensions", { fontCharacter: "\\eae6" });
n.eyeClosed = new n("eye-closed", { fontCharacter: "\\eae7" });
n.fileBinary = new n("file-binary", { fontCharacter: "\\eae8" });
n.fileCode = new n("file-code", { fontCharacter: "\\eae9" });
n.fileMedia = new n("file-media", { fontCharacter: "\\eaea" });
n.filePdf = new n("file-pdf", { fontCharacter: "\\eaeb" });
n.fileSubmodule = new n("file-submodule", { fontCharacter: "\\eaec" });
n.fileSymlinkDirectory = new n("file-symlink-directory", { fontCharacter: "\\eaed" });
n.fileSymlinkFile = new n("file-symlink-file", { fontCharacter: "\\eaee" });
n.fileZip = new n("file-zip", { fontCharacter: "\\eaef" });
n.files = new n("files", { fontCharacter: "\\eaf0" });
n.filter = new n("filter", { fontCharacter: "\\eaf1" });
n.flame = new n("flame", { fontCharacter: "\\eaf2" });
n.foldDown = new n("fold-down", { fontCharacter: "\\eaf3" });
n.foldUp = new n("fold-up", { fontCharacter: "\\eaf4" });
n.fold = new n("fold", { fontCharacter: "\\eaf5" });
n.folderActive = new n("folder-active", { fontCharacter: "\\eaf6" });
n.folderOpened = new n("folder-opened", { fontCharacter: "\\eaf7" });
n.gear = new n("gear", { fontCharacter: "\\eaf8" });
n.gift = new n("gift", { fontCharacter: "\\eaf9" });
n.gistSecret = new n("gist-secret", { fontCharacter: "\\eafa" });
n.gist = new n("gist", { fontCharacter: "\\eafb" });
n.gitCommit = new n("git-commit", { fontCharacter: "\\eafc" });
n.gitCompare = new n("git-compare", { fontCharacter: "\\eafd" });
n.gitMerge = new n("git-merge", { fontCharacter: "\\eafe" });
n.githubAction = new n("github-action", { fontCharacter: "\\eaff" });
n.githubAlt = new n("github-alt", { fontCharacter: "\\eb00" });
n.globe = new n("globe", { fontCharacter: "\\eb01" });
n.grabber = new n("grabber", { fontCharacter: "\\eb02" });
n.graph = new n("graph", { fontCharacter: "\\eb03" });
n.gripper = new n("gripper", { fontCharacter: "\\eb04" });
n.heart = new n("heart", { fontCharacter: "\\eb05" });
n.home = new n("home", { fontCharacter: "\\eb06" });
n.horizontalRule = new n("horizontal-rule", { fontCharacter: "\\eb07" });
n.hubot = new n("hubot", { fontCharacter: "\\eb08" });
n.inbox = new n("inbox", { fontCharacter: "\\eb09" });
n.issueClosed = new n("issue-closed", { fontCharacter: "\\eba4" });
n.issueReopened = new n("issue-reopened", { fontCharacter: "\\eb0b" });
n.issues = new n("issues", { fontCharacter: "\\eb0c" });
n.italic = new n("italic", { fontCharacter: "\\eb0d" });
n.jersey = new n("jersey", { fontCharacter: "\\eb0e" });
n.json = new n("json", { fontCharacter: "\\eb0f" });
n.kebabVertical = new n("kebab-vertical", { fontCharacter: "\\eb10" });
n.key = new n("key", { fontCharacter: "\\eb11" });
n.law = new n("law", { fontCharacter: "\\eb12" });
n.lightbulbAutofix = new n("lightbulb-autofix", { fontCharacter: "\\eb13" });
n.linkExternal = new n("link-external", { fontCharacter: "\\eb14" });
n.link = new n("link", { fontCharacter: "\\eb15" });
n.listOrdered = new n("list-ordered", { fontCharacter: "\\eb16" });
n.listUnordered = new n("list-unordered", { fontCharacter: "\\eb17" });
n.liveShare = new n("live-share", { fontCharacter: "\\eb18" });
n.loading = new n("loading", { fontCharacter: "\\eb19" });
n.location = new n("location", { fontCharacter: "\\eb1a" });
n.mailRead = new n("mail-read", { fontCharacter: "\\eb1b" });
n.mail = new n("mail", { fontCharacter: "\\eb1c" });
n.markdown = new n("markdown", { fontCharacter: "\\eb1d" });
n.megaphone = new n("megaphone", { fontCharacter: "\\eb1e" });
n.mention = new n("mention", { fontCharacter: "\\eb1f" });
n.milestone = new n("milestone", { fontCharacter: "\\eb20" });
n.mortarBoard = new n("mortar-board", { fontCharacter: "\\eb21" });
n.move = new n("move", { fontCharacter: "\\eb22" });
n.multipleWindows = new n("multiple-windows", { fontCharacter: "\\eb23" });
n.mute = new n("mute", { fontCharacter: "\\eb24" });
n.noNewline = new n("no-newline", { fontCharacter: "\\eb25" });
n.note = new n("note", { fontCharacter: "\\eb26" });
n.octoface = new n("octoface", { fontCharacter: "\\eb27" });
n.openPreview = new n("open-preview", { fontCharacter: "\\eb28" });
n.package_ = new n("package", { fontCharacter: "\\eb29" });
n.paintcan = new n("paintcan", { fontCharacter: "\\eb2a" });
n.pin = new n("pin", { fontCharacter: "\\eb2b" });
n.play = new n("play", { fontCharacter: "\\eb2c" });
n.run = new n("run", { fontCharacter: "\\eb2c" });
n.plug = new n("plug", { fontCharacter: "\\eb2d" });
n.preserveCase = new n("preserve-case", { fontCharacter: "\\eb2e" });
n.preview = new n("preview", { fontCharacter: "\\eb2f" });
n.project = new n("project", { fontCharacter: "\\eb30" });
n.pulse = new n("pulse", { fontCharacter: "\\eb31" });
n.question = new n("question", { fontCharacter: "\\eb32" });
n.quote = new n("quote", { fontCharacter: "\\eb33" });
n.radioTower = new n("radio-tower", { fontCharacter: "\\eb34" });
n.reactions = new n("reactions", { fontCharacter: "\\eb35" });
n.references = new n("references", { fontCharacter: "\\eb36" });
n.refresh = new n("refresh", { fontCharacter: "\\eb37" });
n.regex = new n("regex", { fontCharacter: "\\eb38" });
n.remoteExplorer = new n("remote-explorer", { fontCharacter: "\\eb39" });
n.remote = new n("remote", { fontCharacter: "\\eb3a" });
n.remove = new n("remove", { fontCharacter: "\\eb3b" });
n.replaceAll = new n("replace-all", { fontCharacter: "\\eb3c" });
n.replace = new n("replace", { fontCharacter: "\\eb3d" });
n.repoClone = new n("repo-clone", { fontCharacter: "\\eb3e" });
n.repoForcePush = new n("repo-force-push", { fontCharacter: "\\eb3f" });
n.repoPull = new n("repo-pull", { fontCharacter: "\\eb40" });
n.repoPush = new n("repo-push", { fontCharacter: "\\eb41" });
n.report = new n("report", { fontCharacter: "\\eb42" });
n.requestChanges = new n("request-changes", { fontCharacter: "\\eb43" });
n.rocket = new n("rocket", { fontCharacter: "\\eb44" });
n.rootFolderOpened = new n("root-folder-opened", { fontCharacter: "\\eb45" });
n.rootFolder = new n("root-folder", { fontCharacter: "\\eb46" });
n.rss = new n("rss", { fontCharacter: "\\eb47" });
n.ruby = new n("ruby", { fontCharacter: "\\eb48" });
n.saveAll = new n("save-all", { fontCharacter: "\\eb49" });
n.saveAs = new n("save-as", { fontCharacter: "\\eb4a" });
n.save = new n("save", { fontCharacter: "\\eb4b" });
n.screenFull = new n("screen-full", { fontCharacter: "\\eb4c" });
n.screenNormal = new n("screen-normal", { fontCharacter: "\\eb4d" });
n.searchStop = new n("search-stop", { fontCharacter: "\\eb4e" });
n.server = new n("server", { fontCharacter: "\\eb50" });
n.settingsGear = new n("settings-gear", { fontCharacter: "\\eb51" });
n.settings = new n("settings", { fontCharacter: "\\eb52" });
n.shield = new n("shield", { fontCharacter: "\\eb53" });
n.smiley = new n("smiley", { fontCharacter: "\\eb54" });
n.sortPrecedence = new n("sort-precedence", { fontCharacter: "\\eb55" });
n.splitHorizontal = new n("split-horizontal", { fontCharacter: "\\eb56" });
n.splitVertical = new n("split-vertical", { fontCharacter: "\\eb57" });
n.squirrel = new n("squirrel", { fontCharacter: "\\eb58" });
n.starFull = new n("star-full", { fontCharacter: "\\eb59" });
n.starHalf = new n("star-half", { fontCharacter: "\\eb5a" });
n.symbolClass = new n("symbol-class", { fontCharacter: "\\eb5b" });
n.symbolColor = new n("symbol-color", { fontCharacter: "\\eb5c" });
n.symbolCustomColor = new n("symbol-customcolor", { fontCharacter: "\\eb5c" });
n.symbolConstant = new n("symbol-constant", { fontCharacter: "\\eb5d" });
n.symbolEnumMember = new n("symbol-enum-member", { fontCharacter: "\\eb5e" });
n.symbolField = new n("symbol-field", { fontCharacter: "\\eb5f" });
n.symbolFile = new n("symbol-file", { fontCharacter: "\\eb60" });
n.symbolInterface = new n("symbol-interface", { fontCharacter: "\\eb61" });
n.symbolKeyword = new n("symbol-keyword", { fontCharacter: "\\eb62" });
n.symbolMisc = new n("symbol-misc", { fontCharacter: "\\eb63" });
n.symbolOperator = new n("symbol-operator", { fontCharacter: "\\eb64" });
n.symbolProperty = new n("symbol-property", { fontCharacter: "\\eb65" });
n.wrench = new n("wrench", { fontCharacter: "\\eb65" });
n.wrenchSubaction = new n("wrench-subaction", { fontCharacter: "\\eb65" });
n.symbolSnippet = new n("symbol-snippet", { fontCharacter: "\\eb66" });
n.tasklist = new n("tasklist", { fontCharacter: "\\eb67" });
n.telescope = new n("telescope", { fontCharacter: "\\eb68" });
n.textSize = new n("text-size", { fontCharacter: "\\eb69" });
n.threeBars = new n("three-bars", { fontCharacter: "\\eb6a" });
n.thumbsdown = new n("thumbsdown", { fontCharacter: "\\eb6b" });
n.thumbsup = new n("thumbsup", { fontCharacter: "\\eb6c" });
n.tools = new n("tools", { fontCharacter: "\\eb6d" });
n.triangleDown = new n("triangle-down", { fontCharacter: "\\eb6e" });
n.triangleLeft = new n("triangle-left", { fontCharacter: "\\eb6f" });
n.triangleRight = new n("triangle-right", { fontCharacter: "\\eb70" });
n.triangleUp = new n("triangle-up", { fontCharacter: "\\eb71" });
n.twitter = new n("twitter", { fontCharacter: "\\eb72" });
n.unfold = new n("unfold", { fontCharacter: "\\eb73" });
n.unlock = new n("unlock", { fontCharacter: "\\eb74" });
n.unmute = new n("unmute", { fontCharacter: "\\eb75" });
n.unverified = new n("unverified", { fontCharacter: "\\eb76" });
n.verified = new n("verified", { fontCharacter: "\\eb77" });
n.versions = new n("versions", { fontCharacter: "\\eb78" });
n.vmActive = new n("vm-active", { fontCharacter: "\\eb79" });
n.vmOutline = new n("vm-outline", { fontCharacter: "\\eb7a" });
n.vmRunning = new n("vm-running", { fontCharacter: "\\eb7b" });
n.watch = new n("watch", { fontCharacter: "\\eb7c" });
n.whitespace = new n("whitespace", { fontCharacter: "\\eb7d" });
n.wholeWord = new n("whole-word", { fontCharacter: "\\eb7e" });
n.window = new n("window", { fontCharacter: "\\eb7f" });
n.wordWrap = new n("word-wrap", { fontCharacter: "\\eb80" });
n.zoomIn = new n("zoom-in", { fontCharacter: "\\eb81" });
n.zoomOut = new n("zoom-out", { fontCharacter: "\\eb82" });
n.listFilter = new n("list-filter", { fontCharacter: "\\eb83" });
n.listFlat = new n("list-flat", { fontCharacter: "\\eb84" });
n.listSelection = new n("list-selection", { fontCharacter: "\\eb85" });
n.selection = new n("selection", { fontCharacter: "\\eb85" });
n.listTree = new n("list-tree", { fontCharacter: "\\eb86" });
n.debugBreakpointFunctionUnverified = new n("debug-breakpoint-function-unverified", { fontCharacter: "\\eb87" });
n.debugBreakpointFunction = new n("debug-breakpoint-function", { fontCharacter: "\\eb88" });
n.debugBreakpointFunctionDisabled = new n("debug-breakpoint-function-disabled", { fontCharacter: "\\eb88" });
n.debugStackframeActive = new n("debug-stackframe-active", { fontCharacter: "\\eb89" });
n.circleSmallFilled = new n("circle-small-filled", { fontCharacter: "\\eb8a" });
n.debugStackframeDot = new n("debug-stackframe-dot", n.circleSmallFilled.definition);
n.debugStackframe = new n("debug-stackframe", { fontCharacter: "\\eb8b" });
n.debugStackframeFocused = new n("debug-stackframe-focused", { fontCharacter: "\\eb8b" });
n.debugBreakpointUnsupported = new n("debug-breakpoint-unsupported", { fontCharacter: "\\eb8c" });
n.symbolString = new n("symbol-string", { fontCharacter: "\\eb8d" });
n.debugReverseContinue = new n("debug-reverse-continue", { fontCharacter: "\\eb8e" });
n.debugStepBack = new n("debug-step-back", { fontCharacter: "\\eb8f" });
n.debugRestartFrame = new n("debug-restart-frame", { fontCharacter: "\\eb90" });
n.callIncoming = new n("call-incoming", { fontCharacter: "\\eb92" });
n.callOutgoing = new n("call-outgoing", { fontCharacter: "\\eb93" });
n.menu = new n("menu", { fontCharacter: "\\eb94" });
n.expandAll = new n("expand-all", { fontCharacter: "\\eb95" });
n.feedback = new n("feedback", { fontCharacter: "\\eb96" });
n.groupByRefType = new n("group-by-ref-type", { fontCharacter: "\\eb97" });
n.ungroupByRefType = new n("ungroup-by-ref-type", { fontCharacter: "\\eb98" });
n.account = new n("account", { fontCharacter: "\\eb99" });
n.bellDot = new n("bell-dot", { fontCharacter: "\\eb9a" });
n.debugConsole = new n("debug-console", { fontCharacter: "\\eb9b" });
n.library = new n("library", { fontCharacter: "\\eb9c" });
n.output = new n("output", { fontCharacter: "\\eb9d" });
n.runAll = new n("run-all", { fontCharacter: "\\eb9e" });
n.syncIgnored = new n("sync-ignored", { fontCharacter: "\\eb9f" });
n.pinned = new n("pinned", { fontCharacter: "\\eba0" });
n.githubInverted = new n("github-inverted", { fontCharacter: "\\eba1" });
n.debugAlt = new n("debug-alt", { fontCharacter: "\\eb91" });
n.serverProcess = new n("server-process", { fontCharacter: "\\eba2" });
n.serverEnvironment = new n("server-environment", { fontCharacter: "\\eba3" });
n.pass = new n("pass", { fontCharacter: "\\eba4" });
n.stopCircle = new n("stop-circle", { fontCharacter: "\\eba5" });
n.playCircle = new n("play-circle", { fontCharacter: "\\eba6" });
n.record = new n("record", { fontCharacter: "\\eba7" });
n.debugAltSmall = new n("debug-alt-small", { fontCharacter: "\\eba8" });
n.vmConnect = new n("vm-connect", { fontCharacter: "\\eba9" });
n.cloud = new n("cloud", { fontCharacter: "\\ebaa" });
n.merge = new n("merge", { fontCharacter: "\\ebab" });
n.exportIcon = new n("export", { fontCharacter: "\\ebac" });
n.graphLeft = new n("graph-left", { fontCharacter: "\\ebad" });
n.magnet = new n("magnet", { fontCharacter: "\\ebae" });
n.notebook = new n("notebook", { fontCharacter: "\\ebaf" });
n.redo = new n("redo", { fontCharacter: "\\ebb0" });
n.checkAll = new n("check-all", { fontCharacter: "\\ebb1" });
n.pinnedDirty = new n("pinned-dirty", { fontCharacter: "\\ebb2" });
n.passFilled = new n("pass-filled", { fontCharacter: "\\ebb3" });
n.circleLargeFilled = new n("circle-large-filled", { fontCharacter: "\\ebb4" });
n.circleLargeOutline = new n("circle-large-outline", { fontCharacter: "\\ebb5" });
n.combine = new n("combine", { fontCharacter: "\\ebb6" });
n.gather = new n("gather", { fontCharacter: "\\ebb6" });
n.table = new n("table", { fontCharacter: "\\ebb7" });
n.variableGroup = new n("variable-group", { fontCharacter: "\\ebb8" });
n.typeHierarchy = new n("type-hierarchy", { fontCharacter: "\\ebb9" });
n.typeHierarchySub = new n("type-hierarchy-sub", { fontCharacter: "\\ebba" });
n.typeHierarchySuper = new n("type-hierarchy-super", { fontCharacter: "\\ebbb" });
n.gitPullRequestCreate = new n("git-pull-request-create", { fontCharacter: "\\ebbc" });
n.runAbove = new n("run-above", { fontCharacter: "\\ebbd" });
n.runBelow = new n("run-below", { fontCharacter: "\\ebbe" });
n.notebookTemplate = new n("notebook-template", { fontCharacter: "\\ebbf" });
n.debugRerun = new n("debug-rerun", { fontCharacter: "\\ebc0" });
n.workspaceTrusted = new n("workspace-trusted", { fontCharacter: "\\ebc1" });
n.workspaceUntrusted = new n("workspace-untrusted", { fontCharacter: "\\ebc2" });
n.workspaceUnspecified = new n("workspace-unspecified", { fontCharacter: "\\ebc3" });
n.terminalCmd = new n("terminal-cmd", { fontCharacter: "\\ebc4" });
n.terminalDebian = new n("terminal-debian", { fontCharacter: "\\ebc5" });
n.terminalLinux = new n("terminal-linux", { fontCharacter: "\\ebc6" });
n.terminalPowershell = new n("terminal-powershell", { fontCharacter: "\\ebc7" });
n.terminalTmux = new n("terminal-tmux", { fontCharacter: "\\ebc8" });
n.terminalUbuntu = new n("terminal-ubuntu", { fontCharacter: "\\ebc9" });
n.terminalBash = new n("terminal-bash", { fontCharacter: "\\ebca" });
n.arrowSwap = new n("arrow-swap", { fontCharacter: "\\ebcb" });
n.copy = new n("copy", { fontCharacter: "\\ebcc" });
n.personAdd = new n("person-add", { fontCharacter: "\\ebcd" });
n.filterFilled = new n("filter-filled", { fontCharacter: "\\ebce" });
n.wand = new n("wand", { fontCharacter: "\\ebcf" });
n.debugLineByLine = new n("debug-line-by-line", { fontCharacter: "\\ebd0" });
n.inspect = new n("inspect", { fontCharacter: "\\ebd1" });
n.layers = new n("layers", { fontCharacter: "\\ebd2" });
n.layersDot = new n("layers-dot", { fontCharacter: "\\ebd3" });
n.layersActive = new n("layers-active", { fontCharacter: "\\ebd4" });
n.compass = new n("compass", { fontCharacter: "\\ebd5" });
n.compassDot = new n("compass-dot", { fontCharacter: "\\ebd6" });
n.compassActive = new n("compass-active", { fontCharacter: "\\ebd7" });
n.azure = new n("azure", { fontCharacter: "\\ebd8" });
n.issueDraft = new n("issue-draft", { fontCharacter: "\\ebd9" });
n.gitPullRequestClosed = new n("git-pull-request-closed", { fontCharacter: "\\ebda" });
n.gitPullRequestDraft = new n("git-pull-request-draft", { fontCharacter: "\\ebdb" });
n.debugAll = new n("debug-all", { fontCharacter: "\\ebdc" });
n.debugCoverage = new n("debug-coverage", { fontCharacter: "\\ebdd" });
n.runErrors = new n("run-errors", { fontCharacter: "\\ebde" });
n.folderLibrary = new n("folder-library", { fontCharacter: "\\ebdf" });
n.debugContinueSmall = new n("debug-continue-small", { fontCharacter: "\\ebe0" });
n.beakerStop = new n("beaker-stop", { fontCharacter: "\\ebe1" });
n.graphLine = new n("graph-line", { fontCharacter: "\\ebe2" });
n.graphScatter = new n("graph-scatter", { fontCharacter: "\\ebe3" });
n.pieChart = new n("pie-chart", { fontCharacter: "\\ebe4" });
n.bracket = new n("bracket", n.json.definition);
n.bracketDot = new n("bracket-dot", { fontCharacter: "\\ebe5" });
n.bracketError = new n("bracket-error", { fontCharacter: "\\ebe6" });
n.lockSmall = new n("lock-small", { fontCharacter: "\\ebe7" });
n.azureDevops = new n("azure-devops", { fontCharacter: "\\ebe8" });
n.verifiedFilled = new n("verified-filled", { fontCharacter: "\\ebe9" });
n.newLine = new n("newline", { fontCharacter: "\\ebea" });
n.layout = new n("layout", { fontCharacter: "\\ebeb" });
n.layoutActivitybarLeft = new n("layout-activitybar-left", { fontCharacter: "\\ebec" });
n.layoutActivitybarRight = new n("layout-activitybar-right", { fontCharacter: "\\ebed" });
n.layoutPanelLeft = new n("layout-panel-left", { fontCharacter: "\\ebee" });
n.layoutPanelCenter = new n("layout-panel-center", { fontCharacter: "\\ebef" });
n.layoutPanelJustify = new n("layout-panel-justify", { fontCharacter: "\\ebf0" });
n.layoutPanelRight = new n("layout-panel-right", { fontCharacter: "\\ebf1" });
n.layoutPanel = new n("layout-panel", { fontCharacter: "\\ebf2" });
n.layoutSidebarLeft = new n("layout-sidebar-left", { fontCharacter: "\\ebf3" });
n.layoutSidebarRight = new n("layout-sidebar-right", { fontCharacter: "\\ebf4" });
n.layoutStatusbar = new n("layout-statusbar", { fontCharacter: "\\ebf5" });
n.layoutMenubar = new n("layout-menubar", { fontCharacter: "\\ebf6" });
n.layoutCentered = new n("layout-centered", { fontCharacter: "\\ebf7" });
n.layoutSidebarRightOff = new n("layout-sidebar-right-off", { fontCharacter: "\\ec00" });
n.layoutPanelOff = new n("layout-panel-off", { fontCharacter: "\\ec01" });
n.layoutSidebarLeftOff = new n("layout-sidebar-left-off", { fontCharacter: "\\ec02" });
n.target = new n("target", { fontCharacter: "\\ebf8" });
n.indent = new n("indent", { fontCharacter: "\\ebf9" });
n.recordSmall = new n("record-small", { fontCharacter: "\\ebfa" });
n.errorSmall = new n("error-small", { fontCharacter: "\\ebfb" });
n.arrowCircleDown = new n("arrow-circle-down", { fontCharacter: "\\ebfc" });
n.arrowCircleLeft = new n("arrow-circle-left", { fontCharacter: "\\ebfd" });
n.arrowCircleRight = new n("arrow-circle-right", { fontCharacter: "\\ebfe" });
n.arrowCircleUp = new n("arrow-circle-up", { fontCharacter: "\\ebff" });
n.heartFilled = new n("heart-filled", { fontCharacter: "\\ec04" });
n.map = new n("map", { fontCharacter: "\\ec05" });
n.mapFilled = new n("map-filled", { fontCharacter: "\\ec06" });
n.circleSmall = new n("circle-small", { fontCharacter: "\\ec07" });
n.bellSlash = new n("bell-slash", { fontCharacter: "\\ec08" });
n.bellSlashDot = new n("bell-slash-dot", { fontCharacter: "\\ec09" });
n.commentUnresolved = new n("comment-unresolved", { fontCharacter: "\\ec0a" });
n.gitPullRequestGoToChanges = new n("git-pull-request-go-to-changes", { fontCharacter: "\\ec0b" });
n.gitPullRequestNewChanges = new n("git-pull-request-new-changes", { fontCharacter: "\\ec0c" });
n.dialogError = new n("dialog-error", n.error.definition);
n.dialogWarning = new n("dialog-warning", n.warning.definition);
n.dialogInfo = new n("dialog-info", n.info.definition);
n.dialogClose = new n("dialog-close", n.close.definition);
n.treeItemExpanded = new n("tree-item-expanded", n.chevronDown.definition);
n.treeFilterOnTypeOn = new n("tree-filter-on-type-on", n.listFilter.definition);
n.treeFilterOnTypeOff = new n("tree-filter-on-type-off", n.listSelection.definition);
n.treeFilterClear = new n("tree-filter-clear", n.close.definition);
n.treeItemLoading = new n("tree-item-loading", n.loading.definition);
n.menuSelection = new n("menu-selection", n.check.definition);
n.menuSubmenu = new n("menu-submenu", n.chevronRight.definition);
n.menuBarMore = new n("menubar-more", n.more.definition);
n.scrollbarButtonLeft = new n("scrollbar-button-left", n.triangleLeft.definition);
n.scrollbarButtonRight = new n("scrollbar-button-right", n.triangleRight.definition);
n.scrollbarButtonUp = new n("scrollbar-button-up", n.triangleUp.definition);
n.scrollbarButtonDown = new n("scrollbar-button-down", n.triangleDown.definition);
n.toolBarMore = new n("toolbar-more", n.more.definition);
n.quickInputBack = new n("quick-input-back", n.arrowLeft.definition);
var Nt;
(function(e) {
  e.iconNameSegment = "[A-Za-z0-9]+", e.iconNameExpression = "[A-Za-z0-9-]+", e.iconModifierExpression = "~[A-Za-z]+", e.iconNameCharacter = "[A-Za-z0-9~-]";
  const t = new RegExp(`^(${e.iconNameExpression})(${e.iconModifierExpression})?$`);
  function r(a) {
    if (a instanceof n)
      return ["codicon", "codicon-" + a.id];
    const o = t.exec(a.id);
    if (!o)
      return r(n.error);
    const [, l, u] = o, c = ["codicon", "codicon-" + l];
    return u && c.push("codicon-modifier-" + u.substr(1)), c;
  }
  e.asClassNameArray = r;
  function s(a) {
    return r(a).join(" ");
  }
  e.asClassName = s;
  function i(a) {
    return "." + r(a).join(".");
  }
  e.asCSSSelector = i;
})(Nt || (Nt = {}));
var Je = globalThis && globalThis.__awaiter || function(e, t, r, s) {
  function i(a) {
    return a instanceof r ? a : new r(function(o) {
      o(a);
    });
  }
  return new (r || (r = Promise))(function(a, o) {
    function l(f) {
      try {
        c(s.next(f));
      } catch (h) {
        o(h);
      }
    }
    function u(f) {
      try {
        c(s.throw(f));
      } catch (h) {
        o(h);
      }
    }
    function c(f) {
      f.done ? a(f.value) : i(f.value).then(l, u);
    }
    c((s = s.apply(e, t || [])).next());
  });
};
class o1 {
  constructor() {
    this._map = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new O(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
  }
  fire(t) {
    this._onDidChange.fire({
      changedLanguages: t,
      changedColorMap: !1
    });
  }
  register(t, r) {
    return this._map.set(t, r), this.fire([t]), Ae(() => {
      this._map.get(t) === r && (this._map.delete(t), this.fire([t]));
    });
  }
  registerFactory(t, r) {
    var s;
    (s = this._factories.get(t)) === null || s === void 0 || s.dispose();
    const i = new l1(this, t, r);
    return this._factories.set(t, i), Ae(() => {
      const a = this._factories.get(t);
      !a || a !== i || (this._factories.delete(t), a.dispose());
    });
  }
  getOrCreate(t) {
    return Je(this, void 0, void 0, function* () {
      const r = this.get(t);
      if (r)
        return r;
      const s = this._factories.get(t);
      return !s || s.isResolved ? null : (yield s.resolve(), this.get(t));
    });
  }
  get(t) {
    return this._map.get(t) || null;
  }
  isResolved(t) {
    if (this.get(t))
      return !0;
    const s = this._factories.get(t);
    return !!(!s || s.isResolved);
  }
  setColorMap(t) {
    this._colorMap = t, this._onDidChange.fire({
      changedLanguages: Array.from(this._map.keys()),
      changedColorMap: !0
    });
  }
  getColorMap() {
    return this._colorMap;
  }
  getDefaultBackground() {
    return this._colorMap && this._colorMap.length > 2 ? this._colorMap[
      2
      /* ColorId.DefaultBackground */
    ] : null;
  }
}
class l1 extends st {
  constructor(t, r, s) {
    super(), this._registry = t, this._languageId = r, this._factory = s, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
  }
  get isResolved() {
    return this._isResolved;
  }
  dispose() {
    this._isDisposed = !0, super.dispose();
  }
  resolve() {
    return Je(this, void 0, void 0, function* () {
      return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
    });
  }
  _create() {
    return Je(this, void 0, void 0, function* () {
      const t = yield Promise.resolve(this._factory.createTokenizationSupport());
      this._isResolved = !0, t && !this._isDisposed && this._register(this._registry.register(this._languageId, t));
    });
  }
}
class c1 {
  constructor(t, r, s) {
    this._tokenBrand = void 0, this.offset = t, this.type = r, this.language = s;
  }
  toString() {
    return "(" + this.offset + ", " + this.type + ")";
  }
}
var vt;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, n.symbolMethod), t.set(1, n.symbolFunction), t.set(2, n.symbolConstructor), t.set(3, n.symbolField), t.set(4, n.symbolVariable), t.set(5, n.symbolClass), t.set(6, n.symbolStruct), t.set(7, n.symbolInterface), t.set(8, n.symbolModule), t.set(9, n.symbolProperty), t.set(10, n.symbolEvent), t.set(11, n.symbolOperator), t.set(12, n.symbolUnit), t.set(13, n.symbolValue), t.set(15, n.symbolEnum), t.set(14, n.symbolConstant), t.set(15, n.symbolEnum), t.set(16, n.symbolEnumMember), t.set(17, n.symbolKeyword), t.set(27, n.symbolSnippet), t.set(18, n.symbolText), t.set(19, n.symbolColor), t.set(20, n.symbolFile), t.set(21, n.symbolReference), t.set(22, n.symbolCustomColor), t.set(23, n.symbolFolder), t.set(24, n.symbolTypeParameter), t.set(25, n.account), t.set(26, n.issues);
  function r(a) {
    let o = t.get(a);
    return o || (console.info("No codicon found for CompletionItemKind " + a), o = n.symbolProperty), o;
  }
  e.toIcon = r;
  const s = /* @__PURE__ */ new Map();
  s.set(
    "method",
    0
    /* CompletionItemKind.Method */
  ), s.set(
    "function",
    1
    /* CompletionItemKind.Function */
  ), s.set(
    "constructor",
    2
    /* CompletionItemKind.Constructor */
  ), s.set(
    "field",
    3
    /* CompletionItemKind.Field */
  ), s.set(
    "variable",
    4
    /* CompletionItemKind.Variable */
  ), s.set(
    "class",
    5
    /* CompletionItemKind.Class */
  ), s.set(
    "struct",
    6
    /* CompletionItemKind.Struct */
  ), s.set(
    "interface",
    7
    /* CompletionItemKind.Interface */
  ), s.set(
    "module",
    8
    /* CompletionItemKind.Module */
  ), s.set(
    "property",
    9
    /* CompletionItemKind.Property */
  ), s.set(
    "event",
    10
    /* CompletionItemKind.Event */
  ), s.set(
    "operator",
    11
    /* CompletionItemKind.Operator */
  ), s.set(
    "unit",
    12
    /* CompletionItemKind.Unit */
  ), s.set(
    "value",
    13
    /* CompletionItemKind.Value */
  ), s.set(
    "constant",
    14
    /* CompletionItemKind.Constant */
  ), s.set(
    "enum",
    15
    /* CompletionItemKind.Enum */
  ), s.set(
    "enum-member",
    16
    /* CompletionItemKind.EnumMember */
  ), s.set(
    "enumMember",
    16
    /* CompletionItemKind.EnumMember */
  ), s.set(
    "keyword",
    17
    /* CompletionItemKind.Keyword */
  ), s.set(
    "snippet",
    27
    /* CompletionItemKind.Snippet */
  ), s.set(
    "text",
    18
    /* CompletionItemKind.Text */
  ), s.set(
    "color",
    19
    /* CompletionItemKind.Color */
  ), s.set(
    "file",
    20
    /* CompletionItemKind.File */
  ), s.set(
    "reference",
    21
    /* CompletionItemKind.Reference */
  ), s.set(
    "customcolor",
    22
    /* CompletionItemKind.Customcolor */
  ), s.set(
    "folder",
    23
    /* CompletionItemKind.Folder */
  ), s.set(
    "type-parameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), s.set(
    "typeParameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), s.set(
    "account",
    25
    /* CompletionItemKind.User */
  ), s.set(
    "issue",
    26
    /* CompletionItemKind.Issue */
  );
  function i(a, o) {
    let l = s.get(a);
    return typeof l > "u" && !o && (l = 9), l;
  }
  e.fromString = i;
})(vt || (vt = {}));
var St;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(St || (St = {}));
var At;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(At || (At = {}));
var yt;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(yt || (yt = {}));
var kt;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, n.symbolFile), t.set(1, n.symbolModule), t.set(2, n.symbolNamespace), t.set(3, n.symbolPackage), t.set(4, n.symbolClass), t.set(5, n.symbolMethod), t.set(6, n.symbolProperty), t.set(7, n.symbolField), t.set(8, n.symbolConstructor), t.set(9, n.symbolEnum), t.set(10, n.symbolInterface), t.set(11, n.symbolFunction), t.set(12, n.symbolVariable), t.set(13, n.symbolConstant), t.set(14, n.symbolString), t.set(15, n.symbolNumber), t.set(16, n.symbolBoolean), t.set(17, n.symbolArray), t.set(18, n.symbolObject), t.set(19, n.symbolKey), t.set(20, n.symbolNull), t.set(21, n.symbolEnumMember), t.set(22, n.symbolStruct), t.set(23, n.symbolEvent), t.set(24, n.symbolOperator), t.set(25, n.symbolTypeParameter);
  function r(s) {
    let i = t.get(s);
    return i || (console.info("No codicon found for SymbolKind " + s), i = n.symbolProperty), i;
  }
  e.toIcon = r;
})(kt || (kt = {}));
var Mt;
(function(e) {
  function t(r) {
    return !r || typeof r != "object" ? !1 : typeof r.id == "string" && typeof r.title == "string";
  }
  e.is = t;
})(Mt || (Mt = {}));
var Rt;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Rt || (Rt = {}));
new o1();
var Pt;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
})(Pt || (Pt = {}));
var Dt;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
})(Dt || (Dt = {}));
var Ft;
(function(e) {
  e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
})(Ft || (Ft = {}));
var xt;
(function(e) {
  e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Snippet = 27] = "Snippet";
})(xt || (xt = {}));
var Et;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(Et || (Et = {}));
var Vt;
(function(e) {
  e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
})(Vt || (Vt = {}));
var Tt;
(function(e) {
  e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
})(Tt || (Tt = {}));
var Bt;
(function(e) {
  e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
})(Bt || (Bt = {}));
var Ut;
(function(e) {
  e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(Ut || (Ut = {}));
var It;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(It || (It = {}));
var qt;
(function(e) {
  e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
})(qt || (qt = {}));
var Ht;
(function(e) {
  e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.ariaLabel = 4] = "ariaLabel", e[e.autoClosingBrackets = 5] = "autoClosingBrackets", e[e.autoClosingDelete = 6] = "autoClosingDelete", e[e.autoClosingOvertype = 7] = "autoClosingOvertype", e[e.autoClosingQuotes = 8] = "autoClosingQuotes", e[e.autoIndent = 9] = "autoIndent", e[e.automaticLayout = 10] = "automaticLayout", e[e.autoSurround = 11] = "autoSurround", e[e.bracketPairColorization = 12] = "bracketPairColorization", e[e.guides = 13] = "guides", e[e.codeLens = 14] = "codeLens", e[e.codeLensFontFamily = 15] = "codeLensFontFamily", e[e.codeLensFontSize = 16] = "codeLensFontSize", e[e.colorDecorators = 17] = "colorDecorators", e[e.columnSelection = 18] = "columnSelection", e[e.comments = 19] = "comments", e[e.contextmenu = 20] = "contextmenu", e[e.copyWithSyntaxHighlighting = 21] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 22] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 23] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 24] = "cursorStyle", e[e.cursorSurroundingLines = 25] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 26] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 27] = "cursorWidth", e[e.disableLayerHinting = 28] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 29] = "disableMonospaceOptimizations", e[e.domReadOnly = 30] = "domReadOnly", e[e.dragAndDrop = 31] = "dragAndDrop", e[e.dropIntoEditor = 32] = "dropIntoEditor", e[e.emptySelectionClipboard = 33] = "emptySelectionClipboard", e[e.experimental = 34] = "experimental", e[e.extraEditorClassName = 35] = "extraEditorClassName", e[e.fastScrollSensitivity = 36] = "fastScrollSensitivity", e[e.find = 37] = "find", e[e.fixedOverflowWidgets = 38] = "fixedOverflowWidgets", e[e.folding = 39] = "folding", e[e.foldingStrategy = 40] = "foldingStrategy", e[e.foldingHighlight = 41] = "foldingHighlight", e[e.foldingImportsByDefault = 42] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 43] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 44] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 45] = "fontFamily", e[e.fontInfo = 46] = "fontInfo", e[e.fontLigatures = 47] = "fontLigatures", e[e.fontSize = 48] = "fontSize", e[e.fontWeight = 49] = "fontWeight", e[e.formatOnPaste = 50] = "formatOnPaste", e[e.formatOnType = 51] = "formatOnType", e[e.glyphMargin = 52] = "glyphMargin", e[e.gotoLocation = 53] = "gotoLocation", e[e.hideCursorInOverviewRuler = 54] = "hideCursorInOverviewRuler", e[e.hover = 55] = "hover", e[e.inDiffEditor = 56] = "inDiffEditor", e[e.inlineSuggest = 57] = "inlineSuggest", e[e.letterSpacing = 58] = "letterSpacing", e[e.lightbulb = 59] = "lightbulb", e[e.lineDecorationsWidth = 60] = "lineDecorationsWidth", e[e.lineHeight = 61] = "lineHeight", e[e.lineNumbers = 62] = "lineNumbers", e[e.lineNumbersMinChars = 63] = "lineNumbersMinChars", e[e.linkedEditing = 64] = "linkedEditing", e[e.links = 65] = "links", e[e.matchBrackets = 66] = "matchBrackets", e[e.minimap = 67] = "minimap", e[e.mouseStyle = 68] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 69] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 70] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 71] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 72] = "multiCursorModifier", e[e.multiCursorPaste = 73] = "multiCursorPaste", e[e.occurrencesHighlight = 74] = "occurrencesHighlight", e[e.overviewRulerBorder = 75] = "overviewRulerBorder", e[e.overviewRulerLanes = 76] = "overviewRulerLanes", e[e.padding = 77] = "padding", e[e.parameterHints = 78] = "parameterHints", e[e.peekWidgetDefaultFocus = 79] = "peekWidgetDefaultFocus", e[e.definitionLinkOpensInPeek = 80] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 81] = "quickSuggestions", e[e.quickSuggestionsDelay = 82] = "quickSuggestionsDelay", e[e.readOnly = 83] = "readOnly", e[e.renameOnType = 84] = "renameOnType", e[e.renderControlCharacters = 85] = "renderControlCharacters", e[e.renderFinalNewline = 86] = "renderFinalNewline", e[e.renderLineHighlight = 87] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 88] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 89] = "renderValidationDecorations", e[e.renderWhitespace = 90] = "renderWhitespace", e[e.revealHorizontalRightPadding = 91] = "revealHorizontalRightPadding", e[e.roundedSelection = 92] = "roundedSelection", e[e.rulers = 93] = "rulers", e[e.scrollbar = 94] = "scrollbar", e[e.scrollBeyondLastColumn = 95] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 96] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 97] = "scrollPredominantAxis", e[e.selectionClipboard = 98] = "selectionClipboard", e[e.selectionHighlight = 99] = "selectionHighlight", e[e.selectOnLineNumbers = 100] = "selectOnLineNumbers", e[e.showFoldingControls = 101] = "showFoldingControls", e[e.showUnused = 102] = "showUnused", e[e.snippetSuggestions = 103] = "snippetSuggestions", e[e.smartSelect = 104] = "smartSelect", e[e.smoothScrolling = 105] = "smoothScrolling", e[e.stickyTabStops = 106] = "stickyTabStops", e[e.stopRenderingLineAfter = 107] = "stopRenderingLineAfter", e[e.suggest = 108] = "suggest", e[e.suggestFontSize = 109] = "suggestFontSize", e[e.suggestLineHeight = 110] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 111] = "suggestOnTriggerCharacters", e[e.suggestSelection = 112] = "suggestSelection", e[e.tabCompletion = 113] = "tabCompletion", e[e.tabIndex = 114] = "tabIndex", e[e.unicodeHighlighting = 115] = "unicodeHighlighting", e[e.unusualLineTerminators = 116] = "unusualLineTerminators", e[e.useShadowDOM = 117] = "useShadowDOM", e[e.useTabStops = 118] = "useTabStops", e[e.wordSeparators = 119] = "wordSeparators", e[e.wordWrap = 120] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 121] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 122] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 123] = "wordWrapColumn", e[e.wordWrapOverride1 = 124] = "wordWrapOverride1", e[e.wordWrapOverride2 = 125] = "wordWrapOverride2", e[e.wrappingIndent = 126] = "wrappingIndent", e[e.wrappingStrategy = 127] = "wrappingStrategy", e[e.showDeprecated = 128] = "showDeprecated", e[e.inlayHints = 129] = "inlayHints", e[e.editorClassName = 130] = "editorClassName", e[e.pixelRatio = 131] = "pixelRatio", e[e.tabFocusMode = 132] = "tabFocusMode", e[e.layoutInfo = 133] = "layoutInfo", e[e.wrappingInfo = 134] = "wrappingInfo";
})(Ht || (Ht = {}));
var Wt;
(function(e) {
  e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(Wt || (Wt = {}));
var $t;
(function(e) {
  e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
})($t || ($t = {}));
var zt;
(function(e) {
  e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
})(zt || (zt = {}));
var Gt;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(Gt || (Gt = {}));
var Ot;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Ot || (Ot = {}));
var jt;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(jt || (jt = {}));
var Ke;
(function(e) {
  e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.NumLock = 78] = "NumLock", e[e.ScrollLock = 79] = "ScrollLock", e[e.Semicolon = 80] = "Semicolon", e[e.Equal = 81] = "Equal", e[e.Comma = 82] = "Comma", e[e.Minus = 83] = "Minus", e[e.Period = 84] = "Period", e[e.Slash = 85] = "Slash", e[e.Backquote = 86] = "Backquote", e[e.BracketLeft = 87] = "BracketLeft", e[e.Backslash = 88] = "Backslash", e[e.BracketRight = 89] = "BracketRight", e[e.Quote = 90] = "Quote", e[e.OEM_8 = 91] = "OEM_8", e[e.IntlBackslash = 92] = "IntlBackslash", e[e.Numpad0 = 93] = "Numpad0", e[e.Numpad1 = 94] = "Numpad1", e[e.Numpad2 = 95] = "Numpad2", e[e.Numpad3 = 96] = "Numpad3", e[e.Numpad4 = 97] = "Numpad4", e[e.Numpad5 = 98] = "Numpad5", e[e.Numpad6 = 99] = "Numpad6", e[e.Numpad7 = 100] = "Numpad7", e[e.Numpad8 = 101] = "Numpad8", e[e.Numpad9 = 102] = "Numpad9", e[e.NumpadMultiply = 103] = "NumpadMultiply", e[e.NumpadAdd = 104] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 105] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 106] = "NumpadSubtract", e[e.NumpadDecimal = 107] = "NumpadDecimal", e[e.NumpadDivide = 108] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 109] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 110] = "ABNT_C1", e[e.ABNT_C2 = 111] = "ABNT_C2", e[e.AudioVolumeMute = 112] = "AudioVolumeMute", e[e.AudioVolumeUp = 113] = "AudioVolumeUp", e[e.AudioVolumeDown = 114] = "AudioVolumeDown", e[e.BrowserSearch = 115] = "BrowserSearch", e[e.BrowserHome = 116] = "BrowserHome", e[e.BrowserBack = 117] = "BrowserBack", e[e.BrowserForward = 118] = "BrowserForward", e[e.MediaTrackNext = 119] = "MediaTrackNext", e[e.MediaTrackPrevious = 120] = "MediaTrackPrevious", e[e.MediaStop = 121] = "MediaStop", e[e.MediaPlayPause = 122] = "MediaPlayPause", e[e.LaunchMediaPlayer = 123] = "LaunchMediaPlayer", e[e.LaunchMail = 124] = "LaunchMail", e[e.LaunchApp2 = 125] = "LaunchApp2", e[e.Clear = 126] = "Clear", e[e.MAX_VALUE = 127] = "MAX_VALUE";
})(Ke || (Ke = {}));
var et;
(function(e) {
  e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
})(et || (et = {}));
var tt;
(function(e) {
  e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
})(tt || (tt = {}));
var Qt;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(Qt || (Qt = {}));
var Zt;
(function(e) {
  e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
})(Zt || (Zt = {}));
var Yt;
(function(e) {
  e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
})(Yt || (Yt = {}));
var Xt;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(Xt || (Xt = {}));
var Jt;
(function(e) {
  e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
})(Jt || (Jt = {}));
var Kt;
(function(e) {
  e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
})(Kt || (Kt = {}));
var en;
(function(e) {
  e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
})(en || (en = {}));
var tn;
(function(e) {
  e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
})(tn || (tn = {}));
var nn;
(function(e) {
  e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
})(nn || (nn = {}));
var nt;
(function(e) {
  e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(nt || (nt = {}));
var rn;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(rn || (rn = {}));
var sn;
(function(e) {
  e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
})(sn || (sn = {}));
var an;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(an || (an = {}));
var on;
(function(e) {
  e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
})(on || (on = {}));
var ln;
(function(e) {
  e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
})(ln || (ln = {}));
var cn;
(function(e) {
  e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
})(cn || (cn = {}));
var un;
(function(e) {
  e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
})(un || (un = {}));
class we {
  static chord(t, r) {
    return a1(t, r);
  }
}
we.CtrlCmd = 2048;
we.Shift = 1024;
we.Alt = 512;
we.WinCtrl = 256;
function u1() {
  return {
    editor: void 0,
    languages: void 0,
    CancellationTokenSource: n1,
    Emitter: O,
    KeyCode: Ke,
    KeyMod: we,
    Position: H,
    Range: x,
    Selection: $,
    SelectionDirection: nt,
    MarkerSeverity: et,
    MarkerTag: tt,
    Uri: ne,
    Token: c1
  };
}
var hn;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(hn || (hn = {}));
var fn;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(fn || (fn = {}));
var dn;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(dn || (dn = {}));
function h1(e, t, r, s, i) {
  if (s === 0)
    return !0;
  const a = t.charCodeAt(s - 1);
  if (e.get(a) !== 0 || a === 13 || a === 10)
    return !0;
  if (i > 0) {
    const o = t.charCodeAt(s);
    if (e.get(o) !== 0)
      return !0;
  }
  return !1;
}
function f1(e, t, r, s, i) {
  if (s + i === r)
    return !0;
  const a = t.charCodeAt(s + i);
  if (e.get(a) !== 0 || a === 13 || a === 10)
    return !0;
  if (i > 0) {
    const o = t.charCodeAt(s + i - 1);
    if (e.get(o) !== 0)
      return !0;
  }
  return !1;
}
function d1(e, t, r, s, i) {
  return h1(e, t, r, s, i) && f1(e, t, r, s, i);
}
class m1 {
  constructor(t, r) {
    this._wordSeparators = t, this._searchRegex = r, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  reset(t) {
    this._searchRegex.lastIndex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  next(t) {
    const r = t.length;
    let s;
    do {
      if (this._prevMatchStartIndex + this._prevMatchLength === r || (s = this._searchRegex.exec(t), !s))
        return null;
      const i = s.index, a = s[0].length;
      if (i === this._prevMatchStartIndex && a === this._prevMatchLength) {
        if (a === 0) {
          mr(t, r, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
          continue;
        }
        return null;
      }
      if (this._prevMatchStartIndex = i, this._prevMatchLength = a, !this._wordSeparators || d1(this._wordSeparators, t, r, i, a))
        return s;
    } while (s);
    return null;
  }
}
class g1 {
  static computeUnicodeHighlights(t, r, s) {
    const i = s ? s.startLineNumber : 1, a = s ? s.endLineNumber : t.getLineCount(), o = new mn(r), l = o.getCandidateCodePoints();
    let u;
    l === "allNonBasicAscii" ? u = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : u = new RegExp(`${b1(Array.from(l))}`, "g");
    const c = new m1(null, u), f = [];
    let h = !1, d, C = 0, v = 0, A = 0;
    e:
      for (let k = i, R = a; k <= R; k++) {
        const P = t.getLineContent(k), y = P.length;
        c.reset(0);
        do
          if (d = c.next(P), d) {
            let p = d.index, S = d.index + d[0].length;
            if (p > 0) {
              const w = P.charCodeAt(p - 1);
              We(w) && p--;
            }
            if (S + 1 < y) {
              const w = P.charCodeAt(S - 1);
              We(w) && S++;
            }
            const b = P.substring(p, S), g = at(p + 1, Rn, P, 0), m = o.shouldHighlightNonBasicASCII(b, g ? g.word : null);
            if (m !== 0) {
              m === 3 ? C++ : m === 2 ? v++ : m === 1 ? A++ : ar();
              const w = 1e3;
              if (f.length >= w) {
                h = !0;
                break e;
              }
              f.push(new x(k, p + 1, k, S + 1));
            }
          }
        while (d);
      }
    return {
      ranges: f,
      hasMore: h,
      ambiguousCharacterCount: C,
      invisibleCharacterCount: v,
      nonBasicAsciiCharacterCount: A
    };
  }
  static computeUnicodeHighlightReason(t, r) {
    const s = new mn(r);
    switch (s.shouldHighlightNonBasicASCII(t, null)) {
      case 0:
        return null;
      case 2:
        return {
          kind: 1
          /* UnicodeHighlighterReasonKind.Invisible */
        };
      case 3: {
        const a = t.codePointAt(0), o = s.ambiguousCharacters.getPrimaryConfusable(a), l = z.getLocales().filter((u) => !z.getInstance(/* @__PURE__ */ new Set([...r.allowedLocales, u])).isAmbiguous(a));
        return { kind: 0, confusableWith: String.fromCodePoint(o), notAmbiguousInLocales: l };
      }
      case 1:
        return {
          kind: 2
          /* UnicodeHighlighterReasonKind.NonBasicAscii */
        };
    }
  }
}
function b1(e, t) {
  return `[${lr(e.map((s) => String.fromCodePoint(s)).join(""))}]`;
}
class mn {
  constructor(t) {
    this.options = t, this.allowedCodePoints = new Set(t.allowedCodePoints), this.ambiguousCharacters = z.getInstance(new Set(t.allowedLocales));
  }
  getCandidateCodePoints() {
    if (this.options.nonBasicASCII)
      return "allNonBasicAscii";
    const t = /* @__PURE__ */ new Set();
    if (this.options.invisibleCharacters)
      for (const r of K.codePoints)
        gn(String.fromCodePoint(r)) || t.add(r);
    if (this.options.ambiguousCharacters)
      for (const r of this.ambiguousCharacters.getConfusableCodePoints())
        t.add(r);
    for (const r of this.allowedCodePoints)
      t.delete(r);
    return t;
  }
  shouldHighlightNonBasicASCII(t, r) {
    const s = t.codePointAt(0);
    if (this.allowedCodePoints.has(s))
      return 0;
    if (this.options.nonBasicASCII)
      return 1;
    let i = !1, a = !1;
    if (r)
      for (const o of r) {
        const l = o.codePointAt(0), u = br(o);
        i = i || u, !u && !this.ambiguousCharacters.isAmbiguous(l) && !K.isInvisibleCharacter(l) && (a = !0);
      }
    return (
      /* Don't allow mixing weird looking characters with ASCII */
      !i && /* Is there an obviously weird looking character? */
      a ? 0 : this.options.invisibleCharacters && !gn(t) && K.isInvisibleCharacter(s) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(s) ? 3 : 0
    );
  }
}
function gn(e) {
  return e === " " || e === `
` || e === "	";
}
var te = globalThis && globalThis.__awaiter || function(e, t, r, s) {
  function i(a) {
    return a instanceof r ? a : new r(function(o) {
      o(a);
    });
  }
  return new (r || (r = Promise))(function(a, o) {
    function l(f) {
      try {
        c(s.next(f));
      } catch (h) {
        o(h);
      }
    }
    function u(f) {
      try {
        c(s.throw(f));
      } catch (h) {
        o(h);
      }
    }
    function c(f) {
      f.done ? a(f.value) : i(f.value).then(l, u);
    }
    c((s = s.apply(e, t || [])).next());
  });
};
class w1 extends Or {
  get uri() {
    return this._uri;
  }
  get eol() {
    return this._eol;
  }
  getValue() {
    return this.getText();
  }
  getLinesContent() {
    return this._lines.slice(0);
  }
  getLineCount() {
    return this._lines.length;
  }
  getLineContent(t) {
    return this._lines[t - 1];
  }
  getWordAtPosition(t, r) {
    const s = at(t.column, Zr(r), this._lines[t.lineNumber - 1], 0);
    return s ? new x(t.lineNumber, s.startColumn, t.lineNumber, s.endColumn) : null;
  }
  words(t) {
    const r = this._lines, s = this._wordenize.bind(this);
    let i = 0, a = "", o = 0, l = [];
    return {
      *[Symbol.iterator]() {
        for (; ; )
          if (o < l.length) {
            const u = a.substring(l[o].start, l[o].end);
            o += 1, yield u;
          } else if (i < r.length)
            a = r[i], l = s(a, t), o = 0, i += 1;
          else
            break;
      }
    };
  }
  getLineWords(t, r) {
    const s = this._lines[t - 1], i = this._wordenize(s, r), a = [];
    for (const o of i)
      a.push({
        word: s.substring(o.start, o.end),
        startColumn: o.start + 1,
        endColumn: o.end + 1
      });
    return a;
  }
  _wordenize(t, r) {
    const s = [];
    let i;
    for (r.lastIndex = 0; (i = r.exec(t)) && i[0].length !== 0; )
      s.push({ start: i.index, end: i.index + i[0].length });
    return s;
  }
  getValueInRange(t) {
    if (t = this._validateRange(t), t.startLineNumber === t.endLineNumber)
      return this._lines[t.startLineNumber - 1].substring(t.startColumn - 1, t.endColumn - 1);
    const r = this._eol, s = t.startLineNumber - 1, i = t.endLineNumber - 1, a = [];
    a.push(this._lines[s].substring(t.startColumn - 1));
    for (let o = s + 1; o < i; o++)
      a.push(this._lines[o]);
    return a.push(this._lines[i].substring(0, t.endColumn - 1)), a.join(r);
  }
  offsetAt(t) {
    return t = this._validatePosition(t), this._ensureLineStarts(), this._lineStarts.getPrefixSum(t.lineNumber - 2) + (t.column - 1);
  }
  positionAt(t) {
    t = Math.floor(t), t = Math.max(0, t), this._ensureLineStarts();
    const r = this._lineStarts.getIndexOf(t), s = this._lines[r.index].length;
    return {
      lineNumber: 1 + r.index,
      column: 1 + Math.min(r.remainder, s)
    };
  }
  _validateRange(t) {
    const r = this._validatePosition({ lineNumber: t.startLineNumber, column: t.startColumn }), s = this._validatePosition({ lineNumber: t.endLineNumber, column: t.endColumn });
    return r.lineNumber !== t.startLineNumber || r.column !== t.startColumn || s.lineNumber !== t.endLineNumber || s.column !== t.endColumn ? {
      startLineNumber: r.lineNumber,
      startColumn: r.column,
      endLineNumber: s.lineNumber,
      endColumn: s.column
    } : t;
  }
  _validatePosition(t) {
    if (!H.isIPosition(t))
      throw new Error("bad position");
    let { lineNumber: r, column: s } = t, i = !1;
    if (r < 1)
      r = 1, s = 1, i = !0;
    else if (r > this._lines.length)
      r = this._lines.length, s = this._lines[r - 1].length + 1, i = !0;
    else {
      const a = this._lines[r - 1].length + 1;
      s < 1 ? (s = 1, i = !0) : s > a && (s = a, i = !0);
    }
    return i ? { lineNumber: r, column: s } : t;
  }
}
class re {
  constructor(t, r) {
    this._host = t, this._models = /* @__PURE__ */ Object.create(null), this._foreignModuleFactory = r, this._foreignModule = null;
  }
  dispose() {
    this._models = /* @__PURE__ */ Object.create(null);
  }
  _getModel(t) {
    return this._models[t];
  }
  _getModels() {
    const t = [];
    return Object.keys(this._models).forEach((r) => t.push(this._models[r])), t;
  }
  acceptNewModel(t) {
    this._models[t.url] = new w1(ne.parse(t.url), t.lines, t.EOL, t.versionId);
  }
  acceptModelChanged(t, r) {
    if (!this._models[t])
      return;
    this._models[t].onEvents(r);
  }
  acceptRemovedModel(t) {
    this._models[t] && delete this._models[t];
  }
  computeUnicodeHighlights(t, r, s) {
    return te(this, void 0, void 0, function* () {
      const i = this._getModel(t);
      return i ? g1.computeUnicodeHighlights(i, r, s) : { ranges: [], hasMore: !1, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
    });
  }
  // ---- BEGIN diff --------------------------------------------------------------------------
  computeDiff(t, r, s, i) {
    return te(this, void 0, void 0, function* () {
      const a = this._getModel(t), o = this._getModel(r);
      return !a || !o ? null : re.computeDiff(a, o, s, i);
    });
  }
  static computeDiff(t, r, s, i) {
    const a = t.getLinesContent(), o = r.getLinesContent(), u = new $r(a, o, {
      shouldComputeCharChanges: !0,
      shouldPostProcessCharChanges: !0,
      shouldIgnoreTrimWhitespace: s,
      shouldMakePrettyDiff: !0,
      maxComputationTime: i
    }).computeDiff(), c = u.changes.length > 0 ? !1 : this._modelsAreIdentical(t, r);
    return {
      quitEarly: u.quitEarly,
      identical: c,
      changes: u.changes
    };
  }
  static _modelsAreIdentical(t, r) {
    const s = t.getLineCount(), i = r.getLineCount();
    if (s !== i)
      return !1;
    for (let a = 1; a <= s; a++) {
      const o = t.getLineContent(a), l = r.getLineContent(a);
      if (o !== l)
        return !1;
    }
    return !0;
  }
  computeMoreMinimalEdits(t, r) {
    return te(this, void 0, void 0, function* () {
      const s = this._getModel(t);
      if (!s)
        return r;
      const i = [];
      let a;
      r = r.slice(0).sort((o, l) => {
        if (o.range && l.range)
          return x.compareRangesUsingStarts(o.range, l.range);
        const u = o.range ? 0 : 1, c = l.range ? 0 : 1;
        return u - c;
      });
      for (let { range: o, text: l, eol: u } of r) {
        if (typeof u == "number" && (a = u), x.isEmpty(o) && !l)
          continue;
        const c = s.getValueInRange(o);
        if (l = l.replace(/\r\n|\n|\r/g, s.eol), c === l)
          continue;
        if (Math.max(l.length, c.length) > re._diffLimit) {
          i.push({ range: o, text: l });
          continue;
        }
        const f = yr(c, l, !1), h = s.offsetAt(x.lift(o).getStartPosition());
        for (const d of f) {
          const C = s.positionAt(h + d.originalStart), v = s.positionAt(h + d.originalStart + d.originalLength), A = {
            text: l.substr(d.modifiedStart, d.modifiedLength),
            range: { startLineNumber: C.lineNumber, startColumn: C.column, endLineNumber: v.lineNumber, endColumn: v.column }
          };
          s.getValueInRange(A.range) !== A.text && i.push(A);
        }
      }
      return typeof a == "number" && i.push({ eol: a, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } }), i;
    });
  }
  // ---- END minimal edits ---------------------------------------------------------------
  computeLinks(t) {
    return te(this, void 0, void 0, function* () {
      const r = this._getModel(t);
      return r ? t1(r) : null;
    });
  }
  textualSuggest(t, r, s, i) {
    return te(this, void 0, void 0, function* () {
      const a = new Pe(!0), o = new RegExp(s, i), l = /* @__PURE__ */ new Set();
      e:
        for (const u of t) {
          const c = this._getModel(u);
          if (c) {
            for (const f of c.words(o))
              if (!(f === r || !isNaN(Number(f))) && (l.add(f), l.size > re._suggestionsLimit))
                break e;
          }
        }
      return { words: Array.from(l), duration: a.elapsed() };
    });
  }
  // ---- END suggest --------------------------------------------------------------------------
  //#region -- word ranges --
  computeWordRanges(t, r, s, i) {
    return te(this, void 0, void 0, function* () {
      const a = this._getModel(t);
      if (!a)
        return /* @__PURE__ */ Object.create(null);
      const o = new RegExp(s, i), l = /* @__PURE__ */ Object.create(null);
      for (let u = r.startLineNumber; u < r.endLineNumber; u++) {
        const c = a.getLineWords(u, o);
        for (const f of c) {
          if (!isNaN(Number(f.word)))
            continue;
          let h = l[f.word];
          h || (h = [], l[f.word] = h), h.push({
            startLineNumber: u,
            startColumn: f.startColumn,
            endLineNumber: u,
            endColumn: f.endColumn
          });
        }
      }
      return l;
    });
  }
  //#endregion
  navigateValueSet(t, r, s, i, a) {
    return te(this, void 0, void 0, function* () {
      const o = this._getModel(t);
      if (!o)
        return null;
      const l = new RegExp(i, a);
      r.startColumn === r.endColumn && (r = {
        startLineNumber: r.startLineNumber,
        startColumn: r.startColumn,
        endLineNumber: r.endLineNumber,
        endColumn: r.endColumn + 1
      });
      const u = o.getValueInRange(r), c = o.getWordAtPosition({ lineNumber: r.startLineNumber, column: r.startColumn }, l);
      if (!c)
        return null;
      const f = o.getValueInRange(c);
      return Ze.INSTANCE.navigateValueSet(r, u, c, f, s);
    });
  }
  // ---- BEGIN foreign module support --------------------------------------------------------------------------
  loadForeignModule(t, r, s) {
    const o = {
      host: ir(s, (l, u) => this._host.fhr(l, u)),
      getMirrorModels: () => this._getModels()
    };
    return this._foreignModuleFactory ? (this._foreignModule = this._foreignModuleFactory(o, r), Promise.resolve(He(this._foreignModule))) : Promise.reject(new Error("Unexpected usage"));
  }
  // foreign method request
  fmr(t, r) {
    if (!this._foreignModule || typeof this._foreignModule[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._foreignModule[t].apply(this._foreignModule, r));
    } catch (s) {
      return Promise.reject(s);
    }
  }
}
re._diffLimit = 1e5;
re._suggestionsLimit = 1e4;
typeof importScripts == "function" && (U.monaco = u1());
let rt = !1;
function C1(e) {
  if (rt)
    return;
  rt = !0;
  const t = new Sr((r) => {
    self.postMessage(r);
  }, (r) => new re(r, e));
  self.onmessage = (r) => {
    t.onmessage(r.data);
  };
}
self.onmessage = (e) => {
  rt || C1(null);
};
export {
  C1 as initialize
};
