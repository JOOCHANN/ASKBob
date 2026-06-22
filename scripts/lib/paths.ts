import path from "node:path";

export const ROOT = process.cwd();
export const DATA_DIR = path.join(ROOT, "data");
export const RAW_DIR = path.join(DATA_DIR, "raw");
export const SNAP_DIR = path.join(DATA_DIR, "snapshots");
export const TIMELINE_FILE = path.join(DATA_DIR, "timeline.json");
export const CHANGES_FILE = path.join(DATA_DIR, "changes.json");
export const BOB_STATIC_FILE = path.join(DATA_DIR, "bob-static.json");

/** 오늘 날짜 (YYYY-MM-DD, UTC) */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
