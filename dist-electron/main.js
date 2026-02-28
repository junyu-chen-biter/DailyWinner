var Wd = Object.defineProperty;
var Di = (e) => {
  throw TypeError(e);
};
var Xd = (e, t, r) => t in e ? Wd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Kr = (e, t, r) => Xd(e, typeof t != "symbol" ? t + "" : t, r), Ts = (e, t, r) => t.has(e) || Di("Cannot " + r);
var x = (e, t, r) => (Ts(e, t, "read from private field"), r ? r.call(e) : t.get(e)), He = (e, t, r) => t.has(e) ? Di("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ce = (e, t, r, n) => (Ts(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), ft = (e, t, r) => (Ts(e, t, "access private method"), r);
import Su, { app as ar, BrowserWindow as Pu, ipcMain as gn, Tray as Jd, Menu as Yd, screen as xd } from "electron";
import { fileURLToPath as Zd } from "node:url";
import re from "node:path";
import he from "node:process";
import { promisify as Se, isDeepStrictEqual as Mi } from "node:util";
import Z from "node:fs";
import Hr from "node:crypto";
import Li from "node:assert";
import Nu from "node:os";
import "node:events";
import "node:stream";
import Aa from "fs";
import ka from "path";
import Qd from "util";
import Ru from "child_process";
import ef from "os";
const ur = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Ou = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Tu = 1e6, tf = (e) => e >= "0" && e <= "9";
function Iu(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Tu;
  }
  return !1;
}
function Is(e, t) {
  return Ou.has(e) ? !1 : (e && Iu(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function rf(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of e) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Is(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Is(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const c = Number.parseInt(r, 10);
            !Number.isNaN(c) && Number.isFinite(c) && c >= 0 && c <= Number.MAX_SAFE_INTEGER && c <= Tu && r === String(c) ? t.push(c) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !tf(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Is(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function cs(e) {
  if (typeof e == "string")
    return rf(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Ou.has(n))
        return [];
      typeof n == "string" && Iu(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Vi(e, t, r) {
  if (!ur(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = cs(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function vn(e, t, r) {
  if (!ur(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = cs(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!ur(e[o])) {
      const u = typeof s[a + 1] == "number";
      e[o] = u ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function nf(e, t) {
  if (!ur(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = cs(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !ur(e))
      return !1;
  }
}
function js(e, t) {
  if (!ur(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = cs(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!ur(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const jt = Nu.homedir(), Ca = Nu.tmpdir(), { env: vr } = he, sf = (e) => {
  const t = re.join(jt, "Library");
  return {
    data: re.join(t, "Application Support", e),
    config: re.join(t, "Preferences", e),
    cache: re.join(t, "Caches", e),
    log: re.join(t, "Logs", e),
    temp: re.join(Ca, e)
  };
}, af = (e) => {
  const t = vr.APPDATA || re.join(jt, "AppData", "Roaming"), r = vr.LOCALAPPDATA || re.join(jt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: re.join(r, e, "Data"),
    config: re.join(t, e, "Config"),
    cache: re.join(r, e, "Cache"),
    log: re.join(r, e, "Log"),
    temp: re.join(Ca, e)
  };
}, of = (e) => {
  const t = re.basename(jt);
  return {
    data: re.join(vr.XDG_DATA_HOME || re.join(jt, ".local", "share"), e),
    config: re.join(vr.XDG_CONFIG_HOME || re.join(jt, ".config"), e),
    cache: re.join(vr.XDG_CACHE_HOME || re.join(jt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: re.join(vr.XDG_STATE_HOME || re.join(jt, ".local", "state"), e),
    temp: re.join(Ca, t, e)
  };
};
function cf(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), he.platform === "darwin" ? sf(e) : he.platform === "win32" ? af(e) : of(e);
}
const Et = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, ht = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, uf = 250, wt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? uf, c = Date.now() + a;
    return function u(...d) {
      return e.apply(void 0, d).catch((l) => {
        if (!r(l) || Date.now() >= c)
          throw l;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise(($) => setTimeout($, h)).then(() => u.apply(void 0, d)) : u.apply(void 0, d);
      });
    };
  };
}, bt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...u) {
      for (; ; )
        try {
          return e.apply(void 0, u);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, Er = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Er.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !lf && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Er.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Er.isNodeError(e))
      throw e;
    if (!Er.isChangeErrorOk(e))
      throw e;
  }
}, En = {
  onError: Er.onChangeError
}, Fe = {
  onError: () => {
  }
}, lf = he.getuid ? !he.getuid() : !1, Pe = {
  isRetriable: Er.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: Et(Se(Z.chmod), En),
    chown: Et(Se(Z.chown), En),
    close: Et(Se(Z.close), Fe),
    fsync: Et(Se(Z.fsync), Fe),
    mkdir: Et(Se(Z.mkdir), Fe),
    realpath: Et(Se(Z.realpath), Fe),
    stat: Et(Se(Z.stat), Fe),
    unlink: Et(Se(Z.unlink), Fe),
    /* SYNC */
    chmodSync: ht(Z.chmodSync, En),
    chownSync: ht(Z.chownSync, En),
    closeSync: ht(Z.closeSync, Fe),
    existsSync: ht(Z.existsSync, Fe),
    fsyncSync: ht(Z.fsync, Fe),
    mkdirSync: ht(Z.mkdirSync, Fe),
    realpathSync: ht(Z.realpathSync, Fe),
    statSync: ht(Z.statSync, Fe),
    unlinkSync: ht(Z.unlinkSync, Fe)
  },
  retry: {
    /* ASYNC */
    close: wt(Se(Z.close), Pe),
    fsync: wt(Se(Z.fsync), Pe),
    open: wt(Se(Z.open), Pe),
    readFile: wt(Se(Z.readFile), Pe),
    rename: wt(Se(Z.rename), Pe),
    stat: wt(Se(Z.stat), Pe),
    write: wt(Se(Z.write), Pe),
    writeFile: wt(Se(Z.writeFile), Pe),
    /* SYNC */
    closeSync: bt(Z.closeSync, Pe),
    fsyncSync: bt(Z.fsyncSync, Pe),
    openSync: bt(Z.openSync, Pe),
    readFileSync: bt(Z.readFileSync, Pe),
    renameSync: bt(Z.renameSync, Pe),
    statSync: bt(Z.statSync, Pe),
    writeSync: bt(Z.writeSync, Pe),
    writeFileSync: bt(Z.writeFileSync, Pe)
  }
}, df = "utf8", Fi = 438, ff = 511, hf = {}, pf = he.geteuid ? he.geteuid() : -1, mf = he.getegid ? he.getegid() : -1, yf = 1e3, $f = !!he.getuid;
he.getuid && he.getuid();
const Ui = 128, _f = (e) => e instanceof Error && "code" in e, zi = (e) => typeof e == "string", As = (e) => e === void 0, gf = he.platform === "linux", ju = he.platform === "win32", Da = ["SIGHUP", "SIGINT", "SIGTERM"];
ju || Da.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
gf && Da.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class vf {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (ju && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? he.kill(he.pid, "SIGTERM") : he.kill(he.pid, t));
      }
    }, this.hook = () => {
      he.once("exit", () => this.exit());
      for (const t of Da)
        try {
          he.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Ef = new vf(), wf = Ef.register, Te = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Te.truncate(t(e));
    return n in Te.store ? Te.get(e, t, r) : (Te.store[n] = r, [n, () => delete Te.store[n]]);
  },
  purge: (e) => {
    Te.store[e] && (delete Te.store[e], Oe.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Te.store[e] && (delete Te.store[e], Oe.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Te.store)
      Te.purgeSync(e);
  },
  truncate: (e) => {
    const t = re.basename(e);
    if (t.length <= Ui)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Ui;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
wf(Te.purgeSyncAll);
function Au(e, t, r = hf) {
  if (zi(r))
    return Au(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? yf };
  let a = null, o = null, c = null;
  try {
    const u = Oe.attempt.realpathSync(e), d = !!u;
    e = u || e, [o, a] = Te.get(e, r.tmpCreate || Te.create, r.tmpPurge !== !1);
    const l = $f && As(r.chown), h = As(r.mode);
    if (d && (l || h)) {
      const E = Oe.attempt.statSync(e);
      E && (r = { ...r }, l && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = re.dirname(e);
      Oe.attempt.mkdirSync(E, {
        mode: ff,
        recursive: !0
      });
    }
    c = Oe.retry.openSync(s)(o, "w", r.mode || Fi), r.tmpCreated && r.tmpCreated(o), zi(t) ? Oe.retry.writeSync(s)(c, t, 0, r.encoding || df) : As(t) || Oe.retry.writeSync(s)(c, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(c) : Oe.attempt.fsync(c)), Oe.retry.closeSync(s)(c), c = null, r.chown && (r.chown.uid !== pf || r.chown.gid !== mf) && Oe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Fi && Oe.attempt.chmodSync(o, r.mode);
    try {
      Oe.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!_f(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Oe.retry.renameSync(s)(o, Te.truncate(e));
    }
    a(), o = null;
  } finally {
    c && Oe.attempt.closeSync(c), o && Te.purge(o);
  }
}
function Ma(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ha = { exports: {} }, ku = {}, Ze = {}, Tr = {}, fn = {}, ks = {}, Cs = {}, Gi;
function Zn() {
  return Gi || (Gi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends t {
      constructor(w) {
        if (super(), !e.IDENTIFIER.test(w))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = w;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = r;
    class n extends t {
      constructor(w) {
        super(), this._items = typeof w == "string" ? [w] : w;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const w = this._items[0];
        return w === "" || w === '""';
      }
      get str() {
        var w;
        return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, T) => `${N}${T}`, "");
      }
      get names() {
        var w;
        return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, T) => (T instanceof r && (N[T.str] = (N[T.str] || 0) + 1), N), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function s(p, ...w) {
      const N = [p[0]];
      let T = 0;
      for (; T < w.length; )
        c(N, w[T]), N.push(p[++T]);
      return new n(N);
    }
    e._ = s;
    const a = new n("+");
    function o(p, ...w) {
      const N = [$(p[0])];
      let T = 0;
      for (; T < w.length; )
        N.push(a), c(N, w[T]), N.push(a, $(p[++T]));
      return u(N), new n(N);
    }
    e.str = o;
    function c(p, w) {
      w instanceof n ? p.push(...w._items) : w instanceof r ? p.push(w) : p.push(h(w));
    }
    e.addCodeArg = c;
    function u(p) {
      let w = 1;
      for (; w < p.length - 1; ) {
        if (p[w] === a) {
          const N = d(p[w - 1], p[w + 1]);
          if (N !== void 0) {
            p.splice(w - 1, 3, N);
            continue;
          }
          p[w++] = "+";
        }
        w++;
      }
    }
    function d(p, w) {
      if (w === '""')
        return p;
      if (p === '""')
        return w;
      if (typeof p == "string")
        return w instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${p.slice(0, -1)}${w}"` : w[0] === '"' ? p.slice(0, -1) + w.slice(1) : void 0;
      if (typeof w == "string" && w[0] === '"' && !(p instanceof r))
        return `"${p}${w.slice(1)}`;
    }
    function l(p, w) {
      return w.emptyStr() ? p : p.emptyStr() ? w : o`${p}${w}`;
    }
    e.strConcat = l;
    function h(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : $(Array.isArray(p) ? p.join(",") : p);
    }
    function E(p) {
      return new n($(p));
    }
    e.stringify = E;
    function $(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = $;
    function v(p) {
      return typeof p == "string" && e.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
    }
    e.getProperty = v;
    function g(p) {
      if (typeof p == "string" && e.IDENTIFIER.test(p))
        return new n(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    e.getEsmExportName = g;
    function _(p) {
      return new n(p.toString());
    }
    e.regexpCode = _;
  }(Cs)), Cs;
}
var Ds = {}, qi;
function Ki() {
  return qi || (qi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Zn();
    class r extends Error {
      constructor(d) {
        super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
      }
    }
    var n;
    (function(u) {
      u[u.Started = 0] = "Started", u[u.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: d, parent: l } = {}) {
        this._names = {}, this._prefixes = d, this._parent = l;
      }
      toName(d) {
        return d instanceof t.Name ? d : this.name(d);
      }
      name(d) {
        return new t.Name(this._newName(d));
      }
      _newName(d) {
        const l = this._names[d] || this._nameGroup(d);
        return `${d}${l.index++}`;
      }
      _nameGroup(d) {
        var l, h;
        if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
          throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
        return this._names[d] = { prefix: d, index: 0 };
      }
    }
    e.Scope = s;
    class a extends t.Name {
      constructor(d, l) {
        super(l), this.prefix = d;
      }
      setValue(d, { property: l, itemIndex: h }) {
        this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
      }
    }
    e.ValueScopeName = a;
    const o = (0, t._)`\n`;
    class c extends s {
      constructor(d) {
        super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
      }
      get() {
        return this._scope;
      }
      name(d) {
        return new a(d, this._newName(d));
      }
      value(d, l) {
        var h;
        if (l.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const E = this.toName(d), { prefix: $ } = E, v = (h = l.key) !== null && h !== void 0 ? h : l.ref;
        let g = this._values[$];
        if (g) {
          const w = g.get(v);
          if (w)
            return w;
        } else
          g = this._values[$] = /* @__PURE__ */ new Map();
        g.set(v, E);
        const _ = this._scope[$] || (this._scope[$] = []), p = _.length;
        return _[p] = l.ref, E.setValue(l, { property: $, itemIndex: p }), E;
      }
      getValue(d, l) {
        const h = this._values[d];
        if (h)
          return h.get(l);
      }
      scopeRefs(d, l = this._values) {
        return this._reduceValues(l, (h) => {
          if (h.scopePath === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return (0, t._)`${d}${h.scopePath}`;
        });
      }
      scopeCode(d = this._values, l, h) {
        return this._reduceValues(d, (E) => {
          if (E.value === void 0)
            throw new Error(`CodeGen: name "${E}" has no value`);
          return E.value.code;
        }, l, h);
      }
      _reduceValues(d, l, h = {}, E) {
        let $ = t.nil;
        for (const v in d) {
          const g = d[v];
          if (!g)
            continue;
          const _ = h[v] = h[v] || /* @__PURE__ */ new Map();
          g.forEach((p) => {
            if (_.has(p))
              return;
            _.set(p, n.Started);
            let w = l(p);
            if (w) {
              const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              $ = (0, t._)`${$}${N} ${p} = ${w};${this.opts._n}`;
            } else if (w = E == null ? void 0 : E(p))
              $ = (0, t._)`${$}${w}${this.opts._n}`;
            else
              throw new r(p);
            _.set(p, n.Completed);
          });
        }
        return $;
      }
    }
    e.ValueScope = c;
  }(Ds)), Ds;
}
var Hi;
function te() {
  return Hi || (Hi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Zn(), r = Ki();
    var n = Zn();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var s = Ki();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class a {
      optimizeNodes() {
        return this;
      }
      optimizeNames(i, f) {
        return this;
      }
    }
    class o extends a {
      constructor(i, f, S) {
        super(), this.varKind = i, this.name = f, this.rhs = S;
      }
      render({ es5: i, _n: f }) {
        const S = i ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${S} ${this.name}${j};` + f;
      }
      optimizeNames(i, f) {
        if (i[this.name.str])
          return this.rhs && (this.rhs = R(this.rhs, i, f)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class c extends a {
      constructor(i, f, S) {
        super(), this.lhs = i, this.rhs = f, this.sideEffects = S;
      }
      render({ _n: i }) {
        return `${this.lhs} = ${this.rhs};` + i;
      }
      optimizeNames(i, f) {
        if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
          return this.rhs = R(this.rhs, i, f), this;
      }
      get names() {
        const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return K(i, this.rhs);
      }
    }
    class u extends c {
      constructor(i, f, S, j) {
        super(i, S, j), this.op = f;
      }
      render({ _n: i }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + i;
      }
    }
    class d extends a {
      constructor(i) {
        super(), this.label = i, this.names = {};
      }
      render({ _n: i }) {
        return `${this.label}:` + i;
      }
    }
    class l extends a {
      constructor(i) {
        super(), this.label = i, this.names = {};
      }
      render({ _n: i }) {
        return `break${this.label ? ` ${this.label}` : ""};` + i;
      }
    }
    class h extends a {
      constructor(i) {
        super(), this.error = i;
      }
      render({ _n: i }) {
        return `throw ${this.error};` + i;
      }
      get names() {
        return this.error.names;
      }
    }
    class E extends a {
      constructor(i) {
        super(), this.code = i;
      }
      render({ _n: i }) {
        return `${this.code};` + i;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(i, f) {
        return this.code = R(this.code, i, f), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class $ extends a {
      constructor(i = []) {
        super(), this.nodes = i;
      }
      render(i) {
        return this.nodes.reduce((f, S) => f + S.render(i), "");
      }
      optimizeNodes() {
        const { nodes: i } = this;
        let f = i.length;
        for (; f--; ) {
          const S = i[f].optimizeNodes();
          Array.isArray(S) ? i.splice(f, 1, ...S) : S ? i[f] = S : i.splice(f, 1);
        }
        return i.length > 0 ? this : void 0;
      }
      optimizeNames(i, f) {
        const { nodes: S } = this;
        let j = S.length;
        for (; j--; ) {
          const A = S[j];
          A.optimizeNames(i, f) || (O(i, A.names), S.splice(j, 1));
        }
        return S.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((i, f) => L(i, f.names), {});
      }
    }
    class v extends $ {
      render(i) {
        return "{" + i._n + super.render(i) + "}" + i._n;
      }
    }
    class g extends $ {
    }
    class _ extends v {
    }
    _.kind = "else";
    class p extends v {
      constructor(i, f) {
        super(f), this.condition = i;
      }
      render(i) {
        let f = `if(${this.condition})` + super.render(i);
        return this.else && (f += "else " + this.else.render(i)), f;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const i = this.condition;
        if (i === !0)
          return this.nodes;
        let f = this.else;
        if (f) {
          const S = f.optimizeNodes();
          f = this.else = Array.isArray(S) ? new _(S) : S;
        }
        if (f)
          return i === !1 ? f instanceof p ? f : f.nodes : this.nodes.length ? this : new p(k(i), f instanceof p ? [f] : f.nodes);
        if (!(i === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(i, f) {
        var S;
        if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
          return this.condition = R(this.condition, i, f), this;
      }
      get names() {
        const i = super.names;
        return K(i, this.condition), this.else && L(i, this.else.names), i;
      }
    }
    p.kind = "if";
    class w extends v {
    }
    w.kind = "for";
    class N extends w {
      constructor(i) {
        super(), this.iteration = i;
      }
      render(i) {
        return `for(${this.iteration})` + super.render(i);
      }
      optimizeNames(i, f) {
        if (super.optimizeNames(i, f))
          return this.iteration = R(this.iteration, i, f), this;
      }
      get names() {
        return L(super.names, this.iteration.names);
      }
    }
    class T extends w {
      constructor(i, f, S, j) {
        super(), this.varKind = i, this.name = f, this.from = S, this.to = j;
      }
      render(i) {
        const f = i.es5 ? r.varKinds.var : this.varKind, { name: S, from: j, to: A } = this;
        return `for(${f} ${S}=${j}; ${S}<${A}; ${S}++)` + super.render(i);
      }
      get names() {
        const i = K(super.names, this.from);
        return K(i, this.to);
      }
    }
    class I extends w {
      constructor(i, f, S, j) {
        super(), this.loop = i, this.varKind = f, this.name = S, this.iterable = j;
      }
      render(i) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
      }
      optimizeNames(i, f) {
        if (super.optimizeNames(i, f))
          return this.iterable = R(this.iterable, i, f), this;
      }
      get names() {
        return L(super.names, this.iterable.names);
      }
    }
    class G extends v {
      constructor(i, f, S) {
        super(), this.name = i, this.args = f, this.async = S;
      }
      render(i) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
      }
    }
    G.kind = "func";
    class W extends $ {
      render(i) {
        return "return " + super.render(i);
      }
    }
    W.kind = "return";
    class le extends v {
      render(i) {
        let f = "try" + super.render(i);
        return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
      }
      optimizeNodes() {
        var i, f;
        return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
      }
      optimizeNames(i, f) {
        var S, j;
        return super.optimizeNames(i, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(i, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(i, f), this;
      }
      get names() {
        const i = super.names;
        return this.catch && L(i, this.catch.names), this.finally && L(i, this.finally.names), i;
      }
    }
    class oe extends v {
      constructor(i) {
        super(), this.error = i;
      }
      render(i) {
        return `catch(${this.error})` + super.render(i);
      }
    }
    oe.kind = "catch";
    class ie extends v {
      render(i) {
        return "finally" + super.render(i);
      }
    }
    ie.kind = "finally";
    class q {
      constructor(i, f = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new g()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(i) {
        return this._scope.name(i);
      }
      // reserves unique name in the external scope
      scopeName(i) {
        return this._extScope.name(i);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(i, f) {
        const S = this._extScope.value(i, f);
        return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
      }
      getScopeValue(i, f) {
        return this._extScope.getValue(i, f);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(i) {
        return this._extScope.scopeRefs(i, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(i, f, S, j) {
        const A = this._scope.toName(f);
        return S !== void 0 && j && (this._constants[A.str] = S), this._leafNode(new o(i, A, S)), A;
      }
      // `const` declaration (`var` in es5 mode)
      const(i, f, S) {
        return this._def(r.varKinds.const, i, f, S);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(i, f, S) {
        return this._def(r.varKinds.let, i, f, S);
      }
      // `var` declaration with optional assignment
      var(i, f, S) {
        return this._def(r.varKinds.var, i, f, S);
      }
      // assignment code
      assign(i, f, S) {
        return this._leafNode(new c(i, f, S));
      }
      // `+=` code
      add(i, f) {
        return this._leafNode(new u(i, e.operators.ADD, f));
      }
      // appends passed SafeExpr to code or executes Block
      code(i) {
        return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...i) {
        const f = ["{"];
        for (const [S, j] of i)
          f.length > 1 && f.push(","), f.push(S), (S !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
        return f.push("}"), new t._Code(f);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(i, f, S) {
        if (this._blockNode(new p(i)), f && S)
          this.code(f).else().code(S).endIf();
        else if (f)
          this.code(f).endIf();
        else if (S)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(i) {
        return this._elseNode(new p(i));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new _());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, _);
      }
      _for(i, f) {
        return this._blockNode(i), f && this.code(f).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(i, f) {
        return this._for(new N(i), f);
      }
      // `for` statement for a range of values
      forRange(i, f, S, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const z = this._scope.toName(i);
        return this._for(new T(A, z, f, S), () => j(z));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(i, f, S, j = r.varKinds.const) {
        const A = this._scope.toName(i);
        if (this.opts.es5) {
          const z = f instanceof t.Name ? f : this.var("_arr", f);
          return this.forRange("_i", 0, (0, t._)`${z}.length`, (U) => {
            this.var(A, (0, t._)`${z}[${U}]`), S(A);
          });
        }
        return this._for(new I("of", j, A, f), () => S(A));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(i, f, S, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(i, (0, t._)`Object.keys(${f})`, S);
        const A = this._scope.toName(i);
        return this._for(new I("in", j, A, f), () => S(A));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(w);
      }
      // `label` statement
      label(i) {
        return this._leafNode(new d(i));
      }
      // `break` statement
      break(i) {
        return this._leafNode(new l(i));
      }
      // `return` statement
      return(i) {
        const f = new W();
        if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(W);
      }
      // `try` statement
      try(i, f, S) {
        if (!f && !S)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const j = new le();
        if (this._blockNode(j), this.code(i), f) {
          const A = this.name("e");
          this._currNode = j.catch = new oe(A), f(A);
        }
        return S && (this._currNode = j.finally = new ie(), this.code(S)), this._endBlockNode(oe, ie);
      }
      // `throw` statement
      throw(i) {
        return this._leafNode(new h(i));
      }
      // start self-balancing block
      block(i, f) {
        return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
      }
      // end the current self-balancing block
      endBlock(i) {
        const f = this._blockStarts.pop();
        if (f === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const S = this._nodes.length - f;
        if (S < 0 || i !== void 0 && S !== i)
          throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${i} expected`);
        return this._nodes.length = f, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(i, f = t.nil, S, j) {
        return this._blockNode(new G(i, f, S)), j && this.code(j).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(G);
      }
      optimize(i = 1) {
        for (; i-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(i) {
        return this._currNode.nodes.push(i), this;
      }
      _blockNode(i) {
        this._currNode.nodes.push(i), this._nodes.push(i);
      }
      _endBlockNode(i, f) {
        const S = this._currNode;
        if (S instanceof i || f && S instanceof f)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
      }
      _elseNode(i) {
        const f = this._currNode;
        if (!(f instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = f.else = i, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const i = this._nodes;
        return i[i.length - 1];
      }
      set _currNode(i) {
        const f = this._nodes;
        f[f.length - 1] = i;
      }
    }
    e.CodeGen = q;
    function L(y, i) {
      for (const f in i)
        y[f] = (y[f] || 0) + (i[f] || 0);
      return y;
    }
    function K(y, i) {
      return i instanceof t._CodeOrName ? L(y, i.names) : y;
    }
    function R(y, i, f) {
      if (y instanceof t.Name)
        return S(y);
      if (!j(y))
        return y;
      return new t._Code(y._items.reduce((A, z) => (z instanceof t.Name && (z = S(z)), z instanceof t._Code ? A.push(...z._items) : A.push(z), A), []));
      function S(A) {
        const z = f[A.str];
        return z === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], z);
      }
      function j(A) {
        return A instanceof t._Code && A._items.some((z) => z instanceof t.Name && i[z.str] === 1 && f[z.str] !== void 0);
      }
    }
    function O(y, i) {
      for (const f in i)
        y[f] = (y[f] || 0) - (i[f] || 0);
    }
    function k(y) {
      return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${b(y)}`;
    }
    e.not = k;
    const D = m(e.operators.AND);
    function M(...y) {
      return y.reduce(D);
    }
    e.and = M;
    const C = m(e.operators.OR);
    function P(...y) {
      return y.reduce(C);
    }
    e.or = P;
    function m(y) {
      return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${b(i)} ${y} ${b(f)}`;
    }
    function b(y) {
      return y instanceof t.Name ? y : (0, t._)`(${y})`;
    }
  }(ks)), ks;
}
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.checkStrictMode = V.getErrorPath = V.Type = V.useFunc = V.setEvaluated = V.evaluatedPropsToName = V.mergeEvaluated = V.eachItem = V.unescapeJsonPointer = V.escapeJsonPointer = V.escapeFragment = V.unescapeFragment = V.schemaRefOrVal = V.schemaHasRulesButRef = V.schemaHasRules = V.checkUnknownRules = V.alwaysValidSchema = V.toHash = void 0;
const ce = te(), bf = Zn();
function Sf(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
V.toHash = Sf;
function Pf(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Cu(e, t), !Du(t, e.self.RULES.all));
}
V.alwaysValidSchema = Pf;
function Cu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Vu(e, `unknown keyword: "${a}"`);
}
V.checkUnknownRules = Cu;
function Du(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
V.schemaHasRules = Du;
function Nf(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = Nf;
function Rf({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ce._)`${r}`;
  }
  return (0, ce._)`${e}${t}${(0, ce.getProperty)(n)}`;
}
V.schemaRefOrVal = Rf;
function Of(e) {
  return Mu(decodeURIComponent(e));
}
V.unescapeFragment = Of;
function Tf(e) {
  return encodeURIComponent(La(e));
}
V.escapeFragment = Tf;
function La(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = La;
function Mu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = Mu;
function If(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
V.eachItem = If;
function Bi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const u = o === void 0 ? a : o instanceof ce.Name ? (a instanceof ce.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ce.Name ? (t(s, o, a), a) : r(a, o);
    return c === ce.Name && !(u instanceof ce.Name) ? n(s, u) : u;
  };
}
V.mergeEvaluated = {
  props: Bi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ce._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ce._)`${r} || {}`).code((0, ce._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ce._)`${r} || {}`), Va(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Lu
  }),
  items: Bi({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ce._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ce._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Lu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ce._)`{}`);
  return t !== void 0 && Va(e, r, t), r;
}
V.evaluatedPropsToName = Lu;
function Va(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ce._)`${t}${(0, ce.getProperty)(n)}`, !0));
}
V.setEvaluated = Va;
const Wi = {};
function jf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Wi[t.code] || (Wi[t.code] = new bf._Code(t.code))
  });
}
V.useFunc = jf;
var pa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(pa || (V.Type = pa = {}));
function Af(e, t, r) {
  if (e instanceof ce.Name) {
    const n = t === pa.Num;
    return r ? n ? (0, ce._)`"[" + ${e} + "]"` : (0, ce._)`"['" + ${e} + "']"` : n ? (0, ce._)`"/" + ${e}` : (0, ce._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ce.getProperty)(e).toString() : "/" + La(e);
}
V.getErrorPath = Af;
function Vu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
V.checkStrictMode = Vu;
var Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
const Ne = te(), kf = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
Ue.default = kf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te(), r = V, n = Ue;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: p }) => p ? (0, t.str)`"${_}" keyword must be ${p} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, p = e.keywordError, w, N) {
    const { it: T } = _, { gen: I, compositeRule: G, allErrors: W } = T, le = h(_, p, w);
    N ?? (G || W) ? u(I, le) : d(T, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(_, p = e.keywordError, w) {
    const { it: N } = _, { gen: T, compositeRule: I, allErrors: G } = N, W = h(_, p, w);
    u(T, W), I || G || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(_, p) {
    _.assign(n.default.errors, p), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(p, () => _.assign((0, t._)`${n.default.vErrors}.length`, p), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: _, keyword: p, schemaValue: w, data: N, errsCount: T, it: I }) {
    if (T === void 0)
      throw new Error("ajv implementation error");
    const G = _.name("err");
    _.forRange("i", T, n.default.errors, (W) => {
      _.const(G, (0, t._)`${n.default.vErrors}[${W}]`), _.if((0, t._)`${G}.instancePath === undefined`, () => _.assign((0, t._)`${G}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), _.assign((0, t._)`${G}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${p}`), I.opts.verbose && (_.assign((0, t._)`${G}.schema`, w), _.assign((0, t._)`${G}.data`, N));
    });
  }
  e.extendErrors = c;
  function u(_, p) {
    const w = _.const("err", p);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function d(_, p) {
    const { gen: w, validateName: N, schemaEnv: T } = _;
    T.$async ? w.throw((0, t._)`new ${_.ValidationError}(${p})`) : (w.assign((0, t._)`${N}.errors`, p), w.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, p, w) {
    const { createErrors: N } = _.it;
    return N === !1 ? (0, t._)`{}` : E(_, p, w);
  }
  function E(_, p, w = {}) {
    const { gen: N, it: T } = _, I = [
      $(T, w),
      v(_, w)
    ];
    return g(_, p, I), N.object(...I);
  }
  function $({ errorPath: _ }, { instancePath: p }) {
    const w = p ? (0, t.str)`${_}${(0, r.getErrorPath)(p, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: _, it: { errSchemaPath: p } }, { schemaPath: w, parentSchema: N }) {
    let T = N ? p : (0, t.str)`${p}/${_}`;
    return w && (T = (0, t.str)`${T}${(0, r.getErrorPath)(w, r.Type.Str)}`), [l.schemaPath, T];
  }
  function g(_, { params: p, message: w }, N) {
    const { keyword: T, data: I, schemaValue: G, it: W } = _, { opts: le, propertyName: oe, topSchemaRef: ie, schemaPath: q } = W;
    N.push([l.keyword, T], [l.params, typeof p == "function" ? p(_) : p || (0, t._)`{}`]), le.messages && N.push([l.message, typeof w == "function" ? w(_) : w]), le.verbose && N.push([l.schema, G], [l.parentSchema, (0, t._)`${ie}${q}`], [n.default.data, I]), oe && N.push([l.propertyName, oe]);
  }
})(fn);
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.boolOrEmptySchema = Tr.topBoolOrEmptySchema = void 0;
const Cf = fn, Df = te(), Mf = Ue, Lf = {
  message: "boolean schema is false"
};
function Vf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Fu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Mf.default.data) : (t.assign((0, Df._)`${n}.errors`, null), t.return(!0));
}
Tr.topBoolOrEmptySchema = Vf;
function Ff(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Fu(e)) : r.var(t, !0);
}
Tr.boolOrEmptySchema = Ff;
function Fu(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Cf.reportError)(s, Lf, void 0, t);
}
var $e = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.getRules = lr.isJSONType = void 0;
const Uf = ["string", "number", "integer", "boolean", "null", "object", "array"], zf = new Set(Uf);
function Gf(e) {
  return typeof e == "string" && zf.has(e);
}
lr.isJSONType = Gf;
function qf() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
lr.getRules = qf;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.shouldUseRule = mt.shouldUseGroup = mt.schemaHasRulesForType = void 0;
function Kf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Uu(e, n);
}
mt.schemaHasRulesForType = Kf;
function Uu(e, t) {
  return t.rules.some((r) => zu(e, r));
}
mt.shouldUseGroup = Uu;
function zu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
mt.shouldUseRule = zu;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
const Hf = lr, Bf = mt, Wf = fn, Q = te(), Gu = V;
var Sr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Sr || ($e.DataType = Sr = {}));
function Xf(e) {
  const t = qu(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
$e.getSchemaTypes = Xf;
function qu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Hf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
$e.getJSONTypes = qu;
function Jf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Yf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Bf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = Fa(t, n, s.strictNumbers, Sr.Wrong);
    r.if(c, () => {
      a.length ? xf(e, t, a) : Ua(e);
    });
  }
  return o;
}
$e.coerceAndCheckDataType = Jf;
const Ku = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Yf(e, t) {
  return t ? e.filter((r) => Ku.has(r) || t === "array" && r === "array") : [];
}
function xf(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Q._)`typeof ${s}`), c = n.let("coerced", (0, Q._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Q._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(o, (0, Q._)`typeof ${s}`).if(Fa(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, Q._)`${c} !== undefined`);
  for (const d of r)
    (Ku.has(d) || d === "array" && a.coerceTypes === "array") && u(d);
  n.else(), Ua(e), n.endIf(), n.if((0, Q._)`${c} !== undefined`, () => {
    n.assign(s, c), Zf(e, c);
  });
  function u(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Q._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, Q._)`"" + ${s}`).elseIf((0, Q._)`${s} === null`).assign(c, (0, Q._)`""`);
        return;
      case "number":
        n.elseIf((0, Q._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, Q._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Q._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, Q._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Q._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, Q._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, Q._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, Q._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, Q._)`[${s}]`);
    }
  }
}
function Zf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function ma(e, t, r, n = Sr.Correct) {
  const s = n === Sr.Correct ? Q.operators.EQ : Q.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Q._)`${t} ${s} null`;
    case "array":
      a = (0, Q._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Q._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Q._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Q._)`typeof ${t} ${s} ${e}`;
  }
  return n === Sr.Correct ? a : (0, Q.not)(a);
  function o(c = Q.nil) {
    return (0, Q.and)((0, Q._)`typeof ${t} == "number"`, c, r ? (0, Q._)`isFinite(${t})` : Q.nil);
  }
}
$e.checkDataType = ma;
function Fa(e, t, r, n) {
  if (e.length === 1)
    return ma(e[0], t, r, n);
  let s;
  const a = (0, Gu.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Q._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Q._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Q.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Q.and)(s, ma(o, t, r, n));
  return s;
}
$e.checkDataTypes = Fa;
const Qf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function Ua(e) {
  const t = eh(e);
  (0, Wf.reportError)(t, Qf);
}
$e.reportTypeError = Ua;
function eh(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Gu.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.assignDefaults = void 0;
const hr = te(), th = V;
function rh(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Xi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Xi(e, a, s.default));
}
us.assignDefaults = rh;
function Xi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const c = (0, hr._)`${a}${(0, hr.getProperty)(t)}`;
  if (s) {
    (0, th.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let u = (0, hr._)`${c} === undefined`;
  o.useDefaults === "empty" && (u = (0, hr._)`${u} || ${c} === null || ${c} === ""`), n.if(u, (0, hr._)`${c} = ${(0, hr.stringify)(r)}`);
}
var ct = {}, se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.validateUnion = se.validateArray = se.usePattern = se.callValidateCode = se.schemaProperties = se.allSchemaProperties = se.noPropertyInData = se.propertyInData = se.isOwnProperty = se.hasPropFunc = se.reportMissingProp = se.checkMissingProp = se.checkReportMissingProp = void 0;
const de = te(), za = V, St = Ue, nh = V;
function sh(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(qa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, de._)`${t}` }, !0), e.error();
  });
}
se.checkReportMissingProp = sh;
function ah({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, de.or)(...n.map((a) => (0, de.and)(qa(e, t, a, r.ownProperties), (0, de._)`${s} = ${a}`)));
}
se.checkMissingProp = ah;
function oh(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
se.reportMissingProp = oh;
function Hu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, de._)`Object.prototype.hasOwnProperty`
  });
}
se.hasPropFunc = Hu;
function Ga(e, t, r) {
  return (0, de._)`${Hu(e)}.call(${t}, ${r})`;
}
se.isOwnProperty = Ga;
function ih(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} !== undefined`;
  return n ? (0, de._)`${s} && ${Ga(e, t, r)}` : s;
}
se.propertyInData = ih;
function qa(e, t, r, n) {
  const s = (0, de._)`${t}${(0, de.getProperty)(r)} === undefined`;
  return n ? (0, de.or)(s, (0, de.not)(Ga(e, t, r))) : s;
}
se.noPropertyInData = qa;
function Bu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
se.allSchemaProperties = Bu;
function ch(e, t) {
  return Bu(t).filter((r) => !(0, za.alwaysValidSchema)(e, t[r]));
}
se.schemaProperties = ch;
function uh({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, c, u, d) {
  const l = d ? (0, de._)`${e}, ${t}, ${n}${s}` : t, h = [
    [St.default.instancePath, (0, de.strConcat)(St.default.instancePath, a)],
    [St.default.parentData, o.parentData],
    [St.default.parentDataProperty, o.parentDataProperty],
    [St.default.rootData, St.default.rootData]
  ];
  o.opts.dynamicRef && h.push([St.default.dynamicAnchors, St.default.dynamicAnchors]);
  const E = (0, de._)`${l}, ${r.object(...h)}`;
  return u !== de.nil ? (0, de._)`${c}.call(${u}, ${E})` : (0, de._)`${c}(${E})`;
}
se.callValidateCode = uh;
const lh = (0, de._)`new RegExp`;
function dh({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, de._)`${s.code === "new RegExp" ? lh : (0, nh.useFunc)(e, s)}(${r}, ${n})`
  });
}
se.usePattern = dh;
function fh(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(c) {
    const u = t.const("len", (0, de._)`${r}.length`);
    t.forRange("i", 0, u, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: za.Type.Num
      }, a), t.if((0, de.not)(a), c);
    });
  }
}
se.validateArray = fh;
function hh(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((u) => (0, za.alwaysValidSchema)(s, u)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((u, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, c);
    t.assign(o, (0, de._)`${o} || ${c}`), e.mergeValidEvaluated(l, c) || t.if((0, de.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
se.validateUnion = hh;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.validateKeywordUsage = ct.validSchemaType = ct.funcKeywordCode = ct.macroKeywordCode = void 0;
const Ie = te(), Zt = Ue, ph = se, mh = fn;
function yh(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, c = t.macro.call(o.self, s, a, o), u = Wu(r, n, c);
  o.opts.validateSchema !== !1 && o.self.validateSchema(c, !0);
  const d = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: Ie.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: u,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ct.macroKeywordCode = yh;
function $h(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: c, it: u } = e;
  gh(u, t);
  const d = !c && t.compile ? t.compile.call(u.self, a, o, u) : t.validate, l = Wu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      g(), t.modifying && Ji(e), _(() => e.error());
    else {
      const p = t.async ? $() : v();
      t.modifying && Ji(e), _(() => _h(e, p));
    }
  }
  function $() {
    const p = n.let("ruleErrs", null);
    return n.try(() => g((0, Ie._)`await `), (w) => n.assign(h, !1).if((0, Ie._)`${w} instanceof ${u.ValidationError}`, () => n.assign(p, (0, Ie._)`${w}.errors`), () => n.throw(w))), p;
  }
  function v() {
    const p = (0, Ie._)`${l}.errors`;
    return n.assign(p, null), g(Ie.nil), p;
  }
  function g(p = t.async ? (0, Ie._)`await ` : Ie.nil) {
    const w = u.opts.passContext ? Zt.default.this : Zt.default.self, N = !("compile" in t && !c || t.schema === !1);
    n.assign(h, (0, Ie._)`${p}${(0, ph.callValidateCode)(e, l, w, N)}`, t.modifying);
  }
  function _(p) {
    var w;
    n.if((0, Ie.not)((w = t.valid) !== null && w !== void 0 ? w : h), p);
  }
}
ct.funcKeywordCode = $h;
function Ji(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ie._)`${n.parentData}[${n.parentDataProperty}]`));
}
function _h(e, t) {
  const { gen: r } = e;
  r.if((0, Ie._)`Array.isArray(${t})`, () => {
    r.assign(Zt.default.vErrors, (0, Ie._)`${Zt.default.vErrors} === null ? ${t} : ${Zt.default.vErrors}.concat(${t})`).assign(Zt.default.errors, (0, Ie._)`${Zt.default.vErrors}.length`), (0, mh.extendErrors)(e);
  }, () => e.error());
}
function gh({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Wu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ie.stringify)(r) });
}
function vh(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ct.validSchemaType = vh;
function Eh({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const u = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(u);
    else
      throw new Error(u);
  }
}
ct.validateKeywordUsage = Eh;
var Mt = {};
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.extendSubschemaMode = Mt.extendSubschemaData = Mt.getSubschema = void 0;
const ot = te(), Xu = V;
function wh(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}${(0, ot.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Xu.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Mt.getSubschema = wh;
function bh(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = c.let("data", (0, ot._)`${t.data}${(0, ot.getProperty)(r)}`, !0);
    u(E), e.errorPath = (0, ot.str)`${d}${(0, Xu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ot._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ot.Name ? s : c.let("data", s, !0);
    u(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function u(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Mt.extendSubschemaData = bh;
function Sh(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Mt.extendSubschemaMode = Sh;
var we = {}, ls = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Ju = { exports: {} }, Ct = Ju.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Gn(t, n, s, e, "", e);
};
Ct.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Ct.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ct.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ct.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Gn(e, t, r, n, s, a, o, c, u, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, u, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Ct.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Gn(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Ct.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Gn(e, t, r, h[$], s + "/" + l + "/" + Ph($), a, s, l, n, $);
      } else (l in Ct.keywords || e.allKeys && !(l in Ct.skipKeywords)) && Gn(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, c, u, d);
  }
}
function Ph(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Nh = Ju.exports;
Object.defineProperty(we, "__esModule", { value: !0 });
we.getSchemaRefs = we.resolveUrl = we.normalizeId = we._getFullPath = we.getFullPath = we.inlineRef = void 0;
const Rh = V, Oh = ls, Th = Nh, Ih = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function jh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ya(e) : t ? Yu(e) <= t : !1;
}
we.inlineRef = jh;
const Ah = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ya(e) {
  for (const t in e) {
    if (Ah.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ya) || typeof r == "object" && ya(r))
      return !0;
  }
  return !1;
}
function Yu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Ih.has(r) && (typeof e[r] == "object" && (0, Rh.eachItem)(e[r], (n) => t += Yu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function xu(e, t = "", r) {
  r !== !1 && (t = Pr(t));
  const n = e.parse(t);
  return Zu(e, n);
}
we.getFullPath = xu;
function Zu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
we._getFullPath = Zu;
const kh = /#\/?$/;
function Pr(e) {
  return e ? e.replace(kh, "") : "";
}
we.normalizeId = Pr;
function Ch(e, t, r) {
  return r = Pr(r), e.resolve(t, r);
}
we.resolveUrl = Ch;
const Dh = /^[a-z_][-a-z0-9._]*$/i;
function Mh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Pr(e[r] || t), a = { "": s }, o = xu(n, s, !1), c = {}, u = /* @__PURE__ */ new Set();
  return Th(e, { allKeys: !0 }, (h, E, $, v) => {
    if (v === void 0)
      return;
    const g = o + E;
    let _ = a[v];
    typeof h[r] == "string" && (_ = p.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[E] = _;
    function p(N) {
      const T = this.opts.uriResolver.resolve;
      if (N = Pr(_ ? T(_, N) : N), u.has(N))
        throw l(N);
      u.add(N);
      let I = this.refs[N];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, N) : N !== Pr(g) && (N[0] === "#" ? (d(h, c[N], N), c[N] = h) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!Dh.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), c;
  function d(h, E, $) {
    if (E !== void 0 && !Oh(h, E))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
we.getSchemaRefs = Mh;
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.getData = Ze.KeywordCxt = Ze.validateFunctionCode = void 0;
const Qu = Tr, Yi = $e, Ka = mt, Qn = $e, Lh = us, en = ct, Ms = Mt, H = te(), X = Ue, Vh = we, yt = V, Br = fn;
function Fh(e) {
  if (rl(e) && (nl(e), tl(e))) {
    Gh(e);
    return;
  }
  el(e, () => (0, Qu.topBoolOrEmptySchema)(e));
}
Ze.validateFunctionCode = Fh;
function el({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, H._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, H._)`"use strict"; ${xi(r, s)}`), zh(e, s), e.code(a);
  }) : e.func(t, (0, H._)`${X.default.data}, ${Uh(s)}`, n.$async, () => e.code(xi(r, s)).code(a));
}
function Uh(e) {
  return (0, H._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, H._)`, ${X.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function zh(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, H._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, H._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, H._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, H._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, H._)`""`), e.var(X.default.parentData, (0, H._)`undefined`), e.var(X.default.parentDataProperty, (0, H._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function Gh(e) {
  const { schema: t, opts: r, gen: n } = e;
  el(e, () => {
    r.$comment && t.$comment && al(e), Wh(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && qh(e), sl(e), Yh(e);
  });
}
function qh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, H._)`${r}.evaluated`), t.if((0, H._)`${e.evaluated}.dynamicProps`, () => t.assign((0, H._)`${e.evaluated}.props`, (0, H._)`undefined`)), t.if((0, H._)`${e.evaluated}.dynamicItems`, () => t.assign((0, H._)`${e.evaluated}.items`, (0, H._)`undefined`));
}
function xi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function Kh(e, t) {
  if (rl(e) && (nl(e), tl(e))) {
    Hh(e, t);
    return;
  }
  (0, Qu.boolOrEmptySchema)(e, t);
}
function tl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function rl(e) {
  return typeof e.schema != "boolean";
}
function Hh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && al(e), Xh(e), Jh(e);
  const a = n.const("_errs", X.default.errors);
  sl(e, a), n.var(t, (0, H._)`${a} === ${X.default.errors}`);
}
function nl(e) {
  (0, yt.checkUnknownRules)(e), Bh(e);
}
function sl(e, t) {
  if (e.opts.jtd)
    return Zi(e, [], !1, t);
  const r = (0, Yi.getSchemaTypes)(e.schema), n = (0, Yi.coerceAndCheckDataType)(e, r);
  Zi(e, r, !n, t);
}
function Bh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, yt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Wh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, yt.checkStrictMode)(e, "default is ignored in the schema root");
}
function Xh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Vh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Jh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function al({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, H._)`${X.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, H.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, H._)`${X.default.self}.opts.$comment(${a}, ${o}, ${c}.schema)`);
  }
}
function Yh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, H._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, H._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, H._)`${n}.errors`, X.default.vErrors), a.unevaluated && xh(e), t.return((0, H._)`${X.default.errors} === 0`));
}
function xh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof H.Name && e.assign((0, H._)`${t}.props`, r), n instanceof H.Name && e.assign((0, H._)`${t}.items`, n);
}
function Zi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: c, opts: u, self: d } = e, { RULES: l } = d;
  if (a.$ref && (u.ignoreKeywordsWithRef || !(0, yt.schemaHasRulesButRef)(a, l))) {
    s.block(() => cl(e, "$ref", l.all.$ref.definition));
    return;
  }
  u.jtd || Zh(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Ka.shouldUseGroup)(a, E) && (E.type ? (s.if((0, Qn.checkDataType)(E.type, o, u.strictNumbers)), Qi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Qn.reportTypeError)(e)), s.endIf()) : Qi(e, E), c || s.if((0, H._)`${X.default.errors} === ${n || 0}`));
  }
}
function Qi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Lh.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Ka.shouldUseRule)(n, a) && cl(e, a.keyword, a.definition, t.type);
  });
}
function Zh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Qh(e, t), e.opts.allowUnionTypes || ep(e, t), tp(e, e.dataTypes));
}
function Qh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      ol(e.dataTypes, r) || Ha(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), np(e, t);
  }
}
function ep(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ha(e, "use allowUnionTypes to allow union type keyword");
}
function tp(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ka.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => rp(t, o)) && Ha(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function rp(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function ol(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function np(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    ol(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Ha(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, yt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let il = class {
  constructor(t, r, n) {
    if ((0, en.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, yt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", ul(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, en.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, H.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, H.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, H._)`${r} !== undefined && (${(0, H.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Br.reportExtraError : Br.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Br.reportError)(this, this.def.$dataError || Br.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Br.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = H.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = H.nil, r = H.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, H.or)((0, H._)`${s} === undefined`, r)), t !== H.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== H.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, H.or)(o(), c());
    function o() {
      if (n.length) {
        if (!(r instanceof H.Name))
          throw new Error("ajv implementation error");
        const u = Array.isArray(n) ? n : [n];
        return (0, H._)`${(0, Qn.checkDataTypes)(u, r, a.opts.strictNumbers, Qn.DataType.Wrong)}`;
      }
      return H.nil;
    }
    function c() {
      if (s.validateSchema) {
        const u = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, H._)`!${u}(${r})`;
      }
      return H.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ms.getSubschema)(this.it, t);
    (0, Ms.extendSubschemaData)(n, this.it, t), (0, Ms.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Kh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = yt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = yt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, H.Name)), !0;
  }
};
Ze.KeywordCxt = il;
function cl(e, t, r, n) {
  const s = new il(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, en.funcKeywordCode)(s, r) : "macro" in r ? (0, en.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, en.funcKeywordCode)(s, r);
}
const sp = /^\/(?:[^~]|~0|~1)*$/, ap = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ul(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!sp.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = X.default.rootData;
  } else {
    const d = ap.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(u("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(u("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let o = a;
  const c = s.split("/");
  for (const d of c)
    d && (a = (0, H._)`${a}${(0, H.getProperty)((0, yt.unescapeJsonPointer)(d))}`, o = (0, H._)`${o} && ${a}`);
  return o;
  function u(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Ze.getData = ul;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
let op = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
hn.default = op;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
const Ls = we;
let ip = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ls.resolveUrl)(t, r, n), this.missingSchema = (0, Ls.normalizeId)((0, Ls.getFullPath)(t, this.missingRef));
  }
};
kr.default = ip;
var Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.resolveSchema = Ae.getCompilingSchema = Ae.resolveRef = Ae.compileSchema = Ae.SchemaEnv = void 0;
const Be = te(), cp = hn, Yt = Ue, Ye = we, ec = V, up = Ze;
let ds = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ye.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ae.SchemaEnv = ds;
function Ba(e) {
  const t = ll.call(this, e);
  if (t)
    return t;
  const r = (0, Ye.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Be.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: cp.default,
    code: (0, Be._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const u = o.scopeName("validate");
  e.validateName = u;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Yt.default.data,
    parentData: Yt.default.parentData,
    parentDataProperty: Yt.default.parentDataProperty,
    dataNames: [Yt.default.data],
    dataPathArr: [Be.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Be.stringify)(e.schema) } : { ref: e.schema }),
    validateName: u,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Be.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Be._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, up.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(Yt.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const $ = new Function(`${Yt.default.self}`, `${Yt.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(u, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: u, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      $.evaluated = {
        props: v instanceof Be.Name ? void 0 : v,
        items: g instanceof Be.Name ? void 0 : g,
        dynamicProps: v instanceof Be.Name,
        dynamicItems: g instanceof Be.Name
      }, $.source && ($.source.evaluated = (0, Be.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ae.compileSchema = Ba;
function lp(e, t, r) {
  var n;
  r = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = hp.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new ds({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = dp.call(this, a);
}
Ae.resolveRef = lp;
function dp(e) {
  return (0, Ye.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ba.call(this, e);
}
function ll(e) {
  for (const t of this._compilations)
    if (fp(t, e))
      return t;
}
Ae.getCompilingSchema = ll;
function fp(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function hp(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || fs.call(this, e, t);
}
function fs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ye._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ye.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Vs.call(this, r, e);
  const a = (0, Ye.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = fs.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : Vs.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Ba.call(this, o), a === (0, Ye.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: u } = this.opts, d = c[u];
      return d && (s = (0, Ye.resolveUrl)(this.opts.uriResolver, s, d)), new ds({ schema: c, schemaId: u, root: e, baseId: s });
    }
    return Vs.call(this, r, o);
  }
}
Ae.resolveSchema = fs;
const pp = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Vs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const u = r[(0, ec.unescapeFragment)(c)];
    if (u === void 0)
      return;
    r = u;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !pp.has(c) && d && (t = (0, Ye.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, ec.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = fs.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ds({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const mp = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", yp = "Meta-schema for $data reference (JSON AnySchema extension proposal)", $p = "object", _p = [
  "$data"
], gp = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, vp = !1, Ep = {
  $id: mp,
  description: yp,
  type: $p,
  required: _p,
  properties: gp,
  additionalProperties: vp
};
var Wa = {}, hs = { exports: {} };
const wp = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), dl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function fl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const bp = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function tc(e) {
  return e.length = 0, !0;
}
function Sp(e, t, r) {
  if (e.length) {
    const n = fl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Pp(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, c = Sp;
  for (let u = 0; u < e.length; u++) {
    const d = e[u];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !c(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        u > 0 && e[u - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!c(s, n, r))
          break;
        c = tc;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (c === tc ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(fl(s))), r.address = n.join(""), r;
}
function hl(e) {
  if (Np(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Pp(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Np(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Rp(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function Op(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Tp(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!dl(r)) {
      const n = hl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var pl = {
  nonSimpleDomain: bp,
  recomposeAuthority: Tp,
  normalizeComponentEncoding: Op,
  removeDotSegments: Rp,
  isIPv4: dl,
  isUUID: wp,
  normalizeIPv6: hl
};
const { isUUID: Ip } = pl, jp = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function ml(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function yl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function $l(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Ap(e) {
  return e.secure = ml(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function kp(e) {
  if ((e.port === (ml(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Cp(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(jp);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Xa(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Dp(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Xa(s);
  a && (e = a.serialize(e, t));
  const o = e, c = e.nss;
  return o.path = `${n || t.nid}:${c}`, t.skipEscape = !0, o;
}
function Mp(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Ip(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Lp(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const _l = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: yl,
    serialize: $l
  }
), Vp = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: _l.domainHost,
    parse: yl,
    serialize: $l
  }
), qn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Ap,
    serialize: kp
  }
), Fp = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: qn.domainHost,
    parse: qn.parse,
    serialize: qn.serialize
  }
), Up = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Cp,
    serialize: Dp,
    skipNormalize: !0
  }
), zp = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Mp,
    serialize: Lp,
    skipNormalize: !0
  }
), es = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: _l,
    https: Vp,
    ws: qn,
    wss: Fp,
    urn: Up,
    "urn:uuid": zp
  }
);
Object.setPrototypeOf(es, null);
function Xa(e) {
  return e && (es[
    /** @type {SchemeName} */
    e
  ] || es[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Gp = {
  SCHEMES: es,
  getSchemeHandler: Xa
};
const { normalizeIPv6: qp, removeDotSegments: xr, recomposeAuthority: Kp, normalizeComponentEncoding: wn, isIPv4: Hp, nonSimpleDomain: Bp } = pl, { SCHEMES: Wp, getSchemeHandler: gl } = Gp;
function Xp(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ut(gt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  gt(ut(e, t), t)), e;
}
function Jp(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = vl(gt(e, n), gt(t, n), n, !0);
  return n.skipEscape = !0, ut(s, n);
}
function vl(e, t, r, n) {
  const s = {};
  return n || (e = gt(ut(e, r), r), t = gt(ut(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = xr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = xr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = xr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = xr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Yp(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ut(wn(gt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ut(wn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ut(wn(gt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ut(wn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ut(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = gl(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Kp(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (c = xr(c)), o === void 0 && c[0] === "/" && c[1] === "/" && (c = "/%2F" + c.slice(2)), s.push(c);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const xp = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function gt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(xp);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (Hp(n.host) === !1) {
        const u = qp(n.host);
        n.host = u.host.toLowerCase(), s = u.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = gl(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && Bp(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (c) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Ja = {
  SCHEMES: Wp,
  normalize: Xp,
  resolve: Jp,
  resolveComponent: vl,
  equal: Yp,
  serialize: ut,
  parse: gt
};
hs.exports = Ja;
hs.exports.default = Ja;
hs.exports.fastUri = Ja;
var El = hs.exports;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const wl = El;
wl.code = 'require("ajv/dist/runtime/uri").default';
Wa.default = wl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ze;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = te();
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = hn, s = kr, a = lr, o = Ae, c = te(), u = we, d = $e, l = V, h = Ep, E = Wa, $ = (P, m) => new RegExp(P, m);
  $.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), _ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(P) {
    var m, b, y, i, f, S, j, A, z, U, Y, ye, rt, nt, Vt, Ft, Ut, zt, Gt, qt, Kt, Ht, Bt, Wt, Xt;
    const Ke = P.strict, Jt = (m = P.code) === null || m === void 0 ? void 0 : m.optimize, Gr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, qr = (y = (b = P.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : $, Os = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : Ke) !== null && S !== void 0 ? S : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : Ke) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (z = P.strictTypes) !== null && z !== void 0 ? z : Ke) !== null && U !== void 0 ? U : "log",
      strictTuples: (ye = (Y = P.strictTuples) !== null && Y !== void 0 ? Y : Ke) !== null && ye !== void 0 ? ye : "log",
      strictRequired: (nt = (rt = P.strictRequired) !== null && rt !== void 0 ? rt : Ke) !== null && nt !== void 0 ? nt : !1,
      code: P.code ? { ...P.code, optimize: Gr, regExp: qr } : { optimize: Gr, regExp: qr },
      loopRequired: (Vt = P.loopRequired) !== null && Vt !== void 0 ? Vt : w,
      loopEnum: (Ft = P.loopEnum) !== null && Ft !== void 0 ? Ft : w,
      meta: (Ut = P.meta) !== null && Ut !== void 0 ? Ut : !0,
      messages: (zt = P.messages) !== null && zt !== void 0 ? zt : !0,
      inlineRefs: (Gt = P.inlineRefs) !== null && Gt !== void 0 ? Gt : !0,
      schemaId: (qt = P.schemaId) !== null && qt !== void 0 ? qt : "$id",
      addUsedSchema: (Kt = P.addUsedSchema) !== null && Kt !== void 0 ? Kt : !0,
      validateSchema: (Ht = P.validateSchema) !== null && Ht !== void 0 ? Ht : !0,
      validateFormats: (Bt = P.validateFormats) !== null && Bt !== void 0 ? Bt : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Os
    };
  }
  class T {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...N(m) };
      const { es5: b, lines: y } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: g, es5: b, lines: y }), this.logger = L(m.logger);
      const i = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, _, m, "NOT SUPPORTED"), I.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = ie.call(this), m.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && oe.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), W.call(this), m.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: b, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), b && m && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[b] || m : void 0;
    }
    validate(m, b) {
      let y;
      if (typeof m == "string") {
        if (y = this.getSchema(m), !y)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        y = this.compile(m);
      const i = y(b);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(m, b) {
      const y = this._addSchema(m, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(m, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, m, b);
      async function i(U, Y) {
        await f.call(this, U.$schema);
        const ye = this._addSchema(U, Y);
        return ye.validate || S.call(this, ye);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (Y) {
          if (!(Y instanceof s.default))
            throw Y;
          return j.call(this, Y), await A.call(this, Y.missingSchema), S.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: Y }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${Y} cannot be resolved`);
      }
      async function A(U) {
        const Y = await z.call(this, U);
        this.refs[U] || await f.call(this, Y.$schema), this.refs[U] || this.addSchema(Y, U, b);
      }
      async function z(U) {
        const Y = this._loading[U];
        if (Y)
          return Y;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, b, y, i = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const S of m)
          this.addSchema(S, void 0, y, i);
        return this;
      }
      let f;
      if (typeof m == "object") {
        const { schemaId: S } = this.opts;
        if (f = m[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, u.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(m, y, b, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, b, y = this.opts.validateSchema) {
      return this.addSchema(m, b, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, b) {
      if (typeof m == "boolean")
        return !0;
      let y;
      if (y = m.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, m);
      if (!i && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let b;
      for (; typeof (b = G.call(this, m)) == "string"; )
        m = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (b = o.resolveSchema.call(this, i, m), !b)
          return;
        this.refs[m] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = G.call(this, m);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const b = m;
          this._cache.delete(b);
          let y = m[this.opts.schemaId];
          return y && (y = (0, u.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const b of m)
        this.addKeyword(b);
      return this;
    }
    addKeyword(m, b) {
      let y;
      if (typeof m == "string")
        y = m, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = y);
      else if (typeof m == "object" && b === void 0) {
        if (b = m, y = b.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (R.call(this, y, b), !b)
        return (0, l.eachItem)(y, (f) => O.call(this, f)), this;
      D.call(this, b);
      const i = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, l.eachItem)(y, i.type.length === 0 ? (f) => O.call(this, f, i) : (f) => i.type.forEach((S) => O.call(this, f, i, S))), this;
    }
    getKeyword(m) {
      const b = this.RULES.all[m];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: b } = this;
      delete b.keywords[m], delete b.all[m];
      for (const y of b.rules) {
        const i = y.rules.findIndex((f) => f.keyword === m);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[m] = b, this;
    }
    errorsText(m = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + b + f);
    }
    $dataMetaSchema(m, b) {
      const y = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const i of b) {
        const f = i.split("/").slice(1);
        let S = m;
        for (const j of f)
          S = S[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: z } = A.definition, U = S[j];
          z && U && (S[j] = C(U));
        }
      }
      return m;
    }
    _removeAllSchemas(m, b) {
      for (const y in m) {
        const i = m[y];
        (!b || b.test(y)) && (typeof i == "string" ? delete m[y] : i && !i.meta && (this._cache.delete(i.schema), delete m[y]));
      }
    }
    _addSchema(m, b, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: j } = this.opts;
      if (typeof m == "object")
        S = m[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(m);
      if (A !== void 0)
        return A;
      y = (0, u.normalizeId)(S || y);
      const z = u.getSchemaRefs.call(this, m, y);
      return A = new o.SchemaEnv({ schema: m, schemaId: j, meta: b, baseId: y, localRefs: z }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(m, !0), A;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : o.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, m);
      } finally {
        this.opts = b;
      }
    }
  }
  T.ValidationError = n.default, T.MissingRefError = s.default, e.default = T;
  function I(P, m, b, y = "error") {
    for (const i in P) {
      const f = i;
      f in m && this.logger[y](`${b}: option ${i}. ${P[f]}`);
    }
  }
  function G(P) {
    return P = (0, u.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function W() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const m in P)
          this.addSchema(P[m], m);
  }
  function le() {
    for (const P in this.opts.formats) {
      const m = this.opts.formats[P];
      m && this.addFormat(P, m);
    }
  }
  function oe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in P) {
      const b = P[m];
      b.keyword || (b.keyword = m), this.addKeyword(b);
    }
  }
  function ie() {
    const P = { ...this.opts };
    for (const m of v)
      delete P[m];
    return P;
  }
  const q = { log() {
  }, warn() {
  }, error() {
  } };
  function L(P) {
    if (P === !1)
      return q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const K = /^[a-z_$][a-z0-9_$:-]*$/i;
  function R(P, m) {
    const { RULES: b } = this;
    if ((0, l.eachItem)(P, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!K.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function O(P, m, b) {
    var y;
    const i = m == null ? void 0 : m.post;
    if (b && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = i ? f.post : f.rules.find(({ type: A }) => A === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !m)
      return;
    const j = {
      keyword: P,
      definition: {
        ...m,
        type: (0, d.getJSONTypes)(m.type),
        schemaType: (0, d.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? k.call(this, S, j, m.before) : S.rules.push(j), f.all[P] = j, (y = m.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function k(P, m, b) {
    const y = P.rules.findIndex((i) => i.keyword === b);
    y >= 0 ? P.rules.splice(y, 0, m) : (P.rules.push(m), this.logger.warn(`rule ${b} is not defined`));
  }
  function D(P) {
    let { metaSchema: m } = P;
    m !== void 0 && (P.$data && this.opts.$data && (m = C(m)), P.validateSchema = this.compile(m, !0));
  }
  const M = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function C(P) {
    return { anyOf: [P, M] };
  }
})(ku);
var Ya = {}, xa = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const Zp = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Za.default = Zp;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.callRef = vt.getValidate = void 0;
const Qp = kr, rc = se, Me = te(), pr = Ue, nc = Ae, bn = V, em = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: u } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = nc.resolveRef.call(u, d, s, r);
    if (l === void 0)
      throw new Qp.default(n.opts.uriResolver, s, r);
    if (l instanceof nc.SchemaEnv)
      return E(l);
    return $(l);
    function h() {
      if (a === d)
        return Kn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Kn(e, (0, Me._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const g = bl(e, v);
      Kn(e, g, v, v.$async);
    }
    function $(v) {
      const g = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, Me.stringify)(v) } : { ref: v }), _ = t.name("valid"), p = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Me.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(p), e.ok(_);
    }
  }
};
function bl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Me._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
vt.getValidate = bl;
function Kn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: u } = a, d = u.passContext ? pr.default.this : Me.nil;
  n ? l() : h();
  function l() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Me._)`await ${(0, rc.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (g) => {
      s.if((0, Me._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), E(g), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, rc.callValidateCode)(e, t, d), () => $(t), () => E(t));
  }
  function E(v) {
    const g = (0, Me._)`${v}.errors`;
    s.assign(pr.default.vErrors, (0, Me._)`${pr.default.vErrors} === null ? ${g} : ${pr.default.vErrors}.concat(${g})`), s.assign(pr.default.errors, (0, Me._)`${pr.default.vErrors}.length`);
  }
  function $(v) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const _ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = bn.mergeEvaluated.props(s, _.props, a.props));
      else {
        const p = s.var("props", (0, Me._)`${v}.evaluated.props`);
        a.props = bn.mergeEvaluated.props(s, p, a.props, Me.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = bn.mergeEvaluated.items(s, _.items, a.items));
      else {
        const p = s.var("items", (0, Me._)`${v}.evaluated.items`);
        a.items = bn.mergeEvaluated.items(s, p, a.items, Me.Name);
      }
  }
}
vt.callRef = Kn;
vt.default = em;
Object.defineProperty(xa, "__esModule", { value: !0 });
const tm = Za, rm = vt, nm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  tm.default,
  rm.default
];
xa.default = nm;
var Qa = {}, eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const ts = te(), Pt = ts.operators, rs = {
  maximum: { okStr: "<=", ok: Pt.LTE, fail: Pt.GT },
  minimum: { okStr: ">=", ok: Pt.GTE, fail: Pt.LT },
  exclusiveMaximum: { okStr: "<", ok: Pt.LT, fail: Pt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Pt.GT, fail: Pt.LTE }
}, sm = {
  message: ({ keyword: e, schemaCode: t }) => (0, ts.str)`must be ${rs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ts._)`{comparison: ${rs[e].okStr}, limit: ${t}}`
}, am = {
  keyword: Object.keys(rs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ts._)`${r} ${rs[t].fail} ${n} || isNaN(${r})`);
  }
};
eo.default = am;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const tn = te(), om = {
  message: ({ schemaCode: e }) => (0, tn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, tn._)`{multipleOf: ${e}}`
}, im = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: om,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, tn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, tn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, tn._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
to.default = im;
var ro = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
function Sl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
no.default = Sl;
Sl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ro, "__esModule", { value: !0 });
const Qt = te(), cm = V, um = no, lm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Qt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Qt._)`{limit: ${e}}`
}, dm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: lm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Qt.operators.GT : Qt.operators.LT, o = s.opts.unicode === !1 ? (0, Qt._)`${r}.length` : (0, Qt._)`${(0, cm.useFunc)(e.gen, um.default)}(${r})`;
    e.fail$data((0, Qt._)`${o} ${a} ${n}`);
  }
};
ro.default = dm;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const fm = se, hm = V, wr = te(), pm = {
  message: ({ schemaCode: e }) => (0, wr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, wr._)`{pattern: ${e}}`
}, mm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: pm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, c = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: u } = o.opts.code, d = u.code === "new RegExp" ? (0, wr._)`new RegExp` : (0, hm.useFunc)(t, u), l = t.let("valid");
      t.try(() => t.assign(l, (0, wr._)`${d}(${a}, ${c}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, wr._)`!${l}`);
    } else {
      const u = (0, fm.usePattern)(e, s);
      e.fail$data((0, wr._)`!${u}.test(${r})`);
    }
  }
};
so.default = mm;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const rn = te(), ym = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, rn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, rn._)`{limit: ${e}}`
}, $m = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: ym,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? rn.operators.GT : rn.operators.LT;
    e.fail$data((0, rn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ao.default = $m;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const Wr = se, nn = te(), _m = V, gm = {
  message: ({ params: { missingProperty: e } }) => (0, nn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, nn._)`{missingProperty: ${e}}`
}, vm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: gm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const u = r.length >= c.loopRequired;
    if (o.allErrors ? d() : l(), c.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if (($ == null ? void 0 : $[g]) === void 0 && !v.has(g)) {
          const _ = o.schemaEnv.baseId + o.errSchemaPath, p = `required property "${g}" is not defined at "${_}" (strictRequired)`;
          (0, _m.checkStrictMode)(o, p, o.opts.strictRequired);
        }
    }
    function d() {
      if (u || a)
        e.block$data(nn.nil, h);
      else
        for (const $ of r)
          (0, Wr.checkReportMissingProp)(e, $);
    }
    function l() {
      const $ = t.let("missing");
      if (u || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E($, v)), e.ok(v);
      } else
        t.if((0, Wr.checkMissingProp)(e, r, $)), (0, Wr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Wr.noPropertyInData)(t, s, $, c.ownProperties), () => e.error());
      });
    }
    function E($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Wr.propertyInData)(t, s, $, c.ownProperties)), t.if((0, nn.not)(v), () => {
          e.error(), t.break();
        });
      }, nn.nil);
    }
  }
};
oo.default = vm;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const sn = te(), Em = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, sn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, sn._)`{limit: ${e}}`
}, wm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Em,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? sn.operators.GT : sn.operators.LT;
    e.fail$data((0, sn._)`${r}.length ${s} ${n}`);
  }
};
io.default = wm;
var co = {}, pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
const Pl = ls;
Pl.code = 'require("ajv/dist/runtime/equal").default';
pn.default = Pl;
Object.defineProperty(co, "__esModule", { value: !0 });
const Fs = $e, ve = te(), bm = V, Sm = pn, Pm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Nm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Pm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const u = t.let("valid"), d = a.items ? (0, Fs.getSchemaTypes)(a.items) : [];
    e.block$data(u, l, (0, ve._)`${o} === false`), e.ok(u);
    function l() {
      const v = t.let("i", (0, ve._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(u, !0), t.if((0, ve._)`${v} > 1`, () => (h() ? E : $)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, g) {
      const _ = t.name("item"), p = (0, Fs.checkDataTypes)(d, _, c.opts.strictNumbers, Fs.DataType.Wrong), w = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${v}--;`, () => {
        t.let(_, (0, ve._)`${r}[${v}]`), t.if(p, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${_} == "string"`, (0, ve._)`${_} += "_"`), t.if((0, ve._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(g, (0, ve._)`${w}[${_}]`), e.error(), t.assign(u, !1).break();
        }).code((0, ve._)`${w}[${_}] = ${v}`);
      });
    }
    function $(v, g) {
      const _ = (0, bm.useFunc)(t, Sm.default), p = t.name("outer");
      t.label(p).for((0, ve._)`;${v}--;`, () => t.for((0, ve._)`${g} = ${v}; ${g}--;`, () => t.if((0, ve._)`${_}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(u, !1).break(p);
      })));
    }
  }
};
co.default = Nm;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const $a = te(), Rm = V, Om = pn, Tm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, $a._)`{allowedValue: ${e}}`
}, Im = {
  keyword: "const",
  $data: !0,
  error: Tm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, $a._)`!${(0, Rm.useFunc)(t, Om.default)}(${r}, ${s})`) : e.fail((0, $a._)`${a} !== ${r}`);
  }
};
uo.default = Im;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const Zr = te(), jm = V, Am = pn, km = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Zr._)`{allowedValues: ${e}}`
}, Cm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: km,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let u;
    const d = () => u ?? (u = (0, jm.useFunc)(t, Am.default));
    let l;
    if (c || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      l = (0, Zr.or)(...s.map((v, g) => E($, g)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, ($) => t.if((0, Zr._)`${d()}(${r}, ${$})`, () => t.assign(l, !0).break()));
    }
    function E($, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Zr._)`${d()}(${r}, ${$}[${v}])` : (0, Zr._)`${r} === ${g}`;
    }
  }
};
lo.default = Cm;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Dm = eo, Mm = to, Lm = ro, Vm = so, Fm = ao, Um = oo, zm = io, Gm = co, qm = uo, Km = lo, Hm = [
  // number
  Dm.default,
  Mm.default,
  // string
  Lm.default,
  Vm.default,
  // object
  Fm.default,
  Um.default,
  // array
  zm.default,
  Gm.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  qm.default,
  Km.default
];
Qa.default = Hm;
var fo = {}, Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.validateAdditionalItems = void 0;
const er = te(), _a = V, Bm = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, Wm = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Bm,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, _a.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Nl(e, n);
  }
};
function Nl(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, _a.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, er._)`${c} <= ${t.length}`);
    r.if((0, er.not)(d), () => u(d)), e.ok(d);
  }
  function u(d) {
    r.forRange("i", t.length, c, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: _a.Type.Num }, d), o.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
Cr.validateAdditionalItems = Nl;
Cr.default = Wm;
var ho = {}, Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.validateTuple = void 0;
const sc = te(), Hn = V, Xm = se, Jm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Rl(e, "additionalItems", t);
    r.items = !0, !(0, Hn.alwaysValidSchema)(r, t) && e.ok((0, Xm.validateArray)(e));
  }
};
function Rl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  l(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Hn.mergeEvaluated.items(n, r.length, c.items));
  const u = n.name("valid"), d = n.const("len", (0, sc._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Hn.alwaysValidSchema)(c, h) || (n.if((0, sc._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, u)), e.ok(u));
  });
  function l(h) {
    const { opts: E, errSchemaPath: $ } = c, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const _ = `"${o}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, Hn.checkStrictMode)(c, _, E.strictTuples);
    }
  }
}
Dr.validateTuple = Rl;
Dr.default = Jm;
Object.defineProperty(ho, "__esModule", { value: !0 });
const Ym = Dr, xm = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Ym.validateTuple)(e, "items")
};
ho.default = xm;
var po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const ac = te(), Zm = V, Qm = se, ey = Cr, ty = {
  message: ({ params: { len: e } }) => (0, ac.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ac._)`{limit: ${e}}`
}, ry = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ty,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Zm.alwaysValidSchema)(n, t) && (s ? (0, ey.validateAdditionalItems)(e, s) : e.ok((0, Qm.validateArray)(e)));
  }
};
po.default = ry;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const Ge = te(), Sn = V, ny = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge.str)`must contain at least ${e} valid item(s)` : (0, Ge.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge._)`{minContains: ${e}}` : (0, Ge._)`{minContains: ${e}, maxContains: ${t}}`
}, sy = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: ny,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: u, maxContains: d } = n;
    a.opts.next ? (o = u === void 0 ? 1 : u, c = d) : o = 1;
    const l = t.const("len", (0, Ge._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, Sn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, Sn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Sn.alwaysValidSchema)(a, r)) {
      let g = (0, Ge._)`${l} >= ${o}`;
      c !== void 0 && (g = (0, Ge._)`${g} && ${l} <= ${c}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? $(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, Ge._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), _ = t.let("count", 0);
      $(g, () => t.if(g, () => v(_)));
    }
    function $(g, _) {
      t.forRange("i", 0, l, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: Sn.Type.Num,
          compositeRule: !0
        }, g), _();
      });
    }
    function v(g) {
      t.code((0, Ge._)`${g}++`), c === void 0 ? t.if((0, Ge._)`${g} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ge._)`${g} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ge._)`${g} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
mo.default = sy;
var ps = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te(), r = V, n = se;
  e.error = {
    message: ({ params: { property: u, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${u} is present`;
    },
    params: ({ params: { property: u, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${u},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(u) {
      const [d, l] = a(u);
      o(u, d), c(u, l);
    }
  };
  function a({ schema: u }) {
    const d = {}, l = {};
    for (const h in u) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(u[h]) ? d : l;
      E[h] = u[h];
    }
    return [d, l];
  }
  function o(u, d = u.schema) {
    const { gen: l, data: h, it: E } = u;
    if (Object.keys(d).length === 0)
      return;
    const $ = l.let("missing");
    for (const v in d) {
      const g = d[v];
      if (g.length === 0)
        continue;
      const _ = (0, n.propertyInData)(l, h, v, E.opts.ownProperties);
      u.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? l.if(_, () => {
        for (const p of g)
          (0, n.checkReportMissingProp)(u, p);
      }) : (l.if((0, t._)`${_} && (${(0, n.checkMissingProp)(u, g, $)})`), (0, n.reportMissingProp)(u, $), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(u, d = u.schema) {
    const { gen: l, data: h, keyword: E, it: $ } = u, v = l.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)($, d[g]) || (l.if(
        (0, n.propertyInData)(l, h, g, $.opts.ownProperties),
        () => {
          const _ = u.subschema({ keyword: E, schemaProp: g }, v);
          u.mergeValidEvaluated(_, v);
        },
        () => l.var(v, !0)
        // TODO var
      ), u.ok(v));
  }
  e.validateSchemaDeps = c, e.default = s;
})(ps);
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const Ol = te(), ay = V, oy = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ol._)`{propertyName: ${e.propertyName}}`
}, iy = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: oy,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, ay.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Ol.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
yo.default = iy;
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
const Pn = se, Xe = te(), cy = Ue, Nn = V, uy = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Xe._)`{additionalProperty: ${e.additionalProperty}}`
}, ly = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: uy,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: u } = o;
    if (o.props = !0, u.removeAdditional !== "all" && (0, Nn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Pn.allSchemaProperties)(n.properties), l = (0, Pn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Xe._)`${a} === ${cy.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !d.length && !l.length ? v(_) : t.if(E(_), () => v(_));
      });
    }
    function E(_) {
      let p;
      if (d.length > 8) {
        const w = (0, Nn.schemaRefOrVal)(o, n.properties, "properties");
        p = (0, Pn.isOwnProperty)(t, w, _);
      } else d.length ? p = (0, Xe.or)(...d.map((w) => (0, Xe._)`${_} === ${w}`)) : p = Xe.nil;
      return l.length && (p = (0, Xe.or)(p, ...l.map((w) => (0, Xe._)`${(0, Pn.usePattern)(e, w)}.test(${_})`))), (0, Xe.not)(p);
    }
    function $(_) {
      t.code((0, Xe._)`delete ${s}[${_}]`);
    }
    function v(_) {
      if (u.removeAdditional === "all" || u.removeAdditional && r === !1) {
        $(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Nn.alwaysValidSchema)(o, r)) {
        const p = t.name("valid");
        u.removeAdditional === "failing" ? (g(_, p, !1), t.if((0, Xe.not)(p), () => {
          e.reset(), $(_);
        })) : (g(_, p), c || t.if((0, Xe.not)(p), () => t.break()));
      }
    }
    function g(_, p, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: Nn.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
ms.default = ly;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const dy = Ze, oc = se, Us = V, ic = ms, fy = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ic.default.code(new dy.KeywordCxt(a, ic.default, "additionalProperties"));
    const o = (0, oc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Us.mergeEvaluated.props(t, (0, Us.toHash)(o), a.props));
    const c = o.filter((h) => !(0, Us.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const u = t.name("valid");
    for (const h of c)
      d(h) ? l(h) : (t.if((0, oc.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(u, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(u);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, u);
    }
  }
};
$o.default = fy;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const cc = se, Rn = te(), uc = V, lc = V, hy = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, cc.allSchemaProperties)(r), u = c.filter((g) => (0, uc.alwaysValidSchema)(a, r[g]));
    if (c.length === 0 || u.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof Rn.Name) && (a.props = (0, lc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const g of c)
        d && $(g), a.allErrors ? v(g) : (t.var(l, !0), v(g), t.if(l));
    }
    function $(g) {
      for (const _ in d)
        new RegExp(g).test(_) && (0, uc.checkStrictMode)(a, `property ${_} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, (_) => {
        t.if((0, Rn._)`${(0, cc.usePattern)(e, g)}.test(${_})`, () => {
          const p = u.includes(g);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: _,
            dataPropType: lc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, Rn._)`${h}[${_}]`, !0) : !p && !a.allErrors && t.if((0, Rn.not)(l), () => t.break());
        });
      });
    }
  }
};
_o.default = hy;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const py = V, my = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, py.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
go.default = my;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const yy = se, $y = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: yy.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
vo.default = $y;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Bn = te(), _y = V, gy = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Bn._)`{passingSchemas: ${e.passing}}`
}, vy = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: gy,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), u = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let E;
        (0, _y.alwaysValidSchema)(s, l) ? t.var(u, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, u), h > 0 && t.if((0, Bn._)`${u} && ${o}`).assign(o, !1).assign(c, (0, Bn._)`[${c}, ${h}]`).else(), t.if(u, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, Bn.Name);
        });
      });
    }
  }
};
Eo.default = vy;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const Ey = V, wy = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Ey.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
wo.default = wy;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const ns = te(), Tl = V, by = {
  message: ({ params: e }) => (0, ns.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ns._)`{failingKeyword: ${e.ifClause}}`
}, Sy = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: by,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Tl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = dc(n, "then"), a = dc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (u(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(c, d("then", l), d("else", l));
    } else s ? t.if(c, d("then")) : t.if((0, ns.not)(c), d("else"));
    e.pass(o, () => e.error(!0));
    function u() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const E = e.subschema({ keyword: l }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ns._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function dc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Tl.alwaysValidSchema)(e, r);
}
bo.default = Sy;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const Py = V, Ny = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Py.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
So.default = Ny;
Object.defineProperty(fo, "__esModule", { value: !0 });
const Ry = Cr, Oy = ho, Ty = Dr, Iy = po, jy = mo, Ay = ps, ky = yo, Cy = ms, Dy = $o, My = _o, Ly = go, Vy = vo, Fy = Eo, Uy = wo, zy = bo, Gy = So;
function qy(e = !1) {
  const t = [
    // any
    Ly.default,
    Vy.default,
    Fy.default,
    Uy.default,
    zy.default,
    Gy.default,
    // object
    ky.default,
    Cy.default,
    Ay.default,
    Dy.default,
    My.default
  ];
  return e ? t.push(Oy.default, Iy.default) : t.push(Ry.default, Ty.default), t.push(jy.default), t;
}
fo.default = qy;
var Po = {}, Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.dynamicAnchor = void 0;
const zs = te(), Ky = Ue, fc = Ae, Hy = vt, By = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Il(e, e.schema)
};
function Il(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, zs._)`${Ky.default.dynamicAnchors}${(0, zs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Wy(e);
  r.if((0, zs._)`!${s}`, () => r.assign(s, a));
}
Mr.dynamicAnchor = Il;
function Wy(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: c } = t.root, { schemaId: u } = n.opts, d = new fc.SchemaEnv({ schema: r, schemaId: u, root: s, baseId: a, localRefs: o, meta: c });
  return fc.compileSchema.call(n, d), (0, Hy.getValidate)(e, d);
}
Mr.default = By;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.dynamicRef = void 0;
const hc = te(), Xy = Ue, pc = vt, Jy = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => jl(e, e.schema)
};
function jl(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const u = r.let("valid", !1);
    o(u), e.ok(u);
  }
  function o(u) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, hc._)`${Xy.default.dynamicAnchors}${(0, hc.getProperty)(a)}`);
      r.if(d, c(d, u), c(s.validateName, u));
    } else
      c(s.validateName, u)();
  }
  function c(u, d) {
    return d ? () => r.block(() => {
      (0, pc.callRef)(e, u), r.let(d, !0);
    }) : () => (0, pc.callRef)(e, u);
  }
}
Lr.dynamicRef = jl;
Lr.default = Jy;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const Yy = Mr, xy = V, Zy = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Yy.dynamicAnchor)(e, "") : (0, xy.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
No.default = Zy;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Qy = Lr, e$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Qy.dynamicRef)(e, e.schema)
};
Ro.default = e$;
Object.defineProperty(Po, "__esModule", { value: !0 });
const t$ = Mr, r$ = Lr, n$ = No, s$ = Ro, a$ = [t$.default, r$.default, n$.default, s$.default];
Po.default = a$;
var Oo = {}, To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const mc = ps, o$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: mc.error,
  code: (e) => (0, mc.validatePropertyDeps)(e)
};
To.default = o$;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const i$ = ps, c$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, i$.validateSchemaDeps)(e)
};
Io.default = c$;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const u$ = V, l$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, u$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
jo.default = l$;
Object.defineProperty(Oo, "__esModule", { value: !0 });
const d$ = To, f$ = Io, h$ = jo, p$ = [d$.default, f$.default, h$.default];
Oo.default = p$;
var Ao = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const Ot = te(), yc = V, m$ = Ue, y$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Ot._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, $$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: y$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: c } = a;
    c instanceof Ot.Name ? t.if((0, Ot._)`${c} !== true`, () => t.forIn("key", n, (h) => t.if(d(c, h), () => u(h)))) : c !== !0 && t.forIn("key", n, (h) => c === void 0 ? u(h) : t.if(l(c, h), () => u(h))), a.props = !0, e.ok((0, Ot._)`${s} === ${m$.default.errors}`);
    function u(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, yc.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: yc.Type.Str
        }, E), o || t.if((0, Ot.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, Ot._)`!${h} || !${h}[${E}]`;
    }
    function l(h, E) {
      const $ = [];
      for (const v in h)
        h[v] === !0 && $.push((0, Ot._)`${E} !== ${v}`);
      return (0, Ot.and)(...$);
    }
  }
};
ko.default = $$;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const tr = te(), $c = V, _$ = {
  message: ({ params: { len: e } }) => (0, tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tr._)`{limit: ${e}}`
}, g$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: _$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, tr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, tr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, $c.alwaysValidSchema)(s, r)) {
      const u = t.var("valid", (0, tr._)`${o} <= ${a}`);
      t.if((0, tr.not)(u), () => c(u, a)), e.ok(u);
    }
    s.items = !0;
    function c(u, d) {
      t.forRange("i", d, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: $c.Type.Num }, u), s.allErrors || t.if((0, tr.not)(u), () => t.break());
      });
    }
  }
};
Co.default = g$;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const v$ = ko, E$ = Co, w$ = [v$.default, E$.default];
Ao.default = w$;
var Do = {}, Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const pe = te(), b$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, S$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: b$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: u, errSchemaPath: d, schemaEnv: l, self: h } = c;
    if (!u.validateFormats)
      return;
    s ? E() : $();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: u.code.formats
      }), g = r.const("fDef", (0, pe._)`${v}[${o}]`), _ = r.let("fType"), p = r.let("format");
      r.if((0, pe._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(_, (0, pe._)`${g}.type || "string"`).assign(p, (0, pe._)`${g}.validate`), () => r.assign(_, (0, pe._)`"string"`).assign(p, g)), e.fail$data((0, pe.or)(w(), N()));
      function w() {
        return u.strictSchema === !1 ? pe.nil : (0, pe._)`${o} && !${p}`;
      }
      function N() {
        const T = l.$async ? (0, pe._)`(${g}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, pe._)`${p}(${n})`, I = (0, pe._)`(typeof ${p} == "function" ? ${T} : ${p}.test(${n}))`;
        return (0, pe._)`${p} && ${p} !== true && ${_} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[a];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [g, _, p] = N(v);
      g === t && e.pass(T());
      function w() {
        if (u.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(I) {
        const G = I instanceof RegExp ? (0, pe.regexpCode)(I) : u.code.formats ? (0, pe._)`${u.code.formats}${(0, pe.getProperty)(a)}` : void 0, W = r.scopeValue("formats", { key: a, ref: I, code: G });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, pe._)`${W}.validate`] : ["string", I, W];
      }
      function T() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${p}(${n})`;
        }
        return typeof _ == "function" ? (0, pe._)`${p}(${n})` : (0, pe._)`${p}.test(${n})`;
      }
    }
  }
};
Mo.default = S$;
Object.defineProperty(Do, "__esModule", { value: !0 });
const P$ = Mo, N$ = [P$.default];
Do.default = N$;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.contentVocabulary = Ir.metadataVocabulary = void 0;
Ir.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ir.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ya, "__esModule", { value: !0 });
const R$ = xa, O$ = Qa, T$ = fo, I$ = Po, j$ = Oo, A$ = Ao, k$ = Do, _c = Ir, C$ = [
  I$.default,
  R$.default,
  O$.default,
  (0, T$.default)(!0),
  k$.default,
  _c.metadataVocabulary,
  _c.contentVocabulary,
  j$.default,
  A$.default
];
Ya.default = C$;
var Lo = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var gc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(gc || (ys.DiscrError = gc = {}));
Object.defineProperty(Lo, "__esModule", { value: !0 });
const _r = te(), ga = ys, vc = Ae, D$ = kr, M$ = V, L$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ga.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _r._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, V$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: L$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const u = t.let("valid", !1), d = t.const("tag", (0, _r._)`${r}${(0, _r.getProperty)(c)}`);
    t.if((0, _r._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: ga.DiscrError.Tag, tag: d, tagName: c })), e.ok(u);
    function l() {
      const $ = E();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, _r._)`${d} === ${v}`), t.assign(u, h($[v]));
      t.else(), e.error(!1, { discrError: ga.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(g, _r.Name), v;
    }
    function E() {
      var $;
      const v = {}, g = p(s);
      let _ = !0;
      for (let T = 0; T < o.length; T++) {
        let I = o[T];
        if (I != null && I.$ref && !(0, M$.schemaHasRulesButRef)(I, a.self.RULES)) {
          const W = I.$ref;
          if (I = vc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, W), I instanceof vc.SchemaEnv && (I = I.schema), I === void 0)
            throw new D$.default(a.opts.uriResolver, a.baseId, W);
        }
        const G = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[c];
        if (typeof G != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        _ = _ && (g || p(I)), w(G, T);
      }
      if (!_)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function p({ required: T }) {
        return Array.isArray(T) && T.includes(c);
      }
      function w(T, I) {
        if (T.const)
          N(T.const, I);
        else if (T.enum)
          for (const G of T.enum)
            N(G, I);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function N(T, I) {
        if (typeof T != "string" || T in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[T] = I;
      }
    }
  }
};
Lo.default = V$;
var Vo = {};
const F$ = "https://json-schema.org/draft/2020-12/schema", U$ = "https://json-schema.org/draft/2020-12/schema", z$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, G$ = "meta", q$ = "Core and Validation specifications meta-schema", K$ = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], H$ = [
  "object",
  "boolean"
], B$ = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", W$ = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, X$ = {
  $schema: F$,
  $id: U$,
  $vocabulary: z$,
  $dynamicAnchor: G$,
  title: q$,
  allOf: K$,
  type: H$,
  $comment: B$,
  properties: W$
}, J$ = "https://json-schema.org/draft/2020-12/schema", Y$ = "https://json-schema.org/draft/2020-12/meta/applicator", x$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Z$ = "meta", Q$ = "Applicator vocabulary meta-schema", e_ = [
  "object",
  "boolean"
], t_ = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, r_ = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, n_ = {
  $schema: J$,
  $id: Y$,
  $vocabulary: x$,
  $dynamicAnchor: Z$,
  title: Q$,
  type: e_,
  properties: t_,
  $defs: r_
}, s_ = "https://json-schema.org/draft/2020-12/schema", a_ = "https://json-schema.org/draft/2020-12/meta/unevaluated", o_ = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, i_ = "meta", c_ = "Unevaluated applicator vocabulary meta-schema", u_ = [
  "object",
  "boolean"
], l_ = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, d_ = {
  $schema: s_,
  $id: a_,
  $vocabulary: o_,
  $dynamicAnchor: i_,
  title: c_,
  type: u_,
  properties: l_
}, f_ = "https://json-schema.org/draft/2020-12/schema", h_ = "https://json-schema.org/draft/2020-12/meta/content", p_ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, m_ = "meta", y_ = "Content vocabulary meta-schema", $_ = [
  "object",
  "boolean"
], __ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, g_ = {
  $schema: f_,
  $id: h_,
  $vocabulary: p_,
  $dynamicAnchor: m_,
  title: y_,
  type: $_,
  properties: __
}, v_ = "https://json-schema.org/draft/2020-12/schema", E_ = "https://json-schema.org/draft/2020-12/meta/core", w_ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, b_ = "meta", S_ = "Core vocabulary meta-schema", P_ = [
  "object",
  "boolean"
], N_ = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, R_ = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, O_ = {
  $schema: v_,
  $id: E_,
  $vocabulary: w_,
  $dynamicAnchor: b_,
  title: S_,
  type: P_,
  properties: N_,
  $defs: R_
}, T_ = "https://json-schema.org/draft/2020-12/schema", I_ = "https://json-schema.org/draft/2020-12/meta/format-annotation", j_ = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, A_ = "meta", k_ = "Format vocabulary meta-schema for annotation results", C_ = [
  "object",
  "boolean"
], D_ = {
  format: {
    type: "string"
  }
}, M_ = {
  $schema: T_,
  $id: I_,
  $vocabulary: j_,
  $dynamicAnchor: A_,
  title: k_,
  type: C_,
  properties: D_
}, L_ = "https://json-schema.org/draft/2020-12/schema", V_ = "https://json-schema.org/draft/2020-12/meta/meta-data", F_ = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, U_ = "meta", z_ = "Meta-data vocabulary meta-schema", G_ = [
  "object",
  "boolean"
], q_ = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, K_ = {
  $schema: L_,
  $id: V_,
  $vocabulary: F_,
  $dynamicAnchor: U_,
  title: z_,
  type: G_,
  properties: q_
}, H_ = "https://json-schema.org/draft/2020-12/schema", B_ = "https://json-schema.org/draft/2020-12/meta/validation", W_ = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, X_ = "meta", J_ = "Validation vocabulary meta-schema", Y_ = [
  "object",
  "boolean"
], x_ = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
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
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, Z_ = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
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
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Q_ = {
  $schema: H_,
  $id: B_,
  $vocabulary: W_,
  $dynamicAnchor: X_,
  title: J_,
  type: Y_,
  properties: x_,
  $defs: Z_
};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const eg = X$, tg = n_, rg = d_, ng = g_, sg = O_, ag = M_, og = K_, ig = Q_, cg = ["/properties"];
function ug(e) {
  return [
    eg,
    tg,
    rg,
    ng,
    sg,
    t(this, ag),
    og,
    t(this, ig)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, cg) : n;
  }
}
Vo.default = ug;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = ku, n = Ya, s = Lo, a = Vo, o = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor($ = {}) {
      super({
        ...$,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: $, meta: v } = this.opts;
      v && (a.default.call(this, $), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var u = Ze;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var d = te();
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var l = hn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ha, ha.exports);
var lg = ha.exports, va = { exports: {} }, Al = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(q, L) {
    return { validate: q, compare: L };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(u(!0), d),
    "date-time": t(E(!0), $),
    "iso-time": t(u(), l),
    "iso-date-time": t(E(), v),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: p,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ie,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: G },
    // signed 64 bit integer
    int64: { type: "number", validate: W },
    // C-type float
    float: { type: "number", validate: le },
    // C-type double
    double: { type: "number", validate: le },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(q) {
    return q % 4 === 0 && (q % 100 !== 0 || q % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(q) {
    const L = n.exec(q);
    if (!L)
      return !1;
    const K = +L[1], R = +L[2], O = +L[3];
    return R >= 1 && R <= 12 && O >= 1 && O <= (R === 2 && r(K) ? 29 : s[R]);
  }
  function o(q, L) {
    if (q && L)
      return q > L ? 1 : q < L ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function u(q) {
    return function(K) {
      const R = c.exec(K);
      if (!R)
        return !1;
      const O = +R[1], k = +R[2], D = +R[3], M = R[4], C = R[5] === "-" ? -1 : 1, P = +(R[6] || 0), m = +(R[7] || 0);
      if (P > 23 || m > 59 || q && !M)
        return !1;
      if (O <= 23 && k <= 59 && D < 60)
        return !0;
      const b = k - m * C, y = O - P * C - (b < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (b === 59 || b === -1) && D < 61;
    };
  }
  function d(q, L) {
    if (!(q && L))
      return;
    const K = (/* @__PURE__ */ new Date("2020-01-01T" + q)).valueOf(), R = (/* @__PURE__ */ new Date("2020-01-01T" + L)).valueOf();
    if (K && R)
      return K - R;
  }
  function l(q, L) {
    if (!(q && L))
      return;
    const K = c.exec(q), R = c.exec(L);
    if (K && R)
      return q = K[1] + K[2] + K[3], L = R[1] + R[2] + R[3], q > L ? 1 : q < L ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(q) {
    const L = u(q);
    return function(R) {
      const O = R.split(h);
      return O.length === 2 && a(O[0]) && L(O[1]);
    };
  }
  function $(q, L) {
    if (!(q && L))
      return;
    const K = new Date(q).valueOf(), R = new Date(L).valueOf();
    if (K && R)
      return K - R;
  }
  function v(q, L) {
    if (!(q && L))
      return;
    const [K, R] = q.split(h), [O, k] = L.split(h), D = o(K, O);
    if (D !== void 0)
      return D || d(R, k);
  }
  const g = /\/|:/, _ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function p(q) {
    return g.test(q) && _.test(q);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(q) {
    return w.lastIndex = 0, w.test(q);
  }
  const T = -2147483648, I = 2 ** 31 - 1;
  function G(q) {
    return Number.isInteger(q) && q <= I && q >= T;
  }
  function W(q) {
    return Number.isInteger(q);
  }
  function le() {
    return !0;
  }
  const oe = /[^\\]\\Z/;
  function ie(q) {
    if (oe.test(q))
      return !1;
    try {
      return new RegExp(q), !0;
    } catch {
      return !1;
    }
  }
})(Al);
var kl = {}, Ea = { exports: {} }, Cl = {}, Qe = {}, jr = {}, mn = {}, ne = {}, dn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, T) => `${N}${T}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, T) => (T instanceof r && (N[T.str] = (N[T.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(p, ...w) {
    const N = [p[0]];
    let T = 0;
    for (; T < w.length; )
      c(N, w[T]), N.push(p[++T]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(p, ...w) {
    const N = [$(p[0])];
    let T = 0;
    for (; T < w.length; )
      N.push(a), c(N, w[T]), N.push(a, $(p[++T]));
    return u(N), new n(N);
  }
  e.str = o;
  function c(p, w) {
    w instanceof n ? p.push(...w._items) : w instanceof r ? p.push(w) : p.push(h(w));
  }
  e.addCodeArg = c;
  function u(p) {
    let w = 1;
    for (; w < p.length - 1; ) {
      if (p[w] === a) {
        const N = d(p[w - 1], p[w + 1]);
        if (N !== void 0) {
          p.splice(w - 1, 3, N);
          continue;
        }
        p[w++] = "+";
      }
      w++;
    }
  }
  function d(p, w) {
    if (w === '""')
      return p;
    if (p === '""')
      return w;
    if (typeof p == "string")
      return w instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${p.slice(0, -1)}${w}"` : w[0] === '"' ? p.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(p instanceof r))
      return `"${p}${w.slice(1)}`;
  }
  function l(p, w) {
    return w.emptyStr() ? p : p.emptyStr() ? w : o`${p}${w}`;
  }
  e.strConcat = l;
  function h(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : $(Array.isArray(p) ? p.join(",") : p);
  }
  function E(p) {
    return new n($(p));
  }
  e.stringify = E;
  function $(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = $;
  function v(p) {
    return typeof p == "string" && e.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  e.getProperty = v;
  function g(p) {
    if (typeof p == "string" && e.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function _(p) {
    return new n(p.toString());
  }
  e.regexpCode = _;
})(dn);
var wa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = dn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(u) {
    u[u.Started = 0] = "Started", u[u.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class c extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: $ } = E, v = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let g = this._values[$];
      if (g) {
        const w = g.get(v);
        if (w)
          return w;
      } else
        g = this._values[$] = /* @__PURE__ */ new Map();
      g.set(v, E);
      const _ = this._scope[$] || (this._scope[$] = []), p = _.length;
      return _[p] = l.ref, E.setValue(l, { property: $, itemIndex: p }), E;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, E) {
      let $ = t.nil;
      for (const v in d) {
        const g = d[v];
        if (!g)
          continue;
        const _ = h[v] = h[v] || /* @__PURE__ */ new Map();
        g.forEach((p) => {
          if (_.has(p))
            return;
          _.set(p, n.Started);
          let w = l(p);
          if (w) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            $ = (0, t._)`${$}${N} ${p} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(p))
            $ = (0, t._)`${$}${w}${this.opts._n}`;
          else
            throw new r(p);
          _.set(p, n.Completed);
        });
      }
      return $;
    }
  }
  e.ValueScope = c;
})(wa);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = dn, r = wa;
  var n = dn;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = wa;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, S) {
      super(), this.varKind = i, this.name = f, this.rhs = S;
    }
    render({ es5: i, _n: f }) {
      const S = i ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${j};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = R(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(i, f, S) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = R(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return K(i, this.rhs);
    }
  }
  class u extends c {
    constructor(i, f, S, j) {
      super(i, S, j), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class l extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = R(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, S) => f + S.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const S = i[f].optimizeNodes();
        Array.isArray(S) ? i.splice(f, 1, ...S) : S ? i[f] = S : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: S } = this;
      let j = S.length;
      for (; j--; ) {
        const A = S[j];
        A.optimizeNames(i, f) || (O(i, A.names), S.splice(j, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => L(i, f.names), {});
    }
  }
  class v extends $ {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class g extends $ {
  }
  class _ extends v {
  }
  _.kind = "else";
  class p extends v {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new _(S) : S;
      }
      if (f)
        return i === !1 ? f instanceof p ? f : f.nodes : this.nodes.length ? this : new p(k(i), f instanceof p ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = R(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return K(i, this.condition), this.else && L(i, this.else.names), i;
    }
  }
  p.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class N extends w {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = R(this.iteration, i, f), this;
    }
    get names() {
      return L(super.names, this.iteration.names);
    }
  }
  class T extends w {
    constructor(i, f, S, j) {
      super(), this.varKind = i, this.name = f, this.from = S, this.to = j;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: S, from: j, to: A } = this;
      return `for(${f} ${S}=${j}; ${S}<${A}; ${S}++)` + super.render(i);
    }
    get names() {
      const i = K(super.names, this.from);
      return K(i, this.to);
    }
  }
  class I extends w {
    constructor(i, f, S, j) {
      super(), this.loop = i, this.varKind = f, this.name = S, this.iterable = j;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = R(this.iterable, i, f), this;
    }
    get names() {
      return L(super.names, this.iterable.names);
    }
  }
  class G extends v {
    constructor(i, f, S) {
      super(), this.name = i, this.args = f, this.async = S;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  G.kind = "func";
  class W extends $ {
    render(i) {
      return "return " + super.render(i);
    }
  }
  W.kind = "return";
  class le extends v {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var S, j;
      return super.optimizeNames(i, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(i, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && L(i, this.catch.names), this.finally && L(i, this.finally.names), i;
    }
  }
  class oe extends v {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  oe.kind = "catch";
  class ie extends v {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ie.kind = "finally";
  class q {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const S = this._extScope.value(i, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, S, j) {
      const A = this._scope.toName(f);
      return S !== void 0 && j && (this._constants[A.str] = S), this._leafNode(new o(i, A, S)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, S) {
      return this._def(r.varKinds.const, i, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, S) {
      return this._def(r.varKinds.let, i, f, S);
    }
    // `var` declaration with optional assignment
    var(i, f, S) {
      return this._def(r.varKinds.var, i, f, S);
    }
    // assignment code
    assign(i, f, S) {
      return this._leafNode(new c(i, f, S));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new u(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [S, j] of i)
        f.length > 1 && f.push(","), f.push(S), (S !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, S) {
      if (this._blockNode(new p(i)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new p(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, _);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, S, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const z = this._scope.toName(i);
      return this._for(new T(A, z, f, S), () => j(z));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, S, j = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const z = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${z}.length`, (U) => {
          this.var(A, (0, t._)`${z}[${U}]`), S(A);
        });
      }
      return this._for(new I("of", j, A, f), () => S(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, S, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, S);
      const A = this._scope.toName(i);
      return this._for(new I("in", j, A, f), () => S(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new l(i));
    }
    // `return` statement
    return(i) {
      const f = new W();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(W);
    }
    // `try` statement
    try(i, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const j = new le();
      if (this._blockNode(j), this.code(i), f) {
        const A = this.name("e");
        this._currNode = j.catch = new oe(A), f(A);
      }
      return S && (this._currNode = j.finally = new ie(), this.code(S)), this._endBlockNode(oe, ie);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || i !== void 0 && S !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, S, j) {
      return this._blockNode(new G(i, f, S)), j && this.code(j).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(G);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const S = this._currNode;
      if (S instanceof i || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof p))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = q;
  function L(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function K(y, i) {
    return i instanceof t._CodeOrName ? L(y, i.names) : y;
  }
  function R(y, i, f) {
    if (y instanceof t.Name)
      return S(y);
    if (!j(y))
      return y;
    return new t._Code(y._items.reduce((A, z) => (z instanceof t.Name && (z = S(z)), z instanceof t._Code ? A.push(...z._items) : A.push(z), A), []));
    function S(A) {
      const z = f[A.str];
      return z === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], z);
    }
    function j(A) {
      return A instanceof t._Code && A._items.some((z) => z instanceof t.Name && i[z.str] === 1 && f[z.str] !== void 0);
    }
  }
  function O(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function k(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${b(y)}`;
  }
  e.not = k;
  const D = m(e.operators.AND);
  function M(...y) {
    return y.reduce(D);
  }
  e.and = M;
  const C = m(e.operators.OR);
  function P(...y) {
    return y.reduce(C);
  }
  e.or = P;
  function m(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${b(i)} ${y} ${b(f)}`;
  }
  function b(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ne);
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.checkStrictMode = F.getErrorPath = F.Type = F.useFunc = F.setEvaluated = F.evaluatedPropsToName = F.mergeEvaluated = F.eachItem = F.unescapeJsonPointer = F.escapeJsonPointer = F.escapeFragment = F.unescapeFragment = F.schemaRefOrVal = F.schemaHasRulesButRef = F.schemaHasRules = F.checkUnknownRules = F.alwaysValidSchema = F.toHash = void 0;
const ue = ne, dg = dn;
function fg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
F.toHash = fg;
function hg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Dl(e, t), !Ml(t, e.self.RULES.all));
}
F.alwaysValidSchema = hg;
function Dl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Fl(e, `unknown keyword: "${a}"`);
}
F.checkUnknownRules = Dl;
function Ml(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
F.schemaHasRules = Ml;
function pg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
F.schemaHasRulesButRef = pg;
function mg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ue._)`${r}`;
  }
  return (0, ue._)`${e}${t}${(0, ue.getProperty)(n)}`;
}
F.schemaRefOrVal = mg;
function yg(e) {
  return Ll(decodeURIComponent(e));
}
F.unescapeFragment = yg;
function $g(e) {
  return encodeURIComponent(Fo(e));
}
F.escapeFragment = $g;
function Fo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
F.escapeJsonPointer = Fo;
function Ll(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
F.unescapeJsonPointer = Ll;
function _g(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
F.eachItem = _g;
function Ec({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const u = o === void 0 ? a : o instanceof ue.Name ? (a instanceof ue.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ue.Name ? (t(s, o, a), a) : r(a, o);
    return c === ue.Name && !(u instanceof ue.Name) ? n(s, u) : u;
  };
}
F.mergeEvaluated = {
  props: Ec({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ue._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ue._)`${r} || {}`).code((0, ue._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ue._)`${r} || {}`), Uo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Vl
  }),
  items: Ec({
    mergeNames: (e, t, r) => e.if((0, ue._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ue._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ue._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ue._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Vl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ue._)`{}`);
  return t !== void 0 && Uo(e, r, t), r;
}
F.evaluatedPropsToName = Vl;
function Uo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ue._)`${t}${(0, ue.getProperty)(n)}`, !0));
}
F.setEvaluated = Uo;
const wc = {};
function gg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: wc[t.code] || (wc[t.code] = new dg._Code(t.code))
  });
}
F.useFunc = gg;
var ba;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ba || (F.Type = ba = {}));
function vg(e, t, r) {
  if (e instanceof ue.Name) {
    const n = t === ba.Num;
    return r ? n ? (0, ue._)`"[" + ${e} + "]"` : (0, ue._)`"['" + ${e} + "']"` : n ? (0, ue._)`"/" + ${e}` : (0, ue._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ue.getProperty)(e).toString() : "/" + Fo(e);
}
F.getErrorPath = vg;
function Fl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
F.checkStrictMode = Fl;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
const Re = ne, Eg = {
  // validation function arguments
  data: new Re.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Re.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Re.Name("instancePath"),
  parentData: new Re.Name("parentData"),
  parentDataProperty: new Re.Name("parentDataProperty"),
  rootData: new Re.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Re.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Re.Name("vErrors"),
  // null or array of validation errors
  errors: new Re.Name("errors"),
  // counter of validation errors
  this: new Re.Name("this"),
  // "globals"
  self: new Re.Name("self"),
  scope: new Re.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Re.Name("json"),
  jsonPos: new Re.Name("jsonPos"),
  jsonLen: new Re.Name("jsonLen"),
  jsonPart: new Re.Name("jsonPart")
};
dt.default = Eg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ne, r = F, n = dt;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: p }) => p ? (0, t.str)`"${_}" keyword must be ${p} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, p = e.keywordError, w, N) {
    const { it: T } = _, { gen: I, compositeRule: G, allErrors: W } = T, le = h(_, p, w);
    N ?? (G || W) ? u(I, le) : d(T, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(_, p = e.keywordError, w) {
    const { it: N } = _, { gen: T, compositeRule: I, allErrors: G } = N, W = h(_, p, w);
    u(T, W), I || G || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(_, p) {
    _.assign(n.default.errors, p), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(p, () => _.assign((0, t._)`${n.default.vErrors}.length`, p), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: _, keyword: p, schemaValue: w, data: N, errsCount: T, it: I }) {
    if (T === void 0)
      throw new Error("ajv implementation error");
    const G = _.name("err");
    _.forRange("i", T, n.default.errors, (W) => {
      _.const(G, (0, t._)`${n.default.vErrors}[${W}]`), _.if((0, t._)`${G}.instancePath === undefined`, () => _.assign((0, t._)`${G}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), _.assign((0, t._)`${G}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${p}`), I.opts.verbose && (_.assign((0, t._)`${G}.schema`, w), _.assign((0, t._)`${G}.data`, N));
    });
  }
  e.extendErrors = c;
  function u(_, p) {
    const w = _.const("err", p);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function d(_, p) {
    const { gen: w, validateName: N, schemaEnv: T } = _;
    T.$async ? w.throw((0, t._)`new ${_.ValidationError}(${p})`) : (w.assign((0, t._)`${N}.errors`, p), w.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, p, w) {
    const { createErrors: N } = _.it;
    return N === !1 ? (0, t._)`{}` : E(_, p, w);
  }
  function E(_, p, w = {}) {
    const { gen: N, it: T } = _, I = [
      $(T, w),
      v(_, w)
    ];
    return g(_, p, I), N.object(...I);
  }
  function $({ errorPath: _ }, { instancePath: p }) {
    const w = p ? (0, t.str)`${_}${(0, r.getErrorPath)(p, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: _, it: { errSchemaPath: p } }, { schemaPath: w, parentSchema: N }) {
    let T = N ? p : (0, t.str)`${p}/${_}`;
    return w && (T = (0, t.str)`${T}${(0, r.getErrorPath)(w, r.Type.Str)}`), [l.schemaPath, T];
  }
  function g(_, { params: p, message: w }, N) {
    const { keyword: T, data: I, schemaValue: G, it: W } = _, { opts: le, propertyName: oe, topSchemaRef: ie, schemaPath: q } = W;
    N.push([l.keyword, T], [l.params, typeof p == "function" ? p(_) : p || (0, t._)`{}`]), le.messages && N.push([l.message, typeof w == "function" ? w(_) : w]), le.verbose && N.push([l.schema, G], [l.parentSchema, (0, t._)`${ie}${q}`], [n.default.data, I]), oe && N.push([l.propertyName, oe]);
  }
})(mn);
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.boolOrEmptySchema = jr.topBoolOrEmptySchema = void 0;
const wg = mn, bg = ne, Sg = dt, Pg = {
  message: "boolean schema is false"
};
function Ng(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Ul(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Sg.default.data) : (t.assign((0, bg._)`${n}.errors`, null), t.return(!0));
}
jr.topBoolOrEmptySchema = Ng;
function Rg(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Ul(e)) : r.var(t, !0);
}
jr.boolOrEmptySchema = Rg;
function Ul(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, wg.reportError)(s, Pg, void 0, t);
}
var _e = {}, dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.getRules = dr.isJSONType = void 0;
const Og = ["string", "number", "integer", "boolean", "null", "object", "array"], Tg = new Set(Og);
function Ig(e) {
  return typeof e == "string" && Tg.has(e);
}
dr.isJSONType = Ig;
function jg() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
dr.getRules = jg;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.shouldUseRule = $t.shouldUseGroup = $t.schemaHasRulesForType = void 0;
function Ag({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && zl(e, n);
}
$t.schemaHasRulesForType = Ag;
function zl(e, t) {
  return t.rules.some((r) => Gl(e, r));
}
$t.shouldUseGroup = zl;
function Gl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
$t.shouldUseRule = Gl;
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
const kg = dr, Cg = $t, Dg = mn, ee = ne, ql = F;
var Nr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Nr || (_e.DataType = Nr = {}));
function Mg(e) {
  const t = Kl(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
_e.getSchemaTypes = Mg;
function Kl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(kg.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
_e.getJSONTypes = Kl;
function Lg(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Vg(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Cg.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = zo(t, n, s.strictNumbers, Nr.Wrong);
    r.if(c, () => {
      a.length ? Fg(e, t, a) : Go(e);
    });
  }
  return o;
}
_e.coerceAndCheckDataType = Lg;
const Hl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Vg(e, t) {
  return t ? e.filter((r) => Hl.has(r) || t === "array" && r === "array") : [];
}
function Fg(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, ee._)`typeof ${s}`), c = n.let("coerced", (0, ee._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ee._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ee._)`${s}[0]`).assign(o, (0, ee._)`typeof ${s}`).if(zo(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, ee._)`${c} !== undefined`);
  for (const d of r)
    (Hl.has(d) || d === "array" && a.coerceTypes === "array") && u(d);
  n.else(), Go(e), n.endIf(), n.if((0, ee._)`${c} !== undefined`, () => {
    n.assign(s, c), Ug(e, c);
  });
  function u(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ee._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, ee._)`"" + ${s}`).elseIf((0, ee._)`${s} === null`).assign(c, (0, ee._)`""`);
        return;
      case "number":
        n.elseIf((0, ee._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, ee._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ee._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, ee._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ee._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, ee._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, ee._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, ee._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, ee._)`[${s}]`);
    }
  }
}
function Ug({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ee._)`${t} !== undefined`, () => e.assign((0, ee._)`${t}[${r}]`, n));
}
function Sa(e, t, r, n = Nr.Correct) {
  const s = n === Nr.Correct ? ee.operators.EQ : ee.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, ee._)`${t} ${s} null`;
    case "array":
      a = (0, ee._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, ee._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, ee._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ee._)`typeof ${t} ${s} ${e}`;
  }
  return n === Nr.Correct ? a : (0, ee.not)(a);
  function o(c = ee.nil) {
    return (0, ee.and)((0, ee._)`typeof ${t} == "number"`, c, r ? (0, ee._)`isFinite(${t})` : ee.nil);
  }
}
_e.checkDataType = Sa;
function zo(e, t, r, n) {
  if (e.length === 1)
    return Sa(e[0], t, r, n);
  let s;
  const a = (0, ql.toHash)(e);
  if (a.array && a.object) {
    const o = (0, ee._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, ee._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ee.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ee.and)(s, Sa(o, t, r, n));
  return s;
}
_e.checkDataTypes = zo;
const zg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ee._)`{type: ${e}}` : (0, ee._)`{type: ${t}}`
};
function Go(e) {
  const t = Gg(e);
  (0, Dg.reportError)(t, zg);
}
_e.reportTypeError = Go;
function Gg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, ql.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.assignDefaults = void 0;
const mr = ne, qg = F;
function Kg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      bc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => bc(e, a, s.default));
}
$s.assignDefaults = Kg;
function bc(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const c = (0, mr._)`${a}${(0, mr.getProperty)(t)}`;
  if (s) {
    (0, qg.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let u = (0, mr._)`${c} === undefined`;
  o.useDefaults === "empty" && (u = (0, mr._)`${u} || ${c} === null || ${c} === ""`), n.if(u, (0, mr._)`${c} = ${(0, mr.stringify)(r)}`);
}
var lt = {}, ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.validateUnion = ae.validateArray = ae.usePattern = ae.callValidateCode = ae.schemaProperties = ae.allSchemaProperties = ae.noPropertyInData = ae.propertyInData = ae.isOwnProperty = ae.hasPropFunc = ae.reportMissingProp = ae.checkMissingProp = ae.checkReportMissingProp = void 0;
const fe = ne, qo = F, Nt = dt, Hg = F;
function Bg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ho(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
ae.checkReportMissingProp = Bg;
function Wg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((a) => (0, fe.and)(Ho(e, t, a, r.ownProperties), (0, fe._)`${s} = ${a}`)));
}
ae.checkMissingProp = Wg;
function Xg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ae.reportMissingProp = Xg;
function Bl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
ae.hasPropFunc = Bl;
function Ko(e, t, r) {
  return (0, fe._)`${Bl(e)}.call(${t}, ${r})`;
}
ae.isOwnProperty = Ko;
function Jg(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${Ko(e, t, r)}` : s;
}
ae.propertyInData = Jg;
function Ho(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(Ko(e, t, r))) : s;
}
ae.noPropertyInData = Ho;
function Wl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ae.allSchemaProperties = Wl;
function Yg(e, t) {
  return Wl(t).filter((r) => !(0, qo.alwaysValidSchema)(e, t[r]));
}
ae.schemaProperties = Yg;
function xg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, c, u, d) {
  const l = d ? (0, fe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Nt.default.instancePath, (0, fe.strConcat)(Nt.default.instancePath, a)],
    [Nt.default.parentData, o.parentData],
    [Nt.default.parentDataProperty, o.parentDataProperty],
    [Nt.default.rootData, Nt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Nt.default.dynamicAnchors, Nt.default.dynamicAnchors]);
  const E = (0, fe._)`${l}, ${r.object(...h)}`;
  return u !== fe.nil ? (0, fe._)`${c}.call(${u}, ${E})` : (0, fe._)`${c}(${E})`;
}
ae.callValidateCode = xg;
const Zg = (0, fe._)`new RegExp`;
function Qg({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, fe._)`${s.code === "new RegExp" ? Zg : (0, Hg.useFunc)(e, s)}(${r}, ${n})`
  });
}
ae.usePattern = Qg;
function ev(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(c) {
    const u = t.const("len", (0, fe._)`${r}.length`);
    t.forRange("i", 0, u, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: qo.Type.Num
      }, a), t.if((0, fe.not)(a), c);
    });
  }
}
ae.validateArray = ev;
function tv(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((u) => (0, qo.alwaysValidSchema)(s, u)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((u, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, c);
    t.assign(o, (0, fe._)`${o} || ${c}`), e.mergeValidEvaluated(l, c) || t.if((0, fe.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ae.validateUnion = tv;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
const je = ne, rr = dt, rv = ae, nv = mn;
function sv(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, c = t.macro.call(o.self, s, a, o), u = Xl(r, n, c);
  o.opts.validateSchema !== !1 && o.self.validateSchema(c, !0);
  const d = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: je.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: u,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
lt.macroKeywordCode = sv;
function av(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: c, it: u } = e;
  iv(u, t);
  const d = !c && t.compile ? t.compile.call(u.self, a, o, u) : t.validate, l = Xl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      g(), t.modifying && Sc(e), _(() => e.error());
    else {
      const p = t.async ? $() : v();
      t.modifying && Sc(e), _(() => ov(e, p));
    }
  }
  function $() {
    const p = n.let("ruleErrs", null);
    return n.try(() => g((0, je._)`await `), (w) => n.assign(h, !1).if((0, je._)`${w} instanceof ${u.ValidationError}`, () => n.assign(p, (0, je._)`${w}.errors`), () => n.throw(w))), p;
  }
  function v() {
    const p = (0, je._)`${l}.errors`;
    return n.assign(p, null), g(je.nil), p;
  }
  function g(p = t.async ? (0, je._)`await ` : je.nil) {
    const w = u.opts.passContext ? rr.default.this : rr.default.self, N = !("compile" in t && !c || t.schema === !1);
    n.assign(h, (0, je._)`${p}${(0, rv.callValidateCode)(e, l, w, N)}`, t.modifying);
  }
  function _(p) {
    var w;
    n.if((0, je.not)((w = t.valid) !== null && w !== void 0 ? w : h), p);
  }
}
lt.funcKeywordCode = av;
function Sc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, je._)`${n.parentData}[${n.parentDataProperty}]`));
}
function ov(e, t) {
  const { gen: r } = e;
  r.if((0, je._)`Array.isArray(${t})`, () => {
    r.assign(rr.default.vErrors, (0, je._)`${rr.default.vErrors} === null ? ${t} : ${rr.default.vErrors}.concat(${t})`).assign(rr.default.errors, (0, je._)`${rr.default.vErrors}.length`), (0, nv.extendErrors)(e);
  }, () => e.error());
}
function iv({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Xl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, je.stringify)(r) });
}
function cv(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
lt.validSchemaType = cv;
function uv({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const u = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(u);
    else
      throw new Error(u);
  }
}
lt.validateKeywordUsage = uv;
var Lt = {};
Object.defineProperty(Lt, "__esModule", { value: !0 });
Lt.extendSubschemaMode = Lt.extendSubschemaData = Lt.getSubschema = void 0;
const it = ne, Jl = F;
function lv(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}${(0, it.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Jl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Lt.getSubschema = lv;
function dv(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = c.let("data", (0, it._)`${t.data}${(0, it.getProperty)(r)}`, !0);
    u(E), e.errorPath = (0, it.str)`${d}${(0, Jl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, it._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof it.Name ? s : c.let("data", s, !0);
    u(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function u(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Lt.extendSubschemaData = dv;
function fv(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Lt.extendSubschemaMode = fv;
var be = {}, Yl = { exports: {} }, Dt = Yl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Wn(t, n, s, e, "", e);
};
Dt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Dt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Dt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Dt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Wn(e, t, r, n, s, a, o, c, u, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, u, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Dt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Wn(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Dt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Wn(e, t, r, h[$], s + "/" + l + "/" + hv($), a, s, l, n, $);
      } else (l in Dt.keywords || e.allKeys && !(l in Dt.skipKeywords)) && Wn(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, c, u, d);
  }
}
function hv(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var pv = Yl.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const mv = F, yv = ls, $v = pv, _v = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function gv(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Pa(e) : t ? xl(e) <= t : !1;
}
be.inlineRef = gv;
const vv = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Pa(e) {
  for (const t in e) {
    if (vv.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Pa) || typeof r == "object" && Pa(r))
      return !0;
  }
  return !1;
}
function xl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !_v.has(r) && (typeof e[r] == "object" && (0, mv.eachItem)(e[r], (n) => t += xl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Zl(e, t = "", r) {
  r !== !1 && (t = Rr(t));
  const n = e.parse(t);
  return Ql(e, n);
}
be.getFullPath = Zl;
function Ql(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = Ql;
const Ev = /#\/?$/;
function Rr(e) {
  return e ? e.replace(Ev, "") : "";
}
be.normalizeId = Rr;
function wv(e, t, r) {
  return r = Rr(r), e.resolve(t, r);
}
be.resolveUrl = wv;
const bv = /^[a-z_][-a-z0-9._]*$/i;
function Sv(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Rr(e[r] || t), a = { "": s }, o = Zl(n, s, !1), c = {}, u = /* @__PURE__ */ new Set();
  return $v(e, { allKeys: !0 }, (h, E, $, v) => {
    if (v === void 0)
      return;
    const g = o + E;
    let _ = a[v];
    typeof h[r] == "string" && (_ = p.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[E] = _;
    function p(N) {
      const T = this.opts.uriResolver.resolve;
      if (N = Rr(_ ? T(_, N) : N), u.has(N))
        throw l(N);
      u.add(N);
      let I = this.refs[N];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, N) : N !== Rr(g) && (N[0] === "#" ? (d(h, c[N], N), c[N] = h) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!bv.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), c;
  function d(h, E, $) {
    if (E !== void 0 && !yv(h, E))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = Sv;
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.getData = Qe.KeywordCxt = Qe.validateFunctionCode = void 0;
const ed = jr, Pc = _e, Bo = $t, ss = _e, Pv = $s, an = lt, Gs = Lt, B = ne, J = dt, Nv = be, _t = F, Xr = mn;
function Rv(e) {
  if (nd(e) && (sd(e), rd(e))) {
    Iv(e);
    return;
  }
  td(e, () => (0, ed.topBoolOrEmptySchema)(e));
}
Qe.validateFunctionCode = Rv;
function td({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, B._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    e.code((0, B._)`"use strict"; ${Nc(r, s)}`), Tv(e, s), e.code(a);
  }) : e.func(t, (0, B._)`${J.default.data}, ${Ov(s)}`, n.$async, () => e.code(Nc(r, s)).code(a));
}
function Ov(e) {
  return (0, B._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${e.dynamicRef ? (0, B._)`, ${J.default.dynamicAnchors}={}` : B.nil}}={}`;
}
function Tv(e, t) {
  e.if(J.default.valCxt, () => {
    e.var(J.default.instancePath, (0, B._)`${J.default.valCxt}.${J.default.instancePath}`), e.var(J.default.parentData, (0, B._)`${J.default.valCxt}.${J.default.parentData}`), e.var(J.default.parentDataProperty, (0, B._)`${J.default.valCxt}.${J.default.parentDataProperty}`), e.var(J.default.rootData, (0, B._)`${J.default.valCxt}.${J.default.rootData}`), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    e.var(J.default.instancePath, (0, B._)`""`), e.var(J.default.parentData, (0, B._)`undefined`), e.var(J.default.parentDataProperty, (0, B._)`undefined`), e.var(J.default.rootData, J.default.data), t.dynamicRef && e.var(J.default.dynamicAnchors, (0, B._)`{}`);
  });
}
function Iv(e) {
  const { schema: t, opts: r, gen: n } = e;
  td(e, () => {
    r.$comment && t.$comment && od(e), Dv(e), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && jv(e), ad(e), Vv(e);
  });
}
function jv(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, B._)`${r}.evaluated`), t.if((0, B._)`${e.evaluated}.dynamicProps`, () => t.assign((0, B._)`${e.evaluated}.props`, (0, B._)`undefined`)), t.if((0, B._)`${e.evaluated}.dynamicItems`, () => t.assign((0, B._)`${e.evaluated}.items`, (0, B._)`undefined`));
}
function Nc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, B._)`/*# sourceURL=${r} */` : B.nil;
}
function Av(e, t) {
  if (nd(e) && (sd(e), rd(e))) {
    kv(e, t);
    return;
  }
  (0, ed.boolOrEmptySchema)(e, t);
}
function rd({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function nd(e) {
  return typeof e.schema != "boolean";
}
function kv(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && od(e), Mv(e), Lv(e);
  const a = n.const("_errs", J.default.errors);
  ad(e, a), n.var(t, (0, B._)`${a} === ${J.default.errors}`);
}
function sd(e) {
  (0, _t.checkUnknownRules)(e), Cv(e);
}
function ad(e, t) {
  if (e.opts.jtd)
    return Rc(e, [], !1, t);
  const r = (0, Pc.getSchemaTypes)(e.schema), n = (0, Pc.coerceAndCheckDataType)(e, r);
  Rc(e, r, !n, t);
}
function Cv(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, _t.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Dv(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, _t.checkStrictMode)(e, "default is ignored in the schema root");
}
function Mv(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Nv.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Lv(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function od({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, B._)`${J.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, B.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, B._)`${J.default.self}.opts.$comment(${a}, ${o}, ${c}.schema)`);
  }
}
function Vv(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, B._)`${J.default.errors} === 0`, () => t.return(J.default.data), () => t.throw((0, B._)`new ${s}(${J.default.vErrors})`)) : (t.assign((0, B._)`${n}.errors`, J.default.vErrors), a.unevaluated && Fv(e), t.return((0, B._)`${J.default.errors} === 0`));
}
function Fv({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof B.Name && e.assign((0, B._)`${t}.props`, r), n instanceof B.Name && e.assign((0, B._)`${t}.items`, n);
}
function Rc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: c, opts: u, self: d } = e, { RULES: l } = d;
  if (a.$ref && (u.ignoreKeywordsWithRef || !(0, _t.schemaHasRulesButRef)(a, l))) {
    s.block(() => ud(e, "$ref", l.all.$ref.definition));
    return;
  }
  u.jtd || Uv(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Bo.shouldUseGroup)(a, E) && (E.type ? (s.if((0, ss.checkDataType)(E.type, o, u.strictNumbers)), Oc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, ss.reportTypeError)(e)), s.endIf()) : Oc(e, E), c || s.if((0, B._)`${J.default.errors} === ${n || 0}`));
  }
}
function Oc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Pv.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Bo.shouldUseRule)(n, a) && ud(e, a.keyword, a.definition, t.type);
  });
}
function Uv(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (zv(e, t), e.opts.allowUnionTypes || Gv(e, t), qv(e, e.dataTypes));
}
function zv(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      id(e.dataTypes, r) || Wo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Hv(e, t);
  }
}
function Gv(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Wo(e, "use allowUnionTypes to allow union type keyword");
}
function qv(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Bo.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Kv(t, o)) && Wo(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Kv(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function id(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Hv(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    id(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Wo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, _t.checkStrictMode)(e, t, e.opts.strictTypes);
}
class cd {
  constructor(t, r, n) {
    if ((0, an.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, _t.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", ld(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, an.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", J.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, B.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, B.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, B._)`${r} !== undefined && (${(0, B.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Xr.reportExtraError : Xr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Xr.reportError)(this, this.def.$dataError || Xr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Xr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = B.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = B.nil, r = B.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, B.or)((0, B._)`${s} === undefined`, r)), t !== B.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== B.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, B.or)(o(), c());
    function o() {
      if (n.length) {
        if (!(r instanceof B.Name))
          throw new Error("ajv implementation error");
        const u = Array.isArray(n) ? n : [n];
        return (0, B._)`${(0, ss.checkDataTypes)(u, r, a.opts.strictNumbers, ss.DataType.Wrong)}`;
      }
      return B.nil;
    }
    function c() {
      if (s.validateSchema) {
        const u = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, B._)`!${u}(${r})`;
      }
      return B.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Gs.getSubschema)(this.it, t);
    (0, Gs.extendSubschemaData)(n, this.it, t), (0, Gs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Av(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = _t.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = _t.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, B.Name)), !0;
  }
}
Qe.KeywordCxt = cd;
function ud(e, t, r, n) {
  const s = new cd(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, an.funcKeywordCode)(s, r) : "macro" in r ? (0, an.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, an.funcKeywordCode)(s, r);
}
const Bv = /^\/(?:[^~]|~0|~1)*$/, Wv = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ld(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return J.default.rootData;
  if (e[0] === "/") {
    if (!Bv.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = J.default.rootData;
  } else {
    const d = Wv.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(u("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(u("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let o = a;
  const c = s.split("/");
  for (const d of c)
    d && (a = (0, B._)`${a}${(0, B.getProperty)((0, _t.unescapeJsonPointer)(d))}`, o = (0, B._)`${o} && ${a}`);
  return o;
  function u(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Qe.getData = ld;
var yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
class Xv extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
yn.default = Xv;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
const qs = be;
class Jv extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, qs.resolveUrl)(t, r, n), this.missingSchema = (0, qs.normalizeId)((0, qs.getFullPath)(t, this.missingRef));
  }
}
Vr.default = Jv;
var Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.resolveSchema = Ve.getCompilingSchema = Ve.resolveRef = Ve.compileSchema = Ve.SchemaEnv = void 0;
const We = ne, Yv = yn, xt = dt, xe = be, Tc = F, xv = Qe;
class _s {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Ve.SchemaEnv = _s;
function Xo(e) {
  const t = dd.call(this, e);
  if (t)
    return t;
  const r = (0, xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new We.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: Yv.default,
    code: (0, We._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const u = o.scopeName("validate");
  e.validateName = u;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: xt.default.data,
    parentData: xt.default.parentData,
    parentDataProperty: xt.default.parentDataProperty,
    dataNames: [xt.default.data],
    dataPathArr: [We.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, We.stringify)(e.schema) } : { ref: e.schema }),
    validateName: u,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: We.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, We._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, xv.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(xt.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const $ = new Function(`${xt.default.self}`, `${xt.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(u, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: u, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      $.evaluated = {
        props: v instanceof We.Name ? void 0 : v,
        items: g instanceof We.Name ? void 0 : g,
        dynamicProps: v instanceof We.Name,
        dynamicItems: g instanceof We.Name
      }, $.source && ($.source.evaluated = (0, We.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ve.compileSchema = Xo;
function Zv(e, t, r) {
  var n;
  r = (0, xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = t0.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new _s({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Qv.call(this, a);
}
Ve.resolveRef = Zv;
function Qv(e) {
  return (0, xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Xo.call(this, e);
}
function dd(e) {
  for (const t of this._compilations)
    if (e0(t, e))
      return t;
}
Ve.getCompilingSchema = dd;
function e0(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function t0(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || gs.call(this, e, t);
}
function gs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ks.call(this, r, e);
  const a = (0, xe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = gs.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : Ks.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Xo.call(this, o), a === (0, xe.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: u } = this.opts, d = c[u];
      return d && (s = (0, xe.resolveUrl)(this.opts.uriResolver, s, d)), new _s({ schema: c, schemaId: u, root: e, baseId: s });
    }
    return Ks.call(this, r, o);
  }
}
Ve.resolveSchema = gs;
const r0 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ks(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const u = r[(0, Tc.unescapeFragment)(c)];
    if (u === void 0)
      return;
    r = u;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !r0.has(c) && d && (t = (0, xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Tc.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = gs.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new _s({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const n0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", s0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", a0 = "object", o0 = [
  "$data"
], i0 = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, c0 = !1, u0 = {
  $id: n0,
  description: s0,
  type: a0,
  required: o0,
  properties: i0,
  additionalProperties: c0
};
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const fd = El;
fd.code = 'require("ajv/dist/runtime/uri").default';
Jo.default = fd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Qe;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ne;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = yn, s = Vr, a = dr, o = Ve, c = ne, u = be, d = _e, l = F, h = u0, E = Jo, $ = (P, m) => new RegExp(P, m);
  $.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), _ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(P) {
    var m, b, y, i, f, S, j, A, z, U, Y, ye, rt, nt, Vt, Ft, Ut, zt, Gt, qt, Kt, Ht, Bt, Wt, Xt;
    const Ke = P.strict, Jt = (m = P.code) === null || m === void 0 ? void 0 : m.optimize, Gr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, qr = (y = (b = P.code) === null || b === void 0 ? void 0 : b.regExp) !== null && y !== void 0 ? y : $, Os = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : Ke) !== null && S !== void 0 ? S : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : Ke) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (z = P.strictTypes) !== null && z !== void 0 ? z : Ke) !== null && U !== void 0 ? U : "log",
      strictTuples: (ye = (Y = P.strictTuples) !== null && Y !== void 0 ? Y : Ke) !== null && ye !== void 0 ? ye : "log",
      strictRequired: (nt = (rt = P.strictRequired) !== null && rt !== void 0 ? rt : Ke) !== null && nt !== void 0 ? nt : !1,
      code: P.code ? { ...P.code, optimize: Gr, regExp: qr } : { optimize: Gr, regExp: qr },
      loopRequired: (Vt = P.loopRequired) !== null && Vt !== void 0 ? Vt : w,
      loopEnum: (Ft = P.loopEnum) !== null && Ft !== void 0 ? Ft : w,
      meta: (Ut = P.meta) !== null && Ut !== void 0 ? Ut : !0,
      messages: (zt = P.messages) !== null && zt !== void 0 ? zt : !0,
      inlineRefs: (Gt = P.inlineRefs) !== null && Gt !== void 0 ? Gt : !0,
      schemaId: (qt = P.schemaId) !== null && qt !== void 0 ? qt : "$id",
      addUsedSchema: (Kt = P.addUsedSchema) !== null && Kt !== void 0 ? Kt : !0,
      validateSchema: (Ht = P.validateSchema) !== null && Ht !== void 0 ? Ht : !0,
      validateFormats: (Bt = P.validateFormats) !== null && Bt !== void 0 ? Bt : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Os
    };
  }
  class T {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...N(m) };
      const { es5: b, lines: y } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: g, es5: b, lines: y }), this.logger = L(m.logger);
      const i = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, _, m, "NOT SUPPORTED"), I.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = ie.call(this), m.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && oe.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), W.call(this), m.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: b, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), b && m && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[b] || m : void 0;
    }
    validate(m, b) {
      let y;
      if (typeof m == "string") {
        if (y = this.getSchema(m), !y)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        y = this.compile(m);
      const i = y(b);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(m, b) {
      const y = this._addSchema(m, b);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(m, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, m, b);
      async function i(U, Y) {
        await f.call(this, U.$schema);
        const ye = this._addSchema(U, Y);
        return ye.validate || S.call(this, ye);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function S(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (Y) {
          if (!(Y instanceof s.default))
            throw Y;
          return j.call(this, Y), await A.call(this, Y.missingSchema), S.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: Y }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${Y} cannot be resolved`);
      }
      async function A(U) {
        const Y = await z.call(this, U);
        this.refs[U] || await f.call(this, Y.$schema), this.refs[U] || this.addSchema(Y, U, b);
      }
      async function z(U) {
        const Y = this._loading[U];
        if (Y)
          return Y;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, b, y, i = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const S of m)
          this.addSchema(S, void 0, y, i);
        return this;
      }
      let f;
      if (typeof m == "object") {
        const { schemaId: S } = this.opts;
        if (f = m[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, u.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(m, y, b, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, b, y = this.opts.validateSchema) {
      return this.addSchema(m, b, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, b) {
      if (typeof m == "boolean")
        return !0;
      let y;
      if (y = m.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, m);
      if (!i && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let b;
      for (; typeof (b = G.call(this, m)) == "string"; )
        m = b;
      if (b === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (b = o.resolveSchema.call(this, i, m), !b)
          return;
        this.refs[m] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = G.call(this, m);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const b = m;
          this._cache.delete(b);
          let y = m[this.opts.schemaId];
          return y && (y = (0, u.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const b of m)
        this.addKeyword(b);
      return this;
    }
    addKeyword(m, b) {
      let y;
      if (typeof m == "string")
        y = m, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = y);
      else if (typeof m == "object" && b === void 0) {
        if (b = m, y = b.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (R.call(this, y, b), !b)
        return (0, l.eachItem)(y, (f) => O.call(this, f)), this;
      D.call(this, b);
      const i = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, l.eachItem)(y, i.type.length === 0 ? (f) => O.call(this, f, i) : (f) => i.type.forEach((S) => O.call(this, f, i, S))), this;
    }
    getKeyword(m) {
      const b = this.RULES.all[m];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: b } = this;
      delete b.keywords[m], delete b.all[m];
      for (const y of b.rules) {
        const i = y.rules.findIndex((f) => f.keyword === m);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[m] = b, this;
    }
    errorsText(m = this.errors, { separator: b = ", ", dataVar: y = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + b + f);
    }
    $dataMetaSchema(m, b) {
      const y = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const i of b) {
        const f = i.split("/").slice(1);
        let S = m;
        for (const j of f)
          S = S[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: z } = A.definition, U = S[j];
          z && U && (S[j] = C(U));
        }
      }
      return m;
    }
    _removeAllSchemas(m, b) {
      for (const y in m) {
        const i = m[y];
        (!b || b.test(y)) && (typeof i == "string" ? delete m[y] : i && !i.meta && (this._cache.delete(i.schema), delete m[y]));
      }
    }
    _addSchema(m, b, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: j } = this.opts;
      if (typeof m == "object")
        S = m[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(m);
      if (A !== void 0)
        return A;
      y = (0, u.normalizeId)(S || y);
      const z = u.getSchemaRefs.call(this, m, y);
      return A = new o.SchemaEnv({ schema: m, schemaId: j, meta: b, baseId: y, localRefs: z }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(m, !0), A;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : o.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, m);
      } finally {
        this.opts = b;
      }
    }
  }
  T.ValidationError = n.default, T.MissingRefError = s.default, e.default = T;
  function I(P, m, b, y = "error") {
    for (const i in P) {
      const f = i;
      f in m && this.logger[y](`${b}: option ${i}. ${P[f]}`);
    }
  }
  function G(P) {
    return P = (0, u.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function W() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const m in P)
          this.addSchema(P[m], m);
  }
  function le() {
    for (const P in this.opts.formats) {
      const m = this.opts.formats[P];
      m && this.addFormat(P, m);
    }
  }
  function oe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in P) {
      const b = P[m];
      b.keyword || (b.keyword = m), this.addKeyword(b);
    }
  }
  function ie() {
    const P = { ...this.opts };
    for (const m of v)
      delete P[m];
    return P;
  }
  const q = { log() {
  }, warn() {
  }, error() {
  } };
  function L(P) {
    if (P === !1)
      return q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const K = /^[a-z_$][a-z0-9_$:-]*$/i;
  function R(P, m) {
    const { RULES: b } = this;
    if ((0, l.eachItem)(P, (y) => {
      if (b.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!K.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function O(P, m, b) {
    var y;
    const i = m == null ? void 0 : m.post;
    if (b && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = i ? f.post : f.rules.find(({ type: A }) => A === b);
    if (S || (S = { type: b, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !m)
      return;
    const j = {
      keyword: P,
      definition: {
        ...m,
        type: (0, d.getJSONTypes)(m.type),
        schemaType: (0, d.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? k.call(this, S, j, m.before) : S.rules.push(j), f.all[P] = j, (y = m.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function k(P, m, b) {
    const y = P.rules.findIndex((i) => i.keyword === b);
    y >= 0 ? P.rules.splice(y, 0, m) : (P.rules.push(m), this.logger.warn(`rule ${b} is not defined`));
  }
  function D(P) {
    let { metaSchema: m } = P;
    m !== void 0 && (P.$data && this.opts.$data && (m = C(m)), P.validateSchema = this.compile(m, !0));
  }
  const M = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function C(P) {
    return { anyOf: [P, M] };
  }
})(Cl);
var Yo = {}, xo = {}, Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const l0 = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Zo.default = l0;
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.callRef = fr.getValidate = void 0;
const d0 = Vr, Ic = ae, Le = ne, yr = dt, jc = Ve, On = F, f0 = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: u } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = jc.resolveRef.call(u, d, s, r);
    if (l === void 0)
      throw new d0.default(n.opts.uriResolver, s, r);
    if (l instanceof jc.SchemaEnv)
      return E(l);
    return $(l);
    function h() {
      if (a === d)
        return Xn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Xn(e, (0, Le._)`${v}.validate`, d, d.$async);
    }
    function E(v) {
      const g = hd(e, v);
      Xn(e, g, v, v.$async);
    }
    function $(v) {
      const g = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, Le.stringify)(v) } : { ref: v }), _ = t.name("valid"), p = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Le.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(p), e.ok(_);
    }
  }
};
function hd(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Le._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
fr.getValidate = hd;
function Xn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: u } = a, d = u.passContext ? yr.default.this : Le.nil;
  n ? l() : h();
  function l() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Le._)`await ${(0, Ic.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (g) => {
      s.if((0, Le._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), E(g), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Ic.callValidateCode)(e, t, d), () => $(t), () => E(t));
  }
  function E(v) {
    const g = (0, Le._)`${v}.errors`;
    s.assign(yr.default.vErrors, (0, Le._)`${yr.default.vErrors} === null ? ${g} : ${yr.default.vErrors}.concat(${g})`), s.assign(yr.default.errors, (0, Le._)`${yr.default.vErrors}.length`);
  }
  function $(v) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const _ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = On.mergeEvaluated.props(s, _.props, a.props));
      else {
        const p = s.var("props", (0, Le._)`${v}.evaluated.props`);
        a.props = On.mergeEvaluated.props(s, p, a.props, Le.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = On.mergeEvaluated.items(s, _.items, a.items));
      else {
        const p = s.var("items", (0, Le._)`${v}.evaluated.items`);
        a.items = On.mergeEvaluated.items(s, p, a.items, Le.Name);
      }
  }
}
fr.callRef = Xn;
fr.default = f0;
Object.defineProperty(xo, "__esModule", { value: !0 });
const h0 = Zo, p0 = fr, m0 = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  h0.default,
  p0.default
];
xo.default = m0;
var Qo = {}, ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const as = ne, Rt = as.operators, os = {
  maximum: { okStr: "<=", ok: Rt.LTE, fail: Rt.GT },
  minimum: { okStr: ">=", ok: Rt.GTE, fail: Rt.LT },
  exclusiveMaximum: { okStr: "<", ok: Rt.LT, fail: Rt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Rt.GT, fail: Rt.LTE }
}, y0 = {
  message: ({ keyword: e, schemaCode: t }) => (0, as.str)`must be ${os[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, as._)`{comparison: ${os[e].okStr}, limit: ${t}}`
}, $0 = {
  keyword: Object.keys(os),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: y0,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, as._)`${r} ${os[t].fail} ${n} || isNaN(${r})`);
  }
};
ei.default = $0;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const on = ne, _0 = {
  message: ({ schemaCode: e }) => (0, on.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, on._)`{multipleOf: ${e}}`
}, g0 = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: _0,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, on._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, on._)`${o} !== parseInt(${o})`;
    e.fail$data((0, on._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
ti.default = g0;
var ri = {}, ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
function pd(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ni.default = pd;
pd.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ri, "__esModule", { value: !0 });
const nr = ne, v0 = F, E0 = ni, w0 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, nr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, nr._)`{limit: ${e}}`
}, b0 = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: w0,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? nr.operators.GT : nr.operators.LT, o = s.opts.unicode === !1 ? (0, nr._)`${r}.length` : (0, nr._)`${(0, v0.useFunc)(e.gen, E0.default)}(${r})`;
    e.fail$data((0, nr._)`${o} ${a} ${n}`);
  }
};
ri.default = b0;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const S0 = ae, P0 = F, br = ne, N0 = {
  message: ({ schemaCode: e }) => (0, br.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, br._)`{pattern: ${e}}`
}, R0 = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: N0,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, c = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: u } = o.opts.code, d = u.code === "new RegExp" ? (0, br._)`new RegExp` : (0, P0.useFunc)(t, u), l = t.let("valid");
      t.try(() => t.assign(l, (0, br._)`${d}(${a}, ${c}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, br._)`!${l}`);
    } else {
      const u = (0, S0.usePattern)(e, s);
      e.fail$data((0, br._)`!${u}.test(${r})`);
    }
  }
};
si.default = R0;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const cn = ne, O0 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, cn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, cn._)`{limit: ${e}}`
}, T0 = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: O0,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? cn.operators.GT : cn.operators.LT;
    e.fail$data((0, cn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ai.default = T0;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Jr = ae, un = ne, I0 = F, j0 = {
  message: ({ params: { missingProperty: e } }) => (0, un.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, un._)`{missingProperty: ${e}}`
}, A0 = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: j0,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const u = r.length >= c.loopRequired;
    if (o.allErrors ? d() : l(), c.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if (($ == null ? void 0 : $[g]) === void 0 && !v.has(g)) {
          const _ = o.schemaEnv.baseId + o.errSchemaPath, p = `required property "${g}" is not defined at "${_}" (strictRequired)`;
          (0, I0.checkStrictMode)(o, p, o.opts.strictRequired);
        }
    }
    function d() {
      if (u || a)
        e.block$data(un.nil, h);
      else
        for (const $ of r)
          (0, Jr.checkReportMissingProp)(e, $);
    }
    function l() {
      const $ = t.let("missing");
      if (u || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E($, v)), e.ok(v);
      } else
        t.if((0, Jr.checkMissingProp)(e, r, $)), (0, Jr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Jr.noPropertyInData)(t, s, $, c.ownProperties), () => e.error());
      });
    }
    function E($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Jr.propertyInData)(t, s, $, c.ownProperties)), t.if((0, un.not)(v), () => {
          e.error(), t.break();
        });
      }, un.nil);
    }
  }
};
oi.default = A0;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const ln = ne, k0 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, ln.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, ln._)`{limit: ${e}}`
}, C0 = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: k0,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? ln.operators.GT : ln.operators.LT;
    e.fail$data((0, ln._)`${r}.length ${s} ${n}`);
  }
};
ii.default = C0;
var ci = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
const md = ls;
md.code = 'require("ajv/dist/runtime/equal").default';
$n.default = md;
Object.defineProperty(ci, "__esModule", { value: !0 });
const Hs = _e, Ee = ne, D0 = F, M0 = $n, L0 = {
  message: ({ params: { i: e, j: t } }) => (0, Ee.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ee._)`{i: ${e}, j: ${t}}`
}, V0 = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: L0,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const u = t.let("valid"), d = a.items ? (0, Hs.getSchemaTypes)(a.items) : [];
    e.block$data(u, l, (0, Ee._)`${o} === false`), e.ok(u);
    function l() {
      const v = t.let("i", (0, Ee._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(u, !0), t.if((0, Ee._)`${v} > 1`, () => (h() ? E : $)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function E(v, g) {
      const _ = t.name("item"), p = (0, Hs.checkDataTypes)(d, _, c.opts.strictNumbers, Hs.DataType.Wrong), w = t.const("indices", (0, Ee._)`{}`);
      t.for((0, Ee._)`;${v}--;`, () => {
        t.let(_, (0, Ee._)`${r}[${v}]`), t.if(p, (0, Ee._)`continue`), d.length > 1 && t.if((0, Ee._)`typeof ${_} == "string"`, (0, Ee._)`${_} += "_"`), t.if((0, Ee._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(g, (0, Ee._)`${w}[${_}]`), e.error(), t.assign(u, !1).break();
        }).code((0, Ee._)`${w}[${_}] = ${v}`);
      });
    }
    function $(v, g) {
      const _ = (0, D0.useFunc)(t, M0.default), p = t.name("outer");
      t.label(p).for((0, Ee._)`;${v}--;`, () => t.for((0, Ee._)`${g} = ${v}; ${g}--;`, () => t.if((0, Ee._)`${_}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(u, !1).break(p);
      })));
    }
  }
};
ci.default = V0;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const Na = ne, F0 = F, U0 = $n, z0 = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Na._)`{allowedValue: ${e}}`
}, G0 = {
  keyword: "const",
  $data: !0,
  error: z0,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Na._)`!${(0, F0.useFunc)(t, U0.default)}(${r}, ${s})`) : e.fail((0, Na._)`${a} !== ${r}`);
  }
};
ui.default = G0;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const Qr = ne, q0 = F, K0 = $n, H0 = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Qr._)`{allowedValues: ${e}}`
}, B0 = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: H0,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let u;
    const d = () => u ?? (u = (0, q0.useFunc)(t, K0.default));
    let l;
    if (c || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      l = (0, Qr.or)(...s.map((v, g) => E($, g)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, ($) => t.if((0, Qr._)`${d()}(${r}, ${$})`, () => t.assign(l, !0).break()));
    }
    function E($, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Qr._)`${d()}(${r}, ${$}[${v}])` : (0, Qr._)`${r} === ${g}`;
    }
  }
};
li.default = B0;
Object.defineProperty(Qo, "__esModule", { value: !0 });
const W0 = ei, X0 = ti, J0 = ri, Y0 = si, x0 = ai, Z0 = oi, Q0 = ii, eE = ci, tE = ui, rE = li, nE = [
  // number
  W0.default,
  X0.default,
  // string
  J0.default,
  Y0.default,
  // object
  x0.default,
  Z0.default,
  // array
  Q0.default,
  eE.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  tE.default,
  rE.default
];
Qo.default = nE;
var di = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.validateAdditionalItems = void 0;
const sr = ne, Ra = F, sE = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, aE = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: sE,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Ra.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    yd(e, n);
  }
};
function yd(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, sr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, sr._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Ra.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, sr._)`${c} <= ${t.length}`);
    r.if((0, sr.not)(d), () => u(d)), e.ok(d);
  }
  function u(d) {
    r.forRange("i", t.length, c, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: Ra.Type.Num }, d), o.allErrors || r.if((0, sr.not)(d), () => r.break());
    });
  }
}
Fr.validateAdditionalItems = yd;
Fr.default = aE;
var fi = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.validateTuple = void 0;
const Ac = ne, Jn = F, oE = ae, iE = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return $d(e, "additionalItems", t);
    r.items = !0, !(0, Jn.alwaysValidSchema)(r, t) && e.ok((0, oE.validateArray)(e));
  }
};
function $d(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  l(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Jn.mergeEvaluated.items(n, r.length, c.items));
  const u = n.name("valid"), d = n.const("len", (0, Ac._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Jn.alwaysValidSchema)(c, h) || (n.if((0, Ac._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, u)), e.ok(u));
  });
  function l(h) {
    const { opts: E, errSchemaPath: $ } = c, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const _ = `"${o}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, Jn.checkStrictMode)(c, _, E.strictTuples);
    }
  }
}
Ur.validateTuple = $d;
Ur.default = iE;
Object.defineProperty(fi, "__esModule", { value: !0 });
const cE = Ur, uE = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, cE.validateTuple)(e, "items")
};
fi.default = uE;
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const kc = ne, lE = F, dE = ae, fE = Fr, hE = {
  message: ({ params: { len: e } }) => (0, kc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, kc._)`{limit: ${e}}`
}, pE = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: hE,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, lE.alwaysValidSchema)(n, t) && (s ? (0, fE.validateAdditionalItems)(e, s) : e.ok((0, dE.validateArray)(e)));
  }
};
hi.default = pE;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const qe = ne, Tn = F, mE = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe.str)`must contain at least ${e} valid item(s)` : (0, qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe._)`{minContains: ${e}}` : (0, qe._)`{minContains: ${e}, maxContains: ${t}}`
}, yE = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: mE,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: u, maxContains: d } = n;
    a.opts.next ? (o = u === void 0 ? 1 : u, c = d) : o = 1;
    const l = t.const("len", (0, qe._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, Tn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, Tn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Tn.alwaysValidSchema)(a, r)) {
      let g = (0, qe._)`${l} >= ${o}`;
      c !== void 0 && (g = (0, qe._)`${g} && ${l} <= ${c}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? $(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, qe._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), _ = t.let("count", 0);
      $(g, () => t.if(g, () => v(_)));
    }
    function $(g, _) {
      t.forRange("i", 0, l, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: Tn.Type.Num,
          compositeRule: !0
        }, g), _();
      });
    }
    function v(g) {
      t.code((0, qe._)`${g}++`), c === void 0 ? t.if((0, qe._)`${g} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, qe._)`${g} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, qe._)`${g} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
pi.default = yE;
var _d = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ne, r = F, n = ae;
  e.error = {
    message: ({ params: { property: u, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${u} is present`;
    },
    params: ({ params: { property: u, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${u},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(u) {
      const [d, l] = a(u);
      o(u, d), c(u, l);
    }
  };
  function a({ schema: u }) {
    const d = {}, l = {};
    for (const h in u) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(u[h]) ? d : l;
      E[h] = u[h];
    }
    return [d, l];
  }
  function o(u, d = u.schema) {
    const { gen: l, data: h, it: E } = u;
    if (Object.keys(d).length === 0)
      return;
    const $ = l.let("missing");
    for (const v in d) {
      const g = d[v];
      if (g.length === 0)
        continue;
      const _ = (0, n.propertyInData)(l, h, v, E.opts.ownProperties);
      u.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? l.if(_, () => {
        for (const p of g)
          (0, n.checkReportMissingProp)(u, p);
      }) : (l.if((0, t._)`${_} && (${(0, n.checkMissingProp)(u, g, $)})`), (0, n.reportMissingProp)(u, $), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(u, d = u.schema) {
    const { gen: l, data: h, keyword: E, it: $ } = u, v = l.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)($, d[g]) || (l.if(
        (0, n.propertyInData)(l, h, g, $.opts.ownProperties),
        () => {
          const _ = u.subschema({ keyword: E, schemaProp: g }, v);
          u.mergeValidEvaluated(_, v);
        },
        () => l.var(v, !0)
        // TODO var
      ), u.ok(v));
  }
  e.validateSchemaDeps = c, e.default = s;
})(_d);
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const gd = ne, $E = F, _E = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, gd._)`{propertyName: ${e.propertyName}}`
}, gE = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: _E,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, $E.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, gd.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
mi.default = gE;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const In = ae, Je = ne, vE = dt, jn = F, EE = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Je._)`{additionalProperty: ${e.additionalProperty}}`
}, wE = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: EE,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: u } = o;
    if (o.props = !0, u.removeAdditional !== "all" && (0, jn.alwaysValidSchema)(o, r))
      return;
    const d = (0, In.allSchemaProperties)(n.properties), l = (0, In.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Je._)`${a} === ${vE.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !d.length && !l.length ? v(_) : t.if(E(_), () => v(_));
      });
    }
    function E(_) {
      let p;
      if (d.length > 8) {
        const w = (0, jn.schemaRefOrVal)(o, n.properties, "properties");
        p = (0, In.isOwnProperty)(t, w, _);
      } else d.length ? p = (0, Je.or)(...d.map((w) => (0, Je._)`${_} === ${w}`)) : p = Je.nil;
      return l.length && (p = (0, Je.or)(p, ...l.map((w) => (0, Je._)`${(0, In.usePattern)(e, w)}.test(${_})`))), (0, Je.not)(p);
    }
    function $(_) {
      t.code((0, Je._)`delete ${s}[${_}]`);
    }
    function v(_) {
      if (u.removeAdditional === "all" || u.removeAdditional && r === !1) {
        $(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, jn.alwaysValidSchema)(o, r)) {
        const p = t.name("valid");
        u.removeAdditional === "failing" ? (g(_, p, !1), t.if((0, Je.not)(p), () => {
          e.reset(), $(_);
        })) : (g(_, p), c || t.if((0, Je.not)(p), () => t.break()));
      }
    }
    function g(_, p, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: jn.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
vs.default = wE;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const bE = Qe, Cc = ae, Bs = F, Dc = vs, SE = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Dc.default.code(new bE.KeywordCxt(a, Dc.default, "additionalProperties"));
    const o = (0, Cc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Bs.mergeEvaluated.props(t, (0, Bs.toHash)(o), a.props));
    const c = o.filter((h) => !(0, Bs.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const u = t.name("valid");
    for (const h of c)
      d(h) ? l(h) : (t.if((0, Cc.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(u, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(u);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, u);
    }
  }
};
yi.default = SE;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const Mc = ae, An = ne, Lc = F, Vc = F, PE = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, Mc.allSchemaProperties)(r), u = c.filter((g) => (0, Lc.alwaysValidSchema)(a, r[g]));
    if (c.length === 0 || u.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof An.Name) && (a.props = (0, Vc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const g of c)
        d && $(g), a.allErrors ? v(g) : (t.var(l, !0), v(g), t.if(l));
    }
    function $(g) {
      for (const _ in d)
        new RegExp(g).test(_) && (0, Lc.checkStrictMode)(a, `property ${_} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, (_) => {
        t.if((0, An._)`${(0, Mc.usePattern)(e, g)}.test(${_})`, () => {
          const p = u.includes(g);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: _,
            dataPropType: Vc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, An._)`${h}[${_}]`, !0) : !p && !a.allErrors && t.if((0, An.not)(l), () => t.break());
        });
      });
    }
  }
};
$i.default = PE;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const NE = F, RE = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, NE.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
_i.default = RE;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const OE = ae, TE = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: OE.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
gi.default = TE;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Yn = ne, IE = F, jE = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Yn._)`{passingSchemas: ${e.passing}}`
}, AE = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: jE,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), u = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let E;
        (0, IE.alwaysValidSchema)(s, l) ? t.var(u, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, u), h > 0 && t.if((0, Yn._)`${u} && ${o}`).assign(o, !1).assign(c, (0, Yn._)`[${c}, ${h}]`).else(), t.if(u, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, Yn.Name);
        });
      });
    }
  }
};
vi.default = AE;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const kE = F, CE = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, kE.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
Ei.default = CE;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const is = ne, vd = F, DE = {
  message: ({ params: e }) => (0, is.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, is._)`{failingKeyword: ${e.ifClause}}`
}, ME = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: DE,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, vd.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Fc(n, "then"), a = Fc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (u(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(c, d("then", l), d("else", l));
    } else s ? t.if(c, d("then")) : t.if((0, is.not)(c), d("else"));
    e.pass(o, () => e.error(!0));
    function u() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const E = e.subschema({ keyword: l }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, is._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Fc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, vd.alwaysValidSchema)(e, r);
}
wi.default = ME;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const LE = F, VE = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, LE.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
bi.default = VE;
Object.defineProperty(di, "__esModule", { value: !0 });
const FE = Fr, UE = fi, zE = Ur, GE = hi, qE = pi, KE = _d, HE = mi, BE = vs, WE = yi, XE = $i, JE = _i, YE = gi, xE = vi, ZE = Ei, QE = wi, ew = bi;
function tw(e = !1) {
  const t = [
    // any
    JE.default,
    YE.default,
    xE.default,
    ZE.default,
    QE.default,
    ew.default,
    // object
    HE.default,
    BE.default,
    KE.default,
    WE.default,
    XE.default
  ];
  return e ? t.push(UE.default, GE.default) : t.push(FE.default, zE.default), t.push(qE.default), t;
}
di.default = tw;
var Si = {}, Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const me = ne, rw = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, nw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: rw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: u, errSchemaPath: d, schemaEnv: l, self: h } = c;
    if (!u.validateFormats)
      return;
    s ? E() : $();
    function E() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: u.code.formats
      }), g = r.const("fDef", (0, me._)`${v}[${o}]`), _ = r.let("fType"), p = r.let("format");
      r.if((0, me._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(_, (0, me._)`${g}.type || "string"`).assign(p, (0, me._)`${g}.validate`), () => r.assign(_, (0, me._)`"string"`).assign(p, g)), e.fail$data((0, me.or)(w(), N()));
      function w() {
        return u.strictSchema === !1 ? me.nil : (0, me._)`${o} && !${p}`;
      }
      function N() {
        const T = l.$async ? (0, me._)`(${g}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, me._)`${p}(${n})`, I = (0, me._)`(typeof ${p} == "function" ? ${T} : ${p}.test(${n}))`;
        return (0, me._)`${p} && ${p} !== true && ${_} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[a];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [g, _, p] = N(v);
      g === t && e.pass(T());
      function w() {
        if (u.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(I) {
        const G = I instanceof RegExp ? (0, me.regexpCode)(I) : u.code.formats ? (0, me._)`${u.code.formats}${(0, me.getProperty)(a)}` : void 0, W = r.scopeValue("formats", { key: a, ref: I, code: G });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, me._)`${W}.validate`] : ["string", I, W];
      }
      function T() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${p}(${n})`;
        }
        return typeof _ == "function" ? (0, me._)`${p}(${n})` : (0, me._)`${p}.test(${n})`;
      }
    }
  }
};
Pi.default = nw;
Object.defineProperty(Si, "__esModule", { value: !0 });
const sw = Pi, aw = [sw.default];
Si.default = aw;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.contentVocabulary = Ar.metadataVocabulary = void 0;
Ar.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ar.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Yo, "__esModule", { value: !0 });
const ow = xo, iw = Qo, cw = di, uw = Si, Uc = Ar, lw = [
  ow.default,
  iw.default,
  (0, cw.default)(),
  uw.default,
  Uc.metadataVocabulary,
  Uc.contentVocabulary
];
Yo.default = lw;
var Ni = {}, Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.DiscrError = void 0;
var zc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(zc || (Es.DiscrError = zc = {}));
Object.defineProperty(Ni, "__esModule", { value: !0 });
const gr = ne, Oa = Es, Gc = Ve, dw = Vr, fw = F, hw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Oa.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, gr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, pw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: hw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const u = t.let("valid", !1), d = t.const("tag", (0, gr._)`${r}${(0, gr.getProperty)(c)}`);
    t.if((0, gr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: Oa.DiscrError.Tag, tag: d, tagName: c })), e.ok(u);
    function l() {
      const $ = E();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, gr._)`${d} === ${v}`), t.assign(u, h($[v]));
      t.else(), e.error(!1, { discrError: Oa.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(g, gr.Name), v;
    }
    function E() {
      var $;
      const v = {}, g = p(s);
      let _ = !0;
      for (let T = 0; T < o.length; T++) {
        let I = o[T];
        if (I != null && I.$ref && !(0, fw.schemaHasRulesButRef)(I, a.self.RULES)) {
          const W = I.$ref;
          if (I = Gc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, W), I instanceof Gc.SchemaEnv && (I = I.schema), I === void 0)
            throw new dw.default(a.opts.uriResolver, a.baseId, W);
        }
        const G = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[c];
        if (typeof G != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        _ = _ && (g || p(I)), w(G, T);
      }
      if (!_)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function p({ required: T }) {
        return Array.isArray(T) && T.includes(c);
      }
      function w(T, I) {
        if (T.const)
          N(T.const, I);
        else if (T.enum)
          for (const G of T.enum)
            N(G, I);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function N(T, I) {
        if (typeof T != "string" || T in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[T] = I;
      }
    }
  }
};
Ni.default = pw;
const mw = "http://json-schema.org/draft-07/schema#", yw = "http://json-schema.org/draft-07/schema#", $w = "Core schema meta-schema", _w = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
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
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, gw = [
  "object",
  "boolean"
], vw = {
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
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
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
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
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
    propertyNames: {
      format: "regex"
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
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
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
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Ew = {
  $schema: mw,
  $id: yw,
  title: $w,
  definitions: _w,
  type: gw,
  properties: vw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Cl, n = Yo, s = Ni, a = Ew, o = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class u extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(v, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = u, e.exports = t = u, e.exports.Ajv = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
  var d = Qe;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = ne;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = yn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Vr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(Ea, Ea.exports);
var ww = Ea.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = ww, r = ne, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: c, schemaCode: u }) => (0, r.str)`should be ${s[c].okStr} ${u}`,
    params: ({ keyword: c, schemaCode: u }) => (0, r._)`{comparison: ${s[c].okStr}, limit: ${u}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(c) {
      const { gen: u, data: d, schemaCode: l, keyword: h, it: E } = c, { opts: $, self: v } = E;
      if (!$.validateFormats)
        return;
      const g = new t.KeywordCxt(E, v.RULES.all.format.definition, "format");
      g.$data ? _() : p();
      function _() {
        const N = u.scopeValue("formats", {
          ref: v.formats,
          code: $.code.formats
        }), T = u.const("fmt", (0, r._)`${N}[${g.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${T} != "object"`, (0, r._)`${T} instanceof RegExp`, (0, r._)`typeof ${T}.compare != "function"`, w(T)));
      }
      function p() {
        const N = g.schema, T = v.formats[N];
        if (!T || T === !0)
          return;
        if (typeof T != "object" || T instanceof RegExp || typeof T.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const I = u.scopeValue("formats", {
          key: N,
          ref: T,
          code: $.code.formats ? (0, r._)`${$.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        c.fail$data(w(I));
      }
      function w(N) {
        return (0, r._)`${N}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = o;
})(kl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Al, n = kl, s = ne, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), c = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return u(d, l, r.fullFormats, a), d;
    const [h, E] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], $ = l.formats || r.formatNames;
    return u(d, $, h, E), l.keywords && (0, n.default)(d), d;
  };
  c.get = (d, l = "full") => {
    const E = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function u(d, l, h, E) {
    var $, v;
    ($ = (v = d.opts.code).formats) !== null && $ !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const g of l)
      d.addFormat(g, h[g]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(va, va.exports);
var bw = va.exports;
const Sw = /* @__PURE__ */ Ma(bw), Pw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Nw(s, a) && n || Object.defineProperty(e, r, a);
}, Nw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Rw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Ow = (e, t) => `/* Wrapped ${e}*/
${t}`, Tw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Iw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), jw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Ow.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Iw);
  const { writable: a, enumerable: o, configurable: c } = Tw;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: c });
};
function Aw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Pw(e, t, s, r);
  return Rw(e, t), jw(e, t, n), e;
}
const qc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, c, u;
  const d = function(...l) {
    const h = this, E = () => {
      o = void 0, c && (clearTimeout(c), c = void 0), a && (u = e.apply(h, l));
    }, $ = () => {
      c = void 0, o && (clearTimeout(o), o = void 0), a && (u = e.apply(h, l));
    }, v = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout($, n)), v && (u = e.apply(h, l)), u;
  };
  return Aw(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), c && (clearTimeout(c), c = void 0);
  }, d;
};
var Ta = { exports: {} };
const kw = "2.0.0", Ed = 256, Cw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Dw = 16, Mw = Ed - 6, Lw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ws = {
  MAX_LENGTH: Ed,
  MAX_SAFE_COMPONENT_LENGTH: Dw,
  MAX_SAFE_BUILD_LENGTH: Mw,
  MAX_SAFE_INTEGER: Cw,
  RELEASE_TYPES: Lw,
  SEMVER_SPEC_VERSION: kw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Vw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var bs = Vw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = ws, a = bs;
  t = e.exports = {};
  const o = t.re = [], c = t.safeRe = [], u = t.src = [], d = t.safeSrc = [], l = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", $ = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], v = (_) => {
    for (const [p, w] of $)
      _ = _.split(`${p}*`).join(`${p}{0,${w}}`).split(`${p}+`).join(`${p}{1,${w}}`);
    return _;
  }, g = (_, p, w) => {
    const N = v(p), T = h++;
    a(_, T, p), l[_] = T, u[T] = p, d[T] = N, o[T] = new RegExp(p, w ? "g" : void 0), c[T] = new RegExp(N, w ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), g("MAINVERSION", `(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${u[l.PRERELEASEIDENTIFIER]}(?:\\.${u[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${u[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${E}+`), g("BUILD", `(?:\\+(${u[l.BUILDIDENTIFIER]}(?:\\.${u[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${u[l.MAINVERSION]}${u[l.PRERELEASE]}?${u[l.BUILD]}?`), g("FULL", `^${u[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${u[l.MAINVERSIONLOOSE]}${u[l.PRERELEASELOOSE]}?${u[l.BUILD]}?`), g("LOOSE", `^${u[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${u[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${u[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:${u[l.PRERELEASE]})?${u[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:${u[l.PRERELEASELOOSE]})?${u[l.BUILD]}?)?)?`), g("XRANGE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${u[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", u[l.COERCEPLAIN] + `(?:${u[l.PRERELEASE]})?(?:${u[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", u[l.COERCE], !0), g("COERCERTLFULL", u[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${u[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${u[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${u[l.LONECARET]}${u[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${u[l.LONECARET]}${u[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${u[l.GTLT]}\\s*(${u[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]}|${u[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${u[l.XRANGEPLAIN]})\\s+-\\s+(${u[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${u[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${u[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ta, Ta.exports);
var _n = Ta.exports;
const Fw = Object.freeze({ loose: !0 }), Uw = Object.freeze({}), zw = (e) => e ? typeof e != "object" ? Fw : e : Uw;
var Ri = zw;
const Kc = /^[0-9]+$/, wd = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Kc.test(e), n = Kc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Gw = (e, t) => wd(t, e);
var bd = {
  compareIdentifiers: wd,
  rcompareIdentifiers: Gw
};
const kn = bs, { MAX_LENGTH: Hc, MAX_SAFE_INTEGER: Cn } = ws, { safeRe: Dn, t: Mn } = _n, qw = Ri, { compareIdentifiers: Ws } = bd;
let Kw = class st {
  constructor(t, r) {
    if (r = qw(r), t instanceof st) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Hc)
      throw new TypeError(
        `version is longer than ${Hc} characters`
      );
    kn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Dn[Mn.LOOSE] : Dn[Mn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Cn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Cn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Cn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Cn)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (kn("SemVer.compare", this.version, this.options, t), !(t instanceof st)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new st(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof st || (t = new st(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof st || (t = new st(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (kn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ws(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof st || (t = new st(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (kn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ws(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Dn[Mn.PRERELEASELOOSE] : Dn[Mn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), Ws(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = Kw;
const Bc = ke, Hw = (e, t, r = !1) => {
  if (e instanceof Bc)
    return e;
  try {
    return new Bc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var zr = Hw;
const Bw = zr, Ww = (e, t) => {
  const r = Bw(e, t);
  return r ? r.version : null;
};
var Xw = Ww;
const Jw = zr, Yw = (e, t) => {
  const r = Jw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var xw = Yw;
const Wc = ke, Zw = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Wc(
      e instanceof Wc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Qw = Zw;
const Xc = zr, eb = (e, t) => {
  const r = Xc(e, null, !0), n = Xc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, c = a ? n : r, u = !!o.prerelease.length;
  if (!!c.prerelease.length && !u) {
    if (!c.patch && !c.minor)
      return "major";
    if (c.compareMain(o) === 0)
      return c.minor && !c.patch ? "minor" : "patch";
  }
  const l = u ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var tb = eb;
const rb = ke, nb = (e, t) => new rb(e, t).major;
var sb = nb;
const ab = ke, ob = (e, t) => new ab(e, t).minor;
var ib = ob;
const cb = ke, ub = (e, t) => new cb(e, t).patch;
var lb = ub;
const db = zr, fb = (e, t) => {
  const r = db(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var hb = fb;
const Jc = ke, pb = (e, t, r) => new Jc(e, r).compare(new Jc(t, r));
var et = pb;
const mb = et, yb = (e, t, r) => mb(t, e, r);
var $b = yb;
const _b = et, gb = (e, t) => _b(e, t, !0);
var vb = gb;
const Yc = ke, Eb = (e, t, r) => {
  const n = new Yc(e, r), s = new Yc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Oi = Eb;
const wb = Oi, bb = (e, t) => e.sort((r, n) => wb(r, n, t));
var Sb = bb;
const Pb = Oi, Nb = (e, t) => e.sort((r, n) => Pb(n, r, t));
var Rb = Nb;
const Ob = et, Tb = (e, t, r) => Ob(e, t, r) > 0;
var Ss = Tb;
const Ib = et, jb = (e, t, r) => Ib(e, t, r) < 0;
var Ti = jb;
const Ab = et, kb = (e, t, r) => Ab(e, t, r) === 0;
var Sd = kb;
const Cb = et, Db = (e, t, r) => Cb(e, t, r) !== 0;
var Pd = Db;
const Mb = et, Lb = (e, t, r) => Mb(e, t, r) >= 0;
var Ii = Lb;
const Vb = et, Fb = (e, t, r) => Vb(e, t, r) <= 0;
var ji = Fb;
const Ub = Sd, zb = Pd, Gb = Ss, qb = Ii, Kb = Ti, Hb = ji, Bb = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Ub(e, r, n);
    case "!=":
      return zb(e, r, n);
    case ">":
      return Gb(e, r, n);
    case ">=":
      return qb(e, r, n);
    case "<":
      return Kb(e, r, n);
    case "<=":
      return Hb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Nd = Bb;
const Wb = ke, Xb = zr, { safeRe: Ln, t: Vn } = _n, Jb = (e, t) => {
  if (e instanceof Wb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ln[Vn.COERCEFULL] : Ln[Vn.COERCE]);
  else {
    const u = t.includePrerelease ? Ln[Vn.COERCERTLFULL] : Ln[Vn.COERCERTL];
    let d;
    for (; (d = u.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), u.lastIndex = d.index + d[1].length + d[2].length;
    u.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Xb(`${n}.${s}.${a}${o}${c}`, t);
};
var Yb = Jb;
class xb {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var Zb = xb, Xs, xc;
function tt() {
  if (xc) return Xs;
  xc = 1;
  const e = /\s+/g;
  class t {
    constructor(O, k) {
      if (k = s(k), O instanceof t)
        return O.loose === !!k.loose && O.includePrerelease === !!k.includePrerelease ? O : new t(O.raw, k);
      if (O instanceof a)
        return this.raw = O.value, this.set = [[O]], this.formatted = void 0, this;
      if (this.options = k, this.loose = !!k.loose, this.includePrerelease = !!k.includePrerelease, this.raw = O.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((M) => !g(M[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const M of this.set)
            if (M.length === 1 && _(M[0])) {
              this.set = [M];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let O = 0; O < this.set.length; O++) {
          O > 0 && (this.formatted += "||");
          const k = this.set[O];
          for (let D = 0; D < k.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += k[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(O) {
      const D = ((this.options.includePrerelease && $) | (this.options.loose && v)) + ":" + O, M = n.get(D);
      if (M)
        return M;
      const C = this.options.loose, P = C ? u[d.HYPHENRANGELOOSE] : u[d.HYPHENRANGE];
      O = O.replace(P, L(this.options.includePrerelease)), o("hyphen replace", O), O = O.replace(u[d.COMPARATORTRIM], l), o("comparator trim", O), O = O.replace(u[d.TILDETRIM], h), o("tilde trim", O), O = O.replace(u[d.CARETTRIM], E), o("caret trim", O);
      let m = O.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => q(f, this.options));
      C && (m = m.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(u[d.COMPARATORLOOSE])))), o("range list", m);
      const b = /* @__PURE__ */ new Map(), y = m.map((f) => new a(f, this.options));
      for (const f of y) {
        if (g(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const i = [...b.values()];
      return n.set(D, i), i;
    }
    intersects(O, k) {
      if (!(O instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => p(D, k) && O.set.some((M) => p(M, k) && D.every((C) => M.every((P) => C.intersects(P, k)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(O) {
      if (!O)
        return !1;
      if (typeof O == "string")
        try {
          O = new c(O, this.options);
        } catch {
          return !1;
        }
      for (let k = 0; k < this.set.length; k++)
        if (K(this.set[k], O, this.options))
          return !0;
      return !1;
    }
  }
  Xs = t;
  const r = Zb, n = new r(), s = Ri, a = Ps(), o = bs, c = ke, {
    safeRe: u,
    t: d,
    comparatorTrimReplace: l,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = _n, { FLAG_INCLUDE_PRERELEASE: $, FLAG_LOOSE: v } = ws, g = (R) => R.value === "<0.0.0-0", _ = (R) => R.value === "", p = (R, O) => {
    let k = !0;
    const D = R.slice();
    let M = D.pop();
    for (; k && D.length; )
      k = D.every((C) => M.intersects(C, O)), M = D.pop();
    return k;
  }, w = (R, O) => (R = R.replace(u[d.BUILD], ""), o("comp", R, O), R = G(R, O), o("caret", R), R = T(R, O), o("tildes", R), R = le(R, O), o("xrange", R), R = ie(R, O), o("stars", R), R), N = (R) => !R || R.toLowerCase() === "x" || R === "*", T = (R, O) => R.trim().split(/\s+/).map((k) => I(k, O)).join(" "), I = (R, O) => {
    const k = O.loose ? u[d.TILDELOOSE] : u[d.TILDE];
    return R.replace(k, (D, M, C, P, m) => {
      o("tilde", R, D, M, C, P, m);
      let b;
      return N(M) ? b = "" : N(C) ? b = `>=${M}.0.0 <${+M + 1}.0.0-0` : N(P) ? b = `>=${M}.${C}.0 <${M}.${+C + 1}.0-0` : m ? (o("replaceTilde pr", m), b = `>=${M}.${C}.${P}-${m} <${M}.${+C + 1}.0-0`) : b = `>=${M}.${C}.${P} <${M}.${+C + 1}.0-0`, o("tilde return", b), b;
    });
  }, G = (R, O) => R.trim().split(/\s+/).map((k) => W(k, O)).join(" "), W = (R, O) => {
    o("caret", R, O);
    const k = O.loose ? u[d.CARETLOOSE] : u[d.CARET], D = O.includePrerelease ? "-0" : "";
    return R.replace(k, (M, C, P, m, b) => {
      o("caret", R, M, C, P, m, b);
      let y;
      return N(C) ? y = "" : N(P) ? y = `>=${C}.0.0${D} <${+C + 1}.0.0-0` : N(m) ? C === "0" ? y = `>=${C}.${P}.0${D} <${C}.${+P + 1}.0-0` : y = `>=${C}.${P}.0${D} <${+C + 1}.0.0-0` : b ? (o("replaceCaret pr", b), C === "0" ? P === "0" ? y = `>=${C}.${P}.${m}-${b} <${C}.${P}.${+m + 1}-0` : y = `>=${C}.${P}.${m}-${b} <${C}.${+P + 1}.0-0` : y = `>=${C}.${P}.${m}-${b} <${+C + 1}.0.0-0`) : (o("no pr"), C === "0" ? P === "0" ? y = `>=${C}.${P}.${m}${D} <${C}.${P}.${+m + 1}-0` : y = `>=${C}.${P}.${m}${D} <${C}.${+P + 1}.0-0` : y = `>=${C}.${P}.${m} <${+C + 1}.0.0-0`), o("caret return", y), y;
    });
  }, le = (R, O) => (o("replaceXRanges", R, O), R.split(/\s+/).map((k) => oe(k, O)).join(" ")), oe = (R, O) => {
    R = R.trim();
    const k = O.loose ? u[d.XRANGELOOSE] : u[d.XRANGE];
    return R.replace(k, (D, M, C, P, m, b) => {
      o("xRange", R, D, M, C, P, m, b);
      const y = N(C), i = y || N(P), f = i || N(m), S = f;
      return M === "=" && S && (M = ""), b = O.includePrerelease ? "-0" : "", y ? M === ">" || M === "<" ? D = "<0.0.0-0" : D = "*" : M && S ? (i && (P = 0), m = 0, M === ">" ? (M = ">=", i ? (C = +C + 1, P = 0, m = 0) : (P = +P + 1, m = 0)) : M === "<=" && (M = "<", i ? C = +C + 1 : P = +P + 1), M === "<" && (b = "-0"), D = `${M + C}.${P}.${m}${b}`) : i ? D = `>=${C}.0.0${b} <${+C + 1}.0.0-0` : f && (D = `>=${C}.${P}.0${b} <${C}.${+P + 1}.0-0`), o("xRange return", D), D;
    });
  }, ie = (R, O) => (o("replaceStars", R, O), R.trim().replace(u[d.STAR], "")), q = (R, O) => (o("replaceGTE0", R, O), R.trim().replace(u[O.includePrerelease ? d.GTE0PRE : d.GTE0], "")), L = (R) => (O, k, D, M, C, P, m, b, y, i, f, S) => (N(D) ? k = "" : N(M) ? k = `>=${D}.0.0${R ? "-0" : ""}` : N(C) ? k = `>=${D}.${M}.0${R ? "-0" : ""}` : P ? k = `>=${k}` : k = `>=${k}${R ? "-0" : ""}`, N(y) ? b = "" : N(i) ? b = `<${+y + 1}.0.0-0` : N(f) ? b = `<${y}.${+i + 1}.0-0` : S ? b = `<=${y}.${i}.${f}-${S}` : R ? b = `<${y}.${i}.${+f + 1}-0` : b = `<=${b}`, `${k} ${b}`.trim()), K = (R, O, k) => {
    for (let D = 0; D < R.length; D++)
      if (!R[D].test(O))
        return !1;
    if (O.prerelease.length && !k.includePrerelease) {
      for (let D = 0; D < R.length; D++)
        if (o(R[D].semver), R[D].semver !== a.ANY && R[D].semver.prerelease.length > 0) {
          const M = R[D].semver;
          if (M.major === O.major && M.minor === O.minor && M.patch === O.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Xs;
}
var Js, Zc;
function Ps() {
  if (Zc) return Js;
  Zc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, h) {
      if (h = r(h), l instanceof t) {
        if (l.loose === !!h.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, h), this.options = h, this.loose = !!h.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = l.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new c(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new c(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, h) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new u(l.value, h).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new u(this.value, h).test(l.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, h) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, h) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Js = t;
  const r = Ri, { safeRe: n, t: s } = _n, a = Nd, o = bs, c = ke, u = tt();
  return Js;
}
const Qb = tt(), eS = (e, t, r) => {
  try {
    t = new Qb(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ns = eS;
const tS = tt(), rS = (e, t) => new tS(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var nS = rS;
const sS = ke, aS = tt(), oS = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new aS(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new sS(n, r));
  }), n;
};
var iS = oS;
const cS = ke, uS = tt(), lS = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new uS(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new cS(n, r));
  }), n;
};
var dS = lS;
const Ys = ke, fS = tt(), Qc = Ss, hS = (e, t) => {
  e = new fS(e, t);
  let r = new Ys("0.0.0");
  if (e.test(r) || (r = new Ys("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const c = new Ys(o.semver.version);
      switch (o.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!a || Qc(c, a)) && (a = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Qc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var pS = hS;
const mS = tt(), yS = (e, t) => {
  try {
    return new mS(e, t).range || "*";
  } catch {
    return null;
  }
};
var $S = yS;
const _S = ke, Rd = Ps(), { ANY: gS } = Rd, vS = tt(), ES = Ns, eu = Ss, tu = Ti, wS = ji, bS = Ii, SS = (e, t, r, n) => {
  e = new _S(e, n), t = new vS(t, n);
  let s, a, o, c, u;
  switch (r) {
    case ">":
      s = eu, a = wS, o = tu, c = ">", u = ">=";
      break;
    case "<":
      s = tu, a = bS, o = eu, c = "<", u = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (ES(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const l = t.set[d];
    let h = null, E = null;
    if (l.forEach(($) => {
      $.semver === gS && ($ = new Rd(">=0.0.0")), h = h || $, E = E || $, s($.semver, h.semver, n) ? h = $ : o($.semver, E.semver, n) && (E = $);
    }), h.operator === c || h.operator === u || (!E.operator || E.operator === c) && a(e, E.semver))
      return !1;
    if (E.operator === u && o(e, E.semver))
      return !1;
  }
  return !0;
};
var Ai = SS;
const PS = Ai, NS = (e, t, r) => PS(e, t, ">", r);
var RS = NS;
const OS = Ai, TS = (e, t, r) => OS(e, t, "<", r);
var IS = TS;
const ru = tt(), jS = (e, t, r) => (e = new ru(e, r), t = new ru(t, r), e.intersects(t, r));
var AS = jS;
const kS = Ns, CS = et;
var DS = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((l, h) => CS(l, h, r));
  for (const l of o)
    kS(l, t, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const c = [];
  for (const [l, h] of n)
    l === h ? c.push(l) : !h && l === o[0] ? c.push("*") : h ? l === o[0] ? c.push(`<=${h}`) : c.push(`${l} - ${h}`) : c.push(`>=${l}`);
  const u = c.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return u.length < d.length ? u : t;
};
const nu = tt(), ki = Ps(), { ANY: xs } = ki, Yr = Ns, Ci = et, MS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new nu(e, r), t = new nu(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = VS(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, LS = [new ki(">=0.0.0-0")], su = [new ki(">=0.0.0")], VS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === xs) {
    if (t.length === 1 && t[0].semver === xs)
      return !0;
    r.includePrerelease ? e = LS : e = su;
  }
  if (t.length === 1 && t[0].semver === xs) {
    if (r.includePrerelease)
      return !0;
    t = su;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of e)
    $.operator === ">" || $.operator === ">=" ? s = au(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = ou(a, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Ci(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const $ of n) {
    if (s && !Yr($, String(s), r) || a && !Yr($, String(a), r))
      return null;
    for (const v of t)
      if (!Yr($, String(v), r))
        return !1;
    return !0;
  }
  let c, u, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const $ of t) {
    if (l = l || $.operator === ">" || $.operator === ">=", d = d || $.operator === "<" || $.operator === "<=", s) {
      if (E && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === E.major && $.semver.minor === E.minor && $.semver.patch === E.patch && (E = !1), $.operator === ">" || $.operator === ">=") {
        if (c = au(s, $, r), c === $ && c !== s)
          return !1;
      } else if (s.operator === ">=" && !Yr(s.semver, String($), r))
        return !1;
    }
    if (a) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (u = ou(a, $, r), u === $ && u !== a)
          return !1;
      } else if (a.operator === "<=" && !Yr(a.semver, String($), r))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || E || h);
}, au = (e, t, r) => {
  if (!e)
    return t;
  const n = Ci(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ou = (e, t, r) => {
  if (!e)
    return t;
  const n = Ci(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var FS = MS;
const Zs = _n, iu = ws, US = ke, cu = bd, zS = zr, GS = Xw, qS = xw, KS = Qw, HS = tb, BS = sb, WS = ib, XS = lb, JS = hb, YS = et, xS = $b, ZS = vb, QS = Oi, eP = Sb, tP = Rb, rP = Ss, nP = Ti, sP = Sd, aP = Pd, oP = Ii, iP = ji, cP = Nd, uP = Yb, lP = Ps(), dP = tt(), fP = Ns, hP = nS, pP = iS, mP = dS, yP = pS, $P = $S, _P = Ai, gP = RS, vP = IS, EP = AS, wP = DS, bP = FS;
var SP = {
  parse: zS,
  valid: GS,
  clean: qS,
  inc: KS,
  diff: HS,
  major: BS,
  minor: WS,
  patch: XS,
  prerelease: JS,
  compare: YS,
  rcompare: xS,
  compareLoose: ZS,
  compareBuild: QS,
  sort: eP,
  rsort: tP,
  gt: rP,
  lt: nP,
  eq: sP,
  neq: aP,
  gte: oP,
  lte: iP,
  cmp: cP,
  coerce: uP,
  Comparator: lP,
  Range: dP,
  satisfies: fP,
  toComparators: hP,
  maxSatisfying: pP,
  minSatisfying: mP,
  minVersion: yP,
  validRange: $P,
  outside: _P,
  gtr: gP,
  ltr: vP,
  intersects: EP,
  simplifyRange: wP,
  subset: bP,
  SemVer: US,
  re: Zs.re,
  src: Zs.src,
  tokens: Zs.t,
  SEMVER_SPEC_VERSION: iu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: iu.RELEASE_TYPES,
  compareIdentifiers: cu.compareIdentifiers,
  rcompareIdentifiers: cu.rcompareIdentifiers
};
const $r = /* @__PURE__ */ Ma(SP), PP = Object.prototype.toString, NP = "[object Uint8Array]", RP = "[object ArrayBuffer]";
function Od(e, t, r) {
  return e ? e.constructor === t ? !0 : PP.call(e) === r : !1;
}
function Td(e) {
  return Od(e, Uint8Array, NP);
}
function OP(e) {
  return Od(e, ArrayBuffer, RP);
}
function TP(e) {
  return Td(e) || OP(e);
}
function IP(e) {
  if (!Td(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function jP(e) {
  if (!TP(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Qs(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    IP(s), r.set(s, n), n += s.length;
  return r;
}
const Fn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Un(e, t = "utf8") {
  return jP(e), Fn[t] ?? (Fn[t] = new globalThis.TextDecoder(t)), Fn[t].decode(e);
}
function AP(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const kP = new globalThis.TextEncoder();
function ea(e) {
  return AP(e), kP.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const uu = "aes-256-cbc", Id = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), CP = (e) => typeof e == "string" && Id.has(e), pt = () => /* @__PURE__ */ Object.create(null), lu = (e) => e !== void 0, ta = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Tt = "__internal__", ra = `${Tt}.migrations.version`;
var At, kt, or, De, ze, ir, cr, Or, at, ge, jd, Ad, kd, Cd, Dd, Md, Ld, Vd;
class DP {
  constructor(t = {}) {
    He(this, ge);
    Kr(this, "path");
    Kr(this, "events");
    He(this, At);
    He(this, kt);
    He(this, or);
    He(this, De);
    He(this, ze, {});
    He(this, ir, !1);
    He(this, cr);
    He(this, Or);
    He(this, at);
    Kr(this, "_deserialize", (t) => JSON.parse(t));
    Kr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = ft(this, ge, jd).call(this, t);
    Ce(this, De, r), ft(this, ge, Ad).call(this, r), ft(this, ge, Cd).call(this, r), ft(this, ge, Dd).call(this, r), this.events = new EventTarget(), Ce(this, kt, r.encryptionKey), Ce(this, or, r.encryptionAlgorithm ?? uu), this.path = ft(this, ge, Md).call(this, r), ft(this, ge, Ld).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (x(this, De).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Tt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (ta(a, o), x(this, De).accessPropertiesByDotNotation)
        vn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, c] of Object.entries(a))
        s(o, c);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return x(this, De).accessPropertiesByDotNotation ? js(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    ta(t, r);
    const n = x(this, De).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      lu(x(this, ze)[r]) && this.set(r, x(this, ze)[r]);
  }
  delete(t) {
    const { store: r } = this;
    x(this, De).accessPropertiesByDotNotation ? nf(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = pt();
    for (const r of Object.keys(x(this, ze)))
      lu(x(this, ze)[r]) && (ta(r, x(this, ze)[r]), x(this, De).accessPropertiesByDotNotation ? vn(t, r, x(this, ze)[r]) : t[r] = x(this, ze)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = Z.readFileSync(this.path, x(this, kt) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return x(this, ir) || this._validate(o), Object.assign(pt(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), pt();
      if (x(this, De).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return pt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !js(t, Tt))
      try {
        const r = Z.readFileSync(this.path, x(this, kt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        js(s, Tt) && vn(t, Tt, Vi(s, Tt));
      } catch {
      }
    x(this, ir) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    x(this, cr) && (x(this, cr).close(), Ce(this, cr, void 0)), x(this, Or) && (Z.unwatchFile(this.path), Ce(this, Or, !1)), Ce(this, at, void 0);
  }
  _decryptData(t) {
    const r = x(this, kt);
    if (!r)
      return typeof t == "string" ? t : Un(t);
    const n = x(this, or), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Un(t);
      throw new Error("Failed to decrypt config data.");
    }
    const u = ($) => {
      if (s === 0)
        return { ciphertext: $ };
      const v = $.length - s;
      if (v < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: $.slice(0, v),
        authenticationTag: $.slice(v)
      };
    }, d = t.slice(0, 16), l = t.slice(17), h = typeof l == "string" ? ea(l) : l, E = ($) => {
      const { ciphertext: v, authenticationTag: g } = u(h), _ = Hr.pbkdf2Sync(r, $, 1e4, 32, "sha512"), p = Hr.createDecipheriv(n, _, d);
      return g && p.setAuthTag(g), Un(Qs([p.update(v), p.final()]));
    };
    try {
      return E(d);
    } catch {
      try {
        return E(d.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : Un(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Mi(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Mi(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!x(this, At) || x(this, At).call(this, t) || !x(this, At).errors)
      return;
    const n = x(this, At).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Z.mkdirSync(re.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = x(this, kt);
    if (n) {
      const s = Hr.randomBytes(16), a = Hr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = Hr.createCipheriv(x(this, or), a, s), c = Qs([o.update(ea(r)), o.final()]), u = [s, ea(":"), c];
      x(this, or) === "aes-256-gcm" && u.push(o.getAuthTag()), r = Qs(u);
    }
    if (he.env.SNAP)
      Z.writeFileSync(this.path, r, { mode: x(this, De).configFileMode });
    else
      try {
        Au(this.path, r, { mode: x(this, De).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          Z.writeFileSync(this.path, r, { mode: x(this, De).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Z.existsSync(this.path) || this._write(pt()), he.platform === "win32" || he.platform === "darwin") {
      x(this, at) ?? Ce(this, at, qc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = re.dirname(this.path), r = re.basename(this.path);
      Ce(this, cr, Z.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof x(this, at) == "function" && x(this, at).call(this);
      }));
    } else
      x(this, at) ?? Ce(this, at, qc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Z.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof x(this, at) == "function" && x(this, at).call(this);
      }), Ce(this, Or, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(ra, "0.0.0");
    const a = Object.keys(t).filter((c) => this._shouldPerformMigration(c, s, r));
    let o = structuredClone(this.store);
    for (const c of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: c,
          finalVersion: r,
          versions: a
        });
        const u = t[c];
        u == null || u(this), this._set(ra, c), s = c, o = structuredClone(this.store);
      } catch (u) {
        this.store = o;
        const d = u instanceof Error ? u.message : String(u);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !$r.eq(s, r)) && this._set(ra, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Tt || t.startsWith(`${Tt}.`);
  }
  _isVersionInRangeFormat(t) {
    return $r.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && $r.satisfies(r, t) ? !1 : $r.satisfies(n, t) : !($r.lte(t, r) || $r.gt(t, n));
  }
  _get(t, r) {
    return Vi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    vn(n, t, r), this.store = n;
  }
}
At = new WeakMap(), kt = new WeakMap(), or = new WeakMap(), De = new WeakMap(), ze = new WeakMap(), ir = new WeakMap(), cr = new WeakMap(), Or = new WeakMap(), at = new WeakMap(), ge = new WeakSet(), jd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = uu), !CP(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Id].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = cf(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Ad = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = Sw.default, n = new lg.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const s = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  Ce(this, At, n.compile(s)), ft(this, ge, kd).call(this, t.schema);
}, kd = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (x(this, ze)[n] = a);
  }
}, Cd = function(t) {
  t.defaults && Object.assign(x(this, ze), t.defaults);
}, Dd = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Md = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return re.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, Ld = function(t) {
  if (t.migrations) {
    ft(this, ge, Vd).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(pt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Li.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, Vd = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ce(this, ir, !0);
    try {
      const s = this.store, a = Object.assign(pt(), t.defaults ?? {}, s);
      try {
        Li.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ce(this, ir, !1);
    }
  }
};
const { app: xn, ipcMain: Ia, shell: MP } = Su;
let du = !1;
const fu = () => {
  if (!Ia || !xn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: xn.getPath("userData"),
    appVersion: xn.getVersion()
  };
  return du || (Ia.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), du = !0), e;
};
class LP extends DP {
  constructor(t) {
    let r, n;
    if (he.type === "renderer") {
      const s = Su.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Ia && xn && ({ defaultCwd: r, appVersion: n } = fu());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = re.isAbsolute(t.cwd) ? t.cwd : re.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    fu();
  }
  async openInEditor() {
    const t = await MP.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var Rs = { exports: {} };
function Fd(e) {
  return e.charAt(0) === "/";
}
function Ud(e) {
  var t = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/, r = t.exec(e), n = r[1] || "", s = !!(n && n.charAt(1) !== ":");
  return !!(r[2] || s);
}
Rs.exports = process.platform === "win32" ? Ud : Fd;
Rs.exports.posix = Fd;
Rs.exports.win32 = Ud;
var VP = Rs.exports, na, hu;
function FP() {
  if (hu) return na;
  hu = 1;
  var e = Qd, t = ka, r = Ru.spawn, n = "HKLM", s = "HKCU", a = "HKCR", o = "HKU", c = "HKCC", u = [n, s, a, o, c], d = "REG_SZ", l = "REG_MULTI_SZ", h = "REG_EXPAND_SZ", E = "REG_DWORD", $ = "REG_QWORD", v = "REG_BINARY", g = "REG_NONE", _ = [d, l, h, E, $, v, g], p = "", w = /(\\[a-zA-Z0-9_\s]+)*/, N = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/, T = /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;
  function I(K, R) {
    if (!(this instanceof I))
      return new I(K, R);
    Error.captureStackTrace(this, I), this.__defineGetter__("name", function() {
      return I.name;
    }), this.__defineGetter__("message", function() {
      return K;
    }), this.__defineGetter__("code", function() {
      return R;
    });
  }
  e.inherits(I, Error);
  function G(K) {
    var R = { stdout: "", stderr: "" };
    return K.stdout.on("data", function(O) {
      R.stdout += O.toString();
    }), K.stderr.on("data", function(O) {
      R.stderr += O.toString();
    }), R;
  }
  function W(K, R, O) {
    var k = O.stdout.trim(), D = O.stderr.trim(), M = e.format(`%s command exited with code %d:
%s
%s`, K, R, k, D);
    return new I(M, R);
  }
  function le(K) {
    if (K == "x64")
      return "64";
    if (K == "x86")
      return "32";
    throw new Error("illegal architecture: " + K + " (use x86 or x64)");
  }
  function oe(K, R) {
    R && K.push("/reg:" + le(R));
  }
  function ie() {
    return process.platform === "win32" ? t.join(process.env.windir, "system32", "reg.exe") : "REG";
  }
  function q(K, R, O, k, D, M, C) {
    if (!(this instanceof q))
      return new q(K, R, O, k, D, M, C);
    var P = K, m = R, b = O, y = k, i = D, f = M, S = C;
    this.__defineGetter__("host", function() {
      return P;
    }), this.__defineGetter__("hive", function() {
      return m;
    }), this.__defineGetter__("key", function() {
      return b;
    }), this.__defineGetter__("name", function() {
      return y;
    }), this.__defineGetter__("type", function() {
      return i;
    }), this.__defineGetter__("value", function() {
      return f;
    }), this.__defineGetter__("arch", function() {
      return S;
    });
  }
  e.inherits(q, Object);
  function L(K) {
    if (!(this instanceof L))
      return new L(K);
    var R = K || {}, O = "" + (R.host || ""), k = "" + (R.hive || n), D = "" + (R.key || ""), M = R.arch || null;
    if (this.__defineGetter__("host", function() {
      return O;
    }), this.__defineGetter__("hive", function() {
      return k;
    }), this.__defineGetter__("key", function() {
      return D;
    }), this.__defineGetter__("path", function() {
      return (O.length == 0 ? "" : "\\\\" + O + "\\") + k + D;
    }), this.__defineGetter__("arch", function() {
      return M;
    }), this.__defineGetter__("parent", function() {
      var C = D.lastIndexOf("\\");
      return new L({
        host: this.host,
        hive: this.hive,
        key: C == -1 ? "" : D.substring(0, C),
        arch: this.arch
      });
    }), u.indexOf(k) == -1)
      throw new Error("illegal hive specified.");
    if (!w.test(D))
      throw new Error("illegal key specified.");
    if (M && M != "x64" && M != "x86")
      throw new Error("illegal architecture specified (use x86 or x64)");
  }
  return L.HKLM = n, L.HKCU = s, L.HKCR = a, L.HKU = o, L.HKCC = c, L.HIVES = u, L.REG_SZ = d, L.REG_MULTI_SZ = l, L.REG_EXPAND_SZ = h, L.REG_DWORD = E, L.REG_QWORD = $, L.REG_BINARY = v, L.REG_NONE = g, L.REG_TYPES = _, L.DEFAULT_VALUE = p, L.prototype.values = function(R) {
    if (typeof R != "function")
      throw new TypeError("must specify a callback");
    var O = ["QUERY", this.path];
    oe(O, this.arch);
    var k = r(ie(), O, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), D = "", M = this, C = null, P = G(k);
    return k.on("close", function(m) {
      if (!C)
        if (m !== 0)
          R(W("QUERY", m, P), null);
        else {
          for (var b = [], y = [], i = D.split(`
`), f = 0, S = 0, j = i.length; S < j; S++) {
            var A = i[S].trim();
            A.length > 0 && (f != 0 && b.push(A), ++f);
          }
          for (var S = 0, j = b.length; S < j; S++) {
            var z = T.exec(b[S]), U, Y, ye;
            z && (U = z[1].trim(), Y = z[2].trim(), ye = z[3], y.push(new q(M.host, M.hive, M.key, U, Y, ye, M.arch)));
          }
          R(null, y);
        }
    }), k.stdout.on("data", function(m) {
      D += m.toString();
    }), k.on("error", function(m) {
      C = m, R(m);
    }), this;
  }, L.prototype.keys = function(R) {
    if (typeof R != "function")
      throw new TypeError("must specify a callback");
    var O = ["QUERY", this.path];
    oe(O, this.arch);
    var k = r(ie(), O, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), D = "", M = this, C = null, P = G(k);
    return k.on("close", function(m) {
      C || m !== 0 && R(W("QUERY", m, P), null);
    }), k.stdout.on("data", function(m) {
      D += m.toString();
    }), k.stdout.on("end", function() {
      for (var m = [], b = [], y = D.split(`
`), i = 0, f = y.length; i < f; i++) {
        var S = y[i].trim();
        S.length > 0 && m.push(S);
      }
      for (var i = 0, f = m.length; i < f; i++) {
        var j = N.exec(m[i]), A;
        j && (j[1], A = j[2], A && A !== M.key && b.push(new L({
          host: M.host,
          hive: M.hive,
          key: A,
          arch: M.arch
        })));
      }
      R(null, b);
    }), k.on("error", function(m) {
      C = m, R(m);
    }), this;
  }, L.prototype.get = function(R, O) {
    if (typeof O != "function")
      throw new TypeError("must specify a callback");
    var k = ["QUERY", this.path];
    R == "" ? k.push("/ve") : k = k.concat(["/v", R]), oe(k, this.arch);
    var D = r(ie(), k, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), M = "", C = this, P = null, m = G(D);
    return D.on("close", function(b) {
      if (!P)
        if (b !== 0)
          O(W("QUERY", b, m), null);
        else {
          for (var y = [], i = null, f = M.split(`
`), S = 0, j = 0, A = f.length; j < A; j++) {
            var z = f[j].trim();
            z.length > 0 && (S != 0 && y.push(z), ++S);
          }
          var U = y[y.length - 1] || "", Y = T.exec(U), ye, rt, nt;
          Y && (ye = Y[1].trim(), rt = Y[2].trim(), nt = Y[3], i = new q(C.host, C.hive, C.key, ye, rt, nt, C.arch)), O(null, i);
        }
    }), D.stdout.on("data", function(b) {
      M += b.toString();
    }), D.on("error", function(b) {
      P = b, O(b);
    }), this;
  }, L.prototype.set = function(R, O, k, D) {
    if (typeof D != "function")
      throw new TypeError("must specify a callback");
    if (_.indexOf(O) == -1)
      throw Error("illegal type specified.");
    var M = ["ADD", this.path];
    R == "" ? M.push("/ve") : M = M.concat(["/v", R]), M = M.concat(["/t", O, "/d", k, "/f"]), oe(M, this.arch);
    var C = r(ie(), M, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), P = null, m = G(C);
    return C.on("close", function(b) {
      P || D(b !== 0 ? W("ADD", b, m) : null);
    }), C.stdout.on("data", function(b) {
    }), C.on("error", function(b) {
      P = b, D(b);
    }), this;
  }, L.prototype.remove = function(R, O) {
    if (typeof O != "function")
      throw new TypeError("must specify a callback");
    var k = R ? ["DELETE", this.path, "/f", "/v", R] : ["DELETE", this.path, "/f", "/ve"];
    oe(k, this.arch);
    var D = r(ie(), k, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), M = null, C = G(D);
    return D.on("close", function(P) {
      M || (P !== 0 ? O(W("DELETE", P, C), null) : O(null));
    }), D.stdout.on("data", function(P) {
    }), D.on("error", function(P) {
      M = P, O(P);
    }), this;
  }, L.prototype.clear = function(R) {
    if (typeof R != "function")
      throw new TypeError("must specify a callback");
    var O = ["DELETE", this.path, "/f", "/va"];
    oe(O, this.arch);
    var k = r(ie(), O, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), D = null, M = G(k);
    return k.on("close", function(C) {
      D || (C !== 0 ? R(W("DELETE", C, M), null) : R(null));
    }), k.stdout.on("data", function(C) {
    }), k.on("error", function(C) {
      D = C, R(C);
    }), this;
  }, L.prototype.erase = L.prototype.clear, L.prototype.destroy = function(R) {
    if (typeof R != "function")
      throw new TypeError("must specify a callback");
    var O = ["DELETE", this.path, "/f"];
    oe(O, this.arch);
    var k = r(ie(), O, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), D = null, M = G(k);
    return k.on("close", function(C) {
      D || (C !== 0 ? R(W("DELETE", C, M), null) : R(null));
    }), k.stdout.on("data", function(C) {
    }), k.on("error", function(C) {
      D = C, R(C);
    }), this;
  }, L.prototype.create = function(R) {
    if (typeof R != "function")
      throw new TypeError("must specify a callback");
    var O = ["ADD", this.path, "/f"];
    oe(O, this.arch);
    var k = r(ie(), O, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), D = null, M = G(k);
    return k.on("close", function(C) {
      D || (C !== 0 ? R(W("ADD", C, M), null) : R(null));
    }), k.stdout.on("data", function(C) {
    }), k.on("error", function(C) {
      D = C, R(C);
    }), this;
  }, L.prototype.keyExists = function(R) {
    return this.values(function(O, k) {
      if (O)
        return O.code == 1 ? R(null, !1) : R(O);
      R(null, !0);
    }), this;
  }, L.prototype.valueExists = function(R, O) {
    return this.get(R, function(k, D) {
      if (k)
        return k.code == 1 ? O(null, !1) : O(k);
      O(null, !0);
    }), this;
  }, na = L, na;
}
var sa, pu;
function UP() {
  if (pu) return sa;
  pu = 1;
  var e, t, r, n;
  return t = Aa, r = ka, e = FP(), n = new e({
    hive: e.HKCU,
    key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  }), sa = {
    /* Public */
    enable: function(s) {
      var a, o, c;
      return a = s.appName, o = s.appPath, c = s.isHiddenOnLaunch, new Promise(function(u, d) {
        var l, h, E, $;
        return h = o, l = "", $ = r.join(r.dirname(process.execPath), "..", "update.exe"), ((E = process.versions) != null ? E.electron : void 0) != null && t.existsSync($) ? (h = $, l = ' --processStart "' + r.basename(process.execPath) + '"', c && (l += ' --process-start-args "--hidden"')) : c && (l += " --hidden"), n.set(a, e.REG_SZ, '"' + h + '"' + l, function(v) {
          return v != null ? d(v) : u();
        });
      });
    },
    disable: function(s) {
      return new Promise(function(a, o) {
        return n.remove(s, function(c) {
          return c != null ? c.message.indexOf("The system was unable to find the specified registry key or value") !== -1 ? a(!1) : o(c) : a();
        });
      });
    },
    isEnabled: function(s) {
      return new Promise(function(a, o) {
        return n.get(s, function(c, u) {
          return c != null ? a(!1) : a(u != null);
        });
      });
    }
  }, sa;
}
var aa = {}, oa = {}, mu;
function zP() {
  return mu || (mu = 1, function(e) {
    e.parse = function(n) {
      if (n.length != 0) {
        var s = t.call({
          value: n,
          index: 0
        });
        return s;
      }
    };
    function t() {
      var n = this.value[this.index];
      switch (n) {
        case "{":
          return e.ArrayParser.call(this);
        case '"':
          return e.StringParser.call(this);
        case "a":
          if (this.value.substring(this.index, this.index + 5) == "alias")
            return e.AliasParser.call(this);
          break;
        case "«":
          if (this.value.substring(this.index, this.index + 5) == "«data")
            return e.DataParser.call(this);
          break;
      }
      return isNaN(n) ? e.UndefinedParser.call(this) : e.NumberParser.call(this);
    }
    e.AliasParser = function() {
      return this.index += 6, "/Volumes/" + e.StringParser.call(this).replace(/:/g, "/");
    }, e.ArrayParser = function() {
      for (var n = [], s = this.value[++this.index]; s != "}"; )
        n.push(t.call(this)), this.value[this.index] == "," && (this.index += 2), s = this.value[this.index];
      return this.index++, n;
    }, e.DataParser = function() {
      var n = e.UndefinedParser.call(this);
      n = n.substring(6, n.length - 1);
      var s = n.substring(0, 4);
      n = n.substring(4, n.length);
      for (var a = new Buffer(n.length / 2), o = 0, c = 0, u = n.length; c < u; c += 2)
        a[o++] = parseInt(n[c] + n[c + 1], 16);
      return a.type = s, a;
    }, e.NumberParser = function() {
      return Number(e.UndefinedParser.call(this));
    }, e.StringParser = function(n) {
      for (var s = "", a = ++this.index, o = this.value[a++]; o != '"'; )
        o == "\\" && (s += this.value.substring(this.index, a - 1), this.index = a++), o = this.value[a++];
      return s += this.value.substring(this.index, a - 1), this.index = a, s;
    };
    var r = /}|,|\n/;
    e.UndefinedParser = function() {
      for (var n = this.index, s = this.value[n++]; !r.test(s); )
        s = this.value[n++];
      var a = this.value.substring(this.index, n - 1);
      return this.index = n - 1, a;
    };
  }(oa)), oa;
}
var yu;
function GP() {
  return yu || (yu = 1, function(e) {
    var t = Ru.spawn;
    e.Parsers = zP();
    var r = e.Parsers.parse;
    e.osascript = "osascript", e.execFile = function(o, c, u) {
      return Array.isArray(c) || (u = c, c = []), n(o, c, u);
    }, e.execString = function(o, c) {
      return n(o, c);
    };
    function n(a, o, c) {
      var u = !1;
      Array.isArray(o) || (c = o, o = [], u = !0), o.push("-ss"), u || o.push(a);
      var d = t(e.osascript, o);
      s(d.stdout), s(d.stderr), d.on("exit", function(l) {
        var h = r(d.stdout.body), E;
        l && (E = new Error(d.stderr.body), E.appleScript = a, E.exitCode = l), c && c(E, h, d.stderr.body);
      }), u && (d.stdin.write(a), d.stdin.end());
    }
    function s(a) {
      a.body = "", a.setEncoding("utf8"), a.on("data", function(o) {
        a.body += o;
      });
    }
  }(aa)), aa;
}
var ia, $u;
function zd() {
  if ($u) return ia;
  $u = 1;
  const e = ef.homedir();
  return ia = (t) => {
    if (typeof t != "string")
      throw new TypeError(`Expected a string, got ${typeof t}`);
    return e ? t.replace(/^~(?=$|\/|\\)/, e) : t;
  }, ia;
}
var ca, _u;
function qP() {
  if (_u) return ca;
  _u = 1;
  var e = ka, t = Aa, r = parseInt("0777", 8);
  ca = n.mkdirp = n.mkdirP = n;
  function n(s, a, o, c) {
    typeof a == "function" ? (o = a, a = {}) : (!a || typeof a != "object") && (a = { mode: a });
    var u = a.mode, d = a.fs || t;
    u === void 0 && (u = r), c || (c = null);
    var l = o || /* istanbul ignore next */
    function() {
    };
    s = e.resolve(s), d.mkdir(s, u, function(h) {
      if (!h)
        return c = c || s, l(null, c);
      switch (h.code) {
        case "ENOENT":
          if (e.dirname(s) === s) return l(h);
          n(e.dirname(s), a, function(E, $) {
            E ? l(E, $) : n(s, a, l, $);
          });
          break;
        default:
          d.stat(s, function(E, $) {
            E || !$.isDirectory() ? l(h, c) : l(null, c);
          });
          break;
      }
    });
  }
  return n.sync = function s(a, o, c) {
    (!o || typeof o != "object") && (o = { mode: o });
    var u = o.mode, d = o.fs || t;
    u === void 0 && (u = r), c || (c = null), a = e.resolve(a);
    try {
      d.mkdirSync(a, u), c = c || a;
    } catch (h) {
      switch (h.code) {
        case "ENOENT":
          c = s(e.dirname(a), o, c), s(a, o, c);
          break;
        default:
          var l;
          try {
            l = d.statSync(a);
          } catch {
            throw h;
          }
          if (!l.isDirectory()) throw h;
          break;
      }
    }
    return c;
  }, ca;
}
var ua, gu;
function Gd() {
  if (gu) return ua;
  gu = 1;
  var e, t;
  return e = Aa, t = qP(), ua = {
    /* Public */
    createFile: function(r) {
      var n, s, a;
      return s = r.directory, a = r.filePath, n = r.data, new Promise(function(o, c) {
        return t(s, function(u) {
          return u != null ? c(u) : e.writeFile(a, n, function(d) {
            return d != null ? c(d) : o();
          });
        });
      });
    },
    isEnabled: function(r) {
      return new Promise(/* @__PURE__ */ function(n) {
        return function(s, a) {
          return e.stat(r, function(o, c) {
            return o != null ? s(!1) : s(c != null);
          });
        };
      }());
    },
    removeFile: function(r) {
      return new Promise(/* @__PURE__ */ function(n) {
        return function(s, a) {
          return e.stat(r, function(o) {
            return o != null ? s() : e.unlink(r, function(c) {
              return c != null ? a(c) : s();
            });
          });
        };
      }());
    }
  }, ua;
}
var la, vu;
function KP() {
  if (vu) return la;
  vu = 1;
  var e, t, r, n = [].indexOf || function(s) {
    for (var a = 0, o = this.length; a < o; a++)
      if (a in this && this[a] === s) return a;
    return -1;
  };
  return e = GP(), r = zd(), t = Gd(), la = {
    /* Public */
    enable: function(s) {
      var a, o, c, u, d, l, h, E, $;
      return a = s.appName, o = s.appPath, u = s.isHiddenOnLaunch, l = s.mac, l.useLaunchAgent ? (h = [o], u && h.push("--hidden"), E = h.map(function(v) {
        return "    <string>" + v + "</string>";
      }).join(`
`), c = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>` + a + `</string>
  <key>ProgramArguments</key>
  <array>
  ` + E + `
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>`, t.createFile({
        data: c,
        directory: this.getDirectory(),
        filePath: this.getFilePath(a)
      })) : (d = u ? "true" : "false", $ = '{path:"' + o + '", hidden:' + d + ', name:"' + a + '"}', this.execApplescriptCommand("make login item at end with properties " + $));
    },
    disable: function(s, a) {
      return a.useLaunchAgent ? t.removeFile(this.getFilePath(s)) : this.execApplescriptCommand('delete login item "' + s + '"');
    },
    isEnabled: function(s, a) {
      return a.useLaunchAgent ? t.isEnabled(this.getFilePath(s)) : this.execApplescriptCommand("get the name of every login item").then(function(o) {
        return o != null && n.call(o, s) >= 0;
      });
    },
    /* Private */
    execApplescriptCommand: function(s) {
      return new Promise(function(a, o) {
        return e.execString('tell application "System Events" to ' + s, function(c, u) {
          return c != null ? o(c) : a(u);
        });
      });
    },
    getDirectory: function() {
      return r("~/Library/LaunchAgents/");
    },
    getFilePath: function(s) {
      return "" + this.getDirectory() + s + ".plist";
    }
  }, la;
}
var da, Eu;
function HP() {
  if (Eu) return da;
  Eu = 1;
  var e, t;
  return t = zd(), e = Gd(), da = {
    /* Public */
    enable: function(r) {
      var n, s, a, o, c;
      return n = r.appName, s = r.appPath, c = r.isHiddenOnLaunch, o = c ? " --hidden" : "", a = `[Desktop Entry]
Type=Application
Version=1.0
Name=` + n + `
Comment=` + n + `startup script
Exec=` + s + o + `
StartupNotify=false
Terminal=false`, e.createFile({
        data: a,
        directory: this.getDirectory(),
        filePath: this.getFilePath(n)
      });
    },
    disable: function(r) {
      return e.removeFile(this.getFilePath(r));
    },
    isEnabled: function(r) {
      return e.isEnabled(this.getFilePath(r));
    },
    /* Private */
    getDirectory: function() {
      return t("~/.config/autostart/");
    },
    getFilePath: function(r) {
      return "" + this.getDirectory() + r + ".desktop";
    }
  }, da;
}
var qd, zn = function(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
};
qd = VP;
var BP = function() {
  function e(t) {
    var r, n, s, a, o;
    if (s = t.name, r = t.isHidden, n = t.mac, a = t.path, this.fixOpts = zn(this.fixOpts, this), this.isEnabled = zn(this.isEnabled, this), this.disable = zn(this.disable, this), this.enable = zn(this.enable, this), s == null)
      throw new Error("You must specify a name");
    if (this.opts = {
      appName: s,
      isHiddenOnLaunch: r ?? !1,
      mac: n ?? {}
    }, o = typeof process < "u" && process !== null ? process.versions : void 0, a != null) {
      if (!qd(a))
        throw new Error("path must be absolute");
      this.opts.appPath = a;
    } else if (o != null && (o.nw != null || o["node-webkit"] != null || o.electron != null))
      this.opts.appPath = process.execPath;
    else
      throw new Error("You must give a path (this is only auto-detected for NW.js and Electron apps)");
    if (this.fixOpts(), this.api = null, /^win/.test(process.platform))
      this.api = UP();
    else if (/darwin/.test(process.platform))
      this.api = KP();
    else if (/linux/.test(process.platform) || /freebsd/.test(process.platform))
      this.api = HP();
    else
      throw new Error("Unsupported platform");
  }
  return e.prototype.enable = function() {
    return this.api.enable(this.opts);
  }, e.prototype.disable = function() {
    return this.api.disable(this.opts.appName, this.opts.mac);
  }, e.prototype.isEnabled = function() {
    return this.api.isEnabled(this.opts.appName, this.opts.mac);
  }, e.prototype.fixMacExecPath = function(t, r) {
    return t = t.replace(/(^.+?[^\/]+?\.app)\/Contents\/(Frameworks\/((\1|[^\/]+?) Helper)\.app\/Contents\/MacOS\/\3|MacOS\/Electron)/, "$1"), r.useLaunchAgent || (t = t.replace(/\.app\/Contents\/MacOS\/[^\/]*$/, ".app")), t;
  }, e.prototype.fixOpts = function() {
    var t;
    if (this.opts.appPath = this.opts.appPath.replace(/\/$/, ""), /darwin/.test(process.platform) && (this.opts.appPath = this.fixMacExecPath(this.opts.appPath, this.opts.mac)), this.opts.appPath.indexOf("/") !== -1 ? (t = this.opts.appPath.split("/"), this.opts.appName = t[t.length - 1]) : this.opts.appPath.indexOf("\\") !== -1 && (t = this.opts.appPath.split("\\"), this.opts.appName = t[t.length - 1], this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4)), /darwin/.test(process.platform) && this.opts.appName.indexOf(".app", this.opts.appName.length - 4) !== -1)
      return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4);
  }, e;
}();
const wu = /* @__PURE__ */ Ma(BP), Kd = re.dirname(Zd(import.meta.url));
process.env.APP_ROOT = re.join(Kd, "..");
const ja = process.env.VITE_DEV_SERVER_URL, p1 = re.join(process.env.APP_ROOT, "dist-electron"), Hd = re.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ja ? re.join(process.env.APP_ROOT, "public") : Hd;
let It, fa = null;
const bu = new LP();
function Bd() {
  const e = xd.getPrimaryDisplay(), { width: t } = e.workAreaSize, r = t - 320 - 50, n = 50;
  It = new Pu({
    width: 320,
    height: 460,
    x: r,
    y: n,
    frame: !1,
    // 无边框
    transparent: !0,
    // 背景透明
    skipTaskbar: !0,
    // 不显示在任务栏
    resizable: !1,
    // 窗口大小不可调整
    // alwaysOnTop: true, // 总是显示在最顶层 (开发时注释)
    icon: re.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: re.join(Kd, "preload.mjs")
    }
  }), It.webContents.on("did-finish-load", () => {
    It == null || It.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ja ? It.loadURL(ja) : It.loadFile(re.join(Hd, "index.html"));
}
ar.on("window-all-closed", () => {
  process.platform !== "darwin" && (ar.quit(), It = null);
});
ar.on("activate", () => {
  Pu.getAllWindows().length === 0 && Bd();
});
ar.whenReady().then(() => {
  gn.handle("get-tasks", () => bu.get("tasks", [])), gn.on("update-tasks", (e, t) => {
    bu.set("tasks", t);
  }), gn.handle("get-auto-launch-status", () => new wu({
    name: "Daily Habit Tracker",
    path: ar.getPath("exe")
  }).isEnabled()), gn.on("toggle-auto-launch", (e, t) => {
    const r = new wu({
      name: "Daily Habit Tracker",
      path: ar.getPath("exe")
    });
    t ? r.enable() : r.disable();
  }), Bd();
  try {
    fa = new Jd(re.join(process.env.VITE_PUBLIC, "electron-vite.svg"));
    const e = Yd.buildFromTemplate([
      { label: "Exit", click: () => ar.quit() }
    ]);
    fa.setToolTip("Daily Habit Tracker"), fa.setContextMenu(e);
  } catch (e) {
    console.error("Failed to create tray:", e);
  }
});
export {
  p1 as MAIN_DIST,
  Hd as RENDERER_DIST,
  ja as VITE_DEV_SERVER_URL
};
