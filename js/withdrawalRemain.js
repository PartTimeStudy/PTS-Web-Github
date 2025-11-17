// 최종 정보 전송 (목데이터)
async function submitFinalInfo(userInfo) {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: '정보가 전송되었습니다.'
            });
        }, 500);
    });
}

