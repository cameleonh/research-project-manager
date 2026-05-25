# PROJECT_MANAGEMENT_GUIDE

논문 프로젝트를 여러 개 동시에 진행할 때 사용하는 운영법이다.

## 핵심 원칙

- 전체 상황은 `PROJECT_DASHBOARD.md`에서 본다.
- 개별 논문은 해당 프로젝트 폴더의 `START_HERE.md`부터 연다.
- 논문의 전체 단계는 `WBS.md`에서 관리한다.
- 오늘 한 일은 `RESEARCH_LOG.md`에 남긴다.
- 중요한 판단만 `DECISIONS.md`에 적는다.
- 주요 파일 위치만 `FILES.md`에 적는다.
- 협업 대기, 마감, 리마인드일은 `PROJECT_DASHBOARD.md`에서 한 번에 본다.
- 실제 알림이 필요한 날짜는 캘린더에도 등록한다.

## 새 논문 프로젝트를 시작할 때

1. `research_project_template` 폴더를 복사한다.
2. 폴더명을 `YYYY_short_project_name` 형태로 바꾼다.
3. `README.md`에 프로젝트 기본 정보를 적는다.
4. `WBS.md`에서 현재 단계와 진행할 항목을 표시한다.
5. `START_HERE.md`에 다음 첫 행동을 한 줄로 적는다.
6. 다음 마감, 리마인드일, 협업 대기 항목이 있으면 적는다.
7. `PROJECT_DASHBOARD.md`에 프로젝트를 한 줄 추가한다.

## 하루를 시작할 때

1. `PROJECT_DASHBOARD.md`를 연다.
2. 오늘 또는 이번 주의 마감/리마인드/협업 대기 항목을 확인한다.
3. 오늘 건드릴 논문을 1-2개만 고른다.
4. 해당 프로젝트 폴더의 `START_HERE.md`를 연다.
5. `다음에 시작할 첫 행동`부터 한다.

## 하루를 끝낼 때

작업을 마치기 전 5분만 남긴다.

1. `RESEARCH_LOG.md`에 오늘 한 일을 적는다.
2. 새로 보낸 요청, 받은 답변, 바뀐 마감이 있으면 `RESEARCH_LOG.md`에 남긴다.
3. `WBS.md`에서 관련 항목의 상태, 담당/대기상대, 마감/체크포인트를 갱신한다.
4. `START_HERE.md`에 다음에 시작할 첫 행동 하나를 적는다.
5. `PROJECT_DASHBOARD.md`의 마지막 작업일, 단계, 다음 첫 행동, 다음 마감, 리마인드일을 갱신한다.

## 쉬었다가 돌아왔을 때

긴 로그를 처음부터 읽지 않는다.

1. `PROJECT_DASHBOARD.md`에서 프로젝트 상태를 확인한다.
2. 해당 프로젝트의 `START_HERE.md`만 먼저 연다.
3. 필요한 경우에만 `WBS.md`, `FILES.md`, `RESEARCH_LOG.md`를 검색한다.

## 파일별 역할

| 파일 | 역할 | 자주 여는 정도 |
|---|---|---|
| `PROJECT_DASHBOARD.md` | 여러 논문 전체 상태 | 매일 또는 주 2-3회 |
| `README.md` | 프로젝트 기본 정보 | 가끔 |
| `WBS.md` | 논문 단계별 진행 지도 | 작업 전후 |
| `START_HERE.md` | 다음 첫 행동 | 매번 |
| `RESEARCH_LOG.md` | 날짜별 작업 기록 | 작업 종료 시 |
| `DECISIONS.md` | 중요한 결정 기록 | 결정이 있을 때 |
| `FILES.md` | 핵심 파일 위치 | 파일을 찾을 때 |

## WBS 운영 기준

`WBS.md`에는 자세한 일지를 쓰지 않는다. 단계, 상태, 다음 행동, 담당/대기상대, 마감/체크포인트만 적는다.

상태는 다음 중 하나만 사용한다.

- 대기
- 진행중
- 막힘
- 완료
- 보류

## 좋은 다음 행동

좋은 다음 행동은 바로 시작할 수 있어야 한다.

나쁜 예:

- 논문 더 읽기
- 분석하기
- 원고 고치기

좋은 예:

- FMS 안전등급 데이터에서 단지명, 주소, 점검일 컬럼을 확인한다.
- 선행연구 3편의 식별전략만 `01_literature/lit_matrix.md`에 정리한다.
- Figure 2의 표본 수가 본문과 일치하는지 확인한다.

## 협업 / 마감 / 알림 운영 기준

- 협업 대기는 `PROJECT_DASHBOARD.md`의 `협업 대기 목록`에 적는다.
- 논문별 세부 협업 상태는 해당 프로젝트의 `README.md`에 적는다.
- WBS 항목별 담당자나 대기상대는 `WBS.md`에 적는다.
- 실제 알림이 울려야 하는 마감은 Google Calendar, Outlook, 휴대폰 알림 같은 캘린더에 별도로 등록한다.
- `PROJECT_DASHBOARD.md`의 `마감 / 알림 큐`는 캘린더를 대체하지 않고, 연구 맥락과 연결된 보조 목록으로 쓴다.
- 리마인드일은 마감일이 아니라 내가 다시 확인할 날짜다.

## 자동 알림 / 캘린더 동기화

설치 후 `.research_pm_tools`에 로컬 알림 도구가 복사된다.

리마인드 dry-run:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "C:\Users\honey\Documents\New project" --dry-run
```

Windows 알림 실행:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "C:\Users\honey\Documents\New project" --notify
```

매일 오전 9시 Windows 알림 등록:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "C:\Users\honey\Documents\New project" --time 09:00
```

Google Calendar와 Outlook Calendar 동기화는 `PROJECT_DASHBOARD.md`의 `캘린더 등록` 값이 `예` 또는 `yes`인 항목만 대상으로 한다. 동기화는 Markdown에서 Calendar로 가는 단방향이다.

## 주간 점검

매주 한 번만 한다.

1. 진행중 프로젝트가 3개를 넘는지 확인한다.
2. 마지막 작업일이 오래된 프로젝트를 대기 또는 보류로 바꾼다.
3. 각 진행중 프로젝트의 `START_HERE.md`가 바로 실행 가능한지 확인한다.
4. 다음 2주 안의 마감과 리마인드일을 확인한다.
5. 협업 대기 목록에서 리마인드가 필요한 항목을 확인한다.
6. 다음 주에 실제로 밀 프로젝트 1-3개만 `PROJECT_DASHBOARD.md` 상단에 적는다.
