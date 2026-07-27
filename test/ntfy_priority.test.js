const test = require("node:test");
const assert = require("node:assert/strict");
const { buildNtfyPayload, normalizeNtfyPriority } = require("../ntfy_priority");

test("omits empty and default ntfy priorities", () => {
  assert.equal(normalizeNtfyPriority(undefined), undefined);
  assert.equal(normalizeNtfyPriority(""), undefined);
  assert.equal(normalizeNtfyPriority(" default "), undefined);
});

test("converts numeric ntfy priorities to JSON numbers", () => {
  for (let value = 1; value <= 5; value += 1) {
    assert.equal(normalizeNtfyPriority(String(value)), value);
  }
});

test("keeps supported named priorities and omits invalid values", () => {
  for (const value of ["min", "low", "high", "max"]) {
    assert.equal(normalizeNtfyPriority(value.toUpperCase()), value);
  }
  assert.equal(normalizeNtfyPriority("urgent"), undefined);
  assert.equal(normalizeNtfyPriority("6"), undefined);
});

test("builds compatible ntfy JSON payloads", () => {
  const defaultPayload = buildNtfyPayload({
    topic: "test-topic",
    title: "hello",
    message: "world",
    priority: "default",
    tags: "❤️, heartbeat"
  });
  assert.deepEqual(defaultPayload, {
    topic: "test-topic",
    title: "hello",
    message: "world",
    tags: ["❤️", "heartbeat"]
  });
  assert.equal(JSON.parse(JSON.stringify(defaultPayload)).priority, undefined);

  const numericPayload = buildNtfyPayload({
    topic: "test-topic",
    title: "hello",
    message: "world",
    priority: "4"
  });
  assert.equal(numericPayload.priority, 4);
});
