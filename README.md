# MathDic

미국에서 공부하는 다국어 학생을 위한 정적 PWA. 433개 수학 용어, 10개 언어, 직접 작성한 영어 설명과 편집 가능한 LaTeX 예제를 제공합니다.

## 개발 환경

- 개발: https://dev.mathdic.bang-academy.com
- 개발 보조 주소: https://mathdic-development.renobang.workers.dev
- 운영 예정: https://mathdic.bang-academy.com (아직 배포하지 않음)
- 개발 Worker: `mathdic-development`; 운영 Worker: `mathdic-production`

Node.js 22 이상에서 `npm ci` 후 `npm run dev`로 localhost:4173을 실행합니다. Cloudflare 실행 환경은 `npm run dev:cloudflare`입니다. 학생 UI는 정적 파일이며, 관리자 인증과 공통 예제 저장은 Worker와 D1을 사용합니다. Wrangler 로그인은 `npx wrangler login`을 사용하며 자격 증명은 소스에 저장하지 않습니다.

## 수정과 배포

1. 화면: `public/app.js`, `public/style.css`, `public/index.html`을 수정합니다.
2. 공통 예제: `content/original-examples.tsv`를 수정합니다. 확장자는 TSV지만 구분자는 `|`이며, 한 줄은 용어·영어 정의·문제·LaTeX·해설의 5개 필드입니다. 수식의 절댓값은 `\lvert`와 `\rvert`를 사용합니다.
3. `npm run deploy:dev`는 콘텐츠 생성 → 개발 빌드 → 문법/433개 예제/수식/자산/오프라인 검사 → 개발 서버 배포 순서로 실행합니다.
4. 개발 주소에서 확인합니다. 새 빌드는 서비스 워커 버전으로 갱신됩니다.
5. 운영 공개 시에만 `npm run deploy:production`을 실행합니다. 기본 `npm run deploy`는 개발 환경에만 배포합니다.

`dist/`만 업로드됩니다. 원본 PDF, 스캔 예제, `content/source-reference/`, 로컬 설정은 배포하지 않습니다. 개발 환경은 검색 엔진 제외 헤더와 robots.txt가 적용된 공개 테스트 사이트입니다. 비공개 인증 환경은 아닙니다.

## 콘텐츠와 검수

학생은 제공된 예제를 읽고 학습합니다. 학생 화면에는 편집·LaTeX 복사가 없습니다. 관리자는 `/admin/`에서 이메일 인증 후 문제·수식·해설을 수정하고 LaTeX를 복사합니다. 승인된 계정은 `renobang@gmail.com`입니다. 공통 예제 저장은 개발 환경의 D1에 반영되고 재배포해도 유지됩니다.

서버가 Access JWT의 서명·발급자·대상 앱·만료·이메일을 검증합니다. 관리자 경로와 API는 인증이 없거나 다른 호스트로 요청하면 거부하며 서비스 워커에 캐싱하지 않습니다. 수정 이력은 example_history에 저장되고, 충돌은 409로 거절합니다. 수정된 예제는 기존 도형과 불일치할 수 있어 자동으로 원래 도형을 숨깁니다. 학생이 새로고침하면 최신 공통 예제를 받고, 오프라인에서는 마지막으로 받아 둔 예제를 사용합니다.

로컬 통합 개발에는 `npm run dev:cloudflare`를 사용합니다. 로컬 인증 우회는 제공하지 않습니다. 운영 관리자 인증과 D1은 개발 환경과 별도로 설정해야 하며 아직 연결하지 않았습니다.

433개 영어 예제와 설명을 새로 작성했고 수식 구문 검사를 통과했습니다. 번역 용어는 기존 자료와 OCR을 기반으로 하며 언어별 사람의 검수가 남아 있습니다. 크메르어 용어는 이미지로 표시하며 영어 검색을 지원합니다. 현재 한국어 설명은 일부 용어에만 제공됩니다.

## 검증

`npm run content && npm run build:dev && npm run verify`

오프라인 검사는 서비스 워커와 CacheStorage 모형으로 앱/데이터/수식/번역 이미지 캐싱을 확인합니다. 실제 기기의 비행기 모드 검증을 대체하지 않습니다.

## 모바일 앱

iOS·Android 프로젝트와 개발 절차는 [MOBILE.md](MOBILE.md)를 참고하세요. `npm run mobile:sync`로 앱에 오프라인 콘텐츠를 포함합니다.
