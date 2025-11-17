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


