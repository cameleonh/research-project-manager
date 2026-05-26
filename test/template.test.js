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
});

test("folder guide explains manuscript source files and final assembly", () => {
  const guide = fs.readFileSync(path.join(repoRoot, "research_project_template", "FOLDER_GUIDE.md"), "utf8");

  assert.match(guide, /06_manuscript/);
  assert.match(guide, /manuscript_full\.md/);
  assert.match(guide, /최종 조립본/);
});
