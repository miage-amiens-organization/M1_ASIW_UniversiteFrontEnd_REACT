import { afterAll, beforeAll, expect, test } from "bun:test"

let app: ReturnType<typeof Bun.spawn>
let base: string
beforeAll(async () => {
  // A separate process and in-memory database keep the teacher's data untouched.
  app = Bun.spawn([process.execPath, "packages/back/src/index.ts"], {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, DATABASE_PATH: ":memory:", PORT: "0", NODE_ENV: "production" },
    stdout: "pipe", stderr: "inherit",
  })
  const reader = (app.stdout as ReadableStream<Uint8Array>).getReader()
  let output = ""
  while (!base) {
    const { done, value } = await reader.read()
    if (done) throw new Error(`Backend did not start: ${output}`)
    output += new TextDecoder().decode(value)
    base = output.match(/http:\/\/[^\s]+/)?.[0] ?? ""
  }
  reader.releaseLock()
}, 10000)
afterAll(async () => {
  app?.kill()
  if (app) await app.exited
})

async function request(path: string, method = "GET", body?: unknown) {
  const response = await fetch(new URL(path, base), {
    method,
    ...(body === undefined ? {} : {
      headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }),
  })
  return { status: response.status, body: await response.json() }
}
async function expectError(path: string, method: string, body: unknown, status = 400) {
  const result = await request(path, method, body)
  expect(result.status).toBe(status)
  expect(typeof result.body.error).toBe("string")
  expect(result.body.error.length).toBeGreaterThan(0)
}

for (const [label, path, valid, invalid] of [
  ["parcours", "/api/parcours", { nomParcours: "MIAGE", anneeFormation: 1 }, [
    {}, null, [], "text", { nomParcours: "   " }, { nomParcours: 42 },
    { nomParcours: "MIAGE", anneeFormation: 3 },
    { nomParcours: "MIAGE", anneeFormation: "1" },
    { nomParcours: "MIAGE", anneeFormation: null },
    { nomParcours: "MIAGE", anneeFormation: 0 },
    { nomParcours: "MIAGE", anneeFormation: 1.5 },
    { nomParcours: "MIAGE", unexpected: true },
  ]],
  ["UE", "/api/ues", { numeroUe: "VALIDATION", intitule: "Validation" }, [
    {}, null, [], "text",
    { numeroUe: "   ", intitule: "Web" }, { numeroUe: "X", intitule: "\n " },
    { numeroUe: 42, intitule: "Web" }, { numeroUe: "X", intitule: false },
    { numeroUe: "X", intitule: "Web", id: 42 },
  ]],
] as const) {
  test(`${label}: invalid creation and update never change stored data`, async () => {
    const created = await request(path, "POST", valid)
    expect(created.status).toBe(201)
    const entity = created.body.parcours ?? created.body.ue
    const before = await request(path)
    for (const input of invalid) {
      await expectError(path, "POST", input)
      await expectError(`${path}/${entity.id}`, "PUT", input)
    }
    expect(await request(path)).toEqual(before)
  })
}

test("creating an UE requires both fields", async () => {
  await expectError("/api/ues", "POST", { numeroUe: "MISSING" })
  await expectError("/api/ues", "POST", { intitule: "Missing number" })
})

test("trims strings, preserves default year and supports partial updates", async () => {
  const created = await request("/api/parcours", "POST", { nomParcours: "  Info  " })
  expect(created.status).toBe(201)
  expect(created.body.parcours.nomParcours).toBe("Info")
  expect(created.body.parcours.anneeFormation).toBe(1)
  const id = created.body.parcours.id
  const updated = await request(`/api/parcours/${id}`, "PUT", { anneeFormation: 2 })
  expect(updated.status).toBe(200)
  expect(updated.body.parcours.nomParcours).toBe("Info")
  expect(updated.body.parcours.anneeFormation).toBe(2)
  const renamed = await request(`/api/parcours/${id}`, "PUT", { nomParcours: "  M2 Info  " })
  expect(renamed.status).toBe(200)
  expect(renamed.body.parcours.nomParcours).toBe("M2 Info")
  expect(renamed.body.parcours.anneeFormation).toBe(2)
})

test("UE conflicts return 409 on creation and update without losing data", async () => {
  const a = await request("/api/ues", "POST", { numeroUe: " A ", intitule: " First " })
  const b = await request("/api/ues", "POST", { numeroUe: "B", intitule: "Second" })
  expect(a.status).toBe(201)
  expect(b.status).toBe(201)
  expect(a.body.ue.numeroUe).toBe("A")
  expect(a.body.ue.intitule).toBe("First")
  const before = await request("/api/ues")
  await expectError("/api/ues", "POST", { numeroUe: " A ", intitule: "Duplicate" }, 409)
  await expectError(`/api/ues/${b.body.ue.id}`, "PUT", { numeroUe: " A ", intitule: "Changed" }, 409)
  expect(await request("/api/ues")).toEqual(before)
  const unchanged = await request(`/api/ues/${a.body.ue.id}`, "PUT", { numeroUe: "A" })
  expect(unchanged.status).toBe(200)
  const renamed = await request(`/api/ues/${b.body.ue.id}`, "PUT", { intitule: " New title " })
  expect(renamed.status).toBe(200)
  expect(renamed.body.ue.numeroUe).toBe("B")
  expect(renamed.body.ue.intitule).toBe("New title")
})

test("malformed JSON, invalid IDs and missing resources have explicit errors", async () => {
  for (const path of ["/api/parcours", "/api/ues"]) {
    const response = await fetch(new URL(path, base), { method: "POST", body: "{" })
    expect(response.status).toBe(400)
    expect(typeof (await response.json()).error).toBe("string")
    for (const id of ["1abc", "0", "-1", "1.5", "9007199254740992"]) {
      for (const method of ["GET", "PUT", "DELETE"]) {
        await expectError(`${path}/${id}`, method, method === "PUT" ? {} : undefined)
      }
    }
    for (const method of ["GET", "PUT", "DELETE"]) {
      const body = method === "PUT"
        ? path.endsWith("ues") ? { intitule: "Missing" } : { nomParcours: "Missing" }
        : undefined
      await expectError(`${path}/999999`, method, body, 404)
    }
  }
})

test("invalid associations preserve links; valid replacement and clearing work", async () => {
  const p = await request("/api/parcours", "POST", { nomParcours: "Relations" })
  const u = await request("/api/ues", "POST", { numeroUe: "REL", intitule: "Relations" })
  const path = `/api/ues/${u.body.ue.id}/parcours`
  const id = p.body.parcours.id
  expect((await request(path, "PUT", { parcoursIds: [id, id] })).status).toBe(200)
  const before = await request(path)
  expect(before.body.enseigneeDans).toHaveLength(1)
  for (const body of [null, {}, { parcoursIds: "1" }, { parcoursIds: ["1"] },
    { parcoursIds: [0] }, { parcoursIds: [1.5] }, { parcoursIds: [id, 999999] }]) {
    await expectError(path, "PUT", body)
    expect(await request(path)).toEqual(before)
  }
  expect((await request(path, "PUT", { parcoursIds: [] })).status).toBe(200)
  expect((await request(path)).body.enseigneeDans).toEqual([])
})
