# Research Project Manager Prompt Recipes

이 문서는 `research-project-manager`를 언제 어떤 말로 호출하면 좋은지 정리한 프롬프트 모음이다.

이 시스템은 두 가지로 이해하면 된다.

1. `PROJECT_DASHBOARD.md`, `START_HERE.md`, `WBS.md` 같은 Markdown 운영체계
2. Codex가 그 운영체계를 일관되게 관리하도록 돕는 `$research-project-manager` 스킬

항상 쓸 필요는 없다. 여러 논문을 고르거나, 멈춘 연구를 다시 시작하거나, 투고 직전 범위를 닫을 때 쓰면 된다.

## 언제 쓰는가

| 상황 | 열어야 할 파일 | 목적 |
|---|---|---|
| 오늘 무엇을 할지 고를 때 | `PROJECT_DASHBOARD.md` | 여러 논문 중 우선순위 선택 |
| 특정 논문을 다시 시작할 때 | `START_HERE.md` | 5분 안에 재시작 |
| 논문 단계와 작업 상태를 볼 때 | `WBS.md` | 단계별 진행 확인 |
| 오늘 한 일을 기록할 때 | `RESEARCH_LOG.md` | 다음 세션을 위한 기록 |
| 중요한 판단을 남길 때 | `DECISIONS.md` | 왜 그렇게 결정했는지 보존 |
| 핵심 파일 위치를 찾을 때 | `FILES.md` | 최신 원고, 결과, 데이터 경로 확인 |
| 투고 직전 점검할 때 | `SUBMISSION_CHECKLIST.md` | 투고 가능 판정 |
| 새 아이디어가 논문을 키울 때 | `PARKING_LOT.md` | 이번 논문에서 빼기 |

## 기본 호출 프롬프트

```text
Use $research-project-manager to review my PROJECT_DASHBOARD and tell me which 1-2 papers I should work on today.
```

```text
Use $research-project-manager to update this paper project's START_HERE, WBS, and RESEARCH_LOG based on what we did today.
```

```text
Use $research-project-manager to migrate this messy research folder into the template structure without deleting original files.
```

한국어로는 이렇게 말해도 된다.

```text
$research-project-manager 써서 내 논문 프로젝트 대시보드 보고, 오늘 닫아야 할 논문 1-2개만 골라줘.
```

```text
$research-project-manager 써서 이 논문 폴더의 START_HERE, WBS, RESEARCH_LOG를 오늘 작업 기준으로 갱신해줘.
```

```text
$research-project-manager 써서 이 지저분한 연구 폴더를 템플릿 구조로 정리해줘. 원본은 지우지 말고 아카이브로 빼줘.
```

## 새 논문 프로젝트 만들기

새 연구 아이디어가 실제 논문 후보가 되었을 때 사용한다.

```text
Use $research-project-manager to create a new paper project for "[논문 제목/주제]" under "[상위 폴더]". Use the template, fill README/WBS/START_HERE conservatively, and add one row to PROJECT_DASHBOARD.
```

```text
$research-project-manager 써서 "[논문 주제]" 새 논문 프로젝트를 만들어줘. 템플릿을 복사하고, README/WBS/START_HERE는 지금 아는 정보만 보수적으로 채워줘.
```

## 멈춘 논문 다시 시작하기

며칠 쉬었거나, 폴더를 열었는데 어디서 멈췄는지 기억이 안 날 때 사용한다.

```text
Use $research-project-manager to read this project's START_HERE, WBS, FILES, and latest research plan. Tell me the next first action only.
```

```text
$research-project-manager 써서 이 프로젝트의 START_HERE와 WBS만 보고, 지금 바로 할 첫 행동 하나만 정해줘.
```

## 하루 시작

여러 논문 중 무엇을 건드릴지 고를 때 사용한다.

```text
Use $research-project-manager to review PROJECT_DASHBOARD. Check deadlines, reminders, stale projects, and collaboration waits. Recommend today's top 1-2 projects.
```

```text
$research-project-manager 써서 PROJECT_DASHBOARD 보고 오늘 할 논문 1-2개만 골라줘. 마감, 리마인드, 협업 대기도 같이 봐줘.
```

## 하루 마감

작업을 끝내기 전 5분에 사용한다.

```text
Use $research-project-manager to record today's work in RESEARCH_LOG, update WBS statuses, and rewrite START_HERE so the next session can restart quickly.
```

```text
$research-project-manager 써서 오늘 한 일을 RESEARCH_LOG에 남기고, WBS 상태와 START_HERE 다음 행동을 갱신해줘.
```

## 폴더 정리 / 마이그레이션

자료가 한 폴더에 뭉쳐 있을 때 사용한다.

```text
Use $research-project-manager to organize this folder like the research_project_template. First inspect the files, then propose/archive old files, and do not delete original research content.
```

```text
$research-project-manager 써서 이 폴더를 템플릿 구조처럼 정리해줘. 먼저 파일을 읽고, 옛날 파일은 삭제하지 말고 99_archive로 빼줘.
```

## 투고 준비 모드

논문을 더 키우지 않고 닫아야 할 때 사용한다.

```text
Use $research-project-manager in finish mode. Open SUBMISSION_CHECKLIST and PARKING_LOT. Decide what is required for submission, what should be parked, and what the next 3 finishing actions are.
```

```text
$research-project-manager finish mode로 봐줘. SUBMISSION_CHECKLIST와 PARKING_LOT 기준으로, 투고에 꼭 필요한 것과 이번 논문에서 뺄 것을 나눠줘.
```

## 80% 연구를 투고본으로 닫을 때

분석은 거의 끝났지만 원고 마무리가 막힐 때 사용한다.

```text
Use $research-project-manager to apply the finishing workflow to this paper. Lock one research question, map analyses to manuscript sections, identify what goes to PARKING_LOT, and give me the next 3 actions toward submission.
```

```text
$research-project-manager 써서 이 논문에 finishing workflow를 적용해줘. 연구질문 하나로 잠그고, 분석을 원고 절에 연결하고, PARKING_LOT로 뺄 것을 나누고, 투고까지 다음 행동 3개를 정해줘.
```

여러 편 중 빨리 닫을 논문을 고를 때는 이렇게 말한다.

```text
Use $research-project-manager to find 2-3 projects that are 70-90% complete and can be converted into submissions fastest. Use START_HERE, WBS, ANALYSIS_DASHBOARD, and SUBMISSION_CHECKLIST if present.
```

```text
$research-project-manager 써서 70-90% 진행됐고 가장 빨리 투고본으로 바꿀 수 있는 논문 2-3개를 골라줘. START_HERE, WBS, ANALYSIS_DASHBOARD, SUBMISSION_CHECKLIST를 기준으로 봐줘.
```

## 새 아이디어가 생겼을 때

아이디어가 좋지만 논문 범위를 키울 위험이 있을 때 사용한다.

```text
Use $research-project-manager to decide whether this idea belongs in the current manuscript or PARKING_LOT. If parked, write the reason and the condition for revisiting it.
```

```text
$research-project-manager 써서 이 아이디어가 현재 원고에 꼭 필요한지, 아니면 PARKING_LOT에 둘지 판단해줘. 빼면 이유와 다시 꺼낼 조건도 적어줘.
```

## 분석 ID 대시보드가 필요할 때

분석 스크립트와 결과 폴더가 늘어나서 원고 어디에 쓰이는지 헷갈릴 때 사용한다. 모든 논문에 만들 필요는 없다.

```text
Use $research-project-manager to create an optional ANALYSIS_DASHBOARD.md for this analysis-heavy paper. Assign A0-A4 style IDs and link each analysis to its input data, script, output folder, manuscript section, supported claim, and status.
```

```text
$research-project-manager 써서 이 분석 많은 논문에 ANALYSIS_DASHBOARD.md를 만들어줘. A0-A4처럼 ID를 붙이고, 각 분석의 입력자료, 스크립트, 결과 폴더, 원고 위치, 지원하는 주장, 상태를 연결해줘.
```

새 분석을 추가했을 때는 이렇게 말한다.

```text
Use $research-project-manager to add this new script and output folder to ANALYSIS_DASHBOARD.md, then update FILES.md and START_HERE if needed.
```

```text
$research-project-manager 써서 새 분석 스크립트와 결과 폴더를 ANALYSIS_DASHBOARD.md에 추가해줘. 필요하면 FILES.md와 START_HERE도 같이 갱신해줘.
```

이미 있는 파일 관계를 정리할 때는 이렇게 말한다.

```text
Use $research-project-manager to audit this project's analysis chain. Check whether every result used in Result.md has an analysis ID, script, output folder, and source file.
```

```text
$research-project-manager 써서 이 프로젝트의 분석 체인을 점검해줘. Result.md에 쓰인 결과마다 분석 ID, 스크립트, 결과 폴더, 원천 파일이 있는지 확인해줘.
```

## 대시보드와 START_HERE가 헷갈릴 때

역할을 다시 나누고 싶을 때 사용한다.

```text
Use $research-project-manager to separate portfolio-level content into PROJECT_DASHBOARD and paper-level restart content into START_HERE.
```

```text
$research-project-manager 써서 PROJECT_DASHBOARD에는 전체 논문 우선순위만, START_HERE에는 이 논문 재시작 정보만 남기도록 정리해줘.
```

## 주간 점검

진행 논문이 너무 많아졌을 때 사용한다.

```text
Use $research-project-manager to run a weekly review. Flag stale projects, check the next two weeks of deadlines, and limit active papers to 1-3.
```

```text
$research-project-manager 써서 주간 점검해줘. 오래 멈춘 프로젝트, 2주 안 마감, 협업 대기를 보고 이번 주 active 논문을 1-3개로 줄여줘.
```

## 공저자 / 지도교수 피드백 후

피드백이 들어와서 논문 범위가 흔들릴 때 사용한다.

```text
Use $research-project-manager to process these comments. Separate required revisions, optional suggestions, and ideas to park. Update WBS and START_HERE.
```

```text
$research-project-manager 써서 이 피드백을 필수 수정, 선택 수정, PARKING_LOT 아이디어로 나눠줘. 그리고 WBS와 START_HERE도 갱신해줘.
```

## 언제 쓰지 않는가

- 단순히 한 문단을 고치는 작업
- 이미 무엇을 할지 명확한 짧은 작업
- 분석 코드를 직접 실행하는 작업
- 논문 본문을 깊게 다시 쓰는 작업

이 경우에는 `$research-project-manager`보다 일반 작업 지시가 더 낫다.

## 좋은 요청의 형태

좋은 요청은 대상 폴더와 원하는 산출물을 함께 말한다.

```text
$research-project-manager 써서 "D:\...\02_Paper\ICT인공지능 논문" 폴더의 START_HERE, WBS, SUBMISSION_CHECKLIST를 투고준비 기준으로 갱신해줘.
```

```text
$research-project-manager 써서 "D:\...\02_Paper\2026_장충금..." 논문에서 이번 투고본에 넣을 것과 PARKING_LOT로 뺄 것을 나눠줘.
```

```text
$research-project-manager 써서 PROJECT_DASHBOARD를 보고, 이번 달 안에 투고 가능한 논문만 따로 우선순위 매겨줘.
```
