# 페이지 구성

## 유저 접근 경로

1. **앱 공지사항** - URL parameter로 인증 정보 전달
2. **문자메시지 링크** - URL parameter로 인증 정보 전달
3. **랜딩 페이지** - 휴대폰 인증을 통해 로그인 (URL parameter 없음)

**1번과 2번의 URL 예시**: `?token=a1b2c3d4e5f6...` (토큰은 서버에서 발급해주는 access token임)

## 페이지 구성: 단계별 페이지 분리

**파일 구조**:
```
index.html (인증 체크 & 라우팅)
login.html (휴대폰 인증 로그인)
notice.html (공지문 표시, 주소 입력, 출금)
withdrawal.html (보증금 출금)
form.html (최종 정보 전송)
css/
  └── style.css
js/
  ├── shared.js (공통 함수 - API 호출, 인증, 유틸리티)
  ├── index.js (index.html용)
  ├── login.js (login.html용)
  ├── notice.js (notice.html용)
  ├── withdrawal.js (withdrawal.html용)
  └── form.js (form.html용)
```

**페이지 흐름**:
```
index.html → login.html → notice.html → withdrawal.html → form.html
```

### 설계 원칙

- **페이지 분리**: 각 단계를 독립적인 HTML 파일로 분리하여 서로 간섭 없음
- **CSS**: 별도 파일로 분리 (`css/style.css`) - 모든 페이지에서 공통 사용
- **JavaScript - 공통**: `js/shared.js` - 모든 페이지에서 공통으로 사용하는 함수 (API 호출, 인증, 유틸리티)
- **JavaScript - 페이지별**: 각 페이지별로 독립적인 JS 파일 - 해당 페이지에서만 사용하는 데이터 로직
- **JavaScript - 인터렉션**: 각 HTML 파일에 인라인으로 작성 - 이벤트 핸들러, DOM 조작
- **상태 관리**: 페이지 간 데이터 전달은 URL 파라미터 또는 localStorage 사용

## 플로우

```
유저 접속 → 인증 확인 → (없으면) 휴대폰 인증 로그인 → 공지문 표시 → 주소 입력 → 보증금 1차 출금 → 잔여 금액 확인 → 정보 전송
```

## 구현 방식

- 각 단계를 독립적인 HTML 페이지로 분리
- 페이지 간 이동은 `window.location.href` 사용
- 인증 토큰은 localStorage에 저장하여 모든 페이지에서 공유
- 페이지 간 데이터 전달: URL 파라미터 또는 localStorage 사용

## JavaScript 함수 목록

### js/shared.js (공통 함수)
- `apiCall(endpoint, method, data, headers)` - 공통 API 호출
- `checkAuth()` - 인증 확인
- `getUrlParameter(name)` - URL 파라미터 추출
- `saveToken(token)`, `getToken()`, `removeToken()` - 토큰 관리
- `formatPhoneNumber(phone)`, `validatePhoneNumber(phone)`, `validateAddress(address)` - 유틸리티

### js/index.js
- `init()` - 인증 확인 및 라우팅

### js/login.js
- `sendVerificationCode(phone)` - 인증번호 발송
- `verifyCode(phone, code)` - 인증번호 확인

### js/notice.js
- `loadNotice()` - 공지문 조회
- `saveAddress(address)` - 주소 저장
- `processWithdrawal()` - 보증금 출금
- `checkRemainingAmount()` - 잔여 금액 확인

### js/withdrawal.js
- `processWithdrawal()` - 보증금 출금
- `checkRemainingAmount()` - 잔여 금액 확인

### js/form.js
- `loadUserInfo()` - 유저 정보 조회
- `submitFinalInfo(userInfo)` - 최종 정보 전송
