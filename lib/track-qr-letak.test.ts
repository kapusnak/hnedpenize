import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"
import {
  clearQrLetakPending,
  consumePendingQrLetakScan,
  EVENT_HANDOFF_MS,
  GA_EVENT_QR_LETAK,
  markQrLetakPending,
  QR_LETAK_CAMPAIGN,
  QR_LETAK_PENDING_KEY,
  trackQrLetakScan,
  whenGtagReady,
} from "./track-qr-letak.ts"

type GtagCall = unknown[]

function mockSessionStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  }
}

function installWindow(gtag?: (...args: GtagCall) => void) {
  const sessionStorage = mockSessionStorage()
  const timers: Array<{ id: number; fn: () => void; at: number }> = []
  let nextId = 1
  let now = 0

  const windowLike = {
    gtag,
    dataLayer: [] as unknown[],
    setTimeout(fn: () => void, ms: number) {
      const id = nextId++
      timers.push({ id, fn, at: now + ms })
      return id
    },
    clearTimeout(id: number) {
      const index = timers.findIndex((timer) => timer.id === id)
      if (index >= 0) timers.splice(index, 1)
    },
    setInterval(fn: () => void, ms: number) {
      const id = nextId++
      const tick = () => {
        timers.push({
          id,
          fn: () => {
            fn()
            if (timers.some((timer) => timer.id === id)) tick()
          },
          at: now + ms,
        })
      }
      tick()
      return id
    },
    clearInterval(id: number) {
      for (let i = timers.length - 1; i >= 0; i--) {
        if (timers[i].id === id) timers.splice(i, 1)
      }
    },
    sessionStorage,
  }

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: windowLike,
  })
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: sessionStorage,
  })

  return {
    flush(ms: number) {
      now += ms
      timers
        .filter((timer) => timer.at <= now)
        .sort((a, b) => a.at - b.at)
        .forEach((timer) => {
          const index = timers.indexOf(timer)
          if (index >= 0) timers.splice(index, 1)
          timer.fn()
        })
    },
  }
}

beforeEach(() => {
  delete (globalThis as { window?: unknown }).window
})

afterEach(() => {
  delete (globalThis as { window?: unknown }).window
})

test("trackQrLetakScan sends only gtag event, not a dataLayer Custom Event", () => {
  const calls: GtagCall[] = []
  installWindow((...args) => {
    calls.push(args)
  })

  trackQrLetakScan()

  assert.equal(
    (globalThis as { window: { dataLayer: unknown[] } }).window.dataLayer.length,
    0,
  )
  assert.deepEqual(calls[0]?.[0], "set")
  assert.equal(calls[1]?.[0], "event")
  assert.equal(calls[1]?.[1], GA_EVENT_QR_LETAK)
  const params = calls[1]?.[2] as Record<string, unknown>
  assert.equal(params.campaign_source, QR_LETAK_CAMPAIGN.campaign_source)
  assert.equal(params.campaign_medium, QR_LETAK_CAMPAIGN.campaign_medium)
  assert.equal(params.campaign_name, QR_LETAK_CAMPAIGN.campaign_name)
  assert.equal(typeof params.event_callback, "function")
  assert.equal(params.event_timeout, EVENT_HANDOFF_MS)
  assert.equal(params.transport_type, "beacon")
})

test("trackQrLetakScan waits for event_callback before onDone and clears pending", () => {
  let callback: (() => void) | undefined
  installWindow((...args: GtagCall) => {
    const params = args[2]
    if (params && typeof params === "object" && "event_callback" in params) {
      const cb = (params as { event_callback?: unknown }).event_callback
      if (typeof cb === "function") callback = cb as () => void
    }
  })
  markQrLetakPending()

  let done = false
  trackQrLetakScan(() => {
    done = true
  })

  assert.equal(done, false)
  assert.equal(sessionStorage.getItem(QR_LETAK_PENDING_KEY), "1")
  callback?.()
  assert.equal(done, true)
  assert.equal(sessionStorage.getItem(QR_LETAK_PENDING_KEY), null)
})

test("trackQrLetakScan timeout still counts as gtag handoff (no homepage replay)", () => {
  const clock = installWindow(() => {})
  markQrLetakPending()

  let done = false
  trackQrLetakScan(() => {
    done = true
  })

  assert.equal(done, false)
  clock.flush(EVENT_HANDOFF_MS)
  assert.equal(done, true)
  assert.equal(sessionStorage.getItem(QR_LETAK_PENDING_KEY), null)
})

test("trackQrLetakScan without gtag does not clear pending", () => {
  installWindow()
  markQrLetakPending()

  let done = false
  trackQrLetakScan(() => {
    done = true
  })

  assert.equal(done, true)
  assert.equal(sessionStorage.getItem(QR_LETAK_PENDING_KEY), "1")
})

test("whenGtagReady waits until window.gtag exists", () => {
  const clock = installWindow()
  let ready = false
  whenGtagReady(() => {
    ready = true
  }, 1000)

  assert.equal(ready, false)
  ;(globalThis as { window: { gtag?: () => void } }).window.gtag = () => {}
  clock.flush(50)
  assert.equal(ready, true)
})

test("consumePendingQrLetakScan no-ops when pending was already cleared", () => {
  const calls: GtagCall[] = []
  installWindow((...args) => {
    calls.push(args)
  })
  clearQrLetakPending()
  consumePendingQrLetakScan()
  assert.equal(calls.length, 0)
})

test("consumePendingQrLetakScan replays via gtag when /qr left pending", () => {
  const calls: GtagCall[] = []
  installWindow((...args) => {
    calls.push(args)
  })
  markQrLetakPending()
  consumePendingQrLetakScan()
  assert.equal(calls[1]?.[0], "event")
  assert.equal(calls[1]?.[1], GA_EVENT_QR_LETAK)
})
