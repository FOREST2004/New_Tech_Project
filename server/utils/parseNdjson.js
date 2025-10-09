// utils/parseNdjson.js
export function splitNdjson(buffer) {
    return buffer
      .toString()
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
  }
  