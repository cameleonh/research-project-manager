const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const manuscriptDir = path.join(repoRoot, "research_project_template", "06_manuscript");

const expectedFiles = [
  "research_plan_bullet.md",
  "00_paper_outline.md",
  "01_introduction.md",
  "02_literature_review.md",
  "03_data.md",
  "04_method.md",
  "05_results.md",
  "06_discussion.md",
  "07_conclusion.md",
  "manuscript_full.md",
];

test("research project template includes chapter-based manuscript files", () => {
  for (const file of expectedFiles) {
    assert.equal(fs.existsSync(path.join(manuscriptDir, file)), true, `${file} should exist`);
  }
});

test("paper outline documents chapter roles and discussion boundaries", () => {
  const outline = fs.readFileSync(path.join(manuscriptDir, "00_paper_outline.md"), "utf8");

  assert.match(outline, /05_results\.md[\s\S]*분석 결과/);
  assert.match(outline, /06_discussion\.md[\s\S]*왜 중요한지/);
  assert.match(outline, /결과 반복/);
});

test("discussion template has implication and paper-sentence holding sections", () => {
  const discussion = fs.readFileSync(path.join(manuscriptDir, "06_discussion.md"), "utf8");

  assert.match(discussion, /## 핵심 함의 후보/);
  assert.match(discussion, /## 논문식 문장 후보/);
  assert.match(discussion, /## 연구결과 해석/);
  assert.match(discussion, /## 연구의 한계/);
});

test("manuscript templates include reusable writing scaffold prompts", () => {
  const plan = fs.readFileSync(path.join(manuscriptDir, "research_plan_bullet.md"), "utf8");
  const outline = fs.readFileSync(path.join(manuscriptDir, "00_paper_outline.md"), "utf8");
  const results = fs.readFileSync(path.join(manuscriptDir, "05_results.md"), "utf8");
  const full = fs.readFileSync(path.join(manuscriptDir, "manuscript_full.md"), "utf8");

  assert.match(plan, /## 연구모형 \/ 개념틀/);
  assert.match(plan, /## 가설 \/ 기대 방향/);
  assert.match(outline, /Background/);
  assert.match(outline, /Objective/);
  assert.match(results, /## 기술통계 \/ 기초 결과/);
  assert.match(results, /## 연구질문 \/ 가설별 검증/);
  assert.match(full, /Background, Objective, Methods, Results, Conclusion/);
});

test("skill documents canonical manuscript format choice", () => {
  const skill = fs.readFileSync(
    path.join(repoRoot, "codex_skill", "research-project-manager", "SKILL.md"),
    "utf8",
  );

  assert.match(skill, /## Manuscript Writing Format/);
  assert.match(skill, /canonical workspace and manuscript system/);
  assert.match(skill, /2025_seoultech_capstone_design\\writings/);
  assert.match(skill, /malformed Markdown headings/);
});

test("folder guide explains manuscript source files and final assembly", () => {
  const guide = fs.readFileSync(path.join(repoRoot, "research_project_template", "FOLDER_GUIDE.md"), "utf8");

  assert.match(guide, /06_manuscript/);
  assert.match(guide, /manuscript_full\.md/);
  assert.match(guide, /최종 조립본/);
});

test("journal targets reference is an installable shared Research HQ file", async () => {
  const journalTargets = fs.readFileSync(path.join(repoRoot, "JOURNAL_TARGETS.md"), "utf8");
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const { run } = require("../scripts/cli.js");
  const target = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "rpm-journal-targets-"));

  assert.match(journalTargets, /# Journal Targets/);
  assert.match(journalTargets, /고령화/);
  assert.match(journalTargets, /주택/);
  assert.match(journalTargets, /부동산/);
  assert.match(journalTargets, /건축/);
  assert.match(journalTargets, /도시/);
  assert.match(journalTargets, /확인일/);
  assert.match(journalTargets, /JIF\/IF/);
  assert.equal(packageJson.files.includes("JOURNAL_TARGETS.md"), true);

  await run(["install", "--target", target, "--skip-skill", "--skip-tools", "--force"]);

  assert.equal(fs.existsSync(path.join(target, "JOURNAL_TARGETS.md")), true);
});
