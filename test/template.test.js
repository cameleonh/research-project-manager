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

test("writings-style chapter files keep metadata yaml blocks", () => {
  const chapterFiles = [
    "Abstract.md",
    "Introduction.md",
    "Theory.md",
    "Conceptual Frameworks.md",
    "Methods.md",
    "Result.md",
    "Discussion.md",
    "Conclusion.md",
  ];

  for (const file of chapterFiles) {
    const content = fs.readFileSync(path.join(manuscriptDir, file), "utf8");

    assert.match(content, /## 메타데이터/);
    assert.match(content, /```yaml[\s\S]*title: "논문 제목"[\s\S]*authors:/);
    assert.match(content, /name: "저자명"/);
    assert.match(content, /affiliation: "소속기관"/);
    assert.match(content, /email: "author@email\.com"/);
    assert.match(content, /journal: "목표 학술지"/);
    assert.match(content, /date: YYYY-MM-DD/);
    assert.match(content, /keywords: \[키워드1, 키워드2, 키워드3\]/);
  }
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
  assert.match(skill, /Keep the `## 메타데이터` YAML block/);
  assert.match(skill, /title`, `authors`/);
  assert.match(skill, /malformed Markdown headings/);
});

test("folder guide explains manuscript source files and final assembly", () => {
  const guide = fs.readFileSync(path.join(repoRoot, "research_project_template", "FOLDER_GUIDE.md"), "utf8");

  assert.match(guide, /06_manuscript/);
  assert.match(guide, /manuscript_full\.md/);
  assert.match(guide, /최종 조립본/);
});

test("variable audit template maps data columns to code and manuscript variables", () => {
  const auditPath = path.join(repoRoot, "research_project_template", "VARIABLE_AUDIT.md");
  const audit = fs.readFileSync(auditPath, "utf8");

  assert.match(audit, /# VARIABLE_AUDIT/);
  assert.match(audit, /실제 데이터 컬럼/);
  assert.match(audit, /코드에서 사용한 변수명/);
  assert.match(audit, /원고\/개념상 변수명/);
  assert.match(audit, /측정 내용/);
  assert.match(audit, /검증 상태/);
  assert.match(audit, /수정 필요/);
  assert.match(audit, /코드 리뷰 메모/);
});

test("skill requires variable audits before trusting analysis code", () => {
  const skill = fs.readFileSync(
    path.join(repoRoot, "codex_skill", "research-project-manager", "SKILL.md"),
    "utf8",
  );

  assert.match(skill, /VARIABLE_AUDIT\.md/);
  assert.match(skill, /actual data column/);
  assert.match(skill, /code variable name/);
  assert.match(skill, /manuscript or conceptual variable/);
  assert.match(skill, /Do not treat code organization as code review/);
});

test("citation audit template checks manuscript citations against references and existence", () => {
  const auditPath = path.join(repoRoot, "research_project_template", "CITATION_AUDIT.md");
  const audit = fs.readFileSync(auditPath, "utf8");

  assert.match(audit, /# CITATION_AUDIT/);
  assert.match(audit, /본문 인용 표기/);
  assert.match(audit, /참고문헌 항목/);
  assert.match(audit, /본문-목록 대조 상태/);
  assert.match(audit, /실재 확인 근거/);
  assert.match(audit, /DOI\/URL/);
  assert.match(audit, /확인 출처/);
  assert.match(audit, /실재 확인 상태/);
});

test("skill requires citation audits before submission", () => {
  const skill = fs.readFileSync(
    path.join(repoRoot, "codex_skill", "research-project-manager", "SKILL.md"),
    "utf8",
  );

  assert.match(skill, /CITATION_AUDIT\.md/);
  assert.match(skill, /in-text citations/);
  assert.match(skill, /reference list/);
  assert.match(skill, /actual paper existence/);
  assert.match(skill, /DOI resolver/);
  assert.match(skill, /publisher page/);
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
