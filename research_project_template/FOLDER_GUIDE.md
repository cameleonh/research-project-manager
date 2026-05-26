# FOLDER_GUIDE

## 기본 원칙
- 이 프로젝트의 원본 파일은 이 폴더 안에 둔다.
- 바탕화면, 다운로드 폴더, 이메일 첨부파일에서 직접 작업하지 않는다.
- 쉬고 돌아왔을 때는 `START_HERE.md`부터 연다.
- 논문의 전체 진행 단계는 `WBS.md`에서만 관리한다.
- 투고 직전에는 `SUBMISSION_CHECKLIST.md`로 원고, 결과, 투고 패키지를 점검한다.
- 이번 논문에 넣지 않을 아이디어는 `PARKING_LOT.md`에 두고 원고 범위를 넓히지 않는다.

## 폴더 설명

### `00_admin`
계약, IRB, 회의록, 일정, 제출 정보, 행정 문서.

### `01_literature`
논문 PDF, 논문 메모, 참고문헌 export 파일.

### `02_data_raw`
원자료. 가능하면 직접 수정하지 않는다.

### `03_data_processed`
전처리된 데이터, 분석에 투입할 데이터.

### `04_analysis`
분석 코드, 노트북, 스크립트, 통계 결과.

### `05_figures`
그림, 표, 시각화 결과.

### `06_manuscript`
논문 원고 초안. 원고가 길어지면 장별 Markdown 파일로 나누어 쓴다.

권장 구조:

- `research_plan_bullet.md`: 연구 설계, 변수, 데이터, 분석 순서, 아직 원고 문장이 아닌 메모
- `00_paper_outline.md`: 논문 전체 논리, 핵심 주장, 장별 역할
- `01_introduction.md`: 서론
- `02_literature_review.md`: 선행연구
- `03_data.md`: 자료와 변수
- `04_method.md`: 분석방법
- `05_results.md`: 분석결과
- `06_discussion.md`: 함의, 해석, 정책적 시사점
- `07_conclusion.md`: 결론
- `manuscript_full.md`: 최종 제출 또는 공유 직전 최종 조립본

평소에는 `manuscript_full.md`를 원천 파일로 쓰지 않는다. 실제 집필과 수정은 장별 파일에서 한다.

### `07_outputs`
제출본, 공유본, 최종 산출물.

### `99_archive`
지금은 쓰지 않지만 버리기 애매한 파일.

## 권장 파일명
- `manuscript_YYYY-MM-DD.docx`
- `figure2_qc_v03.png`
- `analysis_deseq2_YYYY-MM-DD.R`
- `meeting_YYYY-MM-DD.md`
