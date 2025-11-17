// 페이지 초기화 및 라우팅
function init() {
    // 인증 확인
    const token = checkAuth();
    
    if (token) {
        // 토큰이 있으면 공지문 페이지로 이동
        window.location.href = 'notice.html';
    } else {
        // 토큰이 없으면 로그인 페이지로 이동
        window.location.href = 'login.html';
    }
}

