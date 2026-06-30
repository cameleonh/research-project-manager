const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  auditCitations,
  auditContent,
  auditFinal,
  auditVariables,
  run,
} = require("../scripts/cli.js");

function makeProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "rpm-audit-"));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

test("auditCitations finds missing, uncited, and unevidenced references", () => {
  const project = makeProject();
  writeFile(path.join(project, "06_manuscript", "Introduction.md"), `# Introduction

Smith (2020) showed the baseline pattern. Later work reported related effects (Kim, 2021; Lee, 2022).
`);
  writeFile(path.join(project, "06_manuscript", "manuscript_full.md"), `# Manuscript

## References

- Smith, J. (2020). Housing safety and risk. Journal of Housing. https://doi.org/10.1234/example.2020.1
- Park, S. (2019). Unused housing reference. Urban Studies.
`);

  const report = auditCitations({ target: project });

  assert.deepEqual(report.missingReferenceKeys.sort(), ["kim|2021", "lee|2022"]);
  assert.deepEqual(report.uncitedReferenceKeys, ["park|2019"]);
  assert.deepEqual(report.referencesNeedingEvidenceKeys, ["park|2019"]);
  assert.equal(report.ready, false);
});

test("auditVariables compares code variables against actual data headers", () => {
  const project = makeProject();
  writeFile(path.join(project, "02_data_raw", "sample.csv"), "price,safety_grade\n100,A\n");
  writeFile(path.join(project, "04_analysis", "main.R"), `df <- read.csv("../02_data_raw/sample.csv")
model <- lm(price ~ safety_grade + missing_var, data = df)
print(df$price + df$missing_var)
`);

  const report = auditVariables({ target: project });

  assert.deepEqual(report.dataColumns.sort(), ["price", "safety_grade"]);
  assert.equal(report.usedCodeVariables.has("price"), true);
  assert.equal(report.usedCodeVariables.has("safety_grade"), true);
  assert.deepEqual(report.missingDataColumns, ["missing_var"]);
  assert.equal(report.ready, false);
});

test("auditContent flags unfinished manuscript placeholders", () => {
  const project = makeProject();
  writeFile(path.join(project, "06_manuscript", "Introduction.md"), `# Introduction

## 메타데이터

\`\`\`yaml
title: "논문 제목"
date: YYYY-MM-DD
\`\`\`
`);

  const report = auditContent({ target: project });

  assert.equal(report.placeholderIssues.length >= 2, true);
  assert.equal(report.ready, false);
});

test("auditFinal aggregates code, content, citation, and audit-table blockers", () => {
  const project = makeProject();
  writeFile(path.join(project, "02_data_raw", "sample.csv"), "price\n100\n");
  writeFile(path.join(project, "04_analysis", "main.R"), "model <- lm(price ~ missing_var, data = df)\n");
  writeFile(path.join(project, "06_manuscript", "Introduction.md"), `# Introduction

Smith (2020) is cited here.

## 메타데이터

\`\`\`yaml
title: "논문 제목"
\`\`\`
`);
  writeFile(path.join(project, "06_manuscript", "manuscript_full.md"), `# Manuscript

## References

- Park, S. (2019). Wrong reference.
`);
  writeFile(path.join(project, "VARIABLE_AUDIT.md"), `# VARIABLE_AUDIT

| ID | 검증 상태 |
|---|---|
| V1 | 수정 필요 |
`);
  writeFile(path.join(project, "CITATION_AUDIT.md"), `# CITATION_AUDIT

| ID | 본문-목록 대조 상태 | 실재 확인 상태 |
|---|---|---|
| C1 | 본문만 있음 | 확인 전 |
`);

  const report = auditFinal({ target: project });

  assert.equal(report.ready, false);
  assert.equal(report.variable.ready, false);
  assert.equal(report.content.ready, false);
  assert.equal(report.citation.ready, false);
  assert.equal(report.auditTables.blockers.length >= 2, true);
});

test("auditFinal ignores audit table header labels when scanning blockers", () => {
  const project = makeProject();
  writeFile(path.join(project, "06_manuscript", "Abstract.md"), "# Abstract\n");
  writeFile(path.join(project, "06_manuscript", "Introduction.md"), "# Introduction\n");
  writeFile(path.join(project, "06_manuscript", "Theory.md"), "# Theory\n");
  writeFile(path.join(project, "06_manuscript", "Conceptual Frameworks.md"), "# Conceptual Frameworks\n");
  writeFile(path.join(project, "06_manuscript", "Methods.md"), "# Methods\n");
  writeFile(path.join(project, "06_manuscript", "Result.md"), "# Result\n");
  writeFile(path.join(project, "06_manuscript", "Discussion.md"), "# Discussion\n");
  writeFile(path.join(project, "06_manuscript", "Conclusion.md"), "# Conclusion\n");
  writeFile(path.join(project, "FINAL_AUDIT.md"), `# FINAL_AUDIT

| 순서 | 영역 | 상태 | 수정 필요 | 메모 |
|---|---|---|---|---|
| 1 | 코드/변수 검토 | 통과 |  |  |
`);

  const report = auditFinal({ target: project });

  assert.deepEqual(report.auditTables.blockers, []);
});

test("audit final --strict exits through the CLI when blockers remain", async () => {
  const project = makeProject();
  writeFile(path.join(project, "06_manuscript", "Introduction.md"), `# Introduction

Smith (2020) is cited but unresolved.
`);

  await assert.rejects(
    () => run(["audit", "final", "--target", project, "--strict"]),
    /final audit found blockers/,
  );
});
