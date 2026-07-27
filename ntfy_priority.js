const NAMED_PRIORITIES = new Set(["min", "low", "high", "max"]);

function normalizeNtfyPriority(rawValue) {
  const value = String(rawValue ?? "").trim().toLowerCase();
  // 批注 2026-07-17：default 与省略字段语义相同；部分 ntfy 兼容服务会拒绝
  // JSON 中的字符串 default。这里直接省略，保护旧 .env 与 PM2 遗留环境继续可用。
  if (!value || value === "default") return undefined;
  if (/^[1-5]$/.test(value)) return Number(value);
  if (NAMED_PRIORITIES.has(value)) return value;
  return undefined;
}

function buildNtfyPayload({ topic, title, message, priority, tags }) {
  const payload = { topic, title, message };
  const normalizedPriority = normalizeNtfyPriority(priority);
  if (normalizedPriority !== undefined) payload.priority = normalizedPriority;
  const normalizedTags = String(tags ?? "").split(",").map(tag => tag.trim()).filter(Boolean);
  if (normalizedTags.length) payload.tags = normalizedTags;
  return payload;
}

module.exports = { buildNtfyPayload, normalizeNtfyPriority };
