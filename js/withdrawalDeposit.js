// 보증금 출금
async function processDepositWithdrawal() {
    try {
        const response = await apiCall('/withdrawal/deposit', 'POST', {});
        return response;
    } catch (error) {
        console.error('보증금 출금 처리 실패:', error);
        throw error;
    }
}

