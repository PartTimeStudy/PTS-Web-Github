// 주소 저장 (목데이터)
async function saveAddress(address) {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: '주소가 저장되었습니다.'
            });
        }, 500);
    });
}

