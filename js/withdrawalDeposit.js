// 보증금 출금
async function processDepositWithdrawal() {
    try {
        const response = await apiCall('/api/v1/deposit/withdrawal/all', 'POST');
        
        // API 응답 형식 확인
        if (response.result === 'SUCCESS') {
            return {
                success: true,
                data: response.data
            };
        } else {
            // 실패해도 에러를 던지지 않고 반환
            return {
                success: false,
                error: response.error?.message || '보증금 출금에 실패했습니다.'
            };
        }
    } catch (error) {
        // 에러가 발생해도 그냥 반환
        return {
            success: false,
            error: error.message || '보증금 출금 처리 중 오류가 발생했습니다.'
        };
    }
}

