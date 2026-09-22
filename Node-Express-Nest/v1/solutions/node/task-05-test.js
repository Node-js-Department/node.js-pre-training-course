/**
 * task-05-test.js
 * Basic test suite for task-05 TodoServer with events & analytics.
 * Run: node task-05-test.js
 */
const assert = require("assert");
const { TodoServer } = require("./task-05");

async function httpJson(method, url, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const json = await res.json();
  return { status: res.status, json };
}

async function run() {
  const server = new TodoServer(0); // random free port
  await server.start();
  const port = server.server.address().port;
  const base = `http://localhost:${port}`;

  // capture events
  const captured = {
    created: null,
    updated: null,
    deleted: null,
    viewed: null,
    notFound: null,
    validationError: null,
  };
  server.once("todoCreated", (d) => (captured.created = d));
  server.once("todoUpdated", (d) => (captured.updated = d));
  server.once("todoDeleted", (d) => (captured.deleted = d));
  server.once("todoViewed", (d) => (captured.viewed = d));
  server.once("todoNotFound", (d) => (captured.notFound = d));
  server.once("validationError", (d) => (captured.validationError = d));

  // 1) create
  let res = await httpJson("POST", `${base}/todos`, {
    title: "First",
    description: "A",
    completed: false,
  });
  assert.equal(res.status, 201);
  assert.equal(res.json.success, true);
  const id = res.json.data.id;
  assert.ok(
    captured.created && captured.created.todo.id === id,
    "todoCreated event not captured"
  );

  // 2) list
  res = await httpJson("GET", `${base}/todos`);
  assert.equal(res.status, 200);
  assert.equal(res.json.count, 1);

  // 3) view
  res = await httpJson("GET", `${base}/todos/${id}`);
  assert.equal(res.status, 200);
  assert.ok(
    captured.viewed && captured.viewed.todo.id === id,
    "todoViewed event not captured"
  );

  // 4) update
  res = await httpJson("PUT", `${base}/todos/${id}`, {
    completed: true,
    title: "First updated",
  });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.completed, true);
  assert.ok(
    captured.updated &&
      Array.isArray(captured.updated.changes) &&
      captured.updated.changes.length >= 1,
    "todoUpdated event missing changes"
  );

  // 5) invalid json
  const bad = await fetch(`${base}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{oops",
  });
  assert.equal(bad.status, 400);
  // ensure validationError emitted
  assert.ok(captured.validationError, "validationError not emitted");

  // 6) not found
  res = await httpJson("GET", `${base}/todos/9999`);
  assert.equal(res.status, 404);
  assert.ok(captured.notFound && captured.notFound.todoId === 9999);

  // 7) delete
  res = await httpJson("DELETE", `${base}/todos/${id}`);
  assert.equal(res.status, 200);
  assert.ok(
    captured.deleted && captured.deleted.todo.id === id,
    "todoDeleted event not captured"
  );

  // 8) analytics
  res = await httpJson("GET", `${base}/analytics`);
  assert.equal(res.status, 200);
  assert.ok(res.json.data.totalCreated >= 1);
  assert.ok(res.json.data.totalDeleted >= 1);

  // 9) recent events
  res = await httpJson("GET", `${base}/events`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.json.data));
  assert.ok(res.json.data.length >= 1);

  // 10) filtering
  // create another todo incomplete
  await httpJson("POST", `${base}/todos`, { title: "Second" });
  res = await httpJson("GET", `${base}/todos?completed=false`);
  assert.equal(res.status, 200);
  // Should include at least one incomplete
  assert.ok(res.json.count >= 1);

  console.log("✅ All task-05 tests passed");
  await server.stop();
}

run().catch(async (err) => {
  console.error("❌ Tests failed:", err);
  process.exitCode = 1;
});
