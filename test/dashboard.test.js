const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildProjectDashboardTable,
  parseMarkdownSections,
  run,
  updateProjectDashboardMarkdown,
} = require("../scripts/cli.js");

function makeTempTarget() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "rpm-dashboard-"));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

test("parseMarkdownSections reads Korean H1 and H2 sections", () => {
  const parsed = parseMarkdownSections(`# 논문 프로젝트

## 현재 상태
진행중

## 현재 논문 단계
분석중
`);

  assert.equal(parsed.firstH1, "논문 프로젝트");
  assert.equal(parsed.sections.get("현재 상태").trim(), "진행중");
  assert.equal(parsed.sections.get("현재 논문 단계").trim(), "분석중");
});

test("buildProjectDashboardTable scans qualifying projects and extracts dashboard fields", () => {
  const target = makeTempTarget();
  writeFile(path.join(target, "Alpha", "README.md"), `# 한국어 프로젝트

## 현재 상태
진행중

## 현재 논문 단계
분석중

## 다음 마감
2099-01-10
`);
  writeFile(path.join(target, "Alpha", "START_HERE.md"), `# START_HERE

## 막힌 지점
데이터 접근 권한 대기

## 다음에 시작할 첫 행동
- [ ] 문헌표 CSV를 열고 누락 컬럼을 확인한다

## 마지막 업데이트
2099-01-02

## 다가오는 마감 / 리마인드
- 리마인드: 2099-01-03
`);
  writeFile(path.join(target, "Alpha", "WBS.md"), `# WBS

## 현재 단계
원고초안

## 단계별 작업

| ID | 단계 | 작업 | 상태 | 다음 행동 | 담당 / 대기상대 | 마감 / 체크포인트 |
|---|---|---|---|---|---|---|
| W1 | 데이터확보 | 원자료 승인 | 막힘 | 승인 메일 재전송 | IRB |  |
`);
  writeFile(path.join(target, "Alpha", "RESEARCH_LOG.md"), `# RESEARCH_LOG

## 2099-01-01

- 이전 작업
`);
  writeFile(path.join(target, "OneFileOnly", "README.md"), "# 제외");
  writeFile(path.join(target, "research_project_template", "README.md"), "# 템플릿");
  writeFile(path.join(target, "research_project_template", "WBS.md"), "# WBS");

  const table = buildProjectDashboardTable(target);

  assert.match(table, /^\| 프로젝트 \| 상태 \| 단계 \| 마지막 작업일 \| 다음 첫 행동 \| 다음 마감 \| 리마인드일 \| 막힌 이유 \| 폴더 \|/);
  assert.match(
    table,
    /\| 한국어 프로젝트 \| 진행중 \| 분석중 \| 2099-01-02 \| 문헌표 CSV를 열고 누락 컬럼을 확인한다 \| 2099-01-10 \| 2099-01-03 \| 데이터 접근 권한 대기 \| Alpha \|/
  );
  assert.doesNotMatch(table, /OneFileOnly/);
  assert.doesNotMatch(table, /research_project_template/);
});

test("buildProjectDashboardTable does not use template guidance as the next action", () => {
  const target = makeTempTarget();
  writeFile(path.join(target, "Beta", "README.md"), `# Beta Project

## 현재 상태
진행중
`);
  writeFile(path.join(target, "Beta", "START_HERE.md"), `# START_HERE

## 다음에 시작할 첫 행동
\`논문 더 읽기\`처럼 크게 쓰지 말고, 바로 착수 가능한 행동으로 쓴다.

- [ ]
`);

  const table = buildProjectDashboardTable(target);

  assert.match(table, /\| Beta Project \| 진행중 \|  \|  \|  \|  \|  \|  \| Beta \|/);
  assert.doesNotMatch(table, /논문 더 읽기/);
});

test("updateProjectDashboardMarkdown replaces only the marked project list region", () => {
  const input = `# Dashboard

keep before

<!-- RPM:PROJECT_LIST:START -->
old table
<!-- RPM:PROJECT_LIST:END -->

keep after
`;
  const output = updateProjectDashboardMarkdown(input, "new table");

  assert.equal(output, `# Dashboard

keep before

<!-- RPM:PROJECT_LIST:START -->
new table
<!-- RPM:PROJECT_LIST:END -->

keep after
`);
});

test("updateProjectDashboardMarkdown adds markers around the standard project table when missing", () => {
  const input = `# Dashboard

## 논문 프로젝트 목록

intro

| 프로젝트 | 상태 |
|---|---|
| old | row |

## 협업 대기 목록

keep this section
`;
  const output = updateProjectDashboardMarkdown(input, "new table");

  assert.match(output, /## 논문 프로젝트 목록[\s\S]*<!-- RPM:PROJECT_LIST:START -->\nnew table\n<!-- RPM:PROJECT_LIST:END -->/);
  assert.match(output, /## 협업 대기 목록\n\nkeep this section/);
  assert.doesNotMatch(output, /old \| row/);
});

test("dashboard rebuild dry-run routes through the CLI command", async () => {
  const target = makeTempTarget();
  writeFile(path.join(target, "Gamma", "README.md"), `# 감마 프로젝트

## 현재 상태
진행중
`);
  writeFile(path.join(target, "Gamma", "WBS.md"), `# WBS

## 현재 단계
분석설계
`);

  const writes = [];
  const originalLog = console.log;
  console.log = (message = "") => writes.push(String(message));
  try {
    await run(["dashboard", "rebuild", "--target", target, "--dry-run"]);
  } finally {
    console.log = originalLog;
  }

  assert.match(writes.join("\n"), /\| 감마 프로젝트 \| 진행중 \| 분석설계 \|/);
  assert.equal(fs.existsSync(path.join(target, "PROJECT_DASHBOARD.md")), false);
});
