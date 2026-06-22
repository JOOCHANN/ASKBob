import { COPILOT } from "../../lib/crawlers/copilot";
import { CLAUDE_CODE } from "../../lib/crawlers/claude-code";
import { CODEX } from "../../lib/crawlers/codex";
import { CURSOR } from "../../lib/crawlers/cursor";
import { BOB } from "../../lib/crawlers/bob";
import type { CrawlTarget } from "../../lib/crawlers/types";

/** 일반 크롤 대상 경쟁사 */
export const TARGETS: CrawlTarget[] = [COPILOT, CLAUDE_CODE, CODEX, CURSOR];

/** IBM Bob — 크롤하되 bob-static.json 큐레이션으로 빈 필드를 보완한다 (병행) */
export { BOB };
