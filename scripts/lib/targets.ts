import { COPILOT } from "../../lib/crawlers/copilot";
import { CLAUDE_CODE } from "../../lib/crawlers/claude-code";
import { CODEX } from "../../lib/crawlers/codex";
import { CURSOR } from "../../lib/crawlers/cursor";
import type { CrawlTarget } from "../../lib/crawlers/types";

/** 크롤 대상 경쟁사. Bob은 크롤 대상이 아니라 bob-static.json 수동 데이터를 사용한다. */
export const TARGETS: CrawlTarget[] = [COPILOT, CLAUDE_CODE, CODEX, CURSOR];

export const BOB_SLUG = "ibm-bob";
