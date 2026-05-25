# FOLDER_GUIDE

## 기본 원칙
- 이 프로젝트의 원본 파일은 이 폴더 안에 둔다.
- 바탕화면, 다운로드 폴더, 이메일 첨부파일에서 직접 작업하지 않는다.
- 쉬고 돌아왔을 때는 `START_HERE.md`부터 연다.
- 논문의 전체 진행 단계는 `WBS.md`에서만 관리한다.

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
원고, 발표 슬라이드 초안, 보고서 초안.

### `07_outputs`
제출본, 공유본, 최종 산출물.

### `99_archive`
지금은 쓰지 않지만 버리기 애매한 파일.

## 권장 파일명
- `manuscript_YYYY-MM-DD.docx`
- `figure2_qc_v03.png`
- `analysis_deseq2_YYYY-MM-DD.R`
- `meeting_YYYY-MM-DD.md`
