# FOLDER_GUIDE

## 기본 원칙
- 이 프로젝트의 원본 파일은 이 폴더 안에 둔다.
- 바탕화면, 다운로드 폴더, 이메일 첨부파일에서 직접 작업하지 않는다.
- 쉬고 돌아왔을 때는 `START_HERE.md`부터 연다.
- 지금 단계에서 어떤 파일을 읽을지 헷갈리면 `README.md`의 `단계별 읽기 순서`를 따른다.
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

### `VARIABLE_AUDIT.md`
실제 데이터 컬럼, 코드에서 사용한 변수명, 원고/개념상 변수, 측정 내용, 변환/코딩, 검증 상태를 대조하는 코드/변수 리뷰 표.

코드가 `04_analysis/`에 정리되어 있어도 변수 사용이 맞다는 뜻은 아니다. 주요 결과를 원고에 쓰기 전에 이 파일에서 핵심 변수의 `검증 상태`를 확인한다.

### `05_figures`
그림, 표, 시각화 결과.

### `06_manuscript`
논문 원고 초안. 원고가 길어지면 장별 Markdown 파일로 나누어 쓴다.

권장 구조:

- `research_plan_bullet.md`: 연구 설계, 변수, 데이터, 분석 순서, 아직 원고 문장이 아닌 메모
- `00_paper_outline.md`: 논문 전체 논리, 핵심 주장, 장별 역할
- `Index.md`: Longform 장면 순서
- `Abstract.md`: 초록
- `Introduction.md`: 서론
- `Theory.md`: 이론적 배경과 선행연구
- `Conceptual Frameworks.md`: 연구모형과 변수 정의
- `Methods.md`: 자료, 변수 측정, 분석전략
- `Result.md`: 분석결과
- `Discussion.md`: 함의, 해석, 정책적 시사점
- `Conclusion.md`: 결론
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
