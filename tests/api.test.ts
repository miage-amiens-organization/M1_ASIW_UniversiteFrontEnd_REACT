import { afterAll, afterEach, expect, spyOn, test } from "bun:test"
import { apiFetch } from "../packages/view/src/lib/api"

const fetchSpy = spyOn(globalThis, "fetch")
afterEach(() => fetchSpy.mockReset())
afterAll(() => fetchSpy.mockRestore())

test("preserves Headers instances and propagates cancellation", async () => {
  fetchSpy.mockResolvedValue(new Response("{}"))
  const controller = new AbortController()
  await apiFetch("/parcours", {
    headers: new Headers({ Authorization: "Bearer test" }),
    signal: controller.signal,
  })
  const [url, options] = fetchSpy.mock.calls.at(-1)!
  expect(url).toBe("/api/parcours")
  expect(new Headers(options?.headers).get("Authorization")).toBe("Bearer test")
  expect(options?.signal).toBe(controller.signal)
})

test("adds JSON content type but preserves an explicit tuple header", async () => {
  fetchSpy.mockResolvedValue(new Response("{}"))
  await apiFetch("/parcours", { method: "POST", body: "{}" })
  expect(new Headers(fetchSpy.mock.calls.at(-1)![1]?.headers).get("Content-Type"))
    .toBe("application/json")
  await apiFetch("/parcours", { method: "POST", headers: [["Content-Type", "text/plain"]], body: "text" })
  expect(new Headers(fetchSpy.mock.calls.at(-1)![1]?.headers).get("Content-Type"))
    .toBe("text/plain")
})

test("leaves multipart boundaries to fetch and HTTP errors to the caller", async () => {
  const response = new Response('{"error":"Conflict"}', { status: 409 })
  fetchSpy.mockResolvedValue(response)
  const body = new FormData()
  body.set("name", "test")
  expect(await apiFetch("/parcours", { method: "POST", body })).toBe(response)
  expect(new Headers(fetchSpy.mock.calls.at(-1)![1]?.headers).has("Content-Type")).toBe(false)
})
