var Sa = Object.defineProperty;
var Aa = (e, t, r) => t in e ? Sa(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ot = (e, t, r) => (Aa(e, typeof t != "symbol" ? t + "" : t, r), r);
class Na {
  constructor() {
    this.listeners = [], this.unexpectedErrorHandler = function(t) {
      setTimeout(() => {
        throw t.stack ? at.isErrorNoTelemetry(t) ? new at(t.message + `

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
const La = new Na();
function ka(e) {
  xa(e) || La.onUnexpectedError(e);
}
function an(e) {
  if (e instanceof Error) {
    const { name: t, message: r } = e, n = e.stacktrace || e.stack;
    return {
      $isError: !0,
      name: t,
      message: r,
      stack: n,
      noTelemetry: at.isErrorNoTelemetry(e)
    };
  }
  return e;
}
const hr = "Canceled";
function xa(e) {
  return e instanceof Ma ? !0 : e instanceof Error && e.name === hr && e.message === hr;
}
class Ma extends Error {
  constructor() {
    super(hr), this.name = this.message;
  }
}
class at extends Error {
  constructor(t) {
    super(t), this.name = "ErrorNoTelemetry";
  }
  static fromError(t) {
    if (t instanceof at)
      return t;
    const r = new at();
    return r.message = t.message, r.stack = t.stack, r;
  }
  static isErrorNoTelemetry(t) {
    return t.name === "ErrorNoTelemetry";
  }
}
function Pa(e) {
  const t = this;
  let r = !1, n;
  return function() {
    return r || (r = !0, n = e.apply(t, arguments)), n;
  };
}
var Rt;
(function(e) {
  function t(N) {
    return N && typeof N == "object" && typeof N[Symbol.iterator] == "function";
  }
  e.is = t;
  const r = Object.freeze([]);
  function n() {
    return r;
  }
  e.empty = n;
  function* i(N) {
    yield N;
  }
  e.single = i;
  function s(N) {
    return N || r;
  }
  e.from = s;
  function o(N) {
    return !N || N[Symbol.iterator]().next().done === !0;
  }
  e.isEmpty = o;
  function l(N) {
    return N[Symbol.iterator]().next().value;
  }
  e.first = l;
  function u(N, x) {
    for (const w of N)
      if (x(w))
        return !0;
    return !1;
  }
  e.some = u;
  function c(N, x) {
    for (const w of N)
      if (x(w))
        return w;
  }
  e.find = c;
  function* h(N, x) {
    for (const w of N)
      x(w) && (yield w);
  }
  e.filter = h;
  function* f(N, x) {
    let w = 0;
    for (const b of N)
      yield x(b, w++);
  }
  e.map = f;
  function* d(...N) {
    for (const x of N)
      for (const w of x)
        yield w;
  }
  e.concat = d;
  function* m(N) {
    for (const x of N)
      for (const w of x)
        yield w;
  }
  e.concatNested = m;
  function v(N, x, w) {
    let b = w;
    for (const y of N)
      b = x(b, y);
    return b;
  }
  e.reduce = v;
  function p(N, x) {
    let w = 0;
    for (const b of N)
      x(b, w++);
  }
  e.forEach = p;
  function* g(N, x, w = N.length) {
    for (x < 0 && (x += N.length), w < 0 ? w += N.length : w > N.length && (w = N.length); x < w; x++)
      yield N[x];
  }
  e.slice = g;
  function A(N, x = Number.POSITIVE_INFINITY) {
    const w = [];
    if (x === 0)
      return [w, N];
    const b = N[Symbol.iterator]();
    for (let y = 0; y < x; y++) {
      const _ = b.next();
      if (_.done)
        return [w, e.empty()];
      w.push(_.value);
    }
    return [w, { [Symbol.iterator]() {
      return b;
    } }];
  }
  e.consume = A;
  function S(N) {
    return A(N)[0];
  }
  e.collect = S;
  function C(N, x, w = (b, y) => b === y) {
    const b = N[Symbol.iterator](), y = x[Symbol.iterator]();
    for (; ; ) {
      const _ = b.next(), k = y.next();
      if (_.done !== k.done)
        return !1;
      if (_.done)
        return !0;
      if (!w(_.value, k.value))
        return !1;
    }
  }
  e.equals = C;
})(Rt || (Rt = {}));
class Ta extends Error {
  constructor(t) {
    super(`Encountered errors while disposing of store. Errors: [${t.join(", ")}]`), this.errors = t;
  }
}
function Zi(e) {
  if (Rt.is(e)) {
    const t = [];
    for (const r of e)
      if (r)
        try {
          r.dispose();
        } catch (n) {
          t.push(n);
        }
    if (t.length === 1)
      throw t[0];
    if (t.length > 1)
      throw new Ta(t);
    return Array.isArray(e) ? [] : e;
  } else if (e)
    return e.dispose(), e;
}
function Ea(...e) {
  return Dt(() => Zi(e));
}
function Dt(e) {
  return {
    dispose: Pa(() => {
      e();
    })
  };
}
class We {
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
      Zi(this._toDispose.values());
    } finally {
      this._toDispose.clear();
    }
  }
  add(t) {
    if (!t)
      return t;
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._isDisposed ? We.DISABLE_DISPOSED_WARNING || console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack) : this._toDispose.add(t), t;
  }
}
We.DISABLE_DISPOSED_WARNING = !1;
class zr {
  constructor() {
    this._store = new We(), this._store;
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
zr.None = Object.freeze({ dispose() {
} });
class Fa {
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
class z {
  constructor(t) {
    this.element = t, this.next = z.Undefined, this.prev = z.Undefined;
  }
}
z.Undefined = new z(void 0);
class Ot {
  constructor() {
    this._first = z.Undefined, this._last = z.Undefined, this._size = 0;
  }
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._first === z.Undefined;
  }
  clear() {
    let t = this._first;
    for (; t !== z.Undefined; ) {
      const r = t.next;
      t.prev = z.Undefined, t.next = z.Undefined, t = r;
    }
    this._first = z.Undefined, this._last = z.Undefined, this._size = 0;
  }
  unshift(t) {
    return this._insert(t, !1);
  }
  push(t) {
    return this._insert(t, !0);
  }
  _insert(t, r) {
    const n = new z(t);
    if (this._first === z.Undefined)
      this._first = n, this._last = n;
    else if (r) {
      const s = this._last;
      this._last = n, n.prev = s, s.next = n;
    } else {
      const s = this._first;
      this._first = n, n.next = s, s.prev = n;
    }
    this._size += 1;
    let i = !1;
    return () => {
      i || (i = !0, this._remove(n));
    };
  }
  shift() {
    if (this._first !== z.Undefined) {
      const t = this._first.element;
      return this._remove(this._first), t;
    }
  }
  pop() {
    if (this._last !== z.Undefined) {
      const t = this._last.element;
      return this._remove(this._last), t;
    }
  }
  _remove(t) {
    if (t.prev !== z.Undefined && t.next !== z.Undefined) {
      const r = t.prev;
      r.next = t.next, t.next.prev = r;
    } else
      t.prev === z.Undefined && t.next === z.Undefined ? (this._first = z.Undefined, this._last = z.Undefined) : t.next === z.Undefined ? (this._last = this._last.prev, this._last.next = z.Undefined) : t.prev === z.Undefined && (this._first = this._first.next, this._first.prev = z.Undefined);
    this._size -= 1;
  }
  *[Symbol.iterator]() {
    let t = this._first;
    for (; t !== z.Undefined; )
      yield t.element, t = t.next;
  }
}
globalThis && globalThis.__awaiter;
let Va = typeof document < "u" && document.location && document.location.hash.indexOf("pseudo=true") >= 0;
function Ia(e, t) {
  let r;
  return t.length === 0 ? r = e : r = e.replace(/\{(\d+)\}/g, (n, i) => {
    const s = i[0], o = t[s];
    let l = n;
    return typeof o == "string" ? l = o : (typeof o == "number" || typeof o == "boolean" || o === void 0 || o === null) && (l = String(o)), l;
  }), Va && (r = "［" + r.replace(/[aouei]/g, "$&$&") + "］"), r;
}
function Ra(e, t, ...r) {
  return Ia(t, r);
}
var tr;
const ct = "en";
let dr = !1, mr = !1, rr = !1, Xi = !1, Nt, nr = ct, Da, Fe;
const re = typeof self == "object" ? self : typeof global == "object" ? global : {};
let te;
typeof re.vscode < "u" && typeof re.vscode.process < "u" ? te = re.vscode.process : typeof process < "u" && (te = process);
const Oa = typeof ((tr = te == null ? void 0 : te.versions) === null || tr === void 0 ? void 0 : tr.electron) == "string", Ua = Oa && (te == null ? void 0 : te.type) === "renderer";
if (typeof navigator == "object" && !Ua)
  Fe = navigator.userAgent, dr = Fe.indexOf("Windows") >= 0, mr = Fe.indexOf("Macintosh") >= 0, (Fe.indexOf("Macintosh") >= 0 || Fe.indexOf("iPad") >= 0 || Fe.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints > 0, rr = Fe.indexOf("Linux") >= 0, Xi = !0, // This call _must_ be done in the file that calls `nls.getConfiguredDefaultLocale`
  // to ensure that the NLS AMD Loader plugin has been loaded and configured.
  // This is because the loader plugin decides what the default locale is based on
  // how it's able to resolve the strings.
  Ra({ key: "ensureLoaderPluginIsLoaded", comment: ["{Locked}"] }, "_"), Nt = ct, nr = Nt;
else if (typeof te == "object") {
  dr = te.platform === "win32", mr = te.platform === "darwin", rr = te.platform === "linux", rr && te.env.SNAP && te.env.SNAP_REVISION, te.env.CI || te.env.BUILD_ARTIFACTSTAGINGDIRECTORY, Nt = ct, nr = ct;
  const e = te.env.VSCODE_NLS_CONFIG;
  if (e)
    try {
      const t = JSON.parse(e), r = t.availableLanguages["*"];
      Nt = t.locale, nr = r || ct, Da = t._translationsConfigFile;
    } catch {
    }
} else
  console.error("Unable to resolve platform.");
const gt = dr, ja = mr;
Xi && re.importScripts;
const Ne = Fe, Ba = typeof re.postMessage == "function" && !re.importScripts;
(() => {
  if (Ba) {
    const e = [];
    re.addEventListener("message", (r) => {
      if (r.data && r.data.vscodeScheduleAsyncWork)
        for (let n = 0, i = e.length; n < i; n++) {
          const s = e[n];
          if (s.id === r.data.vscodeScheduleAsyncWork) {
            e.splice(n, 1), s.callback();
            return;
          }
        }
    });
    let t = 0;
    return (r) => {
      const n = ++t;
      e.push({
        id: n,
        callback: r
      }), re.postMessage({ vscodeScheduleAsyncWork: n }, "*");
    };
  }
  return (e) => setTimeout(e);
})();
const $a = !!(Ne && Ne.indexOf("Chrome") >= 0);
Ne && Ne.indexOf("Firefox") >= 0;
!$a && Ne && Ne.indexOf("Safari") >= 0;
Ne && Ne.indexOf("Edg/") >= 0;
Ne && Ne.indexOf("Android") >= 0;
const qa = re.performance && typeof re.performance.now == "function";
class Xt {
  constructor(t) {
    this._highResolution = qa && t, this._startTime = this._now(), this._stopTime = -1;
  }
  static create(t = !0) {
    return new Xt(t);
  }
  stop() {
    this._stopTime = this._now();
  }
  elapsed() {
    return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
  }
  _now() {
    return this._highResolution ? re.performance.now() : Date.now();
  }
}
var gr;
(function(e) {
  e.None = () => zr.None;
  function t(w) {
    return (b, y = null, _) => {
      let k = !1, T;
      return T = w((P) => {
        if (!k)
          return T ? T.dispose() : k = !0, b.call(y, P);
      }, null, _), k && T.dispose(), T;
    };
  }
  e.once = t;
  function r(w, b, y) {
    return u((_, k = null, T) => w((P) => _.call(k, b(P)), null, T), y);
  }
  e.map = r;
  function n(w, b, y) {
    return u((_, k = null, T) => w((P) => {
      b(P), _.call(k, P);
    }, null, T), y);
  }
  e.forEach = n;
  function i(w, b, y) {
    return u((_, k = null, T) => w((P) => b(P) && _.call(k, P), null, T), y);
  }
  e.filter = i;
  function s(w) {
    return w;
  }
  e.signal = s;
  function o(...w) {
    return (b, y = null, _) => Ea(...w.map((k) => k((T) => b.call(y, T), null, _)));
  }
  e.any = o;
  function l(w, b, y, _) {
    let k = y;
    return r(w, (T) => (k = b(k, T), k), _);
  }
  e.reduce = l;
  function u(w, b) {
    let y;
    const _ = {
      onFirstListenerAdd() {
        y = w(k.fire, k);
      },
      onLastListenerRemove() {
        y == null || y.dispose();
      }
    }, k = new Se(_);
    return b == null || b.add(k), k.event;
  }
  function c(w, b, y = 100, _ = !1, k, T) {
    let P, I, B, X = 0;
    const W = {
      leakWarningThreshold: k,
      onFirstListenerAdd() {
        P = w((M) => {
          X++, I = b(I, M), _ && !B && (E.fire(I), I = void 0), clearTimeout(B), B = setTimeout(() => {
            const F = I;
            I = void 0, B = void 0, (!_ || X > 1) && E.fire(F), X = 0;
          }, y);
        });
      },
      onLastListenerRemove() {
        P.dispose();
      }
    }, E = new Se(W);
    return T == null || T.add(E), E.event;
  }
  e.debounce = c;
  function h(w, b = (_, k) => _ === k, y) {
    let _ = !0, k;
    return i(w, (T) => {
      const P = _ || !b(T, k);
      return _ = !1, k = T, P;
    }, y);
  }
  e.latch = h;
  function f(w, b, y) {
    return [
      e.filter(w, b, y),
      e.filter(w, (_) => !b(_), y)
    ];
  }
  e.split = f;
  function d(w, b = !1, y = []) {
    let _ = y.slice(), k = w((I) => {
      _ ? _.push(I) : P.fire(I);
    });
    const T = () => {
      _ == null || _.forEach((I) => P.fire(I)), _ = null;
    }, P = new Se({
      onFirstListenerAdd() {
        k || (k = w((I) => P.fire(I)));
      },
      onFirstListenerDidAdd() {
        _ && (b ? setTimeout(T) : T());
      },
      onLastListenerRemove() {
        k && k.dispose(), k = null;
      }
    });
    return P.event;
  }
  e.buffer = d;
  class m {
    constructor(b) {
      this.event = b, this.disposables = new We();
    }
    map(b) {
      return new m(r(this.event, b, this.disposables));
    }
    forEach(b) {
      return new m(n(this.event, b, this.disposables));
    }
    filter(b) {
      return new m(i(this.event, b, this.disposables));
    }
    reduce(b, y) {
      return new m(l(this.event, b, y, this.disposables));
    }
    latch() {
      return new m(h(this.event, void 0, this.disposables));
    }
    debounce(b, y = 100, _ = !1, k) {
      return new m(c(this.event, b, y, _, k, this.disposables));
    }
    on(b, y, _) {
      return this.event(b, y, _);
    }
    once(b, y, _) {
      return t(this.event)(b, y, _);
    }
    dispose() {
      this.disposables.dispose();
    }
  }
  function v(w) {
    return new m(w);
  }
  e.chain = v;
  function p(w, b, y = (_) => _) {
    const _ = (...I) => P.fire(y(...I)), k = () => w.on(b, _), T = () => w.removeListener(b, _), P = new Se({ onFirstListenerAdd: k, onLastListenerRemove: T });
    return P.event;
  }
  e.fromNodeEventEmitter = p;
  function g(w, b, y = (_) => _) {
    const _ = (...I) => P.fire(y(...I)), k = () => w.addEventListener(b, _), T = () => w.removeEventListener(b, _), P = new Se({ onFirstListenerAdd: k, onLastListenerRemove: T });
    return P.event;
  }
  e.fromDOMEventEmitter = g;
  function A(w) {
    return new Promise((b) => t(w)(b));
  }
  e.toPromise = A;
  function S(w, b) {
    return b(void 0), w((y) => b(y));
  }
  e.runAndSubscribe = S;
  function C(w, b) {
    let y = null;
    function _(T) {
      y == null || y.dispose(), y = new We(), b(T, y);
    }
    _(void 0);
    const k = w((T) => _(T));
    return Dt(() => {
      k.dispose(), y == null || y.dispose();
    });
  }
  e.runAndSubscribeWithStore = C;
  class N {
    constructor(b, y) {
      this.obs = b, this._counter = 0, this._hasChanged = !1;
      const _ = {
        onFirstListenerAdd: () => {
          b.addObserver(this);
        },
        onLastListenerRemove: () => {
          b.removeObserver(this);
        }
      };
      this.emitter = new Se(_), y && y.add(this.emitter);
    }
    beginUpdate(b) {
      this._counter++;
    }
    handleChange(b, y) {
      this._hasChanged = !0;
    }
    endUpdate(b) {
      --this._counter === 0 && this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this.obs.get()));
    }
  }
  function x(w, b) {
    return new N(w, b).emitter.event;
  }
  e.fromObservable = x;
})(gr || (gr = {}));
class Qt {
  constructor(t) {
    this._listenerCount = 0, this._invocationCount = 0, this._elapsedOverall = 0, this._name = `${t}_${Qt._idPool++}`;
  }
  start(t) {
    this._stopWatch = new Xt(!0), this._listenerCount = t;
  }
  stop() {
    if (this._stopWatch) {
      const t = this._stopWatch.elapsed();
      this._elapsedOverall += t, this._invocationCount += 1, console.info(`did FIRE ${this._name}: elapsed_ms: ${t.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`), this._stopWatch = void 0;
    }
  }
}
Qt._idPool = 0;
class Gr {
  constructor(t) {
    this.value = t;
  }
  static create() {
    var t;
    return new Gr((t = new Error().stack) !== null && t !== void 0 ? t : "");
  }
  print() {
    console.warn(this.value.split(`
`).slice(2).join(`
`));
  }
}
class Wa {
  constructor(t, r, n) {
    this.callback = t, this.callbackThis = r, this.stack = n, this.subscription = new Fa();
  }
  invoke(t) {
    this.callback.call(this.callbackThis, t);
  }
}
class Se {
  constructor(t) {
    var r, n;
    this._disposed = !1, this._options = t, this._leakageMon = void 0, this._perfMon = !((r = this._options) === null || r === void 0) && r._profName ? new Qt(this._options._profName) : void 0, this._deliveryQueue = (n = this._options) === null || n === void 0 ? void 0 : n.deliveryQueue;
  }
  dispose() {
    var t, r, n, i;
    this._disposed || (this._disposed = !0, this._listeners && this._listeners.clear(), (t = this._deliveryQueue) === null || t === void 0 || t.clear(this), (n = (r = this._options) === null || r === void 0 ? void 0 : r.onLastListenerRemove) === null || n === void 0 || n.call(r), (i = this._leakageMon) === null || i === void 0 || i.dispose());
  }
  /**
   * For the public to allow to subscribe
   * to events from this Emitter
   */
  get event() {
    return this._event || (this._event = (t, r, n) => {
      var i, s, o;
      this._listeners || (this._listeners = new Ot());
      const l = this._listeners.isEmpty();
      l && (!((i = this._options) === null || i === void 0) && i.onFirstListenerAdd) && this._options.onFirstListenerAdd(this);
      let u, c;
      this._leakageMon && this._listeners.size >= 30 && (c = Gr.create(), u = this._leakageMon.check(c, this._listeners.size + 1));
      const h = new Wa(t, r, c), f = this._listeners.push(h);
      l && (!((s = this._options) === null || s === void 0) && s.onFirstListenerDidAdd) && this._options.onFirstListenerDidAdd(this), !((o = this._options) === null || o === void 0) && o.onListenerDidAdd && this._options.onListenerDidAdd(this, t, r);
      const d = h.subscription.set(() => {
        u == null || u(), this._disposed || (f(), this._options && this._options.onLastListenerRemove && (this._listeners && !this._listeners.isEmpty() || this._options.onLastListenerRemove(this)));
      });
      return n instanceof We ? n.add(d) : Array.isArray(n) && n.push(d), d;
    }), this._event;
  }
  /**
   * To be kept private to fire an event to
   * subscribers
   */
  fire(t) {
    var r, n;
    if (this._listeners) {
      this._deliveryQueue || (this._deliveryQueue = new za());
      for (const i of this._listeners)
        this._deliveryQueue.push(this, i, t);
      (r = this._perfMon) === null || r === void 0 || r.start(this._deliveryQueue.size), this._deliveryQueue.deliver(), (n = this._perfMon) === null || n === void 0 || n.stop();
    }
  }
}
class Ha {
  constructor() {
    this._queue = new Ot();
  }
  get size() {
    return this._queue.size;
  }
  push(t, r, n) {
    this._queue.push(new Ga(t, r, n));
  }
  clear(t) {
    const r = new Ot();
    for (const n of this._queue)
      n.emitter !== t && r.push(n);
    this._queue = r;
  }
  deliver() {
    for (; this._queue.size > 0; ) {
      const t = this._queue.shift();
      try {
        t.listener.invoke(t.event);
      } catch (r) {
        ka(r);
      }
    }
  }
}
class za extends Ha {
  clear(t) {
    this._queue.clear();
  }
}
class Ga {
  constructor(t, r, n) {
    this.emitter = t, this.listener = r, this.event = n;
  }
}
function Ja(e) {
  let t = [], r = Object.getPrototypeOf(e);
  for (; Object.prototype !== r; )
    t = t.concat(Object.getOwnPropertyNames(r)), r = Object.getPrototypeOf(r);
  return t;
}
function pr(e) {
  const t = [];
  for (const r of Ja(e))
    typeof e[r] == "function" && t.push(r);
  return t;
}
function Za(e, t) {
  const r = (i) => function() {
    const s = Array.prototype.slice.call(arguments, 0);
    return t(i, s);
  }, n = {};
  for (const i of e)
    n[i] = r(i);
  return n;
}
function Xa(e, t = "Unreachable") {
  throw new Error(t);
}
class Qa {
  constructor(t) {
    this.fn = t, this.lastCache = void 0, this.lastArgKey = void 0;
  }
  get(t) {
    const r = JSON.stringify(t);
    return this.lastArgKey !== r && (this.lastArgKey = r, this.lastCache = this.fn(t)), this.lastCache;
  }
}
class Qi {
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
var Yi;
function Ya(e) {
  return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
}
function Ka(e) {
  return e.split(/\r\n|\r|\n/);
}
function es(e) {
  for (let t = 0, r = e.length; t < r; t++) {
    const n = e.charCodeAt(t);
    if (n !== 32 && n !== 9)
      return t;
  }
  return -1;
}
function ts(e, t = e.length - 1) {
  for (let r = t; r >= 0; r--) {
    const n = e.charCodeAt(r);
    if (n !== 32 && n !== 9)
      return r;
  }
  return -1;
}
function Ki(e) {
  return e >= 65 && e <= 90;
}
function vr(e) {
  return 55296 <= e && e <= 56319;
}
function rs(e) {
  return 56320 <= e && e <= 57343;
}
function ns(e, t) {
  return (e - 55296 << 10) + (t - 56320) + 65536;
}
function is(e, t, r) {
  const n = e.charCodeAt(r);
  if (vr(n) && r + 1 < t) {
    const i = e.charCodeAt(r + 1);
    if (rs(i))
      return ns(n, i);
  }
  return n;
}
const as = /^[\t\n\r\x20-\x7E]*$/;
function ss(e) {
  return as.test(e);
}
class ge {
  constructor(t) {
    this.confusableDictionary = t;
  }
  static getInstance(t) {
    return ge.cache.get(Array.from(t));
  }
  static getLocales() {
    return ge._locales.getValue();
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
Yi = ge;
ge.ambiguousCharacterData = new Qi(() => JSON.parse('{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}'));
ge.cache = new Qa((e) => {
  function t(c) {
    const h = /* @__PURE__ */ new Map();
    for (let f = 0; f < c.length; f += 2)
      h.set(c[f], c[f + 1]);
    return h;
  }
  function r(c, h) {
    const f = new Map(c);
    for (const [d, m] of h)
      f.set(d, m);
    return f;
  }
  function n(c, h) {
    if (!c)
      return h;
    const f = /* @__PURE__ */ new Map();
    for (const [d, m] of c)
      h.has(d) && f.set(d, m);
    return f;
  }
  const i = Yi.ambiguousCharacterData.getValue();
  let s = e.filter((c) => !c.startsWith("_") && c in i);
  s.length === 0 && (s = ["_default"]);
  let o;
  for (const c of s) {
    const h = t(i[c]);
    o = n(o, h);
  }
  const l = t(i._common), u = r(l, o);
  return new ge(u);
});
ge._locales = new Qi(() => Object.keys(ge.ambiguousCharacterData.getValue()).filter((e) => !e.startsWith("_")));
class De {
  static getRawData() {
    return JSON.parse("[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]");
  }
  static getData() {
    return this._data || (this._data = new Set(De.getRawData())), this._data;
  }
  static isInvisibleCharacter(t) {
    return De.getData().has(t);
  }
  static get codePoints() {
    return De.getData();
  }
}
De._data = void 0;
const os = "$initialize";
class ls {
  constructor(t, r, n, i) {
    this.vsWorker = t, this.req = r, this.method = n, this.args = i, this.type = 0;
  }
}
class sn {
  constructor(t, r, n, i) {
    this.vsWorker = t, this.seq = r, this.res = n, this.err = i, this.type = 1;
  }
}
class us {
  constructor(t, r, n, i) {
    this.vsWorker = t, this.req = r, this.eventName = n, this.arg = i, this.type = 2;
  }
}
class cs {
  constructor(t, r, n) {
    this.vsWorker = t, this.req = r, this.event = n, this.type = 3;
  }
}
class fs {
  constructor(t, r) {
    this.vsWorker = t, this.req = r, this.type = 4;
  }
}
class hs {
  constructor(t) {
    this._workerId = -1, this._handler = t, this._lastSentReq = 0, this._pendingReplies = /* @__PURE__ */ Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
  }
  setWorkerId(t) {
    this._workerId = t;
  }
  sendMessage(t, r) {
    const n = String(++this._lastSentReq);
    return new Promise((i, s) => {
      this._pendingReplies[n] = {
        resolve: i,
        reject: s
      }, this._send(new ls(this._workerId, n, t, r));
    });
  }
  listen(t, r) {
    let n = null;
    const i = new Se({
      onFirstListenerAdd: () => {
        n = String(++this._lastSentReq), this._pendingEmitters.set(n, i), this._send(new us(this._workerId, n, t, r));
      },
      onLastListenerRemove: () => {
        this._pendingEmitters.delete(n), this._send(new fs(this._workerId, n)), n = null;
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
      let n = t.err;
      t.err.$isError && (n = new Error(), n.name = t.err.name, n.message = t.err.message, n.stack = t.err.stack), r.reject(n);
      return;
    }
    r.resolve(t.res);
  }
  _handleRequestMessage(t) {
    const r = t.req;
    this._handler.handleMessage(t.method, t.args).then((i) => {
      this._send(new sn(this._workerId, r, i, void 0));
    }, (i) => {
      i.detail instanceof Error && (i.detail = an(i.detail)), this._send(new sn(this._workerId, r, void 0, an(i)));
    });
  }
  _handleSubscribeEventMessage(t) {
    const r = t.req, n = this._handler.handleEvent(t.eventName, t.arg)((i) => {
      this._send(new cs(this._workerId, r, i));
    });
    this._pendingEvents.set(r, n);
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
      for (let n = 0; n < t.args.length; n++)
        t.args[n] instanceof ArrayBuffer && r.push(t.args[n]);
    else
      t.type === 1 && t.res instanceof ArrayBuffer && r.push(t.res);
    this._handler.sendMessage(t, r);
  }
}
function ea(e) {
  return e[0] === "o" && e[1] === "n" && Ki(e.charCodeAt(2));
}
function ta(e) {
  return /^onDynamic/.test(e) && Ki(e.charCodeAt(9));
}
function ds(e, t, r) {
  const n = (o) => function() {
    const l = Array.prototype.slice.call(arguments, 0);
    return t(o, l);
  }, i = (o) => function(l) {
    return r(o, l);
  }, s = {};
  for (const o of e) {
    if (ta(o)) {
      s[o] = i(o);
      continue;
    }
    if (ea(o)) {
      s[o] = r(o, void 0);
      continue;
    }
    s[o] = n(o);
  }
  return s;
}
class ms {
  constructor(t, r) {
    this._requestHandlerFactory = r, this._requestHandler = null, this._protocol = new hs({
      sendMessage: (n, i) => {
        t(n, i);
      },
      handleMessage: (n, i) => this._handleMessage(n, i),
      handleEvent: (n, i) => this._handleEvent(n, i)
    });
  }
  onmessage(t) {
    this._protocol.handleMessage(t);
  }
  _handleMessage(t, r) {
    if (t === os)
      return this.initialize(r[0], r[1], r[2], r[3]);
    if (!this._requestHandler || typeof this._requestHandler[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._requestHandler[t].apply(this._requestHandler, r));
    } catch (n) {
      return Promise.reject(n);
    }
  }
  _handleEvent(t, r) {
    if (!this._requestHandler)
      throw new Error("Missing requestHandler");
    if (ta(t)) {
      const n = this._requestHandler[t].call(this._requestHandler, r);
      if (typeof n != "function")
        throw new Error(`Missing dynamic event ${t} on request handler.`);
      return n;
    }
    if (ea(t)) {
      const n = this._requestHandler[t];
      if (typeof n != "function")
        throw new Error(`Missing event ${t} on request handler.`);
      return n;
    }
    throw new Error(`Malformed event name ${t}`);
  }
  initialize(t, r, n, i) {
    this._protocol.setWorkerId(t);
    const l = ds(i, (u, c) => this._protocol.sendMessage(u, c), (u, c) => this._protocol.listen(u, c));
    return this._requestHandlerFactory ? (this._requestHandler = this._requestHandlerFactory(l), Promise.resolve(pr(this._requestHandler))) : (r && (typeof r.baseUrl < "u" && delete r.baseUrl, typeof r.paths < "u" && typeof r.paths.vs < "u" && delete r.paths.vs, typeof r.trustedTypesPolicy !== void 0 && delete r.trustedTypesPolicy, r.catchError = !0, re.require.config(r)), new Promise((u, c) => {
      const h = re.require;
      h([n], (f) => {
        if (this._requestHandler = f.create(l), !this._requestHandler) {
          c(new Error("No RequestHandler!"));
          return;
        }
        u(pr(this._requestHandler));
      }, c);
    }));
  }
}
class Ve {
  /**
   * Constructs a new DiffChange with the given sequence information
   * and content.
   */
  constructor(t, r, n, i) {
    this.originalStart = t, this.originalLength = r, this.modifiedStart = n, this.modifiedLength = i;
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
function on(e, t) {
  return (t << 5) - t + e | 0;
}
function gs(e, t) {
  t = on(149417, t);
  for (let r = 0, n = e.length; r < n; r++)
    t = on(e.charCodeAt(r), t);
  return t;
}
class ln {
  constructor(t) {
    this.source = t;
  }
  getElements() {
    const t = this.source, r = new Int32Array(t.length);
    for (let n = 0, i = t.length; n < i; n++)
      r[n] = t.charCodeAt(n);
    return r;
  }
}
function ps(e, t, r) {
  return new Re(new ln(e), new ln(t)).ComputeDiff(r).changes;
}
class Xe {
  static Assert(t, r) {
    if (!t)
      throw new Error(r);
  }
}
class Qe {
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
  static Copy(t, r, n, i, s) {
    for (let o = 0; o < s; o++)
      n[i + o] = t[r + o];
  }
  static Copy2(t, r, n, i, s) {
    for (let o = 0; o < s; o++)
      n[i + o] = t[r + o];
  }
}
class un {
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
    (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new Ve(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
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
class Re {
  /**
   * Constructs the DiffFinder
   */
  constructor(t, r, n = null) {
    this.ContinueProcessingPredicate = n, this._originalSequence = t, this._modifiedSequence = r;
    const [i, s, o] = Re._getElements(t), [l, u, c] = Re._getElements(r);
    this._hasStrings = o && c, this._originalStringElements = i, this._originalElementsOrHash = s, this._modifiedStringElements = l, this._modifiedElementsOrHash = u, this.m_forwardHistory = [], this.m_reverseHistory = [];
  }
  static _isStringArray(t) {
    return t.length > 0 && typeof t[0] == "string";
  }
  static _getElements(t) {
    const r = t.getElements();
    if (Re._isStringArray(r)) {
      const n = new Int32Array(r.length);
      for (let i = 0, s = r.length; i < s; i++)
        n[i] = gs(r[i], 0);
      return [r, n, !0];
    }
    return r instanceof Int32Array ? [[], r, !1] : [[], new Int32Array(r), !1];
  }
  ElementsAreEqual(t, r) {
    return this._originalElementsOrHash[t] !== this._modifiedElementsOrHash[r] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._modifiedStringElements[r] : !0;
  }
  ElementsAreStrictEqual(t, r) {
    if (!this.ElementsAreEqual(t, r))
      return !1;
    const n = Re._getStrictElement(this._originalSequence, t), i = Re._getStrictElement(this._modifiedSequence, r);
    return n === i;
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
  _ComputeDiff(t, r, n, i, s) {
    const o = [!1];
    let l = this.ComputeDiffRecursive(t, r, n, i, o);
    return s && (l = this.PrettifyChanges(l)), {
      quitEarly: o[0],
      changes: l
    };
  }
  /**
   * Private helper method which computes the differences on the bounded range
   * recursively.
   * @returns An array of the differences between the two input sequences.
   */
  ComputeDiffRecursive(t, r, n, i, s) {
    for (s[0] = !1; t <= r && n <= i && this.ElementsAreEqual(t, n); )
      t++, n++;
    for (; r >= t && i >= n && this.ElementsAreEqual(r, i); )
      r--, i--;
    if (t > r || n > i) {
      let f;
      return n <= i ? (Xe.Assert(t === r + 1, "originalStart should only be one more than originalEnd"), f = [
        new Ve(t, 0, n, i - n + 1)
      ]) : t <= r ? (Xe.Assert(n === i + 1, "modifiedStart should only be one more than modifiedEnd"), f = [
        new Ve(t, r - t + 1, n, 0)
      ]) : (Xe.Assert(t === r + 1, "originalStart should only be one more than originalEnd"), Xe.Assert(n === i + 1, "modifiedStart should only be one more than modifiedEnd"), f = []), f;
    }
    const o = [0], l = [0], u = this.ComputeRecursionPoint(t, r, n, i, o, l, s), c = o[0], h = l[0];
    if (u !== null)
      return u;
    if (!s[0]) {
      const f = this.ComputeDiffRecursive(t, c, n, h, s);
      let d = [];
      return s[0] ? d = [
        new Ve(c + 1, r - (c + 1) + 1, h + 1, i - (h + 1) + 1)
      ] : d = this.ComputeDiffRecursive(c + 1, r, h + 1, i, s), this.ConcatenateChanges(f, d);
    }
    return [
      new Ve(t, r - t + 1, n, i - n + 1)
    ];
  }
  WALKTRACE(t, r, n, i, s, o, l, u, c, h, f, d, m, v, p, g, A, S) {
    let C = null, N = null, x = new un(), w = r, b = n, y = m[0] - g[0] - i, _ = -1073741824, k = this.m_forwardHistory.length - 1;
    do {
      const T = y + t;
      T === w || T < b && c[T - 1] < c[T + 1] ? (f = c[T + 1], v = f - y - i, f < _ && x.MarkNextChange(), _ = f, x.AddModifiedElement(f + 1, v), y = T + 1 - t) : (f = c[T - 1] + 1, v = f - y - i, f < _ && x.MarkNextChange(), _ = f - 1, x.AddOriginalElement(f, v + 1), y = T - 1 - t), k >= 0 && (c = this.m_forwardHistory[k], t = c[0], w = 1, b = c.length - 1);
    } while (--k >= -1);
    if (C = x.getReverseChanges(), S[0]) {
      let T = m[0] + 1, P = g[0] + 1;
      if (C !== null && C.length > 0) {
        const I = C[C.length - 1];
        T = Math.max(T, I.getOriginalEnd()), P = Math.max(P, I.getModifiedEnd());
      }
      N = [
        new Ve(T, d - T + 1, P, p - P + 1)
      ];
    } else {
      x = new un(), w = o, b = l, y = m[0] - g[0] - u, _ = 1073741824, k = A ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
      do {
        const T = y + s;
        T === w || T < b && h[T - 1] >= h[T + 1] ? (f = h[T + 1] - 1, v = f - y - u, f > _ && x.MarkNextChange(), _ = f + 1, x.AddOriginalElement(f + 1, v + 1), y = T + 1 - s) : (f = h[T - 1], v = f - y - u, f > _ && x.MarkNextChange(), _ = f, x.AddModifiedElement(f + 1, v + 1), y = T - 1 - s), k >= 0 && (h = this.m_reverseHistory[k], s = h[0], w = 1, b = h.length - 1);
      } while (--k >= -1);
      N = x.getChanges();
    }
    return this.ConcatenateChanges(C, N);
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
  ComputeRecursionPoint(t, r, n, i, s, o, l) {
    let u = 0, c = 0, h = 0, f = 0, d = 0, m = 0;
    t--, n--, s[0] = 0, o[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
    const v = r - t + (i - n), p = v + 1, g = new Int32Array(p), A = new Int32Array(p), S = i - n, C = r - t, N = t - n, x = r - i, b = (C - S) % 2 === 0;
    g[S] = t, A[C] = r, l[0] = !1;
    for (let y = 1; y <= v / 2 + 1; y++) {
      let _ = 0, k = 0;
      h = this.ClipDiagonalBound(S - y, y, S, p), f = this.ClipDiagonalBound(S + y, y, S, p);
      for (let P = h; P <= f; P += 2) {
        P === h || P < f && g[P - 1] < g[P + 1] ? u = g[P + 1] : u = g[P - 1] + 1, c = u - (P - S) - N;
        const I = u;
        for (; u < r && c < i && this.ElementsAreEqual(u + 1, c + 1); )
          u++, c++;
        if (g[P] = u, u + c > _ + k && (_ = u, k = c), !b && Math.abs(P - C) <= y - 1 && u >= A[P])
          return s[0] = u, o[0] = c, I <= A[P] && 1447 > 0 && y <= 1447 + 1 ? this.WALKTRACE(S, h, f, N, C, d, m, x, g, A, u, r, s, c, i, o, b, l) : null;
      }
      const T = (_ - t + (k - n) - y) / 2;
      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(_, T))
        return l[0] = !0, s[0] = _, o[0] = k, T > 0 && 1447 > 0 && y <= 1447 + 1 ? this.WALKTRACE(S, h, f, N, C, d, m, x, g, A, u, r, s, c, i, o, b, l) : (t++, n++, [
          new Ve(t, r - t + 1, n, i - n + 1)
        ]);
      d = this.ClipDiagonalBound(C - y, y, C, p), m = this.ClipDiagonalBound(C + y, y, C, p);
      for (let P = d; P <= m; P += 2) {
        P === d || P < m && A[P - 1] >= A[P + 1] ? u = A[P + 1] - 1 : u = A[P - 1], c = u - (P - C) - x;
        const I = u;
        for (; u > t && c > n && this.ElementsAreEqual(u, c); )
          u--, c--;
        if (A[P] = u, b && Math.abs(P - S) <= y && u <= g[P])
          return s[0] = u, o[0] = c, I >= g[P] && 1447 > 0 && y <= 1447 + 1 ? this.WALKTRACE(S, h, f, N, C, d, m, x, g, A, u, r, s, c, i, o, b, l) : null;
      }
      if (y <= 1447) {
        let P = new Int32Array(f - h + 2);
        P[0] = S - h + 1, Qe.Copy2(g, h, P, 1, f - h + 1), this.m_forwardHistory.push(P), P = new Int32Array(m - d + 2), P[0] = C - d + 1, Qe.Copy2(A, d, P, 1, m - d + 1), this.m_reverseHistory.push(P);
      }
    }
    return this.WALKTRACE(S, h, f, N, C, d, m, x, g, A, u, r, s, c, i, o, b, l);
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
      const n = t[r], i = r < t.length - 1 ? t[r + 1].originalStart : this._originalElementsOrHash.length, s = r < t.length - 1 ? t[r + 1].modifiedStart : this._modifiedElementsOrHash.length, o = n.originalLength > 0, l = n.modifiedLength > 0;
      for (; n.originalStart + n.originalLength < i && n.modifiedStart + n.modifiedLength < s && (!o || this.OriginalElementsAreEqual(n.originalStart, n.originalStart + n.originalLength)) && (!l || this.ModifiedElementsAreEqual(n.modifiedStart, n.modifiedStart + n.modifiedLength)); ) {
        const c = this.ElementsAreStrictEqual(n.originalStart, n.modifiedStart);
        if (this.ElementsAreStrictEqual(n.originalStart + n.originalLength, n.modifiedStart + n.modifiedLength) && !c)
          break;
        n.originalStart++, n.modifiedStart++;
      }
      const u = [null];
      if (r < t.length - 1 && this.ChangesOverlap(t[r], t[r + 1], u)) {
        t[r] = u[0], t.splice(r + 1, 1), r--;
        continue;
      }
    }
    for (let r = t.length - 1; r >= 0; r--) {
      const n = t[r];
      let i = 0, s = 0;
      if (r > 0) {
        const f = t[r - 1];
        i = f.originalStart + f.originalLength, s = f.modifiedStart + f.modifiedLength;
      }
      const o = n.originalLength > 0, l = n.modifiedLength > 0;
      let u = 0, c = this._boundaryScore(n.originalStart, n.originalLength, n.modifiedStart, n.modifiedLength);
      for (let f = 1; ; f++) {
        const d = n.originalStart - f, m = n.modifiedStart - f;
        if (d < i || m < s || o && !this.OriginalElementsAreEqual(d, d + n.originalLength) || l && !this.ModifiedElementsAreEqual(m, m + n.modifiedLength))
          break;
        const p = (d === i && m === s ? 5 : 0) + this._boundaryScore(d, n.originalLength, m, n.modifiedLength);
        p > c && (c = p, u = f);
      }
      n.originalStart -= u, n.modifiedStart -= u;
      const h = [null];
      if (r > 0 && this.ChangesOverlap(t[r - 1], t[r], h)) {
        t[r - 1] = h[0], t.splice(r, 1), r++;
        continue;
      }
    }
    if (this._hasStrings)
      for (let r = 1, n = t.length; r < n; r++) {
        const i = t[r - 1], s = t[r], o = s.originalStart - i.originalStart - i.originalLength, l = i.originalStart, u = s.originalStart + s.originalLength, c = u - l, h = i.modifiedStart, f = s.modifiedStart + s.modifiedLength, d = f - h;
        if (o < 5 && c < 20 && d < 20) {
          const m = this._findBetterContiguousSequence(l, c, h, d, o);
          if (m) {
            const [v, p] = m;
            (v !== i.originalStart + i.originalLength || p !== i.modifiedStart + i.modifiedLength) && (i.originalLength = v - i.originalStart, i.modifiedLength = p - i.modifiedStart, s.originalStart = v + o, s.modifiedStart = p + o, s.originalLength = u - s.originalStart, s.modifiedLength = f - s.modifiedStart);
          }
        }
      }
    return t;
  }
  _findBetterContiguousSequence(t, r, n, i, s) {
    if (r < s || i < s)
      return null;
    const o = t + r - s + 1, l = n + i - s + 1;
    let u = 0, c = 0, h = 0;
    for (let f = t; f < o; f++)
      for (let d = n; d < l; d++) {
        const m = this._contiguousSequenceScore(f, d, s);
        m > 0 && m > u && (u = m, c = f, h = d);
      }
    return u > 0 ? [c, h] : null;
  }
  _contiguousSequenceScore(t, r, n) {
    let i = 0;
    for (let s = 0; s < n; s++) {
      if (!this.ElementsAreEqual(t + s, r + s))
        return 0;
      i += this._originalStringElements[t + s].length;
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
      const n = t + r;
      if (this._OriginalIsBoundary(n - 1) || this._OriginalIsBoundary(n))
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
      const n = t + r;
      if (this._ModifiedIsBoundary(n - 1) || this._ModifiedIsBoundary(n))
        return !0;
    }
    return !1;
  }
  _boundaryScore(t, r, n, i) {
    const s = this._OriginalRegionIsBoundary(t, r) ? 1 : 0, o = this._ModifiedRegionIsBoundary(n, i) ? 1 : 0;
    return s + o;
  }
  /**
   * Concatenates the two input DiffChange lists and returns the resulting
   * list.
   * @param The left changes
   * @param The right changes
   * @returns The concatenated list
   */
  ConcatenateChanges(t, r) {
    const n = [];
    if (t.length === 0 || r.length === 0)
      return r.length > 0 ? r : t;
    if (this.ChangesOverlap(t[t.length - 1], r[0], n)) {
      const i = new Array(t.length + r.length - 1);
      return Qe.Copy(t, 0, i, 0, t.length - 1), i[t.length - 1] = n[0], Qe.Copy(r, 1, i, t.length, r.length - 1), i;
    } else {
      const i = new Array(t.length + r.length);
      return Qe.Copy(t, 0, i, 0, t.length), Qe.Copy(r, 0, i, t.length, r.length), i;
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
  ChangesOverlap(t, r, n) {
    if (Xe.Assert(t.originalStart <= r.originalStart, "Left change is not less than or equal to right change"), Xe.Assert(t.modifiedStart <= r.modifiedStart, "Left change is not less than or equal to right change"), t.originalStart + t.originalLength >= r.originalStart || t.modifiedStart + t.modifiedLength >= r.modifiedStart) {
      const i = t.originalStart;
      let s = t.originalLength;
      const o = t.modifiedStart;
      let l = t.modifiedLength;
      return t.originalStart + t.originalLength >= r.originalStart && (s = r.originalStart + r.originalLength - t.originalStart), t.modifiedStart + t.modifiedLength >= r.modifiedStart && (l = r.modifiedStart + r.modifiedLength - t.modifiedStart), n[0] = new Ve(i, s, o, l), !0;
    } else
      return n[0] = null, !1;
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
  ClipDiagonalBound(t, r, n, i) {
    if (t >= 0 && t < i)
      return t;
    const s = n, o = i - n - 1, l = r % 2 === 0;
    if (t < 0) {
      const u = s % 2 === 0;
      return l === u ? 0 : 1;
    } else {
      const u = o % 2 === 0;
      return l === u ? i - 1 : i - 2;
    }
  }
}
let rt;
if (typeof re.vscode < "u" && typeof re.vscode.process < "u") {
  const e = re.vscode.process;
  rt = {
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
  typeof process < "u" ? rt = {
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
  } : rt = {
    // Supported
    get platform() {
      return gt ? "win32" : ja ? "darwin" : "linux";
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
const br = rt.cwd, vs = rt.env, ze = rt.platform, bs = 65, ws = 97, ys = 90, Cs = 122, Oe = 46, K = 47, se = 92, Me = 58, _s = 63;
class ra extends Error {
  constructor(t, r, n) {
    let i;
    typeof r == "string" && r.indexOf("not ") === 0 ? (i = "must not be", r = r.replace(/^not /, "")) : i = "must be";
    const s = t.indexOf(".") !== -1 ? "property" : "argument";
    let o = `The "${t}" ${s} ${i} of type ${r}`;
    o += `. Received type ${typeof n}`, super(o), this.code = "ERR_INVALID_ARG_TYPE";
  }
}
function J(e, t) {
  if (typeof e != "string")
    throw new ra(t, "string", e);
}
function j(e) {
  return e === K || e === se;
}
function wr(e) {
  return e === K;
}
function Pe(e) {
  return e >= bs && e <= ys || e >= ws && e <= Cs;
}
function Ut(e, t, r, n) {
  let i = "", s = 0, o = -1, l = 0, u = 0;
  for (let c = 0; c <= e.length; ++c) {
    if (c < e.length)
      u = e.charCodeAt(c);
    else {
      if (n(u))
        break;
      u = K;
    }
    if (n(u)) {
      if (!(o === c - 1 || l === 1))
        if (l === 2) {
          if (i.length < 2 || s !== 2 || i.charCodeAt(i.length - 1) !== Oe || i.charCodeAt(i.length - 2) !== Oe) {
            if (i.length > 2) {
              const h = i.lastIndexOf(r);
              h === -1 ? (i = "", s = 0) : (i = i.slice(0, h), s = i.length - 1 - i.lastIndexOf(r)), o = c, l = 0;
              continue;
            } else if (i.length !== 0) {
              i = "", s = 0, o = c, l = 0;
              continue;
            }
          }
          t && (i += i.length > 0 ? `${r}..` : "..", s = 2);
        } else
          i.length > 0 ? i += `${r}${e.slice(o + 1, c)}` : i = e.slice(o + 1, c), s = c - o - 1;
      o = c, l = 0;
    } else
      u === Oe && l !== -1 ? ++l : l = -1;
  }
  return i;
}
function na(e, t) {
  if (t === null || typeof t != "object")
    throw new ra("pathObject", "Object", t);
  const r = t.dir || t.root, n = t.base || `${t.name || ""}${t.ext || ""}`;
  return r ? r === t.root ? `${r}${n}` : `${r}${e}${n}` : n;
}
const ae = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", r = "", n = !1;
    for (let i = e.length - 1; i >= -1; i--) {
      let s;
      if (i >= 0) {
        if (s = e[i], J(s, "path"), s.length === 0)
          continue;
      } else
        t.length === 0 ? s = br() : (s = vs[`=${t}`] || br(), (s === void 0 || s.slice(0, 2).toLowerCase() !== t.toLowerCase() && s.charCodeAt(2) === se) && (s = `${t}\\`));
      const o = s.length;
      let l = 0, u = "", c = !1;
      const h = s.charCodeAt(0);
      if (o === 1)
        j(h) && (l = 1, c = !0);
      else if (j(h))
        if (c = !0, j(s.charCodeAt(1))) {
          let f = 2, d = f;
          for (; f < o && !j(s.charCodeAt(f)); )
            f++;
          if (f < o && f !== d) {
            const m = s.slice(d, f);
            for (d = f; f < o && j(s.charCodeAt(f)); )
              f++;
            if (f < o && f !== d) {
              for (d = f; f < o && !j(s.charCodeAt(f)); )
                f++;
              (f === o || f !== d) && (u = `\\\\${m}\\${s.slice(d, f)}`, l = f);
            }
          }
        } else
          l = 1;
      else
        Pe(h) && s.charCodeAt(1) === Me && (u = s.slice(0, 2), l = 2, o > 2 && j(s.charCodeAt(2)) && (c = !0, l = 3));
      if (u.length > 0)
        if (t.length > 0) {
          if (u.toLowerCase() !== t.toLowerCase())
            continue;
        } else
          t = u;
      if (n) {
        if (t.length > 0)
          break;
      } else if (r = `${s.slice(l)}\\${r}`, n = c, c && t.length > 0)
        break;
    }
    return r = Ut(r, !n, "\\", j), n ? `${t}\\${r}` : `${t}${r}` || ".";
  },
  normalize(e) {
    J(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let r = 0, n, i = !1;
    const s = e.charCodeAt(0);
    if (t === 1)
      return wr(s) ? "\\" : e;
    if (j(s))
      if (i = !0, j(e.charCodeAt(1))) {
        let l = 2, u = l;
        for (; l < t && !j(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== u) {
          const c = e.slice(u, l);
          for (u = l; l < t && j(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== u) {
            for (u = l; l < t && !j(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return `\\\\${c}\\${e.slice(u)}\\`;
            l !== u && (n = `\\\\${c}\\${e.slice(u, l)}`, r = l);
          }
        }
      } else
        r = 1;
    else
      Pe(s) && e.charCodeAt(1) === Me && (n = e.slice(0, 2), r = 2, t > 2 && j(e.charCodeAt(2)) && (i = !0, r = 3));
    let o = r < t ? Ut(e.slice(r), !i, "\\", j) : "";
    return o.length === 0 && !i && (o = "."), o.length > 0 && j(e.charCodeAt(t - 1)) && (o += "\\"), n === void 0 ? i ? `\\${o}` : o : i ? `${n}\\${o}` : `${n}${o}`;
  },
  isAbsolute(e) {
    J(e, "path");
    const t = e.length;
    if (t === 0)
      return !1;
    const r = e.charCodeAt(0);
    return j(r) || // Possible device root
    t > 2 && Pe(r) && e.charCodeAt(1) === Me && j(e.charCodeAt(2));
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t, r;
    for (let s = 0; s < e.length; ++s) {
      const o = e[s];
      J(o, "path"), o.length > 0 && (t === void 0 ? t = r = o : t += `\\${o}`);
    }
    if (t === void 0)
      return ".";
    let n = !0, i = 0;
    if (typeof r == "string" && j(r.charCodeAt(0))) {
      ++i;
      const s = r.length;
      s > 1 && j(r.charCodeAt(1)) && (++i, s > 2 && (j(r.charCodeAt(2)) ? ++i : n = !1));
    }
    if (n) {
      for (; i < t.length && j(t.charCodeAt(i)); )
        i++;
      i >= 2 && (t = `\\${t.slice(i)}`);
    }
    return ae.normalize(t);
  },
  // It will solve the relative path from `from` to `to`, for instance:
  //  from = 'C:\\orandea\\test\\aaa'
  //  to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  relative(e, t) {
    if (J(e, "from"), J(t, "to"), e === t)
      return "";
    const r = ae.resolve(e), n = ae.resolve(t);
    if (r === n || (e = r.toLowerCase(), t = n.toLowerCase(), e === t))
      return "";
    let i = 0;
    for (; i < e.length && e.charCodeAt(i) === se; )
      i++;
    let s = e.length;
    for (; s - 1 > i && e.charCodeAt(s - 1) === se; )
      s--;
    const o = s - i;
    let l = 0;
    for (; l < t.length && t.charCodeAt(l) === se; )
      l++;
    let u = t.length;
    for (; u - 1 > l && t.charCodeAt(u - 1) === se; )
      u--;
    const c = u - l, h = o < c ? o : c;
    let f = -1, d = 0;
    for (; d < h; d++) {
      const v = e.charCodeAt(i + d);
      if (v !== t.charCodeAt(l + d))
        break;
      v === se && (f = d);
    }
    if (d !== h) {
      if (f === -1)
        return n;
    } else {
      if (c > h) {
        if (t.charCodeAt(l + d) === se)
          return n.slice(l + d + 1);
        if (d === 2)
          return n.slice(l + d);
      }
      o > h && (e.charCodeAt(i + d) === se ? f = d : d === 2 && (f = 3)), f === -1 && (f = 0);
    }
    let m = "";
    for (d = i + f + 1; d <= s; ++d)
      (d === s || e.charCodeAt(d) === se) && (m += m.length === 0 ? ".." : "\\..");
    return l += f, m.length > 0 ? `${m}${n.slice(l, u)}` : (n.charCodeAt(l) === se && ++l, n.slice(l, u));
  },
  toNamespacedPath(e) {
    if (typeof e != "string")
      return e;
    if (e.length === 0)
      return "";
    const t = ae.resolve(e);
    if (t.length <= 2)
      return e;
    if (t.charCodeAt(0) === se) {
      if (t.charCodeAt(1) === se) {
        const r = t.charCodeAt(2);
        if (r !== _s && r !== Oe)
          return `\\\\?\\UNC\\${t.slice(2)}`;
      }
    } else if (Pe(t.charCodeAt(0)) && t.charCodeAt(1) === Me && t.charCodeAt(2) === se)
      return `\\\\?\\${t}`;
    return e;
  },
  dirname(e) {
    J(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let r = -1, n = 0;
    const i = e.charCodeAt(0);
    if (t === 1)
      return j(i) ? e : ".";
    if (j(i)) {
      if (r = n = 1, j(e.charCodeAt(1))) {
        let l = 2, u = l;
        for (; l < t && !j(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== u) {
          for (u = l; l < t && j(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== u) {
            for (u = l; l < t && !j(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return e;
            l !== u && (r = n = l + 1);
          }
        }
      }
    } else
      Pe(i) && e.charCodeAt(1) === Me && (r = t > 2 && j(e.charCodeAt(2)) ? 3 : 2, n = r);
    let s = -1, o = !0;
    for (let l = t - 1; l >= n; --l)
      if (j(e.charCodeAt(l))) {
        if (!o) {
          s = l;
          break;
        }
      } else
        o = !1;
    if (s === -1) {
      if (r === -1)
        return ".";
      s = r;
    }
    return e.slice(0, s);
  },
  basename(e, t) {
    t !== void 0 && J(t, "ext"), J(e, "path");
    let r = 0, n = -1, i = !0, s;
    if (e.length >= 2 && Pe(e.charCodeAt(0)) && e.charCodeAt(1) === Me && (r = 2), t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let o = t.length - 1, l = -1;
      for (s = e.length - 1; s >= r; --s) {
        const u = e.charCodeAt(s);
        if (j(u)) {
          if (!i) {
            r = s + 1;
            break;
          }
        } else
          l === -1 && (i = !1, l = s + 1), o >= 0 && (u === t.charCodeAt(o) ? --o === -1 && (n = s) : (o = -1, n = l));
      }
      return r === n ? n = l : n === -1 && (n = e.length), e.slice(r, n);
    }
    for (s = e.length - 1; s >= r; --s)
      if (j(e.charCodeAt(s))) {
        if (!i) {
          r = s + 1;
          break;
        }
      } else
        n === -1 && (i = !1, n = s + 1);
    return n === -1 ? "" : e.slice(r, n);
  },
  extname(e) {
    J(e, "path");
    let t = 0, r = -1, n = 0, i = -1, s = !0, o = 0;
    e.length >= 2 && e.charCodeAt(1) === Me && Pe(e.charCodeAt(0)) && (t = n = 2);
    for (let l = e.length - 1; l >= t; --l) {
      const u = e.charCodeAt(l);
      if (j(u)) {
        if (!s) {
          n = l + 1;
          break;
        }
        continue;
      }
      i === -1 && (s = !1, i = l + 1), u === Oe ? r === -1 ? r = l : o !== 1 && (o = 1) : r !== -1 && (o = -1);
    }
    return r === -1 || i === -1 || // We saw a non-dot character immediately before the dot
    o === 0 || // The (right-most) trimmed path component is exactly '..'
    o === 1 && r === i - 1 && r === n + 1 ? "" : e.slice(r, i);
  },
  format: na.bind(null, "\\"),
  parse(e) {
    J(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const r = e.length;
    let n = 0, i = e.charCodeAt(0);
    if (r === 1)
      return j(i) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
    if (j(i)) {
      if (n = 1, j(e.charCodeAt(1))) {
        let f = 2, d = f;
        for (; f < r && !j(e.charCodeAt(f)); )
          f++;
        if (f < r && f !== d) {
          for (d = f; f < r && j(e.charCodeAt(f)); )
            f++;
          if (f < r && f !== d) {
            for (d = f; f < r && !j(e.charCodeAt(f)); )
              f++;
            f === r ? n = f : f !== d && (n = f + 1);
          }
        }
      }
    } else if (Pe(i) && e.charCodeAt(1) === Me) {
      if (r <= 2)
        return t.root = t.dir = e, t;
      if (n = 2, j(e.charCodeAt(2))) {
        if (r === 3)
          return t.root = t.dir = e, t;
        n = 3;
      }
    }
    n > 0 && (t.root = e.slice(0, n));
    let s = -1, o = n, l = -1, u = !0, c = e.length - 1, h = 0;
    for (; c >= n; --c) {
      if (i = e.charCodeAt(c), j(i)) {
        if (!u) {
          o = c + 1;
          break;
        }
        continue;
      }
      l === -1 && (u = !1, l = c + 1), i === Oe ? s === -1 ? s = c : h !== 1 && (h = 1) : s !== -1 && (h = -1);
    }
    return l !== -1 && (s === -1 || // We saw a non-dot character immediately before the dot
    h === 0 || // The (right-most) trimmed path component is exactly '..'
    h === 1 && s === l - 1 && s === o + 1 ? t.base = t.name = e.slice(o, l) : (t.name = e.slice(o, s), t.base = e.slice(o, l), t.ext = e.slice(s, l))), o > 0 && o !== n ? t.dir = e.slice(0, o - 1) : t.dir = t.root, t;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
}, ue = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", r = !1;
    for (let n = e.length - 1; n >= -1 && !r; n--) {
      const i = n >= 0 ? e[n] : br();
      J(i, "path"), i.length !== 0 && (t = `${i}/${t}`, r = i.charCodeAt(0) === K);
    }
    return t = Ut(t, !r, "/", wr), r ? `/${t}` : t.length > 0 ? t : ".";
  },
  normalize(e) {
    if (J(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === K, r = e.charCodeAt(e.length - 1) === K;
    return e = Ut(e, !t, "/", wr), e.length === 0 ? t ? "/" : r ? "./" : "." : (r && (e += "/"), t ? `/${e}` : e);
  },
  isAbsolute(e) {
    return J(e, "path"), e.length > 0 && e.charCodeAt(0) === K;
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t;
    for (let r = 0; r < e.length; ++r) {
      const n = e[r];
      J(n, "path"), n.length > 0 && (t === void 0 ? t = n : t += `/${n}`);
    }
    return t === void 0 ? "." : ue.normalize(t);
  },
  relative(e, t) {
    if (J(e, "from"), J(t, "to"), e === t || (e = ue.resolve(e), t = ue.resolve(t), e === t))
      return "";
    const r = 1, n = e.length, i = n - r, s = 1, o = t.length - s, l = i < o ? i : o;
    let u = -1, c = 0;
    for (; c < l; c++) {
      const f = e.charCodeAt(r + c);
      if (f !== t.charCodeAt(s + c))
        break;
      f === K && (u = c);
    }
    if (c === l)
      if (o > l) {
        if (t.charCodeAt(s + c) === K)
          return t.slice(s + c + 1);
        if (c === 0)
          return t.slice(s + c);
      } else
        i > l && (e.charCodeAt(r + c) === K ? u = c : c === 0 && (u = 0));
    let h = "";
    for (c = r + u + 1; c <= n; ++c)
      (c === n || e.charCodeAt(c) === K) && (h += h.length === 0 ? ".." : "/..");
    return `${h}${t.slice(s + u)}`;
  },
  toNamespacedPath(e) {
    return e;
  },
  dirname(e) {
    if (J(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === K;
    let r = -1, n = !0;
    for (let i = e.length - 1; i >= 1; --i)
      if (e.charCodeAt(i) === K) {
        if (!n) {
          r = i;
          break;
        }
      } else
        n = !1;
    return r === -1 ? t ? "/" : "." : t && r === 1 ? "//" : e.slice(0, r);
  },
  basename(e, t) {
    t !== void 0 && J(t, "ext"), J(e, "path");
    let r = 0, n = -1, i = !0, s;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let o = t.length - 1, l = -1;
      for (s = e.length - 1; s >= 0; --s) {
        const u = e.charCodeAt(s);
        if (u === K) {
          if (!i) {
            r = s + 1;
            break;
          }
        } else
          l === -1 && (i = !1, l = s + 1), o >= 0 && (u === t.charCodeAt(o) ? --o === -1 && (n = s) : (o = -1, n = l));
      }
      return r === n ? n = l : n === -1 && (n = e.length), e.slice(r, n);
    }
    for (s = e.length - 1; s >= 0; --s)
      if (e.charCodeAt(s) === K) {
        if (!i) {
          r = s + 1;
          break;
        }
      } else
        n === -1 && (i = !1, n = s + 1);
    return n === -1 ? "" : e.slice(r, n);
  },
  extname(e) {
    J(e, "path");
    let t = -1, r = 0, n = -1, i = !0, s = 0;
    for (let o = e.length - 1; o >= 0; --o) {
      const l = e.charCodeAt(o);
      if (l === K) {
        if (!i) {
          r = o + 1;
          break;
        }
        continue;
      }
      n === -1 && (i = !1, n = o + 1), l === Oe ? t === -1 ? t = o : s !== 1 && (s = 1) : t !== -1 && (s = -1);
    }
    return t === -1 || n === -1 || // We saw a non-dot character immediately before the dot
    s === 0 || // The (right-most) trimmed path component is exactly '..'
    s === 1 && t === n - 1 && t === r + 1 ? "" : e.slice(t, n);
  },
  format: na.bind(null, "/"),
  parse(e) {
    J(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const r = e.charCodeAt(0) === K;
    let n;
    r ? (t.root = "/", n = 1) : n = 0;
    let i = -1, s = 0, o = -1, l = !0, u = e.length - 1, c = 0;
    for (; u >= n; --u) {
      const h = e.charCodeAt(u);
      if (h === K) {
        if (!l) {
          s = u + 1;
          break;
        }
        continue;
      }
      o === -1 && (l = !1, o = u + 1), h === Oe ? i === -1 ? i = u : c !== 1 && (c = 1) : i !== -1 && (c = -1);
    }
    if (o !== -1) {
      const h = s === 0 && r ? 1 : s;
      i === -1 || // We saw a non-dot character immediately before the dot
      c === 0 || // The (right-most) trimmed path component is exactly '..'
      c === 1 && i === o - 1 && i === s + 1 ? t.base = t.name = e.slice(h, o) : (t.name = e.slice(h, i), t.base = e.slice(h, o), t.ext = e.slice(i, o));
    }
    return s > 0 ? t.dir = e.slice(0, s - 1) : r && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
ue.win32 = ae.win32 = ae;
ue.posix = ae.posix = ue;
ze === "win32" ? ae.normalize : ue.normalize;
ze === "win32" ? ae.resolve : ue.resolve;
ze === "win32" ? ae.relative : ue.relative;
ze === "win32" ? ae.dirname : ue.dirname;
ze === "win32" ? ae.basename : ue.basename;
ze === "win32" ? ae.extname : ue.extname;
ze === "win32" ? ae.sep : ue.sep;
const Ss = /^\w[\w\d+.-]*$/, As = /^\//, Ns = /^\/\//;
function cn(e, t) {
  if (!e.scheme && t)
    throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
  if (e.scheme && !Ss.test(e.scheme))
    throw new Error("[UriError]: Scheme contains illegal characters.");
  if (e.path) {
    if (e.authority) {
      if (!As.test(e.path))
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
    } else if (Ns.test(e.path))
      throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
  }
}
function Ls(e, t) {
  return !e && !t ? "file" : e;
}
function ks(e, t) {
  switch (e) {
    case "https":
    case "http":
    case "file":
      t ? t[0] !== pe && (t = pe + t) : t = pe;
      break;
  }
  return t;
}
const G = "", pe = "/", xs = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
let Jr = class Ft {
  /**
   * @internal
   */
  constructor(t, r, n, i, s, o = !1) {
    typeof t == "object" ? (this.scheme = t.scheme || G, this.authority = t.authority || G, this.path = t.path || G, this.query = t.query || G, this.fragment = t.fragment || G) : (this.scheme = Ls(t, o), this.authority = r || G, this.path = ks(this.scheme, n || G), this.query = i || G, this.fragment = s || G, cn(this, o));
  }
  static isUri(t) {
    return t instanceof Ft ? !0 : t ? typeof t.authority == "string" && typeof t.fragment == "string" && typeof t.path == "string" && typeof t.query == "string" && typeof t.scheme == "string" && typeof t.fsPath == "string" && typeof t.with == "function" && typeof t.toString == "function" : !1;
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
    return yr(this, !1);
  }
  // ---- modify to new -------------------------
  with(t) {
    if (!t)
      return this;
    let { scheme: r, authority: n, path: i, query: s, fragment: o } = t;
    return r === void 0 ? r = this.scheme : r === null && (r = G), n === void 0 ? n = this.authority : n === null && (n = G), i === void 0 ? i = this.path : i === null && (i = G), s === void 0 ? s = this.query : s === null && (s = G), o === void 0 ? o = this.fragment : o === null && (o = G), r === this.scheme && n === this.authority && i === this.path && s === this.query && o === this.fragment ? this : new Ye(r, n, i, s, o);
  }
  // ---- parse & validate ------------------------
  /**
   * Creates a new URI from a string, e.g. `http://www.example.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
  static parse(t, r = !1) {
    const n = xs.exec(t);
    return n ? new Ye(n[2] || G, Lt(n[4] || G), Lt(n[5] || G), Lt(n[7] || G), Lt(n[9] || G), r) : new Ye(G, G, G, G, G);
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
    let r = G;
    if (gt && (t = t.replace(/\\/g, pe)), t[0] === pe && t[1] === pe) {
      const n = t.indexOf(pe, 2);
      n === -1 ? (r = t.substring(2), t = pe) : (r = t.substring(2, n), t = t.substring(n) || pe);
    }
    return new Ye("file", r, t, G, G);
  }
  static from(t) {
    const r = new Ye(t.scheme, t.authority, t.path, t.query, t.fragment);
    return cn(r, !0), r;
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
    let n;
    return gt && t.scheme === "file" ? n = Ft.file(ae.join(yr(t, !0), ...r)).path : n = ue.join(t.path, ...r), t.with({ path: n });
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
    return Cr(this, t);
  }
  toJSON() {
    return this;
  }
  static revive(t) {
    if (t) {
      if (t instanceof Ft)
        return t;
      {
        const r = new Ye(t);
        return r._formatted = t.external, r._fsPath = t._sep === ia ? t.fsPath : null, r;
      }
    } else
      return t;
  }
};
const ia = gt ? 1 : void 0;
class Ye extends Jr {
  constructor() {
    super(...arguments), this._formatted = null, this._fsPath = null;
  }
  get fsPath() {
    return this._fsPath || (this._fsPath = yr(this, !1)), this._fsPath;
  }
  toString(t = !1) {
    return t ? Cr(this, !0) : (this._formatted || (this._formatted = Cr(this, !1)), this._formatted);
  }
  toJSON() {
    const t = {
      $mid: 1
      /* MarshalledId.Uri */
    };
    return this._fsPath && (t.fsPath = this._fsPath, t._sep = ia), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
  }
}
const aa = {
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
function fn(e, t) {
  let r, n = -1;
  for (let i = 0; i < e.length; i++) {
    const s = e.charCodeAt(i);
    if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || s === 45 || s === 46 || s === 95 || s === 126 || t && s === 47)
      n !== -1 && (r += encodeURIComponent(e.substring(n, i)), n = -1), r !== void 0 && (r += e.charAt(i));
    else {
      r === void 0 && (r = e.substr(0, i));
      const o = aa[s];
      o !== void 0 ? (n !== -1 && (r += encodeURIComponent(e.substring(n, i)), n = -1), r += o) : n === -1 && (n = i);
    }
  }
  return n !== -1 && (r += encodeURIComponent(e.substring(n))), r !== void 0 ? r : e;
}
function Ms(e) {
  let t;
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r);
    n === 35 || n === 63 ? (t === void 0 && (t = e.substr(0, r)), t += aa[n]) : t !== void 0 && (t += e[r]);
  }
  return t !== void 0 ? t : e;
}
function yr(e, t) {
  let r;
  return e.authority && e.path.length > 1 && e.scheme === "file" ? r = `//${e.authority}${e.path}` : e.path.charCodeAt(0) === 47 && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && e.path.charCodeAt(2) === 58 ? t ? r = e.path.substr(1) : r = e.path[1].toLowerCase() + e.path.substr(2) : r = e.path, gt && (r = r.replace(/\//g, "\\")), r;
}
function Cr(e, t) {
  const r = t ? Ms : fn;
  let n = "", { scheme: i, authority: s, path: o, query: l, fragment: u } = e;
  if (i && (n += i, n += ":"), (s || i === "file") && (n += pe, n += pe), s) {
    let c = s.indexOf("@");
    if (c !== -1) {
      const h = s.substr(0, c);
      s = s.substr(c + 1), c = h.indexOf(":"), c === -1 ? n += r(h, !1) : (n += r(h.substr(0, c), !1), n += ":", n += r(h.substr(c + 1), !1)), n += "@";
    }
    s = s.toLowerCase(), c = s.indexOf(":"), c === -1 ? n += r(s, !1) : (n += r(s.substr(0, c), !1), n += s.substr(c));
  }
  if (o) {
    if (o.length >= 3 && o.charCodeAt(0) === 47 && o.charCodeAt(2) === 58) {
      const c = o.charCodeAt(1);
      c >= 65 && c <= 90 && (o = `/${String.fromCharCode(c + 32)}:${o.substr(3)}`);
    } else if (o.length >= 2 && o.charCodeAt(1) === 58) {
      const c = o.charCodeAt(0);
      c >= 65 && c <= 90 && (o = `${String.fromCharCode(c + 32)}:${o.substr(2)}`);
    }
    n += r(o, !0);
  }
  return l && (n += "?", n += r(l, !1)), u && (n += "#", n += t ? u : fn(u, !1)), n;
}
function sa(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e.length > 3 ? e.substr(0, 3) + sa(e.substr(3)) : e;
  }
}
const hn = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function Lt(e) {
  return e.match(hn) ? e.replace(hn, (t) => sa(t)) : e;
}
let He = class je {
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
    return t === this.lineNumber && r === this.column ? this : new je(t, r);
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
    return je.equals(this, t);
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
    return je.isBefore(this, t);
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
    return je.isBeforeOrEqual(this, t);
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
    const n = t.lineNumber | 0, i = r.lineNumber | 0;
    if (n === i) {
      const s = t.column | 0, o = r.column | 0;
      return s - o;
    }
    return n - i;
  }
  /**
   * Clone this position.
   */
  clone() {
    return new je(this.lineNumber, this.column);
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
    return new je(t.lineNumber, t.column);
  }
  /**
   * Test if `obj` is an `IPosition`.
   */
  static isIPosition(t) {
    return t && typeof t.lineNumber == "number" && typeof t.column == "number";
  }
}, Be = class Y {
  constructor(t, r, n, i) {
    t > n || t === n && r > i ? (this.startLineNumber = n, this.startColumn = i, this.endLineNumber = t, this.endColumn = r) : (this.startLineNumber = t, this.startColumn = r, this.endLineNumber = n, this.endColumn = i);
  }
  /**
   * Test if this range is empty.
   */
  isEmpty() {
    return Y.isEmpty(this);
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
    return Y.containsPosition(this, t);
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
    return Y.containsRange(this, t);
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
    return Y.strictContainsRange(this, t);
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
    return Y.plusRange(this, t);
  }
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */
  static plusRange(t, r) {
    let n, i, s, o;
    return r.startLineNumber < t.startLineNumber ? (n = r.startLineNumber, i = r.startColumn) : r.startLineNumber === t.startLineNumber ? (n = r.startLineNumber, i = Math.min(r.startColumn, t.startColumn)) : (n = t.startLineNumber, i = t.startColumn), r.endLineNumber > t.endLineNumber ? (s = r.endLineNumber, o = r.endColumn) : r.endLineNumber === t.endLineNumber ? (s = r.endLineNumber, o = Math.max(r.endColumn, t.endColumn)) : (s = t.endLineNumber, o = t.endColumn), new Y(n, i, s, o);
  }
  /**
   * A intersection of the two ranges.
   */
  intersectRanges(t) {
    return Y.intersectRanges(this, t);
  }
  /**
   * A intersection of the two ranges.
   */
  static intersectRanges(t, r) {
    let n = t.startLineNumber, i = t.startColumn, s = t.endLineNumber, o = t.endColumn;
    const l = r.startLineNumber, u = r.startColumn, c = r.endLineNumber, h = r.endColumn;
    return n < l ? (n = l, i = u) : n === l && (i = Math.max(i, u)), s > c ? (s = c, o = h) : s === c && (o = Math.min(o, h)), n > s || n === s && i > o ? null : new Y(n, i, s, o);
  }
  /**
   * Test if this range equals other.
   */
  equalsRange(t) {
    return Y.equalsRange(this, t);
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
    return Y.getEndPosition(this);
  }
  /**
   * Return the end position (which will be after or equal to the start position)
   */
  static getEndPosition(t) {
    return new He(t.endLineNumber, t.endColumn);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  getStartPosition() {
    return Y.getStartPosition(this);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  static getStartPosition(t) {
    return new He(t.startLineNumber, t.startColumn);
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
    return new Y(this.startLineNumber, this.startColumn, t, r);
  }
  /**
   * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
   */
  setStartPosition(t, r) {
    return new Y(t, r, this.endLineNumber, this.endColumn);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  collapseToStart() {
    return Y.collapseToStart(this);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  static collapseToStart(t) {
    return new Y(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
  }
  // ---
  static fromPositions(t, r = t) {
    return new Y(t.lineNumber, t.column, r.lineNumber, r.column);
  }
  static lift(t) {
    return t ? new Y(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
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
      const s = t.startLineNumber | 0, o = r.startLineNumber | 0;
      if (s === o) {
        const l = t.startColumn | 0, u = r.startColumn | 0;
        if (l === u) {
          const c = t.endLineNumber | 0, h = r.endLineNumber | 0;
          if (c === h) {
            const f = t.endColumn | 0, d = r.endColumn | 0;
            return f - d;
          }
          return c - h;
        }
        return l - u;
      }
      return s - o;
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
};
const Ps = 3;
function oa(e, t, r, n) {
  return new Re(e, t, r).ComputeDiff(n);
}
class dn {
  constructor(t) {
    const r = [], n = [];
    for (let i = 0, s = t.length; i < s; i++)
      r[i] = _r(t[i], 1), n[i] = Sr(t[i], 1);
    this.lines = t, this._startColumns = r, this._endColumns = n;
  }
  getElements() {
    const t = [];
    for (let r = 0, n = this.lines.length; r < n; r++)
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
  createCharSequence(t, r, n) {
    const i = [], s = [], o = [];
    let l = 0;
    for (let u = r; u <= n; u++) {
      const c = this.lines[u], h = t ? this._startColumns[u] : 1, f = t ? this._endColumns[u] : c.length + 1;
      for (let d = h; d < f; d++)
        i[l] = c.charCodeAt(d - 1), s[l] = u + 1, o[l] = d, l++;
      !t && u < n && (i[l] = 10, s[l] = u + 1, o[l] = c.length + 1, l++);
    }
    return new Ts(i, s, o);
  }
}
class Ts {
  constructor(t, r, n) {
    this._charCodes = t, this._lineNumbers = r, this._columns = n;
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
class pt {
  constructor(t, r, n, i, s, o, l, u) {
    this.originalStartLineNumber = t, this.originalStartColumn = r, this.originalEndLineNumber = n, this.originalEndColumn = i, this.modifiedStartLineNumber = s, this.modifiedStartColumn = o, this.modifiedEndLineNumber = l, this.modifiedEndColumn = u;
  }
  static createFromDiffChange(t, r, n) {
    const i = r.getStartLineNumber(t.originalStart), s = r.getStartColumn(t.originalStart), o = r.getEndLineNumber(t.originalStart + t.originalLength - 1), l = r.getEndColumn(t.originalStart + t.originalLength - 1), u = n.getStartLineNumber(t.modifiedStart), c = n.getStartColumn(t.modifiedStart), h = n.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), f = n.getEndColumn(t.modifiedStart + t.modifiedLength - 1);
    return new pt(i, s, o, l, u, c, h, f);
  }
}
function Es(e) {
  if (e.length <= 1)
    return e;
  const t = [e[0]];
  let r = t[0];
  for (let n = 1, i = e.length; n < i; n++) {
    const s = e[n], o = s.originalStart - (r.originalStart + r.originalLength), l = s.modifiedStart - (r.modifiedStart + r.modifiedLength);
    Math.min(o, l) < Ps ? (r.originalLength = s.originalStart + s.originalLength - r.originalStart, r.modifiedLength = s.modifiedStart + s.modifiedLength - r.modifiedStart) : (t.push(s), r = s);
  }
  return t;
}
class ht {
  constructor(t, r, n, i, s) {
    this.originalStartLineNumber = t, this.originalEndLineNumber = r, this.modifiedStartLineNumber = n, this.modifiedEndLineNumber = i, this.charChanges = s;
  }
  static createFromDiffResult(t, r, n, i, s, o, l) {
    let u, c, h, f, d;
    if (r.originalLength === 0 ? (u = n.getStartLineNumber(r.originalStart) - 1, c = 0) : (u = n.getStartLineNumber(r.originalStart), c = n.getEndLineNumber(r.originalStart + r.originalLength - 1)), r.modifiedLength === 0 ? (h = i.getStartLineNumber(r.modifiedStart) - 1, f = 0) : (h = i.getStartLineNumber(r.modifiedStart), f = i.getEndLineNumber(r.modifiedStart + r.modifiedLength - 1)), o && r.originalLength > 0 && r.originalLength < 20 && r.modifiedLength > 0 && r.modifiedLength < 20 && s()) {
      const m = n.createCharSequence(t, r.originalStart, r.originalStart + r.originalLength - 1), v = i.createCharSequence(t, r.modifiedStart, r.modifiedStart + r.modifiedLength - 1);
      if (m.getElements().length > 0 && v.getElements().length > 0) {
        let p = oa(m, v, s, !0).changes;
        l && (p = Es(p)), d = [];
        for (let g = 0, A = p.length; g < A; g++)
          d.push(pt.createFromDiffChange(p[g], m, v));
      }
    }
    return new ht(u, c, h, f, d);
  }
}
class Fs {
  constructor(t, r, n) {
    this.shouldComputeCharChanges = n.shouldComputeCharChanges, this.shouldPostProcessCharChanges = n.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = n.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = n.shouldMakePrettyDiff, this.originalLines = t, this.modifiedLines = r, this.original = new dn(t), this.modified = new dn(r), this.continueLineDiff = mn(n.maxComputationTime), this.continueCharDiff = mn(n.maxComputationTime === 0 ? 0 : Math.min(n.maxComputationTime, 5e3));
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
    const t = oa(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), r = t.changes, n = t.quitEarly;
    if (this.shouldIgnoreTrimWhitespace) {
      const l = [];
      for (let u = 0, c = r.length; u < c; u++)
        l.push(ht.createFromDiffResult(this.shouldIgnoreTrimWhitespace, r[u], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      return {
        quitEarly: n,
        changes: l
      };
    }
    const i = [];
    let s = 0, o = 0;
    for (let l = -1, u = r.length; l < u; l++) {
      const c = l + 1 < u ? r[l + 1] : null, h = c ? c.originalStart : this.originalLines.length, f = c ? c.modifiedStart : this.modifiedLines.length;
      for (; s < h && o < f; ) {
        const d = this.originalLines[s], m = this.modifiedLines[o];
        if (d !== m) {
          {
            let v = _r(d, 1), p = _r(m, 1);
            for (; v > 1 && p > 1; ) {
              const g = d.charCodeAt(v - 2), A = m.charCodeAt(p - 2);
              if (g !== A)
                break;
              v--, p--;
            }
            (v > 1 || p > 1) && this._pushTrimWhitespaceCharChange(i, s + 1, 1, v, o + 1, 1, p);
          }
          {
            let v = Sr(d, 1), p = Sr(m, 1);
            const g = d.length + 1, A = m.length + 1;
            for (; v < g && p < A; ) {
              const S = d.charCodeAt(v - 1), C = d.charCodeAt(p - 1);
              if (S !== C)
                break;
              v++, p++;
            }
            (v < g || p < A) && this._pushTrimWhitespaceCharChange(i, s + 1, v, g, o + 1, p, A);
          }
        }
        s++, o++;
      }
      c && (i.push(ht.createFromDiffResult(this.shouldIgnoreTrimWhitespace, c, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), s += c.originalLength, o += c.modifiedLength);
    }
    return {
      quitEarly: n,
      changes: i
    };
  }
  _pushTrimWhitespaceCharChange(t, r, n, i, s, o, l) {
    if (this._mergeTrimWhitespaceCharChange(t, r, n, i, s, o, l))
      return;
    let u;
    this.shouldComputeCharChanges && (u = [new pt(r, n, r, i, s, o, s, l)]), t.push(new ht(r, r, s, s, u));
  }
  _mergeTrimWhitespaceCharChange(t, r, n, i, s, o, l) {
    const u = t.length;
    if (u === 0)
      return !1;
    const c = t[u - 1];
    return c.originalEndLineNumber === 0 || c.modifiedEndLineNumber === 0 ? !1 : c.originalEndLineNumber + 1 === r && c.modifiedEndLineNumber + 1 === s ? (c.originalEndLineNumber = r, c.modifiedEndLineNumber = s, this.shouldComputeCharChanges && c.charChanges && c.charChanges.push(new pt(r, n, r, i, s, o, s, l)), !0) : !1;
  }
}
function _r(e, t) {
  const r = es(e);
  return r === -1 ? t : r + 1;
}
function Sr(e, t) {
  const r = ts(e);
  return r === -1 ? t : r + 2;
}
function mn(e) {
  if (e === 0)
    return () => !0;
  const t = Date.now();
  return () => Date.now() - t < e;
}
var gn;
(function(e) {
  function t(i) {
    return i < 0;
  }
  e.isLessThan = t;
  function r(i) {
    return i > 0;
  }
  e.isGreaterThan = r;
  function n(i) {
    return i === 0;
  }
  e.isNeitherLessOrGreaterThan = n, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
})(gn || (gn = {}));
function pn(e) {
  return e < 0 ? 0 : e > 255 ? 255 : e | 0;
}
function Ke(e) {
  return e < 0 ? 0 : e > 4294967295 ? 4294967295 : e | 0;
}
class Vs {
  constructor(t) {
    this.values = t, this.prefixSum = new Uint32Array(t.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
  }
  insertValues(t, r) {
    t = Ke(t);
    const n = this.values, i = this.prefixSum, s = r.length;
    return s === 0 ? !1 : (this.values = new Uint32Array(n.length + s), this.values.set(n.subarray(0, t), 0), this.values.set(n.subarray(t), t + s), this.values.set(r, t), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  setValue(t, r) {
    return t = Ke(t), r = Ke(r), this.values[t] === r ? !1 : (this.values[t] = r, t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), !0);
  }
  removeValues(t, r) {
    t = Ke(t), r = Ke(r);
    const n = this.values, i = this.prefixSum;
    if (t >= n.length)
      return !1;
    const s = n.length - t;
    return r >= s && (r = s), r === 0 ? !1 : (this.values = new Uint32Array(n.length - r), this.values.set(n.subarray(0, t), 0), this.values.set(n.subarray(t + r), t), this.prefixSum = new Uint32Array(this.values.length), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  getTotalSum() {
    return this.values.length === 0 ? 0 : this._getPrefixSum(this.values.length - 1);
  }
  /**
   * Returns the sum of the first `index + 1` many items.
   * @returns `SUM(0 <= j <= index, values[j])`.
   */
  getPrefixSum(t) {
    return t < 0 ? 0 : (t = Ke(t), this._getPrefixSum(t));
  }
  _getPrefixSum(t) {
    if (t <= this.prefixSumValidIndex[0])
      return this.prefixSum[t];
    let r = this.prefixSumValidIndex[0] + 1;
    r === 0 && (this.prefixSum[0] = this.values[0], r++), t >= this.values.length && (t = this.values.length - 1);
    for (let n = r; n <= t; n++)
      this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
    return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], t), this.prefixSum[t];
  }
  getIndexOf(t) {
    t = Math.floor(t), this.getTotalSum();
    let r = 0, n = this.values.length - 1, i = 0, s = 0, o = 0;
    for (; r <= n; )
      if (i = r + (n - r) / 2 | 0, s = this.prefixSum[i], o = s - this.values[i], t < o)
        n = i - 1;
      else if (t >= s)
        r = i + 1;
      else
        break;
    return new Is(i, t - o);
  }
}
class Is {
  constructor(t, r) {
    this.index = t, this.remainder = r, this._prefixSumIndexOfResultBrand = void 0, this.index = t, this.remainder = r;
  }
}
class Rs {
  constructor(t, r, n, i) {
    this._uri = t, this._lines = r, this._eol = n, this._versionId = i, this._lineStarts = null, this._cachedTextValue = null;
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
    for (const n of r)
      this._acceptDeleteRange(n.range), this._acceptInsertText(new He(n.range.startLineNumber, n.range.startColumn), n.text);
    this._versionId = t.versionId, this._cachedTextValue = null;
  }
  _ensureLineStarts() {
    if (!this._lineStarts) {
      const t = this._eol.length, r = this._lines.length, n = new Uint32Array(r);
      for (let i = 0; i < r; i++)
        n[i] = this._lines[i].length + t;
      this._lineStarts = new Vs(n);
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
    const n = Ka(r);
    if (n.length === 1) {
      this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + n[0] + this._lines[t.lineNumber - 1].substring(t.column - 1));
      return;
    }
    n[n.length - 1] += this._lines[t.lineNumber - 1].substring(t.column - 1), this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + n[0]);
    const i = new Uint32Array(n.length - 1);
    for (let s = 1; s < n.length; s++)
      this._lines.splice(t.lineNumber + s - 1, 0, n[s]), i[s - 1] = n[s].length + this._eol.length;
    this._lineStarts && this._lineStarts.insertValues(t.lineNumber, i);
  }
}
const Ds = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
function Os(e = "") {
  let t = "(-?\\d*\\.\\d\\w*)|([^";
  for (const r of Ds)
    e.indexOf(r) >= 0 || (t += "\\" + r);
  return t += "\\s]+)", new RegExp(t, "g");
}
const la = Os();
function Us(e) {
  let t = la;
  if (e && e instanceof RegExp)
    if (e.global)
      t = e;
    else {
      let r = "g";
      e.ignoreCase && (r += "i"), e.multiline && (r += "m"), e.unicode && (r += "u"), t = new RegExp(e.source, r);
    }
  return t.lastIndex = 0, t;
}
const ua = new Ot();
ua.unshift({
  maxLen: 1e3,
  windowSize: 15,
  timeBudget: 150
});
function Zr(e, t, r, n, i) {
  if (i || (i = Rt.first(ua)), r.length > i.maxLen) {
    let c = e - i.maxLen / 2;
    return c < 0 ? c = 0 : n += c, r = r.substring(c, e + i.maxLen / 2), Zr(e, t, r, n, i);
  }
  const s = Date.now(), o = e - 1 - n;
  let l = -1, u = null;
  for (let c = 1; !(Date.now() - s >= i.timeBudget); c++) {
    const h = o - i.windowSize * c;
    t.lastIndex = Math.max(0, h);
    const f = js(t, r, o, l);
    if (!f && u || (u = f, h <= 0))
      break;
    l = h;
  }
  if (u) {
    const c = {
      word: u[0],
      startColumn: n + 1 + u.index,
      endColumn: n + 1 + u.index + u[0].length
    };
    return t.lastIndex = 0, c;
  }
  return null;
}
function js(e, t, r, n) {
  let i;
  for (; i = e.exec(t); ) {
    const s = i.index || 0;
    if (s <= r && e.lastIndex >= r)
      return i;
    if (n > 0 && s > n)
      return null;
  }
  return null;
}
class Xr {
  constructor(t) {
    const r = pn(t);
    this._defaultValue = r, this._asciiMap = Xr._createAsciiMap(r), this._map = /* @__PURE__ */ new Map();
  }
  static _createAsciiMap(t) {
    const r = new Uint8Array(256);
    for (let n = 0; n < 256; n++)
      r[n] = t;
    return r;
  }
  set(t, r) {
    const n = pn(r);
    t >= 0 && t < 256 ? this._asciiMap[t] = n : this._map.set(t, n);
  }
  get(t) {
    return t >= 0 && t < 256 ? this._asciiMap[t] : this._map.get(t) || this._defaultValue;
  }
}
class Bs {
  constructor(t, r, n) {
    const i = new Uint8Array(t * r);
    for (let s = 0, o = t * r; s < o; s++)
      i[s] = n;
    this._data = i, this.rows = t, this.cols = r;
  }
  get(t, r) {
    return this._data[t * this.cols + r];
  }
  set(t, r, n) {
    this._data[t * this.cols + r] = n;
  }
}
class $s {
  constructor(t) {
    let r = 0, n = 0;
    for (let s = 0, o = t.length; s < o; s++) {
      const [l, u, c] = t[s];
      u > r && (r = u), l > n && (n = l), c > n && (n = c);
    }
    r++, n++;
    const i = new Bs(
      n,
      r,
      0
      /* State.Invalid */
    );
    for (let s = 0, o = t.length; s < o; s++) {
      const [l, u, c] = t[s];
      i.set(l, u, c);
    }
    this._states = i, this._maxCharCode = r;
  }
  nextState(t, r) {
    return r < 0 || r >= this._maxCharCode ? 0 : this._states.get(t, r);
  }
}
let ir = null;
function qs() {
  return ir === null && (ir = new $s([
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
  ])), ir;
}
let lt = null;
function Ws() {
  if (lt === null) {
    lt = new Xr(
      0
      /* CharacterClass.None */
    );
    const e = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…`;
    for (let r = 0; r < e.length; r++)
      lt.set(
        e.charCodeAt(r),
        1
        /* CharacterClass.ForceTermination */
      );
    const t = ".,;:";
    for (let r = 0; r < t.length; r++)
      lt.set(
        t.charCodeAt(r),
        2
        /* CharacterClass.CannotEndIn */
      );
  }
  return lt;
}
class jt {
  static _createLink(t, r, n, i, s) {
    let o = s - 1;
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
        startLineNumber: n,
        startColumn: i + 1,
        endLineNumber: n,
        endColumn: o + 2
      },
      url: r.substring(i, o + 1)
    };
  }
  static computeLinks(t, r = qs()) {
    const n = Ws(), i = [];
    for (let s = 1, o = t.getLineCount(); s <= o; s++) {
      const l = t.getLineContent(s), u = l.length;
      let c = 0, h = 0, f = 0, d = 1, m = !1, v = !1, p = !1, g = !1;
      for (; c < u; ) {
        let A = !1;
        const S = l.charCodeAt(c);
        if (d === 13) {
          let C;
          switch (S) {
            case 40:
              m = !0, C = 0;
              break;
            case 41:
              C = m ? 0 : 1;
              break;
            case 91:
              p = !0, v = !0, C = 0;
              break;
            case 93:
              p = !1, C = v ? 0 : 1;
              break;
            case 123:
              g = !0, C = 0;
              break;
            case 125:
              C = g ? 0 : 1;
              break;
            case 39:
              C = f === 39 ? 1 : 0;
              break;
            case 34:
              C = f === 34 ? 1 : 0;
              break;
            case 96:
              C = f === 96 ? 1 : 0;
              break;
            case 42:
              C = f === 42 ? 1 : 0;
              break;
            case 124:
              C = f === 124 ? 1 : 0;
              break;
            case 32:
              C = p ? 0 : 1;
              break;
            default:
              C = n.get(S);
          }
          C === 1 && (i.push(jt._createLink(n, l, s, h, c)), A = !0);
        } else if (d === 12) {
          let C;
          S === 91 ? (v = !0, C = 0) : C = n.get(S), C === 1 ? A = !0 : d = 13;
        } else
          d = r.nextState(d, S), d === 0 && (A = !0);
        A && (d = 1, m = !1, v = !1, g = !1, h = c + 1, f = S), c++;
      }
      d === 13 && i.push(jt._createLink(n, l, s, h, u));
    }
    return i;
  }
}
function Hs(e) {
  return !e || typeof e.getLineCount != "function" || typeof e.getLineContent != "function" ? [] : jt.computeLinks(e);
}
class Ar {
  constructor() {
    this._defaultValueSet = [
      ["true", "false"],
      ["True", "False"],
      ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
      ["public", "protected", "private"]
    ];
  }
  navigateValueSet(t, r, n, i, s) {
    if (t && r) {
      const o = this.doNavigateValueSet(r, s);
      if (o)
        return {
          range: t,
          value: o
        };
    }
    if (n && i) {
      const o = this.doNavigateValueSet(i, s);
      if (o)
        return {
          range: n,
          value: o
        };
    }
    return null;
  }
  doNavigateValueSet(t, r) {
    const n = this.numberReplace(t, r);
    return n !== null ? n : this.textReplace(t, r);
  }
  numberReplace(t, r) {
    const n = Math.pow(10, t.length - (t.lastIndexOf(".") + 1));
    let i = Number(t);
    const s = parseFloat(t);
    return !isNaN(i) && !isNaN(s) && i === s ? i === 0 && !r ? null : (i = Math.floor(i * n), i += r ? n : -n, String(i / n)) : null;
  }
  textReplace(t, r) {
    return this.valueSetsReplace(this._defaultValueSet, t, r);
  }
  valueSetsReplace(t, r, n) {
    let i = null;
    for (let s = 0, o = t.length; i === null && s < o; s++)
      i = this.valueSetReplace(t[s], r, n);
    return i;
  }
  valueSetReplace(t, r, n) {
    let i = t.indexOf(r);
    return i >= 0 ? (i += n ? 1 : -1, i < 0 ? i = t.length - 1 : i %= t.length, t[i]) : null;
  }
}
Ar.INSTANCE = new Ar();
const ca = Object.freeze(function(e, t) {
  const r = setTimeout(e.bind(t), 0);
  return { dispose() {
    clearTimeout(r);
  } };
});
var Bt;
(function(e) {
  function t(r) {
    return r === e.None || r === e.Cancelled || r instanceof Vt ? !0 : !r || typeof r != "object" ? !1 : typeof r.isCancellationRequested == "boolean" && typeof r.onCancellationRequested == "function";
  }
  e.isCancellationToken = t, e.None = Object.freeze({
    isCancellationRequested: !1,
    onCancellationRequested: gr.None
  }), e.Cancelled = Object.freeze({
    isCancellationRequested: !0,
    onCancellationRequested: ca
  });
})(Bt || (Bt = {}));
class Vt {
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
    return this._isCancelled ? ca : (this._emitter || (this._emitter = new Se()), this._emitter.event);
  }
  dispose() {
    this._emitter && (this._emitter.dispose(), this._emitter = null);
  }
}
class zs {
  constructor(t) {
    this._token = void 0, this._parentListener = void 0, this._parentListener = t && t.onCancellationRequested(this.cancel, this);
  }
  get token() {
    return this._token || (this._token = new Vt()), this._token;
  }
  cancel() {
    this._token ? this._token instanceof Vt && this._token.cancel() : this._token = Bt.Cancelled;
  }
  dispose(t = !1) {
    t && this.cancel(), this._parentListener && this._parentListener.dispose(), this._token ? this._token instanceof Vt && this._token.dispose() : this._token = Bt.None;
  }
}
class Qr {
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
const It = new Qr(), Nr = new Qr(), Lr = new Qr(), Gs = new Array(230), Js = /* @__PURE__ */ Object.create(null), Zs = /* @__PURE__ */ Object.create(null);
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
  ], r = [], n = [];
  for (const i of t) {
    const [s, o, l, u, c, h, f, d, m, v] = i;
    if (n[l] || (n[l] = !0, Js[u] = l, Zs[u.toLowerCase()] = l), !r[c]) {
      if (r[c] = !0, !h)
        throw new Error(`String representation missing for key code ${c} around scan code ${u}`);
      It.define(c, h), Nr.define(c, m || h), Lr.define(c, v || m || h);
    }
    f && (Gs[f] = c);
  }
})();
var vn;
(function(e) {
  function t(l) {
    return It.keyCodeToStr(l);
  }
  e.toString = t;
  function r(l) {
    return It.strToKeyCode(l);
  }
  e.fromString = r;
  function n(l) {
    return Nr.keyCodeToStr(l);
  }
  e.toUserSettingsUS = n;
  function i(l) {
    return Lr.keyCodeToStr(l);
  }
  e.toUserSettingsGeneral = i;
  function s(l) {
    return Nr.strToKeyCode(l) || Lr.strToKeyCode(l);
  }
  e.fromUserSettings = s;
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
    return It.keyCodeToStr(l);
  }
  e.toElectronAccelerator = o;
})(vn || (vn = {}));
function Xs(e, t) {
  const r = (t & 65535) << 16 >>> 0;
  return (e | r) >>> 0;
}
class fe extends Be {
  constructor(t, r, n, i) {
    super(t, r, n, i), this.selectionStartLineNumber = t, this.selectionStartColumn = r, this.positionLineNumber = n, this.positionColumn = i;
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
    return fe.selectionsEqual(this, t);
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
    return this.getDirection() === 0 ? new fe(this.startLineNumber, this.startColumn, t, r) : new fe(t, r, this.startLineNumber, this.startColumn);
  }
  /**
   * Get the position at `positionLineNumber` and `positionColumn`.
   */
  getPosition() {
    return new He(this.positionLineNumber, this.positionColumn);
  }
  /**
   * Get the position at the start of the selection.
  */
  getSelectionStart() {
    return new He(this.selectionStartLineNumber, this.selectionStartColumn);
  }
  /**
   * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
   */
  setStartPosition(t, r) {
    return this.getDirection() === 0 ? new fe(t, r, this.endLineNumber, this.endColumn) : new fe(this.endLineNumber, this.endColumn, t, r);
  }
  // ----
  /**
   * Create a `Selection` from one or two positions
   */
  static fromPositions(t, r = t) {
    return new fe(t.lineNumber, t.column, r.lineNumber, r.column);
  }
  /**
   * Creates a `Selection` from a range, given a direction.
   */
  static fromRange(t, r) {
    return r === 0 ? new fe(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new fe(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
  }
  /**
   * Create a `Selection` from an `ISelection`.
   */
  static liftSelection(t) {
    return new fe(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
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
    for (let n = 0, i = t.length; n < i; n++)
      if (!this.selectionsEqual(t[n], r[n]))
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
  static createWithDirection(t, r, n, i, s) {
    return s === 0 ? new fe(t, r, n, i) : new fe(n, i, t, r);
  }
}
class a {
  constructor(t, r, n) {
    this.id = t, this.definition = r, this.description = n, a._allCodicons.push(this);
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
    return a._allCodicons;
  }
}
a._allCodicons = [];
a.add = new a("add", { fontCharacter: "\\ea60" });
a.plus = new a("plus", a.add.definition);
a.gistNew = new a("gist-new", a.add.definition);
a.repoCreate = new a("repo-create", a.add.definition);
a.lightbulb = new a("lightbulb", { fontCharacter: "\\ea61" });
a.lightBulb = new a("light-bulb", { fontCharacter: "\\ea61" });
a.repo = new a("repo", { fontCharacter: "\\ea62" });
a.repoDelete = new a("repo-delete", { fontCharacter: "\\ea62" });
a.gistFork = new a("gist-fork", { fontCharacter: "\\ea63" });
a.repoForked = new a("repo-forked", { fontCharacter: "\\ea63" });
a.gitPullRequest = new a("git-pull-request", { fontCharacter: "\\ea64" });
a.gitPullRequestAbandoned = new a("git-pull-request-abandoned", { fontCharacter: "\\ea64" });
a.recordKeys = new a("record-keys", { fontCharacter: "\\ea65" });
a.keyboard = new a("keyboard", { fontCharacter: "\\ea65" });
a.tag = new a("tag", { fontCharacter: "\\ea66" });
a.tagAdd = new a("tag-add", { fontCharacter: "\\ea66" });
a.tagRemove = new a("tag-remove", { fontCharacter: "\\ea66" });
a.person = new a("person", { fontCharacter: "\\ea67" });
a.personFollow = new a("person-follow", { fontCharacter: "\\ea67" });
a.personOutline = new a("person-outline", { fontCharacter: "\\ea67" });
a.personFilled = new a("person-filled", { fontCharacter: "\\ea67" });
a.gitBranch = new a("git-branch", { fontCharacter: "\\ea68" });
a.gitBranchCreate = new a("git-branch-create", { fontCharacter: "\\ea68" });
a.gitBranchDelete = new a("git-branch-delete", { fontCharacter: "\\ea68" });
a.sourceControl = new a("source-control", { fontCharacter: "\\ea68" });
a.mirror = new a("mirror", { fontCharacter: "\\ea69" });
a.mirrorPublic = new a("mirror-public", { fontCharacter: "\\ea69" });
a.star = new a("star", { fontCharacter: "\\ea6a" });
a.starAdd = new a("star-add", { fontCharacter: "\\ea6a" });
a.starDelete = new a("star-delete", { fontCharacter: "\\ea6a" });
a.starEmpty = new a("star-empty", { fontCharacter: "\\ea6a" });
a.comment = new a("comment", { fontCharacter: "\\ea6b" });
a.commentAdd = new a("comment-add", { fontCharacter: "\\ea6b" });
a.alert = new a("alert", { fontCharacter: "\\ea6c" });
a.warning = new a("warning", { fontCharacter: "\\ea6c" });
a.search = new a("search", { fontCharacter: "\\ea6d" });
a.searchSave = new a("search-save", { fontCharacter: "\\ea6d" });
a.logOut = new a("log-out", { fontCharacter: "\\ea6e" });
a.signOut = new a("sign-out", { fontCharacter: "\\ea6e" });
a.logIn = new a("log-in", { fontCharacter: "\\ea6f" });
a.signIn = new a("sign-in", { fontCharacter: "\\ea6f" });
a.eye = new a("eye", { fontCharacter: "\\ea70" });
a.eyeUnwatch = new a("eye-unwatch", { fontCharacter: "\\ea70" });
a.eyeWatch = new a("eye-watch", { fontCharacter: "\\ea70" });
a.circleFilled = new a("circle-filled", { fontCharacter: "\\ea71" });
a.primitiveDot = new a("primitive-dot", { fontCharacter: "\\ea71" });
a.closeDirty = new a("close-dirty", { fontCharacter: "\\ea71" });
a.debugBreakpoint = new a("debug-breakpoint", { fontCharacter: "\\ea71" });
a.debugBreakpointDisabled = new a("debug-breakpoint-disabled", { fontCharacter: "\\ea71" });
a.debugHint = new a("debug-hint", { fontCharacter: "\\ea71" });
a.primitiveSquare = new a("primitive-square", { fontCharacter: "\\ea72" });
a.edit = new a("edit", { fontCharacter: "\\ea73" });
a.pencil = new a("pencil", { fontCharacter: "\\ea73" });
a.info = new a("info", { fontCharacter: "\\ea74" });
a.issueOpened = new a("issue-opened", { fontCharacter: "\\ea74" });
a.gistPrivate = new a("gist-private", { fontCharacter: "\\ea75" });
a.gitForkPrivate = new a("git-fork-private", { fontCharacter: "\\ea75" });
a.lock = new a("lock", { fontCharacter: "\\ea75" });
a.mirrorPrivate = new a("mirror-private", { fontCharacter: "\\ea75" });
a.close = new a("close", { fontCharacter: "\\ea76" });
a.removeClose = new a("remove-close", { fontCharacter: "\\ea76" });
a.x = new a("x", { fontCharacter: "\\ea76" });
a.repoSync = new a("repo-sync", { fontCharacter: "\\ea77" });
a.sync = new a("sync", { fontCharacter: "\\ea77" });
a.clone = new a("clone", { fontCharacter: "\\ea78" });
a.desktopDownload = new a("desktop-download", { fontCharacter: "\\ea78" });
a.beaker = new a("beaker", { fontCharacter: "\\ea79" });
a.microscope = new a("microscope", { fontCharacter: "\\ea79" });
a.vm = new a("vm", { fontCharacter: "\\ea7a" });
a.deviceDesktop = new a("device-desktop", { fontCharacter: "\\ea7a" });
a.file = new a("file", { fontCharacter: "\\ea7b" });
a.fileText = new a("file-text", { fontCharacter: "\\ea7b" });
a.more = new a("more", { fontCharacter: "\\ea7c" });
a.ellipsis = new a("ellipsis", { fontCharacter: "\\ea7c" });
a.kebabHorizontal = new a("kebab-horizontal", { fontCharacter: "\\ea7c" });
a.mailReply = new a("mail-reply", { fontCharacter: "\\ea7d" });
a.reply = new a("reply", { fontCharacter: "\\ea7d" });
a.organization = new a("organization", { fontCharacter: "\\ea7e" });
a.organizationFilled = new a("organization-filled", { fontCharacter: "\\ea7e" });
a.organizationOutline = new a("organization-outline", { fontCharacter: "\\ea7e" });
a.newFile = new a("new-file", { fontCharacter: "\\ea7f" });
a.fileAdd = new a("file-add", { fontCharacter: "\\ea7f" });
a.newFolder = new a("new-folder", { fontCharacter: "\\ea80" });
a.fileDirectoryCreate = new a("file-directory-create", { fontCharacter: "\\ea80" });
a.trash = new a("trash", { fontCharacter: "\\ea81" });
a.trashcan = new a("trashcan", { fontCharacter: "\\ea81" });
a.history = new a("history", { fontCharacter: "\\ea82" });
a.clock = new a("clock", { fontCharacter: "\\ea82" });
a.folder = new a("folder", { fontCharacter: "\\ea83" });
a.fileDirectory = new a("file-directory", { fontCharacter: "\\ea83" });
a.symbolFolder = new a("symbol-folder", { fontCharacter: "\\ea83" });
a.logoGithub = new a("logo-github", { fontCharacter: "\\ea84" });
a.markGithub = new a("mark-github", { fontCharacter: "\\ea84" });
a.github = new a("github", { fontCharacter: "\\ea84" });
a.terminal = new a("terminal", { fontCharacter: "\\ea85" });
a.console = new a("console", { fontCharacter: "\\ea85" });
a.repl = new a("repl", { fontCharacter: "\\ea85" });
a.zap = new a("zap", { fontCharacter: "\\ea86" });
a.symbolEvent = new a("symbol-event", { fontCharacter: "\\ea86" });
a.error = new a("error", { fontCharacter: "\\ea87" });
a.stop = new a("stop", { fontCharacter: "\\ea87" });
a.variable = new a("variable", { fontCharacter: "\\ea88" });
a.symbolVariable = new a("symbol-variable", { fontCharacter: "\\ea88" });
a.array = new a("array", { fontCharacter: "\\ea8a" });
a.symbolArray = new a("symbol-array", { fontCharacter: "\\ea8a" });
a.symbolModule = new a("symbol-module", { fontCharacter: "\\ea8b" });
a.symbolPackage = new a("symbol-package", { fontCharacter: "\\ea8b" });
a.symbolNamespace = new a("symbol-namespace", { fontCharacter: "\\ea8b" });
a.symbolObject = new a("symbol-object", { fontCharacter: "\\ea8b" });
a.symbolMethod = new a("symbol-method", { fontCharacter: "\\ea8c" });
a.symbolFunction = new a("symbol-function", { fontCharacter: "\\ea8c" });
a.symbolConstructor = new a("symbol-constructor", { fontCharacter: "\\ea8c" });
a.symbolBoolean = new a("symbol-boolean", { fontCharacter: "\\ea8f" });
a.symbolNull = new a("symbol-null", { fontCharacter: "\\ea8f" });
a.symbolNumeric = new a("symbol-numeric", { fontCharacter: "\\ea90" });
a.symbolNumber = new a("symbol-number", { fontCharacter: "\\ea90" });
a.symbolStructure = new a("symbol-structure", { fontCharacter: "\\ea91" });
a.symbolStruct = new a("symbol-struct", { fontCharacter: "\\ea91" });
a.symbolParameter = new a("symbol-parameter", { fontCharacter: "\\ea92" });
a.symbolTypeParameter = new a("symbol-type-parameter", { fontCharacter: "\\ea92" });
a.symbolKey = new a("symbol-key", { fontCharacter: "\\ea93" });
a.symbolText = new a("symbol-text", { fontCharacter: "\\ea93" });
a.symbolReference = new a("symbol-reference", { fontCharacter: "\\ea94" });
a.goToFile = new a("go-to-file", { fontCharacter: "\\ea94" });
a.symbolEnum = new a("symbol-enum", { fontCharacter: "\\ea95" });
a.symbolValue = new a("symbol-value", { fontCharacter: "\\ea95" });
a.symbolRuler = new a("symbol-ruler", { fontCharacter: "\\ea96" });
a.symbolUnit = new a("symbol-unit", { fontCharacter: "\\ea96" });
a.activateBreakpoints = new a("activate-breakpoints", { fontCharacter: "\\ea97" });
a.archive = new a("archive", { fontCharacter: "\\ea98" });
a.arrowBoth = new a("arrow-both", { fontCharacter: "\\ea99" });
a.arrowDown = new a("arrow-down", { fontCharacter: "\\ea9a" });
a.arrowLeft = new a("arrow-left", { fontCharacter: "\\ea9b" });
a.arrowRight = new a("arrow-right", { fontCharacter: "\\ea9c" });
a.arrowSmallDown = new a("arrow-small-down", { fontCharacter: "\\ea9d" });
a.arrowSmallLeft = new a("arrow-small-left", { fontCharacter: "\\ea9e" });
a.arrowSmallRight = new a("arrow-small-right", { fontCharacter: "\\ea9f" });
a.arrowSmallUp = new a("arrow-small-up", { fontCharacter: "\\eaa0" });
a.arrowUp = new a("arrow-up", { fontCharacter: "\\eaa1" });
a.bell = new a("bell", { fontCharacter: "\\eaa2" });
a.bold = new a("bold", { fontCharacter: "\\eaa3" });
a.book = new a("book", { fontCharacter: "\\eaa4" });
a.bookmark = new a("bookmark", { fontCharacter: "\\eaa5" });
a.debugBreakpointConditionalUnverified = new a("debug-breakpoint-conditional-unverified", { fontCharacter: "\\eaa6" });
a.debugBreakpointConditional = new a("debug-breakpoint-conditional", { fontCharacter: "\\eaa7" });
a.debugBreakpointConditionalDisabled = new a("debug-breakpoint-conditional-disabled", { fontCharacter: "\\eaa7" });
a.debugBreakpointDataUnverified = new a("debug-breakpoint-data-unverified", { fontCharacter: "\\eaa8" });
a.debugBreakpointData = new a("debug-breakpoint-data", { fontCharacter: "\\eaa9" });
a.debugBreakpointDataDisabled = new a("debug-breakpoint-data-disabled", { fontCharacter: "\\eaa9" });
a.debugBreakpointLogUnverified = new a("debug-breakpoint-log-unverified", { fontCharacter: "\\eaaa" });
a.debugBreakpointLog = new a("debug-breakpoint-log", { fontCharacter: "\\eaab" });
a.debugBreakpointLogDisabled = new a("debug-breakpoint-log-disabled", { fontCharacter: "\\eaab" });
a.briefcase = new a("briefcase", { fontCharacter: "\\eaac" });
a.broadcast = new a("broadcast", { fontCharacter: "\\eaad" });
a.browser = new a("browser", { fontCharacter: "\\eaae" });
a.bug = new a("bug", { fontCharacter: "\\eaaf" });
a.calendar = new a("calendar", { fontCharacter: "\\eab0" });
a.caseSensitive = new a("case-sensitive", { fontCharacter: "\\eab1" });
a.check = new a("check", { fontCharacter: "\\eab2" });
a.checklist = new a("checklist", { fontCharacter: "\\eab3" });
a.chevronDown = new a("chevron-down", { fontCharacter: "\\eab4" });
a.dropDownButton = new a("drop-down-button", a.chevronDown.definition);
a.chevronLeft = new a("chevron-left", { fontCharacter: "\\eab5" });
a.chevronRight = new a("chevron-right", { fontCharacter: "\\eab6" });
a.chevronUp = new a("chevron-up", { fontCharacter: "\\eab7" });
a.chromeClose = new a("chrome-close", { fontCharacter: "\\eab8" });
a.chromeMaximize = new a("chrome-maximize", { fontCharacter: "\\eab9" });
a.chromeMinimize = new a("chrome-minimize", { fontCharacter: "\\eaba" });
a.chromeRestore = new a("chrome-restore", { fontCharacter: "\\eabb" });
a.circleOutline = new a("circle-outline", { fontCharacter: "\\eabc" });
a.debugBreakpointUnverified = new a("debug-breakpoint-unverified", { fontCharacter: "\\eabc" });
a.circleSlash = new a("circle-slash", { fontCharacter: "\\eabd" });
a.circuitBoard = new a("circuit-board", { fontCharacter: "\\eabe" });
a.clearAll = new a("clear-all", { fontCharacter: "\\eabf" });
a.clippy = new a("clippy", { fontCharacter: "\\eac0" });
a.closeAll = new a("close-all", { fontCharacter: "\\eac1" });
a.cloudDownload = new a("cloud-download", { fontCharacter: "\\eac2" });
a.cloudUpload = new a("cloud-upload", { fontCharacter: "\\eac3" });
a.code = new a("code", { fontCharacter: "\\eac4" });
a.collapseAll = new a("collapse-all", { fontCharacter: "\\eac5" });
a.colorMode = new a("color-mode", { fontCharacter: "\\eac6" });
a.commentDiscussion = new a("comment-discussion", { fontCharacter: "\\eac7" });
a.compareChanges = new a("compare-changes", { fontCharacter: "\\eafd" });
a.creditCard = new a("credit-card", { fontCharacter: "\\eac9" });
a.dash = new a("dash", { fontCharacter: "\\eacc" });
a.dashboard = new a("dashboard", { fontCharacter: "\\eacd" });
a.database = new a("database", { fontCharacter: "\\eace" });
a.debugContinue = new a("debug-continue", { fontCharacter: "\\eacf" });
a.debugDisconnect = new a("debug-disconnect", { fontCharacter: "\\ead0" });
a.debugPause = new a("debug-pause", { fontCharacter: "\\ead1" });
a.debugRestart = new a("debug-restart", { fontCharacter: "\\ead2" });
a.debugStart = new a("debug-start", { fontCharacter: "\\ead3" });
a.debugStepInto = new a("debug-step-into", { fontCharacter: "\\ead4" });
a.debugStepOut = new a("debug-step-out", { fontCharacter: "\\ead5" });
a.debugStepOver = new a("debug-step-over", { fontCharacter: "\\ead6" });
a.debugStop = new a("debug-stop", { fontCharacter: "\\ead7" });
a.debug = new a("debug", { fontCharacter: "\\ead8" });
a.deviceCameraVideo = new a("device-camera-video", { fontCharacter: "\\ead9" });
a.deviceCamera = new a("device-camera", { fontCharacter: "\\eada" });
a.deviceMobile = new a("device-mobile", { fontCharacter: "\\eadb" });
a.diffAdded = new a("diff-added", { fontCharacter: "\\eadc" });
a.diffIgnored = new a("diff-ignored", { fontCharacter: "\\eadd" });
a.diffModified = new a("diff-modified", { fontCharacter: "\\eade" });
a.diffRemoved = new a("diff-removed", { fontCharacter: "\\eadf" });
a.diffRenamed = new a("diff-renamed", { fontCharacter: "\\eae0" });
a.diff = new a("diff", { fontCharacter: "\\eae1" });
a.discard = new a("discard", { fontCharacter: "\\eae2" });
a.editorLayout = new a("editor-layout", { fontCharacter: "\\eae3" });
a.emptyWindow = new a("empty-window", { fontCharacter: "\\eae4" });
a.exclude = new a("exclude", { fontCharacter: "\\eae5" });
a.extensions = new a("extensions", { fontCharacter: "\\eae6" });
a.eyeClosed = new a("eye-closed", { fontCharacter: "\\eae7" });
a.fileBinary = new a("file-binary", { fontCharacter: "\\eae8" });
a.fileCode = new a("file-code", { fontCharacter: "\\eae9" });
a.fileMedia = new a("file-media", { fontCharacter: "\\eaea" });
a.filePdf = new a("file-pdf", { fontCharacter: "\\eaeb" });
a.fileSubmodule = new a("file-submodule", { fontCharacter: "\\eaec" });
a.fileSymlinkDirectory = new a("file-symlink-directory", { fontCharacter: "\\eaed" });
a.fileSymlinkFile = new a("file-symlink-file", { fontCharacter: "\\eaee" });
a.fileZip = new a("file-zip", { fontCharacter: "\\eaef" });
a.files = new a("files", { fontCharacter: "\\eaf0" });
a.filter = new a("filter", { fontCharacter: "\\eaf1" });
a.flame = new a("flame", { fontCharacter: "\\eaf2" });
a.foldDown = new a("fold-down", { fontCharacter: "\\eaf3" });
a.foldUp = new a("fold-up", { fontCharacter: "\\eaf4" });
a.fold = new a("fold", { fontCharacter: "\\eaf5" });
a.folderActive = new a("folder-active", { fontCharacter: "\\eaf6" });
a.folderOpened = new a("folder-opened", { fontCharacter: "\\eaf7" });
a.gear = new a("gear", { fontCharacter: "\\eaf8" });
a.gift = new a("gift", { fontCharacter: "\\eaf9" });
a.gistSecret = new a("gist-secret", { fontCharacter: "\\eafa" });
a.gist = new a("gist", { fontCharacter: "\\eafb" });
a.gitCommit = new a("git-commit", { fontCharacter: "\\eafc" });
a.gitCompare = new a("git-compare", { fontCharacter: "\\eafd" });
a.gitMerge = new a("git-merge", { fontCharacter: "\\eafe" });
a.githubAction = new a("github-action", { fontCharacter: "\\eaff" });
a.githubAlt = new a("github-alt", { fontCharacter: "\\eb00" });
a.globe = new a("globe", { fontCharacter: "\\eb01" });
a.grabber = new a("grabber", { fontCharacter: "\\eb02" });
a.graph = new a("graph", { fontCharacter: "\\eb03" });
a.gripper = new a("gripper", { fontCharacter: "\\eb04" });
a.heart = new a("heart", { fontCharacter: "\\eb05" });
a.home = new a("home", { fontCharacter: "\\eb06" });
a.horizontalRule = new a("horizontal-rule", { fontCharacter: "\\eb07" });
a.hubot = new a("hubot", { fontCharacter: "\\eb08" });
a.inbox = new a("inbox", { fontCharacter: "\\eb09" });
a.issueClosed = new a("issue-closed", { fontCharacter: "\\eba4" });
a.issueReopened = new a("issue-reopened", { fontCharacter: "\\eb0b" });
a.issues = new a("issues", { fontCharacter: "\\eb0c" });
a.italic = new a("italic", { fontCharacter: "\\eb0d" });
a.jersey = new a("jersey", { fontCharacter: "\\eb0e" });
a.json = new a("json", { fontCharacter: "\\eb0f" });
a.kebabVertical = new a("kebab-vertical", { fontCharacter: "\\eb10" });
a.key = new a("key", { fontCharacter: "\\eb11" });
a.law = new a("law", { fontCharacter: "\\eb12" });
a.lightbulbAutofix = new a("lightbulb-autofix", { fontCharacter: "\\eb13" });
a.linkExternal = new a("link-external", { fontCharacter: "\\eb14" });
a.link = new a("link", { fontCharacter: "\\eb15" });
a.listOrdered = new a("list-ordered", { fontCharacter: "\\eb16" });
a.listUnordered = new a("list-unordered", { fontCharacter: "\\eb17" });
a.liveShare = new a("live-share", { fontCharacter: "\\eb18" });
a.loading = new a("loading", { fontCharacter: "\\eb19" });
a.location = new a("location", { fontCharacter: "\\eb1a" });
a.mailRead = new a("mail-read", { fontCharacter: "\\eb1b" });
a.mail = new a("mail", { fontCharacter: "\\eb1c" });
a.markdown = new a("markdown", { fontCharacter: "\\eb1d" });
a.megaphone = new a("megaphone", { fontCharacter: "\\eb1e" });
a.mention = new a("mention", { fontCharacter: "\\eb1f" });
a.milestone = new a("milestone", { fontCharacter: "\\eb20" });
a.mortarBoard = new a("mortar-board", { fontCharacter: "\\eb21" });
a.move = new a("move", { fontCharacter: "\\eb22" });
a.multipleWindows = new a("multiple-windows", { fontCharacter: "\\eb23" });
a.mute = new a("mute", { fontCharacter: "\\eb24" });
a.noNewline = new a("no-newline", { fontCharacter: "\\eb25" });
a.note = new a("note", { fontCharacter: "\\eb26" });
a.octoface = new a("octoface", { fontCharacter: "\\eb27" });
a.openPreview = new a("open-preview", { fontCharacter: "\\eb28" });
a.package_ = new a("package", { fontCharacter: "\\eb29" });
a.paintcan = new a("paintcan", { fontCharacter: "\\eb2a" });
a.pin = new a("pin", { fontCharacter: "\\eb2b" });
a.play = new a("play", { fontCharacter: "\\eb2c" });
a.run = new a("run", { fontCharacter: "\\eb2c" });
a.plug = new a("plug", { fontCharacter: "\\eb2d" });
a.preserveCase = new a("preserve-case", { fontCharacter: "\\eb2e" });
a.preview = new a("preview", { fontCharacter: "\\eb2f" });
a.project = new a("project", { fontCharacter: "\\eb30" });
a.pulse = new a("pulse", { fontCharacter: "\\eb31" });
a.question = new a("question", { fontCharacter: "\\eb32" });
a.quote = new a("quote", { fontCharacter: "\\eb33" });
a.radioTower = new a("radio-tower", { fontCharacter: "\\eb34" });
a.reactions = new a("reactions", { fontCharacter: "\\eb35" });
a.references = new a("references", { fontCharacter: "\\eb36" });
a.refresh = new a("refresh", { fontCharacter: "\\eb37" });
a.regex = new a("regex", { fontCharacter: "\\eb38" });
a.remoteExplorer = new a("remote-explorer", { fontCharacter: "\\eb39" });
a.remote = new a("remote", { fontCharacter: "\\eb3a" });
a.remove = new a("remove", { fontCharacter: "\\eb3b" });
a.replaceAll = new a("replace-all", { fontCharacter: "\\eb3c" });
a.replace = new a("replace", { fontCharacter: "\\eb3d" });
a.repoClone = new a("repo-clone", { fontCharacter: "\\eb3e" });
a.repoForcePush = new a("repo-force-push", { fontCharacter: "\\eb3f" });
a.repoPull = new a("repo-pull", { fontCharacter: "\\eb40" });
a.repoPush = new a("repo-push", { fontCharacter: "\\eb41" });
a.report = new a("report", { fontCharacter: "\\eb42" });
a.requestChanges = new a("request-changes", { fontCharacter: "\\eb43" });
a.rocket = new a("rocket", { fontCharacter: "\\eb44" });
a.rootFolderOpened = new a("root-folder-opened", { fontCharacter: "\\eb45" });
a.rootFolder = new a("root-folder", { fontCharacter: "\\eb46" });
a.rss = new a("rss", { fontCharacter: "\\eb47" });
a.ruby = new a("ruby", { fontCharacter: "\\eb48" });
a.saveAll = new a("save-all", { fontCharacter: "\\eb49" });
a.saveAs = new a("save-as", { fontCharacter: "\\eb4a" });
a.save = new a("save", { fontCharacter: "\\eb4b" });
a.screenFull = new a("screen-full", { fontCharacter: "\\eb4c" });
a.screenNormal = new a("screen-normal", { fontCharacter: "\\eb4d" });
a.searchStop = new a("search-stop", { fontCharacter: "\\eb4e" });
a.server = new a("server", { fontCharacter: "\\eb50" });
a.settingsGear = new a("settings-gear", { fontCharacter: "\\eb51" });
a.settings = new a("settings", { fontCharacter: "\\eb52" });
a.shield = new a("shield", { fontCharacter: "\\eb53" });
a.smiley = new a("smiley", { fontCharacter: "\\eb54" });
a.sortPrecedence = new a("sort-precedence", { fontCharacter: "\\eb55" });
a.splitHorizontal = new a("split-horizontal", { fontCharacter: "\\eb56" });
a.splitVertical = new a("split-vertical", { fontCharacter: "\\eb57" });
a.squirrel = new a("squirrel", { fontCharacter: "\\eb58" });
a.starFull = new a("star-full", { fontCharacter: "\\eb59" });
a.starHalf = new a("star-half", { fontCharacter: "\\eb5a" });
a.symbolClass = new a("symbol-class", { fontCharacter: "\\eb5b" });
a.symbolColor = new a("symbol-color", { fontCharacter: "\\eb5c" });
a.symbolCustomColor = new a("symbol-customcolor", { fontCharacter: "\\eb5c" });
a.symbolConstant = new a("symbol-constant", { fontCharacter: "\\eb5d" });
a.symbolEnumMember = new a("symbol-enum-member", { fontCharacter: "\\eb5e" });
a.symbolField = new a("symbol-field", { fontCharacter: "\\eb5f" });
a.symbolFile = new a("symbol-file", { fontCharacter: "\\eb60" });
a.symbolInterface = new a("symbol-interface", { fontCharacter: "\\eb61" });
a.symbolKeyword = new a("symbol-keyword", { fontCharacter: "\\eb62" });
a.symbolMisc = new a("symbol-misc", { fontCharacter: "\\eb63" });
a.symbolOperator = new a("symbol-operator", { fontCharacter: "\\eb64" });
a.symbolProperty = new a("symbol-property", { fontCharacter: "\\eb65" });
a.wrench = new a("wrench", { fontCharacter: "\\eb65" });
a.wrenchSubaction = new a("wrench-subaction", { fontCharacter: "\\eb65" });
a.symbolSnippet = new a("symbol-snippet", { fontCharacter: "\\eb66" });
a.tasklist = new a("tasklist", { fontCharacter: "\\eb67" });
a.telescope = new a("telescope", { fontCharacter: "\\eb68" });
a.textSize = new a("text-size", { fontCharacter: "\\eb69" });
a.threeBars = new a("three-bars", { fontCharacter: "\\eb6a" });
a.thumbsdown = new a("thumbsdown", { fontCharacter: "\\eb6b" });
a.thumbsup = new a("thumbsup", { fontCharacter: "\\eb6c" });
a.tools = new a("tools", { fontCharacter: "\\eb6d" });
a.triangleDown = new a("triangle-down", { fontCharacter: "\\eb6e" });
a.triangleLeft = new a("triangle-left", { fontCharacter: "\\eb6f" });
a.triangleRight = new a("triangle-right", { fontCharacter: "\\eb70" });
a.triangleUp = new a("triangle-up", { fontCharacter: "\\eb71" });
a.twitter = new a("twitter", { fontCharacter: "\\eb72" });
a.unfold = new a("unfold", { fontCharacter: "\\eb73" });
a.unlock = new a("unlock", { fontCharacter: "\\eb74" });
a.unmute = new a("unmute", { fontCharacter: "\\eb75" });
a.unverified = new a("unverified", { fontCharacter: "\\eb76" });
a.verified = new a("verified", { fontCharacter: "\\eb77" });
a.versions = new a("versions", { fontCharacter: "\\eb78" });
a.vmActive = new a("vm-active", { fontCharacter: "\\eb79" });
a.vmOutline = new a("vm-outline", { fontCharacter: "\\eb7a" });
a.vmRunning = new a("vm-running", { fontCharacter: "\\eb7b" });
a.watch = new a("watch", { fontCharacter: "\\eb7c" });
a.whitespace = new a("whitespace", { fontCharacter: "\\eb7d" });
a.wholeWord = new a("whole-word", { fontCharacter: "\\eb7e" });
a.window = new a("window", { fontCharacter: "\\eb7f" });
a.wordWrap = new a("word-wrap", { fontCharacter: "\\eb80" });
a.zoomIn = new a("zoom-in", { fontCharacter: "\\eb81" });
a.zoomOut = new a("zoom-out", { fontCharacter: "\\eb82" });
a.listFilter = new a("list-filter", { fontCharacter: "\\eb83" });
a.listFlat = new a("list-flat", { fontCharacter: "\\eb84" });
a.listSelection = new a("list-selection", { fontCharacter: "\\eb85" });
a.selection = new a("selection", { fontCharacter: "\\eb85" });
a.listTree = new a("list-tree", { fontCharacter: "\\eb86" });
a.debugBreakpointFunctionUnverified = new a("debug-breakpoint-function-unverified", { fontCharacter: "\\eb87" });
a.debugBreakpointFunction = new a("debug-breakpoint-function", { fontCharacter: "\\eb88" });
a.debugBreakpointFunctionDisabled = new a("debug-breakpoint-function-disabled", { fontCharacter: "\\eb88" });
a.debugStackframeActive = new a("debug-stackframe-active", { fontCharacter: "\\eb89" });
a.circleSmallFilled = new a("circle-small-filled", { fontCharacter: "\\eb8a" });
a.debugStackframeDot = new a("debug-stackframe-dot", a.circleSmallFilled.definition);
a.debugStackframe = new a("debug-stackframe", { fontCharacter: "\\eb8b" });
a.debugStackframeFocused = new a("debug-stackframe-focused", { fontCharacter: "\\eb8b" });
a.debugBreakpointUnsupported = new a("debug-breakpoint-unsupported", { fontCharacter: "\\eb8c" });
a.symbolString = new a("symbol-string", { fontCharacter: "\\eb8d" });
a.debugReverseContinue = new a("debug-reverse-continue", { fontCharacter: "\\eb8e" });
a.debugStepBack = new a("debug-step-back", { fontCharacter: "\\eb8f" });
a.debugRestartFrame = new a("debug-restart-frame", { fontCharacter: "\\eb90" });
a.callIncoming = new a("call-incoming", { fontCharacter: "\\eb92" });
a.callOutgoing = new a("call-outgoing", { fontCharacter: "\\eb93" });
a.menu = new a("menu", { fontCharacter: "\\eb94" });
a.expandAll = new a("expand-all", { fontCharacter: "\\eb95" });
a.feedback = new a("feedback", { fontCharacter: "\\eb96" });
a.groupByRefType = new a("group-by-ref-type", { fontCharacter: "\\eb97" });
a.ungroupByRefType = new a("ungroup-by-ref-type", { fontCharacter: "\\eb98" });
a.account = new a("account", { fontCharacter: "\\eb99" });
a.bellDot = new a("bell-dot", { fontCharacter: "\\eb9a" });
a.debugConsole = new a("debug-console", { fontCharacter: "\\eb9b" });
a.library = new a("library", { fontCharacter: "\\eb9c" });
a.output = new a("output", { fontCharacter: "\\eb9d" });
a.runAll = new a("run-all", { fontCharacter: "\\eb9e" });
a.syncIgnored = new a("sync-ignored", { fontCharacter: "\\eb9f" });
a.pinned = new a("pinned", { fontCharacter: "\\eba0" });
a.githubInverted = new a("github-inverted", { fontCharacter: "\\eba1" });
a.debugAlt = new a("debug-alt", { fontCharacter: "\\eb91" });
a.serverProcess = new a("server-process", { fontCharacter: "\\eba2" });
a.serverEnvironment = new a("server-environment", { fontCharacter: "\\eba3" });
a.pass = new a("pass", { fontCharacter: "\\eba4" });
a.stopCircle = new a("stop-circle", { fontCharacter: "\\eba5" });
a.playCircle = new a("play-circle", { fontCharacter: "\\eba6" });
a.record = new a("record", { fontCharacter: "\\eba7" });
a.debugAltSmall = new a("debug-alt-small", { fontCharacter: "\\eba8" });
a.vmConnect = new a("vm-connect", { fontCharacter: "\\eba9" });
a.cloud = new a("cloud", { fontCharacter: "\\ebaa" });
a.merge = new a("merge", { fontCharacter: "\\ebab" });
a.exportIcon = new a("export", { fontCharacter: "\\ebac" });
a.graphLeft = new a("graph-left", { fontCharacter: "\\ebad" });
a.magnet = new a("magnet", { fontCharacter: "\\ebae" });
a.notebook = new a("notebook", { fontCharacter: "\\ebaf" });
a.redo = new a("redo", { fontCharacter: "\\ebb0" });
a.checkAll = new a("check-all", { fontCharacter: "\\ebb1" });
a.pinnedDirty = new a("pinned-dirty", { fontCharacter: "\\ebb2" });
a.passFilled = new a("pass-filled", { fontCharacter: "\\ebb3" });
a.circleLargeFilled = new a("circle-large-filled", { fontCharacter: "\\ebb4" });
a.circleLargeOutline = new a("circle-large-outline", { fontCharacter: "\\ebb5" });
a.combine = new a("combine", { fontCharacter: "\\ebb6" });
a.gather = new a("gather", { fontCharacter: "\\ebb6" });
a.table = new a("table", { fontCharacter: "\\ebb7" });
a.variableGroup = new a("variable-group", { fontCharacter: "\\ebb8" });
a.typeHierarchy = new a("type-hierarchy", { fontCharacter: "\\ebb9" });
a.typeHierarchySub = new a("type-hierarchy-sub", { fontCharacter: "\\ebba" });
a.typeHierarchySuper = new a("type-hierarchy-super", { fontCharacter: "\\ebbb" });
a.gitPullRequestCreate = new a("git-pull-request-create", { fontCharacter: "\\ebbc" });
a.runAbove = new a("run-above", { fontCharacter: "\\ebbd" });
a.runBelow = new a("run-below", { fontCharacter: "\\ebbe" });
a.notebookTemplate = new a("notebook-template", { fontCharacter: "\\ebbf" });
a.debugRerun = new a("debug-rerun", { fontCharacter: "\\ebc0" });
a.workspaceTrusted = new a("workspace-trusted", { fontCharacter: "\\ebc1" });
a.workspaceUntrusted = new a("workspace-untrusted", { fontCharacter: "\\ebc2" });
a.workspaceUnspecified = new a("workspace-unspecified", { fontCharacter: "\\ebc3" });
a.terminalCmd = new a("terminal-cmd", { fontCharacter: "\\ebc4" });
a.terminalDebian = new a("terminal-debian", { fontCharacter: "\\ebc5" });
a.terminalLinux = new a("terminal-linux", { fontCharacter: "\\ebc6" });
a.terminalPowershell = new a("terminal-powershell", { fontCharacter: "\\ebc7" });
a.terminalTmux = new a("terminal-tmux", { fontCharacter: "\\ebc8" });
a.terminalUbuntu = new a("terminal-ubuntu", { fontCharacter: "\\ebc9" });
a.terminalBash = new a("terminal-bash", { fontCharacter: "\\ebca" });
a.arrowSwap = new a("arrow-swap", { fontCharacter: "\\ebcb" });
a.copy = new a("copy", { fontCharacter: "\\ebcc" });
a.personAdd = new a("person-add", { fontCharacter: "\\ebcd" });
a.filterFilled = new a("filter-filled", { fontCharacter: "\\ebce" });
a.wand = new a("wand", { fontCharacter: "\\ebcf" });
a.debugLineByLine = new a("debug-line-by-line", { fontCharacter: "\\ebd0" });
a.inspect = new a("inspect", { fontCharacter: "\\ebd1" });
a.layers = new a("layers", { fontCharacter: "\\ebd2" });
a.layersDot = new a("layers-dot", { fontCharacter: "\\ebd3" });
a.layersActive = new a("layers-active", { fontCharacter: "\\ebd4" });
a.compass = new a("compass", { fontCharacter: "\\ebd5" });
a.compassDot = new a("compass-dot", { fontCharacter: "\\ebd6" });
a.compassActive = new a("compass-active", { fontCharacter: "\\ebd7" });
a.azure = new a("azure", { fontCharacter: "\\ebd8" });
a.issueDraft = new a("issue-draft", { fontCharacter: "\\ebd9" });
a.gitPullRequestClosed = new a("git-pull-request-closed", { fontCharacter: "\\ebda" });
a.gitPullRequestDraft = new a("git-pull-request-draft", { fontCharacter: "\\ebdb" });
a.debugAll = new a("debug-all", { fontCharacter: "\\ebdc" });
a.debugCoverage = new a("debug-coverage", { fontCharacter: "\\ebdd" });
a.runErrors = new a("run-errors", { fontCharacter: "\\ebde" });
a.folderLibrary = new a("folder-library", { fontCharacter: "\\ebdf" });
a.debugContinueSmall = new a("debug-continue-small", { fontCharacter: "\\ebe0" });
a.beakerStop = new a("beaker-stop", { fontCharacter: "\\ebe1" });
a.graphLine = new a("graph-line", { fontCharacter: "\\ebe2" });
a.graphScatter = new a("graph-scatter", { fontCharacter: "\\ebe3" });
a.pieChart = new a("pie-chart", { fontCharacter: "\\ebe4" });
a.bracket = new a("bracket", a.json.definition);
a.bracketDot = new a("bracket-dot", { fontCharacter: "\\ebe5" });
a.bracketError = new a("bracket-error", { fontCharacter: "\\ebe6" });
a.lockSmall = new a("lock-small", { fontCharacter: "\\ebe7" });
a.azureDevops = new a("azure-devops", { fontCharacter: "\\ebe8" });
a.verifiedFilled = new a("verified-filled", { fontCharacter: "\\ebe9" });
a.newLine = new a("newline", { fontCharacter: "\\ebea" });
a.layout = new a("layout", { fontCharacter: "\\ebeb" });
a.layoutActivitybarLeft = new a("layout-activitybar-left", { fontCharacter: "\\ebec" });
a.layoutActivitybarRight = new a("layout-activitybar-right", { fontCharacter: "\\ebed" });
a.layoutPanelLeft = new a("layout-panel-left", { fontCharacter: "\\ebee" });
a.layoutPanelCenter = new a("layout-panel-center", { fontCharacter: "\\ebef" });
a.layoutPanelJustify = new a("layout-panel-justify", { fontCharacter: "\\ebf0" });
a.layoutPanelRight = new a("layout-panel-right", { fontCharacter: "\\ebf1" });
a.layoutPanel = new a("layout-panel", { fontCharacter: "\\ebf2" });
a.layoutSidebarLeft = new a("layout-sidebar-left", { fontCharacter: "\\ebf3" });
a.layoutSidebarRight = new a("layout-sidebar-right", { fontCharacter: "\\ebf4" });
a.layoutStatusbar = new a("layout-statusbar", { fontCharacter: "\\ebf5" });
a.layoutMenubar = new a("layout-menubar", { fontCharacter: "\\ebf6" });
a.layoutCentered = new a("layout-centered", { fontCharacter: "\\ebf7" });
a.layoutSidebarRightOff = new a("layout-sidebar-right-off", { fontCharacter: "\\ec00" });
a.layoutPanelOff = new a("layout-panel-off", { fontCharacter: "\\ec01" });
a.layoutSidebarLeftOff = new a("layout-sidebar-left-off", { fontCharacter: "\\ec02" });
a.target = new a("target", { fontCharacter: "\\ebf8" });
a.indent = new a("indent", { fontCharacter: "\\ebf9" });
a.recordSmall = new a("record-small", { fontCharacter: "\\ebfa" });
a.errorSmall = new a("error-small", { fontCharacter: "\\ebfb" });
a.arrowCircleDown = new a("arrow-circle-down", { fontCharacter: "\\ebfc" });
a.arrowCircleLeft = new a("arrow-circle-left", { fontCharacter: "\\ebfd" });
a.arrowCircleRight = new a("arrow-circle-right", { fontCharacter: "\\ebfe" });
a.arrowCircleUp = new a("arrow-circle-up", { fontCharacter: "\\ebff" });
a.heartFilled = new a("heart-filled", { fontCharacter: "\\ec04" });
a.map = new a("map", { fontCharacter: "\\ec05" });
a.mapFilled = new a("map-filled", { fontCharacter: "\\ec06" });
a.circleSmall = new a("circle-small", { fontCharacter: "\\ec07" });
a.bellSlash = new a("bell-slash", { fontCharacter: "\\ec08" });
a.bellSlashDot = new a("bell-slash-dot", { fontCharacter: "\\ec09" });
a.commentUnresolved = new a("comment-unresolved", { fontCharacter: "\\ec0a" });
a.gitPullRequestGoToChanges = new a("git-pull-request-go-to-changes", { fontCharacter: "\\ec0b" });
a.gitPullRequestNewChanges = new a("git-pull-request-new-changes", { fontCharacter: "\\ec0c" });
a.dialogError = new a("dialog-error", a.error.definition);
a.dialogWarning = new a("dialog-warning", a.warning.definition);
a.dialogInfo = new a("dialog-info", a.info.definition);
a.dialogClose = new a("dialog-close", a.close.definition);
a.treeItemExpanded = new a("tree-item-expanded", a.chevronDown.definition);
a.treeFilterOnTypeOn = new a("tree-filter-on-type-on", a.listFilter.definition);
a.treeFilterOnTypeOff = new a("tree-filter-on-type-off", a.listSelection.definition);
a.treeFilterClear = new a("tree-filter-clear", a.close.definition);
a.treeItemLoading = new a("tree-item-loading", a.loading.definition);
a.menuSelection = new a("menu-selection", a.check.definition);
a.menuSubmenu = new a("menu-submenu", a.chevronRight.definition);
a.menuBarMore = new a("menubar-more", a.more.definition);
a.scrollbarButtonLeft = new a("scrollbar-button-left", a.triangleLeft.definition);
a.scrollbarButtonRight = new a("scrollbar-button-right", a.triangleRight.definition);
a.scrollbarButtonUp = new a("scrollbar-button-up", a.triangleUp.definition);
a.scrollbarButtonDown = new a("scrollbar-button-down", a.triangleDown.definition);
a.toolBarMore = new a("toolbar-more", a.more.definition);
a.quickInputBack = new a("quick-input-back", a.arrowLeft.definition);
var bn;
(function(e) {
  e.iconNameSegment = "[A-Za-z0-9]+", e.iconNameExpression = "[A-Za-z0-9-]+", e.iconModifierExpression = "~[A-Za-z]+", e.iconNameCharacter = "[A-Za-z0-9~-]";
  const t = new RegExp(`^(${e.iconNameExpression})(${e.iconModifierExpression})?$`);
  function r(s) {
    if (s instanceof a)
      return ["codicon", "codicon-" + s.id];
    const o = t.exec(s.id);
    if (!o)
      return r(a.error);
    const [, l, u] = o, c = ["codicon", "codicon-" + l];
    return u && c.push("codicon-modifier-" + u.substr(1)), c;
  }
  e.asClassNameArray = r;
  function n(s) {
    return r(s).join(" ");
  }
  e.asClassName = n;
  function i(s) {
    return "." + r(s).join(".");
  }
  e.asCSSSelector = i;
})(bn || (bn = {}));
var kr = globalThis && globalThis.__awaiter || function(e, t, r, n) {
  function i(s) {
    return s instanceof r ? s : new r(function(o) {
      o(s);
    });
  }
  return new (r || (r = Promise))(function(s, o) {
    function l(h) {
      try {
        c(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function u(h) {
      try {
        c(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(l, u);
    }
    c((n = n.apply(e, t || [])).next());
  });
};
class Qs {
  constructor() {
    this._map = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new Se(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
  }
  fire(t) {
    this._onDidChange.fire({
      changedLanguages: t,
      changedColorMap: !1
    });
  }
  register(t, r) {
    return this._map.set(t, r), this.fire([t]), Dt(() => {
      this._map.get(t) === r && (this._map.delete(t), this.fire([t]));
    });
  }
  registerFactory(t, r) {
    var n;
    (n = this._factories.get(t)) === null || n === void 0 || n.dispose();
    const i = new Ys(this, t, r);
    return this._factories.set(t, i), Dt(() => {
      const s = this._factories.get(t);
      !s || s !== i || (this._factories.delete(t), s.dispose());
    });
  }
  getOrCreate(t) {
    return kr(this, void 0, void 0, function* () {
      const r = this.get(t);
      if (r)
        return r;
      const n = this._factories.get(t);
      return !n || n.isResolved ? null : (yield n.resolve(), this.get(t));
    });
  }
  get(t) {
    return this._map.get(t) || null;
  }
  isResolved(t) {
    if (this.get(t))
      return !0;
    const n = this._factories.get(t);
    return !!(!n || n.isResolved);
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
class Ys extends zr {
  constructor(t, r, n) {
    super(), this._registry = t, this._languageId = r, this._factory = n, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
  }
  get isResolved() {
    return this._isResolved;
  }
  dispose() {
    this._isDisposed = !0, super.dispose();
  }
  resolve() {
    return kr(this, void 0, void 0, function* () {
      return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
    });
  }
  _create() {
    return kr(this, void 0, void 0, function* () {
      const t = yield Promise.resolve(this._factory.createTokenizationSupport());
      this._isResolved = !0, t && !this._isDisposed && this._register(this._registry.register(this._languageId, t));
    });
  }
}
class Ks {
  constructor(t, r, n) {
    this._tokenBrand = void 0, this.offset = t, this.type = r, this.language = n;
  }
  toString() {
    return "(" + this.offset + ", " + this.type + ")";
  }
}
var wn;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, a.symbolMethod), t.set(1, a.symbolFunction), t.set(2, a.symbolConstructor), t.set(3, a.symbolField), t.set(4, a.symbolVariable), t.set(5, a.symbolClass), t.set(6, a.symbolStruct), t.set(7, a.symbolInterface), t.set(8, a.symbolModule), t.set(9, a.symbolProperty), t.set(10, a.symbolEvent), t.set(11, a.symbolOperator), t.set(12, a.symbolUnit), t.set(13, a.symbolValue), t.set(15, a.symbolEnum), t.set(14, a.symbolConstant), t.set(15, a.symbolEnum), t.set(16, a.symbolEnumMember), t.set(17, a.symbolKeyword), t.set(27, a.symbolSnippet), t.set(18, a.symbolText), t.set(19, a.symbolColor), t.set(20, a.symbolFile), t.set(21, a.symbolReference), t.set(22, a.symbolCustomColor), t.set(23, a.symbolFolder), t.set(24, a.symbolTypeParameter), t.set(25, a.account), t.set(26, a.issues);
  function r(s) {
    let o = t.get(s);
    return o || (console.info("No codicon found for CompletionItemKind " + s), o = a.symbolProperty), o;
  }
  e.toIcon = r;
  const n = /* @__PURE__ */ new Map();
  n.set(
    "method",
    0
    /* CompletionItemKind.Method */
  ), n.set(
    "function",
    1
    /* CompletionItemKind.Function */
  ), n.set(
    "constructor",
    2
    /* CompletionItemKind.Constructor */
  ), n.set(
    "field",
    3
    /* CompletionItemKind.Field */
  ), n.set(
    "variable",
    4
    /* CompletionItemKind.Variable */
  ), n.set(
    "class",
    5
    /* CompletionItemKind.Class */
  ), n.set(
    "struct",
    6
    /* CompletionItemKind.Struct */
  ), n.set(
    "interface",
    7
    /* CompletionItemKind.Interface */
  ), n.set(
    "module",
    8
    /* CompletionItemKind.Module */
  ), n.set(
    "property",
    9
    /* CompletionItemKind.Property */
  ), n.set(
    "event",
    10
    /* CompletionItemKind.Event */
  ), n.set(
    "operator",
    11
    /* CompletionItemKind.Operator */
  ), n.set(
    "unit",
    12
    /* CompletionItemKind.Unit */
  ), n.set(
    "value",
    13
    /* CompletionItemKind.Value */
  ), n.set(
    "constant",
    14
    /* CompletionItemKind.Constant */
  ), n.set(
    "enum",
    15
    /* CompletionItemKind.Enum */
  ), n.set(
    "enum-member",
    16
    /* CompletionItemKind.EnumMember */
  ), n.set(
    "enumMember",
    16
    /* CompletionItemKind.EnumMember */
  ), n.set(
    "keyword",
    17
    /* CompletionItemKind.Keyword */
  ), n.set(
    "snippet",
    27
    /* CompletionItemKind.Snippet */
  ), n.set(
    "text",
    18
    /* CompletionItemKind.Text */
  ), n.set(
    "color",
    19
    /* CompletionItemKind.Color */
  ), n.set(
    "file",
    20
    /* CompletionItemKind.File */
  ), n.set(
    "reference",
    21
    /* CompletionItemKind.Reference */
  ), n.set(
    "customcolor",
    22
    /* CompletionItemKind.Customcolor */
  ), n.set(
    "folder",
    23
    /* CompletionItemKind.Folder */
  ), n.set(
    "type-parameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), n.set(
    "typeParameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), n.set(
    "account",
    25
    /* CompletionItemKind.User */
  ), n.set(
    "issue",
    26
    /* CompletionItemKind.Issue */
  );
  function i(s, o) {
    let l = n.get(s);
    return typeof l > "u" && !o && (l = 9), l;
  }
  e.fromString = i;
})(wn || (wn = {}));
var yn;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(yn || (yn = {}));
var Cn;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Cn || (Cn = {}));
var _n;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(_n || (_n = {}));
var Sn;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, a.symbolFile), t.set(1, a.symbolModule), t.set(2, a.symbolNamespace), t.set(3, a.symbolPackage), t.set(4, a.symbolClass), t.set(5, a.symbolMethod), t.set(6, a.symbolProperty), t.set(7, a.symbolField), t.set(8, a.symbolConstructor), t.set(9, a.symbolEnum), t.set(10, a.symbolInterface), t.set(11, a.symbolFunction), t.set(12, a.symbolVariable), t.set(13, a.symbolConstant), t.set(14, a.symbolString), t.set(15, a.symbolNumber), t.set(16, a.symbolBoolean), t.set(17, a.symbolArray), t.set(18, a.symbolObject), t.set(19, a.symbolKey), t.set(20, a.symbolNull), t.set(21, a.symbolEnumMember), t.set(22, a.symbolStruct), t.set(23, a.symbolEvent), t.set(24, a.symbolOperator), t.set(25, a.symbolTypeParameter);
  function r(n) {
    let i = t.get(n);
    return i || (console.info("No codicon found for SymbolKind " + n), i = a.symbolProperty), i;
  }
  e.toIcon = r;
})(Sn || (Sn = {}));
var An;
(function(e) {
  function t(r) {
    return !r || typeof r != "object" ? !1 : typeof r.id == "string" && typeof r.title == "string";
  }
  e.is = t;
})(An || (An = {}));
var Nn;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Nn || (Nn = {}));
new Qs();
var Ln;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
})(Ln || (Ln = {}));
var kn;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
})(kn || (kn = {}));
var xn;
(function(e) {
  e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
})(xn || (xn = {}));
var Mn;
(function(e) {
  e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Snippet = 27] = "Snippet";
})(Mn || (Mn = {}));
var Pn;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(Pn || (Pn = {}));
var Tn;
(function(e) {
  e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
})(Tn || (Tn = {}));
var En;
(function(e) {
  e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
})(En || (En = {}));
var Fn;
(function(e) {
  e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
})(Fn || (Fn = {}));
var Vn;
(function(e) {
  e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(Vn || (Vn = {}));
var In;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(In || (In = {}));
var Rn;
(function(e) {
  e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
})(Rn || (Rn = {}));
var Dn;
(function(e) {
  e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.ariaLabel = 4] = "ariaLabel", e[e.autoClosingBrackets = 5] = "autoClosingBrackets", e[e.autoClosingDelete = 6] = "autoClosingDelete", e[e.autoClosingOvertype = 7] = "autoClosingOvertype", e[e.autoClosingQuotes = 8] = "autoClosingQuotes", e[e.autoIndent = 9] = "autoIndent", e[e.automaticLayout = 10] = "automaticLayout", e[e.autoSurround = 11] = "autoSurround", e[e.bracketPairColorization = 12] = "bracketPairColorization", e[e.guides = 13] = "guides", e[e.codeLens = 14] = "codeLens", e[e.codeLensFontFamily = 15] = "codeLensFontFamily", e[e.codeLensFontSize = 16] = "codeLensFontSize", e[e.colorDecorators = 17] = "colorDecorators", e[e.columnSelection = 18] = "columnSelection", e[e.comments = 19] = "comments", e[e.contextmenu = 20] = "contextmenu", e[e.copyWithSyntaxHighlighting = 21] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 22] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 23] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 24] = "cursorStyle", e[e.cursorSurroundingLines = 25] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 26] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 27] = "cursorWidth", e[e.disableLayerHinting = 28] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 29] = "disableMonospaceOptimizations", e[e.domReadOnly = 30] = "domReadOnly", e[e.dragAndDrop = 31] = "dragAndDrop", e[e.dropIntoEditor = 32] = "dropIntoEditor", e[e.emptySelectionClipboard = 33] = "emptySelectionClipboard", e[e.experimental = 34] = "experimental", e[e.extraEditorClassName = 35] = "extraEditorClassName", e[e.fastScrollSensitivity = 36] = "fastScrollSensitivity", e[e.find = 37] = "find", e[e.fixedOverflowWidgets = 38] = "fixedOverflowWidgets", e[e.folding = 39] = "folding", e[e.foldingStrategy = 40] = "foldingStrategy", e[e.foldingHighlight = 41] = "foldingHighlight", e[e.foldingImportsByDefault = 42] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 43] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 44] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 45] = "fontFamily", e[e.fontInfo = 46] = "fontInfo", e[e.fontLigatures = 47] = "fontLigatures", e[e.fontSize = 48] = "fontSize", e[e.fontWeight = 49] = "fontWeight", e[e.formatOnPaste = 50] = "formatOnPaste", e[e.formatOnType = 51] = "formatOnType", e[e.glyphMargin = 52] = "glyphMargin", e[e.gotoLocation = 53] = "gotoLocation", e[e.hideCursorInOverviewRuler = 54] = "hideCursorInOverviewRuler", e[e.hover = 55] = "hover", e[e.inDiffEditor = 56] = "inDiffEditor", e[e.inlineSuggest = 57] = "inlineSuggest", e[e.letterSpacing = 58] = "letterSpacing", e[e.lightbulb = 59] = "lightbulb", e[e.lineDecorationsWidth = 60] = "lineDecorationsWidth", e[e.lineHeight = 61] = "lineHeight", e[e.lineNumbers = 62] = "lineNumbers", e[e.lineNumbersMinChars = 63] = "lineNumbersMinChars", e[e.linkedEditing = 64] = "linkedEditing", e[e.links = 65] = "links", e[e.matchBrackets = 66] = "matchBrackets", e[e.minimap = 67] = "minimap", e[e.mouseStyle = 68] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 69] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 70] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 71] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 72] = "multiCursorModifier", e[e.multiCursorPaste = 73] = "multiCursorPaste", e[e.occurrencesHighlight = 74] = "occurrencesHighlight", e[e.overviewRulerBorder = 75] = "overviewRulerBorder", e[e.overviewRulerLanes = 76] = "overviewRulerLanes", e[e.padding = 77] = "padding", e[e.parameterHints = 78] = "parameterHints", e[e.peekWidgetDefaultFocus = 79] = "peekWidgetDefaultFocus", e[e.definitionLinkOpensInPeek = 80] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 81] = "quickSuggestions", e[e.quickSuggestionsDelay = 82] = "quickSuggestionsDelay", e[e.readOnly = 83] = "readOnly", e[e.renameOnType = 84] = "renameOnType", e[e.renderControlCharacters = 85] = "renderControlCharacters", e[e.renderFinalNewline = 86] = "renderFinalNewline", e[e.renderLineHighlight = 87] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 88] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 89] = "renderValidationDecorations", e[e.renderWhitespace = 90] = "renderWhitespace", e[e.revealHorizontalRightPadding = 91] = "revealHorizontalRightPadding", e[e.roundedSelection = 92] = "roundedSelection", e[e.rulers = 93] = "rulers", e[e.scrollbar = 94] = "scrollbar", e[e.scrollBeyondLastColumn = 95] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 96] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 97] = "scrollPredominantAxis", e[e.selectionClipboard = 98] = "selectionClipboard", e[e.selectionHighlight = 99] = "selectionHighlight", e[e.selectOnLineNumbers = 100] = "selectOnLineNumbers", e[e.showFoldingControls = 101] = "showFoldingControls", e[e.showUnused = 102] = "showUnused", e[e.snippetSuggestions = 103] = "snippetSuggestions", e[e.smartSelect = 104] = "smartSelect", e[e.smoothScrolling = 105] = "smoothScrolling", e[e.stickyTabStops = 106] = "stickyTabStops", e[e.stopRenderingLineAfter = 107] = "stopRenderingLineAfter", e[e.suggest = 108] = "suggest", e[e.suggestFontSize = 109] = "suggestFontSize", e[e.suggestLineHeight = 110] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 111] = "suggestOnTriggerCharacters", e[e.suggestSelection = 112] = "suggestSelection", e[e.tabCompletion = 113] = "tabCompletion", e[e.tabIndex = 114] = "tabIndex", e[e.unicodeHighlighting = 115] = "unicodeHighlighting", e[e.unusualLineTerminators = 116] = "unusualLineTerminators", e[e.useShadowDOM = 117] = "useShadowDOM", e[e.useTabStops = 118] = "useTabStops", e[e.wordSeparators = 119] = "wordSeparators", e[e.wordWrap = 120] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 121] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 122] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 123] = "wordWrapColumn", e[e.wordWrapOverride1 = 124] = "wordWrapOverride1", e[e.wordWrapOverride2 = 125] = "wordWrapOverride2", e[e.wrappingIndent = 126] = "wrappingIndent", e[e.wrappingStrategy = 127] = "wrappingStrategy", e[e.showDeprecated = 128] = "showDeprecated", e[e.inlayHints = 129] = "inlayHints", e[e.editorClassName = 130] = "editorClassName", e[e.pixelRatio = 131] = "pixelRatio", e[e.tabFocusMode = 132] = "tabFocusMode", e[e.layoutInfo = 133] = "layoutInfo", e[e.wrappingInfo = 134] = "wrappingInfo";
})(Dn || (Dn = {}));
var On;
(function(e) {
  e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(On || (On = {}));
var Un;
(function(e) {
  e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
})(Un || (Un = {}));
var jn;
(function(e) {
  e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
})(jn || (jn = {}));
var Bn;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(Bn || (Bn = {}));
var $n;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})($n || ($n = {}));
var qn;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(qn || (qn = {}));
var xr;
(function(e) {
  e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.NumLock = 78] = "NumLock", e[e.ScrollLock = 79] = "ScrollLock", e[e.Semicolon = 80] = "Semicolon", e[e.Equal = 81] = "Equal", e[e.Comma = 82] = "Comma", e[e.Minus = 83] = "Minus", e[e.Period = 84] = "Period", e[e.Slash = 85] = "Slash", e[e.Backquote = 86] = "Backquote", e[e.BracketLeft = 87] = "BracketLeft", e[e.Backslash = 88] = "Backslash", e[e.BracketRight = 89] = "BracketRight", e[e.Quote = 90] = "Quote", e[e.OEM_8 = 91] = "OEM_8", e[e.IntlBackslash = 92] = "IntlBackslash", e[e.Numpad0 = 93] = "Numpad0", e[e.Numpad1 = 94] = "Numpad1", e[e.Numpad2 = 95] = "Numpad2", e[e.Numpad3 = 96] = "Numpad3", e[e.Numpad4 = 97] = "Numpad4", e[e.Numpad5 = 98] = "Numpad5", e[e.Numpad6 = 99] = "Numpad6", e[e.Numpad7 = 100] = "Numpad7", e[e.Numpad8 = 101] = "Numpad8", e[e.Numpad9 = 102] = "Numpad9", e[e.NumpadMultiply = 103] = "NumpadMultiply", e[e.NumpadAdd = 104] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 105] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 106] = "NumpadSubtract", e[e.NumpadDecimal = 107] = "NumpadDecimal", e[e.NumpadDivide = 108] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 109] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 110] = "ABNT_C1", e[e.ABNT_C2 = 111] = "ABNT_C2", e[e.AudioVolumeMute = 112] = "AudioVolumeMute", e[e.AudioVolumeUp = 113] = "AudioVolumeUp", e[e.AudioVolumeDown = 114] = "AudioVolumeDown", e[e.BrowserSearch = 115] = "BrowserSearch", e[e.BrowserHome = 116] = "BrowserHome", e[e.BrowserBack = 117] = "BrowserBack", e[e.BrowserForward = 118] = "BrowserForward", e[e.MediaTrackNext = 119] = "MediaTrackNext", e[e.MediaTrackPrevious = 120] = "MediaTrackPrevious", e[e.MediaStop = 121] = "MediaStop", e[e.MediaPlayPause = 122] = "MediaPlayPause", e[e.LaunchMediaPlayer = 123] = "LaunchMediaPlayer", e[e.LaunchMail = 124] = "LaunchMail", e[e.LaunchApp2 = 125] = "LaunchApp2", e[e.Clear = 126] = "Clear", e[e.MAX_VALUE = 127] = "MAX_VALUE";
})(xr || (xr = {}));
var Mr;
(function(e) {
  e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
})(Mr || (Mr = {}));
var Pr;
(function(e) {
  e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
})(Pr || (Pr = {}));
var Wn;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(Wn || (Wn = {}));
var Hn;
(function(e) {
  e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
})(Hn || (Hn = {}));
var zn;
(function(e) {
  e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
})(zn || (zn = {}));
var Gn;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(Gn || (Gn = {}));
var Jn;
(function(e) {
  e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
})(Jn || (Jn = {}));
var Zn;
(function(e) {
  e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
})(Zn || (Zn = {}));
var Xn;
(function(e) {
  e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
})(Xn || (Xn = {}));
var Qn;
(function(e) {
  e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
})(Qn || (Qn = {}));
var Yn;
(function(e) {
  e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
})(Yn || (Yn = {}));
var Tr;
(function(e) {
  e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(Tr || (Tr = {}));
var Kn;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Kn || (Kn = {}));
var ei;
(function(e) {
  e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
})(ei || (ei = {}));
var ti;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(ti || (ti = {}));
var ri;
(function(e) {
  e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
})(ri || (ri = {}));
var ni;
(function(e) {
  e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
})(ni || (ni = {}));
var ii;
(function(e) {
  e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
})(ii || (ii = {}));
var ai;
(function(e) {
  e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
})(ai || (ai = {}));
class St {
  static chord(t, r) {
    return Xs(t, r);
  }
}
St.CtrlCmd = 2048;
St.Shift = 1024;
St.Alt = 512;
St.WinCtrl = 256;
function eo() {
  return {
    editor: void 0,
    languages: void 0,
    CancellationTokenSource: zs,
    Emitter: Se,
    KeyCode: xr,
    KeyMod: St,
    Position: He,
    Range: Be,
    Selection: fe,
    SelectionDirection: Tr,
    MarkerSeverity: Mr,
    MarkerTag: Pr,
    Uri: Jr,
    Token: Ks
  };
}
var si;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(si || (si = {}));
var oi;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(oi || (oi = {}));
var li;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(li || (li = {}));
function to(e, t, r, n, i) {
  if (n === 0)
    return !0;
  const s = t.charCodeAt(n - 1);
  if (e.get(s) !== 0 || s === 13 || s === 10)
    return !0;
  if (i > 0) {
    const o = t.charCodeAt(n);
    if (e.get(o) !== 0)
      return !0;
  }
  return !1;
}
function ro(e, t, r, n, i) {
  if (n + i === r)
    return !0;
  const s = t.charCodeAt(n + i);
  if (e.get(s) !== 0 || s === 13 || s === 10)
    return !0;
  if (i > 0) {
    const o = t.charCodeAt(n + i - 1);
    if (e.get(o) !== 0)
      return !0;
  }
  return !1;
}
function no(e, t, r, n, i) {
  return to(e, t, r, n, i) && ro(e, t, r, n, i);
}
class io {
  constructor(t, r) {
    this._wordSeparators = t, this._searchRegex = r, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  reset(t) {
    this._searchRegex.lastIndex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  next(t) {
    const r = t.length;
    let n;
    do {
      if (this._prevMatchStartIndex + this._prevMatchLength === r || (n = this._searchRegex.exec(t), !n))
        return null;
      const i = n.index, s = n[0].length;
      if (i === this._prevMatchStartIndex && s === this._prevMatchLength) {
        if (s === 0) {
          is(t, r, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
          continue;
        }
        return null;
      }
      if (this._prevMatchStartIndex = i, this._prevMatchLength = s, !this._wordSeparators || no(this._wordSeparators, t, r, i, s))
        return n;
    } while (n);
    return null;
  }
}
class ao {
  static computeUnicodeHighlights(t, r, n) {
    const i = n ? n.startLineNumber : 1, s = n ? n.endLineNumber : t.getLineCount(), o = new ui(r), l = o.getCandidateCodePoints();
    let u;
    l === "allNonBasicAscii" ? u = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : u = new RegExp(`${so(Array.from(l))}`, "g");
    const c = new io(null, u), h = [];
    let f = !1, d, m = 0, v = 0, p = 0;
    e:
      for (let g = i, A = s; g <= A; g++) {
        const S = t.getLineContent(g), C = S.length;
        c.reset(0);
        do
          if (d = c.next(S), d) {
            let N = d.index, x = d.index + d[0].length;
            if (N > 0) {
              const _ = S.charCodeAt(N - 1);
              vr(_) && N--;
            }
            if (x + 1 < C) {
              const _ = S.charCodeAt(x - 1);
              vr(_) && x++;
            }
            const w = S.substring(N, x), b = Zr(N + 1, la, S, 0), y = o.shouldHighlightNonBasicASCII(w, b ? b.word : null);
            if (y !== 0) {
              y === 3 ? m++ : y === 2 ? v++ : y === 1 ? p++ : Xa();
              const _ = 1e3;
              if (h.length >= _) {
                f = !0;
                break e;
              }
              h.push(new Be(g, N + 1, g, x + 1));
            }
          }
        while (d);
      }
    return {
      ranges: h,
      hasMore: f,
      ambiguousCharacterCount: m,
      invisibleCharacterCount: v,
      nonBasicAsciiCharacterCount: p
    };
  }
  static computeUnicodeHighlightReason(t, r) {
    const n = new ui(r);
    switch (n.shouldHighlightNonBasicASCII(t, null)) {
      case 0:
        return null;
      case 2:
        return {
          kind: 1
          /* UnicodeHighlighterReasonKind.Invisible */
        };
      case 3: {
        const s = t.codePointAt(0), o = n.ambiguousCharacters.getPrimaryConfusable(s), l = ge.getLocales().filter((u) => !ge.getInstance(/* @__PURE__ */ new Set([...r.allowedLocales, u])).isAmbiguous(s));
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
function so(e, t) {
  return `[${Ya(e.map((n) => String.fromCodePoint(n)).join(""))}]`;
}
class ui {
  constructor(t) {
    this.options = t, this.allowedCodePoints = new Set(t.allowedCodePoints), this.ambiguousCharacters = ge.getInstance(new Set(t.allowedLocales));
  }
  getCandidateCodePoints() {
    if (this.options.nonBasicASCII)
      return "allNonBasicAscii";
    const t = /* @__PURE__ */ new Set();
    if (this.options.invisibleCharacters)
      for (const r of De.codePoints)
        ci(String.fromCodePoint(r)) || t.add(r);
    if (this.options.ambiguousCharacters)
      for (const r of this.ambiguousCharacters.getConfusableCodePoints())
        t.add(r);
    for (const r of this.allowedCodePoints)
      t.delete(r);
    return t;
  }
  shouldHighlightNonBasicASCII(t, r) {
    const n = t.codePointAt(0);
    if (this.allowedCodePoints.has(n))
      return 0;
    if (this.options.nonBasicASCII)
      return 1;
    let i = !1, s = !1;
    if (r)
      for (const o of r) {
        const l = o.codePointAt(0), u = ss(o);
        i = i || u, !u && !this.ambiguousCharacters.isAmbiguous(l) && !De.isInvisibleCharacter(l) && (s = !0);
      }
    return (
      /* Don't allow mixing weird looking characters with ASCII */
      !i && /* Is there an obviously weird looking character? */
      s ? 0 : this.options.invisibleCharacters && !ci(t) && De.isInvisibleCharacter(n) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(n) ? 3 : 0
    );
  }
}
function ci(e) {
  return e === " " || e === `
` || e === "	";
}
var Ue = globalThis && globalThis.__awaiter || function(e, t, r, n) {
  function i(s) {
    return s instanceof r ? s : new r(function(o) {
      o(s);
    });
  }
  return new (r || (r = Promise))(function(s, o) {
    function l(h) {
      try {
        c(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function u(h) {
      try {
        c(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(l, u);
    }
    c((n = n.apply(e, t || [])).next());
  });
};
class oo extends Rs {
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
    const n = Zr(t.column, Us(r), this._lines[t.lineNumber - 1], 0);
    return n ? new Be(t.lineNumber, n.startColumn, t.lineNumber, n.endColumn) : null;
  }
  words(t) {
    const r = this._lines, n = this._wordenize.bind(this);
    let i = 0, s = "", o = 0, l = [];
    return {
      *[Symbol.iterator]() {
        for (; ; )
          if (o < l.length) {
            const u = s.substring(l[o].start, l[o].end);
            o += 1, yield u;
          } else if (i < r.length)
            s = r[i], l = n(s, t), o = 0, i += 1;
          else
            break;
      }
    };
  }
  getLineWords(t, r) {
    const n = this._lines[t - 1], i = this._wordenize(n, r), s = [];
    for (const o of i)
      s.push({
        word: n.substring(o.start, o.end),
        startColumn: o.start + 1,
        endColumn: o.end + 1
      });
    return s;
  }
  _wordenize(t, r) {
    const n = [];
    let i;
    for (r.lastIndex = 0; (i = r.exec(t)) && i[0].length !== 0; )
      n.push({ start: i.index, end: i.index + i[0].length });
    return n;
  }
  getValueInRange(t) {
    if (t = this._validateRange(t), t.startLineNumber === t.endLineNumber)
      return this._lines[t.startLineNumber - 1].substring(t.startColumn - 1, t.endColumn - 1);
    const r = this._eol, n = t.startLineNumber - 1, i = t.endLineNumber - 1, s = [];
    s.push(this._lines[n].substring(t.startColumn - 1));
    for (let o = n + 1; o < i; o++)
      s.push(this._lines[o]);
    return s.push(this._lines[i].substring(0, t.endColumn - 1)), s.join(r);
  }
  offsetAt(t) {
    return t = this._validatePosition(t), this._ensureLineStarts(), this._lineStarts.getPrefixSum(t.lineNumber - 2) + (t.column - 1);
  }
  positionAt(t) {
    t = Math.floor(t), t = Math.max(0, t), this._ensureLineStarts();
    const r = this._lineStarts.getIndexOf(t), n = this._lines[r.index].length;
    return {
      lineNumber: 1 + r.index,
      column: 1 + Math.min(r.remainder, n)
    };
  }
  _validateRange(t) {
    const r = this._validatePosition({ lineNumber: t.startLineNumber, column: t.startColumn }), n = this._validatePosition({ lineNumber: t.endLineNumber, column: t.endColumn });
    return r.lineNumber !== t.startLineNumber || r.column !== t.startColumn || n.lineNumber !== t.endLineNumber || n.column !== t.endColumn ? {
      startLineNumber: r.lineNumber,
      startColumn: r.column,
      endLineNumber: n.lineNumber,
      endColumn: n.column
    } : t;
  }
  _validatePosition(t) {
    if (!He.isIPosition(t))
      throw new Error("bad position");
    let { lineNumber: r, column: n } = t, i = !1;
    if (r < 1)
      r = 1, n = 1, i = !0;
    else if (r > this._lines.length)
      r = this._lines.length, n = this._lines[r - 1].length + 1, i = !0;
    else {
      const s = this._lines[r - 1].length + 1;
      n < 1 ? (n = 1, i = !0) : n > s && (n = s, i = !0);
    }
    return i ? { lineNumber: r, column: n } : t;
  }
}
class $e {
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
    this._models[t.url] = new oo(Jr.parse(t.url), t.lines, t.EOL, t.versionId);
  }
  acceptModelChanged(t, r) {
    if (!this._models[t])
      return;
    this._models[t].onEvents(r);
  }
  acceptRemovedModel(t) {
    this._models[t] && delete this._models[t];
  }
  computeUnicodeHighlights(t, r, n) {
    return Ue(this, void 0, void 0, function* () {
      const i = this._getModel(t);
      return i ? ao.computeUnicodeHighlights(i, r, n) : { ranges: [], hasMore: !1, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
    });
  }
  // ---- BEGIN diff --------------------------------------------------------------------------
  computeDiff(t, r, n, i) {
    return Ue(this, void 0, void 0, function* () {
      const s = this._getModel(t), o = this._getModel(r);
      return !s || !o ? null : $e.computeDiff(s, o, n, i);
    });
  }
  static computeDiff(t, r, n, i) {
    const s = t.getLinesContent(), o = r.getLinesContent(), u = new Fs(s, o, {
      shouldComputeCharChanges: !0,
      shouldPostProcessCharChanges: !0,
      shouldIgnoreTrimWhitespace: n,
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
    const n = t.getLineCount(), i = r.getLineCount();
    if (n !== i)
      return !1;
    for (let s = 1; s <= n; s++) {
      const o = t.getLineContent(s), l = r.getLineContent(s);
      if (o !== l)
        return !1;
    }
    return !0;
  }
  computeMoreMinimalEdits(t, r) {
    return Ue(this, void 0, void 0, function* () {
      const n = this._getModel(t);
      if (!n)
        return r;
      const i = [];
      let s;
      r = r.slice(0).sort((o, l) => {
        if (o.range && l.range)
          return Be.compareRangesUsingStarts(o.range, l.range);
        const u = o.range ? 0 : 1, c = l.range ? 0 : 1;
        return u - c;
      });
      for (let { range: o, text: l, eol: u } of r) {
        if (typeof u == "number" && (s = u), Be.isEmpty(o) && !l)
          continue;
        const c = n.getValueInRange(o);
        if (l = l.replace(/\r\n|\n|\r/g, n.eol), c === l)
          continue;
        if (Math.max(l.length, c.length) > $e._diffLimit) {
          i.push({ range: o, text: l });
          continue;
        }
        const h = ps(c, l, !1), f = n.offsetAt(Be.lift(o).getStartPosition());
        for (const d of h) {
          const m = n.positionAt(f + d.originalStart), v = n.positionAt(f + d.originalStart + d.originalLength), p = {
            text: l.substr(d.modifiedStart, d.modifiedLength),
            range: { startLineNumber: m.lineNumber, startColumn: m.column, endLineNumber: v.lineNumber, endColumn: v.column }
          };
          n.getValueInRange(p.range) !== p.text && i.push(p);
        }
      }
      return typeof s == "number" && i.push({ eol: s, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } }), i;
    });
  }
  // ---- END minimal edits ---------------------------------------------------------------
  computeLinks(t) {
    return Ue(this, void 0, void 0, function* () {
      const r = this._getModel(t);
      return r ? Hs(r) : null;
    });
  }
  textualSuggest(t, r, n, i) {
    return Ue(this, void 0, void 0, function* () {
      const s = new Xt(!0), o = new RegExp(n, i), l = /* @__PURE__ */ new Set();
      e:
        for (const u of t) {
          const c = this._getModel(u);
          if (c) {
            for (const h of c.words(o))
              if (!(h === r || !isNaN(Number(h))) && (l.add(h), l.size > $e._suggestionsLimit))
                break e;
          }
        }
      return { words: Array.from(l), duration: s.elapsed() };
    });
  }
  // ---- END suggest --------------------------------------------------------------------------
  //#region -- word ranges --
  computeWordRanges(t, r, n, i) {
    return Ue(this, void 0, void 0, function* () {
      const s = this._getModel(t);
      if (!s)
        return /* @__PURE__ */ Object.create(null);
      const o = new RegExp(n, i), l = /* @__PURE__ */ Object.create(null);
      for (let u = r.startLineNumber; u < r.endLineNumber; u++) {
        const c = s.getLineWords(u, o);
        for (const h of c) {
          if (!isNaN(Number(h.word)))
            continue;
          let f = l[h.word];
          f || (f = [], l[h.word] = f), f.push({
            startLineNumber: u,
            startColumn: h.startColumn,
            endLineNumber: u,
            endColumn: h.endColumn
          });
        }
      }
      return l;
    });
  }
  //#endregion
  navigateValueSet(t, r, n, i, s) {
    return Ue(this, void 0, void 0, function* () {
      const o = this._getModel(t);
      if (!o)
        return null;
      const l = new RegExp(i, s);
      r.startColumn === r.endColumn && (r = {
        startLineNumber: r.startLineNumber,
        startColumn: r.startColumn,
        endLineNumber: r.endLineNumber,
        endColumn: r.endColumn + 1
      });
      const u = o.getValueInRange(r), c = o.getWordAtPosition({ lineNumber: r.startLineNumber, column: r.startColumn }, l);
      if (!c)
        return null;
      const h = o.getValueInRange(c);
      return Ar.INSTANCE.navigateValueSet(r, u, c, h, n);
    });
  }
  // ---- BEGIN foreign module support --------------------------------------------------------------------------
  loadForeignModule(t, r, n) {
    const o = {
      host: Za(n, (l, u) => this._host.fhr(l, u)),
      getMirrorModels: () => this._getModels()
    };
    return this._foreignModuleFactory ? (this._foreignModule = this._foreignModuleFactory(o, r), Promise.resolve(pr(this._foreignModule))) : Promise.reject(new Error("Unexpected usage"));
  }
  // foreign method request
  fmr(t, r) {
    if (!this._foreignModule || typeof this._foreignModule[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._foreignModule[t].apply(this._foreignModule, r));
    } catch (n) {
      return Promise.reject(n);
    }
  }
}
$e._diffLimit = 1e5;
$e._suggestionsLimit = 1e4;
typeof importScripts == "function" && (re.monaco = eo());
let Er = !1;
function fa(e) {
  if (Er)
    return;
  Er = !0;
  const t = new ms((r) => {
    self.postMessage(r);
  }, (r) => new $e(r, e));
  self.onmessage = (r) => {
    t.onmessage(r.data);
  };
}
self.onmessage = (e) => {
  Er || fa(null);
};
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
function Yr(e, t) {
  t === void 0 && (t = !1);
  var r = e.length, n = 0, i = "", s = 0, o = 16, l = 0, u = 0, c = 0, h = 0, f = 0;
  function d(C, N) {
    for (var x = 0, w = 0; x < C || !N; ) {
      var b = e.charCodeAt(n);
      if (b >= 48 && b <= 57)
        w = w * 16 + b - 48;
      else if (b >= 65 && b <= 70)
        w = w * 16 + b - 65 + 10;
      else if (b >= 97 && b <= 102)
        w = w * 16 + b - 97 + 10;
      else
        break;
      n++, x++;
    }
    return x < C && (w = -1), w;
  }
  function m(C) {
    n = C, i = "", s = 0, o = 16, f = 0;
  }
  function v() {
    var C = n;
    if (e.charCodeAt(n) === 48)
      n++;
    else
      for (n++; n < e.length && et(e.charCodeAt(n)); )
        n++;
    if (n < e.length && e.charCodeAt(n) === 46)
      if (n++, n < e.length && et(e.charCodeAt(n)))
        for (n++; n < e.length && et(e.charCodeAt(n)); )
          n++;
      else
        return f = 3, e.substring(C, n);
    var N = n;
    if (n < e.length && (e.charCodeAt(n) === 69 || e.charCodeAt(n) === 101))
      if (n++, (n < e.length && e.charCodeAt(n) === 43 || e.charCodeAt(n) === 45) && n++, n < e.length && et(e.charCodeAt(n))) {
        for (n++; n < e.length && et(e.charCodeAt(n)); )
          n++;
        N = n;
      } else
        f = 3;
    return e.substring(C, N);
  }
  function p() {
    for (var C = "", N = n; ; ) {
      if (n >= r) {
        C += e.substring(N, n), f = 2;
        break;
      }
      var x = e.charCodeAt(n);
      if (x === 34) {
        C += e.substring(N, n), n++;
        break;
      }
      if (x === 92) {
        if (C += e.substring(N, n), n++, n >= r) {
          f = 2;
          break;
        }
        var w = e.charCodeAt(n++);
        switch (w) {
          case 34:
            C += '"';
            break;
          case 92:
            C += "\\";
            break;
          case 47:
            C += "/";
            break;
          case 98:
            C += "\b";
            break;
          case 102:
            C += "\f";
            break;
          case 110:
            C += `
`;
            break;
          case 114:
            C += "\r";
            break;
          case 116:
            C += "	";
            break;
          case 117:
            var b = d(4, !0);
            b >= 0 ? C += String.fromCharCode(b) : f = 4;
            break;
          default:
            f = 5;
        }
        N = n;
        continue;
      }
      if (x >= 0 && x <= 31)
        if (ut(x)) {
          C += e.substring(N, n), f = 2;
          break;
        } else
          f = 6;
      n++;
    }
    return C;
  }
  function g() {
    if (i = "", f = 0, s = n, u = l, h = c, n >= r)
      return s = r, o = 17;
    var C = e.charCodeAt(n);
    if (ar(C)) {
      do
        n++, i += String.fromCharCode(C), C = e.charCodeAt(n);
      while (ar(C));
      return o = 15;
    }
    if (ut(C))
      return n++, i += String.fromCharCode(C), C === 13 && e.charCodeAt(n) === 10 && (n++, i += `
`), l++, c = n, o = 14;
    switch (C) {
      case 123:
        return n++, o = 1;
      case 125:
        return n++, o = 2;
      case 91:
        return n++, o = 3;
      case 93:
        return n++, o = 4;
      case 58:
        return n++, o = 6;
      case 44:
        return n++, o = 5;
      case 34:
        return n++, i = p(), o = 10;
      case 47:
        var N = n - 1;
        if (e.charCodeAt(n + 1) === 47) {
          for (n += 2; n < r && !ut(e.charCodeAt(n)); )
            n++;
          return i = e.substring(N, n), o = 12;
        }
        if (e.charCodeAt(n + 1) === 42) {
          n += 2;
          for (var x = r - 1, w = !1; n < x; ) {
            var b = e.charCodeAt(n);
            if (b === 42 && e.charCodeAt(n + 1) === 47) {
              n += 2, w = !0;
              break;
            }
            n++, ut(b) && (b === 13 && e.charCodeAt(n) === 10 && n++, l++, c = n);
          }
          return w || (n++, f = 1), i = e.substring(N, n), o = 13;
        }
        return i += String.fromCharCode(C), n++, o = 16;
      case 45:
        if (i += String.fromCharCode(C), n++, n === r || !et(e.charCodeAt(n)))
          return o = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return i += v(), o = 11;
      default:
        for (; n < r && A(C); )
          n++, C = e.charCodeAt(n);
        if (s !== n) {
          switch (i = e.substring(s, n), i) {
            case "true":
              return o = 8;
            case "false":
              return o = 9;
            case "null":
              return o = 7;
          }
          return o = 16;
        }
        return i += String.fromCharCode(C), n++, o = 16;
    }
  }
  function A(C) {
    if (ar(C) || ut(C))
      return !1;
    switch (C) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return !1;
    }
    return !0;
  }
  function S() {
    var C;
    do
      C = g();
    while (C >= 12 && C <= 15);
    return C;
  }
  return {
    setPosition: m,
    getPosition: function() {
      return n;
    },
    scan: t ? S : g,
    getToken: function() {
      return o;
    },
    getTokenValue: function() {
      return i;
    },
    getTokenOffset: function() {
      return s;
    },
    getTokenLength: function() {
      return n - s;
    },
    getTokenStartLine: function() {
      return u;
    },
    getTokenStartCharacter: function() {
      return s - h;
    },
    getTokenError: function() {
      return f;
    }
  };
}
function ar(e) {
  return e === 32 || e === 9 || e === 11 || e === 12 || e === 160 || e === 5760 || e >= 8192 && e <= 8203 || e === 8239 || e === 8287 || e === 12288 || e === 65279;
}
function ut(e) {
  return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function et(e) {
  return e >= 48 && e <= 57;
}
function lo(e, t, r) {
  var n, i, s, o, l;
  if (t) {
    for (o = t.offset, l = o + t.length, s = o; s > 0 && !fi(e, s - 1); )
      s--;
    for (var u = l; u < e.length && !fi(e, u); )
      u++;
    i = e.substring(s, u), n = uo(i, r);
  } else
    i = e, n = 0, s = 0, o = 0, l = e.length;
  var c = co(r, e), h = !1, f = 0, d;
  r.insertSpaces ? d = sr(" ", r.tabSize || 4) : d = "	";
  var m = Yr(i, !1), v = !1;
  function p() {
    return c + sr(d, n + f);
  }
  function g() {
    var P = m.scan();
    for (h = !1; P === 15 || P === 14; )
      h = h || P === 14, P = m.scan();
    return v = P === 16 || m.getTokenError() !== 0, P;
  }
  var A = [];
  function S(P, I, B) {
    !v && (!t || I < l && B > o) && e.substring(I, B) !== P && A.push({ offset: I, length: B - I, content: P });
  }
  var C = g();
  if (C !== 17) {
    var N = m.getTokenOffset() + s, x = sr(d, n);
    S(x, s, N);
  }
  for (; C !== 17; ) {
    for (var w = m.getTokenOffset() + m.getTokenLength() + s, b = g(), y = "", _ = !1; !h && (b === 12 || b === 13); ) {
      var k = m.getTokenOffset() + s;
      S(" ", w, k), w = m.getTokenOffset() + m.getTokenLength() + s, _ = b === 12, y = _ ? p() : "", b = g();
    }
    if (b === 2)
      C !== 1 && (f--, y = p());
    else if (b === 4)
      C !== 3 && (f--, y = p());
    else {
      switch (C) {
        case 3:
        case 1:
          f++, y = p();
          break;
        case 5:
        case 12:
          y = p();
          break;
        case 13:
          h ? y = p() : _ || (y = " ");
          break;
        case 6:
          _ || (y = " ");
          break;
        case 10:
          if (b === 6) {
            _ || (y = "");
            break;
          }
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          b === 12 || b === 13 ? _ || (y = " ") : b !== 5 && b !== 17 && (v = !0);
          break;
        case 16:
          v = !0;
          break;
      }
      h && (b === 12 || b === 13) && (y = p());
    }
    b === 17 && (y = r.insertFinalNewline ? c : "");
    var T = m.getTokenOffset() + s;
    S(y, w, T), C = b;
  }
  return A;
}
function sr(e, t) {
  for (var r = "", n = 0; n < t; n++)
    r += e;
  return r;
}
function uo(e, t) {
  for (var r = 0, n = 0, i = t.tabSize || 4; r < e.length; ) {
    var s = e.charAt(r);
    if (s === " ")
      n++;
    else if (s === "	")
      n += i;
    else
      break;
    r++;
  }
  return Math.floor(n / i);
}
function co(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t.charAt(r);
    if (n === "\r")
      return r + 1 < t.length && t.charAt(r + 1) === `
` ? `\r
` : "\r";
    if (n === `
`)
      return `
`;
  }
  return e && e.eol || `
`;
}
function fi(e, t) {
  return `\r
`.indexOf(e.charAt(t)) !== -1;
}
var $t;
(function(e) {
  e.DEFAULT = {
    allowTrailingComma: !1
  };
})($t || ($t = {}));
function fo(e, t, r) {
  t === void 0 && (t = []), r === void 0 && (r = $t.DEFAULT);
  var n = null, i = [], s = [];
  function o(u) {
    Array.isArray(i) ? i.push(u) : n !== null && (i[n] = u);
  }
  var l = {
    onObjectBegin: function() {
      var u = {};
      o(u), s.push(i), i = u, n = null;
    },
    onObjectProperty: function(u) {
      n = u;
    },
    onObjectEnd: function() {
      i = s.pop();
    },
    onArrayBegin: function() {
      var u = [];
      o(u), s.push(i), i = u, n = null;
    },
    onArrayEnd: function() {
      i = s.pop();
    },
    onLiteralValue: o,
    onError: function(u, c, h) {
      t.push({ error: u, offset: c, length: h });
    }
  };
  return mo(e, l, r), i[0];
}
function ha(e) {
  if (!e.parent || !e.parent.children)
    return [];
  var t = ha(e.parent);
  if (e.parent.type === "property") {
    var r = e.parent.children[0].value;
    t.push(r);
  } else if (e.parent.type === "array") {
    var n = e.parent.children.indexOf(e);
    n !== -1 && t.push(n);
  }
  return t;
}
function Fr(e) {
  switch (e.type) {
    case "array":
      return e.children.map(Fr);
    case "object":
      for (var t = /* @__PURE__ */ Object.create(null), r = 0, n = e.children; r < n.length; r++) {
        var i = n[r], s = i.children[1];
        s && (t[i.children[0].value] = Fr(s));
      }
      return t;
    case "null":
    case "string":
    case "number":
    case "boolean":
      return e.value;
    default:
      return;
  }
}
function ho(e, t, r) {
  return r === void 0 && (r = !1), t >= e.offset && t < e.offset + e.length || r && t === e.offset + e.length;
}
function da(e, t, r) {
  if (r === void 0 && (r = !1), ho(e, t, r)) {
    var n = e.children;
    if (Array.isArray(n))
      for (var i = 0; i < n.length && n[i].offset <= t; i++) {
        var s = da(n[i], t, r);
        if (s)
          return s;
      }
    return e;
  }
}
function mo(e, t, r) {
  r === void 0 && (r = $t.DEFAULT);
  var n = Yr(e, !1);
  function i(_) {
    return _ ? function() {
      return _(n.getTokenOffset(), n.getTokenLength(), n.getTokenStartLine(), n.getTokenStartCharacter());
    } : function() {
      return !0;
    };
  }
  function s(_) {
    return _ ? function(k) {
      return _(k, n.getTokenOffset(), n.getTokenLength(), n.getTokenStartLine(), n.getTokenStartCharacter());
    } : function() {
      return !0;
    };
  }
  var o = i(t.onObjectBegin), l = s(t.onObjectProperty), u = i(t.onObjectEnd), c = i(t.onArrayBegin), h = i(t.onArrayEnd), f = s(t.onLiteralValue), d = s(t.onSeparator), m = i(t.onComment), v = s(t.onError), p = r && r.disallowComments, g = r && r.allowTrailingComma;
  function A() {
    for (; ; ) {
      var _ = n.scan();
      switch (n.getTokenError()) {
        case 4:
          S(14);
          break;
        case 5:
          S(15);
          break;
        case 3:
          S(13);
          break;
        case 1:
          p || S(11);
          break;
        case 2:
          S(12);
          break;
        case 6:
          S(16);
          break;
      }
      switch (_) {
        case 12:
        case 13:
          p ? S(10) : m();
          break;
        case 16:
          S(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return _;
      }
    }
  }
  function S(_, k, T) {
    if (k === void 0 && (k = []), T === void 0 && (T = []), v(_), k.length + T.length > 0)
      for (var P = n.getToken(); P !== 17; ) {
        if (k.indexOf(P) !== -1) {
          A();
          break;
        } else if (T.indexOf(P) !== -1)
          break;
        P = A();
      }
  }
  function C(_) {
    var k = n.getTokenValue();
    return _ ? f(k) : l(k), A(), !0;
  }
  function N() {
    switch (n.getToken()) {
      case 11:
        var _ = n.getTokenValue(), k = Number(_);
        isNaN(k) && (S(2), k = 0), f(k);
        break;
      case 7:
        f(null);
        break;
      case 8:
        f(!0);
        break;
      case 9:
        f(!1);
        break;
      default:
        return !1;
    }
    return A(), !0;
  }
  function x() {
    return n.getToken() !== 10 ? (S(3, [], [2, 5]), !1) : (C(!1), n.getToken() === 6 ? (d(":"), A(), y() || S(4, [], [2, 5])) : S(5, [], [2, 5]), !0);
  }
  function w() {
    o(), A();
    for (var _ = !1; n.getToken() !== 2 && n.getToken() !== 17; ) {
      if (n.getToken() === 5) {
        if (_ || S(4, [], []), d(","), A(), n.getToken() === 2 && g)
          break;
      } else
        _ && S(6, [], []);
      x() || S(4, [], [2, 5]), _ = !0;
    }
    return u(), n.getToken() !== 2 ? S(7, [2], []) : A(), !0;
  }
  function b() {
    c(), A();
    for (var _ = !1; n.getToken() !== 4 && n.getToken() !== 17; ) {
      if (n.getToken() === 5) {
        if (_ || S(4, [], []), d(","), A(), n.getToken() === 4 && g)
          break;
      } else
        _ && S(6, [], []);
      y() || S(4, [], [4, 5]), _ = !0;
    }
    return h(), n.getToken() !== 4 ? S(8, [4], []) : A(), !0;
  }
  function y() {
    switch (n.getToken()) {
      case 3:
        return b();
      case 1:
        return w();
      case 10:
        return C(!0);
      default:
        return N();
    }
  }
  return A(), n.getToken() === 17 ? r.allowEmptyContent ? !0 : (S(4, [], []), !1) : y() ? (n.getToken() !== 17 && S(9, [], []), !0) : (S(4, [], []), !1);
}
var nt = Yr, go = fo, po = da, vo = ha, bo = Fr;
function wo(e, t, r) {
  return lo(e, t, r);
}
function dt(e, t) {
  if (e === t)
    return !0;
  if (e == null || t === null || t === void 0 || typeof e != typeof t || typeof e != "object" || Array.isArray(e) !== Array.isArray(t))
    return !1;
  var r, n;
  if (Array.isArray(e)) {
    if (e.length !== t.length)
      return !1;
    for (r = 0; r < e.length; r++)
      if (!dt(e[r], t[r]))
        return !1;
  } else {
    var i = [];
    for (n in e)
      i.push(n);
    i.sort();
    var s = [];
    for (n in t)
      s.push(n);
    if (s.sort(), !dt(i, s))
      return !1;
    for (r = 0; r < i.length; r++)
      if (!dt(e[i[r]], t[i[r]]))
        return !1;
  }
  return !0;
}
function ce(e) {
  return typeof e == "number";
}
function Le(e) {
  return typeof e < "u";
}
function Ae(e) {
  return typeof e == "boolean";
}
function yo(e) {
  return typeof e == "string";
}
function Co(e, t) {
  if (e.length < t.length)
    return !1;
  for (var r = 0; r < t.length; r++)
    if (e[r] !== t[r])
      return !1;
  return !0;
}
function vt(e, t) {
  var r = e.length - t.length;
  return r > 0 ? e.lastIndexOf(t) === r : r === 0 ? e === t : !1;
}
function qt(e) {
  var t = "";
  Co(e, "(?i)") && (e = e.substring(4), t = "i");
  try {
    return new RegExp(e, t + "u");
  } catch {
    try {
      return new RegExp(e, t);
    } catch {
      return;
    }
  }
}
var hi;
(function(e) {
  e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
})(hi || (hi = {}));
var Wt;
(function(e) {
  e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
})(Wt || (Wt = {}));
var ve;
(function(e) {
  function t(n, i) {
    return n === Number.MAX_VALUE && (n = Wt.MAX_VALUE), i === Number.MAX_VALUE && (i = Wt.MAX_VALUE), { line: n, character: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.objectLiteral(i) && L.uinteger(i.line) && L.uinteger(i.character);
  }
  e.is = r;
})(ve || (ve = {}));
var H;
(function(e) {
  function t(n, i, s, o) {
    if (L.uinteger(n) && L.uinteger(i) && L.uinteger(s) && L.uinteger(o))
      return { start: ve.create(n, i), end: ve.create(s, o) };
    if (ve.is(n) && ve.is(i))
      return { start: n, end: i };
    throw new Error("Range#create called with invalid arguments[" + n + ", " + i + ", " + s + ", " + o + "]");
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.objectLiteral(i) && ve.is(i.start) && ve.is(i.end);
  }
  e.is = r;
})(H || (H = {}));
var bt;
(function(e) {
  function t(n, i) {
    return { uri: n, range: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && H.is(i.range) && (L.string(i.uri) || L.undefined(i.uri));
  }
  e.is = r;
})(bt || (bt = {}));
var di;
(function(e) {
  function t(n, i, s, o) {
    return { targetUri: n, targetRange: i, targetSelectionRange: s, originSelectionRange: o };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && H.is(i.targetRange) && L.string(i.targetUri) && (H.is(i.targetSelectionRange) || L.undefined(i.targetSelectionRange)) && (H.is(i.originSelectionRange) || L.undefined(i.originSelectionRange));
  }
  e.is = r;
})(di || (di = {}));
var Vr;
(function(e) {
  function t(n, i, s, o) {
    return {
      red: n,
      green: i,
      blue: s,
      alpha: o
    };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.numberRange(i.red, 0, 1) && L.numberRange(i.green, 0, 1) && L.numberRange(i.blue, 0, 1) && L.numberRange(i.alpha, 0, 1);
  }
  e.is = r;
})(Vr || (Vr = {}));
var mi;
(function(e) {
  function t(n, i) {
    return {
      range: n,
      color: i
    };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return H.is(i.range) && Vr.is(i.color);
  }
  e.is = r;
})(mi || (mi = {}));
var gi;
(function(e) {
  function t(n, i, s) {
    return {
      label: n,
      textEdit: i,
      additionalTextEdits: s
    };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.string(i.label) && (L.undefined(i.textEdit) || be.is(i)) && (L.undefined(i.additionalTextEdits) || L.typedArray(i.additionalTextEdits, be.is));
  }
  e.is = r;
})(gi || (gi = {}));
var mt;
(function(e) {
  e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(mt || (mt = {}));
var pi;
(function(e) {
  function t(n, i, s, o, l) {
    var u = {
      startLine: n,
      endLine: i
    };
    return L.defined(s) && (u.startCharacter = s), L.defined(o) && (u.endCharacter = o), L.defined(l) && (u.kind = l), u;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.uinteger(i.startLine) && L.uinteger(i.startLine) && (L.undefined(i.startCharacter) || L.uinteger(i.startCharacter)) && (L.undefined(i.endCharacter) || L.uinteger(i.endCharacter)) && (L.undefined(i.kind) || L.string(i.kind));
  }
  e.is = r;
})(pi || (pi = {}));
var Ir;
(function(e) {
  function t(n, i) {
    return {
      location: n,
      message: i
    };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && bt.is(i.location) && L.string(i.message);
  }
  e.is = r;
})(Ir || (Ir = {}));
var de;
(function(e) {
  e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(de || (de = {}));
var vi;
(function(e) {
  e.Unnecessary = 1, e.Deprecated = 2;
})(vi || (vi = {}));
var bi;
(function(e) {
  function t(r) {
    var n = r;
    return n != null && L.string(n.href);
  }
  e.is = t;
})(bi || (bi = {}));
var ke;
(function(e) {
  function t(n, i, s, o, l, u) {
    var c = { range: n, message: i };
    return L.defined(s) && (c.severity = s), L.defined(o) && (c.code = o), L.defined(l) && (c.source = l), L.defined(u) && (c.relatedInformation = u), c;
  }
  e.create = t;
  function r(n) {
    var i, s = n;
    return L.defined(s) && H.is(s.range) && L.string(s.message) && (L.number(s.severity) || L.undefined(s.severity)) && (L.integer(s.code) || L.string(s.code) || L.undefined(s.code)) && (L.undefined(s.codeDescription) || L.string((i = s.codeDescription) === null || i === void 0 ? void 0 : i.href)) && (L.string(s.source) || L.undefined(s.source)) && (L.undefined(s.relatedInformation) || L.typedArray(s.relatedInformation, Ir.is));
  }
  e.is = r;
})(ke || (ke = {}));
var wt;
(function(e) {
  function t(n, i) {
    for (var s = [], o = 2; o < arguments.length; o++)
      s[o - 2] = arguments[o];
    var l = { title: n, command: i };
    return L.defined(s) && s.length > 0 && (l.arguments = s), l;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.string(i.title) && L.string(i.command);
  }
  e.is = r;
})(wt || (wt = {}));
var be;
(function(e) {
  function t(s, o) {
    return { range: s, newText: o };
  }
  e.replace = t;
  function r(s, o) {
    return { range: { start: s, end: s }, newText: o };
  }
  e.insert = r;
  function n(s) {
    return { range: s, newText: "" };
  }
  e.del = n;
  function i(s) {
    var o = s;
    return L.objectLiteral(o) && L.string(o.newText) && H.is(o.range);
  }
  e.is = i;
})(be || (be = {}));
var it;
(function(e) {
  function t(n, i, s) {
    var o = { label: n };
    return i !== void 0 && (o.needsConfirmation = i), s !== void 0 && (o.description = s), o;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i !== void 0 && L.objectLiteral(i) && L.string(i.label) && (L.boolean(i.needsConfirmation) || i.needsConfirmation === void 0) && (L.string(i.description) || i.description === void 0);
  }
  e.is = r;
})(it || (it = {}));
var ie;
(function(e) {
  function t(r) {
    var n = r;
    return typeof n == "string";
  }
  e.is = t;
})(ie || (ie = {}));
var Ie;
(function(e) {
  function t(s, o, l) {
    return { range: s, newText: o, annotationId: l };
  }
  e.replace = t;
  function r(s, o, l) {
    return { range: { start: s, end: s }, newText: o, annotationId: l };
  }
  e.insert = r;
  function n(s, o) {
    return { range: s, newText: "", annotationId: o };
  }
  e.del = n;
  function i(s) {
    var o = s;
    return be.is(o) && (it.is(o.annotationId) || ie.is(o.annotationId));
  }
  e.is = i;
})(Ie || (Ie = {}));
var Ht;
(function(e) {
  function t(n, i) {
    return { textDocument: n, edits: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && zt.is(i.textDocument) && Array.isArray(i.edits);
  }
  e.is = r;
})(Ht || (Ht = {}));
var yt;
(function(e) {
  function t(n, i, s) {
    var o = {
      kind: "create",
      uri: n
    };
    return i !== void 0 && (i.overwrite !== void 0 || i.ignoreIfExists !== void 0) && (o.options = i), s !== void 0 && (o.annotationId = s), o;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && i.kind === "create" && L.string(i.uri) && (i.options === void 0 || (i.options.overwrite === void 0 || L.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || L.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ie.is(i.annotationId));
  }
  e.is = r;
})(yt || (yt = {}));
var Ct;
(function(e) {
  function t(n, i, s, o) {
    var l = {
      kind: "rename",
      oldUri: n,
      newUri: i
    };
    return s !== void 0 && (s.overwrite !== void 0 || s.ignoreIfExists !== void 0) && (l.options = s), o !== void 0 && (l.annotationId = o), l;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && i.kind === "rename" && L.string(i.oldUri) && L.string(i.newUri) && (i.options === void 0 || (i.options.overwrite === void 0 || L.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || L.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ie.is(i.annotationId));
  }
  e.is = r;
})(Ct || (Ct = {}));
var _t;
(function(e) {
  function t(n, i, s) {
    var o = {
      kind: "delete",
      uri: n
    };
    return i !== void 0 && (i.recursive !== void 0 || i.ignoreIfNotExists !== void 0) && (o.options = i), s !== void 0 && (o.annotationId = s), o;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && i.kind === "delete" && L.string(i.uri) && (i.options === void 0 || (i.options.recursive === void 0 || L.boolean(i.options.recursive)) && (i.options.ignoreIfNotExists === void 0 || L.boolean(i.options.ignoreIfNotExists))) && (i.annotationId === void 0 || ie.is(i.annotationId));
  }
  e.is = r;
})(_t || (_t = {}));
var Rr;
(function(e) {
  function t(r) {
    var n = r;
    return n && (n.changes !== void 0 || n.documentChanges !== void 0) && (n.documentChanges === void 0 || n.documentChanges.every(function(i) {
      return L.string(i.kind) ? yt.is(i) || Ct.is(i) || _t.is(i) : Ht.is(i);
    }));
  }
  e.is = t;
})(Rr || (Rr = {}));
var kt = function() {
  function e(t, r) {
    this.edits = t, this.changeAnnotations = r;
  }
  return e.prototype.insert = function(t, r, n) {
    var i, s;
    if (n === void 0 ? i = be.insert(t, r) : ie.is(n) ? (s = n, i = Ie.insert(t, r, n)) : (this.assertChangeAnnotations(this.changeAnnotations), s = this.changeAnnotations.manage(n), i = Ie.insert(t, r, s)), this.edits.push(i), s !== void 0)
      return s;
  }, e.prototype.replace = function(t, r, n) {
    var i, s;
    if (n === void 0 ? i = be.replace(t, r) : ie.is(n) ? (s = n, i = Ie.replace(t, r, n)) : (this.assertChangeAnnotations(this.changeAnnotations), s = this.changeAnnotations.manage(n), i = Ie.replace(t, r, s)), this.edits.push(i), s !== void 0)
      return s;
  }, e.prototype.delete = function(t, r) {
    var n, i;
    if (r === void 0 ? n = be.del(t) : ie.is(r) ? (i = r, n = Ie.del(t, r)) : (this.assertChangeAnnotations(this.changeAnnotations), i = this.changeAnnotations.manage(r), n = Ie.del(t, i)), this.edits.push(n), i !== void 0)
      return i;
  }, e.prototype.add = function(t) {
    this.edits.push(t);
  }, e.prototype.all = function() {
    return this.edits;
  }, e.prototype.clear = function() {
    this.edits.splice(0, this.edits.length);
  }, e.prototype.assertChangeAnnotations = function(t) {
    if (t === void 0)
      throw new Error("Text edit change is not configured to manage change annotations.");
  }, e;
}(), wi = function() {
  function e(t) {
    this._annotations = t === void 0 ? /* @__PURE__ */ Object.create(null) : t, this._counter = 0, this._size = 0;
  }
  return e.prototype.all = function() {
    return this._annotations;
  }, Object.defineProperty(e.prototype, "size", {
    get: function() {
      return this._size;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.manage = function(t, r) {
    var n;
    if (ie.is(t) ? n = t : (n = this.nextId(), r = t), this._annotations[n] !== void 0)
      throw new Error("Id " + n + " is already in use.");
    if (r === void 0)
      throw new Error("No annotation provided for id " + n);
    return this._annotations[n] = r, this._size++, n;
  }, e.prototype.nextId = function() {
    return this._counter++, this._counter.toString();
  }, e;
}();
(function() {
  function e(t) {
    var r = this;
    this._textEditChanges = /* @__PURE__ */ Object.create(null), t !== void 0 ? (this._workspaceEdit = t, t.documentChanges ? (this._changeAnnotations = new wi(t.changeAnnotations), t.changeAnnotations = this._changeAnnotations.all(), t.documentChanges.forEach(function(n) {
      if (Ht.is(n)) {
        var i = new kt(n.edits, r._changeAnnotations);
        r._textEditChanges[n.textDocument.uri] = i;
      }
    })) : t.changes && Object.keys(t.changes).forEach(function(n) {
      var i = new kt(t.changes[n]);
      r._textEditChanges[n] = i;
    })) : this._workspaceEdit = {};
  }
  return Object.defineProperty(e.prototype, "edit", {
    get: function() {
      return this.initDocumentChanges(), this._changeAnnotations !== void 0 && (this._changeAnnotations.size === 0 ? this._workspaceEdit.changeAnnotations = void 0 : this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()), this._workspaceEdit;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getTextEditChange = function(t) {
    if (zt.is(t)) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var r = { uri: t.uri, version: t.version }, n = this._textEditChanges[r.uri];
      if (!n) {
        var i = [], s = {
          textDocument: r,
          edits: i
        };
        this._workspaceEdit.documentChanges.push(s), n = new kt(i, this._changeAnnotations), this._textEditChanges[r.uri] = n;
      }
      return n;
    } else {
      if (this.initChanges(), this._workspaceEdit.changes === void 0)
        throw new Error("Workspace edit is not configured for normal text edit changes.");
      var n = this._textEditChanges[t];
      if (!n) {
        var i = [];
        this._workspaceEdit.changes[t] = i, n = new kt(i), this._textEditChanges[t] = n;
      }
      return n;
    }
  }, e.prototype.initDocumentChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._changeAnnotations = new wi(), this._workspaceEdit.documentChanges = [], this._workspaceEdit.changeAnnotations = this._changeAnnotations.all());
  }, e.prototype.initChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null));
  }, e.prototype.createFile = function(t, r, n) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    it.is(r) || ie.is(r) ? i = r : n = r;
    var s, o;
    if (i === void 0 ? s = yt.create(t, n) : (o = ie.is(i) ? i : this._changeAnnotations.manage(i), s = yt.create(t, n, o)), this._workspaceEdit.documentChanges.push(s), o !== void 0)
      return o;
  }, e.prototype.renameFile = function(t, r, n, i) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var s;
    it.is(n) || ie.is(n) ? s = n : i = n;
    var o, l;
    if (s === void 0 ? o = Ct.create(t, r, i) : (l = ie.is(s) ? s : this._changeAnnotations.manage(s), o = Ct.create(t, r, i, l)), this._workspaceEdit.documentChanges.push(o), l !== void 0)
      return l;
  }, e.prototype.deleteFile = function(t, r, n) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    it.is(r) || ie.is(r) ? i = r : n = r;
    var s, o;
    if (i === void 0 ? s = _t.create(t, n) : (o = ie.is(i) ? i : this._changeAnnotations.manage(i), s = _t.create(t, n, o)), this._workspaceEdit.documentChanges.push(s), o !== void 0)
      return o;
  }, e;
})();
var yi;
(function(e) {
  function t(n) {
    return { uri: n };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.string(i.uri);
  }
  e.is = r;
})(yi || (yi = {}));
var Ci;
(function(e) {
  function t(n, i) {
    return { uri: n, version: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.string(i.uri) && L.integer(i.version);
  }
  e.is = r;
})(Ci || (Ci = {}));
var zt;
(function(e) {
  function t(n, i) {
    return { uri: n, version: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.string(i.uri) && (i.version === null || L.integer(i.version));
  }
  e.is = r;
})(zt || (zt = {}));
var _i;
(function(e) {
  function t(n, i, s, o) {
    return { uri: n, languageId: i, version: s, text: o };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.string(i.uri) && L.string(i.languageId) && L.integer(i.version) && L.string(i.text);
  }
  e.is = r;
})(_i || (_i = {}));
var xe;
(function(e) {
  e.PlainText = "plaintext", e.Markdown = "markdown";
})(xe || (xe = {}));
(function(e) {
  function t(r) {
    var n = r;
    return n === e.PlainText || n === e.Markdown;
  }
  e.is = t;
})(xe || (xe = {}));
var Dr;
(function(e) {
  function t(r) {
    var n = r;
    return L.objectLiteral(r) && xe.is(n.kind) && L.string(n.value);
  }
  e.is = t;
})(Dr || (Dr = {}));
var he;
(function(e) {
  e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(he || (he = {}));
var Q;
(function(e) {
  e.PlainText = 1, e.Snippet = 2;
})(Q || (Q = {}));
var Si;
(function(e) {
  e.Deprecated = 1;
})(Si || (Si = {}));
var Ai;
(function(e) {
  function t(n, i, s) {
    return { newText: n, insert: i, replace: s };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && L.string(i.newText) && H.is(i.insert) && H.is(i.replace);
  }
  e.is = r;
})(Ai || (Ai = {}));
var Ni;
(function(e) {
  e.asIs = 1, e.adjustIndentation = 2;
})(Ni || (Ni = {}));
var Or;
(function(e) {
  function t(r) {
    return { label: r };
  }
  e.create = t;
})(Or || (Or = {}));
var Li;
(function(e) {
  function t(r, n) {
    return { items: r || [], isIncomplete: !!n };
  }
  e.create = t;
})(Li || (Li = {}));
var Gt;
(function(e) {
  function t(n) {
    return n.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  e.fromPlainText = t;
  function r(n) {
    var i = n;
    return L.string(i) || L.objectLiteral(i) && L.string(i.language) && L.string(i.value);
  }
  e.is = r;
})(Gt || (Gt = {}));
var ki;
(function(e) {
  function t(r) {
    var n = r;
    return !!n && L.objectLiteral(n) && (Dr.is(n.contents) || Gt.is(n.contents) || L.typedArray(n.contents, Gt.is)) && (r.range === void 0 || H.is(r.range));
  }
  e.is = t;
})(ki || (ki = {}));
var xi;
(function(e) {
  function t(r, n) {
    return n ? { label: r, documentation: n } : { label: r };
  }
  e.create = t;
})(xi || (xi = {}));
var Mi;
(function(e) {
  function t(r, n) {
    for (var i = [], s = 2; s < arguments.length; s++)
      i[s - 2] = arguments[s];
    var o = { label: r };
    return L.defined(n) && (o.documentation = n), L.defined(i) ? o.parameters = i : o.parameters = [], o;
  }
  e.create = t;
})(Mi || (Mi = {}));
var Pi;
(function(e) {
  e.Text = 1, e.Read = 2, e.Write = 3;
})(Pi || (Pi = {}));
var Ti;
(function(e) {
  function t(r, n) {
    var i = { range: r };
    return L.number(n) && (i.kind = n), i;
  }
  e.create = t;
})(Ti || (Ti = {}));
var _e;
(function(e) {
  e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(_e || (_e = {}));
var Ei;
(function(e) {
  e.Deprecated = 1;
})(Ei || (Ei = {}));
var Fi;
(function(e) {
  function t(r, n, i, s, o) {
    var l = {
      name: r,
      kind: n,
      location: { uri: s, range: i }
    };
    return o && (l.containerName = o), l;
  }
  e.create = t;
})(Fi || (Fi = {}));
var Vi;
(function(e) {
  function t(n, i, s, o, l, u) {
    var c = {
      name: n,
      detail: i,
      kind: s,
      range: o,
      selectionRange: l
    };
    return u !== void 0 && (c.children = u), c;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && L.string(i.name) && L.number(i.kind) && H.is(i.range) && H.is(i.selectionRange) && (i.detail === void 0 || L.string(i.detail)) && (i.deprecated === void 0 || L.boolean(i.deprecated)) && (i.children === void 0 || Array.isArray(i.children)) && (i.tags === void 0 || Array.isArray(i.tags));
  }
  e.is = r;
})(Vi || (Vi = {}));
var Ii;
(function(e) {
  e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})(Ii || (Ii = {}));
var Ri;
(function(e) {
  function t(n, i) {
    var s = { diagnostics: n };
    return i != null && (s.only = i), s;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.typedArray(i.diagnostics, ke.is) && (i.only === void 0 || L.typedArray(i.only, L.string));
  }
  e.is = r;
})(Ri || (Ri = {}));
var Di;
(function(e) {
  function t(n, i, s) {
    var o = { title: n }, l = !0;
    return typeof i == "string" ? (l = !1, o.kind = i) : wt.is(i) ? o.command = i : o.edit = i, l && s !== void 0 && (o.kind = s), o;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i && L.string(i.title) && (i.diagnostics === void 0 || L.typedArray(i.diagnostics, ke.is)) && (i.kind === void 0 || L.string(i.kind)) && (i.edit !== void 0 || i.command !== void 0) && (i.command === void 0 || wt.is(i.command)) && (i.isPreferred === void 0 || L.boolean(i.isPreferred)) && (i.edit === void 0 || Rr.is(i.edit));
  }
  e.is = r;
})(Di || (Di = {}));
var Oi;
(function(e) {
  function t(n, i) {
    var s = { range: n };
    return L.defined(i) && (s.data = i), s;
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && H.is(i.range) && (L.undefined(i.command) || wt.is(i.command));
  }
  e.is = r;
})(Oi || (Oi = {}));
var Ui;
(function(e) {
  function t(n, i) {
    return { tabSize: n, insertSpaces: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && L.uinteger(i.tabSize) && L.boolean(i.insertSpaces);
  }
  e.is = r;
})(Ui || (Ui = {}));
var ji;
(function(e) {
  function t(n, i, s) {
    return { range: n, target: i, data: s };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return L.defined(i) && H.is(i.range) && (L.undefined(i.target) || L.string(i.target));
  }
  e.is = r;
})(ji || (ji = {}));
var Jt;
(function(e) {
  function t(n, i) {
    return { range: n, parent: i };
  }
  e.create = t;
  function r(n) {
    var i = n;
    return i !== void 0 && H.is(i.range) && (i.parent === void 0 || e.is(i.parent));
  }
  e.is = r;
})(Jt || (Jt = {}));
var Bi;
(function(e) {
  function t(s, o, l, u) {
    return new _o(s, o, l, u);
  }
  e.create = t;
  function r(s) {
    var o = s;
    return !!(L.defined(o) && L.string(o.uri) && (L.undefined(o.languageId) || L.string(o.languageId)) && L.uinteger(o.lineCount) && L.func(o.getText) && L.func(o.positionAt) && L.func(o.offsetAt));
  }
  e.is = r;
  function n(s, o) {
    for (var l = s.getText(), u = i(o, function(v, p) {
      var g = v.range.start.line - p.range.start.line;
      return g === 0 ? v.range.start.character - p.range.start.character : g;
    }), c = l.length, h = u.length - 1; h >= 0; h--) {
      var f = u[h], d = s.offsetAt(f.range.start), m = s.offsetAt(f.range.end);
      if (m <= c)
        l = l.substring(0, d) + f.newText + l.substring(m, l.length);
      else
        throw new Error("Overlapping edit");
      c = d;
    }
    return l;
  }
  e.applyEdits = n;
  function i(s, o) {
    if (s.length <= 1)
      return s;
    var l = s.length / 2 | 0, u = s.slice(0, l), c = s.slice(l);
    i(u, o), i(c, o);
    for (var h = 0, f = 0, d = 0; h < u.length && f < c.length; ) {
      var m = o(u[h], c[f]);
      m <= 0 ? s[d++] = u[h++] : s[d++] = c[f++];
    }
    for (; h < u.length; )
      s[d++] = u[h++];
    for (; f < c.length; )
      s[d++] = c[f++];
    return s;
  }
})(Bi || (Bi = {}));
var _o = function() {
  function e(t, r, n, i) {
    this._uri = t, this._languageId = r, this._version = n, this._content = i, this._lineOffsets = void 0;
  }
  return Object.defineProperty(e.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getText = function(t) {
    if (t) {
      var r = this.offsetAt(t.start), n = this.offsetAt(t.end);
      return this._content.substring(r, n);
    }
    return this._content;
  }, e.prototype.update = function(t, r) {
    this._content = t.text, this._version = r, this._lineOffsets = void 0;
  }, e.prototype.getLineOffsets = function() {
    if (this._lineOffsets === void 0) {
      for (var t = [], r = this._content, n = !0, i = 0; i < r.length; i++) {
        n && (t.push(i), n = !1);
        var s = r.charAt(i);
        n = s === "\r" || s === `
`, s === "\r" && i + 1 < r.length && r.charAt(i + 1) === `
` && i++;
      }
      n && r.length > 0 && t.push(r.length), this._lineOffsets = t;
    }
    return this._lineOffsets;
  }, e.prototype.positionAt = function(t) {
    t = Math.max(Math.min(t, this._content.length), 0);
    var r = this.getLineOffsets(), n = 0, i = r.length;
    if (i === 0)
      return ve.create(0, t);
    for (; n < i; ) {
      var s = Math.floor((n + i) / 2);
      r[s] > t ? i = s : n = s + 1;
    }
    var o = n - 1;
    return ve.create(o, t - r[o]);
  }, e.prototype.offsetAt = function(t) {
    var r = this.getLineOffsets();
    if (t.line >= r.length)
      return this._content.length;
    if (t.line < 0)
      return 0;
    var n = r[t.line], i = t.line + 1 < r.length ? r[t.line + 1] : this._content.length;
    return Math.max(Math.min(n + t.character, i), n);
  }, Object.defineProperty(e.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: !1,
    configurable: !0
  }), e;
}(), L;
(function(e) {
  var t = Object.prototype.toString;
  function r(m) {
    return typeof m < "u";
  }
  e.defined = r;
  function n(m) {
    return typeof m > "u";
  }
  e.undefined = n;
  function i(m) {
    return m === !0 || m === !1;
  }
  e.boolean = i;
  function s(m) {
    return t.call(m) === "[object String]";
  }
  e.string = s;
  function o(m) {
    return t.call(m) === "[object Number]";
  }
  e.number = o;
  function l(m, v, p) {
    return t.call(m) === "[object Number]" && v <= m && m <= p;
  }
  e.numberRange = l;
  function u(m) {
    return t.call(m) === "[object Number]" && -2147483648 <= m && m <= 2147483647;
  }
  e.integer = u;
  function c(m) {
    return t.call(m) === "[object Number]" && 0 <= m && m <= 2147483647;
  }
  e.uinteger = c;
  function h(m) {
    return t.call(m) === "[object Function]";
  }
  e.func = h;
  function f(m) {
    return m !== null && typeof m == "object";
  }
  e.objectLiteral = f;
  function d(m, v) {
    return Array.isArray(m) && m.every(v);
  }
  e.typedArray = d;
})(L || (L = {}));
var Zt = class {
  constructor(e, t, r, n) {
    this._uri = e, this._languageId = t, this._version = r, this._content = n, this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(e) {
    if (e) {
      const t = this.offsetAt(e.start), r = this.offsetAt(e.end);
      return this._content.substring(t, r);
    }
    return this._content;
  }
  update(e, t) {
    for (let r of e)
      if (Zt.isIncremental(r)) {
        const n = ma(r.range), i = this.offsetAt(n.start), s = this.offsetAt(n.end);
        this._content = this._content.substring(0, i) + r.text + this._content.substring(s, this._content.length);
        const o = Math.max(n.start.line, 0), l = Math.max(n.end.line, 0);
        let u = this._lineOffsets;
        const c = $i(r.text, !1, i);
        if (l - o === c.length)
          for (let f = 0, d = c.length; f < d; f++)
            u[f + o + 1] = c[f];
        else
          c.length < 1e4 ? u.splice(o + 1, l - o, ...c) : this._lineOffsets = u = u.slice(0, o + 1).concat(c, u.slice(l + 1));
        const h = r.text.length - (s - i);
        if (h !== 0)
          for (let f = o + 1 + c.length, d = u.length; f < d; f++)
            u[f] = u[f] + h;
      } else if (Zt.isFull(r))
        this._content = r.text, this._lineOffsets = void 0;
      else
        throw new Error("Unknown change event received");
    this._version = t;
  }
  getLineOffsets() {
    return this._lineOffsets === void 0 && (this._lineOffsets = $i(this._content, !0)), this._lineOffsets;
  }
  positionAt(e) {
    e = Math.max(Math.min(e, this._content.length), 0);
    let t = this.getLineOffsets(), r = 0, n = t.length;
    if (n === 0)
      return { line: 0, character: e };
    for (; r < n; ) {
      let s = Math.floor((r + n) / 2);
      t[s] > e ? n = s : r = s + 1;
    }
    let i = r - 1;
    return { line: i, character: e - t[i] };
  }
  offsetAt(e) {
    let t = this.getLineOffsets();
    if (e.line >= t.length)
      return this._content.length;
    if (e.line < 0)
      return 0;
    let r = t[e.line], n = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
    return Math.max(Math.min(r + e.character, n), r);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range !== void 0 && (t.rangeLength === void 0 || typeof t.rangeLength == "number");
  }
  static isFull(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range === void 0 && t.rangeLength === void 0;
  }
}, Ur;
(function(e) {
  function t(i, s, o, l) {
    return new Zt(i, s, o, l);
  }
  e.create = t;
  function r(i, s, o) {
    if (i instanceof Zt)
      return i.update(s, o), i;
    throw new Error("TextDocument.update: document must be created by TextDocument.create");
  }
  e.update = r;
  function n(i, s) {
    let o = i.getText(), l = jr(s.map(So), (h, f) => {
      let d = h.range.start.line - f.range.start.line;
      return d === 0 ? h.range.start.character - f.range.start.character : d;
    }), u = 0;
    const c = [];
    for (const h of l) {
      let f = i.offsetAt(h.range.start);
      if (f < u)
        throw new Error("Overlapping edit");
      f > u && c.push(o.substring(u, f)), h.newText.length && c.push(h.newText), u = i.offsetAt(h.range.end);
    }
    return c.push(o.substr(u)), c.join("");
  }
  e.applyEdits = n;
})(Ur || (Ur = {}));
function jr(e, t) {
  if (e.length <= 1)
    return e;
  const r = e.length / 2 | 0, n = e.slice(0, r), i = e.slice(r);
  jr(n, t), jr(i, t);
  let s = 0, o = 0, l = 0;
  for (; s < n.length && o < i.length; )
    t(n[s], i[o]) <= 0 ? e[l++] = n[s++] : e[l++] = i[o++];
  for (; s < n.length; )
    e[l++] = n[s++];
  for (; o < i.length; )
    e[l++] = i[o++];
  return e;
}
function $i(e, t, r = 0) {
  const n = t ? [r] : [];
  for (let i = 0; i < e.length; i++) {
    let s = e.charCodeAt(i);
    (s === 13 || s === 10) && (s === 13 && i + 1 < e.length && e.charCodeAt(i + 1) === 10 && i++, n.push(r + i + 1));
  }
  return n;
}
function ma(e) {
  const t = e.start, r = e.end;
  return t.line > r.line || t.line === r.line && t.character > r.character ? { start: r, end: t } : e;
}
function So(e) {
  const t = ma(e.range);
  return t !== e.range ? { newText: e.newText, range: t } : e;
}
var q;
(function(e) {
  e[e.Undefined = 0] = "Undefined", e[e.EnumValueMismatch = 1] = "EnumValueMismatch", e[e.Deprecated = 2] = "Deprecated", e[e.UnexpectedEndOfComment = 257] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 258] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 259] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 260] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 261] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 262] = "InvalidCharacter", e[e.PropertyExpected = 513] = "PropertyExpected", e[e.CommaExpected = 514] = "CommaExpected", e[e.ColonExpected = 515] = "ColonExpected", e[e.ValueExpected = 516] = "ValueExpected", e[e.CommaOrCloseBacketExpected = 517] = "CommaOrCloseBacketExpected", e[e.CommaOrCloseBraceExpected = 518] = "CommaOrCloseBraceExpected", e[e.TrailingComma = 519] = "TrailingComma", e[e.DuplicateKey = 520] = "DuplicateKey", e[e.CommentNotPermitted = 521] = "CommentNotPermitted", e[e.SchemaResolveError = 768] = "SchemaResolveError";
})(q || (q = {}));
var qi;
(function(e) {
  e.LATEST = {
    textDocument: {
      completion: {
        completionItem: {
          documentationFormat: [xe.Markdown, xe.PlainText],
          commitCharactersSupport: !0
        }
      }
    }
  };
})(qi || (qi = {}));
function Ao(e, t) {
  let r;
  return t.length === 0 ? r = e : r = e.replace(/\{(\d+)\}/g, (n, i) => {
    let s = i[0];
    return typeof t[s] < "u" ? t[s] : n;
  }), r;
}
function No(e, t, ...r) {
  return Ao(t, r);
}
function At(e) {
  return No;
}
var Ge = function() {
  var e = function(t, r) {
    return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (n[s] = i[s]);
    }, e(t, r);
  };
  return function(t, r) {
    if (typeof r != "function" && r !== null)
      throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    e(t, r);
    function n() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (n.prototype = r.prototype, new n());
  };
}(), R = At(), Lo = {
  "color-hex": { errorMessage: R("colorHexFormatWarning", "Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA."), pattern: /^#([0-9A-Fa-f]{3,4}|([0-9A-Fa-f]{2}){3,4})$/ },
  "date-time": { errorMessage: R("dateTimeFormatWarning", "String is not a RFC3339 date-time."), pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i },
  date: { errorMessage: R("dateFormatWarning", "String is not a RFC3339 date."), pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/i },
  time: { errorMessage: R("timeFormatWarning", "String is not a RFC3339 time."), pattern: /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i },
  email: { errorMessage: R("emailFormatWarning", "String is not an e-mail address."), pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/ },
  hostname: { errorMessage: R("hostnameFormatWarning", "String is not a hostname."), pattern: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i },
  ipv4: { errorMessage: R("ipv4FormatWarning", "String is not an IPv4 address."), pattern: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/ },
  ipv6: { errorMessage: R("ipv6FormatWarning", "String is not an IPv6 address."), pattern: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i }
}, Je = function() {
  function e(t, r, n) {
    n === void 0 && (n = 0), this.offset = r, this.length = n, this.parent = t;
  }
  return Object.defineProperty(e.prototype, "children", {
    get: function() {
      return [];
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.toString = function() {
    return "type: " + this.type + " (" + this.offset + "/" + this.length + ")" + (this.parent ? " parent: {" + this.parent.toString() + "}" : "");
  }, e;
}(), ko = function(e) {
  Ge(t, e);
  function t(r, n) {
    var i = e.call(this, r, n) || this;
    return i.type = "null", i.value = null, i;
  }
  return t;
}(Je), Wi = function(e) {
  Ge(t, e);
  function t(r, n, i) {
    var s = e.call(this, r, i) || this;
    return s.type = "boolean", s.value = n, s;
  }
  return t;
}(Je), xo = function(e) {
  Ge(t, e);
  function t(r, n) {
    var i = e.call(this, r, n) || this;
    return i.type = "array", i.items = [], i;
  }
  return Object.defineProperty(t.prototype, "children", {
    get: function() {
      return this.items;
    },
    enumerable: !1,
    configurable: !0
  }), t;
}(Je), Mo = function(e) {
  Ge(t, e);
  function t(r, n) {
    var i = e.call(this, r, n) || this;
    return i.type = "number", i.isInteger = !0, i.value = Number.NaN, i;
  }
  return t;
}(Je), or = function(e) {
  Ge(t, e);
  function t(r, n, i) {
    var s = e.call(this, r, n, i) || this;
    return s.type = "string", s.value = "", s;
  }
  return t;
}(Je), Po = function(e) {
  Ge(t, e);
  function t(r, n, i) {
    var s = e.call(this, r, n) || this;
    return s.type = "property", s.colonOffset = -1, s.keyNode = i, s;
  }
  return Object.defineProperty(t.prototype, "children", {
    get: function() {
      return this.valueNode ? [this.keyNode, this.valueNode] : [this.keyNode];
    },
    enumerable: !1,
    configurable: !0
  }), t;
}(Je), To = function(e) {
  Ge(t, e);
  function t(r, n) {
    var i = e.call(this, r, n) || this;
    return i.type = "object", i.properties = [], i;
  }
  return Object.defineProperty(t.prototype, "children", {
    get: function() {
      return this.properties;
    },
    enumerable: !1,
    configurable: !0
  }), t;
}(Je);
function oe(e) {
  return Ae(e) ? e ? {} : { not: {} } : e;
}
var Hi;
(function(e) {
  e[e.Key = 0] = "Key", e[e.Enum = 1] = "Enum";
})(Hi || (Hi = {}));
var Eo = function() {
  function e(t, r) {
    t === void 0 && (t = -1), this.focusOffset = t, this.exclude = r, this.schemas = [];
  }
  return e.prototype.add = function(t) {
    this.schemas.push(t);
  }, e.prototype.merge = function(t) {
    Array.prototype.push.apply(this.schemas, t.schemas);
  }, e.prototype.include = function(t) {
    return (this.focusOffset === -1 || ga(t, this.focusOffset)) && t !== this.exclude;
  }, e.prototype.newSub = function() {
    return new e(-1, this.exclude);
  }, e;
}(), Br = function() {
  function e() {
  }
  return Object.defineProperty(e.prototype, "schemas", {
    get: function() {
      return [];
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.add = function(t) {
  }, e.prototype.merge = function(t) {
  }, e.prototype.include = function(t) {
    return !0;
  }, e.prototype.newSub = function() {
    return this;
  }, e.instance = new e(), e;
}(), le = function() {
  function e() {
    this.problems = [], this.propertiesMatches = 0, this.propertiesValueMatches = 0, this.primaryValueMatches = 0, this.enumValueMatch = !1, this.enumValues = void 0;
  }
  return e.prototype.hasProblems = function() {
    return !!this.problems.length;
  }, e.prototype.mergeAll = function(t) {
    for (var r = 0, n = t; r < n.length; r++) {
      var i = n[r];
      this.merge(i);
    }
  }, e.prototype.merge = function(t) {
    this.problems = this.problems.concat(t.problems);
  }, e.prototype.mergeEnumValues = function(t) {
    if (!this.enumValueMatch && !t.enumValueMatch && this.enumValues && t.enumValues) {
      this.enumValues = this.enumValues.concat(t.enumValues);
      for (var r = 0, n = this.problems; r < n.length; r++) {
        var i = n[r];
        i.code === q.EnumValueMismatch && (i.message = R("enumWarning", "Value is not accepted. Valid values: {0}.", this.enumValues.map(function(s) {
          return JSON.stringify(s);
        }).join(", ")));
      }
    }
  }, e.prototype.mergePropertyMatch = function(t) {
    this.merge(t), this.propertiesMatches++, (t.enumValueMatch || !t.hasProblems() && t.propertiesMatches) && this.propertiesValueMatches++, t.enumValueMatch && t.enumValues && t.enumValues.length === 1 && this.primaryValueMatches++;
  }, e.prototype.compare = function(t) {
    var r = this.hasProblems();
    return r !== t.hasProblems() ? r ? -1 : 1 : this.enumValueMatch !== t.enumValueMatch ? t.enumValueMatch ? -1 : 1 : this.primaryValueMatches !== t.primaryValueMatches ? this.primaryValueMatches - t.primaryValueMatches : this.propertiesValueMatches !== t.propertiesValueMatches ? this.propertiesValueMatches - t.propertiesValueMatches : this.propertiesMatches - t.propertiesMatches;
  }, e;
}();
function Fo(e, t) {
  return t === void 0 && (t = []), new pa(e, t, []);
}
function qe(e) {
  return bo(e);
}
function $r(e) {
  return vo(e);
}
function ga(e, t, r) {
  return r === void 0 && (r = !1), t >= e.offset && t < e.offset + e.length || r && t === e.offset + e.length;
}
var pa = function() {
  function e(t, r, n) {
    r === void 0 && (r = []), n === void 0 && (n = []), this.root = t, this.syntaxErrors = r, this.comments = n;
  }
  return e.prototype.getNodeFromOffset = function(t, r) {
    if (r === void 0 && (r = !1), this.root)
      return po(this.root, t, r);
  }, e.prototype.visit = function(t) {
    if (this.root) {
      var r = function(n) {
        var i = t(n), s = n.children;
        if (Array.isArray(s))
          for (var o = 0; o < s.length && i; o++)
            i = r(s[o]);
        return i;
      };
      r(this.root);
    }
  }, e.prototype.validate = function(t, r, n) {
    if (n === void 0 && (n = de.Warning), this.root && r) {
      var i = new le();
      return ee(this.root, r, i, Br.instance), i.problems.map(function(s) {
        var o, l = H.create(t.positionAt(s.location.offset), t.positionAt(s.location.offset + s.location.length));
        return ke.create(l, s.message, (o = s.severity) !== null && o !== void 0 ? o : n, s.code);
      });
    }
  }, e.prototype.getMatchingSchemas = function(t, r, n) {
    r === void 0 && (r = -1);
    var i = new Eo(r, n);
    return this.root && t && ee(this.root, t, new le(), i), i.schemas;
  }, e;
}();
function ee(e, t, r, n) {
  if (!e || !n.include(e))
    return;
  var i = e;
  switch (i.type) {
    case "object":
      c(i, t, r, n);
      break;
    case "array":
      u(i, t, r, n);
      break;
    case "string":
      l(i, t, r);
      break;
    case "number":
      o(i, t, r);
      break;
    case "property":
      return ee(i.valueNode, t, r, n);
  }
  s(), n.add({ node: i, schema: t });
  function s() {
    function h(I) {
      return i.type === I || I === "integer" && i.type === "number" && i.isInteger;
    }
    if (Array.isArray(t.type) ? t.type.some(h) || r.problems.push({
      location: { offset: i.offset, length: i.length },
      message: t.errorMessage || R("typeArrayMismatchWarning", "Incorrect type. Expected one of {0}.", t.type.join(", "))
    }) : t.type && (h(t.type) || r.problems.push({
      location: { offset: i.offset, length: i.length },
      message: t.errorMessage || R("typeMismatchWarning", 'Incorrect type. Expected "{0}".', t.type)
    })), Array.isArray(t.allOf))
      for (var f = 0, d = t.allOf; f < d.length; f++) {
        var m = d[f];
        ee(i, oe(m), r, n);
      }
    var v = oe(t.not);
    if (v) {
      var p = new le(), g = n.newSub();
      ee(i, v, p, g), p.hasProblems() || r.problems.push({
        location: { offset: i.offset, length: i.length },
        message: R("notSchemaWarning", "Matches a schema that is not allowed.")
      });
      for (var A = 0, S = g.schemas; A < S.length; A++) {
        var C = S[A];
        C.inverted = !C.inverted, n.add(C);
      }
    }
    var N = function(I, B) {
      for (var X = [], W = void 0, E = 0, M = I; E < M.length; E++) {
        var F = M[E], V = oe(F), D = new le(), U = n.newSub();
        if (ee(i, V, D, U), D.hasProblems() || X.push(V), !W)
          W = { schema: V, validationResult: D, matchingSchemas: U };
        else if (!B && !D.hasProblems() && !W.validationResult.hasProblems())
          W.matchingSchemas.merge(U), W.validationResult.propertiesMatches += D.propertiesMatches, W.validationResult.propertiesValueMatches += D.propertiesValueMatches;
        else {
          var $ = D.compare(W.validationResult);
          $ > 0 ? W = { schema: V, validationResult: D, matchingSchemas: U } : $ === 0 && (W.matchingSchemas.merge(U), W.validationResult.mergeEnumValues(D));
        }
      }
      return X.length > 1 && B && r.problems.push({
        location: { offset: i.offset, length: 1 },
        message: R("oneOfWarning", "Matches multiple schemas when only one must validate.")
      }), W && (r.merge(W.validationResult), r.propertiesMatches += W.validationResult.propertiesMatches, r.propertiesValueMatches += W.validationResult.propertiesValueMatches, n.merge(W.matchingSchemas)), X.length;
    };
    Array.isArray(t.anyOf) && N(t.anyOf, !1), Array.isArray(t.oneOf) && N(t.oneOf, !0);
    var x = function(I) {
      var B = new le(), X = n.newSub();
      ee(i, oe(I), B, X), r.merge(B), r.propertiesMatches += B.propertiesMatches, r.propertiesValueMatches += B.propertiesValueMatches, n.merge(X);
    }, w = function(I, B, X) {
      var W = oe(I), E = new le(), M = n.newSub();
      ee(i, W, E, M), n.merge(M), E.hasProblems() ? X && x(X) : B && x(B);
    }, b = oe(t.if);
    if (b && w(b, oe(t.then), oe(t.else)), Array.isArray(t.enum)) {
      for (var y = qe(i), _ = !1, k = 0, T = t.enum; k < T.length; k++) {
        var P = T[k];
        if (dt(y, P)) {
          _ = !0;
          break;
        }
      }
      r.enumValues = t.enum, r.enumValueMatch = _, _ || r.problems.push({
        location: { offset: i.offset, length: i.length },
        code: q.EnumValueMismatch,
        message: t.errorMessage || R("enumWarning", "Value is not accepted. Valid values: {0}.", t.enum.map(function(I) {
          return JSON.stringify(I);
        }).join(", "))
      });
    }
    if (Le(t.const)) {
      var y = qe(i);
      dt(y, t.const) ? r.enumValueMatch = !0 : (r.problems.push({
        location: { offset: i.offset, length: i.length },
        code: q.EnumValueMismatch,
        message: t.errorMessage || R("constWarning", "Value must be {0}.", JSON.stringify(t.const))
      }), r.enumValueMatch = !1), r.enumValues = [t.const];
    }
    t.deprecationMessage && i.parent && r.problems.push({
      location: { offset: i.parent.offset, length: i.parent.length },
      severity: de.Warning,
      message: t.deprecationMessage,
      code: q.Deprecated
    });
  }
  function o(h, f, d, m) {
    var v = h.value;
    function p(k) {
      var T, P = /^(-?\d+)(?:\.(\d+))?(?:e([-+]\d+))?$/.exec(k.toString());
      return P && {
        value: Number(P[1] + (P[2] || "")),
        multiplier: (((T = P[2]) === null || T === void 0 ? void 0 : T.length) || 0) - (parseInt(P[3]) || 0)
      };
    }
    if (ce(f.multipleOf)) {
      var g = -1;
      if (Number.isInteger(f.multipleOf))
        g = v % f.multipleOf;
      else {
        var A = p(f.multipleOf), S = p(v);
        if (A && S) {
          var C = Math.pow(10, Math.abs(S.multiplier - A.multiplier));
          S.multiplier < A.multiplier ? S.value *= C : A.value *= C, g = S.value % A.value;
        }
      }
      g !== 0 && d.problems.push({
        location: { offset: h.offset, length: h.length },
        message: R("multipleOfWarning", "Value is not divisible by {0}.", f.multipleOf)
      });
    }
    function N(k, T) {
      if (ce(T))
        return T;
      if (Ae(T) && T)
        return k;
    }
    function x(k, T) {
      if (!Ae(T) || !T)
        return k;
    }
    var w = N(f.minimum, f.exclusiveMinimum);
    ce(w) && v <= w && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("exclusiveMinimumWarning", "Value is below the exclusive minimum of {0}.", w)
    });
    var b = N(f.maximum, f.exclusiveMaximum);
    ce(b) && v >= b && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("exclusiveMaximumWarning", "Value is above the exclusive maximum of {0}.", b)
    });
    var y = x(f.minimum, f.exclusiveMinimum);
    ce(y) && v < y && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("minimumWarning", "Value is below the minimum of {0}.", y)
    });
    var _ = x(f.maximum, f.exclusiveMaximum);
    ce(_) && v > _ && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("maximumWarning", "Value is above the maximum of {0}.", _)
    });
  }
  function l(h, f, d, m) {
    if (ce(f.minLength) && h.value.length < f.minLength && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("minLengthWarning", "String is shorter than the minimum length of {0}.", f.minLength)
    }), ce(f.maxLength) && h.value.length > f.maxLength && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("maxLengthWarning", "String is longer than the maximum length of {0}.", f.maxLength)
    }), yo(f.pattern)) {
      var v = qt(f.pattern);
      v != null && v.test(h.value) || d.problems.push({
        location: { offset: h.offset, length: h.length },
        message: f.patternErrorMessage || f.errorMessage || R("patternWarning", 'String does not match the pattern of "{0}".', f.pattern)
      });
    }
    if (f.format)
      switch (f.format) {
        case "uri":
        case "uri-reference":
          {
            var p = void 0;
            if (!h.value)
              p = R("uriEmpty", "URI expected.");
            else {
              var g = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(h.value);
              g ? !g[2] && f.format === "uri" && (p = R("uriSchemeMissing", "URI with a scheme is expected.")) : p = R("uriMissing", "URI is expected.");
            }
            p && d.problems.push({
              location: { offset: h.offset, length: h.length },
              message: f.patternErrorMessage || f.errorMessage || R("uriFormatWarning", "String is not a URI: {0}", p)
            });
          }
          break;
        case "color-hex":
        case "date-time":
        case "date":
        case "time":
        case "email":
        case "hostname":
        case "ipv4":
        case "ipv6":
          var A = Lo[f.format];
          (!h.value || !A.pattern.exec(h.value)) && d.problems.push({
            location: { offset: h.offset, length: h.length },
            message: f.patternErrorMessage || f.errorMessage || A.errorMessage
          });
      }
  }
  function u(h, f, d, m) {
    if (Array.isArray(f.items)) {
      for (var v = f.items, p = 0; p < v.length; p++) {
        var g = v[p], A = oe(g), S = new le(), C = h.items[p];
        C ? (ee(C, A, S, m), d.mergePropertyMatch(S)) : h.items.length >= v.length && d.propertiesValueMatches++;
      }
      if (h.items.length > v.length)
        if (typeof f.additionalItems == "object")
          for (var N = v.length; N < h.items.length; N++) {
            var S = new le();
            ee(h.items[N], f.additionalItems, S, m), d.mergePropertyMatch(S);
          }
        else
          f.additionalItems === !1 && d.problems.push({
            location: { offset: h.offset, length: h.length },
            message: R("additionalItemsWarning", "Array has too many items according to schema. Expected {0} or fewer.", v.length)
          });
    } else {
      var x = oe(f.items);
      if (x)
        for (var w = 0, b = h.items; w < b.length; w++) {
          var C = b[w], S = new le();
          ee(C, x, S, m), d.mergePropertyMatch(S);
        }
    }
    var y = oe(f.contains);
    if (y) {
      var _ = h.items.some(function(P) {
        var I = new le();
        return ee(P, y, I, Br.instance), !I.hasProblems();
      });
      _ || d.problems.push({
        location: { offset: h.offset, length: h.length },
        message: f.errorMessage || R("requiredItemMissingWarning", "Array does not contain required item.")
      });
    }
    if (ce(f.minItems) && h.items.length < f.minItems && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("minItemsWarning", "Array has too few items. Expected {0} or more.", f.minItems)
    }), ce(f.maxItems) && h.items.length > f.maxItems && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("maxItemsWarning", "Array has too many items. Expected {0} or fewer.", f.maxItems)
    }), f.uniqueItems === !0) {
      var k = qe(h), T = k.some(function(P, I) {
        return I !== k.lastIndexOf(P);
      });
      T && d.problems.push({
        location: { offset: h.offset, length: h.length },
        message: R("uniqueItemsWarning", "Array has duplicate items.")
      });
    }
  }
  function c(h, f, d, m) {
    for (var v = /* @__PURE__ */ Object.create(null), p = [], g = 0, A = h.properties; g < A.length; g++) {
      var S = A[g], C = S.keyNode.value;
      v[C] = S.valueNode, p.push(C);
    }
    if (Array.isArray(f.required))
      for (var N = 0, x = f.required; N < x.length; N++) {
        var w = x[N];
        if (!v[w]) {
          var b = h.parent && h.parent.type === "property" && h.parent.keyNode, y = b ? { offset: b.offset, length: b.length } : { offset: h.offset, length: 1 };
          d.problems.push({
            location: y,
            message: R("MissingRequiredPropWarning", 'Missing property "{0}".', w)
          });
        }
      }
    var _ = function(nn) {
      for (var er = p.indexOf(nn); er >= 0; )
        p.splice(er, 1), er = p.indexOf(nn);
    };
    if (f.properties)
      for (var k = 0, T = Object.keys(f.properties); k < T.length; k++) {
        var w = T[k];
        _(w);
        var P = f.properties[w], I = v[w];
        if (I)
          if (Ae(P))
            if (P)
              d.propertiesMatches++, d.propertiesValueMatches++;
            else {
              var S = I.parent;
              d.problems.push({
                location: { offset: S.keyNode.offset, length: S.keyNode.length },
                message: f.errorMessage || R("DisallowedExtraPropWarning", "Property {0} is not allowed.", w)
              });
            }
          else {
            var B = new le();
            ee(I, P, B, m), d.mergePropertyMatch(B);
          }
      }
    if (f.patternProperties)
      for (var X = 0, W = Object.keys(f.patternProperties); X < W.length; X++)
        for (var E = W[X], M = qt(E), F = 0, V = p.slice(0); F < V.length; F++) {
          var w = V[F];
          if (M != null && M.test(w)) {
            _(w);
            var I = v[w];
            if (I) {
              var P = f.patternProperties[E];
              if (Ae(P))
                if (P)
                  d.propertiesMatches++, d.propertiesValueMatches++;
                else {
                  var S = I.parent;
                  d.problems.push({
                    location: { offset: S.keyNode.offset, length: S.keyNode.length },
                    message: f.errorMessage || R("DisallowedExtraPropWarning", "Property {0} is not allowed.", w)
                  });
                }
              else {
                var B = new le();
                ee(I, P, B, m), d.mergePropertyMatch(B);
              }
            }
          }
        }
    if (typeof f.additionalProperties == "object")
      for (var D = 0, U = p; D < U.length; D++) {
        var w = U[D], I = v[w];
        if (I) {
          var B = new le();
          ee(I, f.additionalProperties, B, m), d.mergePropertyMatch(B);
        }
      }
    else if (f.additionalProperties === !1 && p.length > 0)
      for (var $ = 0, we = p; $ < we.length; $++) {
        var w = we[$], I = v[w];
        if (I) {
          var S = I.parent;
          d.problems.push({
            location: { offset: S.keyNode.offset, length: S.keyNode.length },
            message: f.errorMessage || R("DisallowedExtraPropWarning", "Property {0} is not allowed.", w)
          });
        }
      }
    if (ce(f.maxProperties) && h.properties.length > f.maxProperties && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("MaxPropWarning", "Object has more properties than limit of {0}.", f.maxProperties)
    }), ce(f.minProperties) && h.properties.length < f.minProperties && d.problems.push({
      location: { offset: h.offset, length: h.length },
      message: R("MinPropWarning", "Object has fewer properties than the required number of {0}", f.minProperties)
    }), f.dependencies)
      for (var ne = 0, me = Object.keys(f.dependencies); ne < me.length; ne++) {
        var C = me[ne], Ze = v[C];
        if (Ze) {
          var ye = f.dependencies[C];
          if (Array.isArray(ye))
            for (var Yt = 0, Kr = ye; Yt < Kr.length; Yt++) {
              var en = Kr[Yt];
              v[en] ? d.propertiesValueMatches++ : d.problems.push({
                location: { offset: h.offset, length: h.length },
                message: R("RequiredDependentPropWarning", "Object is missing property {0} required by property {1}.", en, C)
              });
            }
          else {
            var P = oe(ye);
            if (P) {
              var B = new le();
              ee(h, P, B, m), d.mergePropertyMatch(B);
            }
          }
        }
      }
    var tn = oe(f.propertyNames);
    if (tn)
      for (var Kt = 0, rn = h.properties; Kt < rn.length; Kt++) {
        var _a = rn[Kt], C = _a.keyNode;
        C && ee(C, tn, d, Br.instance);
      }
  }
}
function Vo(e, t) {
  var r = [], n = -1, i = e.getText(), s = nt(i, !1), o = t && t.collectComments ? [] : void 0;
  function l() {
    for (; ; ) {
      var w = s.scan();
      switch (h(), w) {
        case 12:
        case 13:
          Array.isArray(o) && o.push(H.create(e.positionAt(s.getTokenOffset()), e.positionAt(s.getTokenOffset() + s.getTokenLength())));
          break;
        case 15:
        case 14:
          break;
        default:
          return w;
      }
    }
  }
  function u(w, b, y, _, k) {
    if (k === void 0 && (k = de.Error), r.length === 0 || y !== n) {
      var T = H.create(e.positionAt(y), e.positionAt(_));
      r.push(ke.create(T, w, k, b, e.languageId)), n = y;
    }
  }
  function c(w, b, y, _, k) {
    y === void 0 && (y = void 0), _ === void 0 && (_ = []), k === void 0 && (k = []);
    var T = s.getTokenOffset(), P = s.getTokenOffset() + s.getTokenLength();
    if (T === P && T > 0) {
      for (T--; T > 0 && /\s/.test(i.charAt(T)); )
        T--;
      P = T + 1;
    }
    if (u(w, b, T, P), y && f(y, !1), _.length + k.length > 0)
      for (var I = s.getToken(); I !== 17; ) {
        if (_.indexOf(I) !== -1) {
          l();
          break;
        } else if (k.indexOf(I) !== -1)
          break;
        I = l();
      }
    return y;
  }
  function h() {
    switch (s.getTokenError()) {
      case 4:
        return c(R("InvalidUnicode", "Invalid unicode sequence in string."), q.InvalidUnicode), !0;
      case 5:
        return c(R("InvalidEscapeCharacter", "Invalid escape character in string."), q.InvalidEscapeCharacter), !0;
      case 3:
        return c(R("UnexpectedEndOfNumber", "Unexpected end of number."), q.UnexpectedEndOfNumber), !0;
      case 1:
        return c(R("UnexpectedEndOfComment", "Unexpected end of comment."), q.UnexpectedEndOfComment), !0;
      case 2:
        return c(R("UnexpectedEndOfString", "Unexpected end of string."), q.UnexpectedEndOfString), !0;
      case 6:
        return c(R("InvalidCharacter", "Invalid characters in string. Control characters must be escaped."), q.InvalidCharacter), !0;
    }
    return !1;
  }
  function f(w, b) {
    return w.length = s.getTokenOffset() + s.getTokenLength() - w.offset, b && l(), w;
  }
  function d(w) {
    if (s.getToken() === 3) {
      var b = new xo(w, s.getTokenOffset());
      l();
      for (var y = !1; s.getToken() !== 4 && s.getToken() !== 17; ) {
        if (s.getToken() === 5) {
          y || c(R("ValueExpected", "Value expected"), q.ValueExpected);
          var _ = s.getTokenOffset();
          if (l(), s.getToken() === 4) {
            y && u(R("TrailingComma", "Trailing comma"), q.TrailingComma, _, _ + 1);
            continue;
          }
        } else
          y && c(R("ExpectedComma", "Expected comma"), q.CommaExpected);
        var k = C(b);
        k ? b.items.push(k) : c(R("PropertyExpected", "Value expected"), q.ValueExpected, void 0, [], [4, 5]), y = !0;
      }
      return s.getToken() !== 4 ? c(R("ExpectedCloseBracket", "Expected comma or closing bracket"), q.CommaOrCloseBacketExpected, b) : f(b, !0);
    }
  }
  var m = new or(void 0, 0, 0);
  function v(w, b) {
    var y = new Po(w, s.getTokenOffset(), m), _ = g(y);
    if (!_)
      if (s.getToken() === 16) {
        c(R("DoubleQuotesExpected", "Property keys must be doublequoted"), q.Undefined);
        var k = new or(y, s.getTokenOffset(), s.getTokenLength());
        k.value = s.getTokenValue(), _ = k, l();
      } else
        return;
    y.keyNode = _;
    var T = b[_.value];
    if (T ? (u(R("DuplicateKeyWarning", "Duplicate object key"), q.DuplicateKey, y.keyNode.offset, y.keyNode.offset + y.keyNode.length, de.Warning), typeof T == "object" && u(R("DuplicateKeyWarning", "Duplicate object key"), q.DuplicateKey, T.keyNode.offset, T.keyNode.offset + T.keyNode.length, de.Warning), b[_.value] = !0) : b[_.value] = y, s.getToken() === 6)
      y.colonOffset = s.getTokenOffset(), l();
    else if (c(R("ColonExpected", "Colon expected"), q.ColonExpected), s.getToken() === 10 && e.positionAt(_.offset + _.length).line < e.positionAt(s.getTokenOffset()).line)
      return y.length = _.length, y;
    var P = C(y);
    return P ? (y.valueNode = P, y.length = P.offset + P.length - y.offset, y) : c(R("ValueExpected", "Value expected"), q.ValueExpected, y, [], [2, 5]);
  }
  function p(w) {
    if (s.getToken() === 1) {
      var b = new To(w, s.getTokenOffset()), y = /* @__PURE__ */ Object.create(null);
      l();
      for (var _ = !1; s.getToken() !== 2 && s.getToken() !== 17; ) {
        if (s.getToken() === 5) {
          _ || c(R("PropertyExpected", "Property expected"), q.PropertyExpected);
          var k = s.getTokenOffset();
          if (l(), s.getToken() === 2) {
            _ && u(R("TrailingComma", "Trailing comma"), q.TrailingComma, k, k + 1);
            continue;
          }
        } else
          _ && c(R("ExpectedComma", "Expected comma"), q.CommaExpected);
        var T = v(b, y);
        T ? b.properties.push(T) : c(R("PropertyExpected", "Property expected"), q.PropertyExpected, void 0, [], [2, 5]), _ = !0;
      }
      return s.getToken() !== 2 ? c(R("ExpectedCloseBrace", "Expected comma or closing brace"), q.CommaOrCloseBraceExpected, b) : f(b, !0);
    }
  }
  function g(w) {
    if (s.getToken() === 10) {
      var b = new or(w, s.getTokenOffset());
      return b.value = s.getTokenValue(), f(b, !0);
    }
  }
  function A(w) {
    if (s.getToken() === 11) {
      var b = new Mo(w, s.getTokenOffset());
      if (s.getTokenError() === 0) {
        var y = s.getTokenValue();
        try {
          var _ = JSON.parse(y);
          if (!ce(_))
            return c(R("InvalidNumberFormat", "Invalid number format."), q.Undefined, b);
          b.value = _;
        } catch {
          return c(R("InvalidNumberFormat", "Invalid number format."), q.Undefined, b);
        }
        b.isInteger = y.indexOf(".") === -1;
      }
      return f(b, !0);
    }
  }
  function S(w) {
    switch (s.getToken()) {
      case 7:
        return f(new ko(w, s.getTokenOffset()), !0);
      case 8:
        return f(new Wi(w, !0, s.getTokenOffset()), !0);
      case 9:
        return f(new Wi(w, !1, s.getTokenOffset()), !0);
      default:
        return;
    }
  }
  function C(w) {
    return d(w) || p(w) || g(w) || A(w) || S(w);
  }
  var N = void 0, x = l();
  return x !== 17 && (N = C(N), N ? s.getToken() !== 17 && c(R("End of file expected", "End of file expected."), q.Undefined) : c(R("Invalid symbol", "Expected a JSON object, array or literal."), q.Undefined)), new pa(N, r, o);
}
function qr(e, t, r) {
  if (e !== null && typeof e == "object") {
    var n = t + "	";
    if (Array.isArray(e)) {
      if (e.length === 0)
        return "[]";
      for (var i = `[
`, s = 0; s < e.length; s++)
        i += n + qr(e[s], n, r), s < e.length - 1 && (i += ","), i += `
`;
      return i += t + "]", i;
    } else {
      var o = Object.keys(e);
      if (o.length === 0)
        return "{}";
      for (var i = `{
`, s = 0; s < o.length; s++) {
        var l = o[s];
        i += n + JSON.stringify(l) + ": " + qr(e[l], n, r), s < o.length - 1 && (i += ","), i += `
`;
      }
      return i += t + "}", i;
    }
  }
  return r(e);
}
var lr = At(), Io = function() {
  function e(t, r, n, i) {
    r === void 0 && (r = []), n === void 0 && (n = Promise), i === void 0 && (i = {}), this.schemaService = t, this.contributions = r, this.promiseConstructor = n, this.clientCapabilities = i;
  }
  return e.prototype.doResolve = function(t) {
    for (var r = this.contributions.length - 1; r >= 0; r--) {
      var n = this.contributions[r].resolveCompletion;
      if (n) {
        var i = n(t);
        if (i)
          return i;
      }
    }
    return this.promiseConstructor.resolve(t);
  }, e.prototype.doComplete = function(t, r, n) {
    var i = this, s = {
      items: [],
      isIncomplete: !1
    }, o = t.getText(), l = t.offsetAt(r), u = n.getNodeFromOffset(l, !0);
    if (this.isInComment(t, u ? u.offset : 0, l))
      return Promise.resolve(s);
    if (u && l === u.offset + u.length && l > 0) {
      var c = o[l - 1];
      (u.type === "object" && c === "}" || u.type === "array" && c === "]") && (u = u.parent);
    }
    var h = this.getCurrentWord(t, l), f;
    if (u && (u.type === "string" || u.type === "number" || u.type === "boolean" || u.type === "null"))
      f = H.create(t.positionAt(u.offset), t.positionAt(u.offset + u.length));
    else {
      var d = l - h.length;
      d > 0 && o[d - 1] === '"' && d--, f = H.create(t.positionAt(d), r);
    }
    var m = {}, v = {
      add: function(p) {
        var g = p.label, A = m[g];
        if (A)
          A.documentation || (A.documentation = p.documentation), A.detail || (A.detail = p.detail);
        else {
          if (g = g.replace(/[\n]/g, "↵"), g.length > 60) {
            var S = g.substr(0, 57).trim() + "...";
            m[S] || (g = S);
          }
          f && p.insertText !== void 0 && (p.textEdit = be.replace(f, p.insertText)), p.label = g, m[g] = p, s.items.push(p);
        }
      },
      setAsIncomplete: function() {
        s.isIncomplete = !0;
      },
      error: function(p) {
        console.error(p);
      },
      log: function(p) {
        console.log(p);
      },
      getNumberOfProposals: function() {
        return s.items.length;
      }
    };
    return this.schemaService.getSchemaForResource(t.uri, n).then(function(p) {
      var g = [], A = !0, S = "", C = void 0;
      if (u && u.type === "string") {
        var N = u.parent;
        N && N.type === "property" && N.keyNode === u && (A = !N.valueNode, C = N, S = o.substr(u.offset + 1, u.length - 2), N && (u = N.parent));
      }
      if (u && u.type === "object") {
        if (u.offset === l)
          return s;
        var x = u.properties;
        x.forEach(function(_) {
          (!C || C !== _) && (m[_.keyNode.value] = Or.create("__"));
        });
        var w = "";
        A && (w = i.evaluateSeparatorAfter(t, t.offsetAt(f.end))), p ? i.getPropertyCompletions(p, n, u, A, w, v) : i.getSchemaLessPropertyCompletions(n, u, S, v);
        var b = $r(u);
        i.contributions.forEach(function(_) {
          var k = _.collectPropertyCompletions(t.uri, b, h, A, w === "", v);
          k && g.push(k);
        }), !p && h.length > 0 && o.charAt(l - h.length - 1) !== '"' && (v.add({
          kind: he.Property,
          label: i.getLabelForValue(h),
          insertText: i.getInsertTextForProperty(h, void 0, !1, w),
          insertTextFormat: Q.Snippet,
          documentation: ""
        }), v.setAsIncomplete());
      }
      var y = {};
      return p ? i.getValueCompletions(p, n, u, l, t, v, y) : i.getSchemaLessValueCompletions(n, u, l, t, v), i.contributions.length > 0 && i.getContributedValueCompletions(n, u, l, t, v, g), i.promiseConstructor.all(g).then(function() {
        if (v.getNumberOfProposals() === 0) {
          var _ = l;
          u && (u.type === "string" || u.type === "number" || u.type === "boolean" || u.type === "null") && (_ = u.offset + u.length);
          var k = i.evaluateSeparatorAfter(t, _);
          i.addFillerValueCompletions(y, k, v);
        }
        return s;
      });
    });
  }, e.prototype.getPropertyCompletions = function(t, r, n, i, s, o) {
    var l = this, u = r.getMatchingSchemas(t.schema, n.offset);
    u.forEach(function(c) {
      if (c.node === n && !c.inverted) {
        var h = c.schema.properties;
        h && Object.keys(h).forEach(function(p) {
          var g = h[p];
          if (typeof g == "object" && !g.deprecationMessage && !g.doNotSuggest) {
            var A = {
              kind: he.Property,
              label: p,
              insertText: l.getInsertTextForProperty(p, g, i, s),
              insertTextFormat: Q.Snippet,
              filterText: l.getFilterTextForValue(p),
              documentation: l.fromMarkup(g.markdownDescription) || g.description || ""
            };
            g.suggestSortText !== void 0 && (A.sortText = g.suggestSortText), A.insertText && vt(A.insertText, "$1".concat(s)) && (A.command = {
              title: "Suggest",
              command: "editor.action.triggerSuggest"
            }), o.add(A);
          }
        });
        var f = c.schema.propertyNames;
        if (typeof f == "object" && !f.deprecationMessage && !f.doNotSuggest) {
          var d = function(p, g) {
            g === void 0 && (g = void 0);
            var A = {
              kind: he.Property,
              label: p,
              insertText: l.getInsertTextForProperty(p, void 0, i, s),
              insertTextFormat: Q.Snippet,
              filterText: l.getFilterTextForValue(p),
              documentation: g || l.fromMarkup(f.markdownDescription) || f.description || ""
            };
            f.suggestSortText !== void 0 && (A.sortText = f.suggestSortText), A.insertText && vt(A.insertText, "$1".concat(s)) && (A.command = {
              title: "Suggest",
              command: "editor.action.triggerSuggest"
            }), o.add(A);
          };
          if (f.enum)
            for (var m = 0; m < f.enum.length; m++) {
              var v = void 0;
              f.markdownEnumDescriptions && m < f.markdownEnumDescriptions.length ? v = l.fromMarkup(f.markdownEnumDescriptions[m]) : f.enumDescriptions && m < f.enumDescriptions.length && (v = f.enumDescriptions[m]), d(f.enum[m], v);
            }
          f.const && d(f.const);
        }
      }
    });
  }, e.prototype.getSchemaLessPropertyCompletions = function(t, r, n, i) {
    var s = this, o = function(u) {
      u.properties.forEach(function(c) {
        var h = c.keyNode.value;
        i.add({
          kind: he.Property,
          label: h,
          insertText: s.getInsertTextForValue(h, ""),
          insertTextFormat: Q.Snippet,
          filterText: s.getFilterTextForValue(h),
          documentation: ""
        });
      });
    };
    if (r.parent)
      if (r.parent.type === "property") {
        var l = r.parent.keyNode.value;
        t.visit(function(u) {
          return u.type === "property" && u !== r.parent && u.keyNode.value === l && u.valueNode && u.valueNode.type === "object" && o(u.valueNode), !0;
        });
      } else
        r.parent.type === "array" && r.parent.items.forEach(function(u) {
          u.type === "object" && u !== r && o(u);
        });
    else
      r.type === "object" && i.add({
        kind: he.Property,
        label: "$schema",
        insertText: this.getInsertTextForProperty("$schema", void 0, !0, ""),
        insertTextFormat: Q.Snippet,
        documentation: "",
        filterText: this.getFilterTextForValue("$schema")
      });
  }, e.prototype.getSchemaLessValueCompletions = function(t, r, n, i, s) {
    var o = this, l = n;
    if (r && (r.type === "string" || r.type === "number" || r.type === "boolean" || r.type === "null") && (l = r.offset + r.length, r = r.parent), !r) {
      s.add({
        kind: this.getSuggestionKind("object"),
        label: "Empty object",
        insertText: this.getInsertTextForValue({}, ""),
        insertTextFormat: Q.Snippet,
        documentation: ""
      }), s.add({
        kind: this.getSuggestionKind("array"),
        label: "Empty array",
        insertText: this.getInsertTextForValue([], ""),
        insertTextFormat: Q.Snippet,
        documentation: ""
      });
      return;
    }
    var u = this.evaluateSeparatorAfter(i, l), c = function(m) {
      m.parent && !ga(m.parent, n, !0) && s.add({
        kind: o.getSuggestionKind(m.type),
        label: o.getLabelTextForMatchingNode(m, i),
        insertText: o.getInsertTextForMatchingNode(m, i, u),
        insertTextFormat: Q.Snippet,
        documentation: ""
      }), m.type === "boolean" && o.addBooleanValueCompletion(!m.value, u, s);
    };
    if (r.type === "property" && n > (r.colonOffset || 0)) {
      var h = r.valueNode;
      if (h && (n > h.offset + h.length || h.type === "object" || h.type === "array"))
        return;
      var f = r.keyNode.value;
      t.visit(function(m) {
        return m.type === "property" && m.keyNode.value === f && m.valueNode && c(m.valueNode), !0;
      }), f === "$schema" && r.parent && !r.parent.parent && this.addDollarSchemaCompletions(u, s);
    }
    if (r.type === "array")
      if (r.parent && r.parent.type === "property") {
        var d = r.parent.keyNode.value;
        t.visit(function(m) {
          return m.type === "property" && m.keyNode.value === d && m.valueNode && m.valueNode.type === "array" && m.valueNode.items.forEach(c), !0;
        });
      } else
        r.items.forEach(c);
  }, e.prototype.getValueCompletions = function(t, r, n, i, s, o, l) {
    var u = i, c = void 0, h = void 0;
    if (n && (n.type === "string" || n.type === "number" || n.type === "boolean" || n.type === "null") && (u = n.offset + n.length, h = n, n = n.parent), !n) {
      this.addSchemaValueCompletions(t.schema, "", o, l);
      return;
    }
    if (n.type === "property" && i > (n.colonOffset || 0)) {
      var f = n.valueNode;
      if (f && i > f.offset + f.length)
        return;
      c = n.keyNode.value, n = n.parent;
    }
    if (n && (c !== void 0 || n.type === "array")) {
      for (var d = this.evaluateSeparatorAfter(s, u), m = r.getMatchingSchemas(t.schema, n.offset, h), v = 0, p = m; v < p.length; v++) {
        var g = p[v];
        if (g.node === n && !g.inverted && g.schema) {
          if (n.type === "array" && g.schema.items)
            if (Array.isArray(g.schema.items)) {
              var A = this.findItemAtOffset(n, s, i);
              A < g.schema.items.length && this.addSchemaValueCompletions(g.schema.items[A], d, o, l);
            } else
              this.addSchemaValueCompletions(g.schema.items, d, o, l);
          if (c !== void 0) {
            var S = !1;
            if (g.schema.properties) {
              var C = g.schema.properties[c];
              C && (S = !0, this.addSchemaValueCompletions(C, d, o, l));
            }
            if (g.schema.patternProperties && !S)
              for (var N = 0, x = Object.keys(g.schema.patternProperties); N < x.length; N++) {
                var w = x[N], b = qt(w);
                if (b != null && b.test(c)) {
                  S = !0;
                  var C = g.schema.patternProperties[w];
                  this.addSchemaValueCompletions(C, d, o, l);
                }
              }
            if (g.schema.additionalProperties && !S) {
              var C = g.schema.additionalProperties;
              this.addSchemaValueCompletions(C, d, o, l);
            }
          }
        }
      }
      c === "$schema" && !n.parent && this.addDollarSchemaCompletions(d, o), l.boolean && (this.addBooleanValueCompletion(!0, d, o), this.addBooleanValueCompletion(!1, d, o)), l.null && this.addNullValueCompletion(d, o);
    }
  }, e.prototype.getContributedValueCompletions = function(t, r, n, i, s, o) {
    if (!r)
      this.contributions.forEach(function(h) {
        var f = h.collectDefaultCompletions(i.uri, s);
        f && o.push(f);
      });
    else if ((r.type === "string" || r.type === "number" || r.type === "boolean" || r.type === "null") && (r = r.parent), r && r.type === "property" && n > (r.colonOffset || 0)) {
      var l = r.keyNode.value, u = r.valueNode;
      if ((!u || n <= u.offset + u.length) && r.parent) {
        var c = $r(r.parent);
        this.contributions.forEach(function(h) {
          var f = h.collectValueCompletions(i.uri, c, l, s);
          f && o.push(f);
        });
      }
    }
  }, e.prototype.addSchemaValueCompletions = function(t, r, n, i) {
    var s = this;
    typeof t == "object" && (this.addEnumValueCompletions(t, r, n), this.addDefaultValueCompletions(t, r, n), this.collectTypes(t, i), Array.isArray(t.allOf) && t.allOf.forEach(function(o) {
      return s.addSchemaValueCompletions(o, r, n, i);
    }), Array.isArray(t.anyOf) && t.anyOf.forEach(function(o) {
      return s.addSchemaValueCompletions(o, r, n, i);
    }), Array.isArray(t.oneOf) && t.oneOf.forEach(function(o) {
      return s.addSchemaValueCompletions(o, r, n, i);
    }));
  }, e.prototype.addDefaultValueCompletions = function(t, r, n, i) {
    var s = this;
    i === void 0 && (i = 0);
    var o = !1;
    if (Le(t.default)) {
      for (var l = t.type, u = t.default, c = i; c > 0; c--)
        u = [u], l = "array";
      n.add({
        kind: this.getSuggestionKind(l),
        label: this.getLabelForValue(u),
        insertText: this.getInsertTextForValue(u, r),
        insertTextFormat: Q.Snippet,
        detail: lr("json.suggest.default", "Default value")
      }), o = !0;
    }
    Array.isArray(t.examples) && t.examples.forEach(function(h) {
      for (var f = t.type, d = h, m = i; m > 0; m--)
        d = [d], f = "array";
      n.add({
        kind: s.getSuggestionKind(f),
        label: s.getLabelForValue(d),
        insertText: s.getInsertTextForValue(d, r),
        insertTextFormat: Q.Snippet
      }), o = !0;
    }), Array.isArray(t.defaultSnippets) && t.defaultSnippets.forEach(function(h) {
      var f = t.type, d = h.body, m = h.label, v, p;
      if (Le(d)) {
        t.type;
        for (var g = i; g > 0; g--)
          d = [d];
        v = s.getInsertTextForSnippetValue(d, r), p = s.getFilterTextForSnippetValue(d), m = m || s.getLabelForSnippetValue(d);
      } else if (typeof h.bodyText == "string") {
        for (var A = "", S = "", C = "", g = i; g > 0; g--)
          A = A + C + `[
`, S = S + `
` + C + "]", C += "	", f = "array";
        v = A + C + h.bodyText.split(`
`).join(`
` + C) + S + r, m = m || v, p = v.replace(/[\n]/g, "");
      } else
        return;
      n.add({
        kind: s.getSuggestionKind(f),
        label: m,
        documentation: s.fromMarkup(h.markdownDescription) || h.description,
        insertText: v,
        insertTextFormat: Q.Snippet,
        filterText: p
      }), o = !0;
    }), !o && typeof t.items == "object" && !Array.isArray(t.items) && i < 5 && this.addDefaultValueCompletions(t.items, r, n, i + 1);
  }, e.prototype.addEnumValueCompletions = function(t, r, n) {
    if (Le(t.const) && n.add({
      kind: this.getSuggestionKind(t.type),
      label: this.getLabelForValue(t.const),
      insertText: this.getInsertTextForValue(t.const, r),
      insertTextFormat: Q.Snippet,
      documentation: this.fromMarkup(t.markdownDescription) || t.description
    }), Array.isArray(t.enum))
      for (var i = 0, s = t.enum.length; i < s; i++) {
        var o = t.enum[i], l = this.fromMarkup(t.markdownDescription) || t.description;
        t.markdownEnumDescriptions && i < t.markdownEnumDescriptions.length && this.doesSupportMarkdown() ? l = this.fromMarkup(t.markdownEnumDescriptions[i]) : t.enumDescriptions && i < t.enumDescriptions.length && (l = t.enumDescriptions[i]), n.add({
          kind: this.getSuggestionKind(t.type),
          label: this.getLabelForValue(o),
          insertText: this.getInsertTextForValue(o, r),
          insertTextFormat: Q.Snippet,
          documentation: l
        });
      }
  }, e.prototype.collectTypes = function(t, r) {
    if (!(Array.isArray(t.enum) || Le(t.const))) {
      var n = t.type;
      Array.isArray(n) ? n.forEach(function(i) {
        return r[i] = !0;
      }) : n && (r[n] = !0);
    }
  }, e.prototype.addFillerValueCompletions = function(t, r, n) {
    t.object && n.add({
      kind: this.getSuggestionKind("object"),
      label: "{}",
      insertText: this.getInsertTextForGuessedValue({}, r),
      insertTextFormat: Q.Snippet,
      detail: lr("defaults.object", "New object"),
      documentation: ""
    }), t.array && n.add({
      kind: this.getSuggestionKind("array"),
      label: "[]",
      insertText: this.getInsertTextForGuessedValue([], r),
      insertTextFormat: Q.Snippet,
      detail: lr("defaults.array", "New array"),
      documentation: ""
    });
  }, e.prototype.addBooleanValueCompletion = function(t, r, n) {
    n.add({
      kind: this.getSuggestionKind("boolean"),
      label: t ? "true" : "false",
      insertText: this.getInsertTextForValue(t, r),
      insertTextFormat: Q.Snippet,
      documentation: ""
    });
  }, e.prototype.addNullValueCompletion = function(t, r) {
    r.add({
      kind: this.getSuggestionKind("null"),
      label: "null",
      insertText: "null" + t,
      insertTextFormat: Q.Snippet,
      documentation: ""
    });
  }, e.prototype.addDollarSchemaCompletions = function(t, r) {
    var n = this, i = this.schemaService.getRegisteredSchemaIds(function(s) {
      return s === "http" || s === "https";
    });
    i.forEach(function(s) {
      return r.add({
        kind: he.Module,
        label: n.getLabelForValue(s),
        filterText: n.getFilterTextForValue(s),
        insertText: n.getInsertTextForValue(s, t),
        insertTextFormat: Q.Snippet,
        documentation: ""
      });
    });
  }, e.prototype.getLabelForValue = function(t) {
    return JSON.stringify(t);
  }, e.prototype.getFilterTextForValue = function(t) {
    return JSON.stringify(t);
  }, e.prototype.getFilterTextForSnippetValue = function(t) {
    return JSON.stringify(t).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
  }, e.prototype.getLabelForSnippetValue = function(t) {
    var r = JSON.stringify(t);
    return r.replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
  }, e.prototype.getInsertTextForPlainText = function(t) {
    return t.replace(/[\\\$\}]/g, "\\$&");
  }, e.prototype.getInsertTextForValue = function(t, r) {
    var n = JSON.stringify(t, null, "	");
    return n === "{}" ? "{$1}" + r : n === "[]" ? "[$1]" + r : this.getInsertTextForPlainText(n + r);
  }, e.prototype.getInsertTextForSnippetValue = function(t, r) {
    var n = function(i) {
      return typeof i == "string" && i[0] === "^" ? i.substr(1) : JSON.stringify(i);
    };
    return qr(t, "", n) + r;
  }, e.prototype.getInsertTextForGuessedValue = function(t, r) {
    switch (typeof t) {
      case "object":
        return t === null ? "${1:null}" + r : this.getInsertTextForValue(t, r);
      case "string":
        var n = JSON.stringify(t);
        return n = n.substr(1, n.length - 2), n = this.getInsertTextForPlainText(n), '"${1:' + n + '}"' + r;
      case "number":
      case "boolean":
        return "${1:" + JSON.stringify(t) + "}" + r;
    }
    return this.getInsertTextForValue(t, r);
  }, e.prototype.getSuggestionKind = function(t) {
    if (Array.isArray(t)) {
      var r = t;
      t = r.length > 0 ? r[0] : void 0;
    }
    if (!t)
      return he.Value;
    switch (t) {
      case "string":
        return he.Value;
      case "object":
        return he.Module;
      case "property":
        return he.Property;
      default:
        return he.Value;
    }
  }, e.prototype.getLabelTextForMatchingNode = function(t, r) {
    switch (t.type) {
      case "array":
        return "[]";
      case "object":
        return "{}";
      default:
        var n = r.getText().substr(t.offset, t.length);
        return n;
    }
  }, e.prototype.getInsertTextForMatchingNode = function(t, r, n) {
    switch (t.type) {
      case "array":
        return this.getInsertTextForValue([], n);
      case "object":
        return this.getInsertTextForValue({}, n);
      default:
        var i = r.getText().substr(t.offset, t.length) + n;
        return this.getInsertTextForPlainText(i);
    }
  }, e.prototype.getInsertTextForProperty = function(t, r, n, i) {
    var s = this.getInsertTextForValue(t, "");
    if (!n)
      return s;
    var o = s + ": ", l, u = 0;
    if (r) {
      if (Array.isArray(r.defaultSnippets)) {
        if (r.defaultSnippets.length === 1) {
          var c = r.defaultSnippets[0].body;
          Le(c) && (l = this.getInsertTextForSnippetValue(c, ""));
        }
        u += r.defaultSnippets.length;
      }
      if (r.enum && (!l && r.enum.length === 1 && (l = this.getInsertTextForGuessedValue(r.enum[0], "")), u += r.enum.length), Le(r.default) && (l || (l = this.getInsertTextForGuessedValue(r.default, "")), u++), Array.isArray(r.examples) && r.examples.length && (l || (l = this.getInsertTextForGuessedValue(r.examples[0], "")), u += r.examples.length), u === 0) {
        var h = Array.isArray(r.type) ? r.type[0] : r.type;
        switch (h || (r.properties ? h = "object" : r.items && (h = "array")), h) {
          case "boolean":
            l = "$1";
            break;
          case "string":
            l = '"$1"';
            break;
          case "object":
            l = "{$1}";
            break;
          case "array":
            l = "[$1]";
            break;
          case "number":
          case "integer":
            l = "${1:0}";
            break;
          case "null":
            l = "${1:null}";
            break;
          default:
            return s;
        }
      }
    }
    return (!l || u > 1) && (l = "$1"), o + l + i;
  }, e.prototype.getCurrentWord = function(t, r) {
    for (var n = r - 1, i = t.getText(); n >= 0 && ` 	
\r\v":{[,]}`.indexOf(i.charAt(n)) === -1; )
      n--;
    return i.substring(n + 1, r);
  }, e.prototype.evaluateSeparatorAfter = function(t, r) {
    var n = nt(t.getText(), !0);
    n.setPosition(r);
    var i = n.scan();
    switch (i) {
      case 5:
      case 2:
      case 4:
      case 17:
        return "";
      default:
        return ",";
    }
  }, e.prototype.findItemAtOffset = function(t, r, n) {
    for (var i = nt(r.getText(), !0), s = t.items, o = s.length - 1; o >= 0; o--) {
      var l = s[o];
      if (n > l.offset + l.length) {
        i.setPosition(l.offset + l.length);
        var u = i.scan();
        return u === 5 && n >= i.getTokenOffset() + i.getTokenLength() ? o + 1 : o;
      } else if (n >= l.offset)
        return o;
    }
    return 0;
  }, e.prototype.isInComment = function(t, r, n) {
    var i = nt(t.getText(), !1);
    i.setPosition(r);
    for (var s = i.scan(); s !== 17 && i.getTokenOffset() + i.getTokenLength() < n; )
      s = i.scan();
    return (s === 12 || s === 13) && i.getTokenOffset() <= n;
  }, e.prototype.fromMarkup = function(t) {
    if (t && this.doesSupportMarkdown())
      return {
        kind: xe.Markdown,
        value: t
      };
  }, e.prototype.doesSupportMarkdown = function() {
    if (!Le(this.supportsMarkdown)) {
      var t = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.completion;
      this.supportsMarkdown = t && t.completionItem && Array.isArray(t.completionItem.documentationFormat) && t.completionItem.documentationFormat.indexOf(xe.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }, e.prototype.doesSupportsCommitCharacters = function() {
    if (!Le(this.supportsCommitCharacters)) {
      var t = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.completion;
      this.supportsCommitCharacters = t && t.completionItem && !!t.completionItem.commitCharactersSupport;
    }
    return this.supportsCommitCharacters;
  }, e;
}(), Ro = function() {
  function e(t, r, n) {
    r === void 0 && (r = []), this.schemaService = t, this.contributions = r, this.promise = n || Promise;
  }
  return e.prototype.doHover = function(t, r, n) {
    var i = t.offsetAt(r), s = n.getNodeFromOffset(i);
    if (!s || (s.type === "object" || s.type === "array") && i > s.offset + 1 && i < s.offset + s.length - 1)
      return this.promise.resolve(null);
    var o = s;
    if (s.type === "string") {
      var l = s.parent;
      if (l && l.type === "property" && l.keyNode === s && (s = l.valueNode, !s))
        return this.promise.resolve(null);
    }
    for (var u = H.create(t.positionAt(o.offset), t.positionAt(o.offset + o.length)), c = function(v) {
      var p = {
        contents: v,
        range: u
      };
      return p;
    }, h = $r(s), f = this.contributions.length - 1; f >= 0; f--) {
      var d = this.contributions[f], m = d.getInfoContribution(t.uri, h);
      if (m)
        return m.then(function(v) {
          return c(v);
        });
    }
    return this.schemaService.getSchemaForResource(t.uri, n).then(function(v) {
      if (v && s) {
        var p = n.getMatchingSchemas(v.schema, s.offset), g = void 0, A = void 0, S = void 0, C = void 0;
        p.every(function(x) {
          if (x.node === s && !x.inverted && x.schema && (g = g || x.schema.title, A = A || x.schema.markdownDescription || ur(x.schema.description), x.schema.enum)) {
            var w = x.schema.enum.indexOf(qe(s));
            x.schema.markdownEnumDescriptions ? S = x.schema.markdownEnumDescriptions[w] : x.schema.enumDescriptions && (S = ur(x.schema.enumDescriptions[w])), S && (C = x.schema.enum[w], typeof C != "string" && (C = JSON.stringify(C)));
          }
          return !0;
        });
        var N = "";
        return g && (N = ur(g)), A && (N.length > 0 && (N += `

`), N += A), S && (N.length > 0 && (N += `

`), N += "`".concat(Do(C), "`: ").concat(S)), c([N]);
      }
      return null;
    });
  }, e;
}();
function ur(e) {
  if (e) {
    var t = e.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, `$1

$3`);
    return t.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
}
function Do(e) {
  return e.indexOf("`") !== -1 ? "`` " + e + " ``" : e;
}
var Oo = At(), Uo = function() {
  function e(t, r) {
    this.jsonSchemaService = t, this.promise = r, this.validationEnabled = !0;
  }
  return e.prototype.configure = function(t) {
    t && (this.validationEnabled = t.validate !== !1, this.commentSeverity = t.allowComments ? void 0 : de.Error);
  }, e.prototype.doValidation = function(t, r, n, i) {
    var s = this;
    if (!this.validationEnabled)
      return this.promise.resolve([]);
    var o = [], l = {}, u = function(d) {
      var m = d.range.start.line + " " + d.range.start.character + " " + d.message;
      l[m] || (l[m] = !0, o.push(d));
    }, c = function(d) {
      var m = n != null && n.trailingCommas ? xt(n.trailingCommas) : de.Error, v = n != null && n.comments ? xt(n.comments) : s.commentSeverity, p = n != null && n.schemaValidation ? xt(n.schemaValidation) : de.Warning, g = n != null && n.schemaRequest ? xt(n.schemaRequest) : de.Warning;
      if (d) {
        if (d.errors.length && r.root && g) {
          var A = r.root, S = A.type === "object" ? A.properties[0] : void 0;
          if (S && S.keyNode.value === "$schema") {
            var C = S.valueNode || S, N = H.create(t.positionAt(C.offset), t.positionAt(C.offset + C.length));
            u(ke.create(N, d.errors[0], g, q.SchemaResolveError));
          } else {
            var N = H.create(t.positionAt(A.offset), t.positionAt(A.offset + 1));
            u(ke.create(N, d.errors[0], g, q.SchemaResolveError));
          }
        } else if (p) {
          var x = r.validate(t, d.schema, p);
          x && x.forEach(u);
        }
        va(d.schema) && (v = void 0), ba(d.schema) && (m = void 0);
      }
      for (var w = 0, b = r.syntaxErrors; w < b.length; w++) {
        var y = b[w];
        if (y.code === q.TrailingComma) {
          if (typeof m != "number")
            continue;
          y.severity = m;
        }
        u(y);
      }
      if (typeof v == "number") {
        var _ = Oo("InvalidCommentToken", "Comments are not permitted in JSON.");
        r.comments.forEach(function(k) {
          u(ke.create(k, _, v, q.CommentNotPermitted));
        });
      }
      return o;
    };
    if (i) {
      var h = i.id || "schemaservice://untitled/" + jo++, f = this.jsonSchemaService.registerExternalSchema(h, [], i);
      return f.getResolvedSchema().then(function(d) {
        return c(d);
      });
    }
    return this.jsonSchemaService.getSchemaForResource(t.uri, r).then(function(d) {
      return c(d);
    });
  }, e.prototype.getLanguageStatus = function(t, r) {
    return { schemas: this.jsonSchemaService.getSchemaURIsForResource(t.uri, r) };
  }, e;
}(), jo = 0;
function va(e) {
  if (e && typeof e == "object") {
    if (Ae(e.allowComments))
      return e.allowComments;
    if (e.allOf)
      for (var t = 0, r = e.allOf; t < r.length; t++) {
        var n = r[t], i = va(n);
        if (Ae(i))
          return i;
      }
  }
}
function ba(e) {
  if (e && typeof e == "object") {
    if (Ae(e.allowTrailingCommas))
      return e.allowTrailingCommas;
    var t = e;
    if (Ae(t.allowsTrailingCommas))
      return t.allowsTrailingCommas;
    if (e.allOf)
      for (var r = 0, n = e.allOf; r < n.length; r++) {
        var i = n[r], s = ba(i);
        if (Ae(s))
          return s;
      }
  }
}
function xt(e) {
  switch (e) {
    case "error":
      return de.Error;
    case "warning":
      return de.Warning;
    case "ignore":
      return;
  }
}
var zi = 48, Bo = 57, $o = 65, Mt = 97, qo = 102;
function Z(e) {
  return e < zi ? 0 : e <= Bo ? e - zi : (e < Mt && (e += Mt - $o), e >= Mt && e <= qo ? e - Mt + 10 : 0);
}
function Wo(e) {
  if (e[0] === "#")
    switch (e.length) {
      case 4:
        return {
          red: Z(e.charCodeAt(1)) * 17 / 255,
          green: Z(e.charCodeAt(2)) * 17 / 255,
          blue: Z(e.charCodeAt(3)) * 17 / 255,
          alpha: 1
        };
      case 5:
        return {
          red: Z(e.charCodeAt(1)) * 17 / 255,
          green: Z(e.charCodeAt(2)) * 17 / 255,
          blue: Z(e.charCodeAt(3)) * 17 / 255,
          alpha: Z(e.charCodeAt(4)) * 17 / 255
        };
      case 7:
        return {
          red: (Z(e.charCodeAt(1)) * 16 + Z(e.charCodeAt(2))) / 255,
          green: (Z(e.charCodeAt(3)) * 16 + Z(e.charCodeAt(4))) / 255,
          blue: (Z(e.charCodeAt(5)) * 16 + Z(e.charCodeAt(6))) / 255,
          alpha: 1
        };
      case 9:
        return {
          red: (Z(e.charCodeAt(1)) * 16 + Z(e.charCodeAt(2))) / 255,
          green: (Z(e.charCodeAt(3)) * 16 + Z(e.charCodeAt(4))) / 255,
          blue: (Z(e.charCodeAt(5)) * 16 + Z(e.charCodeAt(6))) / 255,
          alpha: (Z(e.charCodeAt(7)) * 16 + Z(e.charCodeAt(8))) / 255
        };
    }
}
var Ho = function() {
  function e(t) {
    this.schemaService = t;
  }
  return e.prototype.findDocumentSymbols = function(t, r, n) {
    var i = this;
    n === void 0 && (n = { resultLimit: Number.MAX_VALUE });
    var s = r.root;
    if (!s)
      return [];
    var o = n.resultLimit || Number.MAX_VALUE, l = t.uri;
    if ((l === "vscode://defaultsettings/keybindings.json" || vt(l.toLowerCase(), "/user/keybindings.json")) && s.type === "array") {
      for (var u = [], c = 0, h = s.items; c < h.length; c++) {
        var f = h[c];
        if (f.type === "object")
          for (var d = 0, m = f.properties; d < m.length; d++) {
            var v = m[d];
            if (v.keyNode.value === "key" && v.valueNode) {
              var p = bt.create(t.uri, Te(t, f));
              if (u.push({ name: qe(v.valueNode), kind: _e.Function, location: p }), o--, o <= 0)
                return n && n.onResultLimitExceeded && n.onResultLimitExceeded(l), u;
            }
          }
      }
      return u;
    }
    for (var g = [
      { node: s, containerName: "" }
    ], A = 0, S = !1, C = [], N = function(w, b) {
      w.type === "array" ? w.items.forEach(function(y) {
        y && g.push({ node: y, containerName: b });
      }) : w.type === "object" && w.properties.forEach(function(y) {
        var _ = y.valueNode;
        if (_)
          if (o > 0) {
            o--;
            var k = bt.create(t.uri, Te(t, y)), T = b ? b + "." + y.keyNode.value : y.keyNode.value;
            C.push({ name: i.getKeyLabel(y), kind: i.getSymbolKind(_.type), location: k, containerName: b }), g.push({ node: _, containerName: T });
          } else
            S = !0;
      });
    }; A < g.length; ) {
      var x = g[A++];
      N(x.node, x.containerName);
    }
    return S && n && n.onResultLimitExceeded && n.onResultLimitExceeded(l), C;
  }, e.prototype.findDocumentSymbols2 = function(t, r, n) {
    var i = this;
    n === void 0 && (n = { resultLimit: Number.MAX_VALUE });
    var s = r.root;
    if (!s)
      return [];
    var o = n.resultLimit || Number.MAX_VALUE, l = t.uri;
    if ((l === "vscode://defaultsettings/keybindings.json" || vt(l.toLowerCase(), "/user/keybindings.json")) && s.type === "array") {
      for (var u = [], c = 0, h = s.items; c < h.length; c++) {
        var f = h[c];
        if (f.type === "object")
          for (var d = 0, m = f.properties; d < m.length; d++) {
            var v = m[d];
            if (v.keyNode.value === "key" && v.valueNode) {
              var p = Te(t, f), g = Te(t, v.keyNode);
              if (u.push({ name: qe(v.valueNode), kind: _e.Function, range: p, selectionRange: g }), o--, o <= 0)
                return n && n.onResultLimitExceeded && n.onResultLimitExceeded(l), u;
            }
          }
      }
      return u;
    }
    for (var A = [], S = [
      { node: s, result: A }
    ], C = 0, N = !1, x = function(b, y) {
      b.type === "array" ? b.items.forEach(function(_, k) {
        if (_)
          if (o > 0) {
            o--;
            var T = Te(t, _), P = T, I = String(k), B = { name: I, kind: i.getSymbolKind(_.type), range: T, selectionRange: P, children: [] };
            y.push(B), S.push({ result: B.children, node: _ });
          } else
            N = !0;
      }) : b.type === "object" && b.properties.forEach(function(_) {
        var k = _.valueNode;
        if (k)
          if (o > 0) {
            o--;
            var T = Te(t, _), P = Te(t, _.keyNode), I = [], B = { name: i.getKeyLabel(_), kind: i.getSymbolKind(k.type), range: T, selectionRange: P, children: I, detail: i.getDetail(k) };
            y.push(B), S.push({ result: I, node: k });
          } else
            N = !0;
      });
    }; C < S.length; ) {
      var w = S[C++];
      x(w.node, w.result);
    }
    return N && n && n.onResultLimitExceeded && n.onResultLimitExceeded(l), A;
  }, e.prototype.getSymbolKind = function(t) {
    switch (t) {
      case "object":
        return _e.Module;
      case "string":
        return _e.String;
      case "number":
        return _e.Number;
      case "array":
        return _e.Array;
      case "boolean":
        return _e.Boolean;
      default:
        return _e.Variable;
    }
  }, e.prototype.getKeyLabel = function(t) {
    var r = t.keyNode.value;
    return r && (r = r.replace(/[\n]/g, "↵")), r && r.trim() ? r : '"'.concat(r, '"');
  }, e.prototype.getDetail = function(t) {
    if (t) {
      if (t.type === "boolean" || t.type === "number" || t.type === "null" || t.type === "string")
        return String(t.value);
      if (t.type === "array")
        return t.children.length ? void 0 : "[]";
      if (t.type === "object")
        return t.children.length ? void 0 : "{}";
    }
  }, e.prototype.findDocumentColors = function(t, r, n) {
    return this.schemaService.getSchemaForResource(t.uri, r).then(function(i) {
      var s = [];
      if (i)
        for (var o = n && typeof n.resultLimit == "number" ? n.resultLimit : Number.MAX_VALUE, l = r.getMatchingSchemas(i.schema), u = {}, c = 0, h = l; c < h.length; c++) {
          var f = h[c];
          if (!f.inverted && f.schema && (f.schema.format === "color" || f.schema.format === "color-hex") && f.node && f.node.type === "string") {
            var d = String(f.node.offset);
            if (!u[d]) {
              var m = Wo(qe(f.node));
              if (m) {
                var v = Te(t, f.node);
                s.push({ color: m, range: v });
              }
              if (u[d] = !0, o--, o <= 0)
                return n && n.onResultLimitExceeded && n.onResultLimitExceeded(t.uri), s;
            }
          }
        }
      return s;
    });
  }, e.prototype.getColorPresentations = function(t, r, n, i) {
    var s = [], o = Math.round(n.red * 255), l = Math.round(n.green * 255), u = Math.round(n.blue * 255);
    function c(f) {
      var d = f.toString(16);
      return d.length !== 2 ? "0" + d : d;
    }
    var h;
    return n.alpha === 1 ? h = "#".concat(c(o)).concat(c(l)).concat(c(u)) : h = "#".concat(c(o)).concat(c(l)).concat(c(u)).concat(c(Math.round(n.alpha * 255))), s.push({ label: h, textEdit: be.replace(i, JSON.stringify(h)) }), s;
  }, e;
}();
function Te(e, t) {
  return H.create(e.positionAt(t.offset), e.positionAt(t.offset + t.length));
}
var O = At(), Wr = {
  schemaAssociations: [],
  schemas: {
    "http://json-schema.org/schema#": {
      $ref: "http://json-schema.org/draft-07/schema#"
    },
    "http://json-schema.org/draft-04/schema#": {
      $schema: "http://json-schema.org/draft-04/schema#",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: {
            $ref: "#"
          }
        },
        positiveInteger: {
          type: "integer",
          minimum: 0
        },
        positiveIntegerDefault0: {
          allOf: [
            {
              $ref: "#/definitions/positiveInteger"
            },
            {
              default: 0
            }
          ]
        },
        simpleTypes: {
          type: "string",
          enum: [
            "array",
            "boolean",
            "integer",
            "null",
            "number",
            "object",
            "string"
          ]
        },
        stringArray: {
          type: "array",
          items: {
            type: "string"
          },
          minItems: 1,
          uniqueItems: !0
        }
      },
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uri"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: {},
        multipleOf: {
          type: "number",
          minimum: 0,
          exclusiveMinimum: !0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "boolean",
          default: !1
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "boolean",
          default: !1
        },
        maxLength: {
          allOf: [
            {
              $ref: "#/definitions/positiveInteger"
            }
          ]
        },
        minLength: {
          allOf: [
            {
              $ref: "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: {
          anyOf: [
            {
              type: "boolean"
            },
            {
              $ref: "#"
            }
          ],
          default: {}
        },
        items: {
          anyOf: [
            {
              $ref: "#"
            },
            {
              $ref: "#/definitions/schemaArray"
            }
          ],
          default: {}
        },
        maxItems: {
          allOf: [
            {
              $ref: "#/definitions/positiveInteger"
            }
          ]
        },
        minItems: {
          allOf: [
            {
              $ref: "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        uniqueItems: {
          type: "boolean",
          default: !1
        },
        maxProperties: {
          allOf: [
            {
              $ref: "#/definitions/positiveInteger"
            }
          ]
        },
        minProperties: {
          allOf: [
            {
              $ref: "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        required: {
          allOf: [
            {
              $ref: "#/definitions/stringArray"
            }
          ]
        },
        additionalProperties: {
          anyOf: [
            {
              type: "boolean"
            },
            {
              $ref: "#"
            }
          ],
          default: {}
        },
        definitions: {
          type: "object",
          additionalProperties: {
            $ref: "#"
          },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: {
            $ref: "#"
          },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: {
            $ref: "#"
          },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [
              {
                $ref: "#"
              },
              {
                $ref: "#/definitions/stringArray"
              }
            ]
          }
        },
        enum: {
          type: "array",
          minItems: 1,
          uniqueItems: !0
        },
        type: {
          anyOf: [
            {
              $ref: "#/definitions/simpleTypes"
            },
            {
              type: "array",
              items: {
                $ref: "#/definitions/simpleTypes"
              },
              minItems: 1,
              uniqueItems: !0
            }
          ]
        },
        format: {
          anyOf: [
            {
              type: "string",
              enum: [
                "date-time",
                "uri",
                "email",
                "hostname",
                "ipv4",
                "ipv6",
                "regex"
              ]
            },
            {
              type: "string"
            }
          ]
        },
        allOf: {
          allOf: [
            {
              $ref: "#/definitions/schemaArray"
            }
          ]
        },
        anyOf: {
          allOf: [
            {
              $ref: "#/definitions/schemaArray"
            }
          ]
        },
        oneOf: {
          allOf: [
            {
              $ref: "#/definitions/schemaArray"
            }
          ]
        },
        not: {
          allOf: [
            {
              $ref: "#"
            }
          ]
        }
      },
      dependencies: {
        exclusiveMaximum: [
          "maximum"
        ],
        exclusiveMinimum: [
          "minimum"
        ]
      },
      default: {}
    },
    "http://json-schema.org/draft-07/schema#": {
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [
            { $ref: "#/definitions/nonNegativeInteger" },
            { default: 0 }
          ]
        },
        simpleTypes: {
          enum: [
            "array",
            "boolean",
            "integer",
            "null",
            "number",
            "object",
            "string"
          ]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: !0,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: !0,
        readOnly: {
          type: "boolean",
          default: !1
        },
        examples: {
          type: "array",
          items: !0
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [
            { $ref: "#" },
            { $ref: "#/definitions/schemaArray" }
          ],
          default: !0
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: !1
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [
              { $ref: "#" },
              { $ref: "#/definitions/stringArray" }
            ]
          }
        },
        propertyNames: { $ref: "#" },
        const: !0,
        enum: {
          type: "array",
          items: !0,
          minItems: 1,
          uniqueItems: !0
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: !0
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: !0
    }
  }
}, zo = {
  id: O("schema.json.id", "A unique identifier for the schema."),
  $schema: O("schema.json.$schema", "The schema to verify this document against."),
  title: O("schema.json.title", "A descriptive title of the element."),
  description: O("schema.json.description", "A long description of the element. Used in hover menus and suggestions."),
  default: O("schema.json.default", "A default value. Used by suggestions."),
  multipleOf: O("schema.json.multipleOf", "A number that should cleanly divide the current value (i.e. have no remainder)."),
  maximum: O("schema.json.maximum", "The maximum numerical value, inclusive by default."),
  exclusiveMaximum: O("schema.json.exclusiveMaximum", "Makes the maximum property exclusive."),
  minimum: O("schema.json.minimum", "The minimum numerical value, inclusive by default."),
  exclusiveMinimum: O("schema.json.exclusiveMininum", "Makes the minimum property exclusive."),
  maxLength: O("schema.json.maxLength", "The maximum length of a string."),
  minLength: O("schema.json.minLength", "The minimum length of a string."),
  pattern: O("schema.json.pattern", "A regular expression to match the string against. It is not implicitly anchored."),
  additionalItems: O("schema.json.additionalItems", "For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail."),
  items: O("schema.json.items", "For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on."),
  maxItems: O("schema.json.maxItems", "The maximum number of items that can be inside an array. Inclusive."),
  minItems: O("schema.json.minItems", "The minimum number of items that can be inside an array. Inclusive."),
  uniqueItems: O("schema.json.uniqueItems", "If all of the items in the array must be unique. Defaults to false."),
  maxProperties: O("schema.json.maxProperties", "The maximum number of properties an object can have. Inclusive."),
  minProperties: O("schema.json.minProperties", "The minimum number of properties an object can have. Inclusive."),
  required: O("schema.json.required", "An array of strings that lists the names of all properties required on this object."),
  additionalProperties: O("schema.json.additionalProperties", "Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail."),
  definitions: O("schema.json.definitions", "Not used for validation. Place subschemas here that you wish to reference inline with $ref."),
  properties: O("schema.json.properties", "A map of property names to schemas for each property."),
  patternProperties: O("schema.json.patternProperties", "A map of regular expressions on property names to schemas for matching properties."),
  dependencies: O("schema.json.dependencies", "A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object."),
  enum: O("schema.json.enum", "The set of literal values that are valid."),
  type: O("schema.json.type", "Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types."),
  format: O("schema.json.format", "Describes the format expected for the value."),
  allOf: O("schema.json.allOf", "An array of schemas, all of which must match."),
  anyOf: O("schema.json.anyOf", "An array of schemas, where at least one must match."),
  oneOf: O("schema.json.oneOf", "An array of schemas, exactly one of which must match."),
  not: O("schema.json.not", "A schema which must not match."),
  $id: O("schema.json.$id", "A unique identifier for the schema."),
  $ref: O("schema.json.$ref", "Reference a definition hosted on any location."),
  $comment: O("schema.json.$comment", "Comments from schema authors to readers or maintainers of the schema."),
  readOnly: O("schema.json.readOnly", "Indicates that the value of the instance is managed exclusively by the owning authority."),
  examples: O("schema.json.examples", "Sample JSON values associated with a particular schema, for the purpose of illustrating usage."),
  contains: O("schema.json.contains", 'An array instance is valid against "contains" if at least one of its elements is valid against the given schema.'),
  propertyNames: O("schema.json.propertyNames", "If the instance is an object, this keyword validates if every property name in the instance validates against the provided schema."),
  const: O("schema.json.const", "An instance validates successfully against this keyword if its value is equal to the value of the keyword."),
  contentMediaType: O("schema.json.contentMediaType", "Describes the media type of a string property."),
  contentEncoding: O("schema.json.contentEncoding", "Describes the content encoding of a string property."),
  if: O("schema.json.if", 'The validation outcome of the "if" subschema controls which of the "then" or "else" keywords are evaluated.'),
  then: O("schema.json.then", 'The "if" subschema is used for validation when the "if" subschema succeeds.'),
  else: O("schema.json.else", 'The "else" subschema is used for validation when the "if" subschema fails.')
};
for (Gi in Wr.schemas) {
  Pt = Wr.schemas[Gi];
  for (tt in Pt.properties)
    Tt = Pt.properties[tt], typeof Tt == "boolean" && (Tt = Pt.properties[tt] = {}), cr = zo[tt], cr ? Tt.description = cr : console.log("".concat(tt, ": localize('schema.json.").concat(tt, `', "")`));
}
var Pt, Tt, cr, tt, Gi, wa;
wa = (() => {
  var e = { 470: (n) => {
    function i(l) {
      if (typeof l != "string")
        throw new TypeError("Path must be a string. Received " + JSON.stringify(l));
    }
    function s(l, u) {
      for (var c, h = "", f = 0, d = -1, m = 0, v = 0; v <= l.length; ++v) {
        if (v < l.length)
          c = l.charCodeAt(v);
        else {
          if (c === 47)
            break;
          c = 47;
        }
        if (c === 47) {
          if (!(d === v - 1 || m === 1))
            if (d !== v - 1 && m === 2) {
              if (h.length < 2 || f !== 2 || h.charCodeAt(h.length - 1) !== 46 || h.charCodeAt(h.length - 2) !== 46) {
                if (h.length > 2) {
                  var p = h.lastIndexOf("/");
                  if (p !== h.length - 1) {
                    p === -1 ? (h = "", f = 0) : f = (h = h.slice(0, p)).length - 1 - h.lastIndexOf("/"), d = v, m = 0;
                    continue;
                  }
                } else if (h.length === 2 || h.length === 1) {
                  h = "", f = 0, d = v, m = 0;
                  continue;
                }
              }
              u && (h.length > 0 ? h += "/.." : h = "..", f = 2);
            } else
              h.length > 0 ? h += "/" + l.slice(d + 1, v) : h = l.slice(d + 1, v), f = v - d - 1;
          d = v, m = 0;
        } else
          c === 46 && m !== -1 ? ++m : m = -1;
      }
      return h;
    }
    var o = { resolve: function() {
      for (var l, u = "", c = !1, h = arguments.length - 1; h >= -1 && !c; h--) {
        var f;
        h >= 0 ? f = arguments[h] : (l === void 0 && (l = process.cwd()), f = l), i(f), f.length !== 0 && (u = f + "/" + u, c = f.charCodeAt(0) === 47);
      }
      return u = s(u, !c), c ? u.length > 0 ? "/" + u : "/" : u.length > 0 ? u : ".";
    }, normalize: function(l) {
      if (i(l), l.length === 0)
        return ".";
      var u = l.charCodeAt(0) === 47, c = l.charCodeAt(l.length - 1) === 47;
      return (l = s(l, !u)).length !== 0 || u || (l = "."), l.length > 0 && c && (l += "/"), u ? "/" + l : l;
    }, isAbsolute: function(l) {
      return i(l), l.length > 0 && l.charCodeAt(0) === 47;
    }, join: function() {
      if (arguments.length === 0)
        return ".";
      for (var l, u = 0; u < arguments.length; ++u) {
        var c = arguments[u];
        i(c), c.length > 0 && (l === void 0 ? l = c : l += "/" + c);
      }
      return l === void 0 ? "." : o.normalize(l);
    }, relative: function(l, u) {
      if (i(l), i(u), l === u || (l = o.resolve(l)) === (u = o.resolve(u)))
        return "";
      for (var c = 1; c < l.length && l.charCodeAt(c) === 47; ++c)
        ;
      for (var h = l.length, f = h - c, d = 1; d < u.length && u.charCodeAt(d) === 47; ++d)
        ;
      for (var m = u.length - d, v = f < m ? f : m, p = -1, g = 0; g <= v; ++g) {
        if (g === v) {
          if (m > v) {
            if (u.charCodeAt(d + g) === 47)
              return u.slice(d + g + 1);
            if (g === 0)
              return u.slice(d + g);
          } else
            f > v && (l.charCodeAt(c + g) === 47 ? p = g : g === 0 && (p = 0));
          break;
        }
        var A = l.charCodeAt(c + g);
        if (A !== u.charCodeAt(d + g))
          break;
        A === 47 && (p = g);
      }
      var S = "";
      for (g = c + p + 1; g <= h; ++g)
        g !== h && l.charCodeAt(g) !== 47 || (S.length === 0 ? S += ".." : S += "/..");
      return S.length > 0 ? S + u.slice(d + p) : (d += p, u.charCodeAt(d) === 47 && ++d, u.slice(d));
    }, _makeLong: function(l) {
      return l;
    }, dirname: function(l) {
      if (i(l), l.length === 0)
        return ".";
      for (var u = l.charCodeAt(0), c = u === 47, h = -1, f = !0, d = l.length - 1; d >= 1; --d)
        if ((u = l.charCodeAt(d)) === 47) {
          if (!f) {
            h = d;
            break;
          }
        } else
          f = !1;
      return h === -1 ? c ? "/" : "." : c && h === 1 ? "//" : l.slice(0, h);
    }, basename: function(l, u) {
      if (u !== void 0 && typeof u != "string")
        throw new TypeError('"ext" argument must be a string');
      i(l);
      var c, h = 0, f = -1, d = !0;
      if (u !== void 0 && u.length > 0 && u.length <= l.length) {
        if (u.length === l.length && u === l)
          return "";
        var m = u.length - 1, v = -1;
        for (c = l.length - 1; c >= 0; --c) {
          var p = l.charCodeAt(c);
          if (p === 47) {
            if (!d) {
              h = c + 1;
              break;
            }
          } else
            v === -1 && (d = !1, v = c + 1), m >= 0 && (p === u.charCodeAt(m) ? --m == -1 && (f = c) : (m = -1, f = v));
        }
        return h === f ? f = v : f === -1 && (f = l.length), l.slice(h, f);
      }
      for (c = l.length - 1; c >= 0; --c)
        if (l.charCodeAt(c) === 47) {
          if (!d) {
            h = c + 1;
            break;
          }
        } else
          f === -1 && (d = !1, f = c + 1);
      return f === -1 ? "" : l.slice(h, f);
    }, extname: function(l) {
      i(l);
      for (var u = -1, c = 0, h = -1, f = !0, d = 0, m = l.length - 1; m >= 0; --m) {
        var v = l.charCodeAt(m);
        if (v !== 47)
          h === -1 && (f = !1, h = m + 1), v === 46 ? u === -1 ? u = m : d !== 1 && (d = 1) : u !== -1 && (d = -1);
        else if (!f) {
          c = m + 1;
          break;
        }
      }
      return u === -1 || h === -1 || d === 0 || d === 1 && u === h - 1 && u === c + 1 ? "" : l.slice(u, h);
    }, format: function(l) {
      if (l === null || typeof l != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof l);
      return function(u, c) {
        var h = c.dir || c.root, f = c.base || (c.name || "") + (c.ext || "");
        return h ? h === c.root ? h + f : h + "/" + f : f;
      }(0, l);
    }, parse: function(l) {
      i(l);
      var u = { root: "", dir: "", base: "", ext: "", name: "" };
      if (l.length === 0)
        return u;
      var c, h = l.charCodeAt(0), f = h === 47;
      f ? (u.root = "/", c = 1) : c = 0;
      for (var d = -1, m = 0, v = -1, p = !0, g = l.length - 1, A = 0; g >= c; --g)
        if ((h = l.charCodeAt(g)) !== 47)
          v === -1 && (p = !1, v = g + 1), h === 46 ? d === -1 ? d = g : A !== 1 && (A = 1) : d !== -1 && (A = -1);
        else if (!p) {
          m = g + 1;
          break;
        }
      return d === -1 || v === -1 || A === 0 || A === 1 && d === v - 1 && d === m + 1 ? v !== -1 && (u.base = u.name = m === 0 && f ? l.slice(1, v) : l.slice(m, v)) : (m === 0 && f ? (u.name = l.slice(1, d), u.base = l.slice(1, v)) : (u.name = l.slice(m, d), u.base = l.slice(m, v)), u.ext = l.slice(d, v)), m > 0 ? u.dir = l.slice(0, m - 1) : f && (u.dir = "/"), u;
    }, sep: "/", delimiter: ":", win32: null, posix: null };
    o.posix = o, n.exports = o;
  }, 447: (n, i, s) => {
    var o;
    if (s.r(i), s.d(i, { URI: () => S, Utils: () => I }), typeof process == "object")
      o = process.platform === "win32";
    else if (typeof navigator == "object") {
      var l = navigator.userAgent;
      o = l.indexOf("Windows") >= 0;
    }
    var u, c, h = (u = function(E, M) {
      return (u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(F, V) {
        F.__proto__ = V;
      } || function(F, V) {
        for (var D in V)
          Object.prototype.hasOwnProperty.call(V, D) && (F[D] = V[D]);
      })(E, M);
    }, function(E, M) {
      if (typeof M != "function" && M !== null)
        throw new TypeError("Class extends value " + String(M) + " is not a constructor or null");
      function F() {
        this.constructor = E;
      }
      u(E, M), E.prototype = M === null ? Object.create(M) : (F.prototype = M.prototype, new F());
    }), f = /^\w[\w\d+.-]*$/, d = /^\//, m = /^\/\//;
    function v(E, M) {
      if (!E.scheme && M)
        throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(E.authority, '", path: "').concat(E.path, '", query: "').concat(E.query, '", fragment: "').concat(E.fragment, '"}'));
      if (E.scheme && !f.test(E.scheme))
        throw new Error("[UriError]: Scheme contains illegal characters.");
      if (E.path) {
        if (E.authority) {
          if (!d.test(E.path))
            throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        } else if (m.test(E.path))
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
    var p = "", g = "/", A = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, S = function() {
      function E(M, F, V, D, U, $) {
        $ === void 0 && ($ = !1), typeof M == "object" ? (this.scheme = M.scheme || p, this.authority = M.authority || p, this.path = M.path || p, this.query = M.query || p, this.fragment = M.fragment || p) : (this.scheme = function(we, ne) {
          return we || ne ? we : "file";
        }(M, $), this.authority = F || p, this.path = function(we, ne) {
          switch (we) {
            case "https":
            case "http":
            case "file":
              ne ? ne[0] !== g && (ne = g + ne) : ne = g;
          }
          return ne;
        }(this.scheme, V || p), this.query = D || p, this.fragment = U || p, v(this, $));
      }
      return E.isUri = function(M) {
        return M instanceof E || !!M && typeof M.authority == "string" && typeof M.fragment == "string" && typeof M.path == "string" && typeof M.query == "string" && typeof M.scheme == "string" && typeof M.fsPath == "string" && typeof M.with == "function" && typeof M.toString == "function";
      }, Object.defineProperty(E.prototype, "fsPath", { get: function() {
        return y(this, !1);
      }, enumerable: !1, configurable: !0 }), E.prototype.with = function(M) {
        if (!M)
          return this;
        var F = M.scheme, V = M.authority, D = M.path, U = M.query, $ = M.fragment;
        return F === void 0 ? F = this.scheme : F === null && (F = p), V === void 0 ? V = this.authority : V === null && (V = p), D === void 0 ? D = this.path : D === null && (D = p), U === void 0 ? U = this.query : U === null && (U = p), $ === void 0 ? $ = this.fragment : $ === null && ($ = p), F === this.scheme && V === this.authority && D === this.path && U === this.query && $ === this.fragment ? this : new N(F, V, D, U, $);
      }, E.parse = function(M, F) {
        F === void 0 && (F = !1);
        var V = A.exec(M);
        return V ? new N(V[2] || p, P(V[4] || p), P(V[5] || p), P(V[7] || p), P(V[9] || p), F) : new N(p, p, p, p, p);
      }, E.file = function(M) {
        var F = p;
        if (o && (M = M.replace(/\\/g, g)), M[0] === g && M[1] === g) {
          var V = M.indexOf(g, 2);
          V === -1 ? (F = M.substring(2), M = g) : (F = M.substring(2, V), M = M.substring(V) || g);
        }
        return new N("file", F, M, p, p);
      }, E.from = function(M) {
        var F = new N(M.scheme, M.authority, M.path, M.query, M.fragment);
        return v(F, !0), F;
      }, E.prototype.toString = function(M) {
        return M === void 0 && (M = !1), _(this, M);
      }, E.prototype.toJSON = function() {
        return this;
      }, E.revive = function(M) {
        if (M) {
          if (M instanceof E)
            return M;
          var F = new N(M);
          return F._formatted = M.external, F._fsPath = M._sep === C ? M.fsPath : null, F;
        }
        return M;
      }, E;
    }(), C = o ? 1 : void 0, N = function(E) {
      function M() {
        var F = E !== null && E.apply(this, arguments) || this;
        return F._formatted = null, F._fsPath = null, F;
      }
      return h(M, E), Object.defineProperty(M.prototype, "fsPath", { get: function() {
        return this._fsPath || (this._fsPath = y(this, !1)), this._fsPath;
      }, enumerable: !1, configurable: !0 }), M.prototype.toString = function(F) {
        return F === void 0 && (F = !1), F ? _(this, !0) : (this._formatted || (this._formatted = _(this, !1)), this._formatted);
      }, M.prototype.toJSON = function() {
        var F = { $mid: 1 };
        return this._fsPath && (F.fsPath = this._fsPath, F._sep = C), this._formatted && (F.external = this._formatted), this.path && (F.path = this.path), this.scheme && (F.scheme = this.scheme), this.authority && (F.authority = this.authority), this.query && (F.query = this.query), this.fragment && (F.fragment = this.fragment), F;
      }, M;
    }(S), x = ((c = {})[58] = "%3A", c[47] = "%2F", c[63] = "%3F", c[35] = "%23", c[91] = "%5B", c[93] = "%5D", c[64] = "%40", c[33] = "%21", c[36] = "%24", c[38] = "%26", c[39] = "%27", c[40] = "%28", c[41] = "%29", c[42] = "%2A", c[43] = "%2B", c[44] = "%2C", c[59] = "%3B", c[61] = "%3D", c[32] = "%20", c);
    function w(E, M) {
      for (var F = void 0, V = -1, D = 0; D < E.length; D++) {
        var U = E.charCodeAt(D);
        if (U >= 97 && U <= 122 || U >= 65 && U <= 90 || U >= 48 && U <= 57 || U === 45 || U === 46 || U === 95 || U === 126 || M && U === 47)
          V !== -1 && (F += encodeURIComponent(E.substring(V, D)), V = -1), F !== void 0 && (F += E.charAt(D));
        else {
          F === void 0 && (F = E.substr(0, D));
          var $ = x[U];
          $ !== void 0 ? (V !== -1 && (F += encodeURIComponent(E.substring(V, D)), V = -1), F += $) : V === -1 && (V = D);
        }
      }
      return V !== -1 && (F += encodeURIComponent(E.substring(V))), F !== void 0 ? F : E;
    }
    function b(E) {
      for (var M = void 0, F = 0; F < E.length; F++) {
        var V = E.charCodeAt(F);
        V === 35 || V === 63 ? (M === void 0 && (M = E.substr(0, F)), M += x[V]) : M !== void 0 && (M += E[F]);
      }
      return M !== void 0 ? M : E;
    }
    function y(E, M) {
      var F;
      return F = E.authority && E.path.length > 1 && E.scheme === "file" ? "//".concat(E.authority).concat(E.path) : E.path.charCodeAt(0) === 47 && (E.path.charCodeAt(1) >= 65 && E.path.charCodeAt(1) <= 90 || E.path.charCodeAt(1) >= 97 && E.path.charCodeAt(1) <= 122) && E.path.charCodeAt(2) === 58 ? M ? E.path.substr(1) : E.path[1].toLowerCase() + E.path.substr(2) : E.path, o && (F = F.replace(/\//g, "\\")), F;
    }
    function _(E, M) {
      var F = M ? b : w, V = "", D = E.scheme, U = E.authority, $ = E.path, we = E.query, ne = E.fragment;
      if (D && (V += D, V += ":"), (U || D === "file") && (V += g, V += g), U) {
        var me = U.indexOf("@");
        if (me !== -1) {
          var Ze = U.substr(0, me);
          U = U.substr(me + 1), (me = Ze.indexOf(":")) === -1 ? V += F(Ze, !1) : (V += F(Ze.substr(0, me), !1), V += ":", V += F(Ze.substr(me + 1), !1)), V += "@";
        }
        (me = (U = U.toLowerCase()).indexOf(":")) === -1 ? V += F(U, !1) : (V += F(U.substr(0, me), !1), V += U.substr(me));
      }
      if ($) {
        if ($.length >= 3 && $.charCodeAt(0) === 47 && $.charCodeAt(2) === 58)
          (ye = $.charCodeAt(1)) >= 65 && ye <= 90 && ($ = "/".concat(String.fromCharCode(ye + 32), ":").concat($.substr(3)));
        else if ($.length >= 2 && $.charCodeAt(1) === 58) {
          var ye;
          (ye = $.charCodeAt(0)) >= 65 && ye <= 90 && ($ = "".concat(String.fromCharCode(ye + 32), ":").concat($.substr(2)));
        }
        V += F($, !0);
      }
      return we && (V += "?", V += F(we, !1)), ne && (V += "#", V += M ? ne : w(ne, !1)), V;
    }
    function k(E) {
      try {
        return decodeURIComponent(E);
      } catch {
        return E.length > 3 ? E.substr(0, 3) + k(E.substr(3)) : E;
      }
    }
    var T = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
    function P(E) {
      return E.match(T) ? E.replace(T, function(M) {
        return k(M);
      }) : E;
    }
    var I, B = s(470), X = function(E, M, F) {
      if (F || arguments.length === 2)
        for (var V, D = 0, U = M.length; D < U; D++)
          !V && D in M || (V || (V = Array.prototype.slice.call(M, 0, D)), V[D] = M[D]);
      return E.concat(V || Array.prototype.slice.call(M));
    }, W = B.posix || B;
    (function(E) {
      E.joinPath = function(M) {
        for (var F = [], V = 1; V < arguments.length; V++)
          F[V - 1] = arguments[V];
        return M.with({ path: W.join.apply(W, X([M.path], F, !1)) });
      }, E.resolvePath = function(M) {
        for (var F = [], V = 1; V < arguments.length; V++)
          F[V - 1] = arguments[V];
        var D = M.path || "/";
        return M.with({ path: W.resolve.apply(W, X([D], F, !1)) });
      }, E.dirname = function(M) {
        var F = W.dirname(M.path);
        return F.length === 1 && F.charCodeAt(0) === 46 ? M : M.with({ path: F });
      }, E.basename = function(M) {
        return W.basename(M.path);
      }, E.extname = function(M) {
        return W.extname(M.path);
      };
    })(I || (I = {}));
  } }, t = {};
  function r(n) {
    if (t[n])
      return t[n].exports;
    var i = t[n] = { exports: {} };
    return e[n](i, i.exports, r), i.exports;
  }
  return r.d = (n, i) => {
    for (var s in i)
      r.o(i, s) && !r.o(n, s) && Object.defineProperty(n, s, { enumerable: !0, get: i[s] });
  }, r.o = (n, i) => Object.prototype.hasOwnProperty.call(n, i), r.r = (n) => {
    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
  }, r(447);
})();
var { URI: st, Utils: gl } = wa;
function Go(e, t) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  for (var r = String(e), n = "", i = t ? !!t.extended : !1, s = t ? !!t.globstar : !1, o = !1, l = t && typeof t.flags == "string" ? t.flags : "", u, c = 0, h = r.length; c < h; c++)
    switch (u = r[c], u) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        n += "\\" + u;
        break;
      case "?":
        if (i) {
          n += ".";
          break;
        }
      case "[":
      case "]":
        if (i) {
          n += u;
          break;
        }
      case "{":
        if (i) {
          o = !0, n += "(";
          break;
        }
      case "}":
        if (i) {
          o = !1, n += ")";
          break;
        }
      case ",":
        if (o) {
          n += "|";
          break;
        }
        n += "\\" + u;
        break;
      case "*":
        for (var f = r[c - 1], d = 1; r[c + 1] === "*"; )
          d++, c++;
        var m = r[c + 1];
        if (!s)
          n += ".*";
        else {
          var v = d > 1 && (f === "/" || f === void 0 || f === "{" || f === ",") && (m === "/" || m === void 0 || m === "," || m === "}");
          v ? (m === "/" ? c++ : f === "/" && n.endsWith("\\/") && (n = n.substr(0, n.length - 2)), n += "((?:[^/]*(?:/|$))*)") : n += "([^/]*)";
        }
        break;
      default:
        n += u;
    }
  return (!l || !~l.indexOf("g")) && (n = "^" + n + "$"), new RegExp(n, l);
}
var Ce = At(), Jo = "!", Zo = "/", Xo = function() {
  function e(t, r) {
    this.globWrappers = [];
    try {
      for (var n = 0, i = t; n < i.length; n++) {
        var s = i[n], o = s[0] !== Jo;
        o || (s = s.substring(1)), s.length > 0 && (s[0] === Zo && (s = s.substring(1)), this.globWrappers.push({
          regexp: Go("**/" + s, { extended: !0, globstar: !0 }),
          include: o
        }));
      }
      this.uris = r;
    } catch {
      this.globWrappers.length = 0, this.uris = [];
    }
  }
  return e.prototype.matchesPattern = function(t) {
    for (var r = !1, n = 0, i = this.globWrappers; n < i.length; n++) {
      var s = i[n], o = s.regexp, l = s.include;
      o.test(t) && (r = l);
    }
    return r;
  }, e.prototype.getURIs = function() {
    return this.uris;
  }, e;
}(), Qo = function() {
  function e(t, r, n) {
    this.service = t, this.uri = r, this.dependencies = /* @__PURE__ */ new Set(), this.anchors = void 0, n && (this.unresolvedSchema = this.service.promise.resolve(new ft(n)));
  }
  return e.prototype.getUnresolvedSchema = function() {
    return this.unresolvedSchema || (this.unresolvedSchema = this.service.loadSchema(this.uri)), this.unresolvedSchema;
  }, e.prototype.getResolvedSchema = function() {
    var t = this;
    return this.resolvedSchema || (this.resolvedSchema = this.getUnresolvedSchema().then(function(r) {
      return t.service.resolveSchemaContent(r, t);
    })), this.resolvedSchema;
  }, e.prototype.clearSchema = function() {
    var t = !!this.unresolvedSchema;
    return this.resolvedSchema = void 0, this.unresolvedSchema = void 0, this.dependencies.clear(), this.anchors = void 0, t;
  }, e;
}(), ft = function() {
  function e(t, r) {
    r === void 0 && (r = []), this.schema = t, this.errors = r;
  }
  return e;
}(), Ji = function() {
  function e(t, r) {
    r === void 0 && (r = []), this.schema = t, this.errors = r;
  }
  return e.prototype.getSection = function(t) {
    var r = this.getSectionRecursive(t, this.schema);
    if (r)
      return oe(r);
  }, e.prototype.getSectionRecursive = function(t, r) {
    if (!r || typeof r == "boolean" || t.length === 0)
      return r;
    var n = t.shift();
    if (r.properties && typeof r.properties[n])
      return this.getSectionRecursive(t, r.properties[n]);
    if (r.patternProperties)
      for (var i = 0, s = Object.keys(r.patternProperties); i < s.length; i++) {
        var o = s[i], l = qt(o);
        if (l != null && l.test(n))
          return this.getSectionRecursive(t, r.patternProperties[o]);
      }
    else {
      if (typeof r.additionalProperties == "object")
        return this.getSectionRecursive(t, r.additionalProperties);
      if (n.match("[0-9]+")) {
        if (Array.isArray(r.items)) {
          var u = parseInt(n, 10);
          if (!isNaN(u) && r.items[u])
            return this.getSectionRecursive(t, r.items[u]);
        } else if (r.items)
          return this.getSectionRecursive(t, r.items);
      }
    }
  }, e;
}(), Yo = function() {
  function e(t, r, n) {
    this.contextService = r, this.requestService = t, this.promiseConstructor = n || Promise, this.callOnDispose = [], this.contributionSchemas = {}, this.contributionAssociations = [], this.schemasById = {}, this.filePatternAssociations = [], this.registeredSchemasIds = {};
  }
  return e.prototype.getRegisteredSchemaIds = function(t) {
    return Object.keys(this.registeredSchemasIds).filter(function(r) {
      var n = st.parse(r).scheme;
      return n !== "schemaservice" && (!t || t(n));
    });
  }, Object.defineProperty(e.prototype, "promise", {
    get: function() {
      return this.promiseConstructor;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.dispose = function() {
    for (; this.callOnDispose.length > 0; )
      this.callOnDispose.pop()();
  }, e.prototype.onResourceChange = function(t) {
    var r = this;
    this.cachedSchemaForResource = void 0;
    var n = !1;
    t = Ee(t);
    for (var i = [t], s = Object.keys(this.schemasById).map(function(c) {
      return r.schemasById[c];
    }); i.length; )
      for (var o = i.pop(), l = 0; l < s.length; l++) {
        var u = s[l];
        u && (u.uri === o || u.dependencies.has(o)) && (u.uri !== o && i.push(u.uri), u.clearSchema() && (n = !0), s[l] = void 0);
      }
    return n;
  }, e.prototype.setSchemaContributions = function(t) {
    if (t.schemas) {
      var r = t.schemas;
      for (var n in r) {
        var i = Ee(n);
        this.contributionSchemas[i] = this.addSchemaHandle(i, r[n]);
      }
    }
    if (Array.isArray(t.schemaAssociations))
      for (var s = t.schemaAssociations, o = 0, l = s; o < l.length; o++) {
        var u = l[o], c = u.uris.map(Ee), h = this.addFilePatternAssociation(u.pattern, c);
        this.contributionAssociations.push(h);
      }
  }, e.prototype.addSchemaHandle = function(t, r) {
    var n = new Qo(this, t, r);
    return this.schemasById[t] = n, n;
  }, e.prototype.getOrAddSchemaHandle = function(t, r) {
    return this.schemasById[t] || this.addSchemaHandle(t, r);
  }, e.prototype.addFilePatternAssociation = function(t, r) {
    var n = new Xo(t, r);
    return this.filePatternAssociations.push(n), n;
  }, e.prototype.registerExternalSchema = function(t, r, n) {
    var i = Ee(t);
    return this.registeredSchemasIds[i] = !0, this.cachedSchemaForResource = void 0, r && this.addFilePatternAssociation(r, [i]), n ? this.addSchemaHandle(i, n) : this.getOrAddSchemaHandle(i);
  }, e.prototype.clearExternalSchemas = function() {
    this.schemasById = {}, this.filePatternAssociations = [], this.registeredSchemasIds = {}, this.cachedSchemaForResource = void 0;
    for (var t in this.contributionSchemas)
      this.schemasById[t] = this.contributionSchemas[t], this.registeredSchemasIds[t] = !0;
    for (var r = 0, n = this.contributionAssociations; r < n.length; r++) {
      var i = n[r];
      this.filePatternAssociations.push(i);
    }
  }, e.prototype.getResolvedSchema = function(t) {
    var r = Ee(t), n = this.schemasById[r];
    return n ? n.getResolvedSchema() : this.promise.resolve(void 0);
  }, e.prototype.loadSchema = function(t) {
    if (!this.requestService) {
      var r = Ce("json.schema.norequestservice", "Unable to load schema from '{0}'. No schema request service available", Et(t));
      return this.promise.resolve(new ft({}, [r]));
    }
    return this.requestService(t).then(function(n) {
      if (!n) {
        var i = Ce("json.schema.nocontent", "Unable to load schema from '{0}': No content.", Et(t));
        return new ft({}, [i]);
      }
      var s = {}, o = [];
      s = go(n, o);
      var l = o.length ? [Ce("json.schema.invalidFormat", "Unable to parse content from '{0}': Parse error at offset {1}.", Et(t), o[0].offset)] : [];
      return new ft(s, l);
    }, function(n) {
      var i = n.toString(), s = n.toString().split("Error: ");
      return s.length > 1 && (i = s[1]), vt(i, ".") && (i = i.substr(0, i.length - 1)), new ft({}, [Ce("json.schema.nocontent", "Unable to load schema from '{0}': {1}.", Et(t), i)]);
    });
  }, e.prototype.resolveSchemaContent = function(t, r) {
    var n = this, i = t.errors.slice(0), s = t.schema;
    if (s.$schema) {
      var o = Ee(s.$schema);
      if (o === "http://json-schema.org/draft-03/schema")
        return this.promise.resolve(new Ji({}, [Ce("json.schema.draft03.notsupported", "Draft-03 schemas are not supported.")]));
      o === "https://json-schema.org/draft/2019-09/schema" ? i.push(Ce("json.schema.draft201909.notsupported", "Draft 2019-09 schemas are not yet fully supported.")) : o === "https://json-schema.org/draft/2020-12/schema" && i.push(Ce("json.schema.draft202012.notsupported", "Draft 2020-12 schemas are not yet fully supported."));
    }
    var l = this.contextService, u = function(p, g) {
      g = decodeURIComponent(g);
      var A = p;
      return g[0] === "/" && (g = g.substring(1)), g.split("/").some(function(S) {
        return S = S.replace(/~1/g, "/").replace(/~0/g, "~"), A = A[S], !A;
      }), A;
    }, c = function(p, g, A) {
      return g.anchors || (g.anchors = v(p)), g.anchors.get(A);
    }, h = function(p, g) {
      for (var A in g)
        g.hasOwnProperty(A) && !p.hasOwnProperty(A) && A !== "id" && A !== "$id" && (p[A] = g[A]);
    }, f = function(p, g, A, S) {
      var C;
      S === void 0 || S.length === 0 ? C = g : S.charAt(0) === "/" ? C = u(g, S) : C = c(g, A, S), C ? h(p, C) : i.push(Ce("json.schema.invalidid", "$ref '{0}' in '{1}' can not be resolved.", S, A.uri));
    }, d = function(p, g, A, S) {
      l && !/^[A-Za-z][A-Za-z0-9+\-.+]*:\/\/.*/.test(g) && (g = l.resolveRelativePath(g, S.uri)), g = Ee(g);
      var C = n.getOrAddSchemaHandle(g);
      return C.getUnresolvedSchema().then(function(N) {
        if (S.dependencies.add(g), N.errors.length) {
          var x = A ? g + "#" + A : g;
          i.push(Ce("json.schema.problemloadingref", "Problems loading reference '{0}': {1}", x, N.errors[0]));
        }
        return f(p, N.schema, C, A), m(p, N.schema, C);
      });
    }, m = function(p, g, A) {
      var S = [];
      return n.traverseNodes(p, function(C) {
        for (var N = /* @__PURE__ */ new Set(); C.$ref; ) {
          var x = C.$ref, w = x.split("#", 2);
          if (delete C.$ref, w[0].length > 0) {
            S.push(d(C, w[0], w[1], A));
            return;
          } else if (!N.has(x)) {
            var b = w[1];
            f(C, g, A, b), N.add(x);
          }
        }
      }), n.promise.all(S);
    }, v = function(p) {
      var g = /* @__PURE__ */ new Map();
      return n.traverseNodes(p, function(A) {
        var S = A.$id || A.id;
        if (typeof S == "string" && S.charAt(0) === "#") {
          var C = S.substring(1);
          g.has(C) ? i.push(Ce("json.schema.duplicateid", "Duplicate id declaration: '{0}'", S)) : g.set(C, A);
        }
      }), g;
    };
    return m(s, s, r).then(function(p) {
      return new Ji(s, i);
    });
  }, e.prototype.traverseNodes = function(t, r) {
    if (!t || typeof t != "object")
      return Promise.resolve(null);
    for (var n = /* @__PURE__ */ new Set(), i = function() {
      for (var c = [], h = 0; h < arguments.length; h++)
        c[h] = arguments[h];
      for (var f = 0, d = c; f < d.length; f++) {
        var m = d[f];
        typeof m == "object" && l.push(m);
      }
    }, s = function() {
      for (var c = [], h = 0; h < arguments.length; h++)
        c[h] = arguments[h];
      for (var f = 0, d = c; f < d.length; f++) {
        var m = d[f];
        if (typeof m == "object")
          for (var v in m) {
            var p = v, g = m[p];
            typeof g == "object" && l.push(g);
          }
      }
    }, o = function() {
      for (var c = [], h = 0; h < arguments.length; h++)
        c[h] = arguments[h];
      for (var f = 0, d = c; f < d.length; f++) {
        var m = d[f];
        if (Array.isArray(m))
          for (var v = 0, p = m; v < p.length; v++) {
            var g = p[v];
            typeof g == "object" && l.push(g);
          }
      }
    }, l = [t], u = l.pop(); u; )
      n.has(u) || (n.add(u), r(u), i(u.items, u.additionalItems, u.additionalProperties, u.not, u.contains, u.propertyNames, u.if, u.then, u.else), s(u.definitions, u.properties, u.patternProperties, u.dependencies), o(u.anyOf, u.allOf, u.oneOf, u.items)), u = l.pop();
  }, e.prototype.getSchemaFromProperty = function(t, r) {
    var n, i;
    if (((n = r.root) === null || n === void 0 ? void 0 : n.type) === "object")
      for (var s = 0, o = r.root.properties; s < o.length; s++) {
        var l = o[s];
        if (l.keyNode.value === "$schema" && ((i = l.valueNode) === null || i === void 0 ? void 0 : i.type) === "string") {
          var u = l.valueNode.value;
          return this.contextService && !/^\w[\w\d+.-]*:/.test(u) && (u = this.contextService.resolveRelativePath(u, t)), u;
        }
      }
  }, e.prototype.getAssociatedSchemas = function(t) {
    for (var r = /* @__PURE__ */ Object.create(null), n = [], i = el(t), s = 0, o = this.filePatternAssociations; s < o.length; s++) {
      var l = o[s];
      if (l.matchesPattern(i))
        for (var u = 0, c = l.getURIs(); u < c.length; u++) {
          var h = c[u];
          r[h] || (n.push(h), r[h] = !0);
        }
    }
    return n;
  }, e.prototype.getSchemaURIsForResource = function(t, r) {
    var n = r && this.getSchemaFromProperty(t, r);
    return n ? [n] : this.getAssociatedSchemas(t);
  }, e.prototype.getSchemaForResource = function(t, r) {
    if (r) {
      var n = this.getSchemaFromProperty(t, r);
      if (n) {
        var i = Ee(n);
        return this.getOrAddSchemaHandle(i).getResolvedSchema();
      }
    }
    if (this.cachedSchemaForResource && this.cachedSchemaForResource.resource === t)
      return this.cachedSchemaForResource.resolvedSchema;
    var s = this.getAssociatedSchemas(t), o = s.length > 0 ? this.createCombinedSchema(t, s).getResolvedSchema() : this.promise.resolve(void 0);
    return this.cachedSchemaForResource = { resource: t, resolvedSchema: o }, o;
  }, e.prototype.createCombinedSchema = function(t, r) {
    if (r.length === 1)
      return this.getOrAddSchemaHandle(r[0]);
    var n = "schemaservice://combinedSchema/" + encodeURIComponent(t), i = {
      allOf: r.map(function(s) {
        return { $ref: s };
      })
    };
    return this.addSchemaHandle(n, i);
  }, e.prototype.getMatchingSchemas = function(t, r, n) {
    if (n) {
      var i = n.id || "schemaservice://untitled/matchingSchemas/" + Ko++, s = this.addSchemaHandle(i, n);
      return s.getResolvedSchema().then(function(o) {
        return r.getMatchingSchemas(o.schema).filter(function(l) {
          return !l.inverted;
        });
      });
    }
    return this.getSchemaForResource(t.uri, r).then(function(o) {
      return o ? r.getMatchingSchemas(o.schema).filter(function(l) {
        return !l.inverted;
      }) : [];
    });
  }, e;
}(), Ko = 0;
function Ee(e) {
  try {
    return st.parse(e).toString(!0);
  } catch {
    return e;
  }
}
function el(e) {
  try {
    return st.parse(e).with({ fragment: null, query: null }).toString(!0);
  } catch {
    return e;
  }
}
function Et(e) {
  try {
    var t = st.parse(e);
    if (t.scheme === "file")
      return t.fsPath;
  } catch {
  }
  return e;
}
function tl(e, t) {
  var r = [], n = [], i = [], s = -1, o = nt(e.getText(), !1), l = o.scan();
  function u(k) {
    r.push(k), n.push(i.length);
  }
  for (; l !== 17; ) {
    switch (l) {
      case 1:
      case 3: {
        var c = e.positionAt(o.getTokenOffset()).line, h = { startLine: c, endLine: c, kind: l === 1 ? "object" : "array" };
        i.push(h);
        break;
      }
      case 2:
      case 4: {
        var f = l === 2 ? "object" : "array";
        if (i.length > 0 && i[i.length - 1].kind === f) {
          var h = i.pop(), d = e.positionAt(o.getTokenOffset()).line;
          h && d > h.startLine + 1 && s !== h.startLine && (h.endLine = d - 1, u(h), s = h.startLine);
        }
        break;
      }
      case 13: {
        var c = e.positionAt(o.getTokenOffset()).line, m = e.positionAt(o.getTokenOffset() + o.getTokenLength()).line;
        o.getTokenError() === 1 && c + 1 < e.lineCount ? o.setPosition(e.offsetAt(ve.create(c + 1, 0))) : c < m && (u({ startLine: c, endLine: m, kind: mt.Comment }), s = c);
        break;
      }
      case 12: {
        var v = e.getText().substr(o.getTokenOffset(), o.getTokenLength()), p = v.match(/^\/\/\s*#(region\b)|(endregion\b)/);
        if (p) {
          var d = e.positionAt(o.getTokenOffset()).line;
          if (p[1]) {
            var h = { startLine: d, endLine: d, kind: mt.Region };
            i.push(h);
          } else {
            for (var g = i.length - 1; g >= 0 && i[g].kind !== mt.Region; )
              g--;
            if (g >= 0) {
              var h = i[g];
              i.length = g, d > h.startLine && s !== h.startLine && (h.endLine = d, u(h), s = h.startLine);
            }
          }
        }
        break;
      }
    }
    l = o.scan();
  }
  var A = t && t.rangeLimit;
  if (typeof A != "number" || r.length <= A)
    return r;
  t && t.onRangeLimitExceeded && t.onRangeLimitExceeded(e.uri);
  for (var S = [], C = 0, N = n; C < N.length; C++) {
    var x = N[C];
    x < 30 && (S[x] = (S[x] || 0) + 1);
  }
  for (var w = 0, b = 0, g = 0; g < S.length; g++) {
    var y = S[g];
    if (y) {
      if (y + w > A) {
        b = g;
        break;
      }
      w += y;
    }
  }
  for (var _ = [], g = 0; g < r.length; g++) {
    var x = n[g];
    typeof x == "number" && (x < b || x === b && w++ < A) && _.push(r[g]);
  }
  return _;
}
function rl(e, t, r) {
  function n(l) {
    for (var u = e.offsetAt(l), c = r.getNodeFromOffset(u, !0), h = []; c; ) {
      switch (c.type) {
        case "string":
        case "object":
        case "array":
          var f = c.offset + 1, d = c.offset + c.length - 1;
          f < d && u >= f && u <= d && h.push(i(f, d)), h.push(i(c.offset, c.offset + c.length));
          break;
        case "number":
        case "boolean":
        case "null":
        case "property":
          h.push(i(c.offset, c.offset + c.length));
          break;
      }
      if (c.type === "property" || c.parent && c.parent.type === "array") {
        var m = o(c.offset + c.length, 5);
        m !== -1 && h.push(i(c.offset, m));
      }
      c = c.parent;
    }
    for (var v = void 0, p = h.length - 1; p >= 0; p--)
      v = Jt.create(h[p], v);
    return v || (v = Jt.create(H.create(l, l))), v;
  }
  function i(l, u) {
    return H.create(e.positionAt(l), e.positionAt(u));
  }
  var s = nt(e.getText(), !0);
  function o(l, u) {
    s.setPosition(l);
    var c = s.scan();
    return c === u ? s.getTokenOffset() + s.getTokenLength() : -1;
  }
  return t.map(n);
}
function nl(e, t) {
  var r = [];
  return t.visit(function(n) {
    var i;
    if (n.type === "property" && n.keyNode.value === "$ref" && ((i = n.valueNode) === null || i === void 0 ? void 0 : i.type) === "string") {
      var s = n.valueNode.value, o = al(t, s);
      if (o) {
        var l = e.positionAt(o.offset);
        r.push({
          target: "".concat(e.uri, "#").concat(l.line + 1, ",").concat(l.character + 1),
          range: il(e, n.valueNode)
        });
      }
    }
    return !0;
  }), Promise.resolve(r);
}
function il(e, t) {
  return H.create(e.positionAt(t.offset + 1), e.positionAt(t.offset + t.length - 1));
}
function al(e, t) {
  var r = sl(t);
  return r ? Hr(r, e.root) : null;
}
function Hr(e, t) {
  if (!t)
    return null;
  if (e.length === 0)
    return t;
  var r = e.shift();
  if (t && t.type === "object") {
    var n = t.properties.find(function(o) {
      return o.keyNode.value === r;
    });
    return n ? Hr(e, n.valueNode) : null;
  } else if (t && t.type === "array" && r.match(/^(0|[1-9][0-9]*)$/)) {
    var i = Number.parseInt(r), s = t.items[i];
    return s ? Hr(e, s) : null;
  }
  return null;
}
function sl(e) {
  return e === "#" ? [] : e[0] !== "#" || e[1] !== "/" ? null : e.substring(2).split(/\//).map(ol);
}
function ol(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function ll(e) {
  var t = e.promiseConstructor || Promise, r = new Yo(e.schemaRequestService, e.workspaceContext, t);
  r.setSchemaContributions(Wr);
  var n = new Io(r, e.contributions, t, e.clientCapabilities), i = new Ro(r, e.contributions, t), s = new Ho(r), o = new Uo(r, t);
  return {
    configure: function(l) {
      r.clearExternalSchemas(), l.schemas && l.schemas.forEach(function(u) {
        r.registerExternalSchema(u.uri, u.fileMatch, u.schema);
      }), o.configure(l);
    },
    resetSchema: function(l) {
      return r.onResourceChange(l);
    },
    doValidation: o.doValidation.bind(o),
    getLanguageStatus: o.getLanguageStatus.bind(o),
    parseJSONDocument: function(l) {
      return Vo(l, { collectComments: !0 });
    },
    newJSONDocument: function(l, u) {
      return Fo(l, u);
    },
    getMatchingSchemas: r.getMatchingSchemas.bind(r),
    doResolve: n.doResolve.bind(n),
    doComplete: n.doComplete.bind(n),
    findDocumentSymbols: s.findDocumentSymbols.bind(s),
    findDocumentSymbols2: s.findDocumentSymbols2.bind(s),
    findDocumentColors: s.findDocumentColors.bind(s),
    getColorPresentations: s.getColorPresentations.bind(s),
    doHover: i.doHover.bind(i),
    getFoldingRanges: tl,
    getSelectionRanges: rl,
    findDefinition: function() {
      return Promise.resolve([]);
    },
    findLinks: nl,
    format: function(l, u, c) {
      var h = void 0;
      if (u) {
        var f = l.offsetAt(u.start), d = l.offsetAt(u.end) - f;
        h = { offset: f, length: d };
      }
      var m = { tabSize: c ? c.tabSize : 4, insertSpaces: (c == null ? void 0 : c.insertSpaces) === !0, insertFinalNewline: (c == null ? void 0 : c.insertFinalNewline) === !0, eol: `
` };
      return wo(l.getText(), h, m).map(function(v) {
        return be.replace(H.create(l.positionAt(v.offset), l.positionAt(v.offset + v.length)), v.content);
      });
    }
  };
}
var ya;
typeof fetch < "u" && (ya = function(e) {
  return fetch(e).then((t) => t.text());
});
var ul = class {
  constructor(e, t) {
    ot(this, "_ctx");
    ot(this, "_languageService");
    ot(this, "_languageSettings");
    ot(this, "_languageId");
    this._ctx = e, this._languageSettings = t.languageSettings, this._languageId = t.languageId, this._languageService = ll({
      workspaceContext: {
        resolveRelativePath: (r, n) => {
          const i = n.substr(0, n.lastIndexOf("/") + 1);
          return hl(i, r);
        }
      },
      schemaRequestService: t.enableSchemaRequest ? ya : void 0
    }), this._languageService.configure(this._languageSettings);
  }
  async doValidation(e) {
    let t = this._getTextDocument(e);
    if (t) {
      let r = this._languageService.parseJSONDocument(t);
      return this._languageService.doValidation(t, r, this._languageSettings);
    }
    return Promise.resolve([]);
  }
  async doComplete(e, t) {
    let r = this._getTextDocument(e);
    if (!r)
      return null;
    let n = this._languageService.parseJSONDocument(r);
    return this._languageService.doComplete(r, t, n);
  }
  async doResolve(e) {
    return this._languageService.doResolve(e);
  }
  async doHover(e, t) {
    let r = this._getTextDocument(e);
    if (!r)
      return null;
    let n = this._languageService.parseJSONDocument(r);
    return this._languageService.doHover(r, t, n);
  }
  async format(e, t, r) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let i = this._languageService.format(n, t, r);
    return Promise.resolve(i);
  }
  async resetSchema(e) {
    return Promise.resolve(this._languageService.resetSchema(e));
  }
  async findDocumentSymbols(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let r = this._languageService.parseJSONDocument(t), n = this._languageService.findDocumentSymbols(t, r);
    return Promise.resolve(n);
  }
  async findDocumentColors(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let r = this._languageService.parseJSONDocument(t), n = this._languageService.findDocumentColors(t, r);
    return Promise.resolve(n);
  }
  async getColorPresentations(e, t, r) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let i = this._languageService.parseJSONDocument(n), s = this._languageService.getColorPresentations(n, i, t, r);
    return Promise.resolve(s);
  }
  async getFoldingRanges(e, t) {
    let r = this._getTextDocument(e);
    if (!r)
      return [];
    let n = this._languageService.getFoldingRanges(r, t);
    return Promise.resolve(n);
  }
  async getSelectionRanges(e, t) {
    let r = this._getTextDocument(e);
    if (!r)
      return [];
    let n = this._languageService.parseJSONDocument(r), i = this._languageService.getSelectionRanges(r, t, n);
    return Promise.resolve(i);
  }
  _getTextDocument(e) {
    let t = this._ctx.getMirrorModels();
    for (let r of t)
      if (r.uri.toString() === e)
        return Ur.create(e, this._languageId, r.version, r.getValue());
    return null;
  }
}, cl = "/".charCodeAt(0), fr = ".".charCodeAt(0);
function fl(e) {
  return e.charCodeAt(0) === cl;
}
function hl(e, t) {
  if (fl(t)) {
    const r = st.parse(e), n = t.split("/");
    return r.with({ path: Ca(n) }).toString();
  }
  return dl(e, t);
}
function Ca(e) {
  const t = [];
  for (const n of e)
    n.length === 0 || n.length === 1 && n.charCodeAt(0) === fr || (n.length === 2 && n.charCodeAt(0) === fr && n.charCodeAt(1) === fr ? t.pop() : t.push(n));
  e.length > 1 && e[e.length - 1].length === 0 && t.push("");
  let r = t.join("/");
  return e[0].length === 0 && (r = "/" + r), r;
}
function dl(e, ...t) {
  const r = st.parse(e), n = r.path.split("/");
  for (let i of t)
    n.push(...i.split("/"));
  return r.with({ path: Ca(n) }).toString();
}
self.onmessage = () => {
  fa((e, t) => new ul(e, t));
};
