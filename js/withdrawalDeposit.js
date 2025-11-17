// 보증금 출금 (목데이터)
async function processDepositWithdrawal() {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true
            });
        }, 500);
    });
}

