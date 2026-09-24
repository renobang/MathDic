# MathDic mobile

Capacitor 8 기반의 iOS·Android 학생용 앱입니다. 앱 ID 초안은 `com.bangacademy.mathdic`, 이름은 MathDic입니다. App Store Connect 등록 전에 앱 ID와 배포 계정 소유자를 확정하세요.

## 구현된 기능

- 433개 용어/예제, 10개 언어의 번역 자료와 수식 라이브러리를 앱에 포함합니다. 첫 실행부터 인터넷 없이 검색·북마크·퀴즈를 사용할 수 있습니다.
- iOS UserDefaults / Android SharedPreferences로 학습 설정과 북마크를 저장합니다.
- 시스템 공유, 퀴즈 햅틱, Android 뒤로가기, 하단 탐색, 안전 영역을 지원합니다.
- 관리자 웹 화면·인증·편집 코드는 모바일 번들에 포함하지 않습니다.
- 앱 안에 개인정보 안내를 제공합니다. 앱 아이콘과 iOS PrivacyInfo.xcprivacy를 구성했습니다.

## 개발

`npm ci` 후 `npm run mobile:sync`로 콘텐츠를 빌드하고 두 프로젝트에 복사합니다.

- `npm run mobile:ios`: Xcode 프로젝트 열기
- `npm run mobile:android`: Android Studio 프로젝트 열기
- iOS 프로젝트: `ios/App/App.xcodeproj`
- Android 프로젝트: `android/`
- 웹 배포는 기존 `npm run deploy:dev`를 사용합니다. 모바일 빌드는 웹 배포를 수행하지 않습니다.

모바일 콘텐츠는 `content/original-examples.tsv`에서 빌드한 스냅샷입니다. 웹 관리자가 D1에 저장한 수정은 아직 모바일로 자동 동기화되지 않습니다. 스토어 출시 전 승인된 공통 콘텐츠를 원본에 반영하고 다시 빌드해야 합니다. 개발 서버를 원격 WebView 주소로 연결하지 않습니다.

## 제출 전 남은 작업

1. 실제 iPhone·Android에서 첫 실행 오프라인, 저장 후 재실행, 음성, 공유, 키보드, 화면 회전, VoiceOver/TalkBack 검사.
2. 번역 OCR 검수와 배포할 원본 번역 이미지의 이용 권한 확인.
3. Apple Developer/Google Play Console 계정에서 앱 ID, 서명 팀/키, 배포 소유자 확정. 서명키는 소스 저장소에 넣지 않습니다.
4. 공개 개인정보처리방침 URL·지원 URL, 스토어 설명, 실기기 스크린샷, 연령 등급과 개인정보 설문 작성. 앱 내 정책은 준비되어 있으나 공개 지원 사이트는 별도 준비가 필요합니다.
5. iOS Release archive → TestFlight, Android 서명 AAB → 내부 테스트. 테스트 피드백 반영 후 심사 제출.

현재 빌드는 개발 검증용이며 스토어에 게시하거나 계정에 앱을 등록하지 않습니다. 스토어 승인은 각 스토어 심사 결과에 따릅니다.

공식 참고: https://capacitorjs.com/docs/getting-started/environment-setup · https://developer.apple.com/app-store/review/guidelines/

## 2026-09-24 빌드 결과

- Xcode 26.6: iOS 시뮬레이터 Debug 빌드 성공 (`CODE_SIGNING_ALLOWED=NO`).
- Android API 36: Debug APK 빌드 성공.
- 모바일 패키징 검사, 433개 콘텐츠/수식 검사, 오프라인 캐시 검사, 관리자 인증·저장 검사를 통과했습니다.
- `artifacts/MathDic-1.0-android-debug.apk`: Android 테스트 설치용.
- `artifacts/MathDic-1.0-ios-simulator.zip`: iOS 시뮬레이터용 App.app. 실제 iPhone 설치용 IPA가 아닙니다.
- 두 산출물에 최종 JS 번들·개인정보 화면이 들어 있는지 대조했고, iOS 개인정보 manifest 포함을 확인했습니다.
- 실제 기기 실행·음성/공유 동작과 스토어용 Release 서명은 아직 검증하지 않았습니다.
