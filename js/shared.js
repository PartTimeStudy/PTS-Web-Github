// 버전 정보
const APP_VERSION = '1.0.2';
const BUILD_DATE = '2025-01-14';

// API 기본 URL (파일 실행 vs 웹 URL 접속 구분)
const API_BASE_URL = (() => {
    // 파일로 실행할 때 (file://)
    if (window.location.protocol === 'file:') {
        return 'http://studywork-macmini:8080';
    }
    // 웹 URL로 접속할 때
    return 'https://dev-api.partimestudy.com';
})();

// 공통 API 호출 함수
async function apiCall(endpoint, method = 'GET', data = null, headers = {}) {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        // 토큰이 있으면 헤더에 추가
        const token = getToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        // 응답 본문 파싱
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`서버 응답 오류: ${text || response.statusText}`);
        }

        // HTTP 상태 코드가 200-299가 아니면 에러 처리
        if (!response.ok) {
            // API 응답 형식이 있는 경우 그대로 반환 (에러 처리 로직에서 처리)
            if (result && result.result === 'ERROR') {
                return result;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// API 에러 처리
function handleApiError(error) {
    console.error('API Error:', error);
    // 필요시 에러 메시지 표시 로직 추가
}

// 인증 확인
function checkAuth() {
    // URL 파라미터에서 토큰 확인
    const urlToken = getUrlParameter('token');
    if (urlToken) {
        saveToken(urlToken);
        return urlToken;
    }

    // localStorage에서 토큰 확인
    const storedToken = getToken();
    return storedToken;
}

// URL 파라미터에서 값 추출
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 토큰 저장
function saveToken(token) {
    if (token) {
        localStorage.setItem('auth_token', token);
    }
}

// 토큰 조회
function getToken() {
    return localStorage.getItem('auth_token');
}

// 토큰 삭제
function removeToken() {
    localStorage.removeItem('auth_token');
}

// 전화번호 포맷팅
function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

// 유저 정보 조회
async function getUserInfo() {
    try {
        const response = await apiCall('/api/v1/user', 'GET');

        // API 응답 형식 확인
        if (response.result === 'SUCCESS') {
            return response.data;
        } else if (response.result === 'ERROR') {
            throw new Error(response.error?.message || '유저 정보 조회에 실패했습니다.');
        } else {
            throw new Error('알 수 없는 응답 형식입니다.');
        }
    } catch (error) {
        // HTTP 에러 처리
        if (error.message.includes('HTTP error')) {
            throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
    }
}

