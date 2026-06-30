# FINAL_AUDIT

투고 또는 공유 직전에 코드/변수 검토, 원고 내용 검토, 인용/참고문헌 검토를 한 번에 닫는 최종 점검표다.

## 사용 원칙

- 먼저 코드/변수 검토를 끝낸다.
- 다음으로 원고 내용 검토를 끝낸다.
- 마지막으로 인용/참고문헌 검토와 인용 논문 실재 확인을 끝낸다.
- `audit final --strict`가 막히면 투고 가능으로 표시하지 않는다.
- 자동 audit 결과와 사람이 확인한 판단을 모두 남긴다.

## 자동 점검 명령

```powershell
npx -y github:cameleonh/research-project-manager -- audit variables --target "."
npx -y github:cameleonh/research-project-manager -- audit content --target "."
npx -y github:cameleonh/research-project-manager -- audit citations --target "."
npx -y github:cameleonh/research-project-manager -- audit final --target "." --strict
```

## 최종 점검표

| 순서 | 영역 | 확인할 파일 | 자동 점검 | 사람 확인 | 상태 | 수정 필요 | 메모 |
|---|---|---|---|---|---|---|---|
| 1 | 코드/변수 검토 | `VARIABLE_AUDIT.md`, `04_analysis/`, `02_data_raw/`, `03_data_processed/` | `audit variables` | 실제 데이터 컬럼, 코드 변수명, 원고 변수명 일치 확인 | 확인 전 |  |  |
| 2 | 원고 내용 검토 | `06_manuscript/*.md`, `SUBMISSION_CHECKLIST.md` | `audit content` | 제목, 초록, 본문, 결과, 논의, 결론, 메타데이터 확인 | 확인 전 |  |  |
| 3 | 인용/참고문헌 검토 | `CITATION_AUDIT.md`, 참고문헌 목록 | `audit citations` | 본문 인용-참고문헌 목록 일치 및 실재 확인 | 확인 전 |  |  |
| 4 | 최종 통합 판정 | `FINAL_AUDIT.md` | `audit final --strict` | 남은 blocker가 투고를 막는지 판단 | 확인 전 |  |  |

## 최종 판정 상태값

- 확인 전
- 통과
- 문제 있음
- 수정 필요
- 미통과
- 제외

## 최종 판정

- 상태: 확인 전 / 통과 / 문제 있음 / 수정 필요 / 미통과
- 판정일: YYYY-MM-DD
- 투고 또는 공유 가능 여부:
- 남은 blocker:
- 다음 행동:
