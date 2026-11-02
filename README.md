# GPU 자원 예약 시스템 프로젝트 소개 사이트

연구실 GPU 서버 자원 예약 및 실시간 모니터링 시스템의 GitHub Pages 문서 사이트입니다.

**사이트:** https://2026-2-web-programming-term-project.github.io/

## 내용

- 프로젝트 범위, 일반 사용자·관리자 흐름과 서비스 정책
- UI 설계서의 18개 화면 탐색·확대와 모바일 표현
- Front → Gateway → API 및 AWS HA 목표 아키텍처
- Infrastructure Composer·CloudFormation·EC2 Auto Scaling 설계 방향
- 단계별 제출 일정과 [WBS 초안](docs/WBS.md)
- 서비스 저장소, 현재 기술 설정과 공식 참고 문서

UI 화면의 데이터는 예시입니다. 인프라·HA는 설계 목표이며 AWS 배포와 처리 성능을 검증한 상태가 아닙니다. 실제 Spring 서비스와 소개 사이트는 별도 배포 대상입니다.

## 파일 구성

```text
index.html       문서와 레이아웃
styles.css       반응형 스타일
app.js           UI 화면 탐색·확대·목차 표시
assets/ui/       UI 설계서 원본 와이어프레임
docs/WBS.md      작업 계획
.nojekyll        정적 파일 게시
```

추가 패키지나 빌드 과정 없이 GitHub Pages에서 정적 파일을 게시합니다. 배포 원본은 `main` 브랜치의 루트입니다.

## 로컬 확인

저장소 루트에서 정적 HTTP 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다. 사이트에는 로그인·예약 저장·실제 GPU 상태 조회 기능이 없으며 프로젝트 문서와 설계 화면만 제공합니다.

## 검증

Node.js 표준 라이브러리로 JavaScript 문법, 내부 링크·에셋, 18개 설계 화면과 제출 마감을 확인합니다.

```bash
node scripts/check-site.mjs
```

[프로젝트 공통 README](https://github.com/2026-2-web-programming-term-project/.github#readme) · [오거니제이션](https://github.com/2026-2-web-programming-term-project)
