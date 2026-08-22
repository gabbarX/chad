// Restores `localStorage` for jsdom tests on Node >= 24.
//
// Node ships its own experimental `localStorage` global, and reading it without
// `--localstorage-file` yields `undefined` plus an ExperimentalWarning. That global is
// *non-enumerable*, so when vitest's jsdom environment copies the jsdom window's properties onto
// `globalThis` it never installs jsdom's own (perfectly functional) Storage over the top: reads
// keep falling through to Node's stub and every `localStorage.setItem(...)` throws
// "Cannot read properties of undefined". `sessionStorage` is unaffected only because Node does not
// define one, which is the tell that this is a shadowing problem rather than a jsdom failure.
//
// Node's descriptor is `configurable: true`, so redefining the property is enough. jsdom's real
// Storage object is not reachable from a setup file (the populated global *is* the shadowed
// window), and the Storage constructor is not callable per spec, so this installs a small
// spec-shaped implementation instead. Named-property access (`storage.key = 'v'`) is deliberately
// not emulated -- nothing in this repo uses it; every call site goes through the methods below.
//
// Listed in `setupFiles` by the packages whose tests run under jsdom. Remove this once Node no
// longer defines an unusable `localStorage` global, or once vitest overrides it during population.

class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  key(index: number): string | null {
    // Web Storage exposes insertion order, which a Map preserves.
    return [...this.#entries.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.#entries.get(String(key)) ?? null;
  }

  setItem(key: string, value: string): void {
    this.#entries.set(String(key), String(value));
  }

  removeItem(key: string): void {
    this.#entries.delete(String(key));
  }

  clear(): void {
    this.#entries.clear();
  }
}

// Only patch a broken environment: a real browser-like `localStorage` (or a future Node that
// provides a working one) must win, so that tests exercise the genuine implementation.
function isUsable(storage: unknown): boolean {
  if (!storage || typeof storage !== "object") return false;
  const candidate = storage as Partial<Storage>;
  return typeof candidate.getItem === "function" && typeof candidate.setItem === "function";
}

// Read through a try/catch: an opaque-origin jsdom throws a SecurityError on access rather than
// returning undefined, and that environment needs the same replacement.
function currentLocalStorage(): unknown {
  try {
    return (globalThis as { localStorage?: unknown }).localStorage;
  } catch {
    return undefined;
  }
}

if (!isUsable(currentLocalStorage())) {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
    enumerable: false,
    writable: true,
  });
}
