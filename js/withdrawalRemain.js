// 최종 정보 전송
async function submitFinalInfo(userInfo) {
    try {
        const response = await apiCall('/form', 'POST', userInfo);
        return response;
    } catch (error) {
        console.error('정보 전송 실패:', error);
        throw error;
    }
}

