const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const manuscriptDir = path.join(repoRoot, "research_project_template", "06_manuscript");

const expectedFiles = [
  "research_plan_bullet.md",
  "00_paper_outline.md",
  "Index.md",
  "Abstract.md",
  "Introduction.md",
  "Theory.md",
  "Conceptual Frameworks.md",
  "Methods.md",
  "Result.md",
  "Discussion.md",
  "Conclusion.md",
  "manuscript_full.md",
];

test("research project template includes writings-style manuscript files", () => {
  for (const file of expectedFiles) {
    assert.equal(fs.existsSync(path.join(manuscriptDir, file)), true, `${file} should exist`);
  }
});

test("legacy numbered manuscript chapter files are not part of the new template", () => {
  const files = fs.readdirSync(manuscriptDir);

  assert.equal(files.includes("01_introduction.md"), false);
  assert.equal(files.includes("02_literature_review.md"), false);
  assert.equal(files.includes("03_data.md"), false);
  assert.equal(files.includes("04_method.md"), false);
  assert.equal(files.includes("05_results.md"), false);
  assert.equal(files.includes("06_discussion.md"), false);
  assert.equal(files.includes("07_conclusion.md"), false);
});

test("paper outline documents chapter roles and discussion boundaries", () => {
  const outline = fs.readFileSync(path.join(manuscriptDir, "00_paper_outline.md"), "utf8");

  assert.match(outline, /Result\.md[\s\S]*분석 결과/);
  assert.match(outline, /Discussion\.md[\s\S]*왜 중요한지/);
  assert.match(outline, /결과 반복/);
});

test("discussion template follows writings section structure", () => {
  const discussion = fs.readFileSync(path.join(manuscriptDir, "Discussion.md"), "utf8");

  assert.match(discussion, /## 7\. Discussion/);
  assert.match(discussion, /### 7\.1 연구결과 해석/);
  assert.match(discussion, /### 7\.5 연구의 한계/);
});

test("manuscript templates follow writings scene order and section prompts", () => {
  const index = fs.readFileSync(path.join(manuscriptDir, "Index.md"), "utf8");
  const abstract = fs.readFileSync(path.join(manuscriptDir, "Abstract.md"), "utf8");
  const plan = fs.readFileSync(path.join(manuscriptDir, "research_plan_bullet.md"), "utf8");
  const outline = fs.readFileSync(path.join(manuscriptDir, "00_paper_outline.md"), "utf8");
  const results = fs.readFileSync(path.join(manuscriptDir, "Result.md"), "utf8");
  const full = fs.readFileSync(path.join(manuscriptDir, "manuscript_full.md"), "utf8");

  assert.match(index, /scenes:\s*[\s\S]*- Abstract[\s\S]*- Conceptual Frameworks[\s\S]*- Conclusion/);
  assert.match(abstract, /### Background/);
  assert.match(abstract, /### Objective/);
  assert.match(plan, /## 연구모형 \/ 개념틀/);
  assert.match(plan, /## 가설 \/ 기대 방향/);
  assert.match(outline, /Background/);
  assert.match(outline, /Objective/);
  assert.match(results, /### 6\.1 기술통계 및 상관관계/);
  assert.match(results, /### 6\.2 가설 검증/);
  assert.match(full, /Abstract\.md/);
  assert.match(full, /Conceptual Frameworks\.md/);
});

test("skill documents canonical manuscript format choice", () => {
  const skill = fs.readFileSync(
    path.join(repoRoot, "codex_skill", "research-project-manager", "SKILL.md"),
    "utf8",
  );

  assert.match(skill, /## Manuscript Writing Format/);
  assert.match(skill, /canonical chapter manuscript format/);
  assert.match(skill, /2025_seoultech_capstone_design\\writings/);
  assert.match(skill, /Conceptual Frameworks\.md/);
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
